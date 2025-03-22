import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");  // Corrected from 'username' to 'email'
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State to handle errors
  const navigate = useNavigate();  // Hook for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Log the data being sent
    console.log("Login attempt with:", { email, password });

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Log the full response details
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        // Log the specific error message from the server
        console.error("Login failed:", data.error);
        setError(data.error || "Failed to log in");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.userId);

      navigate("/loadingscreen");

    } catch (error) {
      console.error("Login error details:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/LOGO.png" alt="Kalories Logo" className="login-logo" />

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="login-input">
            <span className="mr-10">🍔</span>
            <input
              type="text"
              placeholder="Email"
              value={email}  // Corrected to use 'email'
              onChange={(e) => setEmail(e.target.value)}
              required
              className="in"
            />
          </div>

          <div className="login-input">
            <span className="mr-10">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="in"
            />
          </div>

          {/* Display error message if there's an error */}
          {error && <div className="error-message">{error}</div>}

          <div className="forgot-password"><Link to="/forgotpassword">Forgot your password?</Link></div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="login-link">
            Not our Burger yet? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
