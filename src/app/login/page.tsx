'use client';

import { useState } from 'react';
import { loginUser } from '@/app/actions/auth'; // Static import

// ... inside component

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const result = await loginUser(email, password);

        if (result.success) {
            // Set plain cookie for middleware/client checks (optional but useful)
            document.cookie = `auth_email=${email}; path=/; max-age=86400`;
            router.push('/dashboard');
            router.refresh();
        } else {
            setError(result.error || 'Erro ao entrar.');
            setLoading(false);
        }
    } catch (err) {
        console.error("Login call failed:", err);
        setError("Erro de conexão. Tente novamente.");
        setLoading(false);
    }
};

return (
    <main className={styles.container}>
        <div className={styles.loginCard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Bem-vindo de volta</h1>
                <p className={styles.subtitle}>Acesse sua área do aluno</p>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <Mail className={styles.icon} size={20} />
                    <input
                        type="email"
                        placeholder="Seu email"
                        className={styles.input}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <Lock className={styles.icon} size={20} />
                    <input
                        type="password"
                        placeholder="Sua senha"
                        className={styles.input}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        <>
                            Entrar <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className={styles.footer}>
                <p>Ainda não tem conta? <Link href="/offer" className={styles.link}>Escolha um plano</Link></p>
            </div>
        </div>
    </main>
);
}
