import { asyncHandler } from "../utils/asynchandler.js";
import { Doctor } from "../models/doctor.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

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
    const { doctorname, doctorusername, email, password, phonenumber, sex, age, experience, qualification, department, hospitalname, day, starttime, endtime, patientslot } = req.body;

    if ([doctorname, doctorusername, email, password, phonenumber, sex, age, experience, qualification, department, hospitalname, day, starttime, endtime, patientslot].some((field) => !field || field?.trim() === "")) {
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

    if(!aadharlocalpath || !medicaldegreelocalpath || !medicallicenselocalpath || !profilepicturelocalpath) {
        throw new apiError(400, "All files are required");
    }
    const aadhar = await uploadcloudinary(aadharlocalpath);
    const medicaldegree = await uploadcloudinary(medicaldegreelocalpath);
    const medicallicense = await uploadcloudinary(medicallicenselocalpath);
    const profilepicture = await uploadcloudinary(profilepicturelocalpath);
    if (!aadhar || !medicaldegree || !medicallicense || !profilepicture) {
        throw new apiError(500, "File upload failed");
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
            aadhar:aadhar.url,
            medicaldegree : medicaldegree.url,
            medicallicense: medicallicense.url,
            profilepicture: profilepicture.url
        },
        experience,
        qualification,  
        department,
        hospitalname,
        shift: {
            day,
            starttime,
            endtime,
            patientslot
        }
    });
    if (!doctor) {
        throw new apiError(500, "Doctor registration failed");
    }
    const createddoctor = await Doctor.findById(doctor._id).select("-password -refreshtoken");
    if (!createddoctor) {
        throw new apiError(500, "Doctor not found");
    }
    return res.status(201).json(
        new apiResponse(201, createddoctor, "Doctor registered successfully")
    );

})

const logindoctor = asyncHandler(async (req, res) => {
    const { email,doctorusername, password } = req.body;
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

export { registerdoctor,logindoctor ,logoutdoctor};