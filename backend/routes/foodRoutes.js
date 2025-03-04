import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// test if route is working
router.get("/test", (req, res) => {
    res.send("Food API is working!");
});

router.get("/food", async (req, res) => {
  const query = req.query.query || "";

  try {
    // Step 1: Get food ID by searching for the food
    const searchResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          query: query,
          number: 1, // Get only the first result
        },
      }
    );

    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      return res.status(404).json({ error: "Food not found" });
    }

    const foodId = searchResponse.data.results[0].id;

    // Step 2: Get nutrition info using the food ID
    const nutritionResponse = await axios.get(
      `https://api.spoonacular.com/recipes/${foodId}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      }
    );

    const nutrition = nutritionResponse.data.nutrition.nutrients;
    const servingSize = nutritionResponse.data.nutrition.weightPerServing;
    const servingAmount = servingSize?.amount || "Unknown";
    const servingUnit = servingSize?.unit || "Unknown";

    // Extract relevant nutrition data
    const calories = nutrition.find((n) => n.name === "Calories")?.amount || 0;
    const protein = nutrition.find((n) => n.name === "Protein")?.amount || 0;
    const carbs = nutrition.find((n) => n.name === "Carbohydrates")?.amount || 0;
    const fats = nutrition.find((n) => n.name === "Fat")?.amount || 0;
    
    return res.json({
      name: query,
      servingSize: `${servingAmount} ${servingUnit}`,
      calories,
      protein,
      carbs,
      fats,
    });

  } catch (error) {
    console.error("Error fetching food:", error.response?.data || error.message);

    if (!res.headersSent) {
      return res.status(500).json({ error: error.response?.data || "Failed to fetch food data" });
    }
  }
});

export default router;