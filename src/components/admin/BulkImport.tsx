import React from 'react';
import { Upload, X } from 'lucide-react';

interface BulkImportProps {
  bulkJson: string;
  setBulkJson: (val: string) => void;
  onImport: () => void;
  onCancel: () => void;
}

export function BulkImport({ bulkJson, setBulkJson, onImport, onCancel }: BulkImportProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
          <p className="text-xs text-indigo-300 leading-relaxed">
            Cole um array JSON de perguntas. Cada objeto deve seguir o formato da interface <code className="bg-indigo-500/20 px-1 rounded">Question</code>.
          </p>
        </div>
        <textarea 
          value={bulkJson} 
          onChange={(e) => setBulkJson(e.target.value)}
          placeholder='[{"category": "...", "questionText": "...", "correctAnswer": "...", ...}]'
          className="w-full flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-[10px] resize-none custom-scrollbar"
        />
      </div>

      <div className="p-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 bg-slate-800 hover:bg-slate-750 py-3.5 rounded-xl font-bold transition-all text-slate-300"
        >
          Cancelar
        </button>
        <button 
          onClick={onImport}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Upload size={20} /> Importar Agora
        </button>
      </div>
    </div>
  );
}
