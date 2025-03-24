import express from "express";
import FoodIntake from "../models/FoodIntake.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes
import mongoose from "mongoose";

const router = express.Router();

// Test Route
router.get("/testFoodIntake", (req, res) => {
    res.send("FoodIntake API is working!");
});

// ✅ Add a food intake entry
router.post("/food-intake", authMiddleware, async (req, res) => {
    console.log("📥 Received meal data:", req.body);
    try {
        const { foodName, calories, protein, carbs, fats, image } = req.body;
        const userId = req.user.userId;

        // Ensure all numeric values are properly parsed
        const parsedData = {
            userId,
            foodName,
            calories: parseFloat(calories) || 0,
            protein: parseFloat(protein) || 0,
            carbs: parseFloat(carbs) || 0,
            fats: parseFloat(fats) || 0,
            image: image || '/default-food.png',
            date: new Date()
        };

        console.log('💾 Saving meal with parsed data:', parsedData);

        const foodEntry = new FoodIntake(parsedData);
        await foodEntry.save();

        console.log('✅ Saved food entry:', foodEntry);
        res.status(201).json({ 
            message: "Food entry added", 
            foodEntry,
            parsedValues: {
                calories: parsedData.calories,
                protein: parsedData.protein,
                carbs: parsedData.carbs,
                fats: parsedData.fats
            }
        });
    } catch (error) {
        console.error("❌ Error adding food intake:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Get a user's food intake
router.get("/food-intake", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const dateQuery = req.query.date;

        console.log('🔍 Debug - Fetch Request Details:', {
            userId,
            dateQuery,
            tokenExists: !!req.header("Authorization")
        });

        let query = { userId: new mongoose.Types.ObjectId(userId) };

        // If date is provided, filter by date
        if (dateQuery) {
            // Create date objects for start and end of the queried date in UTC
            const startDate = new Date(dateQuery);
            startDate.setUTCHours(0, 0, 0, 0);
            
            const endDate = new Date(dateQuery);
            endDate.setUTCHours(23, 59, 59, 999);

            query.date = {
                $gte: startDate,
                $lte: endDate
            };

            console.log('📅 Date Range Query:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                rawQuery: JSON.stringify(query)
            });
        }

        // Debug: First check if any meals exist for this user
        const allMeals = await FoodIntake.find({ userId: new mongoose.Types.ObjectId(userId) });
        console.log('📊 Total meals for user:', allMeals.length);

        // Debug: Log a sample meal to check date format
        if (allMeals.length > 0) {
            console.log('📝 Sample meal date:', allMeals[0].date);
        }

        const foodEntries = await FoodIntake.find(query)
            .sort({ date: -1 });

        console.log('🍽 Filtered meals found:', {
            count: foodEntries.length,
            dates: foodEntries.map(entry => entry.date)
        });

        res.json(foodEntries);
    } catch (error) {
        console.error("❌ Error fetching food intake:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a food entry
router.delete("/food-intake/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const mealId = req.params.id;

        console.log('Attempting to delete meal:', { mealId, userId });

        // Validate mealId format
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return res.status(400).json({ error: "Invalid meal ID format" });
        }

        // Find and delete the meal, ensuring it belongs to the correct user
        const deletedMeal = await FoodIntake.findOneAndDelete({
            _id: mealId,
            userId: userId
        });

        if (!deletedMeal) {
            console.log('Meal not found or unauthorized');
            return res.status(404).json({ error: "Meal not found or unauthorized" });
        }

        console.log('Successfully deleted meal:', deletedMeal);
        res.json({ 
            message: "Food entry deleted", 
            deletedMeal 
        });

    } catch (error) {
        console.error("Error deleting food intake:", error);
        res.status(500).json({ error: "Failed to delete meal" });
    }
});

// Add this new route to handle name-based deletion
router.delete("/food-intake/by-name/:name", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const foodName = req.params.name;

        console.log('Attempting to delete meal by name:', { foodName, userId });

        // Find and delete the meal by name and user ID
        const deletedMeal = await FoodIntake.findOneAndDelete({
            userId: userId,
            foodName: foodName
        });

        if (!deletedMeal) {
            console.log('Meal not found or unauthorized');
            return res.status(404).json({ error: "Meal not found or unauthorized" });
        }

        console.log('Successfully deleted meal:', deletedMeal);
        res.json({ message: "Food entry deleted", deletedMeal });

    } catch (error) {
        console.error("Error deleting food intake:", error);
        res.status(500).json({ error: "Failed to delete meal" });
    }
});

// Add this new debug route
router.get("/food-intake-debug/today", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const meals = await FoodIntake.find({
            userId: new mongoose.Types.ObjectId(userId),
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        console.log('Debug - Today\'s meals:', {
            count: meals.length,
            meals: meals.map(meal => ({
                name: meal.foodName,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fats: meal.fats,
                date: meal.date
            }))
        });

        res.json({
            count: meals.length,
            meals: meals
        });

    } catch (error) {
        console.error("Debug endpoint error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Add this debug route to check the latest meal
router.get("/food-intake-debug/latest", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const latestMeal = await FoodIntake.findOne({ 
            userId: new mongoose.Types.ObjectId(userId) 
        }).sort({ date: -1 });

        console.log('Latest meal data:', {
            meal: latestMeal,
            fatsValue: latestMeal?.fats,
            fatType: typeof latestMeal?.fats
        });

        res.json(latestMeal);
    } catch (error) {
        console.error("Debug endpoint error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/meals/:date', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const dateQuery = req.params.date; // Format: YYYY-MM-DD

    // Create start and end of the day in UTC
    const startDate = new Date(dateQuery);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(dateQuery);
    endDate.setUTCHours(23, 59, 59, 999);

    const meals = await FoodIntake.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });

    res.json({ meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

export default router;
