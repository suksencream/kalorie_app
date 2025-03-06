import { useState } from "react";
import "./setting.css";

export const calculateCalorieDeficit = (userData) => {
  if (!userData.weight || !userData.height || !userData.age) return 0;

  const baseCalories = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age;
  let activityFactor = 1.2;
  if (userData.activityLevel === "Lightly Active") activityFactor = 1.375;
  else if (userData.activityLevel === "Moderately Active") activityFactor = 1.55;
  else if (userData.activityLevel === "Very Active") activityFactor = 1.725;

  let calorieNeeds = baseCalories * activityFactor;
  if (userData.gender === "Male") calorieNeeds += 5;
  else if (userData.gender === "Female") calorieNeeds -= 161;

  let deficit = calorieNeeds;

  if (userData.goals === "Lose Weight") deficit -= 500;
  else if (userData.goals === "Gain Muscle") deficit += 500;

  if (userData.speedOfProgress === "Slow") {
    deficit -= 250;
  } else if (userData.speedOfProgress === "Moderate") {
    deficit -= 500;
  } else if (userData.speedOfProgress === "Fast") {
    deficit -= 750;
  }

  return deficit;
};


const Setting = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    goals: "",
    speedOfProgress: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" >
      <div className="settings-container">
        <div className="profile-header">
          <img src="/Burger.png" alt="Profile" className="profile-icon" />
          <div className="profile-info">
            <h2>Burger Shouldbehealthy</h2>
            <p>burger123@gmail.com</p>
          </div>
        </div>

        <form className="settings-form">
          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="Your First Name" />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Your Last Name" />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Email address</label>
              <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Your Email" />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Your Age" />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Weight</label>
              <input type="number" name="weight" value={userData.weight} onChange={handleChange} placeholder="Your Weight" />
            </div>
            <div className="input-group">
              <label>Height</label>
              <input type="number" name="height" value={userData.height} onChange={handleChange} placeholder="Your Height" />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={userData.gender} onChange={handleChange}>
                <option value="">Your Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Activity Level</label>
              <select name="activityLevel" value={userData.activityLevel} onChange={handleChange}>
                <option value="">Your Activity Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Goals</label>
              <select name="goals" value={userData.goals} onChange={handleChange}>
                <option value="">Your Goals</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Gain Muscle">Gain Muscle</option>
              </select>
            </div>
            <div className="input-group">
              <label>Speed of progress</label>
              <select name="speedOfProgress" value={userData.speedOfProgress} onChange={handleChange}>
                <option value="">Your Speed of progress</option>
                <option value="Slow">Slow</option>
                <option value="Moderate">Moderate</option>
                <option value="Fast">Fast</option>
              </select>
            </div>
          </div>
        </form>

        <div className="calorie-result">
        <p>Estimated Daily Calories: {calculateCalorieDeficit(userData).toFixed(0)}</p>

        </div>
      </div>
    </div>
  );
};


export default Setting; 


// import React from "react";
// import Setting, { calculateCalorieDeficit } from "../path/to/Setting";

// const ExampleComponent = () => {
//   const userData = {
//     weight: 70, 
//     height: 175, 
//     age: 25, 
//     gender: "Male", 
//     activityLevel: "Moderately Active", 
//     goals: "Lose Weight"
//   };

//   const dailyCalories = calculateCalorieDeficit(userData);

//   return (
//     <div>
//       <h1>Calorie Deficit Calculation</h1>
//       <p>Your estimated daily calories: {dailyCalories}</p>

//       {/* Using the Setting component */}
//       <Setting />
//     </div>
//   );
// };

// export default ExampleComponent;
