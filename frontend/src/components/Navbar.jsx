
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark"></span>
        CustomerIQ
      </div>

      <div className="nav-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/segments">
          Segments
        </NavLink>

        <NavLink to="/anomalies">
          Anomalies
        </NavLink>

        <NavLink to="/analyze">
          Analyze
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

