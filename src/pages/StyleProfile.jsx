import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, UploadCloud, FileText, ChevronDown, ChevronUp, 
  Trash2, Wand2, Loader2, Check, ArrowRight, Layers 
} from 'lucide-react';

export default function StyleProfile() {
  const { 
    referenceScripts, 
    styleDNA, 
    removeReferenceScript, 
    addReferenceScript 
  } = useApp();

  const [inputMode, setInputMode] = useState('file'); // 'file' | 'paste'
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [rightTab, setRightTab] = useState('stylometrics'); // 'stylometrics' | 'chunks'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        addReferenceScript({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: event.target.result,
        });
      };
      reader.readAsText(file);
    }
  };

  const handlePasteSubmit = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;
    addReferenceScript({
      title: pasteTitle.trim(),
      content: pasteContent.trim(),
    });
    setPasteTitle('');
    setPasteContent('');
    setInputMode('file');
  };

  const handleAnalyzeStyle = () => {
    setIsAnalyzing(true);
    setAnalyzedSuccess(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 3000);
    }, 1200);
  };

  const totalChunks = referenceScripts.reduce((acc, s) => acc + (s.chunks?.length || 1), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Creator Style Profile & Stylometric DNA
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload past scripts to extract your syntactic fingerprint, pacing, and lexical preferences.
          </p>
        </div>

        <button
          onClick={handleAnalyzeStyle}
          disabled={isAnalyzing}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Analyzing Stylometrics...</span>
            </>
          ) : (
            <>
              <Wand2 size={14} />
              <span>{analyzedSuccess ? 'DNA Updated ✓' : 'Analyze My Style'}</span>
            </>
          )}
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Add Reference Script & List */}
        <div className="space-y-6">
          {/* Add Reference Script Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Add Reference Script</h2>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setInputMode('file')}
                  className={`px-3 py-1 rounded-md transition ${
                    inputMode === 'file' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-md transition ${
                    inputMode === 'paste' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === 'file' ? (
              <label className="border-2 border-dashed border-indigo-100 hover:border-indigo-300 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 block">
                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mb-1">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  Click to upload or drag & drop
                </h3>
                <p className="text-[11px] text-slate-400">
                  Supported formats: .txt, .pdf, .docx, .md
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.md,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Script Title (e.g. Why We Turned Down a $2M Seed)"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Paste script content or transcript here..."
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={!pasteTitle.trim() || !pasteContent.trim()}
                  className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Add Script to Corpus
                </button>
              </div>
            )}
          </div>

          {/* Uploaded Reference Scripts List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Uploaded Reference Scripts ({referenceScripts.length})
              </h2>
              <span className="text-[11px] font-semibold text-indigo-600">
                {totalChunks} vector chunks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2">
              Indexed for semantic vector search and stylometric extraction
            </p>

            <div className="divide-y divide-slate-100">
              {referenceScripts.map((script) => {
                const isExpanded = expandedId === script.id;

                return (
                  <div key={script.id} className="py-3 transition">
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : script.id)}
                        className="cursor-pointer flex-1 pr-2"
                      >
                        <h3 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1.5">
                          <span>{script.title}</span>
                          {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {script.words} words • {script.grade} • {script.hookType}
                        </p>
                      </div>

                      <button
                        onClick={() => removeReferenceScript(script.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete Reference"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-100 whitespace-pre-wrap font-sans">
                        {script.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Style DNA ($P$) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-5">
            {/* Top Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h2 className="text-sm font-bold text-slate-900">Extracted Style DNA ($P$)</h2>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setRightTab('stylometrics')}
                  className={`px-3 py-1 rounded-md transition ${
                    rightTab === 'stylometrics' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Stylometrics
                </button>
                <button
                  onClick={() => setRightTab('chunks')}
                  className={`px-3 py-1 rounded-md transition ${
                    rightTab === 'chunks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  RAG Chunks ({totalChunks})
                </button>
              </div>
            </div>

            {rightTab === 'stylometrics' ? (
              <div className="space-y-5">
                {/* Persona Voice Tone Banner */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      PERSONA VOICE TONE
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {styleDNA.readingLevel} ({styleDNA.audience})
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {styleDNA.persona}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {styleDNA.description}
                  </p>
                </div>

                {/* 4 Metric Cards (2x2) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Avg Sentence Length
                    </span>
                    <span className="text-base font-extrabold text-slate-900 block">
                      {styleDNA.metrics.avgSentenceLength} words
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold block">
                      {styleDNA.metrics.sentencePacingNote}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Reading Level
                    </span>
                    <span className="text-base font-extrabold text-slate-900 block">
                      {styleDNA.metrics.readingGrade}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold block">
                      {styleDNA.metrics.readingGradeNote}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Vocab Complexity
                    </span>
                    <span className="text-base font-extrabold text-slate-900 block">
                      {styleDNA.metrics.vocabComplexity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {styleDNA.metrics.vocabComplexityNote}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Lexical Diversity (TTR)
                    </span>
                    <span className="text-base font-extrabold text-slate-900 block">
                      {styleDNA.metrics.lexicalDiversity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {styleDNA.metrics.lexicalDiversityNote}
                    </span>
                  </div>
                </div>

                {/* Sentence Length Pacing Distribution */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Sentence Length Pacing Distribution
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Cadence Profile
                    </span>
                  </div>

                  <div className="space-y-2">
                    {styleDNA.pacingDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                          <span>{item.label}</span>
                          <span className="font-bold text-slate-900">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rhetorical Punctuation (per 100 words) */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Rhetorical Punctuation (per 100 words)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {styleDNA.punctuation.emDashes}
                      </span>
                      <span className="text-[10px] text-slate-400">Em Dashes</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {styleDNA.punctuation.questions}
                      </span>
                      <span className="text-[10px] text-slate-400">Questions</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {styleDNA.punctuation.commas}
                      </span>
                      <span className="text-[10px] text-slate-400">Commas</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {styleDNA.punctuation.ellipses}
                      </span>
                      <span className="text-[10px] text-slate-400">Ellipses</span>
                    </div>
                  </div>
                </div>

                {/* Hook Strategy & Conversational Signposts */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Hook Strategy & Conversational Signposts
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Opening Pattern: <span className="font-semibold text-slate-800">{styleDNA.hookStrategy.openingPattern}</span>
                  </p>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Detected Signature Phrases:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {styleDNA.hookStrategy.signaturePhrases.map((phrase, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* RAG Chunks View */
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Vector embeddings partitioned for fast semantic retrieval during script drafting:
                </p>
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {referenceScripts.flatMap((s) => s.chunks.map((chunk, cIdx) => (
                    <div key={`${s.id}-${cIdx}`} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 block">
                        Source: {s.title}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{chunk}"
                      </p>
                    </div>
                  )))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


