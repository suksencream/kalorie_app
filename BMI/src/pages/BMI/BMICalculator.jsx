import React from "react";
import { useState } from "react";
import "./BMI.css";


const BMICalculator = () => {
  const [weight, setWeight] = useState(50);
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(165);
  const [gender, setGender] = useState(""); // Empty by default
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [suggestedWeightRange, setSuggestedWeightRange] = useState("");
  const [error, setError] = useState(""); // State to show an error message

  // Function to calculate BMI
  const calculateBMI = () => {
    if (!gender) {
      setError("Please select your gender before calculating BMI.");
      return; // Stop execution
    }

    setError(""); // Clear any previous errors

    const heightInMeters = height / 100; // Convert cm to meters
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    // Adjust BMI classification based on gender
    let adjustedStatus = "";
    if (bmiValue < 18.5) adjustedStatus = "Underweight";
    else if (bmiValue < 24.9) adjustedStatus = "Healthy";
    else if (bmiValue < 29.9) adjustedStatus = "Overweight";
    else adjustedStatus = "Obese";

    setStatus(adjustedStatus);

    // Calculate suggested weight range for a healthy BMI (18.5 - 24.9)
    const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    setSuggestedWeightRange(`${minWeight} - ${maxWeight} kg`);
  };

  return (
    <div className="container">
      <h2 className="title">BMI Calculator</h2>

      {/* Gender Selection */}
      <div className="gender-selection">
        <button
          className={gender === "male" ? "selected male" : "male"}
          onClick={() => setGender("male")}
        >
          &#9794; <br /> Male
        </button>
        <button
          className={gender === "female" ? "selected female" : "female"}
          onClick={() => setGender("female")}
        >
          &#9792; <br /> Female
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Input Fields */}
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
        <input
          className="slider"
          type="range"
          min="50"
          max="220"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
        />
      </div>

      {/* Calculate Button */}
      <button className="calculate" onClick={calculateBMI}>
        Calculate
      </button>

      {/* BMI Result - Only appears when BMI is calculated */}
      {bmi && (
        <div className="result-container">
        <div className="result-box">
          <div className="bmi-result">
            <h2 className="result">Your BMI:</h2>
            <p className="bmi-num">{bmi}</p>

            {/* BMI Gauge Representation */}
            <div className="bmi-gauge">
              <div className="bmi-gauge-bar">
                <div
                  className="bmi-indicator"
                  style={{ left: `${((bmi - 0) / (40 - 0)) * 100}%`, transform: "translateX(-0%)" }}
                ></div>
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
