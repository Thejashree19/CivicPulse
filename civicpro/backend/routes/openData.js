const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', (req, res) => {
  console.log('📡 /summary API hit');

  let summary = {
    totalUsers: 0,
    totalProjects: 0,
    completedProjects: 0,
    totalIssues: 0,
    growthData: []
  };

  console.log('▶️ Running user count query...');
  db.query('SELECT COUNT(DISTINCT id) AS totalUsers FROM user_registration', (err, results) => {
    if (err) {
      console.error('❌ Error in user count query:', err);
      return res.status(500).json({ error: 'User count error' });
    }
    console.log('✅ User count query complete');

    summary.totalUsers = results[0].totalUsers;

    console.log('▶️ Running project count query...');
    db.query(`
      SELECT COUNT(DISTINCT id) AS totalProjects,
             SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completedProjects
      FROM projects
    `, (err, results) => {
      if (err) {
        console.error('❌ Error in project stats query:', err);
        return res.status(500).json({ error: 'Project stats error' });
      }
      console.log('✅ Project count query complete');

      summary.totalProjects = results[0].totalProjects;
      summary.completedProjects = results[0].completedProjects;

      console.log('▶️ Running issue count query...');
      db.query('SELECT COUNT(DISTINCT id) AS totalIssues FROM issues', (err, results) => {
        if (err) {
          console.error('❌ Error in issue count query:', err);
          return res.status(500).json({ error: 'Issue count error' });
        }
        console.log('✅ Issue count query complete');

        summary.totalIssues = results[0].totalIssues;

        console.log('▶️ Running user growth query...');
        db.query(`
          SELECT DATE_FORMAT(created_at, '%b %Y') AS month, COUNT(id) AS users
          FROM user_registration
          GROUP BY month
          ORDER BY MIN(created_at) ASC
          LIMIT 6
        `, (err, userGrowth) => {
          if (err) {
            console.error('❌ Error in user growth query:', err);
            return res.status(500).json({ error: 'User growth error' });
          }
          console.log('✅ User growth query complete');

          console.log('▶️ Running project growth query...');
          db.query(`
            SELECT DATE_FORMAT(created_at, '%b %Y') AS month, COUNT(id) AS projects
            FROM projects
            GROUP BY month
            ORDER BY MIN(created_at) ASC
            LIMIT 6
          `, (err, projectGrowth) => {
            if (err) {
              console.error('❌ Error in project growth query:', err);
              return res.status(500).json({ error: 'Project growth error' });
            }
            console.log('✅ Project growth query complete');

            summary.growthData = userGrowth.map(user => {
              const match = projectGrowth.find(p => p.month === user.month);
              return {
                month: user.month,
                users: user.users,
                projects: match ? match.projects : 0
              };
            });

            console.log('🎯 Final summary to send:', summary);
            res.json(summary);
          });
        });
      });
    });
  });
});


module.exports = router;
