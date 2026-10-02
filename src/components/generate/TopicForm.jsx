import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Loader2, AlertCircle, Link2, Database, SlidersHorizontal, 
  CheckSquare, Square, Layers, ShieldCheck, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopicForm({ isGenerating, setIsGenerating, presetData }) {
  const { generateScript, referenceScripts, styleDNA } = useApp();
  const [topic, setTopic] = useState('');
  const [brief, setBrief] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [tone, setTone] = useState(50);
  const [targetLength, setTargetLength] = useState('Medium (~600 words, 4-5 min)');
  const [selectedScriptIds, setSelectedScriptIds] = useState([]);
  const [error, setError] = useState('');

  // Handle Preset application
  useEffect(() => {
    if (presetData) {
      setTopic(presetData.topic || '');
      setBrief(presetData.brief || '');
      setReferenceLink(presetData.link || '');
      if (presetData.tone !== undefined) setTone(presetData.tone);
      if (presetData.length) setTargetLength(presetData.length);
    }
  }, [presetData]);

  const toggleScriptSelection = (id) => {
    setSelectedScriptIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllScripts = () => {
    if (selectedScriptIds.length === referenceScripts.length) {
      setSelectedScriptIds([]);
    } else {
      setSelectedScriptIds(referenceScripts.map(s => s.id));
    }
  };

  const getToneLabel = (val) => {
    if (val < 35) return 'Casual & Conversational';
    if (val > 65) return 'Formal & Analytical';
    return 'Balanced & Punchy (Baseline)';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic or core premise.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      await generateScript(topic, {
        brief,
        referenceLinks: referenceLink ? [referenceLink] : [],
        tone: Number(tone),
        targetLength,
        selectedScriptIds: selectedScriptIds.length > 0 ? selectedScriptIds : null,
      });
    } catch (err) {
      setError(err.message || 'Script generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-5">
      {/* Form Title & Persona Pill */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>Project Brief & RAG Parameters</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Configure topic, context, and retrieval grounding
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>8 Reference Scripts Indexed</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Topic / Core Premise <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The commoditization of software in the AI era..."
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>

        {/* Brief / Key Talking Points */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Brief / Key Talking Points <span className="text-gray-400 font-normal normal-case">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Key arguments, counterpoints, personal anecdotes to include..."
            className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Reference Link */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Reference Link / Inspo URL <span className="text-gray-400 font-normal normal-case">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <input
              type="url"
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="https://news.ycombinator.com/item?id=... or article link"
              className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Tone Calibration Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Tone Calibration
            </label>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {getToneLabel(tone)} ({tone}%)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-1">
            <span>Casual</span>
            <span>Balanced</span>
            <span>Formal</span>
          </div>
        </div>

        {/* Target Script Length */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Target Script Length
          </label>
          <div className="relative">
            <select
              value={targetLength}
              onChange={(e) => setTargetLength(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition pr-9"
            >
              <option value="Short (~300 words, 2-3 min)">Short (~300 words, 2-3 min)</option>
              <option value="Medium (~600 words, 4-5 min)">Medium (~600 words, 4-5 min)</option>
              <option value="Long (~1,000 words, 7-8 min)">Long (~1,000 words, 7-8 min)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Ground in Specific Reference Scripts (RAG) */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                Ground in Specific Reference Scripts (RAG)
              </label>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Leave empty to let the retriever pick automatically across all 8 essays.
              </p>
            </div>
            <button
              type="button"
              onClick={selectAllScripts}
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {selectedScriptIds.length === referenceScripts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-44 overflow-y-auto pr-1">
            {referenceScripts.map((s) => {
              const isSelected = selectedScriptIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleScriptSelection(s.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/50 text-brand-900 dark:text-brand-100 font-semibold'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-dark-850/50'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!topic.trim() || isGenerating}
          className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running 3-Agent Voice Alignment Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Script in My Voice ✨</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
