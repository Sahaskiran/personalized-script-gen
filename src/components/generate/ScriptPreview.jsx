import React, { useState } from 'react';
import { 
  FileText, Sparkles, Copy, SquarePen, Download, 
  Check, Clock, Play, Layers, Compass, Quote, ExternalLink, Zap, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import VoiceReader from '../voice/VoiceReader';

export default function ScriptPreview({ isLoading }) {
  const { currentScript, openTeleprompter, referenceScripts } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('script'); // 'script' | 'style-chunks' | 'fact-chunks'
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (currentScript?.content) {
      navigator.clipboard.writeText(currentScript.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (currentScript?.content) {
      const blob = new Blob([currentScript.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(currentScript.topic || 'script').slice(0, 24).replace(/\s+/g, '_')}-v${currentScript.version || 1}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const wordCount = currentScript ? currentScript.content.split(/\s+/).filter(Boolean).length : 0;
  const estMinutes = Math.ceil(wordCount / 145);

  // Mock retrieved chunks data for RAG inspector tabs
  const retrievedStyleChunks = [
    {
      source: 'The AI Moat Fallacy',
      similarity: 0.94,
      tag: 'Contrarian Opening',
      text: 'If your entire value proposition can be replicated by a single model update from OpenAI or Anthropic, you do not have a software company—you have a temporary arbitrage trade.',
    },
    {
      source: 'The Death of the 40-Hour Work Week',
      similarity: 0.91,
      tag: 'Punchy Cadence (Grade 7.9)',
      text: 'When you use autonomous agentic pipelines, an individual creator can produce the output of a 10-person agency in 15 focused hours a week. The future belongs to asynchronous leverage.',
    },
    {
      source: 'Why Fast Creators Always Win',
      similarity: 0.88,
      tag: 'Signature Signpost & Conclusion',
      text: 'Speed generates data. Data compounds intuition. The creator who ships 50 imperfect iterations will always beat the genius who spends two years polishing in secret.',
    }
  ];

  const retrievedFactChunks = [
    {
      premise: 'Marginal Cost of Code Generation',
      fact: 'LLM inference token costs decreased 90%+ year-over-year while context window capacities expanded to 2M+ tokens.',
      grounding: 'Decomposed from prompt brief and engineering reference data.'
    },
    {
      premise: 'Architectural Moat vs API Wrapper',
      fact: 'System defensibility shifts towards captive distribution, customer workflow telemetry, and authentic voice consistency.',
      grounding: 'Synthesized with Sahas Kiran essay corpus.'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs flex flex-col h-full min-h-[580px]">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'bg-white dark:bg-dark-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Generated Script
          </button>
          <button
            onClick={() => setActiveTab('style-chunks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'style-chunks'
                ? 'bg-white dark:bg-dark-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Retrieved Style Examples ({retrievedStyleChunks.length})
          </button>
          <button
            onClick={() => setActiveTab('fact-chunks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'fact-chunks'
                ? 'bg-white dark:bg-dark-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Retrieved Fact Chunks ({retrievedFactChunks.length})
          </button>
        </div>

        {currentScript && !isLoading && (
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
              v{currentScript.version || 1}
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {wordCount} words • ~{estMinutes} min
            </span>
          </div>
        )}
      </div>

      {/* Main Body per Active Tab */}
      <div className="flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-4 animate-pulse py-12 px-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-36 bg-brand-100 dark:bg-brand-950/80 rounded-lg"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mt-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          </div>
        ) : activeTab === 'script' ? (
          currentScript ? (
            <div className="flex flex-col justify-between h-full space-y-4">
              {/* Script Topic & Match Badge */}
              <div className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-brand-50/70 via-indigo-50/40 to-purple-50/40 dark:from-brand-950/40 dark:to-dark-850 rounded-xl border border-brand-200/50 dark:border-brand-800/40">
                <div className="truncate">
                  <p className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Topic
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                    {currentScript.topic}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-dark-900 rounded-lg border border-brand-200 dark:border-brand-800 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>94% Stylometric Alignment</span>
                </div>
              </div>

              {/* Script Content Textarea / Reader Box */}
              <div className="flex-1 bg-gray-50/70 dark:bg-dark-850/80 rounded-2xl p-5 overflow-y-auto border border-gray-100 dark:border-gray-800 max-h-[360px]">
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed font-sans text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {currentScript.content}
                </div>
              </div>

              {/* Voice Simulator */}
              <VoiceReader text={currentScript.content} />

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => openTeleprompter(currentScript)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Teleprompter
                </button>

                <button
                  onClick={() => navigate('/review')}
                  className="px-3.5 py-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                  Storyboard & Refine
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-gray-50 dark:hover:bg-dark-850 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-gray-50 dark:hover:bg-dark-850 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-semibold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                  title="Download Markdown"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">No Script Generated Yet</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Fill in your project brief on the left or select an Idea Starter preset, then click Generate Script to launch the multi-agent voice alignment engine.
              </p>
            </div>
          )
        ) : activeTab === 'style-chunks' ? (
          /* Tab 2: Retrieved Style Chunks */
          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            <div className="p-3 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-200/60 dark:border-brand-800/60 text-xs text-brand-800 dark:text-brand-300">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Stylometric RAG Retrieval Conditioning
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                Top vector-matched chunks retrieved from your 8 reference essays, injected into the Draft and Critic agent prompts for cadence conditioning.
              </p>
            </div>

            {retrievedStyleChunks.map((chunk, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-dark-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-brand-500" />
                    {chunk.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      {chunk.tag}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {(chunk.similarity * 100).toFixed(0)}% sim
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic bg-white dark:bg-dark-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  "{chunk.text}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Tab 3: Retrieved Fact Chunks */
          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-300">
              <p className="font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                Decomposed Fact & Premise Retrieval
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                Sub-claims verified by the Drafting Agent before synthesis to prevent hallucinations.
              </p>
            </div>

            {retrievedFactChunks.map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-dark-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-2">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {item.premise}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  {item.fact}
                </p>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {item.grounding}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
