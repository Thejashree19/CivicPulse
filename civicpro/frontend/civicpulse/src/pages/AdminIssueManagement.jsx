import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminIssueManagement.css';

const AdminIssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filters, setFilters] = useState({ district: '', municipality: '', status: '' });
  const [summary, setSummary] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // define fetchIssues inside useEffect to avoid dependency warning
    const fetchIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/admin/issues/all');
        setIssues(res.data);
        setFilteredIssues(res.data);
        updateSummary(res.data);
      } catch (err) {
        alert('Failed to fetch issues');
      }
    };
    fetchIssues();
  }, []);

  const updateSummary = (data) => {
    const counts = { pending: 0, inProgress: 0, resolved: 0 };
    data.forEach((issue) => {
      if (issue.status === 'Pending') counts.pending++;
      else if (issue.status === 'In Progress') counts.inProgress++;
      else if (issue.status === 'Resolved') counts.resolved++;
    });
    setSummary(counts);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters, searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(filters, value);
  };

  const applyFilters = (filters, keyword) => {
    const filtered = issues.filter(issue => {
      return (
        (filters.district === '' || issue.district === filters.district) &&
        (filters.municipality === '' || issue.municipality === filters.municipality) &&
        (filters.status === '' || issue.status === filters.status) &&
        (keyword === '' || issue.title.toLowerCase().includes(keyword.toLowerCase()) || issue.description.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    setFilteredIssues(filtered);
    updateSummary(filtered);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5500/api/admin/issues/update-status/${id}`, { status });
      // Refresh issues after status update
      const res = await axios.get('http://localhost:5500/api/admin/issues/all');
      setIssues(res.data);
      applyFilters(filters, searchTerm);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await axios.delete(`http://localhost:5500/api/admin/issues/delete/${id}`);
      // Refresh issues after deletion
      const res = await axios.get('http://localhost:5500/api/admin/issues/all');
      setIssues(res.data);
      applyFilters(filters, searchTerm);
    } catch (err) {
      alert('Failed to delete issue');
    }
  };

  return (
    <div className="admin-issues-container">
      <h2>Issue Management</h2>

      <div className="filter-summary-container">
        <div className="filters">
          <select name="district" onChange={handleFilterChange} value={filters.district}>
            <option value="">All Districts</option>
            {[...new Set(issues.map(i => i.district))].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select name="municipality" onChange={handleFilterChange} value={filters.municipality}>
            <option value="">All Municipalities</option>
            {[...new Set(issues.map(i => i.municipality))].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select name="status" onChange={handleFilterChange} value={filters.status}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="summary">
          <p>🔴 Pending: {summary.pending}</p>
          <p>🟠 In Progress: {summary.inProgress}</p>
          <p>🟢 Resolved: {summary.resolved}</p>
        </div>
      </div>

      {filteredIssues.map(issue => (
        <div key={issue.id} className="issue-card">
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <p><strong>District:</strong> {issue.district} | <strong>Municipality:</strong> {issue.municipality}</p>
          <p><strong>Reported By:</strong> {issue.reported_by}</p>
          <p>
            <strong>Status:</strong>
            <select
              value={issue.status}
              onChange={(e) => handleStatusChange(issue.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </p>
          <button onClick={() => handleDelete(issue.id)} className="delete-button">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminIssueManagement;
