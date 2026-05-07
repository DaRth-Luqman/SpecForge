import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Send, X, File } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignmentInput({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (activeTab === 'pdf' && selectedFile.type !== 'application/pdf') {
        toast.error('Please select a valid PDF file.');
        return;
      }
      if (activeTab === 'image' && !selectedFile.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((text.trim() || file) && !isAnalyzing) {
      onAnalyze({ text, file });
    }
  };

  return (
    <div className="w-full glass rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => { setActiveTab('text'); setFile(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'text' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <FileText size={16} />
          Text Input
        </button>
        <button 
          onClick={() => { setActiveTab('pdf'); setFile(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'pdf' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Upload size={16} />
          PDF Upload
        </button>
        <button 
          onClick={() => { setActiveTab('image'); setFile(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'image' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <ImageIcon size={16} />
          Image
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={activeTab === 'pdf' ? '.pdf' : 'image/*'}
        />

        {activeTab === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your monolithic assignment prompt here..."
            className="w-full h-64 md:h-80 bg-black/40 border border-[var(--color-dark-border)] rounded-2xl p-6 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] resize-none custom-scrollbar transition-all text-sm md:text-base"
            disabled={isAnalyzing}
          />
        )}

        {(activeTab === 'pdf' || activeTab === 'image') && (
          <div 
            onClick={triggerFileSelect}
            className={`w-full h-64 md:h-80 bg-black/40 border-2 border-dashed ${file ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-dark-border)] hover:border-[var(--color-primary)]/50'} rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative`}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4 text-[var(--color-primary)]">
                  {activeTab === 'pdf' ? <File className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{file.name}</h4>
                <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h4 className="text-lg font-medium mb-1">Click to Browse Files</h4>
                <p className="text-slate-500 text-sm">Upload your {activeTab === 'pdf' ? 'PDF' : 'Image'} assignment</p>
              </>
            )}
          </div>
        )}

        {/* Optional text prompt when uploading a file */}
        {(activeTab === 'pdf' || activeTab === 'image') && (
          <div className="mt-4">
             <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Optional: Add extra context or specific questions..."
                className="w-full bg-black/40 border border-[var(--color-dark-border)] rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-sm"
                disabled={isAnalyzing}
             />
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <p className="text-xs text-slate-500 max-w-md hidden md:block">
            SpecForge AI processes your requirements securely. Uploaded files are safely stored in your workspace.
          </p>
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sample Assignments</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setText("Design a multi-threaded system in C that avoids OS Deadlock using semaphores and mutexes. Explain the Banker's algorithm implementation.")}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                OS Deadlock
              </button>
              <button
                type="button"
                onClick={() => setText("Implement a Convolutional Neural Network (CNN) for MNIST digit classification using PyTorch. Focus on data normalization and overfitting prevention.")}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                AI Model
              </button>
              <button
                type="button"
                onClick={() => setText("Create a secure REST API using Node.js and Express with JWT authentication and RBAC.")}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                Secure API
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || (!text.trim() && !file)}
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
                Generate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
