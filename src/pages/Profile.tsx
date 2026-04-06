import React from 'react';
import { motion } from 'motion/react';
import { Profile } from '../types';
import { User, Award, Heart, Zap, Calendar, ShieldCheck, Mail, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfilePageProps {
  profile: Profile | null;
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  if (!profile) return null;

  const handleLogout = () => {
    localStorage.removeItem('quiz_master_profile');
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-3xl p-8 border border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <User size={160} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black shadow-xl border-4 border-slate-800">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-black">{profile.username}</h1>
              {profile.isAdmin && (
                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-indigo-500/30">
                  <ShieldCheck size={12} /> ADMIN
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
              <Mail size={16} />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm">
              <Calendar size={16} />
              <span>Membro desde {format(profile.createdAt, "MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Award className="text-yellow-500" />} 
          label="Pontos Totais" 
          value={profile.points.toLocaleString()} 
          color="yellow"
        />
        <StatCard 
          icon={<Heart className="text-red-500" />} 
          label="Vidas Atuais" 
          value={profile.lives.toString()} 
          color="red"
        />
        <StatCard 
          icon={<Zap className="text-indigo-500" />} 
          label="Nível" 
          value={Math.floor(profile.points / 100).toString()} 
          color="indigo"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        {profile.isAdmin && (
          <a 
            href="/admin-secret"
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <ShieldCheck size={20} /> Painel Administrativo
          </a>
        )}
        <button 
          onClick={handleLogout}
          className="flex-1 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
        >
          <LogOut size={20} /> Encerrar Sessão
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-2"
    >
      <div className={`p-3 bg-${color}-500/10 rounded-2xl mb-2`}>
        {icon}
      </div>
      <span className="text-slate-400 text-sm font-medium">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </motion.div>
  );
}
