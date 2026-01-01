import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep("password");
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup:", email, password);
  };

  return (
    <div className="login-page">
      {/* Title */}
      <div className="login-title">
        <h1>Sign Up</h1>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log In
          </Link>
        </p>
      </div>

      <div className="login-box">
        {/* Left */}
        <form
          className="login-left"
          onSubmit={step === "email" ? handleEmailSubmit : handleSignup}
        >
          {step === "email" && (
            <>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                className="email-btn"
                type="submit"
                disabled={!email}
              >
                Continue →
              </button>
            </>
          )}

          {step === "password" && (
            <>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button className="email-btn" type="submit">
                Create Account →
              </button>

              <button
                type="button"
                className="link"
                onClick={() => {
                  setPassword("");
                  setConfirmPassword("");
                  setStep("email");
                }}
              >
                ← Back
              </button>
            </>
          )}
        </form>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Right */}
        <div className="login-right">
          <button>Continue with Google</button>
          <button>Continue with Facebook</button>
          <button>Continue with Apple</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <span>Terms of Use</span>
        <span>Privacy Policy</span>
      </footer>
    </div>
  );
}

export default Signup;
