import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";
import { Patient } from "../models/patient.model.js";

const verifyAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new apiError(401, "Unauthorized request");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  let user;

  if (decoded.role === "doctor") {
    user = await Doctor.findById(decoded._id);
    if (!user) throw new apiError(401, "Invalid token");
    req.doctor = user;
  } else if (decoded.role === "admin") {
    user = await Admin.findById(decoded._id);
    if (!user) throw new apiError(401, "Invalid token");
    req.admin = user;
  } else if (decoded.role === "patient") {
    user = await Patient.findById(decoded._id);
    if (!user) throw new apiError(401, "Invalid token");
    req.patient = user;
  } else {
    throw new apiError(401, "Invalid role");
  }

  next();
});

export { verifyAuth };