import React, { useState } from "react";
import "./BMI.css";
import Header from "../../component/Header";


const BMICalculator = () => {
  const [weight, setWeight] = useState(50);
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(165);
  const [gender, setGender] = useState(""); // Empty by default
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [suggestedWeightRange, setSuggestedWeightRange] = useState("");
  const [error, setError] = useState("");

  const calculateBMI = () => {
    if (!gender) {
      setError("Please select your gender before calculating BMI.");
      return;
    }

    setError("");
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    let adjustedStatus = "";
    if (bmiValue < 18.5) adjustedStatus = "Underweight";
    else if (bmiValue < 24.9) adjustedStatus = "Healthy";
    else if (bmiValue < 29.9) adjustedStatus = "Overweight";
    else adjustedStatus = "Obese";

    setStatus(adjustedStatus);

    const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    setSuggestedWeightRange(`${minWeight} - ${maxWeight} kg`);
  };

  const getBMIPosition = (bmi) => {
    if (bmi <= 18.5) return (bmi / 18.5) * 25;
    if (bmi <= 24.9) return 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
    if (bmi <= 29.9) return 50 + ((bmi - 24.9) / (29.9 - 24.9)) * 25;
    return 75 + ((bmi - 29.9) / (40 - 29.9)) * 25;
  };

  return (
    <div className="container">
      <Header />
      <h2 className="title">BMI Calculator</h2>
      <div className="gender-selection">
        <button className={gender === "male" ? "selected male" : "male"} onClick={() => setGender("male")}>
          &#9794; <br /> Male
        </button>
        <button className={gender === "female" ? "selected female" : "female"} onClick={() => setGender("female")}>
          &#9792; <br /> Female
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="input-container">
        <div className="input-box">
          <p>Weight (kg)</p>
          <div className="input-controls">
            <button className="minus" onClick={() => setWeight(weight - 1)}>-</button>
            <span className="num">{weight}</span>
            <button className="plus" onClick={() => setWeight(weight + 1)}>+</button>
          </div>
        </div>
        <div className="input-box">
          <p>Age</p>
          <div className="input-controls">
            <button className="minus" onClick={() => setAge(age - 1)}>-</button>
            <span className="num">{age}</span>
            <button className="plus" onClick={() => setAge(age + 1)}>+</button>
          </div>
        </div>
      </div>
      <div className="height-box">
        <p>Height (cm)</p>
        <span className="num">{height}</span>
        <input className="slider" type="range" min="50" max="220" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} />
      </div>
      <button className="calculate" onClick={calculateBMI}>Calculate</button>
      {bmi && (
        <div className="result-container">
          <div className="result-box">
            <div className="bmi-result">
              <h2 className="result">Your BMI:</h2>
              <p className="bmi-num">{bmi}</p>
              <div className="bmi-gauge">
                <div className="bmi-gauge-bar">
                  <div className="bmi-indicator" style={{ left: `${getBMIPosition(bmi)}%`, transform: "translateX(-50%)" }}></div>
                </div>
                <div className="bmi-labels">
                  <span>0</span>
                  <span>18.5</span>
                  <span>24.9</span>
                  <span>29.9</span>
                  <span>40</span>
                </div>
              </div>
              <div className="bmi-extra-info">
                <p>Your suggested weight range: <strong>{suggestedWeightRange}</strong></p>
                <p className={`bmi-category ${status.toLowerCase()}`}>
                  Your BMI category is: <strong>{status}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;