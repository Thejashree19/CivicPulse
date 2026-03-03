import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SuggestImprovement.css';

const SuggestImprovement = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: '',
    municipality: '',
    location: '',
  });
  const [message, setMessage] = useState('');

  if (!userId) {
    return <p>Unauthorized. Please log in first.</p>;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, district, municipality } = formData;
    if (!title || !description || !district || !municipality) {
      setMessage('Please fill all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5500/api/suggestion', {
        user_id: userId,
        ...formData,
      });
      setMessage(response.data.message || 'Suggestion submitted successfully!');
      setFormData({ title: '', description: '', district: '', municipality: '', location: '' });
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Error submitting suggestion. Try again.');
    }
  };

  return (
    <div className="suggestion-container">
      <h2>Suggest an Improvement</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="suggestion-form">
        <label>
          Title*:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description*:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          District*:
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Municipality*:
          <input
            type="text"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location (optional):
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Submit Suggestion</button>
      </form>
    </div>
  );
};

export default SuggestImprovement;
