import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Send, X, File, ScanLine, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createWorker } from 'tesseract.js';

// ─── Garbage / junk input detector ───────────────────────────────────────────
const isGarbageInput = (text) => {
  const t = text.trim();
  if (t.length < 15) return true;

  // Ratio of alphanumeric to total chars — below 60% is likely garbage
  const alphaNum = (t.match(/[a-z0-9\s]/gi) || []).length;
  const ratio = alphaNum / t.length;
  if (ratio < 0.6) return true;

  // No spaces at all in a long string → likely random chars
  if (t.length > 20 && !t.includes(' ')) return true;

  // Contains actual technical/academic keywords → definitely valid
  const keywords = [
    'implement', 'design', 'create', 'build', 'algorithm', 'function',
    'system', 'database', 'network', 'code', 'class', 'api', 'server',
    'sort', 'search', 'tree', 'graph', 'model', 'train', 'neural',
    'deadlock', 'thread', 'process', 'memory', 'pointer', 'array',
    'maze', 'pathfinding', 'encrypt', 'hash', 'auth', 'jwt', 'sql',
  ];
  const lower = t.toLowerCase();
  const hasKeyword = keywords.some((kw) => lower.includes(kw));
  if (hasKeyword) return false;

  // Entropy check: if >70% of chars are the same 3 char types → garbage
  const unique = new Set(lower.replace(/\s/g, '')).size;
  if (t.replace(/\s/g, '').length > 10 && unique < 5) return true;

  return false;
};

