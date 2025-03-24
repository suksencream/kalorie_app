import { useState, useEffect } from "react";
import { User, Shield, FileText, Info, Trash2, LogOut, ChartColumnBig } from "lucide-react";
import DeleteAccount from "../pages/sidebar/Delete";
import Logout from "../pages/sidebar/Logout";
import "./Sidebar.css";


const Sidebar = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Get first initial of first name
  const getInitial = () => {
    return userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      <div className="sidebar">
        {/* Profile Section */}
        <div className="profile">
          <div className="profile-picture">{getInitial()}</div>
          <h3 className="username">
            {userData.firstName && userData.lastName 
              ? `${userData.firstName} ${userData.lastName}`
              : 'Update Profile'}
          </h3>
        </div>

        {/* Sidebar Menu */}
        <ul className="menu">
          <li><a href="/setting"><User size={20} /> Profile</a></li>
          <li><a href="/report"><ChartColumnBig size={20} /> Report</a></li>
          <li><a href="/privacy"><Shield size={20} /> Privacy Policy</a></li>
          <li><a href="/terms"><FileText size={20} /> Terms & Conditions</a></li>
          <li><a href="/aboutus"><Info size={20} /> About Us</a></li>
          <li className="logout">
            <button onClick={() => setShowLogoutModal(true)}>
              <LogOut size={20} /> Log Out
            </button>
          </li>
        </ul>

        <p className="version">Version 1.0.1</p>
      </div>

      {/* Render Modals Conditionally */}
      {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
    </>
  );
};

export default Sidebar;
