import Joi from "joi";

export const createJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().trim().required(),
        jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
        workingTime: Joi.string().valid("part-time", "full-time").required(),
        seniorityLevel: Joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
        jobDescription: Joi.string().required(),
        technicalSkills: Joi.array().items(Joi.string()).required(),
        softSkills: Joi.array().items(Joi.string()).required(),
        companyId: Joi.string().required()
    })
};