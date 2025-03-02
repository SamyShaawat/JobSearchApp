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
const coverUserStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "coverPics",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => file.originalname
  }
});

const logoCompanyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "companyLogos",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => file.originalname
  }
});

// Company cover storage
// const coverCompanyStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "companyCovers",
//     allowed_formats: ["jpg", "png", "jpeg"],
//     public_id: (req, file) => file.originalname
//   }
// });

// Export separate Multer middlewares
export const uploadProfilePic = multer({ storage: profileStorage });
export const uploadCoverPic = multer({ storage: coverUserStorage });
export const uploadCompanyLogo = multer({ storage: logoCompanyStorage });
export const uploadCompanyCover = multer({ storage: coverCompanyStorage });

