import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { sendEmail } from '../../service/sendEmails.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../../utils/otp.js';
import { OAuth2Client } from 'google-auth-library';
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
    const user = await userModel.findOne({ email, provider: 'system' });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens: access token (1 hour) and refresh token (7 days)
    const accessToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '7d' });

    return res.status(200).json({
        message: "Sign in successful",
        tokens: { accessToken, refreshToken }
    });
});

export const googleSignUp = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;

    // Verify the idToken received from the client
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract details from the payload
    const { email, given_name, family_name } = payload;

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists. Please sign in." });
    }


    const defaultDOB = new Date('1990-01-01');
    const defaultGender = 'Male';
    const defaultMobile = '0000000000';

    // Create a new user with details from Google
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

    // Generate JWT tokens
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

    // Verify the idToken
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract email from the payload
    const { email } = payload;

    // Check if the user exists and is a Google user
    const user = await userModel.findOne({ email, provider: 'google' });
    if (!user) {
        return res.status(404).json({ message: "User not found. Please sign up with Google first." });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SIGNATURE_TOKEN_USER, { expiresIn: '7d' });

    return res.status(200).json({
        message: "Google sign in successful",
        tokens: { accessToken, refreshToken },
        data: user
    });
});

