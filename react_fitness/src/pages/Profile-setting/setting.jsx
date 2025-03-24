import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./setting.css";

const calculateCalorieDeficit = (userData) => {
  if (!userData.weight || !userData.height || !userData.age) return 0;

  const baseCalories = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age;
  let activityFactor = 1.2;
  if (userData.activityLevel === "light") activityFactor = 1.375;
  else if (userData.activityLevel === "moderate") activityFactor = 1.55;
  else if (userData.activityLevel === "very active") activityFactor = 1.725;

  let calorieNeeds = baseCalories * activityFactor;
  if (userData.sex === "male") calorieNeeds += 5;
  else if (userData.sex === "female") calorieNeeds -= 161;

  let deficit = calorieNeeds;

  if (userData.goals === "lose") deficit -= 500;
  else if (userData.goals === "gain") deficit += 500;

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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    activityLevel: "",
    goals: "",
    speedOfProgress: "",
    email: ""
  });
  const [userEmail, setUserEmail] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.firstName) newErrors.firstName = "This field is required";
    if (!profileData.lastName) newErrors.lastName = "This field is required";
    if (!profileData.age) newErrors.age = "This field is required";
    if (!profileData.weight) newErrors.weight = "This field is required";
    if (!profileData.height) newErrors.height = "This field is required";
    if (!profileData.sex) newErrors.sex = "This field is required";
    if (!profileData.activityLevel) newErrors.activityLevel = "This field is required";
    if (!profileData.goals) newErrors.goals = "This field is required";
    if (!profileData.speedOfProgress) newErrors.speedOfProgress = "This field is required";

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Fetched profile data:', data);

      setUserEmail(data.email || '');

      setProfileData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        age: data.age?.toString() || '',
        weight: data.weight?.toString() || '',
        height: data.height?.toString() || '',
        sex: data.sex || '',
        activityLevel: data.activityLevel || '',
        goals: data.goals || '',
        speedOfProgress: data.speedOfProgress || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    console.log('Current profile data:', profileData);

    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const dataToSend = {
        ...profileData,
        age: profileData.age ? Number(profileData.age) : undefined,
        weight: profileData.weight ? Number(profileData.weight) : undefined,
        height: profileData.height ? Number(profileData.height) : undefined
      };

      console.log('Sending data to server:', dataToSend);

      const response = await fetch('http://localhost:5000/api/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Server response status:', response.status);

      const data = await response.json();
      console.log('Server response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to update profile');
      }

      setProfileData(prev => ({
        ...prev,
        ...data.user
      }));
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container">
      <div className="settings-container">
        <div className="profile-header">
          <div className="profile-info-section">
            <img src="/Burger.png" alt="Profile" className="profile-icon" />
            <div className="profile-info">
              <h2>{profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'Update your profile'}
              </h2>
              <p>{userEmail}</p>
            </div>
          </div>
          
          <div className="button-group">
            {!isEditing ? (
              <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
            ) : (
              <>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  fetchProfile();
                }}>Cancel</button>
              </>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSave} className="settings-form">
          <div className="form-grid">
            {/* First Column */}
            <div className="form-column">
              {[
                ["firstName", "First Name *"],
                ["lastName", "Last Name *"],
                ["age", "Age *"],
                ["weight", "Weight (kg) *"],
                ["height", "Height (cm) *"]
              ].map(([name, label]) => (
                <div className="input-group" key={name}>
                  <label>{label}</label>
                  <input 
                    type={name === "age" || name === "weight" || name === "height" ? "number" : "text"}
                    name={name}
                    value={profileData[name]}
                    onChange={handleInputChange}
                    placeholder={`Your ${label}`}
                    disabled={!isEditing}
                  />
                  {errors[name] && <p className="error-message">{errors[name]}</p>}
                </div>
              ))}
            </div>

            {/* Second Column */}
            <div className="form-column">
              {[
                ["sex", "Sex *"],
                ["activityLevel", "Activity Level *"],
                ["goals", "Goals *"],
                ["speedOfProgress", "Speed of Progress *"]
              ].map(([name, label]) => (
                <div className="input-group" key={name}>
                  <label>{label}</label>
                  <select 
                    name={name} 
                    value={profileData[name]} 
                    onChange={handleInputChange} 
                    disabled={!isEditing}
                  >
                    <option value="">Select {label}</option>
                    {name === "sex" && [
                      ["male", "Male"],
                      ["female", "Female"]
                    ].map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                    {name === "activityLevel" && [
                      ["sedentary", "Sedentary"],
                      ["lightly active", "Lightly Active"],
                      ["moderately active", "Moderately Active"],
                      ["very active", "Very Active"]
                    ].map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                    {name === "goals" && [
                      ["lose weight", "Lose Weight"],
                      ["maintain weight", "Maintain Weight"],
                      ["gain weight", "Gain Weight"]
                    ].map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                    {name === "speedOfProgress" && [
                      ["slow", "Slow"],
                      ["moderate", "Moderate"],
                      ["fast", "Fast"]
                    ].map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {errors[name] && <p className="error-message">{errors[name]}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="calorie-result">
            <p>Estimated Daily Calories: {Math.max(0, calculateCalorieDeficit(profileData)).toFixed(0)}</p>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export { calculateCalorieDeficit };
export default Setting;