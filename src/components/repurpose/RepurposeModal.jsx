import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Share2, Sparkles, Copy, Check, Smartphone, 
  Linkedin, Twitter, Mail, Loader2, ArrowUpRight 
} from 'lucide-react';

export default function RepurposeModal({ scriptContent = '', onClose }) {
  const { generateRepurposed } = useApp();
  const [activePlatform, setActivePlatform] = useState('tiktok');
  const [results, setResults] = useState({});
  const [loadingPlatform, setLoadingPlatform] = useState(null);
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'tiktok', name: 'TikTok / Shorts', icon: Smartphone, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
    { id: 'linkedin', name: 'LinkedIn Post', icon: Linkedin, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { id: 'twitter', name: 'X / Twitter Thread', icon: Twitter, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
    { id: 'newsletter', name: 'Email / Newsletter', icon: Mail, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
  ];

  const handleGenerate = async (platformId) => {
    if (!scriptContent.trim()) return;
    setLoadingPlatform(platformId);
    try {
      const output = await generateRepurposed(scriptContent, platformId);
      setResults((prev) => ({ ...prev, [platformId]: output }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlatform(null);
    }
  };

  const currentResult = results[activePlatform];

  const handleCopy = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              One-Click Content Repurposer
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Transform your script into viral TikToks, LinkedIn posts, X threads & newsletters
            </p>
          </div>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {platforms.map((p) => {
          const isSelected = activePlatform === p.id;
          const hasGenerated = Boolean(results[p.id]);

          return (
            <button
              key={p.id}
              onClick={() => {
                setActivePlatform(p.id);
                if (!results[p.id]) {
                  handleGenerate(p.id);
                }
              }}
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${p.color}`}>
                <p.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span>{p.name}</span>
                {hasGenerated && (
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Ready
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Output Content Area */}
      <div className="bg-gray-50 dark:bg-dark-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 min-h-[260px] flex flex-col justify-between">
        {loadingPlatform === activePlatform ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Adapting hook, formatting and tone for {platforms.find((p) => p.id === activePlatform)?.name}...
            </p>
          </div>
        ) : currentResult ? (
          <>
            <div className="whitespace-pre-wrap font-sans text-xs text-gray-800 dark:text-gray-200 leading-relaxed max-h-[350px] overflow-y-auto mb-4 p-2">
              {currentResult}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-[11px] text-gray-500">
                {currentResult.split(/\s+/).filter(Boolean).length} words
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerate(activePlatform)}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Content'}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-3">
            <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Repurpose script for {platforms.find((p) => p.id === activePlatform)?.name}
            </p>
            <button
              onClick={() => handleGenerate(activePlatform)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Generate Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
