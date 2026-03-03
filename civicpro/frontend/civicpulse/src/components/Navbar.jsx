import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ notificationCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">CivicPulse</div>
      </div>
      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/notifications" className="nav-icon" title="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="badge">{notificationCount}</span>
          )}
        </Link>

        <Link to="/login" className="nav-link logout-btn">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
