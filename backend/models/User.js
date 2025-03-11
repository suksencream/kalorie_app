import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userPfp: { type: String },
  refreshToken: { type: String },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },  // in kg
  height: { type: Number, required: true },  // in cm
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  activityLevel: { 
    type: String, 
    required: true, 
    enum: ["sedentary", "lightly active", "moderately active", "very active", "super active"] 
  },
  goalWeight: { type: Number, required: true },  // in kg
  progressDuration: { type: Number, required: true } // in weeks
});

const User = mongoose.model("User", UserSchema);

export default User;