import { Patient } from '../models/patient.model.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadcloudinary } from '../utils/cloudinary.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import sendMail from '../services/mail.js';
import { welcomeemailtemplate, logintemplate } from '../utils/emailtemplate.js';

const generateaccesstokenandrefreshtoken = async (patientId) => {
    try {
        const patient = await Patient.findById(patientId);
        const accesstoken = await patient.generateaccesstoken();
        const refreshtoken = await patient.generaterefreshtoken();

        if (!accesstoken) {
            throw new apiError(500, "Access token generation failed");
        }

        if (!refreshtoken) {
            throw new apiError(500, "Refresh token generation failed");
        }

        patient.refreshtoken = refreshtoken;
        await patient.save({ validateBeforeSave: false });

        return { accesstoken, refreshtoken };

    } catch (error) {
        console.error("Token generation failed:", error);
        throw error;
    }
};

const registerPatient = asyncHandler(async (req, res) => {
    const { patientname, patientusername, email, password, phonenumber, age, sex, guardianName } = req.body

    if (
        [patientname, patientusername, email, phonenumber, age, sex, password, guardianName].some((field) => !field || field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }
    const existedpatient = await Patient.findOne({
        $or: [{ patientusername }, { email }]
    })
    if (existedpatient) {
        throw new apiError(409, "patient with same email or username already exist")
    }
    let profilepicture;

    if (req.file?.path) {
        const profilepicturelocalpath = req.file.path;
        profilepicture = await uploadcloudinary(profilepicturelocalpath);
    }
    const patient = await Patient.create({
        patientname,
        patientusername,
        email,
        password,
        phonenumber,
        age,
        sex,
        guardianName,
        profilepicture: profilepicture?.url || ""
    })

    if (!patient) {
        throw new apiError(500, "Patient registration failed")
    }

    const createdpatient = await Patient.findById(patient._id).select("-password -refreshtoken")
    await sendMail({
        to: email,
        subject: `Welcome to NovaMed, ${createdpatient.patientname}! Your Registration is Successful`,
        html: welcomeemailtemplate(createdpatient.patientname),
    });
    return res.status(201).json(
        new apiResponse(200, createdpatient, "patient registered Successfully")
    )

})

const loginPatient = asyncHandler(async (req, res) => {
    const { email, patientusername, password } = req.body
    if (!patientusername && !email) {
        throw new apiError(400, "Email or Username is required")
    }
    if (!password) {
        throw new apiError(400, "Password is required")
    }
    const existedpatient = await Patient.findOne({
        $or: [{ patientusername }, { email }]
    })
    if (!existedpatient) {
        throw new apiError(404, "Patient not found")
    }
    const ispassword = await existedpatient.ispasswordcorrect(password)
    if (!ispassword) {
        throw new apiError(401, "Invalid password")
    }
    const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(existedpatient._id)
    const loggedinpatient = await Patient.findById(existedpatient._id).select("-password -refreshtoken")

    await sendMail({
        to: email,
        subject: `Login Alert – NovaMed Account Accessed Successfully`,
        html: logintemplate(loggedinpatient.patientname),
    });

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedinpatient, accesstoken, refreshtoken
                },
                "User logged In Successfully"
            )
        )
})

const logoutPatient = asyncHandler(async (req, res) => {
    await Patient.findByIdAndUpdate(
        req.patient._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new apiResponse(200, {}, "User logged Out"))
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
    const patient = await Patient.findById(decodetoken._id);
    if (!patient) {
        throw new apiError(404, "Patient not found");
    }
    if (patient.refreshtoken !== refreshtoken) {
        throw new apiError(401, "Invalid refresh token or token is expired");
    }
    const { accesstoken, newrefreshtoken } = await generateaccesstokenandrefreshtoken(patient._id);


    const options = {
        httpOnly: true,
        secure: true
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
    const patient = await Patient.findById(req.patient?._id);
    if (!patient) {
        throw new apiError(404, "patient not found")
    }
    const ispasswordvalid = await patient.ispasswordcorrect(oldpassword);
    if (!ispasswordvalid) {
        throw new apiError(401, "Old password is incorrect");
    }
    patient.password = newpassword;
    await patient.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password updated successfully"));
})

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { newpassword } = req.body;
    if (!newpassword) throw new apiError(400, "New password is required");

    const patient = await Patient.findById(req.user?._id);
    if (!patient) throw new apiError(404, "Patient not found");

    patient.password = newpassword;
    await patient.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password reset successfully"));
});

const updateprofile = asyncHandler(async (req, res) => {
    const { patientname, email, phonenumber, age, sex, guardianName } = req.body;

    const updates = {};
    if (patientname) updates.patientname = patientname;
    if (email) updates.email = email;
    if (phonenumber) updates.phonenumber = phonenumber;
    if (age) updates.age = age;
    if (sex) updates.sex = sex;
    if (guardianName) updates.guardianName = guardianName;

    if (Object.keys(updates).length === 0) {
        throw new apiError(400, "At least one field is required to update");
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
        req.patient._id,
        { $set: updates },
        { new: true }
    ).select("-password ");

    if (!updatedPatient) {
        throw new apiError(404, "Patient not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedPatient, "Profile updated successfully"));
});

const getprofiledetails = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.patient?._id).select("-password")
    if (!patient) {
        throw new apiError(404, "patient not found")
    }
    return res.status(200)
        .json(new apiResponse(200, patient, "profile fetched successfully"))
})

const updateprofilepic = asyncHandler(async (req, res) => {
    const profilepicturelocalpath = req.file?.path
    if (!profilepicturelocalpath) {
        throw new apiError(400, "profilepicture not found ")
    }
    const profilepicture = await uploadcloudinary(profilepicturelocalpath)
    if (!profilepicture) {
        throw new apiError(400, "profilepicture upload failed to server")
    }
    const updatedpatient = await Patient.findByIdAndUpdate(
        req.patient?._id,
        {
            $set: {
                profilepicture: profilepicture.url
            }
        },
        {
            new: true
        }).select("-password")
    if (!updatedpatient) {
        throw new apiError(404, "Patient not dound")
    }

    res.status(200)
        .json(new apiResponse(200, updatedpatient, "profilepicture updated successfully"))
})

export { registerPatient, loginPatient, logoutPatient, accesstokenrenewal, updatepassword, resetForgottenPassword, updateprofile, getprofiledetails, updateprofilepic };