import config from ".";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";


cloudinary.config({
    cloud_name: config.cloude_name ,
    api_key: config.cloude_api_key ,
    api_secret: config.cloude_secret_key
});


export const cloudinaryUpload = (fileBuffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
           { 
                folder: "8bit_backend",
                resource_type: "auto" 
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        
    
        uploadStream.end(fileBuffer);
    });
};


const storage = multer.memoryStorage();

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});