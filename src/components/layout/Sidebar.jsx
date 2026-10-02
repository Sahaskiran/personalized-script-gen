import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, SquarePen, Wand2,
  ChevronDown, ChevronUp, Check, Plus, FlaskConical, UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { creators, activeCreator, setActiveCreator, addTeammateProfile } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeammateName, setNewTeammateName] = useState('');
  const [newTeammateRole, setNewTeammateRole] = useState('');

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Wand2, label: 'Style Profile', path: '/style-profile' },
    { icon: Sparkles, label: 'Generate Script', path: '/generate' },
    { icon: SquarePen, label: 'Review & Refine', path: '/review' },
    { icon: FlaskConical, label: 'Experiment Mode', path: '/experiment' },
  ];

  const handleAddTeammate = (e) => {
    e.preventDefault();
    if (newTeammateName.trim() && newTeammateRole.trim()) {
      addTeammateProfile(newTeammateName.trim(), newTeammateRole.trim());
      setNewTeammateName('');
      setNewTeammateRole('');
      setShowAddModal(false);
      setDropdownOpen(false);
    }
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-dark-900 border-r border-slate-100 dark:border-gray-800 flex flex-col p-4 fixed left-0 top-0 z-30 font-sans select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
          <Sparkles size={20} className="fill-current" />
        </div>
        <div>
          <span className="font-extrabold text-base text-slate-900 dark:text-gray-100 tracking-tight block leading-tight">
            StyleFlow
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Creator Voice Engine
          </span>
        </div>
      </div>

      {/* Active Creator Dropdown Card */}
      <div className="relative mx-0.5 mb-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full p-2 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/70 dark:bg-dark-850 hover:bg-slate-100/60 dark:hover:bg-dark-800 transition flex items-center justify-between text-left cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800 flex-shrink-0">
              {activeCreator?.initials || 'SK'}
            </div>
            <div className="truncate">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">
                Active Creator
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-gray-100 truncate block mt-0.5">
                {activeCreator?.name || 'Sahas Kiran'}
              </span>
            </div>
          </div>
          {dropdownOpen ? (
            <ChevronUp size={14} className="text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
          )}
        </button>

        {/* Expanded Creator Switcher Dropdown */}
        {dropdownOpen && (
          <div className="mt-2 p-2 bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-lg space-y-1 z-40 animate-in fade-in duration-150">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Switch Creator ({creators.length})
              </span>
            </div>

            {creators.map((c) => {
              const isSelected = activeCreator?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCreator(c);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition text-xs ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-indigo-100/70 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      {c.initials}
                    </div>
                    <div className="truncate">
                      <p className="truncate leading-tight font-bold">{c.name}</p>
                      <p className="text-[10px] text-slate-400 truncate leading-tight">{c.subtitle}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                </button>
              );
            })}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-1 pt-1.5 border-t border-slate-100 dark:border-gray-800 flex items-center justify-center gap-1.5 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 rounded-lg text-xs font-bold transition"
            >
              <Plus size={13} />
              <span>Add Teammate Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Label */}
      <div className="px-2 mb-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Navigation
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold ${
                isActive
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs border border-indigo-100 dark:border-indigo-800'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-dark-850 hover:text-slate-900 dark:hover:text-gray-100'
              }`
            }
          >
            <item.icon size={17} className="text-current" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* LLM Engine Status Indicator */}
      <div className="mx-0.5 mb-3 p-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/80 dark:bg-dark-850">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-800 dark:text-gray-200">LLM Engine</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-gray-400 leading-tight">
          Gemini 3.8 Flash active via environment
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center gap-2.5 px-1">
        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800 flex-shrink-0">
          {activeCreator?.initials || 'SK'}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900 dark:text-gray-100 truncate">
            {activeCreator?.name || 'Sahas Kiran'}
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            {activeCreator?.bio || 'Fast-paced, punchy tech essays'}
          </span>
        </div>
      </div>

      {/* Add Teammate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100 flex items-center gap-1.5">
                <UserPlus size={16} className="text-indigo-600" />
                Add Teammate Voice Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTeammate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Creator Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={newTeammateName}
                  onChange={(e) => setNewTeammateName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Style Persona & Focus
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punchy B2B Marketing Teardowns"
                  value={newTeammateRole}
                  onChange={(e) => setNewTeammateRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
