'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // PKCE: The code comes in URL. We need to exchange it.
    // Supabase client handles this if we call exchangeCodeForSession, 
    // OR simply by `onAuthStateChange` if the URL is correct.
    // However, explicitly handling `code` is safer for custom flows.

    useEffect(() => {
        const handleCodeExchange = async () => {
            const code = searchParams.get('code');
            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setError("O link de recuperação expirou ou é inválido. Tente solicitar novamente.");
                }
            }
        };
        handleCodeExchange();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            toast.success('Senha atualizada com sucesso!');
            setTimeout(() => router.push('/login'), 3000);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
                <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: '#dcfce7', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <CheckCircle size={48} color="#22c55e" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Senha Alterada!</h2>
                    <p style={{ color: '#64748b' }}>Sua senha foi redefinida com sucesso.</p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Redirecionando para o login em instantes...</p>

                    <button
                        onClick={() => router.push('/login')}
                        style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Ir para Login agora
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Nova Senha</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Defina sua nova senha de acesso.</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                placeholder="Nova senha"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                placeholder="Confirme a nova senha"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
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
                        {loading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
