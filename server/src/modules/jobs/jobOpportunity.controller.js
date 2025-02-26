import { Router } from "express";
import { addJobOpportunity } from "./jobOpportunity.service.js";

const jobOpportunityRouter = Router();


jobOpportunityRouter.post('/addJobOpportunity', addJobOpportunity);

export default jobOpportunityRouter;
