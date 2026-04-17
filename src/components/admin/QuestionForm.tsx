import React from 'react';
import { Save, Sparkles, Loader2 } from 'lucide-react';
import { Question, Difficulty, QuestionType } from '../../types';

interface QuestionFormProps {
  currentQuestion: Partial<Question>;
  setCurrentQuestion: (q: Partial<Question>) => void;
  onSave: () => void;
  onCancel: () => void;
  onGenerateExplanation: () => void;
  generatingExplanation: boolean;
}

export function QuestionForm({
  currentQuestion,
  setCurrentQuestion,
  onSave,
  onCancel,
  onGenerateExplanation,
  generatingExplanation
}: QuestionFormProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
            <input 
              type="text" 
              placeholder="Ex: Enfermagem"
              value={currentQuestion.category} 
              onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dificuldade</label>
            <select 
              value={currentQuestion.difficulty} 
              onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as Difficulty})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Pergunta</label>
          <div className="grid grid-cols-3 gap-2">
            {(['multiple', 'boolean', 'text'] as QuestionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCurrentQuestion({...currentQuestion, type})}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  currentQuestion.type === type 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                {type === 'multiple' ? 'Múltipla' : type === 'boolean' ? 'V/F' : 'Texto'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pergunta</label>
          <textarea 
            placeholder="Digite o enunciado da pergunta..."
            value={currentQuestion.questionText} 
            onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resposta Correta</label>
          <input 
            type="text" 
            placeholder="A resposta exata..."
            value={currentQuestion.correctAnswer} 
            onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        {currentQuestion.type === 'multiple' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opções de Resposta</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options?.map((opt, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">{String.fromCharCode(65 + i)}</span>
                  <input 
                    type="text" 
                    value={opt} 
                    onChange={(e) => {
                      const newOpts = [...(currentQuestion.options || [])];
                      newOpts[i] = e.target.value;
                      setCurrentQuestion({...currentQuestion, options: newOpts});
                    }}
                    placeholder={`Opção ${i + 1}`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 pl-8 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Explicação / Justificativa</label>
            <button 
              type="button"
              onClick={onGenerateExplanation}
              disabled={generatingExplanation}
              className="text-[10px] font-black uppercase tracking-tighter text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 transition-all"
            >
              {generatingExplanation ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
              Gerar com IA
            </button>
          </div>
          <textarea 
            placeholder="Por que esta resposta está correta?"
            value={currentQuestion.explanation} 
            onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px] transition-all text-sm"
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-800 hover:bg-slate-750 py-3.5 rounded-xl font-bold transition-all text-slate-300"
        >
          Cancelar
        </button>
        <button 
          type="button"
          onClick={onSave}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Save size={20} /> Salvar Pergunta
        </button>
      </div>
    </div>
  );
}
