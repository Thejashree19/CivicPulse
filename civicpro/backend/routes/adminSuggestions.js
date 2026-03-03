const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suggestions with user info
router.get('/all', (req, res) => {
  const sql = `
    SELECT s.id, s.title, s.description, s.district, s.municipality, s.status, s.created_at, u.name as submitted_by
    FROM suggestions s
    JOIN user_registration u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching suggestions:', err);
      return res.status(500).json({ message: 'Error fetching suggestions' });
    }
    res.json(result);
  });
});

// Update suggestion status
router.put('/update-status/:id', (req, res) => {
  const { status } = req.body;
  const suggestionId = req.params.id;

  const sql = `UPDATE suggestions SET status = ? WHERE id = ?`;
  db.query(sql, [status, suggestionId], (err) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Error updating suggestion status' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// Delete suggestion
router.delete('/delete/:id', (req, res) => {
  const suggestionId = req.params.id;
  const sql = 'DELETE FROM suggestions WHERE id = ?';

  db.query(sql, [suggestionId], (err, result) => {
    if (err) {
      console.error('Error deleting suggestion:', err);
      return res.status(500).json({ message: 'Failed to delete suggestion' });
    }
    res.json({ message: 'Suggestion deleted successfully' });
  });
});

// ✅ This line is required at the very end:
module.exports = router;
