import Joi from 'joi';

export const signUpSchema = {
    body: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        mobileNumber: Joi.string().required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        DOB: Joi.date().less('now').required(),
        provider: Joi.string().valid('system', 'google').default('system'),
        role: Joi.string().valid('User', 'Admin', 'HR', 'Company Owner').default('User')
    })
};

export const confirmOTPSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required()
    })
};

export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

export const googleAuthSchema = {
    body: Joi.object({
        idToken: Joi.string().required()
    })
};