import './Workoutcard.css';

const WorkoutCard = ({ title, minutes, image, onClick }) => {
  return (
    <div className="workout-card2" onClick={onClick}>
      <div className="text">
        <h3>{title}</h3>
        <p>{minutes} minutes</p>
      </div>
      <img src={image} alt={title} />
    </div>
  );
};

export default WorkoutCard;
