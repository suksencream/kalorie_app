import { Link, useNavigate } from "react-router-dom";
import "../Signup/signup.css"

const CheckMail = () => {
    const navigate = useNavigate()

    return (
        <div className="signup-container">
            <div className="signup-box">
                <img src="/email-sent.png" alt="Email Sent" className="email-image"/>
                <h2 className="signup-title">Check Your Email</h2>
                <p>We've sent you a password recovery instruction to your email.</p>
                <button className="signup-button">Send Again</button>
                <p className="signup-link"><Link to="/login">I'll try later.</Link></p>
                <p className="signup-link">
                    Didn't receive the email? Check the spam or <Link to="/forgotpassword">try another email address</Link>
                </p>
            </div>
        </div>
    )
}

export default CheckMail;