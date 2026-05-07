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
      className="w-full max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Analysis Complete
            </span>
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <Server size={14} /> SpecForge Core v2.0
            </span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Engineering Blueprint</h2>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/5 text-slate-300 hover:text-white transition-all w-full md:w-auto text-sm font-medium"
        >
          <RotateCcw size={16} />
          New Analysis
        </button>
      </motion.div>

      {/* Top metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border-t-2 border-t-[var(--color-primary)]">
          <div className="flex items-center gap-3 mb-3 text-[var(--color-primary)]">
            <Terminal size={20} />
            <h3 className="font-semibold">Assignment Category</h3>
          </div>
          <p className="text-xl font-bold text-white capitalize">{result.category || "General Engineering"}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border-t-2 border-t-[var(--color-secondary)]">
          <div className="flex items-center gap-3 mb-3 text-[var(--color-secondary)]">
            <Activity size={20} />
            <h3 className="font-semibold">Difficulty Rating</h3>
          </div>
          <p className="text-xl font-bold text-white capitalize">{result.difficulty || "Medium"}</p>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column - Phase Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[var(--color-dark-border)] bg-white/5 flex items-center gap-3">
            <Layers className="text-[var(--color-primary)]" size={24} />
            <h3 className="text-xl font-bold">Execution Phases</h3>
          </div>
          <div className="p-6 flex-1 bg-black/20">
            <div className="space-y-6">
              {result.phases && result.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-[var(--color-dark-border)] last:before:hidden">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] ring-4 ring-black"></div>
                  <h4 className="text-lg font-semibold text-white mb-2">Phase {idx + 1}</h4>
                  <div className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle2 size={16} className="text-[var(--color-secondary)] mt-0.5 shrink-0" />
                    <span>{phase}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column - Warnings & Guidance */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[var(--color-dark-border)] bg-amber-500/10 flex items-center gap-2">
              <AlertOctagon className="text-amber-400" size={18} />
              <h3 className="font-semibold text-amber-400">Edge Case</h3>
            </div>
            <div className="p-4 bg-black/20">
              <ul className="space-y-3">
                {result.pitfalls && result.pitfalls.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight size={16} className="text-amber-500/70 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[var(--color-dark-border)] bg-[var(--color-secondary)]/10 flex items-center gap-2">
              <Lightbulb className="text-[var(--color-secondary)]" size={18} />
              <h3 className="font-semibold text-[var(--color-secondary)]">Required Diagrams</h3>
            </div>
            <div className="p-4 bg-black/20">
              <ul className="space-y-3">
                {result.diagrams && result.diagrams.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight size={16} className="text-[var(--color-secondary)]/70 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden flex-1">
            <div className="p-4 border-b border-[var(--color-dark-border)] bg-purple-500/10 flex items-center gap-2">
              <BookOpen className="text-purple-400" size={18} />
              <h3 className="font-semibold text-purple-400">Concept Guide</h3>
            </div>
            <div className="p-4 bg-black/20 h-full">
              <div className="flex flex-wrap gap-2">
                {result.concepts && result.concepts.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
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
