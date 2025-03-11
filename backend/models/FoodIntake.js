import mongoose from "mongoose";

const FoodIntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  servingSize: { type: String},
  image: { type: String },
  date: { type: Date, default: Date.now } // Timestamp for when food was eaten
});

const FoodIntake = mongoose.model("FoodIntake", FoodIntakeSchema);
export default FoodIntake;
