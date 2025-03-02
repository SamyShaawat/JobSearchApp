import { Router } from "express";
import * as CV from "./company.validation.js";
import * as CS from "./company.service.js";
import { validation } from "../../middleware/validation.js";

const companyRouter = Router();


companyRouter.post("/addCompany", validation(CV.createCompanySchema), CS.addCompany);

export default companyRouter;
