import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup/signup.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleContinue = async (e) => {
        e.preventDefault();
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
                // Store email in localStorage before navigating
                localStorage.setItem('resetEmail', email);
                navigate("/checkyouremail");
            } else {
                // Handle error cases
                console.error(data.error);
                // You might want to show an error message to the user here
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle network errors
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Forgot Password</h2>
                <p>Enter the email you've created the account with. We'll send you an email to reset your password.</p>
                <form onSubmit={handleContinue}>
                    <div className="signup-input">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="in"
                        />

                    </div>
                    <button type="submit" className="signup-button">Continue</button>

                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;