import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'indigo' | 'purple' | 'green';
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  
  return (
    <div className={`p-6 rounded-3xl border bg-slate-900 ${colors[color]} flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
      <div className="p-3 bg-slate-950/50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-xs font-black uppercase opacity-60">{label}</p>
        <p className="text-2xl md:text-3xl font-black">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
