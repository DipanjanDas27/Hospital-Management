import { Patient } from '../models/patient.model.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadcloudinary } from '../utils/cloudinary.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const generateaccesstokenandrefreshtoken = asyncHandler(async (patientId) => {
    const patient = await Patient.findById(patientId)
    const accesstoken = await patient.generateaccesstoken()
    const refreshtoken = await patient.generaterefreshtoken()
    if (!accesstoken && !refreshtoken) {
        throw new apiError(500, "Token generation failed")
    }
    if (refreshtoken) {
        patient.refreshtoken = refreshtoken
        await patient.save({ validateBeforeSave: false })
    }
    return { accesstoken, refreshtoken }
})

const registerPatient = asyncHandler(async (req, res) => {
    const { patientname, patientusername, email, password, phonenumber, age, sex, guardianname } = req.body

    if (
        [patientname, patientusername, email, phonenumber, age, sex, password, guardianname].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }
    const existedpatient = await Patient.findOne({
        $or: [{ patientusername }, { email }]
    })
    if (existedpatient) {
        throw new apiError(409, "patient with same email or username already exist")
    }
    let profilepicturelocalpath;
    if (req.files && Array.isArray(req.files.profilepicture) && req.files.profilepicture.length > 0) {
        profilepicturelocalpath = req.files.profilepicture[0].path
    }

    const profilepicture = await uploadcloudinary(profilepicturelocalpath)

    const patient = await Patient.create({
        patientname,
        patientusername: patientusername.toLowerCase(),
        email,
        password,
        phonenumber,
        age,
        sex,
        guardianname,
        profilepicture: profilepicture.url || ""
    })

    if (!patient) {
        throw new apiError(500, "Patient registration failed")
    }
    if (patient) {
        const createdpatient = await Patient.findById(patient._id).select("-password -refreshtoken")
        return res.status(201).json(
            new apiResponse(200, createdpatient, "patient registered Successfully")
        )
    }
})

const loginPatient = asyncHandler(async (req, res) => {
    const { email, patientusername, password } = req.body
    if (
        [email, patientusername, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "Email or Username and password are required")
    }
    const existedpatient = await Patient.findone({
        $or: [{ email }, { patientusername }]
    })
    if (!existedpatient) {
        throw new apiError(404, "Patient not found")
    }
    const ispassword = await existedpatient.ispasswordcorrect(password)
    if (!ispassword) {
        throw new apiError(401, "Invalid password")
    }
    const { accesstoken, refreshtoken } = generateaccesstokenandrefreshtoken(existedpatient._id)
    const loggedinpatient = await User.findById(existedpatient._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accesstoken, options)
        .cookie("refreshToken", refreshtoken, options)
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
     await User.findByIdAndUpdate(
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