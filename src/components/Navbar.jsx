import { Link } from "react-router-dom";
import "../pages/styles/Navbar.css";


function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">B R A I N  C A C H E</h2>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
