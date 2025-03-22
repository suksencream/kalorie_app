import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Re-enter your password.");
      setSuccess(false);
      return;
    }

    try {
      // Make API call to your backend server
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
        setSuccess(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setSuccess(false);
      console.error("Signup error:", err);
    }
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
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="in"
            />
          </div>

          <div className="signup-input">
            <span className="mr-10">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="in"
            />
          </div>

          <div className="signup-input">
            <span className="mr-10">🔄</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="in"
            />
            {error && <p className="error-text">{error}</p>}
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
          <button type="submit" className="signup-button" disabled={!agreed}>
            Register
          </button>

          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;