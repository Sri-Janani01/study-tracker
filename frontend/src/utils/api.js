const BASE = 'http://localhost:3002/api';

export const api = {
    async getSessions(user = '') {
        const url = user ? `${BASE}/sessions?user=${user}` : `${BASE}/sessions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async createSession(data) {
        const res = await fetch(`${BASE}/sessions`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async deleteSession(id) {
        const res = await fetch(`${BASE}/sessions/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async getAssignments(user = '') {
        const url = user ? `${BASE}/assignments?user=${user}` : `${BASE}/assignments`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async createAssignment(data) {
        const res = await fetch(`${BASE}/assignments`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async updateAssignment(id, data) {
        const res = await fetch(`${BASE}/assignments/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async deleteAssignment(id) {
        const res = await fetch(`${BASE}/assignments/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },
    async getStats() {
        const res = await fetch(`${BASE}/stats`);
        if (!res.ok) throw new Error('Failed');
        return res.json();
    }
};