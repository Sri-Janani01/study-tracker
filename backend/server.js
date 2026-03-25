const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// ── Sessions ──────────────────────────────────────────────────────────────────

app.get('/api/sessions', (req, res) => {
    const { user } = req.query;
    let sql = 'SELECT * FROM sessions';
    let params = [];
    if (user) { sql += ' WHERE user = ?'; params.push(user); }
    sql += ' ORDER BY date DESC';
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/sessions', (req, res) => {
    const { user, subject, hours, date, notes } = req.body;
    if (!user || !subject || !hours || !date)
        return res.status(400).json({ error: 'Missing required fields' });
    db.run(
        'INSERT INTO sessions (user, subject, hours, date, notes) VALUES (?,?,?,?,?)',
        [user, subject, parseFloat(hours), date, notes || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT * FROM sessions WHERE id = ?', [this.lastID], (err, row) => res.status(201).json(row));
        }
    );
});

app.delete('/api/sessions/:id', (req, res) => {
    db.run('DELETE FROM sessions WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
});

// ── Assignments ───────────────────────────────────────────────────────────────

app.get('/api/assignments', (req, res) => {
    const { user } = req.query;
    let sql = 'SELECT * FROM assignments';
    let params = [];
    if (user) { sql += ' WHERE user = ?'; params.push(user); }
    sql += ' ORDER BY deadline ASC';
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/assignments', (req, res) => {
    const { user, title, subject, deadline, status, priority, notes } = req.body;
    if (!user || !title || !subject || !deadline)
        return res.status(400).json({ error: 'Missing required fields' });
    db.run(
        'INSERT INTO assignments (user, title, subject, deadline, status, priority, notes) VALUES (?,?,?,?,?,?,?)',
        [user, title, subject, deadline, status || 'pending', priority || 'medium', notes || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT * FROM assignments WHERE id = ?', [this.lastID], (err, row) => res.status(201).json(row));
        }
    );
});

app.put('/api/assignments/:id', (req, res) => {
    const { title, subject, deadline, status, priority, notes } = req.body;
    db.run(
        'UPDATE assignments SET title=?, subject=?, deadline=?, status=?, priority=?, notes=? WHERE id=?',
        [title, subject, deadline, status, priority, notes || '', req.params.id],
        err => {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT * FROM assignments WHERE id = ?', [req.params.id], (err, row) => res.json(row));
        }
    );
});

app.delete('/api/assignments/:id', (req, res) => {
    db.run('DELETE FROM assignments WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
});

// ── Stats ─────────────────────────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
    // Get start of current week (Monday)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff)).toISOString().slice(0, 10);

    db.all(`
    SELECT user,
      SUM(hours) as total_hours,
      COUNT(DISTINCT date) as total_days,
      SUM(CASE WHEN date >= ? THEN hours ELSE 0 END) as week_hours
    FROM sessions GROUP BY user
  `, [weekStart], (err, userStats) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(`
      SELECT user, subject, SUM(hours) as hours
      FROM sessions GROUP BY user, subject ORDER BY hours DESC
    `, [], (err, subjectStats) => {
            if (err) return res.status(500).json({ error: err.message });

            // Streak calculation per user
            db.all(`
        SELECT user, date FROM sessions
        GROUP BY user, date ORDER BY user, date DESC
      `, [], (err, dates) => {
                if (err) return res.status(500).json({ error: err.message });

                const streaks = {};
                const userDates = {};
                dates.forEach(({ user, date }) => {
                    if (!userDates[user]) userDates[user] = [];
                    userDates[user].push(date);
                });

                Object.entries(userDates).forEach(([user, ds]) => {
                    let streak = 0;
                    const today = new Date().toISOString().slice(0, 10);
                    let check = today;
                    for (let i = 0; i < ds.length; i++) {
                        if (ds[i] === check) {
                            streak++;
                            const d = new Date(check);
                            d.setDate(d.getDate() - 1);
                            check = d.toISOString().slice(0, 10);
                        } else if (ds[i] < check) break;
                    }
                    streaks[user] = streak;
                });

                // Weekly chart data (last 7 days)
                db.all(`
          SELECT user, date, SUM(hours) as hours
          FROM sessions
          WHERE date >= date('now', '-6 days')
          GROUP BY user, date ORDER BY date ASC
        `, [], (err, chartData) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({
                        user_stats: userStats,
                        subject_stats: subjectStats,
                        streaks,
                        chart_data: chartData,
                        week_start: weekStart
                    });
                });
            });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));