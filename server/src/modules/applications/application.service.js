import applicationModel from '../../DB/models/application.model.js';
import { asyncHandler } from '../../utils/errorHandling.js';

export const addApplication = asyncHandler(async (req, res, next) => {
    const {
        jobId,
        userId,
        userCV,
        status
    } = req.body;

    // Build application data based on the request body
    const applicationData = {
        jobId,
        userId,
        userCV,
        status
    };

    // Create a new application document in the database
    const newApplication = await applicationModel.create(applicationData);

    return res.status(201).json({
        message: "Application created successfully",
        data: newApplication
    });
});
