import { PrismaClient } from '@prisma/client';
import CertificateTemplate from '@/components/CertificateTemplate';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const certificate = await prisma.certificate.findUnique({
        where: { id },
        include: {
            user: true,
            course: {
                include: {
                    modules: true
                }
            }
        }
    });

    if (!certificate) {
        notFound();
    }

    return (
        <CertificateTemplate
            userName={certificate.user.name || 'Aluno IEB'}
            courseName={certificate.course.title}
            date={certificate.issuedAt.toLocaleDateString('pt-BR')}
            code={certificate.code}
            duration={certificate.course.duration}
            modules={certificate.course.modules}
        />
    );
}
