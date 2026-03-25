import styles from './Leaderboard.module.css'

export default function Leaderboard({ stats, currentUser }) {
    if (!stats) return <div className={styles.loading}>Loading...</div>

    const sorted = [...stats.user_stats].sort((a, b) => (b.week_hours || 0) - (a.week_hours || 0))
    const allTime = [...stats.user_stats].sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0))

    const leader = sorted[0]
    const isLeading = leader?.user === currentUser

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Leaderboard</h1>
                    <p className={styles.sub}>This week's study competition</p>
                </div>
            </header>

            {leader && (
                <div className={styles.banner}>
                    <div className={styles.bannerCrown}>👑</div>
                    <div className={styles.bannerText}>
                        <div className={styles.bannerName}>{leader.user} is leading this week!</div>
                        <div className={styles.bannerHours}>{(leader.week_hours || 0).toFixed(1)} hours studied</div>
                    </div>
                    {isLeading && <div className={styles.youBadge}>That's you! 🔥</div>}
                </div>
            )}

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>This Week</h2>
                <div className={styles.cards}>
                    {sorted.map((u, i) => {
                        const maxHours = sorted[0]?.week_hours || 1
                        const pct = Math.round((u.week_hours || 0) / maxHours * 100)
                        const streak = stats.streaks[u.user] || 0
                        return (
                            <div key={u.user} className={`${styles.card} ${u.user === currentUser ? styles.mine : ''}`}>
                                <div className={styles.cardTop}>
                                    <div className={styles.rank}>#{i + 1}</div>
                                    <div className={styles.avatar} style={{ background: i === 0 ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'linear-gradient(135deg,#059669,#047857)' }}>
                                        {u.user[0]}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardName}>
                                            {u.user} {u.user === currentUser && <span className={styles.you}>(you)</span>}
                                        </div>
                                        <div className={styles.cardStreak}>🔥 {streak} day streak</div>
                                    </div>
                                    <div className={styles.cardHours}>{(u.week_hours || 0).toFixed(1)}h</div>
                                </div>
                                <div className={styles.track}>
                                    <div className={styles.fill} style={{
                                        width: pct + '%',
                                        background: i === 0 ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'linear-gradient(90deg,#059669,#34d399)'
                                    }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>All Time</h2>
                <div className={styles.cards}>
                    {allTime.map((u, i) => (
                        <div key={u.user} className={`${styles.card} ${u.user === currentUser ? styles.mine : ''}`}>
                            <div className={styles.cardTop}>
                                <div className={styles.rank}>#{i + 1}</div>
                                <div className={styles.avatar} style={{ background: i === 0 ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'linear-gradient(135deg,#059669,#047857)' }}>
                                    {u.user[0]}
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.cardName}>
                                        {u.user} {u.user === currentUser && <span className={styles.you}>(you)</span>}
                                    </div>
                                    <div className={styles.cardSub}>{u.total_days || 0} study days total</div>
                                </div>
                                <div className={styles.cardHours}>{(u.total_hours || 0).toFixed(1)}h</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}