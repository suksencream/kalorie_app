import { useState } from "react";
import { User, Shield, FileText, Info, Trash2, LogOut } from "lucide-react";
import DeleteAccount from "../pages/sidebar/Delete";
import Logout from "../pages/sidebar/Logout";
import "./Sidebar.css";

const Sidebar = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="sidebar">
        {/* Profile Section */}
        <div className="profile">
          <div className="profile-picture">S</div>
          <h3 className="username">Satt Satt</h3>
        </div>

        {/* Sidebar Menu */}
        <ul className="menu">
          <li><a href="/setting"><User size={20} /> Profile</a></li>
          <li><a href="/privacy"><Shield size={20} /> Privacy Policy</a></li>
          <li><a href="/terms"><FileText size={20} /> Terms & Conditions</a></li>
          <li><a href="/aboutus"><Info size={20} /> About Us</a></li>
          <li className="delete">
            <button onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={20} /> Delete Account
            </button>
          </li>
          <li className="logout">
            <button onClick={() => setShowLogoutModal(true)}>
              <LogOut size={20} /> Log Out
            </button>
          </li>
        </ul>

        <p className="version">Version 1.0.1</p>
      </div>

      {/* Render Modals Conditionally */}
      {showDeleteModal && <DeleteAccount onClose={() => setShowDeleteModal(false)} />}
      {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
    </>
  );
};

export default Sidebar;
