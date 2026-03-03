const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL DB connection

// Middleware to validate issue data
function validateIssue(req, res, next) {
  const { user_id, title, description, district, municipality } = req.body;
  if (!user_id || !title || !description || !district || !municipality) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
}

// POST /api/report - Report a new issue
router.post('/', validateIssue, (req, res) => {
  const { user_id, title, description, district, municipality, location } = req.body;
  const sql = `
    INSERT INTO issues (user_id, title, description, district, municipality, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, title, description, district, municipality, location || ''], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Database error while reporting issue' });
    }
    res.status(200).json({ message: 'Issue reported successfully' });
  });
});

// GET: Fetch reports for a specific user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM issues WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});


module.exports = router;
