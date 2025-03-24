import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Signup/signup.css"

const VerifyMail = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Get the email from localStorage that was used in forgot password
    const email = localStorage.getItem('resetEmail');

    const handleSendAgain = async () => {
        if (!email) {
            setError("Email not found. Please try again from the signup page.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setError("");
                // Show success message temporarily
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(data.error || "Failed to send email");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to send email. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <img src="/email-sent.png" alt="Email Sent" className="email-image"/>
                <h2 className="signup-title">Check Your Email</h2>
                <p>Check your email to verify your account.</p>
                <button 
                    className="signup-button" 
                    onClick={handleSendAgain}
                >
                    Send Again
                </button>
                {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}
                {success && <p className="success-text" style={{color: 'green'}}>✅ Email sent successfully!</p>}
                <p className="signup-link"><Link to="/login">I'll try later.</Link></p>
                <p className="signup-link">
                    Didn't receive the email? Check the spam or <Link to="/forgotpassword">try another email address</Link>
                </p>
            </div>
        </div>
    )
}

export default VerifyMail;