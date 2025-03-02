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

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if already soft-deleted
    if (company.deletedAt) {
        return res.status(400).json({ message: "Company is already soft-deleted" });
    }

    // Ensure only admin or the company owner can do this
    const isAdmin = req.user.role === "Admin";
    const isOwner = company.createdBy.toString() === req.user._id.toString();
    if (!isAdmin && !isOwner) {
        return res.status(403).json({
            message: "Forbidden: Only admin or company owner can soft-delete this company"
        });
    }

    // Soft delete by setting deletedAt
    company.deletedAt = new Date();
    await company.save();

    return res.status(200).json({
        message: "Company soft-deleted successfully",
        data: company
    });
});

export const searchCompanyByName = asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    // Check if 'name' query param is provided
    if (!name) {
        return res.status(400).json({ message: "No name query provided" });
    }

    const companies = await companyModel.find({
        companyName: { $regex: name, $options: "i" }
    });

    // 3return 404 or an empty array
    if (!companies.length) {
        return res.status(404).json({ message: "No companies found with that name" });
    }

    return res.status(200).json({
        message: "Companies found",
        data: companies
    });
});

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Find the company by ID and populate the 'jobs' virtual
    const company = await companyModel.findById(companyId).populate("jobs");

    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Return the company doc, which now has a .jobs array
    return res.status(200).json({
        message: "Company retrieved successfully",
        data: company
    });
});