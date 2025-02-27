import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BMICalculator from "./pages/BMICalculator";
import Header from "./component/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/bmi" element={<BMICalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
