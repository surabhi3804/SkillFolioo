import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TemplatesPage from './pages/TemplatesPage';
import BuilderPage from './pages/BuilderPage';
import ResumePreviewPage from './pages/ResumePreviewPage';
import ATSScorePage from './pages/ATSScorePage';
import SkillAnalyticsPage from './pages/SkillAnalyticsPage';
import ChatbotPage from './pages/chatbot';
import PortfolioTemplatesPage from './pages/PortfolioTemplatesPage';
import PortfolioCustomizerPage from './pages/PortfolioCustomizerPage';
import PortfolioPreviewPage from './pages/PortfolioPreviewPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import './styles/global.css';

/* ─── Inner app layout (with Navbar + ChatBot) ────────────────── */
function AppInner() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/"                element={<HomePage />} />
          <Route path="/signin"          element={<SignInPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Resume flow */}
          <Route path="/templates"       element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
          <Route path="/builder"         element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          <Route path="/preview"         element={<ProtectedRoute><ResumePreviewPage /></ProtectedRoute>} />
          <Route path="/ats-score"       element={<ProtectedRoute><ATSScorePage /></ProtectedRoute>} />
          <Route path="/skill-analytics" element={<ProtectedRoute><SkillAnalyticsPage /></ProtectedRoute>} />
          <Route path="/chatbot"         element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

          {/* Resume Analyser — ATS + Skill Analytics in one place */}
          <Route path="/resume/analyse"  element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />

          {/* Portfolio flow */}
          <Route path="/portfolio/templates" element={<ProtectedRoute><PortfolioTemplatesPage /></ProtectedRoute>} />
          <Route path="/portfolio/customize" element={<ProtectedRoute><PortfolioCustomizerPage /></ProtectedRoute>} />
          <Route path="/portfolio/preview"   element={<ProtectedRoute><PortfolioPreviewPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatBot />
    </div>
  );
}

/* ─── Root App — /p/:slug MUST be before /* ─────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public portfolio — no Navbar, no ChatBot, no auth */}
          <Route path="/p/:slug" element={<PublicPortfolioPage />} />

          {/* Everything else gets the full app shell */}
          <Route path="/*" element={<AppInner />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;