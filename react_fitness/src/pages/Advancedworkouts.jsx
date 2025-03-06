import { useNavigate } from 'react-router-dom';
import './Beginnerworkouts.css';
import absImg from "../assets/absAd.svg"
import buttImg from "../assets/buttAd.svg"
import thighImg from "../assets/thighAd.svg"

const AdvancedWorkouts = () => {
  const navigate = useNavigate();

  const workouts = [
    { id: "abs-ad", title: 'Abs Advanced', minutes: 25, image: absImg },
    { id: "butt-ad", title: 'Butt Advanced', minutes: 24, image: buttImg },
    { id: "thigh-ad", title: 'Thigh Advanced', minutes: 21, image: thighImg }
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
            style={{ backgroundColor: "#FFD7D4" }}
          >
            <div className='text'>
              <h3>{workout.title}</h3>
              <div className='ex-number' style={{ backgroundColor: "#EE7E78" }}>{workout.minutes} min</div>
            </div>
            <img src={workout.image} alt={workout.title} className='ex-image' />
          </div>
        ))}

      </div>  
    </div>
  );
};

export default AdvancedWorkouts;
