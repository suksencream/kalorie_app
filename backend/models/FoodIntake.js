import mongoose from "mongoose";

const foodIntakeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        default: 0
    },
    protein: {
        type: Number,
        required: true,
        default: 0
    },
    carbs: {
        type: Number,
        required: true,
        default: 0
    },
    fats: {
        type: Number,
        required: true,
        default: 0
    },
    servingSize: {
        type: String,
        default: "1 serving"
    },
    image: {
        type: String,
        default: '/default-food.png'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const FoodIntake = mongoose.model("FoodIntake", foodIntakeSchema);

export default FoodIntake;
