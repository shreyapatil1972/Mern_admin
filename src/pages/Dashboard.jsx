import React from "react";
// Import the CSS file for this component
import '../Css/Dashboard.css'; // You'll create this file next

const Dashboard = () => {
  return (
    <div className="dashboard-card"> {/* Replaced inline style with a class */}
      <h2 className="dashboard-title"> {/* Replaced inline style with a class */}
        Dashboard
      </h2>
      <p className="dashboard-welcome-text"> {/* Replaced inline style with a class */}
        Welcome to your dashboard! You can manage your account, view order history, and explore exclusive deals here.
      </p>
    </div>
  );
};

export default Dashboard;