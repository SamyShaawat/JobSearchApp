import companyModel from '../../DB/models/company.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';

export const addCompany = asyncHandler(async (req, res, next) => {
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy
    } = req.body;

    // Check if companyName already exists
    const existingName = await companyModel.findOne({ companyName });
    if (existingName) {
        return res.status(400).json({ message: "Company name already exists" });
    }

    // Check if companyEmail already exists
    const existingEmail = await companyModel.findOne({ companyEmail });
    if (existingEmail) {
        return res.status(400).json({ message: "Company email already exists" });
    }

    // Create the company
    const newCompany = await companyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy
    });

    return res.status(201).json({
        message: "Company created successfully",
        data: newCompany
    });
});