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
import { Menu, X, Trophy, User as UserIcon, Info, ShieldCheck, LogOut, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Admin from './pages/Admin';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/Profile';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar 
          profile={profile} 
          isOpen={isMenuOpen} 
          setIsOpen={setIsMenuOpen} 
          onLogout={handleLogout}
        />
        
        <main className="max-w-6xl mx-auto p-4 pt-20">
          <Routes>
            <Route path="/" element={<Home profile={profile} />} />
            <Route path="/auth" element={!profile ? <AuthPage /> : <Navigate to="/" />} />
            <Route path="/quiz" element={profile ? <Quiz profile={profile} /> : <Navigate to="/auth" />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={profile ? <ProfilePage profile={profile} /> : <Navigate to="/auth" />} />
            <Route path="/admin-secret" element={profile?.isAdmin ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Navbar({ profile, isOpen, setIsOpen, onLogout }: { 
  profile: Profile | null, 
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void,
  onLogout: () => void
}) {
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Início', path: '/', icon: HomeIcon },
    { name: 'Jogar', path: '/quiz', icon: Trophy },
    { name: 'Ranking', path: '/ranking', icon: UserIcon },
    { name: 'Perfil', path: '/profile', icon: UserIcon },
    { name: 'Sobre', path: '/about', icon: Info },
  ];

  if (profile?.isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin-secret', icon: ShieldCheck });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
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
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === link.path ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              {link.name}
            </Link>
          ))}
          {profile ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300"
            >
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <Link to="/auth" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold transition-all">
              Entrar
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-400" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <link.icon size={20} className="text-indigo-400" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              {profile ? (
                <button 
                  onClick={() => { onLogout(); closeMenu(); }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={closeMenu}
                  className="flex items-center justify-center p-3 rounded-xl bg-indigo-600 font-bold"
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
