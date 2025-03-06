import { useNavigate } from 'react-router-dom';
import './Beginnerworkouts.css';
import absImg from "../assets/absbeginner.svg"
import buttImg from "../assets/buttbeginner.svg"
import thighImg from "../assets/thighbeginner.svg"

const BeginnerWorkouts = () => {
  const navigate = useNavigate();

  const workouts = [
    { id: "abs-beginner", title: 'Abs Beginner', minutes: 12, image: absImg },
    { id: "butt-beginner", title: 'Butt Beginner', minutes: 11, image: buttImg },
    { id: "thigh-beginner", title: 'Thigh Beginner', minutes: 12, image: thighImg }
  ];


  return (
    <div className="ex-container">
      <div className='ex-box'>
        <h2>Hi Satt</h2>
        <p>Don’t Miss the Fitness!</p>
        <h3>Practice</h3>

        {workouts.map((workout, index)=> (
          <div
            key={index}
            className='ex-card'
            onClick={()=> navigate(`/workout/${workout.id}`)}
            style={{ backgroundColor: "#FCEFBB" }}
          >
            <div className='text'>
              <h3>{workout.title}</h3>
              <div className='ex-number' style={{ backgroundColor: "#FFD83E" }}>{workout.minutes} min</div>
            </div>
            <img src={workout.image} alt={workout.title} className='ex-image' />
          </div>
        ))}

      </div>  
    </div>
  );
};

export default BeginnerWorkouts;
