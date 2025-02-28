import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate authentication logic
    console.log("Logged in with:", { username, password });

    // Call onLogin to update login state
    if (onLogin) {
      onLogin();
    }

    // Redirect to BMI Calculator page
    navigate("/bmi");
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="in"
            />
          </div>

          <div className="forgot-password">Forgot your password?</div>

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
