const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'study.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user       TEXT    NOT NULL,
    subject    TEXT    NOT NULL,
    hours      REAL    NOT NULL,
    date       TEXT    NOT NULL,
    notes      TEXT    DEFAULT '',
    created_at TEXT    DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user        TEXT    NOT NULL,
    title       TEXT    NOT NULL,
    subject     TEXT    NOT NULL,
    deadline    TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'pending',
    priority    TEXT    NOT NULL DEFAULT 'medium',
    notes       TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
  )`);
});

console.log('Database initialised.');
module.exports = db;