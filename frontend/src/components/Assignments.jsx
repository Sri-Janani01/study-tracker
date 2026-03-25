import { useState } from 'react'
import styles from './Assignments.module.css'


const PRIORITIES = ['low', 'medium', 'high']
const STATUSES = ['pending', 'in-progress', 'done']

export default function Assignments({ assignments, currentUser, onAdd, onUpdate, onDelete }) {
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('all')
    const [form, setForm] = useState({ title: '', subject: '', deadline: '', priority: 'medium', status: 'pending', notes: '' })

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    async function handleSubmit() {
        if (!form.title || !form.deadline) return alert('Fill in all required fields')
        await onAdd(form)
        setForm({ title: '', subject: 'Mathematics', deadline: '', priority: 'medium', status: 'pending', notes: '' })
        setShowForm(false)
    }

    const filtered = filter === 'all' ? assignments
        : filter === 'pending' ? assignments.filter(a => a.status === 'pending')
            : filter === 'done' ? assignments.filter(a => a.status === 'done')
                : assignments.filter(a => a.user === filter)

    const today = new Date().toISOString().slice(0, 10)

    function daysUntil(deadline) {
        return Math.ceil((new Date(deadline) - new Date(today)) / (1000 * 60 * 60 * 24))
    }

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Assignments</h1>
                    <p className={styles.sub}>{assignments.length} total assignments</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Assignment'}
                </button>
            </header>

            {showForm && (
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>New Assignment</h3>
                    <div className={styles.formRow}>
                        <div className={styles.group}>
                            <label>Title *</label>
                            <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Chapter 5 exercises" />
                        </div>
                        <div className={styles.group}>
                            <label>Subject</label>
                            <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Anatomy, DSA, Calculus..." />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.group}>
                            <label>Deadline *</label>
                            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                        </div>
                        <div className={styles.group}>
                            <label>Priority</label>
                            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label>Status</label>
                            <select value={form.status} onChange={e => set('status', e.target.value)}>
                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <label>Notes</label>
                        <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any extra details..." />
                    </div>
                    <button className={styles.saveBtn} onClick={handleSubmit}>Add Assignment</button>
                </div>
            )}

            <div className={styles.filters}>
                {['all', currentUser, ...['Jan🐹', 'Suna🦭'].filter(u => u !== currentUser), 'pending', 'done'].map(f => (
                    <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'All' : f}
                    </button>
                ))}
            </div>

            <div className={styles.list}>
                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📝</div>
                        <p>No assignments found!</p>
                    </div>
                ) : filtered.map(a => {
                    const days = daysUntil(a.deadline)
                    const isOverdue = days < 0 && a.status !== 'done'
                    const isDueSoon = days >= 0 && days <= 2 && a.status !== 'done'
                    return (
                        <div key={a.id} className={`${styles.row} ${a.status === 'done' ? styles.done : ''}`}>
                            <div className={styles.rowLeft}>
                                <div className={styles.rowTop}>
                                    <span className={styles.assignTitle}>{a.title}</span>
                                    <span className={`${styles.priorityBadge} ${styles['p_' + a.priority]}`}>{a.priority}</span>
                                    <span className={`${styles.statusBadge} ${styles['s_' + a.status.replace('-', '')]}`}>{a.status}</span>
                                </div>
                                <div className={styles.rowMeta}>
                                    <span className={styles.userTag}>{a.user}</span>
                                    <span>{a.subject}</span>
                                    <span className={isOverdue ? styles.overdue : isDueSoon ? styles.dueSoon : ''}>
                                        {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${a.deadline} (${days}d)`}
                                    </span>
                                    {a.notes && <span className={styles.notes}>{a.notes}</span>}
                                </div>
                            </div>
                            {a.user === currentUser && (
                                <div className={styles.rowActions}>
                                    {a.status !== 'done' && (
                                        <button className={styles.doneBtn} onClick={() => onUpdate(a.id, { ...a, status: 'done' })}>Done</button>
                                    )}
                                    {a.status === 'pending' && (
                                        <button className={styles.progressBtn} onClick={() => onUpdate(a.id, { ...a, status: 'in-progress' })}>Start</button>
                                    )}
                                    <button className={styles.deleteBtn} onClick={() => onDelete(a.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}