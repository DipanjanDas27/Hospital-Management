import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";    
import { Doctor } from "../models/doctor.model.js";

const verifydoctor = asyncHandler(async (req, res, next) => {  
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new apiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshtoken");

        if (!doctor) {
            throw new apiError(401, "Invalid Access Token");
        }

        req.doctor = doctor;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})
export { verifydoctor };