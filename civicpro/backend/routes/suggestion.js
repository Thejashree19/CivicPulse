// backend/routes/suggestion.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to validate incoming suggestion data
function validateSuggestion(req, res, next) {
  const { user_id, title, description, district, municipality } = req.body;
  if (!user_id || !title || !description || !district || !municipality) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
}

// POST /api/suggestion - Add a new suggestion
router.post('/', validateSuggestion, (req, res) => {
  const { user_id, title, description, district, municipality, location } = req.body;
  const sql = `
    INSERT INTO suggestions (user_id, title, description, district, municipality, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, title, description, district, municipality, location || ''], (err, result) => {
    if (err) {
      console.error('Insert suggestion error:', err.sqlMessage || err);
      return res.status(500).json({ message: 'Database error while submitting suggestion' });
    }
    res.status(200).json({ message: 'Suggestion submitted successfully' });
  });
});

// GET /api/suggestion/community - Get all community suggestions with user names
router.get('/community', (req, res) => {
  const sql = `
    SELECT s.id, s.title, s.description, s.district, s.municipality, s.location, s.status, s.created_at,
           ur.name as user_name
    FROM suggestions s
    LEFT JOIN user_registration ur ON s.user_id = ur.id
    ORDER BY s.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch community suggestions error:', err.sqlMessage || err);
      return res.status(500).json({ message: 'Database error while fetching suggestions' });
    }
    res.status(200).json(results);
  });
});

// GET /api/suggestion - Get all suggestions
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM suggestions';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching suggestions:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
