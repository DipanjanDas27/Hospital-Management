import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { Patient } from "../models/patient.model.js";
import { Admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";

const verifyTempjwt = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.tempToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new apiError(401, "Authorization token missing");


  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  if (!decoded) {
    throw new apiError(403, "Unauthorized token");
  }
  let patient
  let doctor
  let admin
  if (decoded.role === "patient") {
    patient = await Patient.findById(decoded._id).select("-password -refreshtoken")
    if (!patient) {
      throw new apiError(404, "patient not found")
    }
  }

  if (decoded.role === "doctor") {
    doctor = await Doctor.findById(decoded._id).select("-password -refreshtoken")
    if (!doctor) {
      throw new apiError(404, "doctor not found")
    }
  }

  if (decoded.role === "admin") {
    admin = await Admin.findById(decoded._id).select("-password -refreshtoken")
    if (!admin) {
      throw new apiError(404, "admin not found")
    }
  }
  req.user = patient || admin || doctor
  next();
});

export { verifyTempjwt };
