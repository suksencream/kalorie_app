import WorkoutList from '../components/Workoutlist';
import { useNavigate } from 'react-router-dom';
import './Beginnerworkouts.css';
import absImg from "../assets/abs.svg"
import buttImg from "../assets/butt.svg"
import thighImg from "../assets/thigh.svg"

const BeginnerWorkouts = () => {
  const navigate = useNavigate();

  const workouts = [
    { id: 1, title: 'Abs Beginner', minutes: 12, image: absImg },
    { id: 2, title: 'Butt Beginner', minutes: 11, image: buttImg },
    { id: 3, title: 'Thigh Beginner', minutes: 12, image: thighImg }
  ];

  const handleWorkoutClick = (workout) => {
    navigate(`/workout/${workout.id}`);
  };

  return (
    <div className="beginner-workouts">
      <h2>Hi Satt</h2>
      <p>Don’t Miss the Fitness!</p>
      <h3>Practice</h3>
      <WorkoutList workouts={workouts} onSelectWorkout={handleWorkoutClick} />
    </div>
  );
};

export default BeginnerWorkouts;
