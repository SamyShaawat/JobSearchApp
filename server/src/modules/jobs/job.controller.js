import { Router } from "express";
import * as JV from "./job.validation.js";
import * as JS from "./job.service.js";
import { validation } from "../../middleware/validation.js";
import { userAuth } from "../../middleware/userAuth.js";
import { adminAuth } from "../../middleware/adminAuth.js";

const jobOpportunityRouter = Router();

jobOpportunityRouter.post("/addJob", userAuth, validation(JV.createJobSchema), JS.addJob);

export default jobOpportunityRouter;
