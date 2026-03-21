import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, portfolioAPI } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [resumeData, setResumeData] = useState({
    name: '', professionalTitle: '', email: '', phone: '', city: '',
    linkedin: '', github: '', website: '', summary: '', education: [],
    workExperience: [], skills: [], projects: [], certifications: [], additionalInfo: '',
  });

  const [selectedTemplate, setSelectedTemplate]   = useState(null);
  const [resumeStyle, setResumeStyle]             = useState({ color: '#7C3AED', font: 'Inter' });

  // ── targetRoles replaces jobDescription & targetRole ──────────
  // Stored as string[] to match what the backend and UI expect.
  const [targetRoles, setTargetRoles] = useState([]);

  const [selectedPortfolioTemplate, setSelectedPortfolioTemplate] = useState(null);
  const [portfolioStyle, setPortfolioStyle] = useState({
    primaryColor: '#7C3AED', accentColor: '#06B6D4', bgColor: '#0F172A',
    textColor: '#F8FAFC', font: 'Inter',
    sectionOrder: ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact'],
    pageOrder: ['Home', 'About', 'Projects', 'Skills', 'Contact'],
    layout: 'dark',
  });
  const [portfolioPublished, setPortfolioPublished] = useState(false);
  const [portfolioSlug, setPortfolioSlug]           = useState('');

  const [chatOpen, setChatOpen] = useState(false);

  // ─── On app start: restore session if token exists ──────────
  useEffect(() => {
    const token = localStorage.getItem('skillfolio_token');
    if (!token) { setAuthLoading(false); return; }

    authAPI.getMe()
      .then(data => {
        setUser(data.user);
        setIsLoggedIn(true);
        return portfolioAPI.get().catch(() => null);
      })
      .then(res => {
        if (res?.portfolio) _applyPortfolioToResume(res.portfolio);
      })
      .catch(() => localStorage.removeItem('skillfolio_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  // Map backend portfolio → resumeData + restore templateId & style
  const _applyPortfolioToResume = (p) => {
    if (!p) return;
    const info = p.personalInfo || {};
    setResumeData(prev => ({
      ...prev,
      name:              info.fullName    || prev.name,
      professionalTitle: info.title       || prev.professionalTitle,
      email:             info.email       || prev.email,
      phone:             info.phone       || prev.phone,
      city:              info.location    || prev.city,
      linkedin:          info.linkedin    || prev.linkedin,
      github:            info.github      || prev.github,
      website:           info.website     || prev.website,
      summary:           info.bio         || prev.summary,
      skills:            p.skills?.map(s => s.name) || prev.skills,
      workExperience:    p.experience?.map(e => ({
        title: e.role, company: e.company, location: '',
        duration: `${e.startDate || ''} – ${e.endDate || (e.current ? 'Present' : '')}`,
        description: e.description,
      })) || prev.workExperience,
      education: p.education?.map(e => ({
        degree: `${e.degree} ${e.field || ''}`.trim(),
        institution: e.institution, duration: `${e.startDate || ''} – ${e.endDate || ''}`, gpa: e.grade,
      })) || prev.education,
      projects: p.projects?.map(pr => ({
        name: pr.name, tech: Array.isArray(pr.tech) ? pr.tech.join(', ') : '',
        link: pr.liveUrl || pr.githubUrl, duration: '', description: pr.description,
      })) || prev.projects,
      certifications: p.certifications?.map(c => ({
        name: c.name, issuer: c.issuer, date: c.date, credentialId: c.url || '',
      })) || prev.certifications,
    }));

    // Restore targetRoles from saved portfolio if present
    if (Array.isArray(p.targetRoles) && p.targetRoles.length > 0) {
      setTargetRoles(p.targetRoles);
    }

    if (p.templateId) setSelectedPortfolioTemplate(p.templateId);
    if (p.style && Object.keys(p.style).length > 0) setPortfolioStyle(prev => ({ ...prev, ...p.style }));
    if (p.isPublished) { setPortfolioPublished(true); setPortfolioSlug(p.slug || ''); }
  };

  // Map resumeData → backend portfolio shape
  const _resumeToPortfolio = () => ({
    personalInfo: {
      fullName:  resumeData.name,
      title:     resumeData.professionalTitle,
      email:     resumeData.email,
      phone:     resumeData.phone,
      location:  resumeData.city,
      linkedin:  resumeData.linkedin,
      github:    resumeData.github,
      website:   resumeData.website,
      bio:       resumeData.summary,
    },
    skills: (resumeData.skills || []).map(s => ({ name: s, level: 70, category: 'Technical' })),
    experience: (resumeData.workExperience || []).map(e => ({
      role: e.title, company: e.company, description: e.description,
      startDate: '', endDate: '', current: (e.duration || '').includes('Present'),
    })),
    education: (resumeData.education || []).map(e => ({
      degree: e.degree, institution: e.institution, grade: e.gpa,
      startDate: '', endDate: '',
    })),
    projects: (resumeData.projects || []).map(p => ({
      name: p.name, description: p.description,
      tech: typeof p.tech === 'string' ? p.tech.split(',').map(t => t.trim()) : p.tech || [],
      liveUrl: p.link, githubUrl: p.link,
    })),
    certifications: (resumeData.certifications || []).map(c => ({
      name: c.name, issuer: c.issuer, date: c.date, url: c.credentialId,
    })),
  });

  // ─── AUTH ─────────────────────────────────────────────────────
  const login = async (email, password) => {
    setIsLoggedIn(true);
    setUser({ email });
  };

  const loginWithBackend = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('skillfolio_token', data.token);
    setUser(data.user);
    setIsLoggedIn(true);
    const res = await portfolioAPI.get().catch(() => null);
    if (res?.portfolio) _applyPortfolioToResume(res.portfolio);
    return data;
  };

  const registerWithBackend = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    localStorage.setItem('skillfolio_token', data.token);
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skillfolio_token');
    setIsLoggedIn(false);
    setUser(null);
    setTargetRoles([]);
    setPortfolioPublished(false);
    setPortfolioSlug('');
  };

  // ─── SAVE PORTFOLIO ───────────────────────────────────────────
  const savePortfolioToBackend = async () => {
    const token = localStorage.getItem('skillfolio_token');
    if (!token) return;

    const payload = {
      ..._resumeToPortfolio(),
      templateId:  selectedPortfolioTemplate,
      style:       portfolioStyle,
      // Persist targetRoles so they survive page refresh
      targetRoles,
    };

    await portfolioAPI.update(payload);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, login, loginWithBackend, registerWithBackend, logout, user,
      authLoading,
      resumeData, setResumeData,
      selectedTemplate, setSelectedTemplate,
      resumeStyle, setResumeStyle,

      // ── targetRoles (replaces jobDescription + targetRole) ──
      targetRoles, setTargetRoles,

      selectedPortfolioTemplate, setSelectedPortfolioTemplate,
      portfolioStyle, setPortfolioStyle,
      portfolioPublished, setPortfolioPublished,
      portfolioSlug, setPortfolioSlug,
      chatOpen, setChatOpen,
      savePortfolioToBackend,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};