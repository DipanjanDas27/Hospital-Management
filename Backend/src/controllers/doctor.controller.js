import { asyncHandler } from "../utils/asynchandler.js";
import { Doctor } from "../models/doctor.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import sendMail from "../services/mail.js";
import { welcomeemailtemplate, logintemplate } from "../utils/emailtemplate.js";

const generateaccesstokenandrefreshtoken = async (patientId) => {
    try {
        const doctor = await Doctor.findById(patientId);
        const accesstoken = await doctor.generateaccesstoken();
        const refreshtoken = await doctor.generaterefreshtoken();

        if (!accesstoken) {
            throw new apiError(500, "Access token generation failed");
        }

        if (!refreshtoken) {
            throw new apiError(500, "Refresh token generation failed");
        }

        doctor.refreshtoken = refreshtoken;
        await doctor.save({ validateBeforeSave: false });

        return { accesstoken, refreshtoken };

    } catch (error) {
        console.error("Token generation failed:", error);
        throw error;
    }
};

const registerdoctor = asyncHandler(async (req, res) => {
    const { doctorname, doctorusername, email, password, phonenumber, sex, age, experience, qualification, department, specialization, shift } = req.body;

    if ([doctorname, doctorusername, email, password, phonenumber, sex, age, experience, qualification, department, specialization, shift].some((field) => !field || field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }
    const existeddoctor = await Doctor.findOne({
        $or: [{ doctorusername }, { email }]
    }
    )
    if (existeddoctor) {
        throw new apiError(409, "Doctor with same email or username already exists");
    }
    const aadharlocalpath = req.files?.aadhar?.[0]?.path;
    const medicaldegreelocalpath = req.files?.medicaldegree?.[0]?.path;
    const medicallicenselocalpath = req.files?.medicallicense?.[0]?.path;
    const profilepicturelocalpath = req.files?.profilepicture?.[0]?.path;

    if (!aadharlocalpath || !medicaldegreelocalpath || !medicallicenselocalpath || !profilepicturelocalpath) {
        throw new apiError(400, "All files are required");
    }
    const aadhar = await uploadcloudinary(aadharlocalpath);
    const medicaldegree = await uploadcloudinary(medicaldegreelocalpath);
    const medicallicense = await uploadcloudinary(medicallicenselocalpath);
    const profilepicture = await uploadcloudinary(profilepicturelocalpath);
    if (!aadhar || !medicaldegree || !medicallicense || !profilepicture) {
        throw new apiError(500, "File upload failed");
    }
    const shiftarray = JSON.parse(shift)
    if (!shiftarray) {
        throw new apiError(400, "Invalid format for 'shift'. Must be a valid JSON array.")
    }
    const doctor = await Doctor.create({
        doctorname,
        doctorusername,
        email,
        password,
        phonenumber,
        sex,
        age,
        verificationdocument: {
            aadhar: aadhar.url,
            medicaldegree: medicaldegree.url,
            medicallicense: medicallicense.url,
            profilepicture: profilepicture.url,
        },
        experience,
        qualification,
        department: department.toLowerCase(),
        specialization,
        shift: shiftarray
    });
    if (!doctor) {
        throw new apiError(500, "Doctor registration failed");
    }
    const createddoctor = await Doctor.findById(doctor._id).select("-password -refreshtoken");
    if (!createddoctor) {
        throw new apiError(500, "Doctor not found");
    }
    await sendMail({
        to: email,
        subject: `Welcome to NovaMed, ${createddoctor.doctorname}! Your Registration is Successful`,
        html: welcomeemailtemplate(createddoctor.doctorname),
    });

    return res.status(201).json(
        new apiResponse(201, createddoctor, "Doctor registered successfully")
    );

})

const logindoctor = asyncHandler(async (req, res) => {
    const { email, doctorusername, password } = req.body;
    if (!email && !doctorusername) {
        throw new apiError(400, "Email or username is required");
    }
    if (!password) {
        throw new apiError(400, "Password is required");
    }
    const existeddoctor = await Doctor.findOne({
        $or: [{ email }, { doctorusername }]
    })
    if (!existeddoctor) {
        throw new apiError(404, "Doctor not found");
    }
    const ispasswordvalid = await existeddoctor.ispasswordcorrect(password);
    if (!ispasswordvalid) {
        throw new apiError(401, "Invalid password");
    }
    const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(existeddoctor._id);
    const loggedindoctor = await Doctor.findById(existeddoctor._id).select("-password -refreshtoken");
    if (!loggedindoctor) {
        throw new apiError(404, "Doctor login failed");
    }

    await sendMail({
        to: email,
        subject: `Login Alert – NovaMed Account Accessed Successfully`,
        html: logintemplate(loggedindoctor.doctorname),
    });
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedindoctor,
                    accesstoken,
                    refreshtoken
                },
                "Doctor logged in successfully"
            )
        );

});

const logoutdoctor = asyncHandler(async (req, res) => {
    await Doctor.findByIdAndUpdate(
        req.doctor?._id,
        {
            $unset: {
                refreshtoken: 1
            }
        },
        { new: true }
    );
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new apiResponse(200, {}, "Doctor logged out successfully"));
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
    const doctor = await Doctor.findById(decodetoken._id);
    if (!doctor) {
        throw new apiError(404, "Doctor not found");
    }
    if (doctor.refreshtoken !== refreshtoken) {
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
    const doctor = await Doctor.findById(req.doctor?._id);
    if (!doctor) throw new apiError(404, "Doctor not found");
    const ispasswordvalid = await doctor.ispasswordcorrect(oldpassword);
    if (!ispasswordvalid) {
        throw new apiError(401, "Old password is incorrect");
    }
    doctor.password = newpassword;
    await doctor.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password updated successfully"));
})

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { newpassword } = req.body;
    if (!newpassword) throw new apiError(400, "New password is required");

    const doctor = await Doctor.findById(req.user?._id);
    if (!doctor) throw new apiError(404, "Doctor not found");

    doctor.password = newpassword;
    await doctor.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password reset successfully"));
});


