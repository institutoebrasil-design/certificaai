import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import DashboardNav from '../../components/DashboardNav';
import AdminClient from './AdminClient';
import styles from '../dashboard/dashboard.module.css';
import { getAllUsers } from '../actions/admin';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

import { cookies } from 'next/headers';

async function getUser() {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('auth_email');
    if (!emailCookie?.value) return null;

    return await prisma.user.findUnique({
        where: { email: emailCookie.value }
    });
}

export default async function AdminPage() {
    const currentUser = await getUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const users = await getAllUsers();

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
                        <span className={styles.welcome}>Olá, {currentUser.name || 'Admin'}</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </div>
            </header>

            <DashboardNav role={currentUser.role} />

            <div className={styles.content}>
                <h2 className={styles.sectionTitle} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    Painel Administrativo
                </h2>
                <AdminClient initialUsers={users} />
            </div>
        </main>
    );
}
