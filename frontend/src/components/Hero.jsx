import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center pt-10 pb-16 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-[var(--color-secondary)] mb-8 border-[var(--color-secondary)]/30"
      >
        <Terminal size={14} />
        <span>v1.0.0 Architecture Engine Online</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
      >
        From Prompts to <span className="gradient-text">Execution Plans</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl"
      >
        SpecForge AI acts as your senior technical mentor. It analyzes complex assignments and generates structured blueprints, phase breakdowns, and edge-case warnings without writing the code for you.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <a href="#analyze" className="px-8 py-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 hover:-translate-y-1">
          <Cpu size={18} />
          Initialize Analysis
        </a>
        <button className="px-8 py-4 rounded-xl glass hover:bg-white/5 font-semibold transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white">
          View Example Output
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </section>
  );
}
