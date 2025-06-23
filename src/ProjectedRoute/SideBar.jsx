import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaTasks, FaUser } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { logoutAPI } from "../API/Api.js"; // Ensure path is correct

// Import the CSS file for this Sidebar component
import '../Css/Sidebar.css'; 

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAPI();
    navigate("/LoginPage");
  };

  return (
    <div className="sidebar-container">
      <div> {/* This wrapper can now be simplified or removed if preferred */}
        <h4 className="sidebar-title">
          Admin Panel
        </h4>
        <ul className="list-unstyled sidebar-nav">
          <li className="sidebar-nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link-active" : ""}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link-active" : ""}`
              }
            >
              Profile
            </NavLink>
          </li>
          <hr className="sidebar-divider" />
          <li className="sidebar-nav-item">
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link-active" : ""}`
              }
            >
              <FaTasks className="sidebar-icon" />
              Products
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/category"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "sidebar-nav-link-active" : ""}`
              }
            >
              <FaUser className="sidebar-icon" />
              Category
            </NavLink>
          </li>

          {/* Moved Logout button here, directly after Category */}
          <li className="sidebar-nav-item"> 
            <button
              onClick={handleLogout}
              className="sidebar-logout-btn"
            >
              <RiLogoutCircleRLine className="sidebar-icon" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;