const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// ── Sessions ──────────────────────────────────────────────────────────────────

app.get('/api/sessions', (req, res) => {
    try {
        const { user } = req.query;
        let stmt = user
            ? db.prepare('SELECT * FROM sessions WHERE user = ? ORDER BY date DESC')
            : db.prepare('SELECT * FROM sessions ORDER BY date DESC');
        const rows = user ? stmt.all(user) : stmt.all();
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sessions', (req, res) => {
    try {
        const { user, subject, hours, date, notes } = req.body;
        if (!user || !subject || !hours || !date)
            return res.status(400).json({ error: 'Missing required fields' });
        const result = db.prepare(
            'INSERT INTO sessions (user, subject, hours, date, notes) VALUES (?,?,?,?,?)'
        ).run(user, subject, parseFloat(hours), date, notes || '');
        const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/sessions/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Assignments ───────────────────────────────────────────────────────────────

app.get('/api/assignments', (req, res) => {
    try {
        const { user } = req.query;
        let rows = user
            ? db.prepare('SELECT * FROM assignments WHERE user = ? ORDER BY deadline ASC').all(user)
            : db.prepare('SELECT * FROM assignments ORDER BY deadline ASC').all();
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assignments', (req, res) => {
    try {
        const { user, title, subject, deadline, status, priority, notes } = req.body;
        if (!user || !title || !subject || !deadline)
            return res.status(400).json({ error: 'Missing required fields' });
        const result = db.prepare(
            'INSERT INTO assignments (user, title, subject, deadline, status, priority, notes) VALUES (?,?,?,?,?,?,?)'
        ).run(user, title, subject, deadline, status || 'pending', priority || 'medium', notes || '');
        const row = db.prepare('SELECT * FROM assignments WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/assignments/:id', (req, res) => {
    try {
        const { title, subject, deadline, status, priority, notes } = req.body;
        db.prepare(
            'UPDATE assignments SET title=?, subject=?, deadline=?, status=?, priority=?, notes=? WHERE id=?'
        ).run(title, subject, deadline, status, priority, notes || '', req.params.id);
        const row = db.prepare('SELECT * FROM assignments WHERE id = ?').get(req.params.id);
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assignments/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM assignments WHERE id = ?').run(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Stats ─────────────────────────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
    try {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(now.setDate(diff)).toISOString().slice(0, 10);

        const userStats = db.prepare(`
      SELECT user,
        SUM(hours) as total_hours,
        COUNT(DISTINCT date) as total_days,
        SUM(CASE WHEN date >= ? THEN hours ELSE 0 END) as week_hours
      FROM sessions GROUP BY user
    `).all(weekStart);

        const subjectStats = db.prepare(`
      SELECT user, subject, SUM(hours) as hours
      FROM sessions GROUP BY user, subject ORDER BY hours DESC
    `).all();

        const dates = db.prepare(`
      SELECT user, date FROM sessions
      GROUP BY user, date ORDER BY user, date DESC
    `).all();

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

        const chartData = db.prepare(`
      SELECT user, date, SUM(hours) as hours
      FROM sessions
      WHERE date >= date('now', '-6 days')
      GROUP BY user, date ORDER BY date ASC
    `).all();

        res.json({ user_stats: userStats, subject_stats: subjectStats, streaks, chart_data: chartData, week_start: weekStart });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));