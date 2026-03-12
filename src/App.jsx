import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import TemplatesPage from './pages/TemplatesPage';
import BuilderPage from './pages/BuilderPage';
import ResumePreviewPage from './pages/ResumePreviewPage';
import ATSScorePage from './pages/ATSScorePage';
import SkillAnalyticsPage from './pages/SkillAnalyticsPage';
import AIAssistantPage from './pages/AIAssistantPage';
// --- Portfolio pages (NEW) ---
import PortfolioTemplatesPage from './pages/PortfolioTemplatesPage';
import PortfolioCustomizerPage from './pages/PortfolioCustomizerPage';
import PortfolioPreviewPage from './pages/PortfolioPreviewPage';
import './styles/global.css';

function AppInner() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Resume flow */}
          <Route path="/templates" element={
            <ProtectedRoute><TemplatesPage /></ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute><BuilderPage /></ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute><ResumePreviewPage /></ProtectedRoute>
          } />
          <Route path="/ats-score" element={
            <ProtectedRoute><ATSScorePage /></ProtectedRoute>
          } />
          <Route path="/skill-analytics" element={
            <ProtectedRoute><SkillAnalyticsPage /></ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute><AIAssistantPage /></ProtectedRoute>
          } />

          {/* Portfolio flow (NEW) */}
          <Route path="/portfolio/templates" element={
            <ProtectedRoute><PortfolioTemplatesPage /></ProtectedRoute>
          } />
          <Route path="/portfolio/customize" element={
            <ProtectedRoute><PortfolioCustomizerPage /></ProtectedRoute>
          } />
          <Route path="/portfolio/preview" element={
            <ProtectedRoute><PortfolioPreviewPage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;