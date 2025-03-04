import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Modify this route to accept a food query

app.get("/", (req, res) => {
  res.send("Welcome to the Calorie Tracker API!");
});

app.get("/api/food", async (req, res) => {
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

    if (
      !searchResponse.data.results ||
      searchResponse.data.results.length === 0
    ) {
      return res.status(404).json({ error: "Food not found" }); // ✅ Return immediately
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
    const carbs =
    nutrition.find((n) => n.name === "Carbohydrates")?.amount || 0;
    const fats = nutrition.find((n) => n.name === "Fat")?.amount || 0;
    
    return res.json({
      // ✅ Use "return" to prevent further execution
      name: query,
      servingSize: `${servingAmount} ${servingUnit}`,
      calories,
      protein,
      carbs,
      fats,
    });
  } catch (error) {
    console.error("Error fetching food:", error);

    if (!res.headersSent) {
      // ✅ Check if headers were already sent before sending response
      return res.status(500).json({ error: "Failed to fetch food data" });
    }
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
