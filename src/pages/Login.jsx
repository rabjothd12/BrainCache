import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      className="login-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
      <motion.div
        className="login-box"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Left */}
        <form
          className="login-left"
          onSubmit={step === "email" ? handleEmailSubmit : handleLogin}
        >
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
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

                <motion.button
                  className="email-btn"
                  type="submit"
                  disabled={!email}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <motion.button
                  className="email-btn"
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log In →
                </motion.button>

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
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Right */}
        <div className="login-right">
          {["Google", "Facebook", "Apple"].map((provider) => (
            <motion.button
              key={provider}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Continue with {provider}
            </motion.button>
          ))}

          <button
            type="button"
            className="link center"
            onClick={() => alert("SSO login")}
          >
            Continue with SSO
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="login-footer">
        <span>Terms of Use</span>
        <span>Privacy Policy</span>
      </footer>
    </motion.div>
  );
}

export default Login;
