import React, { useState } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import { Question } from '../../types';

interface QuestionListProps {
  questions: Question[];
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  const [search, setSearch] = useState('');

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(search.toLowerCase()) ||
    q.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">Perguntas Recentes</h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {filteredQuestions.length} itens
          </span>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            placeholder="Buscar perguntas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>
      <div className="divide-y divide-slate-800">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? `Nenhuma pergunta encontrada para "${search}"` : 'Nenhuma pergunta personalizada encontrada.'}
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-800/50 transition-colors gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {q.category}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    q.difficulty === 'easy' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                    q.difficulty === 'medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                    'text-red-400 border-red-500/20 bg-red-500/10'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="font-bold text-slate-200 line-clamp-2 md:line-clamp-none">{q.questionText}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button 
                  onClick={() => onEdit(q)}
                  className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(q.id)}
                  className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
