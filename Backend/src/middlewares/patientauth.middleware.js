import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { Patient } from "../models/patient.model.js";


const verifyjwt = asyncHandler(async (req, res, next) => {
 try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const patient = await Patient.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!patient) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.patient = patient
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
export { verifyjwt }