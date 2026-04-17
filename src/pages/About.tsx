import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Globe, Code2, Heart, Facebook, MessageCircle, Instagram } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-20">
      {/* Profile Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div 
            className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border-8 border-card shadow-2xl overflow-hidden bg-main"
          >
            <img 
              src="https://storage.googleapis.com/static.antigravity.ai/user_content/8d5e4a87-f923-4671-8922-e844379a80f9/4799017f-5d07-425d-919d-77119e7f415c.png" 
              alt="Developer" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="eager"
            />
          </div>
        </motion.div>

        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tight"
            >
              Sobre o <span className="text-indigo-500">Desenvolvedor</span>
            </motion.h1>
            <p className="text-indigo-400 font-black text-xl uppercase tracking-widest">Criador do Quiz Master Pro</p>
          </div>
          <p className="text-muted leading-relaxed text-lg md:text-xl font-medium">
            Olá! Eu sou o desenvolvedor por trás desta plataforma. O Quiz Master Pro nasceu da minha paixão por gamificação e educação. 
            Acredito que aprender deve ser divertido, desafiador e recompensador. Minha missão é democratizar o conhecimento através da tecnologia.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <SocialLink href="mailto:deluxdomingos@gmail.com" icon={<Mail size={20} />} label="E-mail" />
            <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} label="Facebook" />
            <SocialLink href="https://wa.me/244923000000" icon={<MessageCircle size={20} />} label="WhatsApp" />
            <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} label="Instagram" />
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-10 rounded-[3rem] border border-main space-y-6 shadow-xl hover:shadow-2xl transition-all group">
          <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Code2 size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Tecnologia de Ponta</h2>
          <p className="text-muted text-lg font-medium leading-relaxed">
            Construído com React, Firebase e Google Gemini AI para oferecer uma experiência rápida, segura e inteligente. Cada linha de código foi pensada para sua performance.
          </p>
        </div>
        <div className="bg-card p-10 rounded-[3rem] border border-main space-y-6 shadow-xl hover:shadow-2xl transition-all group">
          <div className="p-4 bg-red-500/10 rounded-2xl w-fit text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
            <Heart size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Nossa Missão</h2>
          <p className="text-muted text-lg font-medium leading-relaxed">
            Nossa missão é criar o maior banco de conhecimento interativo do mundo, onde todos podem aprender, competir e evoluir juntos em uma comunidade saudável.
          </p>
        </div>
      </section>

      <footer className="text-center space-y-4 pt-12 border-t border-main">
        <div className="flex justify-center gap-6 text-muted">
          <Globe size={20} />
          <Linkedin size={20} />
          <Github size={20} />
        </div>
        <p className="text-muted text-sm font-bold uppercase tracking-widest">© 2026 Quiz Master Pro. Feito com ❤️ para mentes curiosas.</p>
      </footer>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-3 px-6 py-3 bg-card hover:bg-main border border-main rounded-2xl font-bold transition-all text-muted hover:text-indigo-500 shadow-sm hover:shadow-md"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}
