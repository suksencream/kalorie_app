import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import Logo from "../assets/LOGO.svg";
import Kalories from "../assets/Kalories.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isFitnessActive = location.pathname.startsWith("/fitness") || 
                          location.pathname.startsWith("/beginner-workouts") || 
                          location.pathname.startsWith("/intermediate-workouts") || 
                          location.pathname.startsWith("/advanced-workouts") || 
                          location.pathname.startsWith("/workout");

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo-img" />
        <img src={Kalories} alt="Kalories" className="kalories-img" />
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink
          to="/calories"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setMenuOpen(false)}
        >
          Calories
        </NavLink>

        <NavLink
          to="/bmi"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setMenuOpen(false)}
        >
          BMI
        </NavLink>

        <NavLink
          to="/fitness"
          className={isFitnessActive ? "active" : ""}
          onClick={() => setMenuOpen(false)}
        >
          Fitness
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navbar;
