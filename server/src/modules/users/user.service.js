import userModel from "../../DB/models/user.model.js";
import companyModel from "../../DB/models/company.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { sendEmail } from '../../service/sendEmails.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../../utils/otp.js';
import { OAuth2Client } from 'google-auth-library';
import cloudinary from '../../../config/cloudinary.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, mobileNumber, gender, DOB, provider } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password using bcrypt
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP and hash it (OTP valid for 10 minutes)
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const otpEntry = {
        code: hashedOTP,
        type: 'confirmEmail',
        expiresIn: new Date(Date.now() + 10 * 60 * 1000)  // 10 minutes from now
    };

    // Create new user with the OTP entry added to the OTP array
    const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber,
        gender,
        DOB,
        provider,
        OTP: [otpEntry]
    });

    // Send OTP via email
    await sendEmail(newUser.email, "Email Confirmation OTP", `<p>Your OTP is: <b>${otp}</b></p>`);

    return res.status(201).json({
        message: "User created successfully. Please check your email for OTP verification.",
        data: newUser
    });
});

export const confirmOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Find OTP entry for confirmEmail
    const otpEntry = user.OTP.find(entry => entry.type === 'confirmEmail');
    if (!otpEntry) {
        return res.status(400).json({ message: "OTP not found" });
    }

    // Check if OTP is expired
    if (otpEntry.expiresIn < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare provided OTP with hashed OTP stored in database
    const isMatch = await bcrypt.compare(otp, otpEntry.code);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user confirmation status and clear OTP array
    user.isConfirmed = true;
    user.OTP = [];
    await user.save();

    return res.status(200).json({
        message: "Email confirmed successfully",
        data: user
    });
});

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Find user by email and provider
    const user = await userModel.findOne({ email, provider: "system" });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Decide which signature key to use based on role
    let signatureKey;
    if (user.role === "Admin") {
        signatureKey = process.env.SIGNATURE_TOKEN_ADMIN;
    } else {
        signatureKey = process.env.SIGNATURE_TOKEN_USER;
    }

    // Generate JWT tokens with that signature key
    const accessToken = jwt.sign({ id: user._id }, signatureKey, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, signatureKey, { expiresIn: "7d" });

    return res.status(200).json({
        message: "Sign in successful",
        tokens: { accessToken, refreshToken },
        role: user.role
    });
});
export const googleSignUp = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists. Please sign in." });
    }

    const defaultDOB = new Date('1990-01-01');
    const defaultGender = 'Male';
    const defaultMobile = '0000000000';

    user = await userModel.create({
        firstName: given_name,
        lastName: family_name,
        email,
        password: await bcrypt.hash('googleAuth', Number(process.env.SALT_ROUNDS || 12)),
        mobileNumber: defaultMobile,
        gender: defaultGender,
        DOB: defaultDOB,
        provider: 'google',
        isConfirmed: true
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '7d' });

    return res.status(201).json({
        message: "User created with Google successfully",
        tokens: { accessToken, refreshToken },
        data: user
    });
});

export const googleSignIn = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;

    // Verify the idToken from Google
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract email from the payload
    const { email } = payload;

    // Check if the user exists and is a Google user
    const user = await userModel.findOne({ email, provider: "google" });
    if (!user) {
        return res
            .status(404)
            .json({ message: "User not found. Please sign up with Google first." });
    }

    // Decide which signature key to use based on the user's role
    let signatureKey;
    if (user.role === "Admin") {
        signatureKey = process.env.SIGNATURE_TOKEN_ADMIN;
    } else {
        signatureKey = process.env.SIGNATURE_TOKEN_USER;
    }

    // Generate JWT tokens: access token (1 hour) and refresh token (7 days)
    const accessToken = jwt.sign({ id: user._id }, signatureKey, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id }, signatureKey, {
        expiresIn: "7d",
    });

    return res.status(200).json({
        message: "Google sign in successful",
        tokens: { accessToken, refreshToken },
        role: user.role,
        data: user,
    });
});

export const sendOTPForForgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and hash it
    const otp = generateOTP();
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    // Create 'forgetPassword' OTP entry
    const otpEntry = {
        code: hashedOTP,
        type: 'forgetPassword',
        expiresIn: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    };

    // Remove any old 'forgetPassword' entries
    user.OTP = user.OTP.filter(entry => entry.type !== 'forgetPassword');
    user.OTP.push(otpEntry);
    await user.save();

    // Send email with raw OTP
    const emailBody = `<p>Your OTP for password reset is: <b>${otp}</b></p>`;
    await sendEmail(user.email, "Reset Password OTP", emailBody);

    return res.status(200).json({
        message: "OTP sent to your email. Check your inbox/spam."
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, newPassword, otp } = req.body;

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Find 'forgetPassword' OTP entry
    const otpEntry = user.OTP.find(entry => entry.type === 'forgetPassword');
    if (!otpEntry) {
        return res.status(400).json({ message: "No forget password OTP found" });
    }

    // Check if OTP is expired
    if (otpEntry.expiresIn < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare provided OTP with hashed code
    const isMatch = await bcrypt.compare(otp, otpEntry.code);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // All good => Update password
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    // Remove the OTP entry from array
    user.OTP = user.OTP.filter(entry => entry.type !== 'forgetPassword');

    // Update changeCredentialTime so old tokens become invalid
    user.changeCredentialTime = new Date();
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.SIGNATURE_TOKEN_USER);
        if (!decoded?.id) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Find user
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare token iat with user.changeCredentialTime
        const tokenIssuedAt = decoded.iat * 1000;
        const credentialChangeTime = user.changeCredentialTime
            ? user.changeCredentialTime.getTime()
            : 0;

        if (tokenIssuedAt < credentialChangeTime) {
            return res.status(403).json({ message: "Refresh token is invalidated by password change" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, {
            expiresIn: "1h"
        });

        return res.status(200).json({
            message: "New access token generated",
            accessToken: newAccessToken
        });
    } catch (error) {
        // If token is invalid or expired
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        next(error);
    }
});

