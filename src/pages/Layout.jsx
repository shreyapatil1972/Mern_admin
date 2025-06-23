import React from 'react';
import Sidebar from '../ProjectedRoute/SideBar'; // Ensure this path is correct
import logo from '../assets/logo.png'; // Ensure this path is correct
import { Outlet } from 'react-router-dom';

// Import the CSS file for this component
import '../Css/Layout.css'; // Create this file next

const Layout = () => {
  return (
    <>
      <header className="main-header">
        <img src={logo} alt="Company Logo" className="header-logo" />
      </header>
      <div className="layout-content-wrapper">
        <Sidebar />
        <div className="main-content-area">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;