import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup/signup.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleContinue = (e) => {
        e.preventDefault()
        navigate("/checkyouremail")
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