'use client';

import { useState } from 'react';
import { updateUserCredits } from '../actions/admin';
import { Search, Plus, User, Shield, GraduationCap } from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    role: string;
    credits: number;
    certificates: any[];
    examAttempts: any[];
}

export default function AdminClient({ initialUsers }: { initialUsers: AdminUser[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCredits = async (userId: string) => {
        const amount = parseInt(amounts[userId]);
        if (!amount || isNaN(amount)) return;

        const result = await updateUserCredits(userId, amount);
        if (result.success) {
            setUsers(users.map(u =>
                u.id === userId ? { ...u, credits: u.credits + amount } : u
            ));
            setAmounts({ ...amounts, [userId]: '' });
        } else {
            alert('Erro ao adicionar créditos');
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.controlsRow}>
                <div className={styles.searchBar}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar usuários por nome ou email..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                <div className={styles.card} style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', color: '#64748b' }}>Usuário</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Email</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Role</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Certificados</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Créditos</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className={styles.avatar} style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        {user.name || 'Sem nome'}
                                    </td>
                                    <td style={{ padding: '15px', color: '#475569' }}>{user.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            background: user.role === 'ADMIN' ? '#dcfce7' : '#f1f5f9',
                                            color: user.role === 'ADMIN' ? '#166534' : '#475569',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <GraduationCap size={16} color="#64748b" />
                                            {user.certificates.length}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>{user.credits}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="number"
                                                placeholder="Qtd"
                                                style={{
                                                    width: '60px',
                                                    padding: '5px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #cbd5e1'
                                                }}
                                                value={amounts[user.id] || ''}
                                                onChange={(e) => setAmounts({ ...amounts, [user.id]: e.target.value })}
                                            />
                                            <button
                                                onClick={() => handleAddCredits(user.id)}
                                                style={{
                                                    padding: '5px 10px',
                                                    background: '#22c55e',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
