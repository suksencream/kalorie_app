import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeginnerWorkouts from './pages/Beginnerworkouts';
import WorkoutDetails from './pages/Workoutdetails';
import FitnessPage from './pages/fitness';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FitnessPage/>} />
        <Route path="/fitness" element={<FitnessPage/>} />
        <Route path="/beginner-workouts" element={<BeginnerWorkouts />} />
        <Route path="/workout/:id" element={<WorkoutDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
