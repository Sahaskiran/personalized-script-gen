import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sliders, Sparkles } from 'lucide-react';

export default function VoiceReader({ text = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0); // 0.8 to 1.5
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const synthRef = useRef(window.speechSynthesis || null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        // Prefer natural English voices
        const filtered = available.filter((v) => v.lang.startsWith('en'));
        setVoices(filtered.length > 0 ? filtered : available);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window) || !text.trim()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-purple-900/10 dark:from-brand-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-xl p-4 border border-brand-200 dark:border-brand-800/60 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              Creator Voice Simulator
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-100 text-brand-700 dark:bg-brand-900/70 dark:text-brand-300 font-semibold">
                TTS
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Listen to your script rhythm, cadence, and spoken delivery
            </p>
          </div>
        </div>

        {/* Dynamic Sound Wave Animation */}
        {isPlaying && (
          <div className="flex items-center gap-1 h-6 px-2">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="w-1 bg-brand-500 dark:bg-brand-400 rounded-full wave-bar"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-100/60 dark:border-gray-800">
        {/* Play / Pause / Stop Buttons */}
        <div className="flex items-center gap-1.5">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen Script'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            className="p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition"
            title="Stop Speech"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-dark-900 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
          <span className="text-[11px] text-gray-400">Speed:</span>
          {[0.9, 1.0, 1.2, 1.4].map((s) => (
            <button
              key={s}
              onClick={() => {
                setRate(s);
                if (isPlaying) {
                  handleStop();
                }
              }}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                rate === s
                  ? 'bg-brand-500 text-white font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Voice Selector */}
        {voices.length > 0 && (
          <select
            value={selectedVoiceIndex}
            onChange={(e) => {
              setSelectedVoiceIndex(Number(e.target.value));
              if (isPlaying) handleStop();
            }}
            className="text-xs bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 max-w-[140px] truncate outline-none"
          >
            {voices.map((v, i) => (
              <option key={i} value={i}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
