import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import BMICalculator from "./pages/BMI/BMICalculator";
import LoginPage from "./pages/Login/Login";
import SignUpPage from "./pages/Signup/signup";

const AppWrapper = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/"); // Force redirect to login on reload
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/bmi" element={<BMICalculator />} />
    </Routes>
  );
};
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
