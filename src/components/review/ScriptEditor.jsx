import React, { useState, useEffect } from 'react';
import { Edit3, Copy, Download, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ScriptEditor() {
  const { currentScript, setCurrentScript } = useApp();
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentScript) {
      setContent(currentScript.content);
    }
  }, [currentScript]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (currentScript) {
      setCurrentScript({ ...currentScript, content: e.target.value });
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const estSeconds = Math.round((wordCount / 140) * 60);
  const estMinutes = Math.ceil(wordCount / 140);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentScript?.topic || 'script').slice(0, 24).replace(/\s+/g, '_')}-v${currentScript?.version || 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentScript?.topic || 'script').slice(0, 24).replace(/\s+/g, '_')}-v${currentScript?.version || 1}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Live Script Editor</h2>
        </div>
        {currentScript && (
          <div className="flex items-center gap-2">
            <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-lg text-xs font-bold">
              v{currentScript.version}
            </span>
          </div>
        )}
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        rows={14}
        className="w-full font-sans text-xs sm:text-sm p-4 bg-gray-50 dark:bg-dark-850 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition resize-y leading-relaxed"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-3">
          <span><strong>{wordCount}</strong> words</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{estMinutes} min ({estSeconds}s) speaking time
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-850 hover:bg-gray-200 dark:hover:bg-dark-700 transition text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-850 hover:bg-gray-200 dark:hover:bg-dark-700 transition text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-850 hover:bg-gray-200 dark:hover:bg-dark-700 transition text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.md</span>
          </button>
        </div>
      </div>
    </div>
  );
}

