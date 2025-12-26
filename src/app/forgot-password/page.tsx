'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { sendRecoveryEmail } from '../actions/auth';
// Reusing login styles for consistency. Make sure login.module.css is accessible or duplicate pertinent styles.
// Since we can't easily reusing module css from another app dir without path issues, inline or copy is safest.
// We'll use inline styles/tailwind-like approach for simplicity or duplicate logic.
// Actually, I'll copy the structure of login page but use inline styles mapped to the design system I observed.
// Or better, I'll assume I can import specific components if they existed. But I'll build it standalone to be safe.

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await sendRecoveryEmail(email);

        if (result.success) {
            setMessage({ type: 'success', text: 'Email de recuperação enviado! Verifique sua caixa de entrada (e spam).' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Erro ao enviar email.' });
        }
        setLoading(false);
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Recuperar Senha</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Digite seu email para receber o link de redefinição.</p>
                </div>

                {message && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#dc2626',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                placeholder="Seu email cadastrado"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Enviando...' : <>Enviar Email <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/login" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ArrowLeft size={16} /> Voltar para Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
