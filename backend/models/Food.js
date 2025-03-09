import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fats: { type: Number, required: true },
  carbs: { type: Number, required: true }
});

const Food = mongoose.model("Food", FoodSchema);

export default Food;