import { asyncHandler } from "../utils/asynchandler.js";
import { Admin } from "../models/admin.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
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
    const aadharlocalpath = req.files?.aadhar?.[0]?.path;
    const adminIdlocalpath = req.files?.adminId?.[0]?.path;
    const profilepicturelocalpath = req.files?.profilepicture?.[0]?.path;
    const appointmentletterlocalpath = req.files?.appointmentletter?.[0]?.path;
    if (
        !aadharlocalpath ||
        !adminIdlocalpath ||
        !profilepicturelocalpath ||
        !appointmentletterlocalpath
    ) {
        throw new apiError(400, "All files are required");
    }

    const aadhar = await uploadcloudinary(aadharlocalpath)
    const adminId = await uploadcloudinary(adminIdlocalpath)
    const profilepicture = await uploadcloudinary(profilepicturelocalpath)
    const appointmentletter = await uploadcloudinary(appointmentletterlocalpath)

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
            aadhar: aadhar.url,
            adminId: adminId.url,
            profilepicture: profilepicture.url,
            appointmentletter: appointmentletter.url
        },
        adminsecret,
    })

    if (!admin) {
        throw new apiError(500, "Admin registration failed")
    }

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshtoken, -adminsecret")
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
    const options = {
        httpOnly: true,
        secure: true
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
    }
    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new apiResponse(200, {}, "Admin logged out successfully"))
})

export { registeradmin, loginadmin, logoutadmin } 