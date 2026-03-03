const express = require('express');
const router = express.Router();
const db = require('../db');  // your DB connection

// Middleware to validate issue data
function validateIssueData(req, res, next) {
  const { title, description, district, municipality, user_id } = req.body;
  if (!title || !description || !district || !municipality || !user_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
}

router.post('/report', validateIssueData, (req, res) => {
  const { title, description, district, municipality, user_id } = req.body;

  const sql = `INSERT INTO issues (user_id, title, description, district, municipality) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, title, description, district, municipality], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Issue reported successfully' });
  });
});

module.exports = router;
