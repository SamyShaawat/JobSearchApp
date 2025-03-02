
import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";


export const adminAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ msg: "Authorization header missing" });
        }

        const [prefix, token] = authorization.split(" ");
        if (prefix !== "Admin" || !token) {
            return res.status(401).json({ msg: "Invalid admin token prefix, expected 'Admin'" });
        }

        // Verify with admin signature
        const decoded = jwt.verify(token, process.env.SIGNATURE_TOKEN_ADMIN);
        if (!decoded?.id) {
            return res.status(401).json({ msg: "Invalid admin token" });
        }

        // Check DB for user
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Must have admin role
        if (user.role !== "Admin") {
            return res.status(403).json({ msg: "Forbidden: Admin only" });
        }

        // Attach user doc
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Invalid or expired admin token" });
        }
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};