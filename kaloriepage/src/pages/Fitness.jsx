import { useNavigate } from "react-router-dom";
import "./Fitness.css";
import BeginnerImg from "../assets/beginner.svg"
import InterImg from "../assets/intermediate.svg"
import AdvancedImg from "../assets/advanced.svg"

const FitnessPage = () => {
  const navigate = useNavigate();

  // Define workout levels
  const workoutLevels = [
    { level: "Beginner", number: "6 Workout Types", image: BeginnerImg, route: "/beginner-workouts" },
    { level: "Intermediate", number: "8 Workout Types", image: InterImg, route: "#" },
    { level: "Advanced", number: "10 Workout Types", image: AdvancedImg, route: "#" },
  ];

  return (
    <div className="fitness-container">
      <h2>Select Your Fitness Level</h2>

      {workoutLevels.map((workout, index) => (
        <div key={index} className="workout-card" onClick={() => navigate(workout.route)}>
          <div className="text">
            <h3>{workout.level}</h3>
            <p>{workout.number}</p>
          </div>
          <img src={workout.image} alt={workout.level} />
        </div>
      ))}
    </div>
  );
};

export default FitnessPage;
