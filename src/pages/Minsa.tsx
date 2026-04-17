import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, CheckCircle2, Download, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface StudyMaterial {
  id: string;
  title: string;
  size: string;
  type: string;
  url: string;
}

export default function Minsa() {
  const [offlineMode, setOfflineMode] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState<string[]>([]);
  const [downloading, setDownloading] = React.useState<string | null>(null);

  const documents = [
    'Fotografia (tipo passe)',
    'Bilhete de Identidade',
    'Certificado de Habilitações Literárias',
    'Cédula Profissional (onde é aplicável)',
    'Declaração do INAAREES (para formados no exterior)'
  ];

  const materials: StudyMaterial[] = [
    { id: '1', title: 'Guia de Estudo - Enfermagem Geral', size: '2.4 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '2', title: 'Lei da Carreira de Enfermagem', size: '1.1 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '3', title: 'Ética e Deontologia Médica', size: '850 KB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '4', title: 'Constituição da República de Angola', size: '3.2 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '5', title: 'Manual de Primeiros Socorros MINSA', size: '5.6 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '6', title: 'Caderno de Questões - Saúde Pública', size: '1.8 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '7', title: 'Manual de Atendimento ao Utente', size: '1.2 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '8', title: 'Guia de Cálculo de Medicamentos', size: '940 KB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '9', title: 'Normas de Biossegurança Angola', size: '2.1 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '10', title: 'Manual de Urgências Pediátricas', size: '4.3 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '11', title: 'Protocolos de Pré-Natal e Parto', size: '3.7 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '12', title: 'Lei do Sistema Nacional de Saúde', size: '1.5 MB', type: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ];

  const handleAction = async (file: StudyMaterial) => {
    const isDownloaded = downloaded.includes(file.id);

    if (isDownloaded) {
      // Open cached file
      const blob = await storageService.getFile(file.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Clean up URL after some time
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } else {
      // Download file
      if (offlineMode) {
        alert('Você precisa de internet para baixar este arquivo pela primeira vez.');
        return;
      }
      
      setDownloading(file.id);
      try {
        await storageService.downloadAndSave(file.id, file.url);
        setDownloaded(await storageService.getDownloadedIds());
      } catch (error) {
        alert('Erro ao baixar arquivo. Tente novamente.');
      } finally {
        setDownloading(null);
      }
    }
  };

  const removeDownload = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Remover este arquivo do armazenamento offline?')) {
      await storageService.removeFile(id);
      setDownloaded(await storageService.getDownloadedIds());
    }
  };

  React.useEffect(() => {
    const loadDownloaded = async () => {
      setDownloaded(await storageService.getDownloadedIds());
    };
    loadDownloaded();

    const handleStatus = () => setOfflineMode(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    handleStatus();
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Offline Status Badge */}
      <AnimatePresence>
        {offlineMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-amber-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl flex items-center gap-2"
          >
            <AlertCircle size={16} />
            Modo Offline Ativo - Conteúdo limitado para acesso guardado
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-black uppercase tracking-widest border border-indigo-500/20"
        >
          <AlertCircle size={16} />
          Informação Oficial
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Concurso Público <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Ingresso Externo 2026
          </span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          Tudo o que você precisa saber para se candidatar e se preparar para o ingresso no Ministério da Saúde.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Link Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-[2.5rem] border border-main shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <ExternalLink size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black">Portal de Inscrição</h2>
              <p className="text-muted font-medium">
                As inscrições são feitas exclusivamente através do portal oficial de ingresso do MINSA.
              </p>
            </div>
            <div className="bg-main/30 p-4 rounded-2xl border border-main font-mono text-center text-indigo-400 font-bold select-all">
              www.ingresso-minsa.ao
            </div>
          </div>
          
          <div className="pt-8">
            <a 
              href="https://www.ingresso-minsa.ao" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-50 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-500/20 group"
            >
              Acessar Website Oficial
              <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Required Documents Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-[2.5rem] border border-main shadow-xl"
        >
          <div className="space-y-6">
            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400">
              <FileText size={32} />
            </div>
            <h2 className="text-2xl font-black">Documentos Necessários</h2>
            <ul className="space-y-3">
              {documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-muted font-medium">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-main mt-4">
              <p className="text-xs text-muted font-bold leading-relaxed">
                <span className="text-indigo-400">Obs:</span> É dispensado a apresentação do requerimento (n.º 2 do artigo 15.º do Decreto Presidencial n.º 112/24, 17 de Maio) e do certificado da COVID.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Study Materials Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black">Materiais de Estudo</h2>
            <p className="text-muted font-medium">Acesse manuais e guias em PDF para sua preparação.</p>
          </div>
          <BookOpen className="text-indigo-400" size={40} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {materials.map((file, i) => {
            const isDownloaded = downloaded.includes(file.id);
            const isDownloading = downloading === file.id;

            return (
              <motion.div
                key={file.id}
                whileHover={{ y: -5 }}
                className={`p-6 bg-card rounded-3xl border transition-all flex items-center justify-between group cursor-pointer ${
                  isDownloaded ? 'border-green-500/50' : 'border-main'
                }`}
                onClick={() => handleAction(file)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isDownloaded ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm line-clamp-1">{file.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted font-bold tracking-wider">{file.type} • {file.size}</p>
                      {isDownloaded && (
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full font-black uppercase">Offline</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDownloaded && (
                    <button 
                      onClick={(e) => removeDownload(e, file.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 rounded-lg transition-all"
                      title="Remover download"
                    >
                      <AlertCircle size={16} />
                    </button>
                  )}
                  <button 
                    disabled={isDownloading}
                    className={`p-2 rounded-lg transition-all ${
                      isDownloaded ? 'bg-green-500/10 text-green-500' : 'bg-main text-muted group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
                    }`}
                  >
                    {isDownloading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : isDownloaded ? (
                      <BookOpen size={20} />
                    ) : (
                      <Download size={20} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Preparation Tip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-indigo-600 p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden text-center space-y-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-3xl md:text-5xl font-black text-white relative z-10">
          Prepare-se com os nossos Quizzes
        </h2>
        <p className="text-indigo-100/80 text-lg max-w-2xl mx-auto font-medium relative z-10">
          Utilize a nossa secção de Análises Clínicas e Enfermagem para testar os seus conhecimentos técnicos de forma interativa.
        </p>
        <div className="pt-4 relative z-10">
          <Link to="/quiz" className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all">
            Começar a Estudar
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
