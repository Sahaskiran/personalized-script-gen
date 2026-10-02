import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import ScriptEditor from '../components/review/ScriptEditor';
import FeedbackPanel from '../components/review/FeedbackPanel';
import VersionHistory from '../components/review/VersionHistory';
import StoryboardView from '../components/storyboard/StoryboardView';
import RepurposeModal from '../components/repurpose/RepurposeModal';
import VoiceReader from '../components/voice/VoiceReader';
import { 
  SquarePen, Clapperboard, Share2, Play, 
  Volume2, Sparkles, FolderOpen, ArrowRight, Check 
} from 'lucide-react';


export default function ReviewRefine() {
  const { currentScript, openTeleprompter } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'storyboard' | 'repurpose' | 'voice'

  if (!currentScript) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-8 text-center max-w-md w-full space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <SquarePen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">No script selected</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Generate a script or pick one from your vault to refine.</p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              to="/generate"
              className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700 transition"
            >
              Generate Script
            </Link>
            <Link
              to="/library"
              className="bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
            >
              Open Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'editor', label: 'Script Editor & AI Polish', icon: SquarePen },
    { id: 'storyboard', label: 'Visual Storyboard & B-Roll', icon: Clapperboard },
    { id: 'repurpose', label: '1-Click Social Repurpose', icon: Share2 },
    { id: 'voice', label: 'Voice Simulator & Teleprompter', icon: Volume2 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Review, Direct & Perfect
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Topic: <span className="font-semibold text-gray-800 dark:text-gray-200">"{currentScript.topic}"</span>
          </p>
        </div>

        <button
          onClick={() => openTeleprompter(currentScript)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Teleprompter Studio</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-850 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Editor & AI Feedback */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ScriptEditor />
            <VoiceReader text={currentScript.content} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <FeedbackPanel />
            <VersionHistory />
          </div>
        </div>
      )}

      {/* Tab 2: Storyboard & B-Roll Director */}
      {activeTab === 'storyboard' && (
        <StoryboardView scriptContent={currentScript.content} />
      )}

      {/* Tab 3: Social Repurposing */}
      {activeTab === 'repurpose' && (
        <RepurposeModal scriptContent={currentScript.content} />
      )}

      {/* Tab 4: Voice Simulation & Teleprompter */}
      {activeTab === 'voice' && (
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Voice Simulation & Recording Studio
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Listen to the pacing of your words or launch the fullscreen Teleprompter.
            </p>
          </div>

          <VoiceReader text={currentScript.content} />

          <div className="bg-gradient-to-br from-emerald-950 to-dark-900 border border-emerald-800/80 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                Recording Ready
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                Full-Screen Teleprompter Studio
              </h4>
              <p className="text-xs text-gray-300 mt-1 max-w-lg">
                Includes mirror mode for beam-splitter glass, speed regulator, custom font sizing, and spacebar pause.
              </p>
            </div>
            <button
              onClick={() => openTeleprompter(currentScript)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl text-xs font-extrabold shadow-lg transition whitespace-nowrap flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Teleprompter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

