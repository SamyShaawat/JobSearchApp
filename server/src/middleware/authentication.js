
import jwt from "jsonwebtoken"
import userModel from "../DB/models/user.model.js"

export const authentication = async (req, res, next) => {

    try {
        const { authorization } = req.headers
        const [prefix, token] = authorization.split(" ") || []
        if (!prefix || !token) {
            return res.status(401).json({ msg: "Token not found" })
        }
        let SIGNATURE_TOKEN = undefined

        if (prefix == "Admin") {
            SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_ADMIN
        } else if (prefix == "Bearer") {
            SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_USER
        } else {
            return res.status(401).json({ msg: "Invalid token prefix" })
        }
        const decoded = jwt.verify(token, SIGNATURE_TOKEN)

        if (!decoded?.id) {
            return res.status(401).json({ msg: "Invalid token!" })
        }
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        //JsonWebTokenError
        if (error?.name == "JsonWebTokenError" || error?.name == "TokenExpiredError") {
            return res.status(401).json({ msg: "Invalid token! " })
        }
        return res.status(500).json({ msg: "Server Error", message: error.message, error })
    }
}