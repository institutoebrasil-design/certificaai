'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

type Question = {
  id: number;
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "Qual é o seu principal objetivo com a certificação?",
    options: [
      "Conseguir um emprego melhor",
      "Ser promovido no trabalho atual",
      "Começar uma nova carreira",
      "Validar meus conhecimentos em IA"
    ]
  },
  {
    id: 2,
    text: "Qual seu nível de conhecimento atual?",
    options: [
      "Totalmente iniciante",
      "Já sei o básico",
      "Intermediário",
      "Avançado"
    ]
  },
  {
    id: 3,
    text: "Quanto tempo você pode dedicar por dia?",
    options: [
      "30 minutos",
      "1 hora",
      "2 horas ou mais",
      "Apenas finais de semana"
    ]
  },
  {
    id: 4,
    text: "O que te impede de evoluir hoje?",
    options: [
      "Falta de tempo",
      "Conteúdo desorganizado na internet",
      "Falta de certificados reconhecidos",
      "Custo alto de cursos"
    ]
  }
];

export default function Quiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state to prevent flash

  useEffect(() => {
    async function checkAuth() {
      // 1. Check for active Supabase session
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace('/dashboard');
        return;
      }

      // 2. Check for "known user" cookie (set in register/login)
      // We need to parse cookies manually or assume browser handles it if using a library.
      // Simple document.cookie check
      const hasAuthCookie = document.cookie.split(';').some((item) => item.trim().startsWith('auth_email='));

      if (hasAuthCookie) {
        router.replace('/login');
        return;
      }

      setIsLoading(false);
    }

    checkAuth();
  }, [router]);

  if (isLoading || isAnalyzing) {
    return (
      <main className={styles.container}>
        <div className={styles.quizCard}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            {isAnalyzing && (
              <>
                <h2 className={styles.title}>Analisando seu Perfil...</h2>
                <div className={styles.analyzingText}>
                  <p>Verificando compatibilidade...</p>
                  <p>Selecionando melhores trilhas...</p>
                  <p>Gerando plano personalizado...</p>
                </div>
              </>
            )}
            {!isAnalyzing && <p style={{ marginTop: '1rem' }}>Carregando...</p>}
          </div>
        </div>
      </main>
    );
  }

  const handleOptionClick = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsAnalyzing(true);
      // Simulate analysis delay before redirect
      setTimeout(() => {
        router.push('/offer');
      }, 2500);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  if (isAnalyzing) {
    return (
      <main className={styles.container}>
        <div className={styles.quizCard}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <h2 className={styles.title}>Analisando seu Perfil...</h2>
            <div className={styles.analyzingText}>
              <p>Verificando compatibilidade...</p>
              <p>Selecionando melhores trilhas...</p>
              <p>Gerando plano personalizado...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <main className={styles.container}>
      <div className={styles.quizCard}>
        <div className={styles.progressBarAction}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className={styles.title}>Passo {currentStep + 1} de {questions.length}</h2>

        <div className={styles.question}>
          {currentQuestion.text}
        </div>

        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={styles.optionButton}
              onClick={handleOptionClick}
            >
              <span>{option}</span>
              <ChevronRight size={20} />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
