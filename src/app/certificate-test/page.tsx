'use client';

import CertificateModern from '@/components/CertificateModern';

export default function CertificateTestPage() {
    // Dummy Data for Preview
    const dummyData = {
        userName: "João da Silva Sauro",
        courseName: "Inteligência Artificial Aplicada",
        cpf: "123.456.789-00",
        date: "29/12/2025",
        code: "TEST-2025-0001",
        duration: 80,
        modules: [
            { id: '1', title: 'Fundamentos de IA' },
            { id: '2', title: 'Machine Learning Básico' },
            { id: '3', title: 'Redes Neurais Profundas' },
            { id: '4', title: 'Ética em IA' },
            { id: '5', title: 'Projeto Prático Final' },
        ]
    };

    return (
        <CertificateModern
            {...dummyData}
        />
    );
}
