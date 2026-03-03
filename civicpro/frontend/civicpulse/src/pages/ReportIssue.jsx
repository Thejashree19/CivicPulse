import React, { useState } from 'react';
import axios from 'axios';
import './ReportIssue.css';
import { useLocation } from 'react-router-dom';

const ReportIssue = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: '',
    municipality: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/issues/report', {
        ...formData,
        user_id: userId,
      });
      alert(res.data.message);
      setFormData({ title: '', description: '', district: '', municipality: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report issue');
    }
  };

  return (
    <div className="report-issue-container">
      {userId ? (
        <>
          <h2>Report an Issue</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Issue Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Describe the issue"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              required
            />
            <input
              name="municipality"
              placeholder="Municipality"
              value={formData.municipality}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit Issue</button>
          </form>
        </>
      ) : (
        <p>Unauthorized. Please log in first.</p>
      )}
    </div>
  );
};

export default ReportIssue;
