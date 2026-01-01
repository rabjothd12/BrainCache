import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep("password");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">
      {/* Title */}
      <div className="login-title">
        <h1>Log In</h1>
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="login-box">
        {/* Left */}
        <form
          className="login-left"
          onSubmit={step === "email" ? handleEmailSubmit : handleLogin}
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
                type="button"
                className="link"
                onClick={() => alert("Forgot email flow")}
              >
                Forgot Email?
              </button>

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

              <button className="email-btn" type="submit">
                Log In →
              </button>

              <button
                type="button"
                className="link"
                onClick={() => {
                  setPassword("");
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

          <button
            type="button"
            className="link center"
            onClick={() => alert("SSO login")}
          >
            Continue with SSO
          </button>
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

export default Login;
