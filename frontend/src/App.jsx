import React, { useState } from 'react';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import AssignmentInput from './components/AssignmentInput';
import ResultsDashboard from './components/ResultsDashboard';
import { motion } from 'framer-motion';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (assignmentText) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentText }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to analyze assignment. Make sure the backend is running and API key is set.';
        try {
          const errData = await response.json();
          if (errData.error) errMsg = `${errData.error} ${errData.details || ''}`.trim();
        } catch (e) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-slate-200 selection:bg-primary/30 font-sans custom-scrollbar">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <header className="border-b border-[var(--color-dark-border)] glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              SF
            </div>
            <h1 className="text-xl font-bold tracking-tight">SpecForge <span className="text-[var(--color-primary)]">AI</span></h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#analyze" className="hover:text-white transition-colors">Analyze</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex flex-col gap-24">
        {!analysisResult && !isAnalyzing && (
          <>
            <Hero />
            <FeatureCards />
          </>
        )}

        <section id="analyze" className="flex flex-col items-center w-full max-w-4xl mx-auto">
          {!analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Initialize Analysis Protocol</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Provide your assignment prompt below. SpecForge AI will parse the requirements and forge a comprehensive engineering execution plan.
                </p>
              </div>
              <AssignmentInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              
              {error && (
                <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 rounded-xl text-red-400 text-center text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-t-2 border-[var(--color-primary)] rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-[var(--color-secondary)] rounded-full animate-[spin_1.5s_reverse_infinite]"></div>
                <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-ping"></div>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2 gradient-text">Forging Execution Plan...</h3>
              <p className="text-sm text-slate-500 animate-pulse">Analyzing architectural constraints and edge cases</p>
            </motion.div>
          )}

          {analysisResult && (
            <ResultsDashboard result={analysisResult} onReset={() => setAnalysisResult(null)} />
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--color-dark-border)] mt-24 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} SpecForge AI. Engineered for students & developers.</p>
      </footer>
    </div>
  );
}

export default App;
