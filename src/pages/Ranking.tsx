import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { motion } from 'motion/react';
import { Trophy, Medal, User, Loader2 } from 'lucide-react';

export default function Ranking() {
  const [rankings, setRankings] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = () => {
      const localProfile = JSON.parse(localStorage.getItem('quiz_master_profile') || 'null');
      
      const mockRankings: Profile[] = [
        { id: '1', username: 'Dr. Silva', points: 2500, lives: 5, lastLifeUpdate: Date.now(), createdAt: Date.now(), email: 'silva@local', isAdmin: false },
        { id: '2', username: 'Enf. Maria', points: 1800, lives: 5, lastLifeUpdate: Date.now(), createdAt: Date.now(), email: 'maria@local', isAdmin: false },
        { id: '3', username: 'Farm. João', points: 1200, lives: 5, lastLifeUpdate: Date.now(), createdAt: Date.now(), email: 'joao@local', isAdmin: false },
      ];

      if (localProfile) {
        // Only add if not already in mock (by username)
        if (!mockRankings.find(r => r.username === localProfile.username)) {
          mockRankings.push(localProfile);
        } else {
          // Update mock with local points if higher
          const index = mockRankings.findIndex(r => r.username === localProfile.username);
          mockRankings[index].points = Math.max(mockRankings[index].points, localProfile.points);
        }
      }

      const sorted = mockRankings.sort((a, b) => b.points - a.points);
      setRankings(sorted);
      setLoading(false);
    };

    fetchRankings();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black flex items-center justify-center gap-3">
          <Trophy className="text-yellow-400" size={40} />
          Ranking Global
        </h1>
        <p className="text-slate-400">Os melhores mestres do conhecimento.</p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 p-4 border-b border-slate-800 text-xs font-black uppercase text-slate-500 tracking-widest">
          <div className="col-span-2 text-center">Pos</div>
          <div className="col-span-7">Usuário</div>
          <div className="col-span-3 text-right">Pontos</div>
        </div>

        <div className="divide-y divide-slate-800">
          {rankings.map((profile, index) => (
            <motion.div 
              key={profile.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 p-4 items-center hover:bg-slate-800/50 transition-colors ${index < 3 ? 'bg-indigo-500/5' : ''}`}
            >
              <div className="col-span-2 flex justify-center">
                {index === 0 ? <Medal className="text-yellow-400" size={24} /> :
                 index === 1 ? <Medal className="text-slate-400" size={24} /> :
                 index === 2 ? <Medal className="text-amber-600" size={24} /> :
                 <span className="font-black text-slate-500">#{index + 1}</span>}
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">{profile.username}</p>
                  <p className="text-xs text-slate-500">{profile.isAdmin ? 'Administrador' : 'Jogador'}</p>
                </div>
              </div>
              <div className="col-span-3 text-right">
                <span className="text-lg font-black text-indigo-400">{profile.points.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
