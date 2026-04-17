import React from 'react';
import { Profile } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Zap, ShieldCheck, FileText } from 'lucide-react';
import { useLives } from '../hooks/useLives';

export default function Home({ profile }: { profile: Profile | null }) {
  const lives = useLives(profile);

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 relative z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-none"
          >
            Domine o <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Conhecimento
            </span>
          </motion.h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto font-medium">
            A plataforma definitiva para testar suas habilidades, desafiar sua mente e conquistar o topo do ranking global.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link 
              to="/quiz" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/40 transition-all flex items-center justify-center gap-3 group"
            >
              <Zap size={28} className="group-hover:scale-110 transition-transform" /> 
              Começar Agora
            </Link>
            <Link 
              to="/minsa" 
              className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-purple-500/40 transition-all flex items-center justify-center gap-3 group"
            >
              <FileText size={28} className="group-hover:scale-110 transition-transform" /> 
              Concurso MINSA
            </Link>
            <Link 
              to="/ranking" 
              className="bg-card hover:bg-main text-main px-10 py-5 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 border border-main shadow-xl"
            >
              <Trophy size={28} className="text-yellow-500" /> 
              Ver Ranking
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Cards */}
      {profile && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatSummaryCard 
            icon={<Heart size={32} />} 
            label="Vidas" 
            value={`${lives} / 5`} 
            color="red" 
          />
          <StatSummaryCard 
            icon={<Zap size={32} />} 
            label="Moedas" 
            value={profile.points.toFixed(1)} 
            color="indigo" 
          />
          <StatSummaryCard 
            icon={<Trophy size={32} />} 
            label="Nível" 
            value={Math.floor(profile.points / 100).toString()} 
            color="yellow" 
          />
        </motion.div>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={<Zap className="text-yellow-400" />}
          title="Rápido e Fluido"
          description="Interface moderna com animações suaves para uma experiência imersiva em qualquer dispositivo."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-green-400" />}
          title="Seguro"
          description="Sistema anti-trapaça e armazenamento local seguro para garantir a integridade do seu progresso."
        />
        <FeatureCard 
          icon={<Trophy className="text-indigo-400" />}
          title="Ranking Global"
          description="Compita com jogadores de todo o mundo e mostre quem é o verdadeiro mestre do conhecimento."
        />
        <FeatureCard 
          icon={<Heart className="text-red-400" />}
          title="Sistema de Vidas"
          description="Gerencie suas vidas estrategicamente. Recupere-as com o tempo ou assistindo anúncios."
        />
      </section>
    </div>
  );
}

function StatSummaryCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colors: any = {
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  return (
    <div className="bg-card p-8 rounded-[2.5rem] border border-main flex items-center gap-6 shadow-lg hover:shadow-xl transition-all group">
      <div className={`p-4 rounded-2xl ${colors[color]} border group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-muted text-xs uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-card rounded-[2.5rem] border border-main hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-md">
      <div className="mb-6 group-hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center bg-main rounded-2xl border border-main">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-muted text-sm leading-relaxed font-medium">{description}</p>
    </div>
  );
}
