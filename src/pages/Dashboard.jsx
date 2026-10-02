import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, FileText, Layers, TrendingUp, 
  UploadCloud, Sparkles, RefreshCw, ArrowRight, Bot 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { savedScripts, setCurrentScript, activeCreator, creators } = useApp();

  const handleInspect = (script) => {
    setCurrentScript(script);
    navigate('/review');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Top Welcome Hero Banner */}
      <div className="bg-[#0b1120] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Bot size={15} />
            <span>AI Stylometric Engine & RAG Retrieval Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {activeCreator?.name || 'Sahas Kiran'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            StyleFlow has analyzed your past reference scripts. Your Style DNA is locked in, primed to generate new scripts matching your natural cadence and voice.
          </p>
        </div>

        <button
          onClick={() => navigate('/generate')}
          className="relative z-10 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 whitespace-nowrap self-start md:self-center cursor-pointer active:scale-95"
        >
          <Sparkles size={15} />
          <span>Generate New Script</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Style Profiles */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Style Profiles
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <SlidersHorizontal size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-gray-100">{creators?.length || 3}</span>
              <span className="text-xs text-slate-500 font-medium">active personas</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {activeCreator?.name} ({activeCreator?.role})
            </p>
          </div>
        </div>

        {/* Card 2: Scripts Generated */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Scripts Generated
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <FileText size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-gray-100">5</span>
              <span className="text-xs text-slate-500 font-medium">stored in SQLite</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>3 Agent Cooperating Pipeline</span>
            </p>
          </div>
        </div>

        {/* Card 3: Active References */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Active References
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Layers size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-gray-100">24</span>
              <span className="text-xs text-slate-500 font-medium">scripts chunked</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Indexed for vector similarity
            </p>
          </div>
        </div>

        {/* Card 4: Sample Voice Match */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-100 dark:border-gray-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Sample Voice Match
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-gray-100">94%</span>
              <span className="text-xs text-amber-600 font-bold">demo sample</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              N=1 demo script. For empirical study data, see <button onClick={() => navigate('/experiment')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Experiment Mode</button>.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Quick Actions & Recent Generation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (2 Cols): Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-100 dark:border-gray-800 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-gray-100">Quick Actions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Jump straight into common workflows</p>
          </div>

          <div className="space-y-3">
            {/* Action 1 */}
            <button
              onClick={() => navigate('/style-profile')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-dark-850 transition group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <UploadCloud size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-gray-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Upload References
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Add scripts to enrich your Style DNA
                  </span>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Action 2 */}
            <button
              onClick={() => navigate('/generate')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-dark-850 transition group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-gray-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Generate New Script
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Input topic & tone for instant 3 agent draft
                  </span>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Action 3 */}
            <button
              onClick={() => navigate('/review')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-dark-850 transition group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-gray-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Review Latest Script
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Inspect passage critiques and accept revisions
                  </span>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Right Column (3 Cols): Recent Script Generation Activity */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-100 dark:border-gray-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-gray-100">Recent Script Generation Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest scripts generated and evaluated by StyleFlow agents</p>
            </div>
            <button
              onClick={() => navigate('/generate')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
            >
              + New Script
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {savedScripts.map((script) => (
              <div
                key={script.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-dark-850 px-2 rounded-xl transition"
              >
                <div className="space-y-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-gray-100 truncate">
                      {script.topic}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      script.status === 'Accepted'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    }`}>
                      {script.status || 'Evaluated'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>🕒 {script.date || 'Sep 29'}</span>
                    <span>•</span>
                    <span>Style Match: {script.styleMatch || 94}%</span>
                  </p>
                </div>

                <button
                  onClick={() => handleInspect(script)}
                  className="text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 shrink-0 transition cursor-pointer"
                >
                  <span>Inspect</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
