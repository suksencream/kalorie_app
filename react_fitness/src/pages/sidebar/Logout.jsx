import { useNavigate } from "react-router-dom";
import "./Delete.css";

const Logout = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Are you sure you want to log out?</h2>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="logout-btn" onClick={()=> navigate("/login")}>Log Out</button>

        </div>
      </div>
    </div>
  );
};

export default Logout;
