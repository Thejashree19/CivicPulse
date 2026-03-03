import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommunitySuggestions.css';

const CommunitySuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/suggestion/community');
        setSuggestions(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load community suggestions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) return <p>Loading community suggestions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="community-suggestions-container">
      <h2>Community Suggestions</h2>
      {suggestions.length === 0 ? (
        <p>No suggestions available yet.</p>
      ) : (
        <ul className="suggestion-list">
          {suggestions.map(sug => (
            <li key={sug.id} className="suggestion-item">
              <h3>{sug.title}</h3>
              <p>{sug.description}</p>
              <p><strong>District:</strong> {sug.district} | <strong>Municipality:</strong> {sug.municipality}</p>
              {sug.location && <p><strong>Location:</strong> {sug.location}</p>}
              <p><strong>Status:</strong> {sug.status}</p>
              <p><small>Submitted by: {sug.user_name || 'Anonymous'} on {new Date(sug.created_at).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunitySuggestions;
