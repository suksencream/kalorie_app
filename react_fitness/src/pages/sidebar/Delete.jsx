import "./Delete.css";

const DeleteAccount = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Are you sure you want to delete your account?</h2>
        <p>This action cannot be undone.</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
