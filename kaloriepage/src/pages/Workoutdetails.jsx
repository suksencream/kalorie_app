import { useParams } from 'react-router-dom';
import "./Workoutdetails.css"
import jjacksImg from "../assets/jumpingjack.svg"
import rtwistImg from "../assets/russiantwist.svg"
import mclimberImg from "../assets/mountainclimber.svg"
import fkickImg from "../assets/flutterkick.svg"
import plankImg from "../assets/plank.svg"

const WorkoutDetails = () => {
  const { id } = useParams();

  const workoutData = {
    1: {
      title: 'Abs Beginner',
      minutes: 12,
      workouts: [
        { id: 1, name: 'Jumping Jacks', reps: '00:30', image: jjacksImg },
        { id: 2, name: 'Russian Twist', reps: 'x 16', image: rtwistImg },
        { id: 3, name: 'Mountain Climber', reps: 'x 18', image: mclimberImg },
        { id: 4, name: 'Flutter Kicks', reps: '00:15', image: fkickImg },
        { id: 5, name: 'Plank', reps: '00:30', image: plankImg }
      ]
    }
  };

  const workout = workoutData[id];

  return (
    <div className="workout-details">
      <h2>{workout.title}</h2>
      <p>{workout.minutes} minutes | {workout.workouts.length} workouts</p>
      <h3>Workout List</h3>
      <div className="workout-items">
        {workout.workouts.map((w) => (
          <div className="workout-item" key={w.id}>
            <img src={w.image} alt={w.name} />
            <p>{w.name}</p>
            <span>{w.reps}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetails;
