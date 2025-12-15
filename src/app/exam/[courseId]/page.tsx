import { PrismaClient } from '@prisma/client';
import ExamClient from './ExamClient';
import styles from './exam.module.css';

const prisma = new PrismaClient();

async function getCourse(id: string) {
    return await prisma.course.findUnique({
        where: { id },
    });
}

export default async function ExamPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    // If course not found, could show 404, but for now fallback
    const title = course?.title || "Certificação Geral";

    return <ExamClient title={course.title} courseId={course.id} />;
}
