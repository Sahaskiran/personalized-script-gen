import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FileUploader() {
  const { addFiles } = useApp();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-3">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
          isDragging 
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40' 
            : 'border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-gray-50/50 dark:hover:bg-dark-850/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-9 w-9 text-gray-400 dark:text-gray-500 mb-3" />
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Upload Reference Videos, Audio or Past Scripts
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Drag & drop MP4, MOV, MP3, WAV, TXT, MD or click to browse
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="video/*,audio/*,.txt,.md,.doc,.docx,.pdf"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

