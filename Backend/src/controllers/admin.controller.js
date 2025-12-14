import { asyncHandler } from "../utils/asynchandler.js";
import { Admin } from "../models/admin.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import sendMail from "../services/mail.js";
import { welcomeemailtemplate, logintemplate } from "../utils/emailtemplate.js";
import jwt from "jsonwebtoken";

const generateaccesstokenandrefreshtoken = async (adminid) => {
    try {
        const admin = await Admin.findById(adminid)
        const accesstoken = await admin.generateaccesstoken()
        const refreshtoken = await admin.generaterefreshtoken()
        if (!accesstoken || !refreshtoken) {
            throw new apiError(500, "Token generation failed")
        }
        admin.refreshtoken = refreshtoken
        await admin.save({ validateBeforeSave: false })
        return { accesstoken, refreshtoken }
    } catch (error) {
        throw new apiError(500, "Token generation failed")
    }
}

const registeradmin = asyncHandler(async (req, res) => {
    const { adminname, adminusername, email, password, phonenumber, adminsecret } = req.body
    if ([adminname, adminusername, email, password, phonenumber, adminsecret].some((field) => !field || field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }
    if (!adminsecret) {
        throw new apiError(400, "Admin secret is required")
    }
    const existedadmin = await Admin.findOne({
        $or: [{ adminusername }, { email }]
    })
    if (existedadmin) {
        throw new apiError(409, "Admin with same email or username already exists")
    }
    if (adminsecret !== process.env.ADMIN_SECRET) {
        throw new apiError(401, "Invalid admin secret")
    }
    const aadharlocalpath = req.files?.aadhar?.[0]?.buffer;
    const adminIdlocalpath = req.files?.adminId?.[0]?.buffer;
    const profilepicturelocalpath = req.files?.profilepicture?.[0]?.buffer;
    const appointmentletterlocalpath = req.files?.appointmentletter?.[0]?.buffer;
    if (
        !aadharlocalpath ||
        !adminIdlocalpath ||
        !profilepicturelocalpath ||
        !appointmentletterlocalpath
    ) {
        throw new apiError(400, "All files are required");
    }

    const aadhar = await uploadcloudinary(aadharlocalpath,"admin/aadhar")
    const adminId = await uploadcloudinary(adminIdlocalpath,"admin/admin-id")
    const profilepicture = await uploadcloudinary(profilepicturelocalpath,"admin/profile-picture")
    const appointmentletter = await uploadcloudinary(appointmentletterlocalpath,"admin/appointment-letter")

    if (!aadhar || !adminId || !profilepicture || !appointmentletter) {
        throw new apiError(500, "File upload failed")
    }
    const admin = await Admin.create({
        adminname,
        adminusername,
        email,
        password,
        phonenumber,
        verificationdocs: {
            aadhar: aadhar.secure_url,
            adminId: adminId.secure_url,
            profilepicture: profilepicture.secure_url,
            appointmentletter: appointmentletter.secure_url
        },
        adminsecret,
    })

    if (!admin) {
        throw new apiError(500, "Admin registration failed")
    }

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshtoken, -adminsecret")

    await sendMail({
        to: email,
        subject: `Welcome to NovaMed, ${createdAdmin.adminname}! Your Registration is Successful`,
        html: welcomeemailtemplate(createdAdmin.adminname),
    })

    return res
        .status(201)
        .json(
            new apiResponse(201, createdAdmin, "Admin registered successfully")
        );

})

const loginadmin = asyncHandler(async (req, res) => {
    const { adminusername, email, password, adminsecret } = req.body
    if (!adminusername && !email) {
        throw new apiError(400, "Admin username or email is required")
    }
    if (!password) {
        throw new apiError(400, "Password is required")
    }
    if (!adminsecret) {
        throw new apiError(400, "Admin verification code is required")
    }
    const existedadmin = await Admin.findOne({
        $or: [{ adminusername }, { email }]
    })
    if (!existedadmin) {
        throw new apiError(404, "Admin not found")
    }
    const ispasswordvalid = await existedadmin.ispasswordcorrect(password)
    if (!ispasswordvalid) {
        throw new new apiError(500, "password is not valid")
    }

    const isadminsecretvalid = await existedadmin.isadminsecretcorrect(adminsecret)
    if (!isadminsecretvalid) {
        throw new apiError(401, "Admin verification code is not valid")
    }
    const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(existedadmin._id)

    const loggedinadmin = await Admin.findById(existedadmin._id).select("-password -refreshtoken -adminsecret")
    if (!loggedinadmin) {
        throw new apiError(500, "Admin login failed")
    }
    await sendMail({
        to: email,
        subject: `Login Alert – NovaMed Account Accessed Successfully`,
        html: logintemplate(loggedinadmin.adminname),
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    }
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new apiResponse(200, { user: loggedinadmin, accesstoken, refreshtoken }, "Admin logged in successfully"))


})
const logoutadmin = asyncHandler(async (req, res, next) => {
    await Admin.findByIdAndUpdate(req.admin?._id, { $unset: { refreshtoken: 1 } }, { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"

    }
    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new apiResponse(200, {}, "Admin logged out successfully"))
})

const accesstokenrenewal = asyncHandler(async (req, res) => {
    const { refreshtoken } = req.cookies || req.body;

    if (!refreshtoken) {
        throw new apiError(401, "Unauthorized request");
    }
    const decodetoken = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    if (!decodetoken) {
        throw new apiError(401, "invalid refresh token");
    }
    const admin = await Admin.findById(decodetoken._id);
    if (!admin) {
        throw new apiError(404, "Patient not found");
    }
    if (admin.refreshtoken !== refreshtoken) {
        throw new apiError(401, "Invalid refresh token or token is expired");
    }
    const { accesstoken, newrefreshtoken } = await generateaccesstokenandrefreshtoken(admin._id);


    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    }
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", newrefreshtoken, options)
        .json(new apiResponse(200, { accesstoken, refreshtoken: newrefreshtoken }, "Access token renewed successfully"));

})

const updatepassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
        throw new apiError(400, "Old password and new password are required");
    }
    if (oldpassword === newpassword) {
        throw new apiError(400, "New password cannot be the same as old password");
    }
    const admin = await Admin.findById(req.admin?._id);
    if (!admin) throw new apiError(404, "Admin not found");

    const ispasswordvalid = await admin.ispasswordcorrect(oldpassword);
    if (!ispasswordvalid) {
        throw new apiError(401, "Old password is incorrect");
    }
    admin.password = newpassword;
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password updated successfully"));
})

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { newpassword } = req.body;
    if (!newpassword) throw new apiError(400, "New password is required");

    const admin = await Admin.findById(req.user?._id);
    if (!admin) throw new apiError(404, "Admin not found");

    admin.password = newpassword;
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password reset successfully"));
});

const updateprofile = asyncHandler(async (req, res) => {
    const { adminname, email, phonenumber } = req.body;

    const updates = {};
    if (adminname) updates.adminname = adminname;
    if (email) updates.email = email;
    if (phonenumber) updates.phonenumber = phonenumber;

    if (Object.keys(updates).length === 0) {
        throw new apiError(400, "At least one field is required to update");
    }

    const updatedadmin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        { $set: updates },
        { new: true }
    ).select("-password -refreshtoken -adminsecret");

    if (!updatedadmin) {
        throw new apiError(404, "Admin not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedadmin, "Profile updated successfully"));
});

const getprofiledetails = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin?._id).select(" -password -refreshtoken -adminsecret")
    if (!admin) throw new apiError(404, "Admin not found");

    return res.status(200)
        .json(new apiResponse(200, admin, "profile fetched successfully"))
})

const updateprofilepic = asyncHandler(async (req, res) => {
    const profilepicturelocalpath = req.file?.buffer
    if (!profilepicturelocalpath) {
        throw new apiError(400, "profilepicture not found ")
    }
    const profilepicture = await uploadcloudinary(profilepicturelocalpath,"admin/profile-picture")
    if (!profilepicture) {
        throw new apiError(400, "profilepicture upload failed to server")
    }
    const updatedadmin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $set: {
                profilepicture: profilepicture.url
            }
        },
        {
            new: true
        }).select("-password -refreshtoken -adminsecret")

    if (!updatedadmin) {
        throw new apiError(404, "Admin not found")
    }

    res.status(200)
        .json(new apiResponse(200, updatedadmin, "profilepicture updated successfully"))
})

const getCurrentAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin?._id).select("-password -refreshtoken -adminsecret");
    if (!admin) {
        throw new apiError(404, "Admin not found");
    }
    return res.status(200).json(new apiResponse(200, admin, "Current admin fetched successfully"));
});
export { registeradmin, loginadmin, logoutadmin, updateprofile, updatepassword, resetForgottenPassword, getprofiledetails, accesstokenrenewal, updateprofilepic, getCurrentAdmin }; 