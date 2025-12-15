'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Award, AlertCircle, Clock, X } from 'lucide-react';
import styles from './exam.module.css';
import { generateSmartQuestions } from '@/utils/questionGenerator';
import { consumeDownloadCredit } from '@/app/actions/certificate';

export default function ExamClient({ title, courseId }: { title: string, courseId: string }) {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [isDownloading, setIsDownloading] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    useEffect(() => {
        setQuestions(generateSmartQuestions(title));
    }, [title]);

    useEffect(() => {
        if (submitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [submitted, questions]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} `;
    };

    const handleSelect = (questionId: number, optionIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct) correctCount++;
        });
        setScore(correctCount);
        setSubmitted(true);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const result = await consumeDownloadCredit(courseId);

            if (!result.success && result.redirect) {
                showToast("Seus créditos acabaram. Redirecionando para recarga...", 'error');
                setTimeout(() => router.push(result.redirect!), 2000);
                return;
            }

            if (result.success && result.certificateId) {
                showToast(`Certificado gerado! Créditos restantes: ${result.remaining} `, 'success');
                window.open(`/certificate/${result.certificateId}`, '_blank');
            } else {
                showToast(`Erro: ${result.error} `, 'error');
            }
        } catch (e: any) {
            console.error(e);
            showToast(`Erro no sistema: ${e.message} `, 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const passed = score >= 6;

    return (
        <main className={styles.container}>
            {/* Custom Toast Notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: toast.type === 'success' ? '#10b981' : '#dc2626',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 1000,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span style={{ fontWeight: 500 }}>{toast.message}</span>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '8px' }}>
                        <X size={16} />
                    </button>
                </div>
            )}
            <style jsx>{`
@keyframes slideIn {
                    from { transform: translateX(100 %); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
}
`}</style>

            <header className={styles.header}>
                <h1 className={styles.title}>Avaliação: {title}</h1>
                {!submitted && (
                    <div className={`${styles.timerBadge} ${timeLeft < 300 ? styles.timerUrgent : ''} `}>
                        <Clock size={20} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </header>

            {submitted ? (
                <div className={styles.resultCard}>
                    {passed ? (
                        <>
                            <CheckCircle size={64} className={styles.successIcon} />
                            <h2 className={styles.resultTitle}>Aprovado!</h2>
                            <p className={styles.scoreText}>Nota: {score}/10</p>
                            <div className={styles.certificateArea}>
                                <p>Certificado emitido com sucesso.</p>
                                <button
                                    className={styles.certificateButton}
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    <Award size={20} /> {isDownloading ? 'Gerando...' : 'Baixar PDF'}
                                </button>
                            </div>
                            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                                Voltar ao Painel
                            </button>
                        </>
                    ) : (
                        <>
                            <XCircle size={64} className={styles.failIcon} />
                            <h2 className={styles.resultTitle}>Reprovado</h2>
                            <p className={styles.scoreText}>Nota: {score}/10</p>
                            <p className={styles.feedback}>Tempo esgotado ou nota insuficiente (Mín: 6.0).</p>
                            <button onClick={() => window.location.reload()} className={styles.retryButton}>
                                Tentar Novamente
                            </button>
                            <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
                                Voltar ao Painel
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.examContent}>
                    <div className={styles.instructions}>
                        <AlertCircle size={20} />
                        <p>Você tem <b>60 minutos</b>. A prova será finalizada automaticamente quando o tempo acabar.</p>
                    </div>

                    {questions.map((q, index) => (
                        <div key={q.id} className={styles.questionCard}>
                            <h3 className={styles.questionText}>{q.text}</h3>
                            <div className={styles.optionsGrid}>
                                {q.options.map((opt: string, optIndex: number) => (
                                    <button
                                        key={optIndex}
                                        className={`${styles.option} ${answers[q.id] === optIndex ? styles.selected : ''} `}
                                        onClick={() => handleSelect(q.id, optIndex)}
                                    >
                                        <span className={styles.optionLabel}>{['A', 'B', 'C', 'D'][optIndex]}</span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                    >
                        Finalizar Avaliação
                    </button>
                </div>
            )}
        </main>
    );
}
