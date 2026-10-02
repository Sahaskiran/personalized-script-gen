import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StyleProfile from './pages/StyleProfile';
import GenerateScript from './pages/GenerateScript';
import ReviewRefine from './pages/ReviewRefine';
import ToolsLab from './pages/ToolsLab';
import ScriptLibrary from './pages/ScriptLibrary';
import ExperimentMode from './pages/ExperimentMode';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/style-profile" element={<StyleProfile />} />
        <Route path="/generate" element={<GenerateScript />} />
        <Route path="/review" element={<ReviewRefine />} />
        <Route path="/experiment" element={<ExperimentMode />} />
        <Route path="/tools" element={<ToolsLab />} />
        <Route path="/library" element={<ScriptLibrary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
