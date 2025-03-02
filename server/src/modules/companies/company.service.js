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

export const updateCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail
    } = req.body;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if current user is the owner
    if (company.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden: Only the company owner can update" });
    }


    if (companyName !== undefined) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (industry !== undefined) company.industry = industry;
    if (address !== undefined) company.address = address;
    if (numberOfEmployees !== undefined) company.numberOfEmployees = numberOfEmployees;
    if (companyEmail !== undefined) company.companyEmail = companyEmail;

    await company.save();

    return res.status(200).json({
        message: "Company updated successfully",
        data: company
    });
});