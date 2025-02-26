import jobOpportunityModel from '../../DB/models/jobOpportunity.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';

export const addJobOpportunity = asyncHandler(async (req, res, next) => {
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        updatedBy,
        closed,
        companyId
    } = req.body;

    // Build the job opportunity data object
    const jobOpportunityData = {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
        updatedBy,
        closed,
        companyId
    };

    // Create a new Job Opportunity document in the database
    const newJobOpportunity = await jobOpportunityModel.create(jobOpportunityData);

    return res.status(201).json({
        message: "Job opportunity created successfully",
        data: newJobOpportunity
    });
});
