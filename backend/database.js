const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'study.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user       TEXT    NOT NULL,
    subject    TEXT    NOT NULL,
    hours      REAL    NOT NULL,
    date       TEXT    NOT NULL,
    notes      TEXT    DEFAULT '',
    created_at TEXT    DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user        TEXT    NOT NULL,
    title       TEXT    NOT NULL,
    subject     TEXT    NOT NULL,
    deadline    TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'pending',
    priority    TEXT    NOT NULL DEFAULT 'medium',
    notes       TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialised.');
module.exports = db;