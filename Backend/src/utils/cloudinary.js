// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

export const uploadcloudinary = async (buffer, folder = "hms") => {
  if (!buffer) return null;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          secure: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error; 
  }
};