import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Food from "../models/Food.js"; // Import Food model

dotenv.config();
const router = express.Router();

router.get("/food", async (req, res) => {
  const query = req.query.query || "";

  try {
    // ✅ Step 1: Search for food in the database (exclude `_id` and `__v`)
    let dbFoods = await Food.find(
      { name: { $regex: query, $options: "i" } },
      { _id: 0, __v: 0 } // Exclude unnecessary fields
    ).limit(10);

    // ✅ Step 2: Ensure correct field order for database results
    dbFoods = dbFoods.map((food) => ({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats
    }));

    // If we already have 10 results, return them
    if (dbFoods.length >= 10) {
      return res.json(dbFoods);
    }

    // ✅ Step 3: Fetch remaining foods from Spoonacular
    const remaining = 10 - dbFoods.length;
    const searchResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          query: query,
          number: remaining, // Fetch only the required number of foods
        },
      }
    );

    const spoonacularFoods = await Promise.all(
      searchResponse.data.results.map(async (food) => {
        try {
          const nutritionResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${food.id}/information`,
            {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                includeNutrition: true,
              },
            }
          );

          const nutrition = nutritionResponse.data.nutrition.nutrients;

          return {
            name: food.title,
            calories: nutrition.find((n) => n.name === "Calories")?.amount || 0,
            protein: nutrition.find((n) => n.name === "Protein")?.amount || 0,
            carbs: nutrition.find((n) => n.name === "Carbohydrates")?.amount || 0,
            fats: nutrition.find((n) => n.name === "Fat")?.amount || 0,
          };
        } catch (error) {
          console.error(`Error fetching nutrition for ${food.title}:`, error.message);
          return null; // Skip failed fetches
        }
      })
    );

    // Filter out any null values (failed fetches)
    const validSpoonacularFoods = spoonacularFoods.filter((food) => food !== null);

    // ✅ Step 4: Combine results and return (limit to 10)
    const combinedFoods = [...dbFoods, ...validSpoonacularFoods].slice(0, 10);
    return res.json(combinedFoods);

  } catch (error) {
    console.error("Error fetching food:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch food data" });
  }
});

export default router;
