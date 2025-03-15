import { useNavigate } from "react-router-dom";
import "./Delete.css";

const Logout = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // Get and log the refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      console.log("Retrieved refresh token:", refreshToken ? "exists" : "not found");
      
      // Log the request we're about to make
      console.log("Attempting to call logout endpoint...");
      
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      console.log("Response status:", response.status);
      
      // Log the response body
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}: ${JSON.stringify(responseData)}`);
      }

      console.log("Clearing localStorage items...");
      // Clear auth items
      localStorage.clear();
      console.log("localStorage cleared");

      console.log("Navigating to login page...");
      navigate("/login");
      
    } catch (error) {
      console.error('Detailed logout error:', {
        message: error.message,
        error: error
      });
      
      // Still clear storage and redirect
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Are you sure you want to log out?</h2>
        <div className="modal-buttons">
          <button 
            className="cancel-btn" 
            onClick={() => {
              console.log("Cancel clicked");
              onClose();
            }}
          >
            Cancel
          </button>
          <button 
            className="logout-btn" 
            onClick={() => {
              console.log("Logout button clicked");
              handleLogout();
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
