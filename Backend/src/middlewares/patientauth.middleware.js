import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { Patient } from "../models/patient.model.js";


const verifypatient = asyncHandler(async (req, res, next) => {
 try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const patient = await Patient.findById(decodedToken?._id).select("-password -refreshtoken")

        if (!patient) {    
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.patient = patient
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
})
export { verifypatient }