import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, BarChart3, Users, HelpCircle } from 'lucide-react';

// Components
import { StatCard } from '../components/admin/StatCard';
import { AdminHeader } from '../components/admin/AdminHeader';
import { QuestionList } from '../components/admin/QuestionList';
import { QuestionForm } from '../components/admin/QuestionForm';
import { BulkImport } from '../components/admin/BulkImport';

// Hooks
import { useAdminData } from '../hooks/useAdminData';

export default function Admin() {
  const {
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
  } = useAdminData();

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
      <p className="text-muted font-medium animate-pulse">Carregando painel...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      <AdminHeader 
        autoGenerating={autoGenerating}
        onAutoGenerate={autoGenerateAllExplanations}
        onDownload={handleDownload}
        onImport={() => setIsBulkImporting(true)}
        onNewQuestion={() => { resetCurrentQuestion(); setIsEditing(true); }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard icon={<Users size={24} />} label="Total Usuários" value={stats.users} color="indigo" />
        <StatCard icon={<HelpCircle size={24} />} label="Perguntas Ativas" value={stats.questions} color="purple" />
        <StatCard icon={<BarChart3 size={24} />} label="Respostas Totais" value={stats.history} color="green" />
      </div>

      <QuestionList 
        questions={questions}
        onEdit={(q) => { setCurrentQuestion(q); setIsEditing(true); }}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-main/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-card w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl border-x sm:border border-main shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-main flex justify-between items-center bg-card/50 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl font-bold text-main">{currentQuestion.id ? 'Editar Pergunta' : 'Nova Pergunta'}</h2>
                  <p className="text-xs text-muted">Preencha os detalhes da questão abaixo.</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="p-2 text-muted hover:text-main hover:bg-main rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <QuestionForm 
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                onGenerateExplanation={generateExplanation}
                generatingExplanation={generatingExplanation}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {isBulkImporting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-main/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] sm:rounded-3xl border-x sm:border border-main shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-main flex justify-between items-center bg-card/50 backdrop-blur-xl">
                <div>
                  <h2 className="text-xl font-bold text-main">Importar JSON</h2>
                  <p className="text-xs text-muted">Adicione múltiplas perguntas de uma vez.</p>
                </div>
                <button 
                  onClick={() => setIsBulkImporting(false)} 
                  className="p-2 text-muted hover:text-main hover:bg-main rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <BulkImport 
                bulkJson={bulkJson}
                setBulkJson={setBulkJson}
                onImport={handleBulkImport}
                onCancel={() => setIsBulkImporting(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
