import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  calories_per_300g: { type: Number, required: true },
  protein_g: { type: Number, required: true },
  fats_g: { type: Number, required: true },
  carbs_g: { type: Number, required: true }
});

const Food = mongoose.model("Food", FoodSchema);

export default Food;