import { asyncHandler } from "../utils/asynchandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { Prescription } from "../models/prescription.model.js"

export const createprescription = asyncHandler(async (req, res) => {
    const { appointmentid } = req.params
    
})
