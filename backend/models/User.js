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
  sex: { type: String, enum: ["male", "female"] },
  activityLevel: { 
    type: String,  
    enum: ["sedentary", "lightly active", "moderately active", "very active"] 
  },
  goals: { 
    type: String,  
    enum: ["lose weight", "maintain weight", "gain weight"] 
  },
  speedOfProgress: { 
    type: String,  
    enum: ["slow", "moderate", "fast"]
  }, 
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const User = mongoose.model("User", UserSchema);

export default User;