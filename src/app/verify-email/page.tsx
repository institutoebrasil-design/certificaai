'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyUserEmail } from '../actions/auth';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        verifyUserEmail(token)
            .then((result) => {
                if (result.success) {
                    setStatus('success');
                    toast.success('Email verificado com sucesso!');
                    setTimeout(() => router.push('/login'), 3000);
                } else {
                    setStatus('error');
                    toast.error(result.error);
                }
            })
            .catch(() => setStatus('error'));
    }, [token, router]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
                {status === 'verifying' && (
                    <>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Verificando...</h2>
                        <p style={{ color: '#64748b' }}>Aguarde enquanto confirmamos seu email.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Email Verificado!</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Sua conta foi ativada. Você será redirecionado para o login.</p>
                        <button onClick={() => router.push('/login')} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            Ir para Login
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Erro na Verificação</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>O link é inválido ou expirou.</p>
                        <button onClick={() => router.push('/login')} style={{ padding: '0.75rem 1.5rem', background: '#cbd5e1', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            Voltar
                        </button>
                    </>
                )}
            </div>
            <style jsx global>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
