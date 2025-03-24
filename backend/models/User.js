import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    age: Number,
    weight: Number,
    height: Number,
    sex: String,
    activityLevel: String,
    goals: String,
    speedOfProgress: String,
    refreshToken: String
});

const User = mongoose.model("User", userSchema);

export default User;