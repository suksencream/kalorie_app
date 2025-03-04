import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js"; // test authorization

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api", foodRoutes);
app.use("/api", authRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Calorie Tracker API!");
});

// test authorization
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized!", userId: req.user.userId });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
