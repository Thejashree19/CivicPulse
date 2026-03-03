import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Civic Pulse</h1>
        <p>Empowering citizens to report issues and suggest improvements in their community.</p>
        <div className="dashboard-buttons">
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/login")}>User Login</button>
          <button onClick={() => navigate("/admin-login")}>Admin Login</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
