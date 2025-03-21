import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signed up with:", { email, password, agreed });
    //TODO: fetch the api and check the response
    if (password != confirmPassword) {
      setError ("Passwords don't match. Re-enter your password.")
      setSuccess (false)
    } else {
      setError("")
      setSuccess(true)
      navigate("/login");
    }
    // Redirect user to login page after signup
    
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

          <div className="signup-input">
            <span className="mr-10">🔄</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="in"
            />
            {error && <p className="error-text">{error}</p>}
          </div>
          {success}

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
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;