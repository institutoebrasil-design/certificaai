'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Star, Shield, Clock, Award, Users, Unlock } from 'lucide-react';
import styles from './offer.module.css';

export default function OfferPage() {
    const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds === 0) {
                    if (prev.minutes === 0) return prev;
                    return { minutes: prev.minutes - 1, seconds: 59 };
                }
                return { ...prev, seconds: prev.seconds - 1 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <span className={styles.pulse}>●</span> Análise Concluída: Perfil Aprovado
                </div>

                <h1 className={styles.title}>
                    Comece Sua Nova Carreira com a<br />
                    Certificação Profissional IEB
                </h1>

                <p className={styles.subtitle}>
                    Seu perfil demonstrou alto potencial. Desbloqueie o acesso ao método mais
                    rápido e seguro de validação profissional para dezenas de áreas.
                </p>

                <div className={styles.timerContainer}>
                    <div className={styles.timerBlock}>
                        <span className={styles.timerValue}>
                            {String(timeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className={styles.timerLabel}>Minutos</span>
                    </div>
                    <div className={styles.timerBlock}>
                        <span className={styles.timerValue}>:</span>
                    </div>
                    <div className={styles.timerBlock}>
                        <span className={styles.timerValue}>
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className={styles.timerLabel}>Segundos</span>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className={styles.advantagesSection}>
                <h2 className={styles.sectionTitle}>Por que a IEB Certifica IA?</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <Award color="white" size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Reconhecimento Imediato</h3>
                        <p className={styles.cardText}>
                            Certificados válidos e verificáveis instantaneamente via QR Code.
                            Dê um upgrade no seu LinkedIn hoje mesmo.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <Clock color="white" size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Flexibilidade Total</h3>
                        <p className={styles.cardText}>
                            Estude no seu ritmo. Nossa plataforma se adapta a sua rotina,
                            seja 30 minutos ou 2 horas por dia.
                        </p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <Shield color="white" size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Garantia de Qualidade</h3>
                        <p className={styles.cardText}>
                            Conteúdo atualizado semanalmente com as últimas novidades
                            do mercado de trabalho.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonialsSection}>
                <h2 className={styles.sectionTitle}>O que nossos alunos dizem</h2>
                <div className={styles.grid}>
                    <div className={styles.testimonialCard}>
                        <div className={styles.userInfo}>
                            <img src="/avatars/user1.jpg" alt="Aluno" className={styles.userAvatar} style={{ background: '#4ade80' }} />
                            <div>
                                <span className={styles.userName}>Ricardo Silva</span>
                                <span className={styles.userRole}>Desenvolvedor Web</span>
                            </div>
                        </div>
                        <p className={styles.quote}>
                            "A certificação mudou minha carreira. Consegui uma vaga senior
                            apenas 2 semanas após concluir o curso Professional."
                        </p>
                    </div>
                    <div className={styles.testimonialCard}>
                        <div className={styles.userInfo}>
                            <img src="/avatars/user2.jpg" alt="Aluna" className={styles.userAvatar} style={{ background: '#f472b6' }} />
                            <div>
                                <span className={styles.userName}>Amanda Costa</span>
                                <span className={styles.userRole}>Analista de Marketing</span>
                            </div>
                        </div>
                        <p className={styles.quote}>
                            "O conteúdo direto ao ponto e a correção via IA são incríveis.
                            Não perdi tempo com teoria inútil."
                        </p>
                    </div>
                    <div className={styles.testimonialCard}>
                        <div className={styles.userInfo}>
                            <img src="/avatars/user3.jpg" alt="Aluno" className={styles.userAvatar} style={{ background: '#60a5fa' }} />
                            <div>
                                <span className={styles.userName}>Carlos Mendes</span>
                                <span className={styles.userRole}>Gestor de Projetos</span>
                            </div>
                        </div>
                        <p className={styles.quote}>
                            "O valor é simbólico perto do retorno que tive. Só o bônus de
                            LinkedIn já valeu o investimento."
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className={styles.pricingSection}>
                <h2 className={styles.sectionTitle}>Escolha seu Plano</h2>
                <div className={styles.grid}>
                    {/* Basic */}
                    <div className={styles.pricingCard}>
                        <h3 className={styles.planName}>Básico</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>R$</span>49,90
                        </div>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> 1 Certificação</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Carga Horária: 40h</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Acesso à Plataforma</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Suporte por Email</li>
                        </ul>
                        <Link href="/checkout-simulation?plan=basic" className={styles.ctaButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Começar Agora</Link>
                    </div>

                    {/* Professional */}
                    <div className={`${styles.pricingCard} ${styles.popularCard}`}>
                        <div className={styles.popularBadge}>MAIS VENDIDO</div>
                        <h3 className={styles.planName}>Profissional</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>R$</span>99,90
                        </div>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> 3 Certificação</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Carga Horária: 60h cada</li>
                            <li className={styles.featureItem}><Star size={20} color="#fbbf24" /> Pack Prompts ChatGPT</li>
                            <li className={styles.featureItem}><Star size={20} color="#fbbf24" /> Guia LinkedIn IA</li>
                        </ul>
                        <Link href="/checkout-simulation?plan=pro" className={`${styles.ctaButton} ${styles.primaryButton}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Garantir Vaga</Link>
                    </div>

                    {/* Premium */}
                    <div className={styles.pricingCard}>
                        <h3 className={styles.planName}>Premium</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>R$</span>149,90
                        </div>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> 5 Certificações</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Carga Horária: 80h cada</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Consultoria Automática</li>
                            <li className={styles.featureItem}><Check size={20} color="#4ade80" /> Todos os Bônus</li>
                            <li className={styles.featureItem}><Unlock size={20} color="#a855f7" /> Acesso Antecipado</li>
                        </ul>
                        <Link href="/checkout-simulation?plan=premium" className={styles.ctaButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Quero Tudo</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
