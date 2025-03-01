import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";

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
userRouter.patch("/updateUser", authentication, validation(UV.updateUserSchema), US.updateUser);

export default userRouter;