export const updateUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, mobileNumber, DOB, gender } = req.body;

    // Find the user (req.user._id is set by your auth middleware)
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update only fields that are provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (DOB !== undefined) user.DOB = DOB;
    if (gender !== undefined) user.gender = gender;

    // Save user => triggers pre-save hook for encryption if mobileNumber changed
    await user.save();

    return res.status(200).json({
        message: "User updated successfully",
        data: user
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
    return res.status(200).json({
        message: "User profile retrieved successfully",
        data: req.user
    });
});

export const getAnotherUserProfile = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userDoc = user.toJSON();
    // console.log(userDoc);

    const {
        userName,
        mobileNumber,
        profilePic,
        coverPic
    } = userDoc;

    return res.status(200).json({
        message: "Profile retrieved successfully",
        data: { userName, mobileNumber, profilePic, coverPic }
    });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    // Find the user from req.user._id
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Compare oldPassword with the stored (hashed) password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password + changeCredentialTime
    user.password = hashedNewPassword;
    user.changeCredentialTime = new Date();

    // Save => triggers pre-save hook if you have one, but you can do it manually as well
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
});

export const uploadProfilePic = asyncHandler(async (req, res, next) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // See what multer-storage-cloudinary returned
    console.log("DEBUG => req.file:", req.file);

    // Find user
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }
    // Update user's profilePic with Cloudinary info
    user.profilePic = {
        secure_url: req.file.path,
        public_id: req.file.filename,
    };
    await user.save();

    return res.status(200).json({
        message: "Profile pic uploaded successfully",
        data: user.profilePic
    });
});

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("DEBUG => req.file:", req.file);

    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.coverPic?.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    user.coverPic = {
        secure_url: req.file.path,
        public_id: req.file.filename,
    };
    await user.save();

    return res.status(200).json({
        message: "Cover pic uploaded successfully",
        data: user.coverPic
    });
});

export const deleteProfilePic = asyncHandler(async (req, res, next) => {
    // Find user
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // If there's a public_id, remove from Cloudinary
    if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Clear from DB
    user.profilePic = { secure_url: null, public_id: null };
    await user.save();

    return res.status(200).json({ message: "Profile pic deleted successfully" });
});

export const deleteCoverPic = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.coverPic?.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    user.coverPic = { secure_url: null, public_id: null };
    await user.save();

    return res.status(200).json({ message: "Cover pic deleted successfully" });
});

export const softDeleteAccount = asyncHandler(async (req, res, next) => {
    // Find the user
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if already soft-deleted
    if (user.deletedAt) {
        return res.status(400).json({ message: "User account is already soft-deleted" });
    }

    // Soft-delete by setting deletedAt
    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({
        message: "User account soft-deleted successfully"
    });
});

export const toggleBanUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    // Find the user
    const userToToggle = await userModel.findById(userId);
    if (!userToToggle) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if user is currently banned
    if (!userToToggle.bannedAt) {
        // Not banned => ban them
        userToToggle.bannedAt = new Date();
        await userToToggle.save();
        return res.status(200).json({ message: "User banned successfully" });
    } else {
        // Already banned => unban them
        userToToggle.bannedAt = null;
        await userToToggle.save();
        return res.status(200).json({ message: "User unbanned successfully" });
    }
});

export const toggleBanCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Find the company
    const companyToToggle = await companyModel.findById(companyId);
    if (!companyToToggle) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if the company is currently banned
    if (!companyToToggle.bannedAt) {
        // Not banned => ban them
        companyToToggle.bannedAt = new Date();
        await companyToToggle.save();
        return res.status(200).json({ message: "Company banned successfully" });
    } else {
        // Already banned => unban them
        companyToToggle.bannedAt = null;
        await companyToToggle.save();
        return res.status(200).json({ message: "Company unbanned successfully" });
    }
});

export const approveCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Find the company
    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    // Check if already approved
    if (company.approvedByAdmin) {
        return res.status(400).json({ message: "Company is already approved" });
    }

    // Approve the company
    company.approvedByAdmin = true;
    await company.save();

    return res.status(200).json({ message: "Company approved successfully" });
});