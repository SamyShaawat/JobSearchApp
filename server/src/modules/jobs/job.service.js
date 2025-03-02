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

export const updateJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        closed
    } = req.body;

    // Find the job
    const job = await jobOpportunityModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Check if the current user is the owner (the one who 'addedBy')
    if (job.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "Forbidden: Only the user who created this job can update it"
        });
    }

    // Update fields if provided
    if (jobTitle !== undefined) job.jobTitle = jobTitle;
    if (jobLocation !== undefined) job.jobLocation = jobLocation;
    if (workingTime !== undefined) job.workingTime = workingTime;
    if (seniorityLevel !== undefined) job.seniorityLevel = seniorityLevel;
    if (jobDescription !== undefined) job.jobDescription = jobDescription;
    if (technicalSkills !== undefined) job.technicalSkills = technicalSkills;
    if (softSkills !== undefined) job.softSkills = softSkills;
    if (closed !== undefined) job.closed = closed;

    job.updatedBy = req.user._id;

    await job.save();

    return res.status(200).json({
        message: "Job updated successfully",
        data: job
    });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;

    // Find the job
    const job = await jobOpportunityModel.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Find the company
    const company = await companyModel.findById(job.companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if the current user is in the company's HR array

    const isHR = company.HRs.some(hrId => hrId.toString() === req.user._id.toString());
    if (!isHR) {
        return res.status(403).json({
            message: "Forbidden: Only the company HR can delete this job"
        });
    }

    // Delete the job
    await jobOpportunityModel.findByIdAndDelete(jobId);

    return res.status(200).json({ message: "Job deleted successfully" });
});