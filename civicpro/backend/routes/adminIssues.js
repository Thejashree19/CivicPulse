const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all issues
router.get('/all', (req, res) => {
  const sql = `
    SELECT i.id, i.title, i.description, i.district, i.municipality, i.status, i.created_at, u.name as reported_by
    FROM issues i
    JOIN user_registration u ON i.user_id = u.id
    ORDER BY i.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching issues:', err);
      return res.status(500).json({ message: 'Error fetching issues' });
    }
    res.json(result);
  });
});

// Update issue status
router.put('/update-status/:id', (req, res) => {
  const { status } = req.body;
  const issueId = req.params.id;

  const sql = `UPDATE issues SET status = ? WHERE id = ?`;
  db.query(sql, [status, issueId], (err) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Error updating issue status' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// ✅ Delete issue by ID
router.delete('/delete/:id', (req, res) => {
  const issueId = req.params.id;
  const sql = 'DELETE FROM issues WHERE id = ?';

  db.query(sql, [issueId], (err, result) => {
    if (err) {
      console.error('Error deleting issue:', err);
      return res.status(500).json({ message: 'Failed to delete issue' });
    }
    res.json({ message: 'Issue deleted successfully' });
  });
});

// ✅ Get summary of issues (pending/resolved counts)
router.get('/summary', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM issues
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching summary:', err);
      return res.status(500).json({ message: 'Failed to fetch summary' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
