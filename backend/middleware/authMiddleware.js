import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user data to request
        next(); // Continue to the actual route
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};

export default authMiddleware;