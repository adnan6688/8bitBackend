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


export const deleteFromCloudinary = async (publicIds: string[]) => {
  if (!publicIds || publicIds.length === 0) return;

  try {
    for (const id of publicIds) {
      await cloudinary.uploader.destroy(id);
    }
    console.log("Garbage images deleted from Cloudinary successfully!");
  } catch (error) {
    console.error("Failed to delete images from Cloudinary:", error);
  }
};
