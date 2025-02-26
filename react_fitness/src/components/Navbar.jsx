import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        🍔 <span><b><i>Kalories</i></b></span>
      </NavLink>
      <ul className="nav-links">
        {["Calories", "BMI", "Fitness"].map((tab) => (
          <NavLink key={tab} to={`/${tab.toLowerCase()}`} className={({ isActive }) => (isActive ? "active" : "")}>
            {tab}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
