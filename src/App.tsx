import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Link,
  useLocation
} from 'react-router-dom';
import { Profile } from './types';
import { Menu, X, Trophy, User as UserIcon, Info, ShieldCheck, LogOut, Home as HomeIcon, Sun, Moon, ShoppingBag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/Profile';
import MinsaPage from './pages/Minsa';
import { AdService } from './services/adService';
import { NotificationService } from './services/notificationService';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('quiz_master_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('quiz_master_theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadProfile = () => {
      const data = localStorage.getItem('quiz_master_profile');
      if (data) {
        setProfile(JSON.parse(data));
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    loadProfile();
    AdService.initialize();
    NotificationService.requestPermissions().then(granted => {
      if (granted) {
        NotificationService.scheduleDailyReminder();
      }
    });
    window.addEventListener('storage', loadProfile);
    return () => window.removeEventListener('storage', loadProfile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('quiz_master_profile');
    setProfile(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-main text-main font-sans">
        <BannerManager />
        <Navbar 
          profile={profile} 
          isOpen={isMenuOpen} 
          setIsOpen={setIsMenuOpen} 
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
        />
        
        <main className="max-w-6xl mx-auto p-4 pt-20 pb-24">
          <Routes>
            <Route path="/" element={<Home profile={profile} />} />
            <Route path="/auth" element={!profile ? <AuthPage /> : <Navigate to="/" />} />
            <Route path="/quiz" element={profile ? <Quiz profile={profile} /> : <Navigate to="/auth" />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/shop" element={profile ? <Shop profile={profile} /> : <Navigate to="/auth" />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={profile ? <ProfilePage profile={profile} /> : <Navigate to="/auth" />} />
            <Route path="/minsa" element={<MinsaPage />} />
            <Route path="/admin-secret" element={profile?.isAdmin ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function BannerManager() {
  const location = useLocation();

  useEffect(() => {
    // Esconde o banner no Quiz para não atrapalhar a jogabilidade
    if (location.pathname === '/quiz') {
      AdService.hideBanner();
    } else {
      AdService.showBanner();
    }
  }, [location.pathname]);

  return null;
}

function Navbar({ profile, isOpen, setIsOpen, onLogout, theme, setTheme }: { 
  profile: Profile | null, 
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void,
  onLogout: () => void,
  theme: 'dark' | 'light',
  setTheme: (t: 'dark' | 'light') => void
}) {
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Início', path: '/', icon: HomeIcon },
    { name: 'Jogar', path: '/quiz', icon: Trophy },
    { name: 'Loja', path: '/shop', icon: ShoppingBag },
    { name: 'Minsa', path: '/minsa', icon: FileText },
    { name: 'Ranking', path: '/ranking', icon: Trophy },
    { name: 'Perfil', path: '/profile', icon: UserIcon },
    { name: 'Sobre', path: '/about', icon: Info },
  ];

  if (profile?.isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin-secret', icon: ShieldCheck });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-main">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          QUIZ MASTER PRO
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === link.path ? 'text-indigo-400' : 'text-muted'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-main mx-2" />

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-main text-muted hover:text-indigo-400 transition-all"
            title="Mudar Tema"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {profile ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300"
            >
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <Link to="/auth" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold transition-all text-white">
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-main text-muted"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 text-muted" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-card border-b border-main md:hidden shadow-2xl"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    location.pathname === link.path 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-main/20 hover:bg-main/40 text-main'
                  }`}
                >
                  <link.icon size={20} className={location.pathname === link.path ? 'text-white' : 'text-indigo-400'} />
                  <span className="font-bold">{link.name}</span>
                </Link>
              ))}
              <div className="h-px bg-main my-2" />
              {profile ? (
                <button 
                  onClick={() => { onLogout(); closeMenu(); }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-bold">Sair</span>
                </button>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={closeMenu}
                  className="flex items-center justify-center p-4 rounded-2xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-500/20"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
