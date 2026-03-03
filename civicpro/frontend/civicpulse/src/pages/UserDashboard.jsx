import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './UserDashboard.css';

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalIssues: 0,
    growthData: []
  });

  useEffect(() => {
    axios.get("http://localhost:5500/api/openData/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Fetch summary error:", err));
  }, []);

  const goTo = (path) => navigate(path, { state: { userId } });

  if (!userId) return <p>Unauthorized. Please log in first.</p>;

  return (
    <>
    
      <div className="user-dashboard">
        <div className="sidebar">
          <h2>Dashboard</h2>
          <button onClick={() => goTo("/report-issue")}>Report Issue</button>
          <button onClick={() => goTo("/my-reports")}>My Reports</button>
          <button onClick={() => goTo("/suggest-improvement")}>Suggest Improvement</button>
          <button onClick={() => goTo("/community-suggestions")}>Community Suggestions</button>
          <button onClick={() => goTo("/track-projects")}>Track Projects</button>
          <button onClick={() => goTo("/profile")}>Profile</button>
        </div>

        <div className="dashboard-content">
          <h1>Welcome to Your Dashboard</h1>

          {/* Summary Cards */}
          <div className="stats-cards">
            <div className="card">👤 Total Users <span>{summary.totalUsers}</span></div>
            <div className="card">📁 Total Projects <span>{summary.totalProjects}</span></div>
            <div className="card">✅ Completed Projects <span>{summary.completedProjects}</span></div>
            <div className="card">📌 Total Issues <span>{summary.totalIssues}</span></div>
          </div>

          {/* Bar Chart for Growth */}
          <div className="chart-section">
            <h3>User & Project Growth (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.growthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" name="Users Registered" />
                <Bar dataKey="projects" fill="#8884d8" name="Projects Added" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
