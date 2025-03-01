import { Router } from "express";
import { confirmOTP, signIn, signUp } from "./user.service.js";
import { validation } from '../../middleware/validation.js';
import * as UV from './user.validation.js';


const userRouter = Router();

userRouter.post("/signUp", validation(UV.signUpSchema), signUp);

userRouter.post("/confirmOTP", validation(UV.confirmOTPSchema), confirmOTP);

userRouter.post("/signIn", validation(UV.signInSchema), signIn);






export default userRouter;