import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopicForm from '../components/generate/TopicForm';
import ScriptPreview from '../components/generate/ScriptPreview';
import { Sparkles, Lightbulb, Compass, Zap } from 'lucide-react';

const PRESETS = [
  {
    id: 1,
    label: 'Preset #1',
    topic: 'The Commoditization of Software in the AI Era',
    brief: 'Argue that when code generation costs zero, system architecture and audience trust become the real defensible moats. Contrast commoditized feature-building with high-leverage workflows.',
    link: 'https://paulgraham.com/ideas.html',
    tone: 50,
    length: 'Medium (~600 words, 4-5 min)',
  },
  {
    id: 2,
    label: 'Preset #2',
    topic: 'Why 1-Person Billion Dollar Companies Will Actually Happen',
    brief: 'Deconstruct the myth of team size. Explain how an autonomous multi-agent pipeline allows a solo founder to handle engineering, marketing, and distribution with zero headcount drag.',
    link: 'https://news.ycombinator.com',
    tone: 45,
    length: 'Medium (~600 words, 4-5 min)',
  },
  {
    id: 3,
    label: 'Preset #3',
    topic: 'The Death of Traditional 2-Week Sprints',
    brief: 'Why synchronous Agile meetings and Jira story pointing are obsolete for AI-native teams. Real-time asynchronous iteration beats artificial two-week batching.',
    link: '',
    tone: 60,
    length: 'Short (~300 words, 2-3 min)',
  }
];

export default function GenerateScript() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleApplyPreset = (preset) => {
    setSelectedPreset({ ...preset, timestamp: Date.now() });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
                Generate Script in Your Voice
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Conditioned on <span className="font-semibold text-brand-600 dark:text-brand-400">Sahas Kiran (Tech & Systems Essayist)</span> via stylometric analysis, RAG retrieval, and 3 cooperating agents.
              </p>
            </div>
          </div>
        </div>

        {/* Idea Starters Presets */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-dark-850 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pl-1.5 pr-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Idea Starters:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 bg-white dark:bg-dark-900 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xs transition active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Output & Tabs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 xl:col-span-5">
          <TopicForm
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            presetData={selectedPreset}
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-7">
          <ScriptPreview isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
}
