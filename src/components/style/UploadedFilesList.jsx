import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Video, File, X } from 'lucide-react';

export default function UploadedFilesList() {
  const { uploadedFiles, removeFile } = useApp();

  const getFileIcon = (type) => {
    if (type.startsWith('video/')) return <Video className="w-5 h-5 text-indigo-500" />;
    if (type.includes('text') || type.includes('pdf')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Uploaded References</h3>
        {uploadedFiles.length > 0 && (
          <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full px-2.5 py-0.5 text-xs font-bold">
            {uploadedFiles.length} files
          </span>
        )}
      </div>

      {uploadedFiles.length === 0 ? (
        <div className="text-center py-6">
          <FileText className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-700 mb-2" />
          <p className="text-xs text-gray-400">No reference media uploaded yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {uploadedFiles.map((file) => (
            <li key={file.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center min-w-0 gap-3">
                {getFileIcon(file.type)}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">{file.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {formatSize(file.size)} • {getRelativeTime(file.addedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

