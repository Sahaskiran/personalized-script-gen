import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderOpen, Search, Star, Trash2, Edit3, 
  Play, Download, Copy, Check, Clock, Filter, Plus, Flame, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScriptLibrary() {
  const { 
    savedScripts, 
    toggleFavorite, 
    deleteScript, 
    setCurrentScript, 
    openTeleprompter 
  } = useApp();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavOnly, setFilterFavOnly] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const filteredScripts = savedScripts.filter((s) => {
    const matchesSearch = s.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.influencerStyle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavOnly ? s.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleEdit = (script) => {
    setCurrentScript(script);
    navigate('/review');
  };

  const handleCopy = (script) => {
    navigator.clipboard.writeText(script.content);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (script) => {
    const blob = new Blob([script.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(script.topic || 'script').slice(0, 24).replace(/\s+/g, '_')}-v${script.version}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-brand-600" />
            Script Projects Library
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {savedScripts.length} projects saved locally • Ready for teleprompter and video recording
          </p>
        </div>

        <button
          onClick={() => navigate('/generate')}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Script
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved scripts by topic, keywords or influencer voice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setFilterFavOnly(!filterFavOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              filterFavOnly
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-850'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>Favorites Only</span>
          </button>
        </div>
      </div>

      {/* Scripts Grid */}
      {filteredScripts.length === 0 ? (
        <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-700" />
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            No scripts found
          </h3>
          <p className="text-xs text-gray-400 max-w-sm">
            {searchQuery ? 'Try clearing your search filters or create a new script.' : 'Generate your first video script to build your content library.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScripts.map((script) => {
            const wordCount = script.content.split(/\s+/).filter(Boolean).length;
            const estMinutes = Math.ceil(wordCount / 140);

            return (
              <div
                key={script.id}
                className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div>
                  {/* Top Badges & Favorite */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded">
                        v{script.version || 1}
                      </span>
                      <span className="text-[10px] font-medium bg-gray-100 dark:bg-dark-850 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                        {script.format || 'YouTube Video'}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFavorite(script.id)}
                      className="p-1 text-gray-400 hover:text-amber-500 transition"
                      title="Favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          script.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {script.topic || 'Untitled Script'}
                  </h3>

                  {/* Influencer Style Tag */}
                  {script.influencerStyle && (
                    <div className="flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 mt-1">
                      <Flame className="w-3 h-3" />
                      <span>{script.influencerStyle}</span>
                    </div>
                  )}

                  {/* Script Excerpt */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mt-2.5 leading-relaxed">
                    {script.content}
                  </p>
                </div>

                {/* Metrics & Action Footer */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{wordCount} words • ~{estMinutes} min</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Launch Teleprompter */}
                    <button
                      onClick={() => openTeleprompter(script)}
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg transition"
                      title="Open in Teleprompter Studio"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Edit / Review */}
                    <button
                      onClick={() => handleEdit(script)}
                      className="p-2 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 hover:bg-brand-100 rounded-lg transition"
                      title="Edit Script"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(script)}
                      className="p-2 bg-gray-100 dark:bg-dark-850 text-gray-600 dark:text-gray-400 hover:bg-gray-200 rounded-lg transition"
                      title="Copy full text"
                    >
                      {copiedId === script.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(script)}
                      className="p-2 bg-gray-100 dark:bg-dark-850 text-gray-600 dark:text-gray-400 hover:bg-gray-200 rounded-lg transition"
                      title="Download Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteScript(script.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
