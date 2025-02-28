import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signed up with:", { email, password, agreed });

    // Redirect user to login page after signup
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <button className="back-button" onClick={() => window.history.back()}>
          ←
        </button>

        <h2 className="signup-title">Be our Burger Today!</h2>

        <form onSubmit={handleSubmit}>
          <div className="signup-input">
            <span className="mr-10">🍔</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="in"
            />
          </div>

          <div className="signup-input">
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

          <div className="signup-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              required
            />
            <label>I agree to Terms & Conditions.</label>
          </div>
          <button type="submit" className="signup-button">
            Register
          </button>

          <p className="signup-link">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
