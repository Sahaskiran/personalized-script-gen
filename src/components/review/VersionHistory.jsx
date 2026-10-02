import React from 'react';
import { History, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VersionHistory() {
  const { currentScript, scriptVersions, setCurrentScript } = useApp();

  const handleRestore = (script) => {
    setCurrentScript(script);
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-brand-600" />
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Version History</h2>
      </div>

      {!scriptVersions || scriptVersions.length <= 1 ? (
        <p className="text-gray-400 text-xs text-center py-4">No previous revisions yet</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          {scriptVersions.map((version) => {
            const isCurrent = currentScript?.id === version.id;
            
            return (
              <div 
                key={version.id} 
                className={`p-3.5 flex flex-col gap-1.5 transition ${
                  isCurrent ? 'bg-brand-50/50 dark:bg-brand-950/40' : 'bg-white dark:bg-dark-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">v{version.version}</span>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-brand-500 text-white px-1.5 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(version.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {version.feedback && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                    "{version.feedback}"
                  </p>
                )}
                
                {!isCurrent && (
                  <button
                    onClick={() => handleRestore(version)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline self-start mt-1 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore this version</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

