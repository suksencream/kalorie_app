import { useNavigate } from "react-router-dom";
import WorkoutCard from "../components/Workoutcard.jsx"
import beginnerImg from "../assets/beginner.svg";
import "./Home.css"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="fitness-page">
      <WorkoutCard level="Beginner" workouts="6" imgSrc={beginnerImg} bgColor="#FFF5C2" btnColor="#FFD700" onClick={() => navigate("/beginner")} />
    </div>
  );
};

export default Home;
