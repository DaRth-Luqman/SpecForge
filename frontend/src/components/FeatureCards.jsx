import React from 'react';
import { motion } from 'framer-motion';
import { Network, AlertTriangle, Blocks, Workflow } from 'lucide-react';

const features = [
  {
    icon: <Blocks className="w-6 h-6 text-blue-400" />,
    title: "Phase Breakdown",
    description: "Deconstructs monolithic assignment prompts into manageable, logical development sprints."
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    title: "Edge Case Detection",
    description: "Identifies hidden technical pitfalls and requirements before you write a single line of code."
  },
  {
    icon: <Network className="w-6 h-6 text-purple-400" />,
    title: "Architecture Blueprints",
    description: "Recommends database schemas, state management patterns, and system diagrams."
  },
  {
    icon: <Workflow className="w-6 h-6 text-emerald-400" />,
    title: "Adaptive Workflows",
    description: "Suggests the optimal engineering methodology and branching strategy for the domain."
  }
];

export default function FeatureCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
          className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
