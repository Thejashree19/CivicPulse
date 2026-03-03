const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5500;


app.use(cors());
app.use(express.json());  // Middleware to parse JSON request body

// Optional: Add logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Body:', req.body);
  next();
});

// Your routes here
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issues', issueRoutes);

const reportRoutes = require('./routes/report');
app.use('/api/report', reportRoutes);


const suggestionRoutes = require('./routes/suggestion');
app.use('/api/suggestion', suggestionRoutes);


const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const adminIssuesRoute = require('./routes/adminIssues');
app.use('/api/admin/issues', adminIssuesRoute);

const adminSuggestionsRoutes = require('./routes/adminSuggestions');
app.use('/api/admin/suggestions', adminSuggestionsRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

const openDataRoutes = require('./routes/openData');
app.use('/api/openData', openDataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

