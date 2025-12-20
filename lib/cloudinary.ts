import { v2 as cloudinary } from "cloudinary";

// Server-side configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Client-side upload configuration
export const getCloudinaryUploadConfig = () => {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: "fuarlarim-12-25", // Create this in Cloudinary dashboard
  };
};
