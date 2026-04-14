import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); 
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard"; 

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep("password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token);

      console.log("Login success:", data);

      navigate(from, { replace: true }); 

    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="login-title">
        <h1>Log In</h1>
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>

      <motion.div
        className="login-box"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
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
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? "Logging in..." : "Log In →"}
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

        <div className="divider">
          <span>or</span>
        </div>

        <div className="login-right">
          {["Google", "Facebook", "Apple"].map((provider) => (
            <motion.button
              key={provider}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert("Coming soon")}
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

      <footer className="login-footer">
        <span>Terms of Use</span>
        <span>Privacy Policy</span>
      </footer>
    </motion.div>
  );
}

export default Login;