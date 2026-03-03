import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './MyReports.css';  // your CSS import

const MyReports = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5500/api/report/${userId}`)
      .then(res => setReports(res.data))
      .catch(err => console.error('Fetch error:', err));
  }, [userId]);

  if (!userId) {
    return <p>Unauthorized. Please log in first.</p>;
  }

  return (
    <div className="myreports-container">
      <h2>My Reported Issues</h2>
      {reports.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        <ul className="issue-list">
          {reports.map(issue => (
            <li key={issue.id} className="issue-item">
              <h4>{issue.title}</h4>
              <p>{issue.description}</p>
              <p>
  <strong>Status:</strong>{' '}
  <span className={`issue-status ${
    issue.status === 'Pending' ? 'status-pending' :
    issue.status === 'Resolved' ? 'status-resolved' :
    'status-in-progress'
  }`}>
    {issue.status}
  </span>
</p>

              <p><strong>Date:</strong> {new Date(issue.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReports;
