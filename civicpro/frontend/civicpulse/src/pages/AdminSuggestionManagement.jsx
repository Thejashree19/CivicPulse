import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminSuggestionManagement.css';

const AdminSuggestionManagement = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filters, setFilters] = useState({ district: '', municipality: '', status: '' });
  const [summary, setSummary] = useState({ pending: 0, reviewed: 0, accepted: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5500/api/admin/suggestions/all');
      setSuggestions(res.data);
      setFilteredSuggestions(res.data);
      updateSummary(res.data);
    } catch (err) {
      alert('Failed to fetch suggestions');
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const updateSummary = (data) => {
    const counts = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    data.forEach((suggestion) => {
      if (suggestion.status === 'Pending') counts.pending++;
      else if (suggestion.status === 'Reviewed') counts.reviewed++;
      else if (suggestion.status === 'Accepted') counts.accepted++;
      else if (suggestion.status === 'Rejected') counts.rejected++;
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
    const filtered = suggestions.filter(suggestion => {
      return (
        (filters.district === '' || suggestion.district === filters.district) &&
        (filters.municipality === '' || suggestion.municipality === filters.municipality) &&
        (filters.status === '' || suggestion.status === filters.status) &&
        (keyword === '' || 
          suggestion.title.toLowerCase().includes(keyword.toLowerCase()) || 
          suggestion.description.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    setFilteredSuggestions(filtered);
    updateSummary(filtered);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5500/api/admin/suggestions/update-status/${id}`, { status });
      fetchSuggestions();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;
    try {
      await axios.delete(`http://localhost:5500/api/admin/suggestions/delete/${id}`);
      fetchSuggestions();
    } catch (err) {
      alert('Failed to delete suggestion');
    }
  };

  return (
    <div className="admin-suggestions-container">
      <h2>Suggestion Management</h2>

      <div className="filter-summary-container">
        <div className="filters">
          <select name="district" onChange={handleFilterChange} value={filters.district}>
            <option value="">All Districts</option>
            {[...new Set(suggestions.map(s => s.district))].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select name="municipality" onChange={handleFilterChange} value={filters.municipality}>
            <option value="">All Municipalities</option>
            {[...new Set(suggestions.map(s => s.municipality))].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select name="status" onChange={handleFilterChange} value={filters.status}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
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
          <p>🟠 Reviewed: {summary.reviewed}</p>
          <p>🟢 Accepted: {summary.accepted}</p>
          <p>⚫ Rejected: {summary.rejected}</p>
        </div>
      </div>

      {filteredSuggestions.map(suggestion => (
        <div key={suggestion.id} className="suggestion-card">
          <h3>{suggestion.title}</h3>
          <p>{suggestion.description}</p>
          <p><strong>District:</strong> {suggestion.district} | <strong>Municipality:</strong> {suggestion.municipality}</p>
          <p><strong>Submitted By:</strong> {suggestion.submitted_by}</p>
          <p><strong>Date:</strong> {new Date(suggestion.created_at).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>
            <select
              value={suggestion.status}
              onChange={(e) => handleStatusChange(suggestion.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </p>
          <button onClick={() => handleDelete(suggestion.id)} className="delete-button">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminSuggestionManagement;
