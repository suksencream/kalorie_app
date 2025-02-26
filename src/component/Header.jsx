import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./Header.css";

const Header = () => {
  const [activeTab, setActiveTab] = useState("BMI"); // Default active tab

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/login"> {/* Clicking the logo goes to /login */}
          <img src="./LOGO.png" alt="Kalories Logo" />
        </Link>
        <p>Kalories</p>
      </div>
      <ul className="nav-links">
        {["Calories", "BMI", "Fitness"].map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            <Link to={tab === "BMI" ? "/" : `/${tab.toLowerCase()}`}>
              {tab}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;

