import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Flame, Target, Lightbulb, Copy, Check, 
  TrendingUp, Hash, Tag, Loader2, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ToolsLab() {
  const { generateViralHooks, styleTraits, generateScript } = useApp();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateViralHooks(topic.trim());
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleUseHookInScript = async (hookText) => {
    const fullTopic = `${topic.trim()} (Opening Hook: "${hookText}")`;
    navigate('/generate');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-sm">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Viral Hook & Title Lab
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generate high-retention first 3-second hooks, click-tested titles, and viral SEO tags.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Video / Content Concept
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. Why 99% of people fail at waking up early, and the simple fix..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-gray-100 transition"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting Viral Hooks...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Viral Lab ✨
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] text-gray-400">Try ideas:</span>
          {[
            'How I automated my entire client onboarding',
            'Is the M4 MacBook Pro really worth upgrading?',
            'The 3 financial mistakes I made in my 20s',
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => setTopic(sample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-dark-850 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Results */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: 5 Hook Variations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-600" />
                5 High-Retention Opening Hooks
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                AI Retention Scored
              </span>
            </div>

            <div className="space-y-3">
              {data.hooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                      {hook.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {hook.score}% Virality Score
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                    "{hook.text}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                    <button
                      onClick={() => handleCopy(hook.text, `hook-${idx}`)}
                      className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded"
                    >
                      {copiedItem === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedItem === `hook-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleUseHookInScript(hook.text)}
                      className="text-xs flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 px-2 py-1 rounded"
                    >
                      <span>Write Script with This Hook</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Titles & Hashtags */}
          <div className="space-y-6">
            {/* Clickable Titles */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                Click-Optimized Titles (High CTR)
              </h3>
              <div className="space-y-2">
                {data.titles.map((title, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-dark-850 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold text-gray-800 dark:text-gray-200 group"
                  >
                    <span className="line-clamp-2">{title}</span>
                    <button
                      onClick={() => handleCopy(title, `title-${idx}`)}
                      className="p-1 text-gray-400 hover:text-brand-600 transition"
                      title="Copy title"
                    >
                      {copiedItem === `title-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Hashtags */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                Trending Creator Hashtags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopy(tag, `tag-${idx}`)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
