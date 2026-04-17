import { useState, useEffect } from 'react';
import { Question, Difficulty, QuestionType } from '../types';
import { genAI, models } from '../lib/gemini';
import { OFFLINE_QUESTIONS } from '../pages/Quiz';

export function useAdminData() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    category: '',
    difficulty: 'easy',
    type: 'multiple',
    questionText: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    explanation: ''
  });
  const [stats, setStats] = useState({ users: 1, questions: 0, history: 0 });
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    try {
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
      setQuestions(storedQuestions);
      
      setStats({
        users: 1,
        questions: storedQuestions.length,
        history: 0
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    try {
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
      const data = {
        ...currentQuestion,
        id: currentQuestion.id || Date.now().toString(),
        createdAt: currentQuestion.createdAt || Date.now()
      } as Question;
      
      let newQuestions;
      if (currentQuestion.id) {
        newQuestions = storedQuestions.map((q: Question) => q.id === currentQuestion.id ? data : q);
      } else {
        newQuestions = [data, ...storedQuestions];
      }
      
      localStorage.setItem('quiz_master_custom_questions', JSON.stringify(newQuestions));
      setIsEditing(false);
      resetCurrentQuestion();
      fetchData();
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      category: '',
      difficulty: 'easy',
      type: 'multiple',
      questionText: '',
      correctAnswer: '',
      options: ['', '', '', ''],
      explanation: ''
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    try {
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
      const newQuestions = storedQuestions.filter((q: Question) => q.id !== id);
      localStorage.setItem('quiz_master_custom_questions', JSON.stringify(newQuestions));
      fetchData();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleBulkImport = () => {
    try {
      const imported = JSON.parse(bulkJson);
      if (!Array.isArray(imported)) throw new Error('O JSON deve ser um array de perguntas.');
      
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
      const newQuestions = [...imported.map(q => ({
        ...q,
        id: q.id || Math.random().toString(36).substr(2, 9),
        createdAt: q.createdAt || Date.now()
      })), ...storedQuestions];
      
      localStorage.setItem('quiz_master_custom_questions', JSON.stringify(newQuestions));
      setBulkJson('');
      setIsBulkImporting(false);
      fetchData();
    } catch (error) {
      alert('Erro ao importar JSON: ' + (error as Error).message);
    }
  };

  const generateExplanation = async () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      alert('Preencha a pergunta e a resposta correta primeiro.');
      return;
    }
    
    setGeneratingExplanation(true);
    try {
      const response = await genAI.models.generateContent({
        model: models.flash,
        contents: `Como um especialista em educação, forneça uma explicação curta e clara (máximo 2 frases) para a seguinte pergunta de quiz.
          Pergunta: ${currentQuestion.questionText}
          Resposta Correta: ${currentQuestion.correctAnswer}
          
          A explicação deve justificar por que esta é a resposta correta.
          Retorne APENAS o texto da explicação.`,
      });
      
      setCurrentQuestion({ ...currentQuestion, explanation: response.text });
    } catch (error) {
      console.error("Error generating explanation:", error);
    } finally {
      setGeneratingExplanation(false);
    }
  };

  const autoGenerateAllExplanations = async () => {
    const questionsToFix = questions.filter(q => !q.explanation || q.explanation.trim() === '');
    if (questionsToFix.length === 0) {
      alert('Todas as perguntas já possuem explicações.');
      return;
    }

    if (!window.confirm(`Deseja gerar explicações com IA para ${questionsToFix.length} perguntas?`)) return;

    setAutoGenerating(true);
    try {
      const storedQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
      const updatedQuestions = [...storedQuestions];

      for (const q of questionsToFix) {
        const response = await genAI.models.generateContent({
          model: models.flash,
          contents: `Forneça uma explicação curta e clara (máximo 2 frases) para a seguinte pergunta de quiz.
            Pergunta: ${q.questionText}
            Resposta Correta: ${q.correctAnswer}
            Retorne APENAS o texto da explicação.`,
        });

        const index = updatedQuestions.findIndex(uq => uq.id === q.id);
        if (index !== -1) {
          updatedQuestions[index].explanation = response.text;
        }
      }

      localStorage.setItem('quiz_master_custom_questions', JSON.stringify(updatedQuestions));
      fetchData();
    } catch (error) {
      console.error("Error auto-generating explanations:", error);
    } finally {
      setAutoGenerating(false);
    }
  };

  const handleDownload = () => {
    const allQuestions = [...OFFLINE_QUESTIONS, ...questions];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allQuestions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quiz_questions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return {
    questions,
    loading,
    isEditing,
    setIsEditing,
    currentQuestion,
    setCurrentQuestion,
    stats,
    isBulkImporting,
    setIsBulkImporting,
    bulkJson,
    setBulkJson,
    generatingExplanation,
    autoGenerating,
    handleSave,
    handleDelete,
    handleBulkImport,
    generateExplanation,
    autoGenerateAllExplanations,
    handleDownload,
    resetCurrentQuestion
  };
}
