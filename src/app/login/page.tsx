'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser } from '@/app/actions/auth';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log("Submit started");

        try {
            const timeoutPromise = new Promise<{ success: boolean; error: string }>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 8000) // Reduced to 8s
            );

            console.log("Calling loginUser...");
            const result = await Promise.race([
                loginUser(email, password),
                timeoutPromise
            ]) as { success: boolean; error?: string };
            console.log("Result:", result);

            if (result.success) {
                // Visual feedback
                const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                if (btn) btn.innerText = "Sucesso! Redirecionando...";

                document.cookie = `auth_email=${email}; path=/; max-age=86400`;
                // Force hard navigation to bypass client router issues
                window.location.href = '/dashboard';
            } else {
                setError(result.error || 'Erro ao entrar.');
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Login call failed/timeout:", err);
            if (err.message === 'Timeout') {
                setError("O servidor demorou muito (Timeout 8s). Tente novamente.");
            } else {
                setError("Erro de conexão ou sistema.");
            }
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
                    <p>Esqueceu sua senha? <Link href="/forgot-password" className={styles.link}>Redefinir</Link></p>
                </div>
            </div>
        </main>
    );
}
