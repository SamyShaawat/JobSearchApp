import { Router } from "express";
import { addUser } from "./user.service.js";
// import { confirmEmail, getProfile, signIn, signUp } from "./user.service.js";
// import { authentication } from "../../middleware/auth.js";
// import { validation } from "../../middleware/validation.js";
// import { signUpSchema } from "./user.validation.js";

const userRouter = Router();


// userRouter.post("/signUp", validation(signUpSchema), signUp);
// userRouter.post("/signIn", signIn);
// userRouter.get("/confirmEmail/:token", confirmEmail);
// userRouter.get("/getProfile", authentication, getProfile);
userRouter.post("/addUser", addUser);




export default userRouter;