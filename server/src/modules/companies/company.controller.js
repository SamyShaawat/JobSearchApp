import { Router } from "express";
import { addCollection } from "./company.service.js";

const companyRouter = Router();


companyRouter.post('/addCollection', addCollection);

export default companyRouter;
