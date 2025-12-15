import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
    "Auxiliar de creche", "AVE-Auxiliar de vida escolar", "Educação Especial", "AEE",
    "Auxiliar Administrativo", "Recursos Humanos", "Informática Administrativa", "Logística",
    "Segurança do trabalho", "Agente de Portaria e Vigia Escolar", "Inteligência Emocional",
    "Agente de Saúde", "Agente de combate as endemias", "Auxiliar Jurídico", "Operador de Caixa",
    "Recepcionista e Atendimento ao Cliente", "Liderança", "Negócios do Zero", "Empregabilidade",
    "Oratória e Comunicação", "Desenvolvimento Pessoal", "Vendas", "Inglês Básico",
    "Inglês Intermediário", "Inglês Avançado", "Operador de computador", "Cuidador de idosos",
    "Noções de elétrica Básica", "Estética Básica e limpeza de pele", "Maquiagem Básica",
    "Designer de Sobrancelhas", "Extensão de cilios", "Massagem", "Depilação",
    "Manutenção de celular", "Barbeiro", "Alfabetização", "Libras", "Secretariado",
    "Primeiros socorros", "Aplicação de Injetáveis", "Balconista de Farmácia", "Farmacologia",
    "Vendedor", "Padeiro", "Marketing Digital", "Vendas Onlines", "Manutenção de Notebook",
    "Manutenção de Impressoras", "Rede de computadores", "Provas para o ENEM", "Estoquista",
    "Auxiliar Bucal", "Manicure e Pedicure", "Doces e Salgados", "Furo Humanizado", "Excel",
    "Word", "Power Point", "Internet", "Windows", "Como gravar videos e editar no CapCut",
    "Canva", "Corel Draw", "Foto Shop", "Veterinário", "Redação", "Matemática", "Português",
    "Administração", "Psicologia Básica", "Introdução a Pedagogia", "Educação infantil",
    "Ludicidade", "Ludopedagogia", "Psicopedagogia", "Neurociência", "Informática aplicada a educação",
    "Metodologias ativas de aprendizagem", "Empreendedorismo", "Marketing",
    "Introdução ao serviço social", "Enfermagem básica", "Saúde da Mulher", "Recepcionista de UBS",
    "Noções de Triagem", "APH Atendimento pré hospitalar"
];

export async function GET() {
    try {
        let createdCount = 0;
        for (const title of courses) {
            const exists = await prisma.course.findFirst({ where: { title } });
            if (!exists) {
                await prisma.course.create({
                    data: {
                        title,
                        description: `Curso completo de ${title} com certificação profissional.`,
                        price: 99.90,
                        duration: 40,
                        published: true,
                    },
                });
                createdCount++;
            }
        }
        return NextResponse.json({ message: `Seeding complete. Created ${createdCount} courses.` });
    } catch (error) {
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}
