import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

import Button from '../components/Button';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Admin check (only in login mode)
      if (mode === 'login') {
        if (email === 'AdminDJSC' && password !== '941407') {
          setError('Senha incorreta para o perfil administrativo.');
          setLoading(false);
          return;
        }
      }

      const isAdmin = (email === 'AdminDJSC' && password === '941407') || email === 'deluxdomingos@gmail.com';

      const profile = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: email === 'AdminDJSC' ? 'Admin DJSC' : (username || email.split('@')[0]),
        email: email.includes('@') ? email : `${email}@local.app`,
        points: 0,
        lives: 5,
        lastLifeUpdate: Date.now(),
        isAdmin: isAdmin,
        isGuest: false,
        createdAt: Date.now()
      };
      
      localStorage.setItem('quiz_master_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('storage'));
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    const guestProfile = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      username: 'Convidado_' + Math.random().toString(36).substr(2, 4),
      email: 'guest@local.app',
      points: 0,
      lives: 3, // Guests get fewer lives
      lastLifeUpdate: Date.now(),
      isAdmin: false,
      isGuest: true,
      createdAt: Date.now()
    };
    localStorage.setItem('quiz_master_profile', JSON.stringify(guestProfile));
    window.dispatchEvent(new Event('storage'));
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Quiz Master Pro
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta local agora.'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-2xl">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Entrar
          </button>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Nome de Usuário"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
            <input
              type="text"
              placeholder={mode === 'login' ? "E-mail ou Admin User" : "Seu E-mail"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
            <input
              type="password"
              placeholder="Sua Senha"
              required={mode === 'register' || email === 'AdminDJSC'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">Ou continue como</span>
          </div>
        </div>

        <Button
          onClick={handleGuestMode}
          variant="secondary"
          className="w-full"
        >
          Entrar como Convidado
        </Button>
      </motion.div>
    </div>
  );
}
