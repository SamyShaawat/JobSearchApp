import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";

export const userAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ msg: "Authorization header missing" });
        }

        const [prefix, token] = authorization.split(" ");
        if (prefix !== "Bearer" || !token) {
            return res.status(401).json({ msg: "Invalid user token prefix, expected 'Bearer'" });
        }

        // Verify with user signature
        const decoded = jwt.verify(token, process.env.SIGNATURE_TOKEN_USER);
        if (!decoded?.id) {
            return res.status(401).json({ msg: "Invalid user token" });
        }

        // Check DB for user
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Attach user doc
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Invalid or expired user token" });
        }
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};