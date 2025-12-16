import { PrismaClient } from '@prisma/client';
import ExamClient from './ExamClient';
import styles from './exam.module.css';

const prisma = new PrismaClient();

async function getCourse(id: string) {
    return await prisma.course.findUnique({
        where: { id },
    });
}

import { redirect } from 'next/navigation';

export default async function ExamPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        redirect('/dashboard');
    }

    const title = course.title || "Certificação Geral";

    return <ExamClient title={title} courseId={course.id} />;
}
