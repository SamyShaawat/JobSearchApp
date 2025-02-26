import { Router } from "express";
import { addApplication } from "./application.service.js";

const applicationRouter = Router();

applicationRouter.post('/addApplication', addApplication);

export default applicationRouter;
