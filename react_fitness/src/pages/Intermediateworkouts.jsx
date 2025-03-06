import { useNavigate } from 'react-router-dom';
import './Beginnerworkouts.css';
import absImg from "../assets/absInter.svg"
import buttImg from "../assets/buttInter.svg"
import thighImg from "../assets/thighInter.svg"

const IntermediateWorkouts = () => {
  const navigate = useNavigate();

  const workouts = [
    { id: "abs-inter", title: 'Abs Intermediate', minutes: 17, image: absImg },
    { id: "butt-inter", title: 'Butt Intermediate', minutes: 17, image: buttImg },
    { id: "thigh-inter", title: 'Thigh Intermediate', minutes: 16, image: thighImg }
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
            style={{ backgroundColor: "#FFE4BD" }}
          >
            <div className='text'>
              <h3>{workout.title}</h3>
              <div className='ex-number' style={{ backgroundColor: "#FDAD3D" }}>{workout.minutes} min</div>
            </div>
            <img src={workout.image} alt={workout.title} className='ex-image' />
          </div>
        ))}

      </div>  
    </div>
  );
};

export default IntermediateWorkouts;
