const db = require('../db');

// USER REGISTRATION
const registerUser = (req, res) => {
  const { name, email, password, district, municipality } = req.body;

  // First check if user already registered
  const checkQuery = 'SELECT * FROM user_registration WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Insert into user_registration
    const insertQuery = 'INSERT INTO user_registration (name, email, password, district, municipality) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [name, email, password, district, municipality], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // Also insert into user_login
      const loginInsert = 'INSERT INTO user_login (email, password) VALUES (?, ?)';
      db.query(loginInsert, [email, password], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        return res.status(200).json({ message: 'User registered successfully' });
      });
    });
  });
};

// USER LOGIN
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user_login WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
};

// ADMIN LOGIN
const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    return res.status(200).json({ message: 'Admin login successful' });
  });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin
};
