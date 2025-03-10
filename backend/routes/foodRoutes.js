import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Food from "../models/Food.js"; // Import Food model

dotenv.config();
const router = express.Router();

router.get("/food", async (req, res) => {
  const query = req.query.query || "";

  try {
    // ✅ Step 1: Search for food in the database (exclude _id and __v)
    let dbFoods = await Food.find(
      { name: { $regex: query, $options: "i" } },
      { _id: 0, __v: 0 }
    ).limit(15);

    // ✅ Step 3: If already 10 results, return early
    if (dbFoods.length >= 15) {
      return res.json(dbFoods);
    }

    // ✅ Step 4: Fetch additional foods from Spoonacular
    const remaining = 15 - dbFoods.length;
    const searchResponse = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          query: query,
          number: remaining,
        },
      }
    );

    console.log(searchResponse.data.results)

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
            image: food.image || food.imageUrl || null // ✅ Spoonacular usually includes an image URL directly
          };
        } catch (error) {
          console.error(`Error fetching nutrition for ${food.title}:`, error.message);
          return null;
        }
      })
    );

    const validSpoonacularFoods = spoonacularFoods.filter((food) => food !== null);

    // ✅ Step 5: Combine and respond
    const combinedFoods = [...dbFoods, ...validSpoonacularFoods].slice(0, 10);
    return res.json(combinedFoods);

  } catch (error) {
    console.error("Error fetching food:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch food data" });
  }
});

export default router;
