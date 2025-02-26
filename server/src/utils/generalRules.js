import joi from "joi";
import { Types } from "mongoose";

export const idValidation = (value, helper) => {
    let isValidId = Types.ObjectId.isValid(value);
    return isValidId ? value : helper.message("id is not valid")
}

export const generalRules = {
    objectId: joi.string().custom(idValidation),
    email: joi.string().email({ tlds: { allow: true } }),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    headers: joi.object({
        authorization: joi.string(),
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
    }),
}