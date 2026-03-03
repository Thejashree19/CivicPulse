import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <Link to="/admin/issues">Issue Management</Link>
        <Link to="/admin/suggestions">Suggestion Management</Link>
        <Link to="/admin/projects">Project Management</Link>
        <Link to="/admin/manage-users">Manage Users</Link>
      </div>

      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="stats-cards">
          <div className="card">👤 Total Users <span>{summary.totalUsers}</span></div>
          <div className="card">📁 Total Projects <span>{summary.totalProjects}</span></div>
          <div className="card">✅ Completed Projects <span>{summary.completedProjects}</span></div>
          <div className="card">📌 Total Issues <span>{summary.totalIssues}</span></div>
        </div>

        <div className="chart-section">
          <h3>Platform Growth (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.growthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#4caf50" name="Users" />
              <Bar dataKey="projects" fill="#2196f3" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