const getdoctorprofiledetails = asyncHandler(async (req, res) => {
    const { doctorid } = req.params
    const doctor = await Doctor.findById(doctorid).select('-password -refreshtoken -verificationdocument.aadhar -verificationdocument.medicaldegree -verificationdocument.medicallicense')
    if (!doctor) {
        throw new apiError(404, "Doctor not found")
    }
    return res.status(200)
        .json(new apiResponse(200, doctor, "profile fetched successfully"))
})
const getdoctorprofiledetailsprivate = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.doctor?._id).select("-password -refreshtoken")
    if (!doctor) {
        throw new apiError(404, "Doctor not found")
    }
    return res.status(200)
        .json(new apiResponse(200, doctor, "profile fetched successfully"))
})
const updateprofile = asyncHandler(async (req, res) => {
    const { doctorname, email, phonenumber, age, sex, experience, qualification, specialization, shift } = req.body;

    const updates = {};
    if (doctorname) updates.doctorname = doctorname;
    if (email) updates.email = email;
    if (phonenumber) updates.phonenumber = phonenumber;
    if (age) updates.age = age;
    if (sex) updates.sex = sex;
    if (experience) updates.experience = experience;
    if (qualification) updates.qualification = qualification
    if (specialization) updates.specialization = specialization
    if (shift) updates.shift = JSON.parse(shift)

    if (Object.keys(updates).length === 0) {
        throw new apiError(400, "At least one field is required to update");
    }

    const updateddoctor = await Doctor.findByIdAndUpdate(
        req.doctor?._id,
        { $set: updates },
        { new: true }
    ).select("-password -refreshtoken");

    if (!updateddoctor) {
        throw new apiError(404, "Doctor not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updateddoctor, "Profile updated successfully"));
});

const getalldoctorprofiledetails = asyncHandler(async (req, res) => {
    const search = req.query.search?.trim() || "";

    const query = search
        ? { doctorname: { $regex: search, $options: "i" } }
        : {};

    const doctors = await Doctor.find(query).select(
        "doctorname specialization department qualification experience verificationdocument.profilepicture"
    );

    return res
        .status(200)
        .json(new apiResponse(200, doctors, "Doctor profiles fetched successfully"));
});

const updateprofilepic = asyncHandler(async (req, res) => {
    const profilepicturelocalpath = req.file?.path
    if (!profilepicturelocalpath) {
        throw new apiError(400, "profilepicture not found ")
    }
    const profilepicture = await uploadcloudinary(profilepicturelocalpath)
    if (!profilepicture) {
        throw new apiError(400, "profilepicture upload failed to server")
    }
    const updateddoctor = await Doctor.findByIdAndUpdate(
        req.doctor?._id,
        {
            $set: {
                profilepicture: profilepicture.url
            }
        },
        {
            new: true
        }).select("-password -refreshtoken")
    if (!updateddoctor) {
        throw new apiError(404, "doctor not found")
    }

    res.status(200)
        .json(new apiResponse(200, updateddoctor, "profilepicture updated successfully"))
})

const updatedocument = asyncHandler(async (req, res) => {
    const medicaldegreelocalpath = req.files?.medicaldegree?.[0]?.path;
    const medicallicenselocalpath = req.files?.medicallicense?.[0]?.path;
    if (!medicaldegreelocalpath && !medicallicenselocalpath) {
        throw new apiError(400, "Atleast one Document is required .")
    }
    let medicaldegree, medicallicense

    if (medicaldegreelocalpath) {
        medicaldegree = await uploadcloudinary(medicaldegreelocalpath)
    }
    if (medicallicenselocalpath) {
        medicallicense = await uploadcloudinary(medicallicenselocalpath)
    }
    if (!medicaldegree && !medicallicense) {
        throw new apiError(400, "Error while uploading new files ")
    }
    const updateddoctor = await Doctor.findByIdAndUpdate(
        req.doctor?._id,
        {
            $set: {
                medicaldegree: medicaldegree?.url || "",
                medicallicense: medicallicense?.url || ""
            }
        },
        {
            new: true
        }
    ).select("-password -refreshtoken")

    return res.status(200)
        .json(new apiResponse(200, updateddoctor, "Document updated successfully"))
})

const getdoctorbydept = asyncHandler(async (req, res) => {
    const { deptname } = req.params;
    const doctors = await Doctor.find({ department: deptname, }).select('doctorname specialization department qualification experience verificationdocument.profilepicture');
    if (!doctors) {
        throw new apiError(404, "No doctors found for the given department")
    }
    return res.status(200)
        .json(new apiResponse(200, doctors, "Doctors fetched successfully"))
})
const getCurrentDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.doctor?._id).select("-password -refreshtoken");
    if (!doctor) {
        throw new apiError(404, "Doctor not found");
    }
    return res.status(200).json(new apiResponse(200, doctor, "Current doctor fetched successfully"));
});
export { registerdoctor, logindoctor, logoutdoctor, accesstokenrenewal, updatepassword, resetForgottenPassword, getdoctorprofiledetails, updateprofile, updateprofilepic, updatedocument, getalldoctorprofiledetails, getdoctorprofiledetailsprivate, getdoctorbydept, getCurrentDoctor }; 