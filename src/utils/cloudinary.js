import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
console.log({
  cloud: process.env.CLOUD_NAME,
  key: !!process.env.CLOUDINARY_API_KEY,
  secret: !!process.env.CLOUDINARY_API_SECRET
});

const uploadFileonCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", response.url);

    fs.unlinkSync(localfilePath); // delete temp file
    return response;              // ✅ CRITICAL FIX
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (localfilePath && fs.existsSync(localfilePath)) {
      fs.unlinkSync(localfilePath);
    }
    return null;
  }
};

export { uploadFileonCloudinary };
