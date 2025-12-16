'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { shuffleOptions } from '@/utils/questionGenerator';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAiExam(courseTitle: string) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY missing. Returning mock data.");
        return null; // Signals frontend to use fallback
    }

    try {
        const prompt = `
Você é um especialista em educação profissional, avaliação de competências e elaboração de provas para certificações.

Sua tarefa é criar uma prova avaliativa AUTOMÁTICA com base APENAS no nome da certificação informada: "${courseTitle}"

A partir do nome da certificação, você deve:
1. Inferir os principais conteúdos normalmente ensinados nessa formação.
2. Criar uma prova objetiva coerente com um curso livre/profissionalizante.
3. Avaliar conhecimentos conceituais, técnicos e práticos.
4. Não citar instituições específicas, leis ou normas que não sejam de conhecimento geral.
5. Não fazer suposições fora do escopo do nome da certificação.

Regras da prova:
- Total de 10 questões objetivas
- Cada questão deve ter exatamente 4 alternativas (A, B, C, D)
- Apenas 1 alternativa correta por questão
- Dificuldade: intermediária
- Linguagem clara, profissional e neutra
- Questões independentes entre si

⚠️ IMPORTANTE:
- Você DEVE retornar o gabarito.
- Você NÃO deve explicar as respostas.
- Você NÃO deve tomar decisões de aprovação ou reprovação.

FORMATO DE RETORNO OBRIGATÓRIO:
Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) contendo um array de objetos.
Exemplo de estrutura:
[
  {
    "id": 1,
    "text": "Enunciado da questão...",
    "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
    "correct": 0
  }
]
Nota: "correct" deve ser o índice da resposta correta (0 para A, 1 para B, etc).
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Sanitize JSON (sometimes AI returns markdown code blocks)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions = JSON.parse(jsonString);

        // Ensure we have IDs and correct structure
        return questions.map((q: any, i: number) => {
            // Randomize options for AI as well (just in case AI biases to 'A')
            const shuffled = shuffleOptions({
                text: q.text,
                options: q.options,
                correct: q.correct
            });

            return {
                id: i + 1,
                text: shuffled.text,
                options: shuffled.options,
                correct: shuffled.correct
            };
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return null; // Fallback
    }
}
