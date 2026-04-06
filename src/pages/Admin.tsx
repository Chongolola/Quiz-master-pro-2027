import React, { useState, useEffect } from 'react';
import { Question, Difficulty, QuestionType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, Loader2, BarChart3, Users, HelpCircle, CheckCircle2, Sparkles, FileJson, Upload } from 'lucide-react';
import { genAI, models } from '../lib/gemini';

export default function Admin() {
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
      setCurrentQuestion({
        category: '',
        difficulty: 'easy',
        type: 'multiple',
        questionText: '',
        correctAnswer: '',
        options: ['', '', '', ''],
        explanation: ''
      });
      fetchData();
    } catch (error) {
      console.error("Error saving question:", error);
    }
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
      alert('Perguntas importadas com sucesso!');
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
      alert('Erro ao gerar explicação com IA.');
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
      alert('Explicações geradas com sucesso!');
    } catch (error) {
      console.error("Error auto-generating explanations:", error);
      alert('Erro durante a geração automática.');
    } finally {
      setAutoGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black flex items-center gap-3">
            <ShieldCheck className="text-indigo-500" size={40} />
            Painel Administrativo
          </h1>
          <p className="text-slate-400">Gerencie o conteúdo do Quiz Master Pro.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={autoGenerateAllExplanations}
            disabled={autoGenerating}
            className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700 disabled:opacity-50"
          >
            {autoGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            Auto-Justificar
          </button>
          <button 
            onClick={() => setIsBulkImporting(true)}
            className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <FileJson size={20} /> Importar JSON
          </button>
          <button 
            onClick={() => { setIsEditing(true); setCurrentQuestion({ category: '', difficulty: 'easy', type: 'multiple', questionText: '', correctAnswer: '', options: ['', '', '', ''], explanation: '' }); }}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={20} /> Nova Pergunta
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users />} label="Total Usuários" value={stats.users} color="indigo" />
        <StatCard icon={<HelpCircle />} label="Perguntas Ativas" value={stats.questions} color="purple" />
        <StatCard icon={<BarChart3 />} label="Respostas Totais" value={stats.history} color="green" />
      </div>

      {/* Questions List */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Perguntas Recentes</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {questions.map((q) => (
            <div key={q.id} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-indigo-400">{q.category}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{q.difficulty}</span>
                </div>
                <p className="font-bold text-slate-200">{q.questionText}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setCurrentQuestion(q); setIsEditing(true); }}
                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">{currentQuestion.id ? 'Editar Pergunta' : 'Nova Pergunta'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                    <input 
                      type="text" 
                      value={currentQuestion.category} 
                      onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Dificuldade</label>
                    <select 
                      value={currentQuestion.difficulty} 
                      onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as Difficulty})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                  <select 
                    value={currentQuestion.type} 
                    onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as QuestionType})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="multiple">Múltipla Escolha</option>
                    <option value="boolean">Verdadeiro ou Falso</option>
                    <option value="text">Resposta Escrita</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Pergunta</label>
                  <textarea 
                    value={currentQuestion.questionText} 
                    onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Resposta Correta</label>
                  <input 
                    type="text" 
                    value={currentQuestion.correctAnswer} 
                    onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {currentQuestion.type === 'multiple' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Opções</label>
                    {currentQuestion.options?.map((opt, i) => (
                      <input 
                        key={i}
                        type="text" 
                        value={opt} 
                        onChange={(e) => {
                          const newOpts = [...(currentQuestion.options || [])];
                          newOpts[i] = e.target.value;
                          setCurrentQuestion({...currentQuestion, options: newOpts});
                        }}
                        placeholder={`Opção ${i + 1}`}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Explicação</label>
                    <button 
                      onClick={generateExplanation}
                      disabled={generatingExplanation}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
                    >
                      {generatingExplanation ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Gerar com IA
                    </button>
                  </div>
                  <textarea 
                    value={currentQuestion.explanation} 
                    onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {isBulkImporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">Importar Perguntas (JSON)</h2>
                <button onClick={() => setIsBulkImporting(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-400">
                  Cole um array JSON de perguntas. Cada objeto deve seguir o formato da interface Question.
                </p>
                <textarea 
                  value={bulkJson} 
                  onChange={(e) => setBulkJson(e.target.value)}
                  placeholder='[{"category": "...", "questionText": "...", "correctAnswer": "...", ...}]'
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[300px] font-mono text-xs"
                />
              </div>

              <div className="p-6 border-t border-slate-800 flex gap-4">
                <button 
                  onClick={() => setIsBulkImporting(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleBulkImport}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={20} /> Importar Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  const colors: any = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  
  return (
    <div className={`p-6 rounded-3xl border bg-slate-900 ${colors[color]} flex items-center gap-4`}>
      <div className="p-3 bg-slate-950/50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-xs font-black uppercase opacity-60">{label}</p>
        <p className="text-3xl font-black">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
