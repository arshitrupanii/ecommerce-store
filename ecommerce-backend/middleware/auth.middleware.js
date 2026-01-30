import jwt from "jsonwebtoken"
import User from "../schema/user.schema.js"

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "not authorized, no token.." })
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found" })
            }

            req.user = user;

            next()
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - access token expired " })
            }
            throw error;
        }
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
}


export const adminRoute = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next()
        }
        else {
            return res.status(401).json({ message: "Only admin can access!" })
        }
    } catch (error) {
        res.status(401).json({ message: "Problem in admin route" });
    }
}