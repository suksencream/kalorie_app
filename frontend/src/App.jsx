import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [foodData, setFoodData] = useState(null);
  const [error, setError] = useState("");

  const fetchFoodData = async () => {
    if (!query) {
      setError("Please enter a food name");
      return;
    }

    setError(""); // Clear previous errors
    setFoodData(null); // Clear previous data

    try {
      const response = await axios.get(`http://localhost:5000/api/food?query=${query}`);
      setFoodData(response.data);
    } catch (err) {
      console.log(err)
      setError("Food not found or server error");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Food Nutrition Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter food name..."
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={fetchFoodData} style={{ marginLeft: "10px", padding: "10px" }}>
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {foodData && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px", width: "300px", margin: "auto" }}>
          <h2>{foodData.name}</h2>
          <p><strong>Serving Size:</strong> {foodData.servingSize}</p>
          <p><strong>Calories:</strong> {foodData.calories} kcal</p>
          <p><strong>Protein:</strong> {foodData.protein} g</p>
          <p><strong>Carbs:</strong> {foodData.carbs} g</p>
          <p><strong>Fats:</strong> {foodData.fats} g</p>
        </div>
      )}
    </div>
  );
};

export default App;