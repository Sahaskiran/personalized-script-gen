import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Film, Video, Sparkles, Music, Clapperboard, Copy, Check, Loader2 } from 'lucide-react';

export default function StoryboardView({ scriptContent = '' }) {
  const { generateStoryboard } = useApp();
  const [scenes, setScenes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerateStoryboard = async () => {
    if (!scriptContent.trim()) return;
    setIsLoading(true);
    try {
      const generated = await generateStoryboard(scriptContent);
      setScenes(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyScene = (scene, index) => {
    const text = `Scene ${scene.sceneNumber}: ${scene.title} [${scene.timecode}]\nDialogue: ${scene.dialogue}\nVisual: ${scene.visualCue}\nB-Roll: ${scene.bRoll}\nSFX/Audio: ${scene.sfx}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Visual Storyboard & B-Roll Director
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI camera shots, on-screen text, B-roll recommendations & sound effects breakdown
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateStoryboard}
          disabled={isLoading || !scriptContent.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Directing Scenes...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {scenes ? 'Regenerate Storyboard' : 'Generate Visual Storyboard'}
            </>
          )}
        </button>
      </div>

      {!scenes && !isLoading && (
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3">
          <Film className="w-12 h-12 text-gray-300 dark:text-gray-700" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ready to convert script into production shots
          </p>
          <p className="text-xs text-gray-400 max-w-sm">
            Click "Generate Visual Storyboard" to get timeline cuts, camera angles, kinetic text overlays, and B-roll cues.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 dark:bg-dark-850 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {scenes && !isLoading && (
        <div className="space-y-4">
          {scenes.map((scene, idx) => (
            <div
              key={idx}
              className="bg-gray-50/70 dark:bg-dark-850/80 rounded-xl p-4 border border-gray-200/80 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
            >
              {/* Scene Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded-md">
                    Scene #{scene.sceneNumber || idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-900 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    ⏱️ {scene.timecode || '0:00'}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {scene.title}
                  </h4>
                </div>

                <button
                  onClick={() => copyScene(scene, idx)}
                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                  title="Copy Scene Plan"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Spoken Dialogue Line */}
              {scene.dialogue && (
                <div className="mb-3 bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 italic">
                  "{scene.dialogue}"
                </div>
              )}

              {/* Grid: Visual Cues, B-Roll, SFX */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                {/* Visual Cue */}
                <div className="bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Video className="w-3.5 h-3.5" />
                    <span>Camera / Visual Cue</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                    {scene.visualCue}
                  </p>
                </div>

                {/* B-Roll */}
                <div className="bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>B-Roll Asset</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                    {scene.bRoll}
                  </p>
                </div>

                {/* Audio / SFX */}
                <div className="bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400 mb-1">
                    <Music className="w-3.5 h-3.5" />
                    <span>Audio & SFX</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                    {scene.sfx}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
