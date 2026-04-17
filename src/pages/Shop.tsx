import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Zap, 
  Heart, 
  User, 
  Palette, 
  Check, 
  Lock, 
  PlayCircle, 
  Sparkles,
  Lightbulb,
  SkipForward,
  Clock,
  Coins
} from 'lucide-react';
import { Profile } from '../types';
import Button from '../components/Button';
import { AdService } from '../services/adService';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'lifeline' | 'avatar' | 'theme';
  icon: React.ReactNode;
  value?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Lifelines
  { id: 'll_5050', name: '50/50', description: 'Remove duas opções incorretas.', price: 10, type: 'lifeline', icon: <Lightbulb className="text-yellow-400" />, value: 'fiftyFifty' },
  { id: 'll_skip', name: 'Pular', description: 'Pula para a próxima pergunta.', price: 15, type: 'lifeline', icon: <SkipForward className="text-blue-400" />, value: 'skip' },
  { id: 'll_time', name: 'Tempo Extra', description: 'Adiciona 30s ao cronômetro.', price: 8, type: 'lifeline', icon: <Clock className="text-green-400" />, value: 'extraTime' },
  
  // Avatars
  { id: 'av_1', name: 'Médico Pro', description: 'Avatar exclusivo de Medicina.', price: 50, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'av_2', name: 'Enfermeira Joy', description: 'Avatar de Enfermagem.', price: 50, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 'av_3', name: 'Cientista', description: 'Avatar de Laboratório.', price: 75, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb' },
  { id: 'av_4', name: 'Mestre Quiz', description: 'O mestre do conhecimento.', price: 100, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buster' },
  { id: 'av_5', name: 'Doutor Estranho', description: 'Um toque de mistério.', price: 120, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper' },
  { id: 'av_6', name: 'Bioquímica', description: 'Especialista em células.', price: 80, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' },
  { id: 'av_7', name: 'Cirurgião', description: 'Precisão máxima.', price: 150, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George' },
  { id: 'av_8', name: 'Estudante', description: 'Sempre aprendendo.', price: 30, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe' },
  { id: 'av_9', name: 'Robô Saúde', description: 'IA Médica avançada.', price: 200, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robo' },
  { id: 'av_10', name: 'Anjo da Guarda', description: 'Protetor da saúde.', price: 250, type: 'avatar', icon: <User />, value: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angel' },

  // Themes / Skins (Visual accents)
  { id: 'th_gold', name: 'Aura Dourada', description: 'Borda dourada no perfil.', price: 300, type: 'theme', icon: <Palette className="text-yellow-500" />, value: 'border-yellow-500 shadow-yellow-500/20' },
  { id: 'th_neon', name: 'Neon Cyber', description: 'Efeito neon pulsante.', price: 400, type: 'theme', icon: <Palette className="text-cyan-400" />, value: 'border-cyan-400 shadow-cyan-400/30 shadow-lg' },
  { id: 'th_royal', name: 'Realeza Purpúrea', description: 'Estilo majestoso.', price: 350, type: 'theme', icon: <Palette className="text-purple-500" />, value: 'border-purple-600 shadow-purple-500/20' },
  { id: 'th_emerald', name: 'Esmeralda', description: 'Brilho verde profundo.', price: 280, type: 'theme', icon: <Palette className="text-emerald-500" />, value: 'border-emerald-500 shadow-emerald-500/20' },
  { id: 'th_ruby', name: 'Rubi Intenso', description: 'Vermelho paixão.', price: 320, type: 'theme', icon: <Palette className="text-red-500" />, value: 'border-red-500 shadow-red-500/20' },
];

export default function Shop({ profile }: { profile: Profile | null }) {
  const [activeTab, setActiveTab] = useState<'lifeline' | 'avatar' | 'theme'>('lifeline');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handlePurchase = (item: ShopItem) => {
    if (!profile) return;
    if (profile.points < item.price) return;

    setPurchaseLoading(item.id);
    
    setTimeout(() => {
      const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
      localData.points = Number((localData.points - item.price).toFixed(1));

      if (item.type === 'lifeline') {
        const key = item.value as keyof typeof localData.lifelines;
        if (!localData.lifelines) localData.lifelines = { fiftyFifty: 0, skip: 0, extraTime: 0 };
        localData.lifelines[key] = (localData.lifelines[key] || 0) + 1;
      } else if (item.type === 'avatar') {
        if (!localData.inventory) localData.inventory = { avatars: [], themes: [] };
        if (!localData.inventory.avatars.includes(item.value)) {
          localData.inventory.avatars.push(item.value);
        }
      } else if (item.type === 'theme') {
        if (!localData.inventory) localData.inventory = { avatars: [], themes: [] };
        if (!localData.inventory.themes.includes(item.value)) {
          localData.inventory.themes.push(item.value);
        }
      }

      localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
      window.dispatchEvent(new Event('storage'));
      
      setPurchaseLoading(null);
      setShowSuccess(item.name);
      setTimeout(() => setShowSuccess(null), 3000);
    }, 800);
  };

  const handleWatchAd = async () => {
    if (!navigator.onLine) {
      alert('Esta funcionalidade requer uma conexão com a internet para carregar o anúncio.');
      return;
    }
    setPurchaseLoading('ad_reward');
    const success = await AdService.showRewardAd();
    
    if (success) {
      const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
      localData.points = Number(((localData.points || 0) + 5).toFixed(1));
      localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
      window.dispatchEvent(new Event('storage'));
      setShowSuccess('5 Moedas Grátis');
      setTimeout(() => setShowSuccess(null), 3000);
    } else {
      alert('Não foi possível carregar o anúncio no momento.');
    }
    setPurchaseLoading(null);
  };

  const isUnlocked = (item: ShopItem) => {
    if (item.type === 'lifeline') return false;
    if (!profile?.inventory) return false;
    if (item.type === 'avatar') return profile.inventory.avatars.includes(item.value!);
    if (item.type === 'theme') return profile.inventory.themes.includes(item.value!);
    return false;
  };

  const filteredItems = SHOP_ITEMS.filter(item => item.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-black flex items-center justify-center md:justify-start gap-3">
            <ShoppingBag className="text-indigo-500" size={40} />
            Loja de Itens
          </h1>
          <p className="text-muted font-medium">Equipe-se para os desafios e personalize seu perfil.</p>
        </div>
        
        <div className="bg-card px-6 py-3 rounded-2xl border border-main flex items-center gap-3 shadow-xl">
          <Coins className="text-yellow-500" size={24} />
          <div>
            <p className="text-[10px] uppercase font-black text-muted tracking-widest">Seu Saldo</p>
            <p className="text-2xl font-black text-main">{profile?.points.toFixed(1)} <span className="text-sm text-muted">Moedas</span></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-card p-1.5 rounded-2xl border border-main max-w-md mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('lifeline')}
          className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'lifeline' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted hover:text-main'}`}
        >
          <Zap size={18} /> Ajudas
        </button>
        <button 
          onClick={() => setActiveTab('avatar')}
          className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'avatar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted hover:text-main'}`}
        >
          <User size={18} /> Avatares
        </button>
        <button 
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'theme' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted hover:text-main'}`}
        >
          <Palette size={18} /> Skins
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl flex items-center gap-3 font-bold"
          >
            <Sparkles size={20} />
            Compra realizada com sucesso: {showSuccess}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const unlocked = isUnlocked(item);
          const canAfford = (profile?.points || 0) >= item.price;
          
          return (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-card rounded-[2rem] border p-6 flex flex-col gap-4 transition-all relative overflow-hidden group ${unlocked ? 'border-green-500/30' : 'border-main'}`}
            >
              {unlocked && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                  <Check size={14} />
                </div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-main flex items-center justify-center text-indigo-500 border border-main group-hover:scale-110 transition-transform">
                {item.type === 'avatar' ? (
                  <img src={item.value} alt={item.name} className="w-12 h-12 rounded-lg" referrerPolicy="no-referrer" />
                ) : (
                  <div className="scale-150">
                    {item.icon}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-main">{item.name}</h3>
                <p className="text-sm text-muted font-medium">{item.description}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-main">
                <div className="flex items-center gap-1.5">
                  <Coins size={16} className="text-yellow-500" />
                  <span className="font-black text-lg">{item.price}</span>
                </div>

                <Button
                  onClick={() => handlePurchase(item)}
                  disabled={unlocked || !canAfford || purchaseLoading === item.id}
                  variant={unlocked ? 'secondary' : 'primary'}
                  className="px-6 py-2 text-xs"
                >
                  {purchaseLoading === item.id ? (
                    <PlayCircle className="animate-spin" size={16} />
                  ) : unlocked ? (
                    'Desbloqueado'
                  ) : (
                    'Comprar'
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ad Section */}
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black text-indigo-400 flex items-center justify-center md:justify-start gap-2">
            <PlayCircle /> Precisa de Moedas?
          </h2>
          <p className="text-muted font-medium">Assista a um anúncio rápido e ganhe 5 Moedas grátis!</p>
        </div>
        <Button 
          variant="primary" 
          className="px-10 py-4 shadow-xl shadow-indigo-500/20"
          disabled={purchaseLoading === 'ad_reward'}
          onClick={handleWatchAd}
        >
          {purchaseLoading === 'ad_reward' ? 'Carregando...' : 'Assistir Agora (+5 Moedas)'}
        </Button>
      </div>
    </div>
  );
}
