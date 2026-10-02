import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Fingerprint, Flame, Target, MessageSquare, 
  ArrowRight, Plus, X, SlidersHorizontal, BookOpen 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StyleTraits() {
  const { styleTraits, updateStyleTraits } = useApp();
  const navigate = useNavigate();

  const [newPhrase, setNewPhrase] = useState('');
  const [newSlang, setNewSlang] = useState('');

  if (!styleTraits) {
    return (
      <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
        <Fingerprint className="w-14 h-14 text-gray-300 dark:text-gray-700 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No Style DNA Extracted Yet</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
          Select a preset or upload references to analyze your creator tone.
        </p>
      </div>
    );
  }

  const {
    persona,
    vibe,
    tone = 50,
    avgSentenceLength = 14,
    complexity = 'Conversational',
    hookStyle,
    ctaStyle,
    topPhrases = [],
    frequentWords = [],
    summary,
  } = styleTraits;

  const handleAddPhrase = () => {
    if (newPhrase.trim() && !topPhrases.includes(newPhrase.trim())) {
      updateStyleTraits({
        ...styleTraits,
        topPhrases: [...topPhrases, newPhrase.trim()]
      });
      setNewPhrase('');
    }
  };

  const handleRemovePhrase = (phraseToRemove) => {
    updateStyleTraits({
      ...styleTraits,
      topPhrases: topPhrases.filter(p => p !== phraseToRemove)
    });
  };

  const handleAddSlang = () => {
    if (newSlang.trim() && !frequentWords.some(w => w.word.toLowerCase() === newSlang.trim().toLowerCase())) {
      updateStyleTraits({
        ...styleTraits,
        frequentWords: [...frequentWords, { word: newSlang.trim(), count: 20 }]
      });
      setNewSlang('');
    }
  };

  const handleRemoveSlang = (wordToRemove) => {
    updateStyleTraits({
      ...styleTraits,
      frequentWords: frequentWords.filter(w => w.word !== wordToRemove)
    });
  };

  const getToneLabel = (val) => {
    if (val < 30) return 'Very Casual / Hype';
    if (val < 60) return 'Conversational & Engaging';
    if (val < 80) return 'Authoritative & Clear';
    return 'Formal & Structured';
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      {/* Header & Persona Card */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Influencer Style DNA</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active voice blueprint applied to all scripts</p>
        </div>
        <button
          onClick={() => navigate('/generate')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          <span>Use in Script</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Influencer Persona Banner */}
      <div className="bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-brand-200/60 dark:border-brand-800/60">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            Active Persona
          </span>
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{persona || 'Content Creator'}</h4>
        {vibe && <p className="text-xs text-brand-700 dark:text-brand-300 font-medium mt-0.5">Vibe: {vibe}</p>}
        {summary && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{summary}</p>}
      </div>

      {/* Hook & CTA Strategies */}
      {(hookStyle || ctaStyle) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hookStyle && (
            <div className="p-3.5 bg-gray-50 dark:bg-dark-850 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Opening Hook DNA</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{hookStyle}</p>
            </div>
          )}
          {ctaStyle && (
            <div className="p-3.5 bg-gray-50 dark:bg-dark-850 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>Call-to-Action Strategy</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ctaStyle}</p>
            </div>
          )}
        </div>
      )}

      {/* Tone Intensity Meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span>Tone & Delivery Energy</span>
          <span className="text-brand-600 dark:text-brand-400">{getToneLabel(tone)} ({tone}/100)</span>
        </div>
        <div className="relative h-2.5 bg-gray-100 dark:bg-dark-800 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-emerald-400 via-brand-500 to-indigo-600 rounded-full opacity-70"></div>
          <div
            className="absolute top-1/2 -mt-2 h-4 w-4 bg-white border-2 border-brand-600 rounded-full shadow-md"
            style={{ left: `calc(${Math.min(Math.max(tone, 4), 96)}% - 0.5rem)` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Hyper-Casual / Hype</span>
          <span>Conversational</span>
          <span>Formal / Polished</span>
        </div>
      </div>

      {/* Pacing & Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-dark-850 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Sentence Pacing</p>
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 mt-0.5">{avgSentenceLength} words</p>
          <p className="text-[10px] text-gray-400">{avgSentenceLength < 11 ? '⚡ Snappy fast cuts' : '📖 Flowing narrative'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-dark-850 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Complexity</p>
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 capitalize mt-0.5">{complexity}</p>
          <p className="text-[10px] text-gray-400">Natural spoken register</p>
        </div>
      </div>

      {/* Signature Catchphrases Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Signature Catchphrases & Hooks
          </h4>
          <span className="text-[10px] text-gray-400">{topPhrases.length} phrases loaded</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {topPhrases.map((phrase, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-xl px-3 py-1 text-xs font-semibold"
            >
              "{phrase}"
              <button
                onClick={() => handleRemovePhrase(phrase)}
                className="text-brand-400 hover:text-brand-700 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom phrase */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a custom catchphrase (e.g. 'here is the thing')..."
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPhrase()}
            className="flex-1 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={handleAddPhrase}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      {/* Slang & Keywords Cloud Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Frequent Slang & Favorite Words
          </h4>
          <span className="text-[10px] text-gray-400">{frequentWords.length} words</span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3.5 bg-gray-50 dark:bg-dark-850 rounded-2xl border border-gray-100 dark:border-gray-800">
          {frequentWords.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-dark-900 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 shadow-2xs"
            >
              {item.word}
              <button
                onClick={() => handleRemoveSlang(item.word)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom slang */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add slang or buzzword (e.g. 'unhinged', 'unlock')..."
            value={newSlang}
            onChange={(e) => setNewSlang(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSlang()}
            className="flex-1 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={handleAddSlang}
            className="px-3 py-1.5 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

