import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from './Dashboard.module.css'

export default function Dashboard({ stats, currentUser }) {
    if (!stats) return <div className={styles.loading}>Loading…</div>

    const myStats = stats.user_stats.find(u => u.user === currentUser) || { total_hours: 0, total_days: 0, week_hours: 0 }
    const myStreak = stats.streaks[currentUser] || 0
    const mySubjects = stats.subject_stats.filter(s => s.user === currentUser)

    const last7 = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        const label = d.toLocaleDateString('en', { weekday: 'short' })
        const entry = { date: label }
        stats.user_stats.forEach(u => {
            const found = stats.chart_data.find(c => c.user === u.user && c.date === dateStr)
            entry[u.user] = found ? found.hours : 0
        })
        last7.push(entry)
    }

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.title}>Hey, {currentUser} 👋</h1>
                <p className={styles.sub}>Here's your study overview</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard} style={{ '--accent-color': '#7c3aed' }}>
                    <div className={styles.statLabel}>Total Hours</div>
                    <div className={styles.statValue}>{(myStats.total_hours || 0).toFixed(1)}h</div>
                </div>
                <div className={styles.statCard} style={{ '--accent-color': '#059669' }}>
                    <div className={styles.statLabel}>This Week</div>
                    <div className={styles.statValue}>{(myStats.week_hours || 0).toFixed(1)}h</div>
                </div>
                <div className={styles.statCard} style={{ '--accent-color': '#f59e0b' }}>
                    <div className={styles.statLabel}>Study Days</div>
                    <div className={styles.statValue}>{myStats.total_days || 0}</div>
                </div>
                <div className={`${styles.statCard} ${myStreak > 0 ? styles.streakActive : ''}`} style={{ '--accent-color': '#ef4444' }}>
                    <div className={styles.statLabel}>🔥 Streak</div>
                    <div className={styles.statValue}>{myStreak} {myStreak === 1 ? 'day' : 'days'}</div>
                </div>
            </div>

            <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Study Hours — Last 7 Days</h2>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={last7} barSize={20}>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#6060a0' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#6060a0' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#111118', border: '1px solid #222230', borderRadius: 8, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Outfit' }} />
                        {stats.user_stats.map((u, i) => (
                            <Bar key={u.user} dataKey={u.user} fill={i === 0 ? '#7c3aed' : '#059669'} radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.subjectsCard}>
                <h2 className={styles.chartTitle}>Your Subjects</h2>
                {mySubjects.length > 0 ? mySubjects.map((s, i) => {
                    const max = mySubjects[0].hours
                    const pct = Math.round(s.hours / max * 100)
                    return (
                        <div key={i} className={styles.subjectRow}>
                            <div className={styles.subjectLabel}>
                                <span>{s.subject}</span>
                                <span className={styles.subjectHours}>{s.hours.toFixed(1)}h</span>
                            </div>
                            <div className={styles.track}>
                                <div className={styles.fill} style={{ width: pct + '%' }} />
                            </div>
                        </div>
                    )
                }) : <p className={styles.empty}>No sessions logged yet</p>}
            </div>
        </div>
    )
}