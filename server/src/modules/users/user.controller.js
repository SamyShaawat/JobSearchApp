import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { uploadProfilePic, uploadCoverPic } from "../../middleware/multer.js";
import { userAuth } from "../../middleware/userAuth.js";
import { adminAuth } from "../../middleware/adminAuth.js";

const userRouter = Router();

// 1- auth Apis
userRouter.post("/signUp", validation(UV.signUpSchema), US.signUp);
userRouter.post("/confirmOTP", validation(UV.confirmOTPSchema), US.confirmOTP);
userRouter.post("/signIn", validation(UV.signInSchema), US.signIn);

userRouter.post("/google/signup", validation(UV.googleAuthSchema), US.googleSignUp);
userRouter.post("/google/signin", validation(UV.googleAuthSchema), US.googleSignIn);

userRouter.post("/forgetPassword", validation(UV.forgetPasswordSchema), US.sendOTPForForgetPassword);
userRouter.post("/resetPassword", validation(UV.resetPasswordSchema), US.resetPassword);
userRouter.post("/refreshToken", validation(UV.refreshTokenSchema), US.refreshToken);

// 2- User Apis
userRouter.patch("/updateUser", userAuth, validation(UV.updateUserSchema), US.updateUser);

userRouter.get("/getProfile", userAuth, US.getProfile);
userRouter.get("/getAnotherUserProfile/:userId", userAuth, US.getAnotherUserProfile);

userRouter.patch("/updatePassword", userAuth, validation(UV.updatePasswordSchema), US.updatePassword);

userRouter.patch("/uploadProfilePic", userAuth, uploadProfilePic.single("profilePic"), US.uploadProfilePic);
userRouter.patch("/uploadCoverPic", userAuth, uploadCoverPic.single("coverPic"), US.uploadCoverPic);

userRouter.delete("/deleteProfilePic", userAuth, US.deleteProfilePic);
userRouter.delete("/deleteCoverPic", userAuth, US.deleteCoverPic);

userRouter.delete("/softDeleteAccount", userAuth, US.softDeleteAccount);

// 3- Admin Apis
userRouter.patch("/toggleBanUser/:userId", adminAuth, US.toggleBanUser);

export default userRouter;