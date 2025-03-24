import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Signup/signup.css"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from URL query parameters
    const token = new URLSearchParams(location.search).get('token');

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match. Re-enter your password.");
            setSuccess(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setError("");
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(data.error || "Failed to reset password");
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError("An error occurred while resetting password");
            setSuccess(false);
        }
    }

    // Add validation for token
    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Reset Password</h2>
                <form onSubmit={handleReset}>
                    <div className="signup-input">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="in"
                            disabled={!token} // Disable if no token
                        />
                    </div>
                    <div className="signup-input">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="in"
                            disabled={!token} // Disable if no token
                        />
                        {error && <p className="error-text">{error}</p>}
                    </div>
                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={!token} // Disable if no token
                    >
                        Reset Password
                    </button>
                    {success && <p className="success-text">✅ Successfully reset your password.</p>}
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;