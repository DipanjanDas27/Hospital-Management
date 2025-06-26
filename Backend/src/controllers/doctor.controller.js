import { asyncHandler } from "../utils/asynchandler";
import { Admin } from "../models/admin.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";

 const registerdoctor = asyncHandler(async (req, res) => {
    const { doctorname, doctorusername, email, password, phonenumber} = req.body;
})

export { registerdoctor };