import { useState } from 'react'
import styles from './Sessions.module.css'

const SUBJECTS = ['Anatomy', 'Physiology', 'Biochemistry', 'pathology', 'Microbiology', 'pharmacology', 'Forensic Science', 'Community Medicine', 'Ophthalmology', 'ENT', 'Orthopedics', 'Surgery', 'Pediatrics', 'Gynecology', 'Psychiatry', 'Other']

export default function Sessions({ sessions, currentUser, onAdd, onDelete }) {
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ subject: '', hours: '', date: new Date().toISOString().slice(0, 10), notes: '' })
    const [filter, setFilter] = useState('all')
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    async function handleSubmit() {
        if (!form.hours || !form.date) return alert('Fill in all fields')
        await onAdd(form)
        setForm({ subject: 'Anatomy', hours: '', date: new Date().toISOString().slice(0, 10), notes: '' })
        setShowForm(false)
    }

    const filtered = filter === 'all' ? sessions : sessions.filter(s => s.user === filter)

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Study Log</h1>
                    <p className={styles.sub}>All study sessions</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ Log Session'}
                </button>
            </header>

            {showForm && (
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>Log a Study Session</h3>
                    <div className={styles.formRow}>
                        <div className={styles.group}>
                            <label>Subject</label>
                            <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Anatomy, DSA, Calculus..." />
                        </div>
                        <div className={styles.group}>
                            <label>Hours Studied</label>
                            <input type="number" value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="e.g. 2.5" min="0.1" step="0.5" />
                        </div>
                        <div className={styles.group}>
                            <label>Date</label>
                            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.group}>
                        <label>Notes (optional)</label>
                        <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="What did you cover?" />
                    </div>
                    <button className={styles.saveBtn} onClick={handleSubmit}>Save Session</button>
                </div>
            )}

            <div className={styles.filters}>
                {['all', currentUser, ...['Jan🐹', 'Suna🦭'].filter(u => u !== currentUser)].map(f => (
                    <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'All' : f}
                    </button>
                ))}
            </div>

            <div className={styles.list}>
                {filtered.length === 0 ? (
                    <div className={styles.empty}><div className={styles.emptyIcon}>◎</div><p>No sessions yet!</p></div>
                ) : filtered.map(s => (
                    <div key={s.id} className={styles.row}>
                        <div className={styles.userDot} style={{ background: s.user === 'Sri' ? '#7c3aed' : '#059669' }} />
                        <div className={styles.info}>
                            <div className={styles.subject}>{s.subject}</div>
                            <div className={styles.meta}>
                                <span className={styles.userTag}>{s.user}</span>
                                <span>{s.date}</span>
                                {s.notes && <span className={styles.notes}>{s.notes}</span>}
                            </div>
                        </div>
                        <div className={styles.hours}>{parseFloat(s.hours).toFixed(1)}h</div>
                        {s.user === currentUser && (
                            <button className={styles.deleteBtn} onClick={() => onDelete(s.id)}>✕</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}