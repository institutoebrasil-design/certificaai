import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import DashboardClient from './DashboardClient';
import styles from './dashboard.module.css';
import DashboardNav from '../../components/DashboardNav';

const prisma = new PrismaClient();

async function getCourses() {
    const courses = await prisma.course.findMany({
        orderBy: { title: 'asc' },
    });
    return courses.map(course => ({
        ...course,
        price: course.price.toNumber()
    }));
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUser() {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('auth_email');

    if (!emailCookie?.value) return null;

    return await prisma.user.findUnique({
        where: { email: emailCookie.value }
    });
}

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    const courses = await getCourses();

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

            <DashboardClient initialCourses={courses} />
        </main>
    );
}
