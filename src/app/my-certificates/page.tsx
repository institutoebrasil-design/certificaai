import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import { Award, Download } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '../../components/DashboardNav';
import styles from '../dashboard/dashboard.module.css';

const prisma = new PrismaClient();

async function getUserCertificates(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            certificates: {
                include: {
                    course: true
                },
                orderBy: { issuedAt: 'desc' }
            }
        }
    });

    if (!user) return [];

    return user.certificates.map(cert => ({
        ...cert,
        course: {
            ...cert.course,
            price: cert.course.price.toNumber()
        }
    }));
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MyCertificatesPage() {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('auth_email');

    if (!emailCookie?.value) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: emailCookie.value },
        include: {
            certificates: {
                include: {
                    course: true
                },
                orderBy: { issuedAt: 'desc' }
            }
        }
    });

    const certificates = user?.certificates.map(cert => ({
        ...cert,
        course: {
            ...cert.course,
            price: cert.course.price.toNumber()
        }
    })) || [];

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Image
                        src="/logo.png"
                        alt="CertificaAi"
                        width={200}
                        height={60}
                        quality={100}
                        priority
                        style={{ objectFit: 'contain' }}
                    />
                    <div className={styles.userProfile}>
                        <span className={styles.welcome}>Olá, {user?.name || 'Estudante'}</span>
                        <div className={styles.avatar}>{user?.name?.[0] || 'E'}</div>
                    </div>
                </div>
            </header>

            <DashboardNav role={user?.role} />

            <div className={styles.content}>
                <section className={styles.certificatesSection}>
                    <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award className={styles.heartIcon} size={24} color="#d97706" /> Meus Certificados
                    </h2>

                    {certificates.length > 0 ? (
                        <div className={styles.grid}>
                            {certificates.map((cert) => (
                                <div key={cert.id} className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconWrapper}>
                                            <Award color="white" size={24} />
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <h3 className={styles.cardTitle}>{cert.course.title}</h3>
                                            <small style={{ color: '#64748b' }}>Emitido em: {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}</small>
                                        </div>
                                    </div>

                                    <p className={styles.cardDescription}>
                                        Código de validação: <strong>{cert.code}</strong>
                                    </p>

                                    <Link
                                        href={`/certificate/${cert.id}`}
                                        className={styles.cardButton}
                                        style={{ marginTop: 'auto', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        target="_blank"
                                    >
                                        <Download size={18} style={{ marginRight: '8px' }} /> Baixar PDF
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            <Award size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <h3>Você ainda não possui certificados.</h3>
                            <p>Complete as provas na área de Certificações Disponíveis para conquistar seus diplomas!</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
