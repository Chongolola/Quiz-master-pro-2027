import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100",
    outline: "bg-transparent border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white",
    danger: "bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-900/30"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
