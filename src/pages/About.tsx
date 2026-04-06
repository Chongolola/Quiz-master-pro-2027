import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Globe, Code2, Heart, Facebook, MessageCircle, Instagram } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src="https://storage.googleapis.com/static.antigravity.ai/user_content/8d5e4a87-f923-4671-8922-e844379a80f9/6698650c-f38b-426c-8597-202951910609.png" 
            alt="Developer" 
            referrerPolicy="no-referrer"
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-slate-900 object-cover shadow-2xl"
          />
        </motion.div>

        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black">Sobre o Desenvolvedor</h1>
            <p className="text-indigo-400 font-bold text-lg">Criador do Quiz Master Pro</p>
          </div>
          <p className="text-slate-400 leading-relaxed text-lg">
            Olá! Eu sou o desenvolvedor por trás desta plataforma. O Quiz Master Pro nasceu da minha paixão por gamificação e educação. 
            Acredito que aprender deve ser divertido, desafiador e recompensador.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <SocialLink href="mailto:deluxdomingos@gmail.com" icon={<Mail size={20} />} label="E-mail" />
            <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} label="Facebook" />
            <SocialLink href="https://wa.me/244923000000" icon={<MessageCircle size={20} />} label="WhatsApp" />
            <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} label="Instagram" />
            <SocialLink href="https://tiktok.com" icon={<Globe size={20} />} label="TikTok" />
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-500">
            <Code2 size={32} />
          </div>
          <h2 className="text-2xl font-bold">Tecnologia de Ponta</h2>
          <p className="text-slate-400">
            Construído com React, Firebase e Google Gemini AI para oferecer uma experiência rápida, segura e inteligente.
          </p>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="p-3 bg-red-500/10 rounded-2xl w-fit text-red-500">
            <Heart size={32} />
          </div>
          <h2 className="text-2xl font-bold">Missão</h2>
          <p className="text-slate-400">
            Nossa missão é criar o maior banco de conhecimento interativo do mundo, onde todos podem aprender e competir.
          </p>
        </div>
      </section>

      <footer className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
        <p>© 2026 Quiz Master Pro. Feito com ❤️ para mentes curiosas.</p>
      </footer>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all text-slate-300 hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
