import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportIssue from './pages/ReportIssue';
import MyReports from './pages/MyReports';
import SuggestImprovement from './pages/SuggestImprovement';
import CommunitySuggestions from './pages/CommunitySuggestions';
import Profile from './pages/Profile';
import AdminIssueManagement from './pages/AdminIssueManagement'; 
import AdminSuggestionManagement from './pages/AdminSuggestionManagement';
import ProjectManagement from "./pages/ProjectManagement";
import ManageUsers from './pages/ManageUsers';
import TrackProjects from './pages/TrackProjects';
import Notifications from './pages/Notifications';

// Wrapper to use location and show/hide Navbar
const Layout = ({ children, notificationCount }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/register', '/admin-login'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar notificationCount={notificationCount} />}
      {children}
    </>
  );
};


function App() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Replace this with your real backend endpoint
    fetch("/api/notifications/count")
      .then((res) => res.json())
      .then((data) => setNotificationCount(data.count || 0))
      .catch(() => setNotificationCount(0));
  }, []);

  return (
    <Router>
      <Layout notificationCount={notificationCount}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/suggest-improvement" element={<SuggestImprovement />} />
          <Route path="/community-suggestions" element={<CommunitySuggestions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/issues" element={<AdminIssueManagement />} />
          <Route path="/admin/suggestions" element={<AdminSuggestionManagement />} />
          <Route path="/admin/projects" element={<ProjectManagement />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/track-projects" element={<TrackProjects />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
