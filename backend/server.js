import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from 'passport';
import mongoose from 'mongoose';
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js"; // test authorization
import foodIntakeRoute from "./routes/foodIntakeRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

// Update the CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false // Since we're using token-based auth, not cookies
}));

const PORT = process.env.PORT || 5000;

// Add Passport initialization before routes
app.use(passport.initialize());

app.use("/api", foodRoutes);
app.use("/api", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", foodIntakeRoute);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });

// test authorization
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized!", userId: req.user.userId });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});