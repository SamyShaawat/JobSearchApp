import { Router } from "express";
import { confirmOTP, googleSignIn, googleSignUp, signIn, signUp } from "./user.service.js";
import { validation } from '../../middleware/validation.js';
import * as UV from './user.validation.js';


const userRouter = Router();

userRouter.post("/signUp", validation(UV.signUpSchema), signUp);
userRouter.post("/confirmOTP", validation(UV.confirmOTPSchema), confirmOTP);
userRouter.post("/signIn", validation(UV.signInSchema), signIn);

userRouter.post("/google/signup", validation(UV.googleAuthSchema), googleSignUp);
userRouter.post("/google/signin", validation(UV.googleAuthSchema), googleSignIn);






export default userRouter;