import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authMiddleware from "../middleware/authMiddleware.js";

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

// Add Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // If user doesn't exist, create new user
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        userPfp: profile.photos[0].value,
        // You'll need to handle these required fields differently for Google sign-up
        age: 0, // Default value
        weight: 0, // Default value
        height: 0, // Default value
        gender: "other", // Default value
        activityLevel: "sedentary", // Default value
        goalWeight: 0, // Default value
        progressDuration: 1 // Default value
      });
      
      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

// Add these new routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);
      
      // Save refresh token
      req.user.refreshToken = refreshToken;
      await req.user.save();
      
      // Instead of redirecting, send JSON response
      res.json({
        success: true,
        accessToken,
        refreshToken,
        userId: req.user._id,
        user: {
          username: req.user.username,
          email: req.user.email,
          userPfp: req.user.userPfp
        }
      });
    } catch (error) {
      console.error("Google callback error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Authentication failed" 
      });
    }
  }
);

// Complete profile route for Google users
router.put('/complete-profile', authMiddleware, async (req, res) => {
    try {
        const { 
            age, 
            weight, 
            height, 
            gender, 
            activityLevel, 
            goalWeight, 
            progressDuration 
        } = req.body;

        // Get user from the authenticated request
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user profile with the required fields
        user.age = age;
        user.weight = weight;
        user.height = height;
        user.gender = gender;
        user.activityLevel = activityLevel;
        user.goalWeight = goalWeight;
        user.progressDuration = progressDuration;

        // Save the updated user
        await user.save();

        res.json({ 
            message: "Profile completed successfully",
            user: {
                username: user.username,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                activityLevel: user.activityLevel,
                goalWeight: user.goalWeight,
                progressDuration: user.progressDuration
            }
        });

    } catch (error) {
        console.error("Error completing profile:", error);
        res.status(500).json({ error: "Failed to complete profile" });
    }
});

export default router;
