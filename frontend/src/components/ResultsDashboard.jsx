import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Server, Layers, AlertOctagon, 
  Lightbulb, Activity, ChevronRight,
  BookOpen, CheckCircle2, RotateCcw
} from 'lucide-react';

export default function ResultsDashboard({ result, onReset }) {
  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-6"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Analysis Complete
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Server size={12} /> SpecForge Core v2.0
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">Engineering Blueprint</h2>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/5 text-slate-300 hover:text-white transition-all w-full sm:w-auto text-sm font-medium shrink-0"
        >
          <RotateCcw size={15} />
          New Analysis
        </button>
      </motion.div>

      {/* ── Top metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} className="glass p-4 md:p-6 rounded-2xl border-t-2 border-t-[var(--color-primary)]">
          <div className="flex items-center gap-3 mb-2 text-[var(--color-primary)]">
            <Terminal size={18} />
            <h3 className="font-semibold text-sm">Assignment Category</h3>
          </div>
          <p className="text-lg md:text-xl font-bold text-white capitalize leading-snug">{result.category || 'General Engineering'}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-4 md:p-6 rounded-2xl border-t-2 border-t-[var(--color-secondary)]">
          <div className="flex items-center gap-3 mb-2 text-[var(--color-secondary)]">
            <Activity size={18} />
            <h3 className="font-semibold text-sm">Difficulty Rating</h3>
          </div>
          <p className="text-lg md:text-xl font-bold text-white capitalize leading-snug">{result.difficulty || 'Medium'}</p>
        </motion.div>
      </div>

      {/* ── Main grid: Phases (full width on mobile) + side cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Execution Phases — spans 2 cols on lg */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-[var(--color-dark-border)] bg-white/5 flex items-center gap-3">
            <Layers className="text-[var(--color-primary)] shrink-0" size={20} />
            <h3 className="text-lg md:text-xl font-bold">Execution Phases</h3>
          </div>
          <div className="p-4 md:p-6 flex-1 bg-black/20">
            <div className="space-y-5">
              {result.phases && result.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-[-20px] before:w-0.5 before:bg-[var(--color-dark-border)] last:before:hidden">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] ring-4 ring-black shrink-0" />
                  <h4 className="text-sm md:text-base font-semibold text-white mb-1">Phase {idx + 1}</h4>
                  <div className="flex items-start gap-2 text-slate-300 text-xs md:text-sm">
                    <CheckCircle2 size={14} className="text-[var(--color-secondary)] mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{typeof phase === 'object' ? (phase.title || JSON.stringify(phase)) : phase}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column — stacks on mobile */}
        <div className="flex flex-col gap-4 md:gap-6">

          {/* Edge Case Card */}
          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
            <div className="p-3 md:p-4 border-b border-[var(--color-dark-border)] bg-amber-500/10 flex items-center gap-2">
              <AlertOctagon className="text-amber-400 shrink-0" size={16} />
              <h3 className="font-semibold text-amber-400 text-sm">Edge Case Trap Finder</h3>
            </div>
            <div className="p-3 md:p-4 bg-black/20">
              <ul className="space-y-3">
                {result.pitfalls && result.pitfalls.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                    <ChevronRight size={14} className="text-amber-500/70 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Required Diagrams */}
          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
            <div className="p-3 md:p-4 border-b border-[var(--color-dark-border)] bg-[var(--color-secondary)]/10 flex items-center gap-2">
              <Lightbulb className="text-[var(--color-secondary)] shrink-0" size={16} />
              <h3 className="font-semibold text-[var(--color-secondary)] text-sm">Required Diagrams</h3>
            </div>
            <div className="p-3 md:p-4 bg-black/20">
              <ul className="space-y-3">
                {result.diagrams && result.diagrams.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                    <ChevronRight size={14} className="text-[var(--color-secondary)]/70 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Concept Guide */}
          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden flex-1">
            <div className="p-3 md:p-4 border-b border-[var(--color-dark-border)] bg-purple-500/10 flex items-center gap-2">
              <BookOpen className="text-purple-400 shrink-0" size={16} />
              <h3 className="font-semibold text-purple-400 text-sm">Concept Guide</h3>
            </div>
            <div className="p-3 md:p-4 bg-black/20">
              <div className="flex flex-wrap gap-2">
                {result.concepts && result.concepts.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
