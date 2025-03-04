import mongoose from "mongoose";

const FoodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const FoodEntry = mongoose.model("FoodEntry", FoodEntrySchema);

export default FoodEntry;