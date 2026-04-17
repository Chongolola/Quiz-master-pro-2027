import React from 'react';
import { ShieldCheck, Sparkles, Download, FileJson, Plus, Loader2 } from 'lucide-react';

interface AdminHeaderProps {
  autoGenerating: boolean;
  onAutoGenerate: () => void;
  onDownload: () => void;
  onImport: () => void;
  onNewQuestion: () => void;
}

export function AdminHeader({ 
  autoGenerating, 
  onAutoGenerate, 
  onDownload, 
  onImport, 
  onNewQuestion 
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
          <ShieldCheck className="text-indigo-500" size={32} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Painel Administrativo
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base">Gerencie o conteúdo do Quiz Master Pro.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full lg:w-auto">
        <button 
          onClick={onAutoGenerate}
          disabled={autoGenerating}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 disabled:opacity-50 text-xs md:text-sm"
        >
          {autoGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          <span className="hidden sm:inline">Auto-Justificar</span>
          <span className="sm:hidden">Justificar</span>
        </button>
        
        <button 
          onClick={onDownload}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 text-xs md:text-sm"
        >
          <Download size={18} />
          <span>Baixar</span>
        </button>
        
        <button 
          onClick={onImport}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 text-xs md:text-sm"
        >
          <FileJson size={18} />
          <span>Importar</span>
        </button>
        
        <button 
          onClick={onNewQuestion}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 text-xs md:text-sm col-span-2 sm:col-auto"
        >
          <Plus size={18} />
          <span>Nova Pergunta</span>
        </button>
      </div>
    </div>
  );
}
