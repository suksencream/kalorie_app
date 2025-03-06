import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Header.css";
import Sidebar from "../components/Sidebar"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isFitnessActive = location.pathname.startsWith("/fitness") || 
                            location.pathname.startsWith("/beginner-workouts") || 
                            location.pathname.startsWith("/intermediate-workouts") || 
                            location.pathname.startsWith("/advanced-workouts") || 
                            location.pathname.startsWith("/workout");

    const isCaloriesActive = location.pathname.startsWith("/calories") ||
                             location.pathname.startsWith("/calorieintake") ||
                             location.pathname.startsWith("/today-meals");
    return (
        <>
            <nav className="navbar">
                <div className="logo" onClick={() => setMenuOpen(!menuOpen)}>
                        <img src="/Burger.png" alt="menu" className="burger" />
                        <img src="/Kalories.svg" alt="Kalories" className="kalories" />
                </div>

                <div className="menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    ☰
                </div>

            <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
                <NavLink to="/calories" className={isCaloriesActive ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>
                Calories
                </NavLink>
                <NavLink to="/bmi" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMobileMenuOpen(false)}>
                BMI
                </NavLink>
                <NavLink to="/fitness" className={isFitnessActive ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>
                Fitness
                </NavLink>
            </ul>
            </nav>

            <div className={`sidebar-container ${menuOpen ? "open" : ""}`}>
                <Sidebar />
            </div>
            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </>

    );
};

export default Header;