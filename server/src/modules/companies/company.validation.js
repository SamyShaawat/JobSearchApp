import Joi from 'joi';

export const createCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().trim().required(),
        description: Joi.string().required(),
        industry: Joi.string().required(),
        address: Joi.string().required(),
        numberOfEmployees: Joi.number().min(11).max(20).required(),
        companyEmail: Joi.string().email().required(),
        createdBy: Joi.string().required()
    })
};

export const updateCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().trim().optional(),
        description: Joi.string().optional(),
        industry: Joi.string().optional(),
        address: Joi.string().optional(),
        numberOfEmployees: Joi.number().min(11).max(20).optional(),
        companyEmail: Joi.string().email().optional()
    })
};