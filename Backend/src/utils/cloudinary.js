import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadcloudinary = async (localpath) => {
    try {

        if (!localpath) return null
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
            secure: true
        })
        console.log(`File has been successfully uploaded-- ${response.url}`)
        fs.unlinkSync(localpath) 
        return response

    } catch (error) {
        console.log("File Upload Error:", error)
        fs.unlink(localpath)
        return null
    }
}
export {uploadcloudinary}