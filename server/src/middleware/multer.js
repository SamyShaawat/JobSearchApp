import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";

// Profile pics storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePics",          
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => file.originalname 
  }
});

// Cover pics storage
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "coverPics",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => file.originalname
  }
});

// Export two separate Multer middlewares
export const uploadProfilePic = multer({ storage: profileStorage });
export const uploadCoverPic = multer({ storage: coverStorage });
