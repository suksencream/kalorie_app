import { useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/Login/login';
import SignUpPage from './pages/Signup/signup';
import BurgerLayout from "./components/BurgerLayout";
import CalorieTab from "./components/CaloriesTab";
import CalorieTracker from "./components/CalorieTracker";
import MacronutrientTracker from "./components/MacronutrientTracker";
import TodayMeals from "./components/TodayMeals";
import BMICalculator from './pages/BMI/BMICalculator';
import BeginnerWorkouts from './pages/Beginnerworkouts';
import IntermediateWorkouts from './pages/Intermediateworkouts';
import AdvancedWorkouts from './pages/Advancedworkouts';
import WorkoutDetails from './pages/Workoutdetails';
import Setting from './pages/Profile-setting/setting';
import Sidebar from "./components/sidebar";
import FitnessPage from './pages/Fitness';
import Header from "./components/Header";
import PrivacyPolicy from "./pages/sidebar/Privacypolicy";
import TermsConditions from "./pages/sidebar/Termsconditions";
import AboutUs from "./pages/sidebar/Aboutus";
import DeleteAccount from "./pages/sidebar/Delete";
import Logout from "./pages/sidebar/Logout";



const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location, navigate]);

  const hideHeaderPages = ["/login", "/signup"];
  const showHeader = !hideHeaderPages.includes(location.pathname);


  return (
    <>
      {showHeader && <Header />}

      <Routes> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/sidebar' element={<Sidebar/>} />
        <Route path='/privacy' element={<PrivacyPolicy/>} />
        <Route path='/terms' element={<TermsConditions/>} />
        <Route path='/aboutus' element={<AboutUs/>} />
        <Route path='/delete' element={<DeleteAccount/>} />
        <Route path='/logout' element={<Logout/>} />
        <Route path="/calories" element={<><BurgerLayout/> <CalorieTracker/> <MacronutrientTracker/></>} />
        <Route path="/calorieintake" element={<CalorieTab/>} />
        <Route path="/today-meals" element={<TodayMeals />} />
        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/setting" element={<Setting />} /> 
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/beginner-workouts" element={<BeginnerWorkouts />} />
        <Route path="/intermediate-workouts" element={<IntermediateWorkouts />} />
        <Route path="/advanced-workouts" element={<AdvancedWorkouts />} />
        <Route path="/workout/:id" element={<WorkoutDetails />} />
      </Routes>
    </>
  );
};

function App() {
  useEffect(() => {

    const cursor = document.createElement('div');
    cursor.style.position = 'absolute';
    cursor.style.zIndex = '9999';
    cursor.style.pointerEvents = 'none';
    cursor.style.fontSize = '24px'; 
    cursor.innerHTML = '🍔'; 
    document.body.appendChild(cursor);


    const updateCursor = (e) => {
      cursor.style.left = `${e.pageX + 10}px`; 
      cursor.style.top = `${e.pageY + 10}px`;
    };


    document.addEventListener('mousemove', updateCursor);


    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.body.removeChild(cursor);
    };
  }, []);
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
