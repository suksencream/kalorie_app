import WorkoutCard from './Workoutcard';
import './Workoutlist.css';

const WorkoutList = ({ workouts, onSelectWorkout }) => {
  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          title={workout.title}
          minutes={workout.minutes}
          image={workout.image}
          onClick={() => onSelectWorkout(workout)}
        />
      ))}
    </div>
  );
};

export default WorkoutList;
