import React from 'react';
import { Profile } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Zap, ShieldCheck } from 'lucide-react';
import { useLives } from '../hooks/useLives';

export default function Home({ profile }: { profile: Profile | null }) {
  const lives = useLives(profile);

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black tracking-tight"
        >
          Domine o <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Conhecimento</span>
        </motion.h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          O Quiz Master Pro é a plataforma definitiva para testar suas habilidades, ganhar pontos e subir no ranking global.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            to="/quiz" 
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Zap size={24} /> Começar Agora
          </Link>
          <Link 
            to="/ranking" 
            className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2"
          >
            <Trophy size={24} /> Ver Ranking
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      {profile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <Heart size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Vidas</p>
              <p className="text-3xl font-black">{lives} / 5</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Zap size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Pontos</p>
              <p className="text-3xl font-black">{profile.points}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Nível</p>
              <p className="text-3xl font-black">{profile.isAdmin ? 'Admin' : 'Mestre'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          icon={<Zap className="text-yellow-400" />}
          title="Rápido e Fluido"
          description="Interface moderna com animações suaves para uma experiência imersiva."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-green-400" />}
          title="Seguro"
          description="Sistema anti-trapaça e autenticação robusta para garantir a justiça."
        />
        <FeatureCard 
          icon={<Trophy className="text-indigo-400" />}
          title="Ranking Global"
          description="Compita com jogadores de todo o mundo e torne-se o número 1."
        />
        <FeatureCard 
          icon={<Heart className="text-red-400" />}
          title="Sistema de Vidas"
          description="Gerencie suas vidas e recupere-as ao longo do tempo ou assistindo anúncios."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
