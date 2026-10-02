import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, Pause, RotateCcw, FlipVertical, Type, FastForward, 
  X, Maximize2, Minimize2, Eye, Sparkles, Volume2 
} from 'lucide-react';

export default function TeleprompterModal() {
  const { teleprompterScript, closeTeleprompter } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3); // 1-10
  const [fontSize, setFontSize] = useState(36); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const containerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  if (!teleprompterScript) return null;

  const content = teleprompterScript.content || '';
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const estimatedWpm = elapsedSeconds > 0 ? Math.round((wordCount / (elapsedSeconds / 60))) : 0;

  // Spacebar toggle play/pause & ESC close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'Escape') {
        closeTeleprompter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeTeleprompter]);

  // Handle countdown before playback
  const handlePlayToggle = () => {
    if (!isPlaying) {
      setCountdown(3);
      const countTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countTimer);
            setIsPlaying(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsPlaying(false);
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (isPlaying && containerRef.current) {
      const scrollStep = () => {
        if (containerRef.current) {
          containerRef.current.scrollTop += speed * 0.75;
        }
      };
      scrollIntervalRef.current = setInterval(scrollStep, 30);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(scrollIntervalRef.current);
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      clearInterval(scrollIntervalRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Header / Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
              Teleprompter Studio
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-900/60 text-brand-300 border border-brand-700">
                {teleprompterScript.influencerStyle || 'Pro Mode'}
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              {wordCount} words • Est. duration: ~{Math.ceil(wordCount / 140)} min
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="hidden sm:flex items-center gap-6 text-xs text-gray-300 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
          <div>
            <span className="text-gray-500 block">RECORD TIME</span>
            <span className="font-mono text-sm font-bold text-amber-400">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="h-6 w-px bg-gray-800"></div>
          <div>
            <span className="text-gray-500 block">SCROLL SPEED</span>
            <span className="font-bold text-emerald-400">{speed}x</span>
          </div>
          <div className="h-6 w-px bg-gray-800"></div>
          <div>
            <span className="text-gray-500 block">CURRENT PACE</span>
            <span className="font-bold text-brand-400">{estimatedWpm > 0 ? `${estimatedWpm} WPM` : '~140 WPM'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={closeTeleprompter}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-red-900/40 rounded-lg transition"
            title="Close (ESC)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Teleprompter Area */}
      <div className="relative flex-1 overflow-hidden flex flex-col justify-center">
        {/* Visual Focus Eye-line Guide */}
        <div className="absolute top-1/3 left-0 right-0 h-28 pointer-events-none border-y-2 border-brand-500/25 bg-brand-500/5 flex items-center justify-between px-4 z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400/80 bg-brand-950/80 px-2 py-0.5 rounded border border-brand-800">
            👁️ Eye Focus Zone
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400/80 bg-brand-950/80 px-2 py-0.5 rounded border border-brand-800">
            [Space] to pause
          </span>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <div className="text-8xl font-black text-brand-400 animate-bounce">
              {countdown}
            </div>
          </div>
        )}

        {/* Scrolling Script Text */}
        <div
          ref={containerRef}
          className={`h-full overflow-y-auto px-8 sm:px-24 md:px-44 lg:px-64 py-40 select-none scroll-smooth ${
            isMirrored ? 'teleprompter-mirrored' : ''
          }`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        >
          <div className="font-semibold text-gray-100 tracking-wide text-center space-y-8">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="transition-colors hover:text-brand-300">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="h-96 flex items-center justify-center text-gray-500 text-sm font-medium">
            — End of Script —
          </div>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="bg-gray-950 border-t border-gray-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayToggle}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'Pause' : 'Start Scroll'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl transition"
            title="Reset to Top"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
          <FastForward size={16} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Speed:</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-brand-500"
          />
          <span className="text-xs font-bold text-gray-200 min-w-4">{speed}x</span>
        </div>

        {/* Font Size Slider */}
        <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
          <Type size={16} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Size:</span>
          <input
            type="range"
            min="22"
            max="64"
            step="2"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24 accent-brand-500"
          />
          <span className="text-xs font-bold text-gray-200 min-w-8">{fontSize}px</span>
        </div>

        {/* Mirror Mode Toggle */}
        <button
          onClick={() => setIsMirrored((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
            isMirrored
              ? 'bg-brand-900/60 border-brand-500 text-brand-300'
              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
          }`}
          title="Flip vertically for beam-splitter prompter glass"
        >
          <FlipVertical size={16} />
          <span>Mirror Mode</span>
        </button>
      </div>
    </div>
  );
}