export default function AssignmentInput({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [file, setFile] = useState(null);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrExtractedText, setOcrExtractedText] = useState('');
  const fileInputRef = useRef(null);

  // ─── File selection ─────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (activeTab === 'pdf' && selectedFile.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file.');
      return;
    }
    if (activeTab === 'image' && !selectedFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, etc.).');
      return;
    }

    setFile(selectedFile);
    setOcrExtractedText('');

    if (activeTab === 'image') {
      await runOcr(selectedFile);
    }
  };

  // ─── Tesseract OCR ──────────────────────────────────────────────────────────
  const runOcr = async (imageFile) => {
    setIsOcrRunning(true);
    setOcrProgress(0);
    toast('🔍 Scanning image with OCR...', { duration: 3000 });

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const imageUrl = URL.createObjectURL(imageFile);
      const { data: { text: extracted } } = await worker.recognize(imageUrl);
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);

      const cleaned = extracted.trim();
      if (!cleaned || cleaned.length < 10) {
        toast.error('OCR could not extract readable text. Try a clearer image.');
        setIsOcrRunning(false);
        return;
      }

      setOcrExtractedText(cleaned);
      setText(cleaned);
      toast.success(`✅ OCR complete! Extracted ${cleaned.length} characters.`);
    } catch (err) {
      console.error('OCR Error:', err);
      toast.error('OCR failed. Please try a higher-quality image.');
    } finally {
      setIsOcrRunning(false);
      setOcrProgress(0);
    }
  };

  const triggerFileSelect = () => {
    if (isOcrRunning) return;
    fileInputRef.current?.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setOcrExtractedText('');
    if (activeTab !== 'image') setText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Submit with validation ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = activeTab === 'image' ? ocrExtractedText || text : text;

    if (!payload.trim() && !file) {
      toast.error('Please enter an assignment or upload a file first.');
      return;
    }

    if (activeTab === 'text' && isGarbageInput(payload)) {
      toast.error('⚠️ Please provide a valid technical assignment or question.', {
        duration: 4000,
        icon: '🚫',
      });
      return;
    }

    if (!isAnalyzing) {
      onAnalyze({ text: payload, file: activeTab !== 'image' ? file : null });
    }
  };

  const tabClass = (tab) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
      activeTab === tab
        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="w-full glass rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] -z-10" />

      {/* ── Tab Bar ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button type="button" onClick={() => { setActiveTab('text'); setFile(null); setOcrExtractedText(''); }} className={tabClass('text')}>
          <FileText size={15} />
          <span>Text Input</span>
        </button>
        <button type="button" onClick={() => { setActiveTab('pdf'); setFile(null); setOcrExtractedText(''); }} className={tabClass('pdf')}>
          <Upload size={15} />
          <span>PDF Upload</span>
        </button>
        <button type="button" onClick={() => { setActiveTab('image'); setFile(null); setText(''); setOcrExtractedText(''); }} className={tabClass('image')}>
          <ScanLine size={15} />
          <span>Image OCR</span>
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

        {/* ── Text tab ── */}
        {activeTab === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your assignment prompt here..."
            className="w-full h-52 md:h-72 bg-black/40 border border-[var(--color-dark-border)] rounded-2xl p-4 md:p-6 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] resize-none custom-scrollbar transition-all text-sm md:text-base"
            disabled={isAnalyzing}
          />
        )}

        {/* ── PDF tab ── */}
        {activeTab === 'pdf' && (
          <div
            onClick={triggerFileSelect}
            className={`w-full h-52 md:h-72 bg-black/40 border-2 border-dashed ${file ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-dark-border)] hover:border-[var(--color-primary)]/50'} rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative`}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-3 text-[var(--color-primary)]">
                  <File className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 max-w-[200px] truncate">{file.name}</h4>
                <p className="text-slate-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button onClick={removeFile} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h4 className="text-base font-medium mb-1">Click to Browse PDF</h4>
                <p className="text-slate-500 text-xs">Upload your PDF assignment</p>
              </>
            )}
          </div>
        )}

        {/* ── Image OCR tab ── */}
        {activeTab === 'image' && (
          <div className="space-y-3">
            <div
              onClick={triggerFileSelect}
              className={`w-full h-44 md:h-56 bg-black/40 border-2 border-dashed ${
                file
                  ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
                  : 'border-[var(--color-dark-border)] hover:border-[var(--color-secondary)]/50'
              } rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative ${isOcrRunning ? 'pointer-events-none' : ''}`}
            >
              {isOcrRunning ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle
                        cx="32" cy="32" r="28" fill="none"
                        stroke="var(--color-secondary)" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - ocrProgress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--color-secondary)]">{ocrProgress}%</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">Extracting text via OCR...</p>
                  <p className="text-slate-500 text-xs">Tesseract.js is scanning your image</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center mb-3 text-[var(--color-secondary)]">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-0.5 max-w-[200px] truncate">{file.name}</h4>
                  {ocrExtractedText ? (
                    <span className="text-emerald-400 text-xs font-semibold mt-1">✅ OCR Complete — {ocrExtractedText.length} chars extracted</span>
                  ) : (
                    <span className="text-amber-400 text-xs">Processing...</span>
                  )}
                  <button onClick={removeFile} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ScanLine className="w-7 h-7 text-[var(--color-secondary)]" />
                  </div>
                  <h4 className="text-base font-medium mb-1">Upload Image for OCR</h4>
                  <p className="text-slate-500 text-xs max-w-xs">PNG, JPG, or WEBP of a lab manual, whiteboard, or printed assignment</p>
                </>
              )}
            </div>

            {/* OCR preview box */}
            {ocrExtractedText && (
              <div className="rounded-xl bg-black/40 border border-[var(--color-secondary)]/30 p-3">
                <p className="text-xs text-[var(--color-secondary)] font-semibold mb-1 uppercase tracking-wider">Extracted Text Preview</p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap">{ocrExtractedText}</p>
              </div>
            )}
          </div>
        )}

        {/* Optional context input for PDF/Image */}
        {(activeTab === 'pdf' || activeTab === 'image') && (
          <div className="mt-3">
            <input
              type="text"
              value={activeTab === 'pdf' ? text : ''}
              onChange={(e) => activeTab === 'pdf' && setText(e.target.value)}
              placeholder="Optional: Add extra context or specific questions..."
              className="w-full bg-black/40 border border-[var(--color-dark-border)] rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-sm"
              disabled={isAnalyzing}
            />
          </div>
        )}

        {/* ── Bottom row: Samples + Generate ── */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Sample Assignments */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sample Assignments</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { setActiveTab('text'); setText("Design a multi-threaded system in C that avoids OS Deadlock using semaphores and mutexes. Explain the Banker's algorithm implementation."); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
                OS Deadlock
              </button>
              <button type="button" onClick={() => { setActiveTab('text'); setText("Implement a Convolutional Neural Network (CNN) for MNIST digit classification using PyTorch. Focus on data normalization and overfitting prevention."); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
                AI Model
              </button>
              <button type="button" onClick={() => { setActiveTab('text'); setText("Create a secure REST API using Node.js and Express with JWT authentication and RBAC."); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
                Secure API
              </button>
              <button type="button" onClick={() => { setActiveTab('text'); setText("Implement an AI Pathfinding Maze solver using the A* search algorithm. The agent must navigate a 2D grid maze from start to goal, avoiding walls. Implement heuristic distance calculation and handle edge cases in grid traversal."); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all">
                AI Pathfinding Maze
              </button>
            </div>
          </div>

          {/* Generate button — full-width on mobile, auto on desktop */}
          <button
            type="submit"
            disabled={isAnalyzing || isOcrRunning || (!text.trim() && !file && !ocrExtractedText)}
            className="w-full px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : isOcrRunning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Running OCR...
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
