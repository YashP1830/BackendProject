import {v2 as cloudinary} from "cloudinary";
import  fs, { unlinkSync } from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadFileonCloudinary=async (localfilePath) => {
            try {
                if(!localfilePath) return null;
                const  response= await cloudinary.uploader.upload(localfilePath,{
                    resource_type:"auto"
                }) 
                //if the file is uploaded
                console.log("The file is uploaded on Cloudianry Server:",response.url) 
                fs.unlinkSync(localfilePath);
            } catch (error) {
                //if file is not uploaded then remove the file from the temperoy storage
                fs.unlinkSync(localfilePath)
                return null;
            }
}

export {uploadFileonCloudinary}


    
