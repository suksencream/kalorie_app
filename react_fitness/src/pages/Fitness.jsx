import { useNavigate } from "react-router-dom";
import "./Fitness.css";
import BeginnerImg from "../assets/beginner.svg"
import InterImg from "../assets/intermediate.svg"
import AdvancedImg from "../assets/advanced.svg"


const FitnessPage = () => {
  const navigate = useNavigate();

  const workoutLevels = [
    { level: "Beginner", number: "6 Workout Types", image: BeginnerImg, route: "/beginner-workouts", bgColor: "#FCEFBB", btnColor: "#FFD83E", imgSize: "120px" },
    { level: "Intermediate", number: "8 Workout Types", image: InterImg, route: "/intermediate-workouts", bgColor: "#FFE4BD", btnColor: "#FDAD3D", imgSize: "190px" },
    { level: "Advanced", number: "10 Workout Types", image: AdvancedImg, route: "/advanced-workouts", bgColor: "#FFD7D4", btnColor: "#EE7E78", imgSize: "125px" },
  ];

  return (
    <div className="fitness-container">
      <div className="fitness-box">
        <h2>Select Your Fitness Level</h2>

        {workoutLevels.map((workout, index) => (
          <div
            key={index}
            className="workout-card"
            style={{ backgroundColor: workout.bgColor }}
            onClick={() => navigate(workout.route)}
          >
            <div className="text">
              <h3>{workout.level}</h3>
              <div
                className="workout-number"
                style={{ backgroundColor: workout.btnColor }}
              >
                {workout.number}
              </div>
            </div>
            <img src={workout.image} alt={workout.level} className="workout-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessPage;