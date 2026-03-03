
const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to validate data
function validateRegisterData(req, res, next) {
  const { email, password, name, district, municipality } = req.body;
  if (!email || !password || !name || !district || !municipality) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
}

// REGISTER ROUTE
router.post('/register', validateRegisterData, (req, res) => {
  const { email, password, name, district, municipality } = req.body;

  // Check if email already exists
  const checkSql = 'SELECT * FROM user_registration WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Insert user if not exists
    const userRegSql = `INSERT INTO user_registration (name, email, password, district, municipality) VALUES (?, ?, ?, ?, ?)`;
    db.query(userRegSql, [name, email, password, district, municipality], (err, result) => {
      if (err) {
        console.error('Error inserting into user_registration:', err);
        return res.status(500).json({ message: 'Database error while registering user' });
      }

      const userLoginSql = `INSERT INTO user_login (email, password) VALUES (?, ?)`;
      db.query(userLoginSql, [email, password], (err2, result2) => {
        if (err2) {
          console.error('Error inserting into user_login:', err2);
          return res.status(500).json({ message: 'Database error while creating login credentials' });
        }

        res.status(200).json({ message: 'User registered successfully' });
      });
    });
  });
});


// LOGIN LOGIC
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Join user_login and user_registration to get user id
  const sql = `
    SELECT ur.id, ur.name, ur.email 
    FROM user_login ul 
    JOIN user_registration ur ON ul.email = ur.email 
    WHERE ul.email = ? AND ul.password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Login failed due to server error' });
    }

    if (result.length > 0) {
  return res.status(200).json({
    message: 'Login successful',
    user: { id: result[0].id }
  });
}
 else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

//admin-login logic
router.post('/admin-login', (req, res) => {
  console.log('Admin login request received:', req.body); // 👈 Add this line

  const { email, password } = req.body;

  const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      res.json({ message: 'Admin login successful' });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  });
});


module.exports = router;
