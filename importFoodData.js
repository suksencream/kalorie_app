import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./backend/models/Food.js"; // Make sure you have a Food model
import fs from "fs";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


// Delete everything from the database
await Food.deleteMany({});
console.log("Old food data removed.");

// Read food data from the JSON file
const importFoodData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync("foodData.json", "utf-8"));

    // Insert data into MongoDB
    await Food.insertMany(data);
    console.log("Food data imported successfully!");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error importing food data:", error);
    mongoose.connection.close();
  }
};

// Run the import function
importFoodData();
