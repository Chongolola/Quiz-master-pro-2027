import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Profile } from '../types';
import { User, Award, Heart, Zap, Calendar, ShieldCheck, Mail, LogOut, Edit2, Camera, Check, X, History, TrendingUp, Target, ShoppingBag, Palette, Upload, FileJson } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfilePageProps {
  profile: Profile | null;
}

interface GameHistory {
  id: string;
  questionText: string;
  category: string;
  isCorrect: boolean;
  answeredAt: number;
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [editData, setEditData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatarUrl || ''
  });
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('quiz_master_history') || '[]');
    setHistory(storedHistory);
  }, []);

  if (!profile) return null;

  const handleSave = () => {
    const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
    const updated = { ...localData, ...editData };
    localStorage.setItem('quiz_master_profile', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setIsEditing(false);
  };

  const selectAvatar = (url: string) => {
    const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
    localData.avatarUrl = url;
    localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
    window.dispatchEvent(new Event('storage'));
  };

  const selectTheme = (themeClass: string) => {
    const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
    localData.activeTheme = themeClass;
    localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogout = () => {
    localStorage.removeItem('quiz_master_profile');
    window.location.href = '/';
  };

  const successRate = profile.stats 
    ? Math.round((profile.stats.correctAnswers / profile.stats.totalAnswers) * 100) || 0 
    : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 pb-20">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-[2rem] p-6 md:p-8 border relative overflow-hidden shadow-2xl transition-all duration-500 ${(profile as any).activeTheme || 'border-main'}`}
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <User size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-main overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                profile.username.charAt(0).toUpperCase()
              )}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full border-2 border-main text-white shadow-lg hover:bg-indigo-500 transition-all scale-90 md:scale-100"
            >
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                {isEditing ? (
                  <input 
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="bg-main border border-main rounded-lg px-3 py-1 text-2xl font-black focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-auto text-main"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">{profile.username}</h1>
                )}
                {profile.isAdmin && (
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-500/20 uppercase tracking-widest">
                    <ShieldCheck size={10} /> Admin
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-muted text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-muted" />
                  <span>{profile.email}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Calendar size={14} className="text-muted" />
                  <span>Desde {format(profile.createdAt, "MMM yyyy", { locale: ptBR })}</span>
                </div>
              </div>
            </div>

            <div className="max-w-md">
              {isEditing ? (
                <textarea 
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  placeholder="Escreva algo sobre você..."
                  className="w-full bg-main border border-main rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px] text-main"
                />
              ) : (
                <p className="text-muted text-sm leading-relaxed italic">
                  {profile.bio || "Nenhuma descrição adicionada ainda."}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">URL do Avatar</label>
                <input 
                  type="text"
                  value={editData.avatarUrl}
                  onChange={(e) => setEditData({...editData, avatarUrl: e.target.value})}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full bg-main border border-main rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-main"
                />
              </div>
            )}

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                    <Check size={14} /> Salvar
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditData({ username: profile.username, bio: profile.bio || '', avatarUrl: profile.avatarUrl || '' }); }} className="bg-main hover:bg-card px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border border-main">
                    <X size={14} /> Cancelar
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-main hover:bg-card px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border border-main">
                  <Edit2 size={14} /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - More Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Award size={18} />} 
          label="Moedas" 
          value={profile.points.toFixed(1)} 
          color="yellow"
        />
        <StatCard 
          icon={<Heart size={18} />} 
          label="Vidas" 
          value={profile.lives.toString()} 
          color="red"
        />
        <StatCard 
          icon={<Zap size={18} />} 
          label="Nível" 
          value={(profile.stats?.level || 1).toString()} 
          color="indigo"
        />
        <StatCard 
          icon={<TrendingUp size={18} />} 
          label="Streak" 
          value={`${profile.stats?.dailyStreak || 0} Dias`} 
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <History size={20} className="text-indigo-400" />
            <h2 className="text-xl font-black">Histórico Recente</h2>
          </div>
          
          <div className="bg-card rounded-3xl border border-main overflow-hidden">
            <div className="divide-y divide-main">
              {history.length > 0 ? (
                history.map((record) => (
                  <div key={record.id} className="p-4 flex items-center justify-between hover:bg-main transition-colors group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-main line-clamp-1">{record.questionText}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-muted">{record.category}</span>
                        <span className="text-[10px] text-muted opacity-40">•</span>
                        <span className="text-[10px] text-muted">{format(record.answeredAt, "dd/MM HH:mm")}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      record.isCorrect 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {record.isCorrect ? 'Correto' : 'Errado'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-2">
                  <TrendingUp size={40} className="mx-auto text-slate-700" />
                  <p className="text-slate-500 font-medium">Nenhuma partida registrada ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <h2 className="text-xl font-black">Configurações</h2>
          </div>
          
          <div className="bg-card rounded-3xl p-4 border border-main space-y-3">
            <button 
              onClick={() => {
                const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
                if (localData.points >= 5) {
                  localData.points = Number((localData.points - 5).toFixed(1));
                  localData.lives = Math.min(5, (localData.lives || 0) + 1);
                  localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
                  window.dispatchEvent(new Event('storage'));
                }
              }}
              disabled={profile.points < 5 || profile.lives >= 5}
              className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 p-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-yellow-500/20 disabled:opacity-30 group"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" /> 
              <div className="text-left">
                <p className="text-sm">Trocar Moedas</p>
                <p className="text-[10px] opacity-60 font-medium">5 Moedas = 1 Vida</p>
              </div>
            </button>

            <button 
              onClick={() => setShowInventory(!showInventory)}
              className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 p-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-indigo-500/20"
            >
              <ShoppingBag size={20} /> 
              <div className="text-left">
                <p className="text-sm">Meu Inventário</p>
                <p className="text-[10px] opacity-60 font-medium">Ver itens desbloqueados</p>
              </div>
            </button>

            {profile.isAdmin && (
              <a 
                href="/admin-secret"
                className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 p-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-indigo-500/20"
              >
                <ShieldCheck size={20} /> 
                <div className="text-left">
                  <p className="text-sm">Painel ADM</p>
                  <p className="text-[10px] opacity-60 font-medium">Gerenciar perguntas</p>
                </div>
              </a>
            )}
            
            <button 
              onClick={handleLogout}
              className="w-full bg-main hover:bg-red-500/10 hover:text-red-500 p-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-main group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> 
              <div className="text-left">
                <p className="text-sm">Sair da Conta</p>
                <p className="text-[10px] opacity-60 font-medium">Encerrar sessão atual</p>
              </div>
            </button>
          </div>

          {/* Question Import Section */}
          <div className="bg-card rounded-3xl p-6 border border-main space-y-4">
            <div className="flex items-center gap-2">
              <Upload size={20} className="text-indigo-400" />
              <h3 className="font-black">Importar Questões</h3>
            </div>
            <p className="text-xs text-muted font-medium">Adicione suas próprias questões ao jogo via arquivo JSON.</p>
            
            <label className="block">
              <input 
                type="file" 
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = JSON.parse(event.target?.result as string);
                      const questions = Array.isArray(json) ? json : [json];
                      
                      // Basic validation
                      const validQuestions = questions.filter(q => 
                        q.questionText && q.correctAnswer && Array.isArray(q.options) && q.category
                      ).map(q => ({
                        ...q,
                        id: q.id || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        createdAt: q.createdAt || Date.now()
                      }));

                      if (validQuestions.length > 0) {
                        const existing = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
                        localStorage.setItem('quiz_master_custom_questions', JSON.stringify([...existing, ...validQuestions]));
                        alert(`${validQuestions.length} questões importadas com sucesso!`);
                      } else {
                        alert("Nenhuma questão válida encontrada no arquivo.");
                      }
                    } catch (error) {
                      alert("Erro ao processar o arquivo JSON.");
                    }
                  };
                  reader.readAsText(file);
                }}
              />
              <div className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer transition-all shadow-lg shadow-indigo-500/20">
                <FileJson size={20} /> Selecionar JSON
              </div>
            </label>
            <p className="text-[10px] text-muted leading-relaxed">
              O arquivo deve ser um array de objetos com: <code className="text-indigo-400">questionText, correctAnswer, options (array), category</code>.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="font-black text-lg">Resumo de Carreira</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Progresso do Nível {profile.stats?.level || 1}</span>
                  <span>{(profile.stats?.exp || 0) % 100}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 transition-all duration-1000" style={{ width: `${(profile.stats?.exp || 0) % 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold opacity-80">
                  <span>EXP Total: {profile.stats?.exp || 0}</span>
                  <span>Próximo Nível: {((Math.floor((profile.stats?.exp || 0) / 100) + 1) * 100) - (profile.stats?.exp || 0)} EXP</span>
                </div>
                <p className="text-[10px] opacity-80 font-medium pt-2">
                  {successRate > 70 ? "Excelente desempenho! Você é um mestre." : "Continue praticando para subir seu nível!"}
                </p>
              </div>
            </div>
            <Zap className="absolute -bottom-4 -right-4 text-white/10" size={120} />
          </div>
        </div>
      </div>
      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] border border-main shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-main flex justify-between items-center">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <ShoppingBag className="text-indigo-500" /> Meu Inventário
                </h2>
                <button onClick={() => setShowInventory(false)} className="p-2 hover:bg-main rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Avatars */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-muted tracking-widest flex items-center gap-2">
                    <User size={16} /> Avatares Desbloqueados
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {profile.inventory?.avatars.map((url, i) => (
                      <button 
                        key={i}
                        onClick={() => selectAvatar(url)}
                        className={`relative aspect-square rounded-2xl border-2 transition-all p-1 hover:scale-105 ${profile.avatarUrl === url ? 'border-indigo-500 bg-indigo-500/10' : 'border-main bg-main'}`}
                      >
                        <img src={url} alt="Avatar" className="w-full h-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                        {profile.avatarUrl === url && (
                          <div className="absolute -top-1 -right-1 bg-indigo-500 text-white p-0.5 rounded-full">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    ))}
                    {(!profile.inventory?.avatars || profile.inventory.avatars.length === 0) && (
                      <p className="col-span-full text-xs text-muted italic py-4">Nenhum avatar comprado ainda.</p>
                    )}
                  </div>
                </div>

                {/* Themes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-muted tracking-widest flex items-center gap-2">
                    <Palette size={16} /> Skins de Perfil
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {profile.inventory?.themes.map((theme, i) => (
                      <button 
                        key={i}
                        onClick={() => selectTheme(theme)}
                        className={`p-3 rounded-2xl border-2 transition-all text-xs font-bold flex items-center gap-2 ${ (profile as any).activeTheme === theme ? 'border-indigo-500 bg-indigo-500/10' : 'border-main bg-main'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border ${theme.split(' ')[0]}`}></div>
                        Skin #{i + 1}
                        {(profile as any).activeTheme === theme && <Check size={12} className="ml-auto text-indigo-500" />}
                      </button>
                    ))}
                    <button 
                      onClick={() => selectTheme('')}
                      className={`p-3 rounded-2xl border-2 transition-all text-xs font-bold flex items-center gap-2 ${ !(profile as any).activeTheme ? 'border-indigo-500 bg-indigo-500/10' : 'border-main bg-main'}`}
                    >
                      Padrão
                    </button>
                    {(!profile.inventory?.themes || profile.inventory.themes.length === 0) && (
                      <p className="col-span-full text-xs text-muted italic py-4">Nenhuma skin comprada ainda.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-main bg-main/30">
                <a href="/shop" onClick={() => setShowInventory(false)} className="w-full bg-indigo-600 py-3 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                  <ShoppingBag size={18} /> Ir para a Loja
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colors: any = {
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card p-4 rounded-2xl border border-main flex items-center gap-3"
    >
      <div className={`p-2 rounded-xl ${colors[color]} border`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-muted tracking-wider">{label}</p>
        <p className="text-lg font-black">{value}</p>
      </div>
    </motion.div>
  );
}
