import React, { useState } from 'react';
import { Wand2, SmilePlus, AlignLeft, Laugh, Briefcase, Loader2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FeedbackPanel() {
  const { regenerateWithFeedback } = useApp();
  const [selectedChips, setSelectedChips] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState('');

  const chips = [
    { id: 'punchy', label: 'More punchy & fast', icon: Zap },
    { id: 'casual', label: 'More casual & slang', icon: SmilePlus },
    { id: 'shorter', label: 'Shorter cuts', icon: AlignLeft },
    { id: 'humor', label: 'Add creator banter', icon: Laugh },
    { id: 'authoritative', label: 'High authority / data', icon: Briefcase },
  ];

  const toggleChip = (id) => {
    setSelectedChips(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleRegenerate = async () => {
    if (selectedChips.length === 0 && !feedbackText.trim()) return;
    
    setIsRegenerating(true);
    setError('');
    const selectedLabels = chips.filter(c => selectedChips.includes(c.id)).map(c => c.label);
    let combinedFeedback = '';
    
    if (selectedLabels.length > 0) {
      combinedFeedback += `Make it: ${selectedLabels.join(', ')}. `;
    }
    if (feedbackText.trim()) {
      combinedFeedback += feedbackText.trim();
    }
    
    try {
      await regenerateWithFeedback(combinedFeedback);
      setSelectedChips([]);
      setFeedbackText('');
    } catch (err) {
      setError(err.message || 'Failed to regenerate. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const isBtnDisabled = selectedChips.length === 0 && !feedbackText.trim();

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-brand-600" />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">AI Quick Polishing</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {chips.map(({ id, label, icon: Icon }) => {
          const isSelected = selectedChips.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleChip(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isSelected 
                  ? 'bg-brand-500 text-white shadow-xs' 
                  : 'bg-gray-100 dark:bg-dark-850 text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <textarea
          rows={3}
          placeholder="Custom refinement instructions (e.g. 'Add a stronger debate question in the CTA')..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-gray-100 transition"
        />
      </div>

      <button
        onClick={handleRegenerate}
        disabled={isBtnDisabled || isRegenerating}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
      >
        {isRegenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Polishing Script...</span>
          </>
        ) : (
          'Apply AI Polish & Update'
        )}
      </button>
    </div>
  );
}

