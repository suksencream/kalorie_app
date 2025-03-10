import express from "express";
import FoodIntake from "../models/FoodIntake.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

// Test Route
router.get("/testFoodIntake", (req, res) => {
    res.send("FoodIntake API is working!");
});

// ✅ Add a food intake entry
router.post("/food-intake", authMiddleware, async (req, res) => {
    console.log("📥 Received Data:", req.body);
    try {
        const { foodName, calories, protein, carbs, fats } = req.body;
        const userId = req.user.userId; // Get user from token
        const date = new Date();

        const foodEntry = new FoodIntake({
        userId,
        foodName,
        calories,
        protein,
        carbs,
        fats,
        date
        });

        await foodEntry.save();
        res.status(201).json({ message: "Food entry added", foodEntry });
    } catch (error) {
        console.error("Error adding food intake:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Get a user's food intake
router.get("/food-intake", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const foodEntries = await FoodIntake.find({ userId }).sort({ date: -1 });
  
      res.json(foodEntries);
    } catch (error) {
      console.error("Error fetching food intake:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

// ✅ Delete a food entry
router.delete("/food-intake/:id", authMiddleware, async (req, res) => {
  try {
    const foodEntry = await FoodIntake.findById(req.params.id);

    if (!foodEntry) {
      return res.status(404).json({ error: "Food entry not found" });
    }

    // Ensure user can only delete their own food entries
    if (foodEntry.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await foodEntry.deleteOne();
    res.json({ message: "Food entry deleted" });
  } catch (error) {
    console.error("Error deleting food intake:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
