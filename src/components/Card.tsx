import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div 
      whileHover={hover ? { y: -5, borderColor: '#6366f1' } : {}}
      className={`bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
