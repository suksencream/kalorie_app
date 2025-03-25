import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from 'crypto'; // Node.js built-in module for generating random tokens
import { sendResetEmail } from '../config/emailConfig.js';

const router = express.Router();

// Test Route
router.get("/testAuth", (req, res) => {
    res.send("Auth API is working!");
});

// Register Route -----------------------
router.post("/register", async (req, res) => {
    try {
        const { 
            email, password
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
            email,
            password: hashedPassword
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

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Update profile
router.put('/complete-profile', authMiddleware, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            age,
            weight,
            height,
            sex,
            activityLevel,
            goals,
            speedOfProgress
        } = req.body;

        // Debug log the incoming data and user ID
        console.log('Received data:', req.body);
        console.log('User ID:', req.user.userId);

        const user = await User.findById(req.user.userId);
        
        if (!user) {
            console.log('User not found with ID:', req.user.userId);
            return res.status(404).json({ error: "User not found" });
        }

        // Log the found user
        console.log('Found user:', user);

        try {
            // Update user fields
            user.firstName = firstName;
            user.lastName = lastName;
            user.age = Number(age);
            user.weight = Number(weight);
            user.height = Number(height);
            user.sex = sex;
            user.activityLevel = activityLevel;
            user.goals = goals;
            user.speedOfProgress = speedOfProgress;

            // Log the user object before saving
            console.log('User object before save:', user);

            await user.save();
            console.log('User saved successfully');

            res.json({
                message: "Profile updated successfully",
                user: user.toObject()
            });
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            res.status(500).json({ 
                error: "Failed to save user",
                details: saveError.message 
            });
        }

    } catch (error) {
        console.error("Error in complete-profile route:", error);
        res.status(500).json({ 
            error: "Failed to update profile",
            details: error.message 
        });
    }
});

// Request Password Reset Route
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the reset token
        const hashedToken = await bcrypt.hash(resetToken, 10);
        
        // Save hashed token to user document with expiry
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send reset email
        const emailSent = await sendResetEmail(email, resetToken);

        if (emailSent) {
            res.json({ 
                message: "Password reset instructions sent to your email"
            });
        } else {
            // If email fails to send, remove the reset token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            throw new Error("Failed to send reset email");
        }

    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ error: "Failed to process password reset request" });
    }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Verify the token
        const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isValidToken) {
            return res.status(400).json({ error: "Invalid reset token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;