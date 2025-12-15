'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser } from '../actions/auth';
import { CheckCircle, Lock, User, Mail, FileText } from 'lucide-react';
import styles from '../offer/offer.module.css'; // Reusing styles

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Pre-filled from "payment gateway"
    const initialName = searchParams.get('name') || '';
    const initialEmail = searchParams.get('email') || '';
    const plan = searchParams.get('plan') || 'basic';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (!acceptedTerms) {
            setError('Você precisa aceitar os termos de uso.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', initialName);
        formData.append('email', initialEmail);
        formData.append('password', password);
        formData.append('plan', plan);
        formData.append('acceptedTerms', 'true');

        const result = await registerUser(formData);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Erro desconhecido.');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: '#dcfce7', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <CheckCircle size={48} color="#22c55e" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Cadastro Realizado!</h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Enviamos um link de confirmação para <strong>{initialEmail}</strong>.
                        <br />Por favor, verifique sua caixa de entrada para ativar sua conta.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '500px', width: '100%', background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>Finalizar Cadastro</h1>
                    <p style={{ color: '#64748b' }}>Complete seus dados para acessar a plataforma.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {/* Read-only fields from payment */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Nome (do pagamento)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b' }}>
                            <User size={18} />
                            {initialName || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Email (do pagamento)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b' }}>
                            <Mail size={18} />
                            {initialEmail || 'N/A'}
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Defina sua Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                required
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Confirme sua Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                required
                                placeholder="******"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            style={{ marginTop: '4px', width: '16px', height: '16px' }}
                        />
                        <label htmlFor="terms" style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.4' }}>
                            Li e aceito os <a href="#" style={{ color: '#2563eb' }}>Termos de Uso</a> e a <a href="#" style={{ color: '#2563eb' }}>Política de Privacidade (LGPD)</a>.
                        </label>
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
                    </button>
                </form>
            </div>
        </div>
    );
}
