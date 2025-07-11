import { Patient } from '../models/patient.model.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadcloudinary } from '../utils/cloudinary.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

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
    let profilepicture = { url: "" };

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
        profilepicture: profilepicture.url || ""
    })

    if (!patient) {
        throw new apiError(500, "Patient registration failed")
    }

    const createdpatient = await Patient.findById(patient._id).select("-password -refreshtoken")
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



export { registerPatient, loginPatient, logoutPatient };