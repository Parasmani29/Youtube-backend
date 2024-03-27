import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

          
cloudinary.config({ 
  cloud_name: process_params.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process_params.env.CLOUDINARY_API_KEY, 
  api_secret: process_params.env.CLOUDINARY_API_SECRET, 
});

const uploadOnCloudinary = async (localFilePath) => {
    try 
    {
        if(!localFilePath) return null
        // upload the on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("file is upladed on cloudainary", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the uplad operation got failed
        return null;

    }
}



export {uploadOnCloudinary}