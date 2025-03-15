import { useState } from "react";
import "./setting.css";

const calculateCalorieDeficit = (userData) => {
  if (!userData.weight || !userData.height || !userData.age) return 0;

  const baseCalories = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age;
  let activityFactor = 1.2;
  if (userData.activityLevel === "Lightly Active") activityFactor = 1.375;
  else if (userData.activityLevel === "Moderately Active") activityFactor = 1.55;
  else if (userData.activityLevel === "Very Active") activityFactor = 1.725;

  let calorieNeeds = baseCalories * activityFactor;
  if (userData.Sex === "Male") calorieNeeds += 5;
  else if (userData.Sex === "Female") calorieNeeds -= 161;

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
    age: "",
    weight: "",
    height: "",
    Sex: "",
    activityLevel: "",
    goals: "",
    speedOfProgress: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const newErrors = {};
    Object.keys(userData).forEach((key) => {
      if (!userData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/complete-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile successfully updated:", data);
        setIsEditable(false);
        setUserData(data);
      } else {
        const errorData = await response.json();
        console.error("Error completing profile:", errorData);
      }
    } catch (error) {
      console.error("Error during request:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="settings-container">
        <div className="profile-header">
          <img src="/Burger.png" alt="Profile" className="profile-icon" />
          <div className="profile-info">
            <h2>Burger Shouldbehealthy</h2>
            <p>burger123@gmail.com</p>
          </div>
        </div>
        <button className="edit" onClick={() => setIsEditable(true)}>Edit</button>
        <form onSubmit={handleSubmit} className="settings-form">
          {[
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
            ["age", "Age"],
            ["weight", "Weight"],
            ["height", "Height"],
            ["sex", "Sex"],
            ["activityLevel", "Activity Level"],
            ["goals", "Goals"],
            ["speedOfProgress", "Speed of Progress"],
          ].map(([name, label], index) => (
            <div className="input-group" key={name}>
              <label>{label}</label>
              {name === "sex" || name === "activityLevel" || name === "goals" || name === "speedOfProgress" ? (
                <select name={name} value={userData[name]} onChange={handleChange} disabled={!isEditable}>
                  <option value="">Select {label}</option>
                  {name === "sex" && ["Male", "Female"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  {name === "activityLevel" && ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  {name === "goals" && ["Lose Weight", "Maintain Weight", "Gain Muscle"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  {name === "speedOfProgress" && ["Slow", "Moderate", "Fast"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input type={name === "age" || name === "weight" || name === "height" ? "number" : "text"} name={name} value={userData[name]} onChange={handleChange} placeholder={`Your ${label}`} disabled={!isEditable} />
              )}
              {errors[name] && <p className="error-message">{errors[name]}</p>}
            </div>
          ))}

          <div className="calorie-result">
            <p>Estimated Daily Calories: {Math.max(0, calculateCalorieDeficit(userData)).toFixed(0)}</p>
          </div>

          <button className="submit" type="submit" disabled={!isEditable || isSaving}>{isSaving ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
  );
};

export { calculateCalorieDeficit };
export default Setting;