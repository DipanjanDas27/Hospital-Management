import sendMail from "../services/mail.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import generateOtp from "../utils/otpgenerator.js";
import { saveOTP, getOTP, clearOTP } from "../services/otp.js";
import { Patient } from "../models/patient.model.js";
import { Admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";
import { forgetpasswordotptemplate, otpTemplate } from "../utils/emailtemplate.js";
import jwt from "jsonwebtoken"

const sendotp = asyncHandler(async (req, res) => {
    const email = req.patient?.email || req.doctor?.email || req.admin?.email;
    if (!email) {
        throw new apiError(400, "email is not found from any user or user is not logged in");
    }
    const otp = generateOtp();
    saveOTP(email, otp);

    const response = await sendMail({
        to: email,
        subject: "NovaMed OTP Verification",
        html: otpTemplate(otp),
    });
    if (!response) {
        throw new apiError(500, "Failed to send OTP");
    }
    return res.status(200)
        .json(new apiResponse(200, {}, "OTP sent successfully"));
})
const sendForgetPasswordOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new apiError(400, "Email is required");
    }
    const patient = await Patient.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await Admin.findOne({ email });
    if (!patient && !doctor && !admin) {
        throw new apiError(404, "User not found");
    }
    let user = {}
    if (patient) { user.id = patient._id, user.role = "patient" }
    if (doctor) { user.id = doctor._id, user.role = "doctor" }
    if (admin) { user.id = admin._id, user.role = "admin" }


    const tempToken = jwt.sign(
        {
            _id: user.id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    const otp = generateOtp();
    saveOTP(email, otp);

    const response = await sendMail({
        to: email,
        subject: "Your NovaMed OTP Code to Reset Password",
        html: forgetpasswordotptemplate(otp),
    });
    if (!response) {
        throw new apiError(500, "Failed to send OTP");
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("tempToken", tempToken, options)
        .json(new apiResponse(200, { tempToken }, "OTP sent successfully"));
})

const verifyotp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const email = req.patient?.email || req.doctor?.email || req.admin?.email;
    if (!email) {
        throw new apiError(400, "Email is not found from any user or user is not logged in");
    }
    if (!otp) {
        throw new apiError(400, " OTP is required");
    }

    const storedotp = getOTP(email);
    if (!storedotp) {
        throw new apiError(404, "OTP not found or expired");
    }

    if (storedotp !== otp) {
        throw new apiError(401, "Invalid OTP");
    }

    clearOTP(email);
    return res.status(200)
        .json(new apiResponse(200, {}, "OTP verified successfully"));

});
const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (!otp) throw new apiError(400, " OTP is required");

    const storedotp = getOTP(req.user?.email);
    if (!storedotp || storedotp !== otp) throw new apiError(401, "Invalid or expired OTP");

    clearOTP(req.user?.email);
    return res.status(200).json(new apiResponse(200, {}, "otp verified successfully"))
});


export { sendotp, verifyotp, verifyForgotPasswordOtp, sendForgetPasswordOtp };