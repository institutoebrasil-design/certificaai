'use client';

import { useState } from 'react';
import { updateUserCredits, deleteCertificate, deleteCourse } from '../actions/admin';
import { Search, Plus, User, Shield, GraduationCap, Trash } from 'lucide-react';
import { toast } from 'sonner';
import styles from '../dashboard/dashboard.module.css';
import ConfirmModal from '../../components/ConfirmModal';

interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    role: string;
    credits: number;
    certificates: {
        id: string;
        course: {
            title: string;
        };
    }[];
    examAttempts: any[];
}

interface AdminCertificate {
    id: string;
    code: string;
    issuedAt: Date;
    course: { title: string };
    user: { name: string | null; email: string };
}

interface AdminCourse {
    id: string;
    title: string;
    _count: { certificates: number; purchases: number };
}

export default function AdminClient({ initialUsers, initialCertificates, initialCourses }: { initialUsers: AdminUser[], initialCertificates: AdminCertificate[], initialCourses: AdminCourse[] }) {
    const [activeTab, setActiveTab] = useState<'users' | 'certificates' | 'courses'>('users');
    const [users, setUsers] = useState(initialUsers);
    const [certificates, setCertificates] = useState(initialCertificates);
    const [courses, setCourses] = useState(initialCourses);
    const [searchTerm, setSearchTerm] = useState('');
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { },
    });

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCertificates = certificates.filter(cert =>
        cert.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            toast.success('Créditos adicionados!');
        } else {
            toast.error('Erro ao adicionar créditos');
        }
    };

    const handleDeleteCert = (certId: string, userId?: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Certificado',
            description: 'Tem certeza que deseja excluir esta certificação? Esta ação não pode ser desfeita.',
            onConfirm: async () => {
                const result = await deleteCertificate(certId);
                if (result.success) {
                    setCertificates(prev => prev.filter(c => c.id !== certId));
                    setUsers(prev => prev.map(u => ({
                        ...u,
                        certificates: u.certificates.filter(c => c.id !== certId)
                    })));
                    toast.success('Certificado excluído com sucesso!');
                } else {
                    toast.error('Erro ao excluir certificado');
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDeleteCourse = (courseId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Certificação (Curso)',
            description: 'ATENÇÃO: Excluir uma certificação removerá também todos os exames e diplomas associados. Tem certeza absoluta?',
            onConfirm: async () => {
                const result = await deleteCourse(courseId);
                if (result.success) {
                    setCourses(prev => prev.filter(c => c.id !== courseId));
                    toast.success('Certificação excluída com sucesso!');
                } else {
                    toast.error('Erro ao excluir certificação.');
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    return (
        <div className={styles.content}>
            <div className={styles.controlsRow} style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'users' ? '#4f46e5' : 'white',
                            color: activeTab === 'users' ? 'white' : '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Usuários
                    </button>
                    <button
                        onClick={() => setActiveTab('certificates')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'certificates' ? '#4f46e5' : 'white',
                            color: activeTab === 'certificates' ? 'white' : '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Diplomas Emitidos
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'courses' ? '#4f46e5' : 'white',
                            color: activeTab === 'courses' ? 'white' : '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Cursos (Certificações)
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {activeTab === 'users' && (
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
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {user.certificates.length > 0 ? (
                                                    user.certificates.map(cert => (
                                                        <div key={cert.id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            background: '#f8fafc',
                                                            padding: '6px 10px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0',
                                                            fontSize: '13px',
                                                            gap: '10px'
                                                        }}>
                                                            <span style={{ color: '#334155' }}>{cert.course.title}</span>
                                                            <button
                                                                onClick={() => handleDeleteCert(cert.id, user.id)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: '#ef4444',
                                                                    padding: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                                title="Excluir Certificado"
                                                            >
                                                                <Trash size={14} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>
                                                )}
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
            )}

            {activeTab === 'certificates' && (
                <div className={styles.card} style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', color: '#64748b' }}>Aluno</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Curso</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Código</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Data Emissão</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCertificates.map(cert => (
                                <tr key={cert.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 500 }}>{cert.user.name || 'Sem nome'}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{cert.user.email}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{cert.course.title}</td>
                                    <td style={{ padding: '15px' }}>
                                        <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                            {cert.code}
                                        </code>
                                    </td>
                                    <td style={{ padding: '15px', color: '#475569' }}>
                                        {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button
                                            onClick={() => handleDeleteCert(cert.id)}
                                            style={{
                                                background: '#fee2e2',
                                                color: '#ef4444',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <Trash size={16} /> Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className={styles.card} style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', color: '#64748b' }}>Certificação (Curso)</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Diplomas Emitidos</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Vendas</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => (
                                <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '16px' }}>{course.title}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {course.id}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ fontWeight: 500, color: '#4f46e5' }}>{course._count.certificates}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ fontWeight: 500, color: '#10b981' }}>{course._count.purchases}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            style={{
                                                background: '#fee2e2',
                                                color: '#ef4444',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <Trash size={16} /> Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                description={confirmModal.description}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
