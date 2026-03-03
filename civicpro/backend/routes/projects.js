const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL connection module

// Get all projects
// Get all projects with optional filtering by district and status
router.get('/', (req, res) => {
  const { district, status } = req.query;

  let sql = 'SELECT * FROM projects';
  let params = [];
  let conditions = [];

  if (district) {
    conditions.push('district = ?');
    params.push(district);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Get project by id
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM projects WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(results[0]);
  });
});

// Create new project
router.post('/', (req, res) => {
  const { title, description, district, municipality, start_date, end_date, status, budget } = req.body;
  const sql = `INSERT INTO projects (title, description, district, municipality, start_date, end_date, status, budget)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [title, description, district, municipality, start_date, end_date, status, budget], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Project created', id: result.insertId });
  });
});

// Update project
router.put('/:id', (req, res) => {
  const { title, description, district, municipality, start_date, end_date, status, budget } = req.body;
  const sql = `UPDATE projects SET title=?, description=?, district=?, municipality=?, start_date=?, end_date=?, status=?, budget=? WHERE id=?`;
  db.query(sql, [title, description, district, municipality, start_date, end_date, status, budget, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Project updated' });
  });
});

// Delete project
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM projects WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Project deleted' });
  });
});

module.exports = router;
