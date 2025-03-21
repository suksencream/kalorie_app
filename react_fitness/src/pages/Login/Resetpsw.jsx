import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup/signup.css"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault()
        if (newPassword != confirmPassword) {
            setError ("Passwords don't match. Re-enter your password.")
            setSuccess(false)
        } else {
            setError("")
            setSuccess(true)
            setTimeout(() => {
                navigate("/login")
            }, 2000)
            //API call
        }
    }

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
                        />
                        {error && <p className="error-text">{error}</p>}
                    </div>
                    {success && <p className="success-text">✅ Successfully reset your password.</p>}
                </form>

            </div>
        </div>
    )
}
export default ResetPassword;
