import styles from './UserSelect.module.css'

export default function UserSelect({ users, onSelect }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.card}>
                <h1 className={styles.title}>StudySync</h1>
                <p className={styles.sub}>Who's studying today?</p>
                <div className={styles.users}>
                    {users.map(user => (
                        <button key={user} className={styles.userBtn} onClick={() => onSelect(user)}>
                            <span className={styles.avatar}>{user[0]}</span>
                            <span>{user}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}