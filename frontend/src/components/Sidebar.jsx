import styles from './Sidebar.module.css'

const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'sessions', label: 'Study Log', icon: '📖' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
]

export default function Sidebar({ view, setView, currentUser, setCurrentUser }) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.brandName}>StudySync</span>
            </div>

            <div className={styles.userBadge}>
                <div className={styles.avatar}>{currentUser[0]}</div>
                <div>
                    <div className={styles.userName}>{currentUser}</div>
                    <button className={styles.switchBtn} onClick={() => setCurrentUser(null)}>switch user</button>
                </div>
            </div>

            <nav className={styles.nav}>
                {NAV.map(item => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${view === item.id ? styles.active : ''}`}
                        onClick={() => setView(item.id)}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className={styles.footer}>
                <p className={styles.footerText}>Study together,<br />grow together.</p>
            </div>
        </aside>
    )
}