import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BMICalculator from "./pages/BMICalculator";
import Login from "./pages/Login";
import Header from "./component/Header";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BMICalculator />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
