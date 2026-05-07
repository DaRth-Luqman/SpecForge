import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Send, X } from 'lucide-react';

export default function AssignmentInput({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('text'); // text, pdf, image

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isAnalyzing) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full glass rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'text' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <FileText size={16} />
          Text Input
        </button>
        <button 
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'pdf' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Upload size={16} />
          PDF Upload
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'image' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <ImageIcon size={16} />
          Image
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {activeTab === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your monolithic assignment prompt here..."
            className="w-full h-64 md:h-80 bg-black/40 border border-[var(--color-dark-border)] rounded-2xl p-6 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] resize-none custom-scrollbar transition-all text-sm md:text-base"
            disabled={isAnalyzing}
          />
        )}

        {activeTab === 'pdf' && (
          <div className="w-full h-64 md:h-80 bg-black/40 border-2 border-dashed border-[var(--color-dark-border)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h4 className="text-lg font-medium mb-1">Drag & Drop PDF</h4>
            <p className="text-slate-500 text-sm">Or click to browse files (Feature Coming Soon)</p>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="w-full h-64 md:h-80 bg-black/40 border-2 border-dashed border-[var(--color-dark-border)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h4 className="text-lg font-medium mb-1">Upload Screenshots</h4>
            <p className="text-slate-500 text-sm">Upload images of your assignment (Feature Coming Soon)</p>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <p className="text-xs text-slate-500 max-w-md hidden md:block">
            SpecForge AI processes your requirements securely and never uses your assignments for training.
          </p>
          <button
            type="submit"
            disabled={isAnalyzing || (activeTab === 'text' && !text.trim()) || activeTab !== 'text'}
            className="w-full md:w-auto px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/20"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send size={18} />
                Generate Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
