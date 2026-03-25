import { useState, useEffect, useCallback } from 'react'
import { api } from './utils/api'
import UserSelect from './components/UserSelect'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Sessions from './components/Sessions'
import Assignments from './components/Assignments'
import Leaderboard from './components/Leaderboard'
import styles from './App.module.css'

export const USERS = ['Jan🐹', 'Suna🦭']

export default function App() {
    const [currentUser, setCurrentUser] = useState(null)
    const [view, setView] = useState('dashboard')
    const [sessions, setSessions] = useState([])
    const [assignments, setAssignments] = useState([])
    const [stats, setStats] = useState(null)
    const [toast, setToast] = useState('')

    const load = useCallback(async () => {
        try {
            const [s, a, st] = await Promise.all([
                api.getSessions(),
                api.getAssignments(),
                api.getStats()
            ])
            setSessions(s)
            setAssignments(a)
            setStats(st)
        } catch {
            showToast('Could not connect — is the server running?')
        }
    }, [])

    useEffect(() => { if (currentUser) load() }, [currentUser, load])

    function showToast(msg) {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    if (!currentUser) {
        return <UserSelect users={USERS} onSelect={setCurrentUser} />
    }

    return (
        <div className={styles.layout}>
            <Sidebar view={view} setView={setView} currentUser={currentUser} setCurrentUser={setCurrentUser} users={USERS} />
            <main className={styles.main}>
                {view === 'dashboard' && <Dashboard stats={stats} currentUser={currentUser} sessions={sessions} />}
                {view === 'sessions' && (
                    <Sessions
                        sessions={sessions} currentUser={currentUser}
                        onAdd={async (data) => { await api.createSession({ ...data, user: currentUser }); showToast('Session logged ✓'); load() }}
                        onDelete={async (id) => { await api.deleteSession(id); showToast('Deleted ✓'); load() }}
                    />
                )}
                {view === 'assignments' && (
                    <Assignments
                        assignments={assignments} currentUser={currentUser}
                        onAdd={async (data) => { await api.createAssignment({ ...data, user: currentUser }); showToast('Assignment added ✓'); load() }}
                        onUpdate={async (id, data) => { await api.updateAssignment(id, data); showToast('Updated ✓'); load() }}
                        onDelete={async (id) => { await api.deleteAssignment(id); showToast('Deleted ✓'); load() }}
                    />
                )}
                {view === 'leaderboard' && <Leaderboard stats={stats} currentUser={currentUser} />}
            </main>
            {toast && <div className={styles.toast}>{toast}</div>}
        </div>
    )
}
