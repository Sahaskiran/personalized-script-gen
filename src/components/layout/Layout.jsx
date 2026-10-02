import React from 'react';
import Sidebar from './Sidebar';
import TeleprompterModal from '../teleprompter/TeleprompterModal';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-950 transition-colors">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto ml-64 p-6 lg:p-8">
        {children}
      </main>
      <TeleprompterModal />
    </div>
  );
};

export default Layout;

