import jobOpportunityModel from '../../DB/models/jobOpportunity.model.js';
import companyModel from "../../DB/models/company.model.js";
import { asyncHandler } from '../../utils/errorHandling.js';

export const addJob = asyncHandler(async (req, res, next) => {
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId
    } = req.body;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if current user is company owner or HR

    const isOwner = company.createdBy.toString() === req.user._id.toString();
    const isHR = company.HRs.some(hrId => hrId.toString() === req.user._id.toString());

    if (!isOwner && !isHR) {
        return res.status(403).json({
            message: "Forbidden: Only the company owner or HR can add a job"
        });
    }

    // 3) Create the job
    const newJob = await jobOpportunityModel.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: req.user._id,
        companyId
    });

    return res.status(201).json({
        message: "Job created successfully",
        data: newJob
    });
});