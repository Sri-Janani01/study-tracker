# ⟡ StudySync — Collaborative Study Tracker

> A full-stack study tracker for two people to log sessions, track assignments, compete on a leaderboard, and keep streaks going — together.

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/Sri-Janani01/study-tracker)
[![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**📁 Repository:** [github.com/Sri-Janani01/study-tracker](https://github.com/Sri-Janani01/study-tracker)
**Live Demo:** https://sri-janani01.github.io/study-tracker/frontend/dist/index.html

---

## ✨ Features

- **User Selection** — Pick your profile on load, no login needed
- **Study Sessions** — Log subject, hours, date, and notes
- **Assignments** — Track deadlines, priorities, and status (pending → in-progress → done)
- **Weekly Leaderboard** — See who studied more this week
- **Streak Tracking** — Consecutive study day streaks per user
- **Charts** — Last 7 days bar chart comparing both users
- **Subject Breakdown** — Hours per subject with progress bars
- **Overdue Alerts** — Assignments past deadline highlighted in red

---

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express.js, SQLite         |
| Frontend | React 18, Vite, CSS Modules         |
| Charts   | Recharts                            |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Sri-Janani01/study-tracker.git
cd study-tracker

# 2. Start the backend (Terminal 1)
cd backend
npm install
node server.js
# → http://localhost:3002

# 3. Start the frontend (Terminal 2)
cd frontend
npm install
npm run dev
# → http://localhost:5174
```

---

## 📡 API Endpoints

| Method   | Endpoint               | Description                    |
|----------|------------------------|--------------------------------|
| `GET`    | `/api/sessions`        | Get all sessions (`?user=`)    |
| `POST`   | `/api/sessions`        | Log a new study session        |
| `DELETE` | `/api/sessions/:id`    | Delete a session               |
| `GET`    | `/api/assignments`     | Get all assignments (`?user=`) |
| `POST`   | `/api/assignments`     | Create an assignment           |
| `PUT`    | `/api/assignments/:id` | Update an assignment           |
| `DELETE` | `/api/assignments/:id` | Delete an assignment           |
| `GET`    | `/api/stats`           | Leaderboard, streaks & charts  |

---

## 📁 Project Structure

```
study-tracker/
├── backend/
│   ├── server.js       # Express REST API
│   ├── database.js     # SQLite setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── UserSelect.jsx    # User picker screen
│   │   │   ├── Sidebar.jsx       # Navigation
│   │   │   ├── Dashboard.jsx     # Stats & charts
│   │   │   ├── Sessions.jsx      # Study log
│   │   │   ├── Assignments.jsx   # Assignment tracker
│   │   │   └── Leaderboard.jsx   # Weekly competition
│   │   └── utils/api.js
│   └── package.json
└── README.md
```

---

## 🗺 Roadmap

- [ ] Real-time sync between users (WebSockets)
- [ ] Push notifications for deadlines
- [ ] Pomodoro timer
- [ ] Monthly stats report
- [ ] Mobile app version

---

## 👩‍💻 Author

**Sri Janani** — [github.com/Sri-Janani01](https://github.com/Sri-Janani01)

---

## 📄 License

MIT — feel free to use and modify.
