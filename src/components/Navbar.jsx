import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import "../pages/styles/Navbar.css";

function Navbar() {
  const { isAuth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="logo">
        <Link to="/">B R A I N&nbsp; C A C H E</Link>
      </h2>

      <ul className="nav-links">
        <motion.li whileHover={{ scale: 1.05 }}>
          <Link to="/">Home</Link>
        </motion.li>

        {!isAuth ? (
          <>
            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/login">Login</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/signup">Sign Up</Link>
            </motion.li>
          </>
        ) : (
          <>
            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/dashboard">Dashboard</Link>
            </motion.li>
            <motion.li
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
            >
              Logout
            </motion.li>
          </>
        )}

        {/* 🌗 THEME TOGGLE */}
        <motion.li
          onClick={toggleTheme}
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          style={{ cursor: "pointer", fontSize: "1.1rem" }}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </motion.li>
      </ul>
    </motion.nav>
  );
}

export default Navbar;
