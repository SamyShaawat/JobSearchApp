import { Router } from "express";
import * as CV from "./company.validation.js";
import * as CS from "./company.service.js";
import { validation } from "../../middleware/validation.js";
import { userAuth } from "../../middleware/userAuth.js";
import { adminAuth } from "../../middleware/adminAuth.js";

const companyRouter = Router();

companyRouter.post("/addCompany", validation(CV.createCompanySchema), CS.addCompany);

companyRouter.patch("/updateCompany/:companyId", userAuth, validation(CV.updateCompanySchema), CS.updateCompany);

companyRouter.patch("/softDeleteCompany/:companyId", userAuth, CS.softDeleteCompany);

companyRouter.get("/searchByName", CS.searchCompanyByName);
companyRouter.get("/getCompanyWithJobs/:companyId", CS.getCompanyWithJobs);

export default companyRouter;
