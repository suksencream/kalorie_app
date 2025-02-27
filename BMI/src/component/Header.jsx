import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img src="/LOGO.png" alt="logo" />
        <span>
          <b>
            <i>Kalories</i>
          </b>
        </span>
      </NavLink>
      <ul className="nav-links">
        <NavLink to="/calories" className={({ isActive }) => (isActive ? "active" : "")}>
          Calories
        </NavLink>
        <NavLink to="/bmi" className={({ isActive }) => (isActive ? "active" : "")}>
          BMI
        </NavLink>
        <NavLink to="/fitness" className={({ isActive }) => (isActive ? "active" : "")}>
          Fitness
        </NavLink>
      </ul>
    </nav>
  );
};

export default Header;
