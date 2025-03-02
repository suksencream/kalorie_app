import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import BMICalculator from "./pages/BMI/BMICalculator";
import LoginPage from "./pages/Login/login";
import SignUpPage from "./pages/Signup/signup";
import Setting from "./pages/Profile-setting/setting";

const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/bmi" element={<BMICalculator />} />
      <Route path="/setting" element={<Setting />} /> 
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
