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

export const updateJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().trim().optional(),
        jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").optional(),
        workingTime: Joi.string().valid("part-time", "full-time").optional(),
        seniorityLevel: Joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").optional(),
        jobDescription: Joi.string().optional(),
        technicalSkills: Joi.array().items(Joi.string()).optional(),
        softSkills: Joi.array().items(Joi.string()).optional(),
        closed: Joi.boolean().optional()
    })
};