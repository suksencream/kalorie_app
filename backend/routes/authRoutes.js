import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Test Route
router.get("/testAuth", (req, res) => {
    res.send("Auth API is working!");
});

// Register Route -----------------------
router.post("/register", async (req, res) => {
    try {
        const { 
            username, email, password, 
            age, weight, height, gender, 
            activityLevel, goalWeight, progressDuration 
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            age,
            weight,
            height,
            gender,
            activityLevel,
            goalWeight,
            progressDuration
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route ------------------------

// generate refresh token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" }); 
};

// Refresh token never expires
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH);
};

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken, userId: user._id });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// refresh token route -----------------------------------
router.post("/refresh", async (req, res) => { 
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    try {
        // Find user with this refresh token
        const user = await User.findOne({ refreshToken });

        if (!user) return res.status(403).json({ error: "Invalid refresh token" });

        // Verify refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ accessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
});

// logout route ------------------------------------
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

    try {
        const user = await User.findOne({ refreshToken });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Remove refresh token from the database
        user.refreshToken = null;
        await user.save();

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Failed to log out" });
    }
});
export default router;
