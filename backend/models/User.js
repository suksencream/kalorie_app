import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  userPfp: { type: String },
  refreshToken: { type: String },
  age: { type: Number},
  weight: { type: Number},  // in kg
  height: { type: Number},  // in cm
  gender: { type: String, enum: ["male", "female", "other"] },
  activityLevel: { 
    type: String,  
    enum: ["sedentary", "lightly active", "moderately active", "very active", "super active"] 
  },
  goalWeight: { type: Number},  // in kg
  progressDuration: { type: Number} // in weeks
});

const User = mongoose.model("User", UserSchema);

export default User;