import companyModel from '../../DB/models/company.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';

export const addCollection = asyncHandler(async (req, res, next) => {
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy,
        logo,
        coverPic,
        HRs,
        bannedAt,
        deletedAt,
        legalAttachment,
        approvedByAdmin
    } = req.body;

    // Build company data based on the request body
    const companyData = {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy,
        logo,
        coverPic,
        HRs,
        bannedAt,
        deletedAt,
        legalAttachment,
        approvedByAdmin
    };

    // Create a new company document in the database
    const newCompany = await companyModel.create(companyData);

    return res.status(201).json({
        message: 'Company created successfully',
        data: newCompany
    });
});
