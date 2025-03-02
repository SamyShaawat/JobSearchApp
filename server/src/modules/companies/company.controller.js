import { Router } from "express";
import * as CV from "./company.validation.js";
import * as CS from "./company.service.js";
import { validation } from "../../middleware/validation.js";
import { userAuth } from "../../middleware/userAuth.js";

import { uploadCompanyLogo, uploadCompanyCover } from "../../middleware/multer.js";

const companyRouter = Router();

companyRouter.post("/addCompany", validation(CV.createCompanySchema), CS.addCompany);

companyRouter.patch("/updateCompany/:companyId", userAuth, validation(CV.updateCompanySchema), CS.updateCompany);
companyRouter.patch("/softDeleteCompany/:companyId", userAuth, CS.softDeleteCompany);

companyRouter.get("/searchByName", CS.searchCompanyByName);
companyRouter.get("/getCompanyWithJobs/:companyId", CS.getCompanyWithJobs);

companyRouter.patch("/uploadLogo/:companyId", userAuth, uploadCompanyLogo.single("logo"), CS.uploadCompanyLogo);
companyRouter.patch("/uploadCoverPic/:companyId", userAuth, uploadCompanyCover.single("coverPic"), CS.uploadCompanyCoverPic);

companyRouter.delete("/deleteLogo/:companyId", userAuth, CS.deleteCompanyLogo);
companyRouter.delete("/deleteCoverPic/:companyId", userAuth, CS.deleteCompanyCoverPic);

export default companyRouter;
