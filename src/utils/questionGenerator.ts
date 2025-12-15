
// Database of specific questions for common topics
const QUESTION_BANK: Record<string, any[]> = {
    tech: [
        { text: "Qual a função do atalho Ctrl + C?", options: ["Copiar", "Colar", "Cortar", "Salvar"], correct: 0 },
        { text: "O que é um Backup?", options: ["Cópia de segurança", "Um vírus", "Um monitor", "Uma cadeira"], correct: 0 },
        { text: "Qual destes é um Sistema Operacional?", options: ["Windows", "Mouse", "Google", "Word"], correct: 0 },
        { text: "O que significa 'Nuvem' na informática?", options: ["Servidores acessados pela internet", "Água evaporada", "Um software de desenho", "Apenas um termo de marketing"], correct: 0 },
        { text: "Para que serve um Antivírus?", options: ["Proteger contra malware", "Deixar o PC mais rápido", "Criar planilhas", "Editar vídeos"], correct: 0 },
    ],
    admin: [
        { text: "O que é um Organograma?", options: ["Gráfico da estrutura da empresa", "Lista de compras", "Agenda telefônica", "Mapa da cidade"], correct: 0 },
        { text: "O que significa Feedback?", options: ["Retorno sobre desempenho", "Comida rápida", "Pagamento adiantado", "Demissão"], correct: 0 },
        { text: "Qual a função do RH?", options: ["Gestão de pessoas", "Limpeza", "Vendas diretas", "Conserto de máquinas"], correct: 0 },
    ],
    health: [
        { text: "O que é EPI?", options: ["Equipamento de Proteção Individual", "Exame Padrão Interno", "Enfermagem Para Idosos", "Escola Particular Infantil"], correct: 0 },
        { text: "Qual o telefone do SAMU?", options: ["192", "190", "193", "100"], correct: 0 },
        { text: "O que é assepsia?", options: ["Limpeza e desinfecção", "Uma doença", "Um medicamento", "Uma cirurgia"], correct: 0 },
    ]
};

// Generic templates for "Mad Libs" style generation
const GENERIC_TEMPLATES = [
    { text: "Qual é o principal objetivo de estudar @@?", options: ["Aprimoramento profissional em @@", "Apenas passar o tempo", "Decorar termos sem sentido", "Não há objetivo claro"], correct: 0 },
    { text: "No contexto de @@, o que é considerado uma 'Boa Prática'?", options: ["Seguir os padrões e normas da área", "Improvisar sempre", "Ignorar a segurança", "Fazer o mais rápido possível apenas"], correct: 0 },
    { text: "Qual habilidade é essencial para um profissional de @@?", options: ["Atenção aos detalhes e técnica", "Força física bruta", "Sorte", "Apenas rapidez"], correct: 0 },
    { text: "Como @@ impacta o mercado de trabalho atual?", options: ["Aumentando a demanda por especialistas", "Reduzindo salários", "Não tem impacto", "É uma área em extinção"], correct: 0 },
    { text: "Qual ferramenta é comumente associada a @@?", options: ["Softwares e equipamentos específicos da área", "Apenas papel e caneta", "Nenhuma ferramenta é usada", "Ferramentas de jardinagem"], correct: 0 },
    { text: "Para garantir a qualidade em @@, deve-se:", options: ["Revisar e seguir procedimentos", "Ignorar erros pequenos", "Não aceitar feedbacks", "Trabalhar isolado"], correct: 0 },
    { text: "Um erro comum de iniciantes em @@ é:", options: ["Não planejar antes de executar", "Estudar demais", "Ser muito organizado", "Perguntar dúvidas"], correct: 0 },
    { text: "A ética profissional em @@ envolve:", options: ["Honestidade e sigilo quando necessário", "Falar mal dos colegas", "Copiar trabalho alheio", "Chegar atrasado sempre"], correct: 0 },
    { text: "Para se manter atualizado em @@, recomenda-se:", options: ["Cursos contínuos e leitura da área", "Nunca mais estudar", "Apenas ver TV", "Mudar de profissão"], correct: 0 },
    { text: "Qual o primeiro passo para resolver um problema complexo em @@?", options: ["Analisar a causa raiz", "Entrar em pânico", "Desistir", "Culpar o computador"], correct: 0 },
    { text: "Em um projeto de @@, a comunicação deve ser:", options: ["Clara e objetiva", "Confusa e longa", "Inexistente", "Apenas por sinais"], correct: 0 },
    { text: "A segurança em @@ prioriza:", options: ["A prevenção de acidentes e erros", "A pressa", "A economia de materiais a qualquer custo", "O improviso"], correct: 0 },
];

export function generateSmartQuestions(courseTitle: string): any[] {
    const t = courseTitle.toLowerCase();
    let baseQuestions: any[] = [];

    // 1. Try to find specific questions
    if (t.includes('excel') || t.includes('word') || t.includes('power') || t.includes('informatica') || t.includes('computador')) {
        baseQuestions = [...QUESTION_BANK.tech];
    } else if (t.includes('adm') || t.includes('rh') || t.includes('lider') || t.includes('venda') || t.includes('gestao') || t.includes('negocio')) {
        baseQuestions = [...QUESTION_BANK.admin];
    } else if (t.includes('saude') || t.includes('enfermagem') || t.includes('socorro') || t.includes('farmacia') || t.includes('cuidador')) {
        baseQuestions = [...QUESTION_BANK.health];
    }

    // 2. Add generic "Mad Libs" questions until we have 10
    const needed = 10 - baseQuestions.length;

    // Shuffle generic templates to get random uniqueness
    const shuffledTemplates = [...GENERIC_TEMPLATES].sort(() => 0.5 - Math.random());

    for (let i = 0; i < needed; i++) {
        const template = shuffledTemplates[i % shuffledTemplates.length];
        baseQuestions.push({
            text: template.text.replace(/@@/g, courseTitle),
            options: template.options.map(o => o.replace(/@@/g, courseTitle)),
            correct: template.correct
        });
    }

    // 3. Ensure we have exactly 10 and map IDs
    return baseQuestions.slice(0, 10).map((q, i) => ({
        id: i + 1,
        text: q.text,
        options: q.options, // In a real app, shuffle options here too
        correct: q.correct
    }));
}
