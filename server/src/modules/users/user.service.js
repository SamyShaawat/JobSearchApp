import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/errorHandling.js";

export const addUser = asyncHandler(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        provider,
        gender,
        DOB,
        mobileNumber,
        role,
        isConfirmed,
        deletedAt,
        bannedAt,
        updatedBy,
        changeCredentialTime,
        profilePic,
        coverPic,
        OTP
    } = req.body;

    // Build user data, ensuring required fields are provided
    const userData = {
        firstName,
        lastName,
        email,
        password,
        provider: provider || "system",
        gender,
        DOB: new Date(DOB),
        mobileNumber,
        role: role || "User",
        isConfirmed,
        deletedAt,
        bannedAt,
        updatedBy,
        changeCredentialTime,
        profilePic,
        coverPic,
        OTP
    };

    // Create a new user document in the database
    const newUser = await userModel.create(userData);

    // Respond with the newly created user data
    return res.status(201).json({
        message: "User created successfully",
        data: newUser
    });
}
);