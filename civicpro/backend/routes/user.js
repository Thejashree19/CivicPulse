const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL connection instance

// Get user profile by ID
router.get('/profile/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT name, email, district, municipality FROM user_registration WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result[0]);
  });
});

// Get all users
router.get('/users', (req, res) => {
  const sql = 'SELECT id, name, email, district, municipality, phone FROM user_registration ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Add new user
router.post('/users', (req, res) => {
  const { name, email, password, district, municipality, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const userPassword = password || 'default123';

  const sql = 'INSERT INTO user_registration (name, email, password, district, municipality, phone) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, userPassword, district || '', municipality || '', phone || ''], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
    console.log('User added, insertId:', result.insertId);
    res.status(201).json({ message: 'User added successfully', id: result.insertId });
  });
});

// Update user by ID
router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, district, municipality, phone } = req.body;

  const sql = 'UPDATE user_registration SET name = ?, email = ?, district = ?, municipality = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, district || '', municipality || '', phone || '', userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete user by ID
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  const sql = 'DELETE FROM user_registration WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Update password by user ID (no hashing as requested)
router.put('/update-password/:id', (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  console.log(`Received password update request. userId=${userId}, password=${password}`);

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const sql = 'UPDATE user_registration SET password = ? WHERE id = ?';
  db.query(sql, [password, userId], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    console.log('Update query result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });
  });
});


module.exports = router;
