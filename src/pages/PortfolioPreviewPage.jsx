import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PORTFOLIO_TEMPLATES } from '../data/staticData';
import {
  Globe, ArrowLeft, ExternalLink, Edit3, Check,
  Github, Linkedin, Mail, MapPin, Phone, Monitor, Copy
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import './PortfolioPreviewPage.css';

/* ══════════════════════════════════════════════════════════════
   1. MIDNIGHT DEV
══════════════════════════════════════════════════════════════ */
const MidnightDev = ({ data, style, pages }) => {
  const { primaryColor, accentColor } = style;
  const [cursor, setCursor] = useState(true);
  useEffect(() => { const t = setInterval(() => setCursor(c => !c), 530); return () => clearInterval(t); }, []);

  return (
    <div style={{ background: '#0A0A0F', color: '#F8FAFC', fontFamily: 'Inter, sans-serif', minHeight: '100%' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <span style={{ background: `linear-gradient(90deg,${primaryColor},#EC4899)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: 18 }}>{data.name?.split(' ')[0] || 'Portfolio'}</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(248,250,252,0.45)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{p}</a>)}
        </div>
      </nav>

      <section style={{ padding: '80px 40px 60px', maxWidth: 860, margin: '0 auto' }}>
        <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: 14, marginBottom: 10, letterSpacing: 1 }}>Hi, I'm</p>
        <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.05, marginBottom: 14, background: `linear-gradient(90deg,#fff 30%,${primaryColor},#EC4899)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{data.name || 'Your Name'}</h1>
        <div style={{ fontSize: 22, color: accentColor, fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 3 }}>
          {data.professionalTitle || 'Your Title'}
          <span style={{ display: 'inline-block', width: 2, height: 26, background: primaryColor, marginLeft: 4, opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }} />
        </div>
        {data.summary && <p style={{ fontSize: 15, color: 'rgba(248,250,252,0.5)', maxWidth: 580, lineHeight: 1.75, marginBottom: 30 }}>{data.summary}</p>}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {data.github && <a href={`https://github.com/${data.github}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F8FAFC', textDecoration: 'none', fontSize: 14 }}><Github size={15}/> GitHub</a>}
          {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F8FAFC', textDecoration: 'none', fontSize: 14 }}><Linkedin size={15}/> LinkedIn</a>}
          {data.email && <a href={`mailto:${data.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: primaryColor, borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}><Mail size={15}/> Contact Me</a>}
        </div>
      </section>

      {(data.skills||[]).length > 0 && (
        <section style={{ padding: '40px 40px', borderTop: '1px solid rgba(124,58,237,0.12)', borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(124,58,237,0.04)' }}>
          <p style={{ textAlign: 'center', color: primaryColor, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Skills & Expertise</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {data.skills.map(s => <span key={s} style={{ padding: '7px 18px', background: `${primaryColor}18`, border: `1px solid ${primaryColor}45`, borderRadius: 20, color: '#a78bfa', fontSize: 13, fontWeight: 500 }}>{s}</span>)}
          </div>
        </section>
      )}

      {(data.workExperience||[]).length > 0 && (
        <section style={{ padding: '70px 40px', maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Work Experience</h2>
          <div style={{ width: 40, height: 3, background: primaryColor, borderRadius: 2, margin: '0 auto 40px' }} />
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ display: 'flex', gap: 22, paddingBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 12px ${primaryColor}90`, flexShrink: 0 }} />
                {i < data.workExperience.length - 1 && <div style={{ width: 2, flex: 1, background: `${primaryColor}25`, marginTop: 6, minHeight: 20 }} />}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '18px 22px', flex: 1, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div><h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 17, margin: 0 }}>{exp.title}</h3><p style={{ color: accentColor, fontSize: 14, margin: '3px 0 0', fontWeight: 500 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p></div>
                  {exp.duration && <span style={{ padding: '4px 12px', background: `${accentColor}18`, border: `1px solid ${accentColor}40`, borderRadius: 20, color: accentColor, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{exp.duration}</span>}
                </div>
                {exp.description && <p style={{ color: 'rgba(248,250,252,0.55)', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {(data.projects||[]).length > 0 && (
        <section style={{ padding: '70px 40px', background: 'rgba(124,58,237,0.03)', maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Projects</h2>
          <div style={{ width: 40, height: 3, background: primaryColor, borderRadius: 2, margin: '0 auto 40px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 18 }}>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderTop: `3px solid ${primaryColor}`, borderRadius: 14, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 16, margin: 0 }}>{proj.name}</h3>{proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: accentColor }}><ExternalLink size={16}/></a>}</div>
                {proj.tech && <p style={{ color: primaryColor, fontSize: 13, margin: '0 0 8px' }}>🛠 {proj.tech}</p>}
                {proj.description && <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: '70px 40px', maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: (data.education||[]).length ? '1fr 1fr' : '1fr', gap: 40 }}>
        {(data.education||[]).length > 0 && <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Education</h2>
          <div style={{ width: 30, height: 3, background: primaryColor, borderRadius: 2, marginBottom: 24 }} />
          {data.education.map((edu, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.18)', borderLeft: `4px solid ${primaryColor}`, borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
            <h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>{edu.degree}</h3>
            <p style={{ color: accentColor, fontSize: 13, margin: '0 0 4px' }}>{edu.institution}</p>
            {edu.duration && <span style={{ color: 'rgba(248,250,252,0.4)', fontSize: 12 }}>{edu.duration}</span>}
            {edu.gpa && <span style={{ color: primaryColor, fontSize: 12, fontWeight: 600, marginLeft: 10 }}>GPA: {edu.gpa}</span>}
          </div>)}
        </div>}
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Get In Touch</h2>
          <div style={{ width: 30, height: 3, background: primaryColor, borderRadius: 2, marginBottom: 24 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.email && <a href={`mailto:${data.email}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12, color: '#F8FAFC', textDecoration: 'none' }}><Mail size={18} style={{ color: primaryColor }}/><span>{data.email}</span></a>}
            {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12, color: '#F8FAFC', textDecoration: 'none' }}><Linkedin size={18} style={{ color: accentColor }}/><span>{data.linkedin}</span></a>}
            {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12 }}><Phone size={18} style={{ color: primaryColor }}/><span style={{ color: '#F8FAFC' }}>{data.phone}</span></div>}
          </div>
        </div>
      </section>
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(124,58,237,0.12)', color: 'rgba(248,250,252,0.25)', fontSize: 13 }}>Built with SkillFolio · {data.name || 'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   2. CLEAN LIGHT
══════════════════════════════════════════════════════════════ */
const CleanLight = ({ data, style, pages }) => {
  const { primaryColor, accentColor } = style;
  const skillIcons = ['⚡','🛠','🗄','🎨','📱','☁️','🔐','📊'];
  return (
    <div style={{ background: '#fff', color: '#1E293B', fontFamily: 'Inter, sans-serif', minHeight: '100%' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E2E8F0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <span style={{ color: primaryColor, fontWeight: 800, fontSize: 20 }}>{data.name?.split(' ')[0] || 'Portfolio'}</span>
        <div style={{ display: 'flex', gap: 28 }}>{pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: '#64748B', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{p}</a>)}</div>
      </nav>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 500, maxWidth: 960, margin: '0 auto', padding: '0 40px', alignItems: 'center', gap: 48 }}>
        <div>
          <p style={{ color: primaryColor, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 14 }}>Hello, I'm</p>
          <h1 style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.05, color: '#0F172A', marginBottom: 12, letterSpacing: -1 }}>{data.name || 'Your Name'}</h1>
          <h2 style={{ fontSize: 22, color: primaryColor, fontWeight: 600, marginBottom: 18 }}>{data.professionalTitle || 'Your Title'}</h2>
          {data.summary && <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, marginBottom: 30, maxWidth: 460 }}>{data.summary}</p>}
          <div style={{ display: 'flex', gap: 14 }}>
            <a href={data.email ? `mailto:${data.email}` : '#'} style={{ padding: '13px 26px', background: primaryColor, color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>Get In Touch</a>
            <a href={data.github ? `https://github.com/${data.github}` : '#'} target="_blank" rel="noreferrer" style={{ padding: '13px 26px', border: `2px solid ${primaryColor}`, color: primaryColor, borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>View Work</a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${primaryColor}12,${accentColor}12)`, borderRadius: 24, height: 380 }}>
          <div style={{ width: 170, height: 170, borderRadius: '50%', background: `linear-gradient(135deg,${primaryColor},${accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 68, color: '#fff', fontWeight: 900, border: '6px solid #fff', boxShadow: `0 12px 40px ${primaryColor}35` }}>
            {data.name ? data.name[0].toUpperCase() : 'Y'}
          </div>
        </div>
      </section>
      {(data.skills||[]).length > 0 && (
        <section style={{ padding: '70px 40px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Skills & Expertise</h2>
            <div style={{ width: 40, height: 3, background: primaryColor, borderRadius: 2, margin: '0 auto 40px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
              {data.skills.map((s, i) => (
                <div key={s} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{skillIcons[i % skillIcons.length]}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', textAlign: 'center' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {(data.workExperience||[]).length > 0 && (
        <section style={{ padding: '70px 40px', maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Work Experience</h2>
          <div style={{ width: 40, height: 3, background: primaryColor, borderRadius: 2, margin: '0 auto 40px' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: `${primaryColor}20` }} />
            {data.workExperience.map((exp, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${primaryColor}15`, border: `2px solid ${primaryColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, fontSize: 20 }}>💼</div>
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 24px', flex: 1, boxShadow: '0 3px 14px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div><h3 style={{ color: '#0F172A', fontWeight: 700, fontSize: 17, margin: 0 }}>{exp.title}</h3><p style={{ color: primaryColor, fontSize: 14, margin: '3px 0 0', fontWeight: 500 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p></div>
                    {exp.duration && <span style={{ padding: '4px 12px', background: `${primaryColor}10`, border: `1px solid ${primaryColor}25`, borderRadius: 20, color: primaryColor, fontSize: 12, fontWeight: 500 }}>{exp.duration}</span>}
                  </div>
                  {exp.description && <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {(data.projects||[]).length > 0 && (
        <section style={{ padding: '70px 40px', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Projects</h2>
            <div style={{ width: 40, height: 3, background: primaryColor, borderRadius: 2, margin: '0 auto 40px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderTop: `3px solid ${i % 2 === 0 ? primaryColor : accentColor}`, borderRadius: 16, padding: '22px', boxShadow: '0 3px 14px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><h3 style={{ color: '#0F172A', fontWeight: 700, fontSize: 16, margin: 0 }}>{proj.name}</h3>{proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: accentColor }}><ExternalLink size={16}/></a>}</div>
                  {proj.tech && <p style={{ color: primaryColor, fontSize: 13, margin: '0 0 8px', fontWeight: 500 }}>🛠 {proj.tech}</p>}
                  {proj.description && <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #E2E8F0', color: '#94A3B8', fontSize: 13 }}>Built with SkillFolio · {data.name || 'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   3. CREATIVE GRADIENT
══════════════════════════════════════════════════════════════ */
const CreativeGradient = ({ data, style, pages }) => {
  const { primaryColor, accentColor, bgColor } = style;
  return (
    <div style={{ background: bgColor || '#0D0221', color: '#F8FAFC', fontFamily: 'Inter, sans-serif', minHeight: '100%', overflow: 'hidden' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,2,33,0.8)', backdropFilter: 'blur(12px)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg,${primaryColor},${accentColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>{data.name ? data.name[0] : 'P'}</div>
        <div style={{ display: 'flex', gap: 24 }}>{pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, textDecoration: 'none' }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding: '70px 40px 50px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${primaryColor}30 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <p style={{ color: accentColor, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>✦ Creative Developer</p>
        <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, marginBottom: 18, position: 'relative' }}>
          <span style={{ color: '#fff', display: 'block' }}>Making</span>
          <span style={{ background: `linear-gradient(90deg,${primaryColor},${accentColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>{data.name || 'Digital Art'}</span>
        </h1>
        {data.professionalTitle && <div style={{ display: 'inline-block', padding: '8px 20px', border: `1px solid ${primaryColor}60`, borderRadius: 30, color: primaryColor, fontSize: 15, fontWeight: 500, marginBottom: 18 }}>{data.professionalTitle}</div>}
        {data.summary && <p style={{ fontSize: 15, color: 'rgba(248,250,252,0.5)', maxWidth: 520, lineHeight: 1.75, marginBottom: 30 }}>{data.summary}</p>}
        <div style={{ display: 'flex', gap: 14 }}>
          <a href={data.email ? `mailto:${data.email}` : '#'} style={{ padding: '13px 28px', background: `linear-gradient(90deg,${primaryColor},${accentColor})`, color: '#fff', borderRadius: 30, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>✦ See My Work</a>
          {data.github && <a href={`https://github.com/${data.github}`} target="_blank" rel="noreferrer" style={{ padding: '13px 24px', border: `1px solid ${primaryColor}50`, borderRadius: 30, color: '#F8FAFC', textDecoration: 'none', fontSize: 15 }}>GitHub</a>}
        </div>
      </section>
      {(data.skills||[]).length > 0 && (
        <section style={{ padding: '32px 40px', background: `${primaryColor}12`, borderTop: `1px solid ${primaryColor}20`, borderBottom: `1px solid ${primaryColor}20` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: accentColor, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginRight: 8 }}>Stack</span>
            {data.skills.map((s, i) => (
              <span key={s} style={{ padding: '6px 16px', background: i % 2 === 0 ? `${primaryColor}25` : `${accentColor}20`, border: `1px solid ${i % 2 === 0 ? primaryColor : accentColor}40`, borderRadius: 20, color: i % 2 === 0 ? primaryColor : accentColor, fontSize: 13 }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {(data.workExperience||[]).length > 0 && (
        <section style={{ padding: '70px 40px', maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 40 }}>Experience<span style={{ color: primaryColor }}>.</span></h2>
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: `${primaryColor}30`, lineHeight: 1, flexShrink: 0, width: 48 }}>0{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div><h3 style={{ fontSize: 19, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>{exp.title}</h3><p style={{ color: primaryColor, fontSize: 14, margin: '4px 0 0' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p></div>
                  {exp.duration && <span style={{ color: 'rgba(248,250,252,0.4)', fontSize: 13 }}>{exp.duration}</span>}
                </div>
                {exp.description && <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}
      {(data.projects||[]).length > 0 && (
        <section style={{ padding: '70px 40px', maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 40 }}>Projects<span style={{ color: accentColor }}>.</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ background: `linear-gradient(135deg,${primaryColor}10,${accentColor}08)`, border: `1px solid ${i%2===0?primaryColor:accentColor}30`, borderRadius: 18, padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 17, margin: 0 }}>{proj.name}</h3>{proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: accentColor }}><ExternalLink size={16}/></a>}</div>
                {proj.tech && <p style={{ color: i%2===0?primaryColor:accentColor, fontSize: 13, margin: '0 0 10px' }}>🛠 {proj.tech}</p>}
                {proj.description && <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: `linear-gradient(135deg,${primaryColor}15,${accentColor}10)` }}>
        {data.email && <a href={`mailto:${data.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 32px', background: `linear-gradient(90deg,${primaryColor},${accentColor})`, color: '#fff', borderRadius: 30, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}><Mail size={18}/> {data.email}</a>}
      </section>
      <footer style={{ textAlign: 'center', padding: '20px', color: 'rgba(248,250,252,0.2)', fontSize: 13 }}>Built with SkillFolio · {data.name || 'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   4. GLASSMORPHISM
══════════════════════════════════════════════════════════════ */
const GlassDark = ({ data, style, pages }) => {
  const { primaryColor, accentColor, bgColor } = style;
  const glass = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 16 };
  return (
    <div style={{ background: bgColor || '#060B18', color: '#E0F2FE', fontFamily: 'Inter, sans-serif', minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: 60, left: '15%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${primaryColor}20 0%,transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 100, right: '10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${accentColor}18 0%,transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
        <span style={{ color: primaryColor, fontWeight: 800, fontSize: 18 }}>{data.name?.split(' ')[0] || 'Portfolio'}</span>
        <div style={{ display: 'flex', gap: 24 }}>{pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(224,242,254,0.45)', fontSize: 14, textDecoration: 'none' }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding: '80px 40px 60px', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 56, fontWeight: 900, color: '#E0F2FE', lineHeight: 1.05, marginBottom: 14 }}>{data.name || 'Your Name'}</h1>
        <h2 style={{ fontSize: 22, color: primaryColor, fontWeight: 600, marginBottom: 24 }}>{data.professionalTitle || 'Your Title'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640 }}>
          <div style={{ ...glass, padding: '18px 20px' }}>
            {data.summary && <p style={{ color: 'rgba(224,242,254,0.65)', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{data.summary.slice(0,160)}{data.summary.length > 160 ? '…' : ''}</p>}
          </div>
          <div style={{ ...glass, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} style={{ color: primaryColor }}/><span style={{ fontSize: 13, color: '#E0F2FE' }}>{data.email}</span></div>}
            {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} style={{ color: primaryColor }}/><span style={{ fontSize: 13, color: '#E0F2FE' }}>{data.phone}</span></div>}
            {data.city  && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} style={{ color: primaryColor }}/><span style={{ fontSize: 13, color: '#E0F2FE' }}>{data.city}</span></div>}
          </div>
        </div>
      </section>
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(224,242,254,0.25)', fontSize: 13, position: 'relative', zIndex: 1 }}>Built with SkillFolio · {data.name || 'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   5. MINIMAL LIGHT
══════════════════════════════════════════════════════════════ */
const MinimalLight = ({ data, style, pages }) => {
  const accent = '#DC2626';
  return (
    <div style={{ background: '#FAFAFA', color: '#18181B', fontFamily: '"Inter", sans-serif', minHeight: '100%' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,250,250,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E4E4E7', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <span style={{ fontWeight: 900, fontSize: 22, color: '#18181B', letterSpacing: -1 }}>{data.name?.split(' ')[0]?.[0]}{data.name?.split(' ')[1]?.[0] || ''}<span style={{ color: accent }}>.</span></span>
        <div style={{ display: 'flex', gap: 28 }}>{pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: '#71717A', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding: '70px 40px 50px', borderBottom: '1px solid #E4E4E7' }}>
        <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: '#18181B', marginBottom: 20, letterSpacing: -2 }}>
          Crafting<br/><span style={{ color: accent }}>Digital</span><br/>Experiences
        </h1>
        <p style={{ fontSize: 16, color: '#71717A', maxWidth: 480, lineHeight: 1.75, marginBottom: 12 }}>{data.name || 'Your Name'} — {data.professionalTitle || 'Developer'}</p>
        {data.summary && <p style={{ fontSize: 14, color: '#A1A1AA', maxWidth: 520, lineHeight: 1.7, marginBottom: 30 }}>{data.summary}</p>}
      </section>
      <footer style={{ textAlign: 'center', padding: '24px', color: '#D4D4D8', fontSize: 13 }}>Built with SkillFolio · {data.name || 'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   6. NEON CYBER
══════════════════════════════════════════════════════════════ */
const NeonCyber = ({ data, style, pages }) => {
  const cyan = '#22D3EE', purple = '#A855F7';
  return (
    <div style={{ background: '#020817', color: '#E2E8F0', fontFamily: '"Courier New", monospace', minHeight: '100%', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(34,211,238,0.012) 2px,rgba(34,211,238,0.012) 4px)', pointerEvents: 'none', zIndex: 0 }} />
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,8,23,0.9)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${cyan}25`, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <span style={{ color: cyan, fontWeight: 700, fontSize: 16, letterSpacing: 2 }}>NEXUS</span>
        <div style={{ display: 'flex', gap: 24 }}>{pages.map(p => <a key={p} href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(226,232,240,0.3)', fontSize: 13, textDecoration: 'none', letterSpacing: 1 }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding: '80px 40px 50px', maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.05, marginBottom: 14 }}>
          <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: 30, display: 'block', marginBottom: 4 }}>Hi, I'm</span>
          <span style={{ color: cyan, textShadow: `0 0 30px ${cyan}60` }}>{data.name || 'Your Name'}</span>
        </h1>
        {data.professionalTitle && <div style={{ display: 'inline-block', padding: '6px 18px', border: `1px solid ${purple}50`, borderRadius: 4, color: purple, fontSize: 15, fontWeight: 600, marginBottom: 20, background: `${purple}10` }}>{data.professionalTitle}</div>}
        {data.summary && <p style={{ fontSize: 15, color: 'rgba(226,232,240,0.45)', maxWidth: 560, lineHeight: 1.75, marginBottom: 30 }}>{data.summary}</p>}
      </section>
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: `1px solid ${cyan}10`, color: 'rgba(226,232,240,0.2)', fontSize: 12, letterSpacing: 1, position: 'relative', zIndex: 1 }}>BUILT WITH SKILLFOLIO · {(data.name || 'YOUR NAME').toUpperCase()} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ROUTER
══════════════════════════════════════════════════════════════ */
const PortfolioRenderer = ({ templateId, data, style, pages }) => {
  const props = { data, style, pages };
  switch (templateId) {
    case 'midnight-dev':      return <MidnightDev {...props} />;
    case 'clean-light':       return <CleanLight {...props} />;
    case 'creative-gradient': return <CreativeGradient {...props} />;
    case 'glass-dark':        return <GlassDark {...props} />;
    case 'minimal-light':     return <MinimalLight {...props} />;
    case 'neon-cyber':        return <NeonCyber {...props} />;
    default:                  return <MidnightDev {...props} />;
  }
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const PortfolioPreviewPage = () => {
  const navigate = useNavigate();
  const {
    resumeData, portfolioStyle, selectedPortfolioTemplate,
    portfolioPublished, setPortfolioPublished,
    portfolioSlug, setPortfolioSlug,
    savePortfolioToBackend
  } = useApp();

  const [copied, setCopied]       = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishErr, setPublishErr] = useState('');

  const tpl = PORTFOLIO_TEMPLATES.find(t => t.id === selectedPortfolioTemplate);

  // ✅ FIX: portfolioUrl is ALWAYS a full absolute URL built from window.location.origin
  // Before publishing: show a preview URL so the user knows what it'll look like
  // After publishing:  use the real slug returned by the backend
  const previewSlug = (resumeData.name || 'yourname')
    .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const portfolioUrl = portfolioPublished && portfolioSlug
    ? `${window.location.origin}/p/${portfolioSlug}`   // ✅ real URL after publish
    : `${window.location.origin}/p/${previewSlug}`;    // preview hint before publish

  // ✅ FIX: publish handler stores the slug from the backend response
  const handlePublish = async () => {
    setPublishing(true);
    setPublishErr('');
    try {
      await savePortfolioToBackend();
      const res = await portfolioAPI.publish();
      setPortfolioSlug(res.slug);       // ✅ use slug from backend, not a local guess
      setPortfolioPublished(true);
    } catch (err) {
      setPublishErr(err.message || 'Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  // ✅ FIX: copy the correct full URL (no extra https:// prefix)
  const handleCopy = () => {
    navigator.clipboard?.writeText(portfolioUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pfprev-page">
      <div className="container">
        <div className="pfprev-topbar">
          <button className="btn-ghost back-btn" onClick={() => navigate('/portfolio/customize')}>
            <ArrowLeft size={15} /> Customize
          </button>
          <div className="pfprev-topbar-center">
            <Monitor size={15}/><span>Portfolio Preview</span>
            {tpl && <span className="tpl-badge">{tpl.name}</span>}
          </div>
          <div className="pfprev-actions">
            <button className="btn-secondary" onClick={() => navigate('/portfolio/customize')}>
              <Edit3 size={15}/> Edit
            </button>
            {!portfolioPublished
              ? (
                <button className="btn-primary" onClick={handlePublish} disabled={publishing}>
                  {publishing
                    ? <span className="publish-dots"><span/><span/><span/></span>
                    : <><Globe size={15}/> Publish Portfolio</>}
                </button>
              ) : (
                <button className="btn-success" onClick={handleCopy}>
                  {copied ? <><Check size={15}/> Copied!</> : <><Copy size={15}/> Copy Link</>}
                </button>
              )}
          </div>
        </div>

        {publishErr && (
          <div className="publish-error animate-fadeIn">⚠️ {publishErr}</div>
        )}

        {portfolioPublished && (
          <div className="published-banner animate-fadeIn">
            <div className="published-banner-left">
              <span className="pub-icon">🎉</span>
              <div>
                <p className="pub-title">Your portfolio is live!</p>
                {/* ✅ FIX: href uses portfolioUrl directly — no extra https:// prefix */}
                <a
                  href={portfolioUrl}
                  className="pub-url"
                  target="_blank"
                  rel="noreferrer"
                >
                  {portfolioUrl} <ExternalLink size={12}/>
                </a>
              </div>
            </div>
            <div className="pub-actions">
              <button className="btn-ghost pub-copy-btn" onClick={handleCopy}>
                {copied ? <><Check size={13}/> Copied</> : <><Copy size={13}/> Copy URL</>}
              </button>
              {/* ✅ FIX: Visit Site uses portfolioUrl directly — no extra https:// prefix */}
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary pub-visit-btn"
              >
                Visit Site <ExternalLink size={13}/>
              </a>
            </div>
          </div>
        )}

        <div className="browser-wrap">
          <div className="browser-chrome">
            <div className="browser-dots">
              <span style={{ background: '#EF4444' }}/>
              <span style={{ background: '#F59E0B' }}/>
              <span style={{ background: '#10B981' }}/>
            </div>
            <div className="browser-url-bar">
              <Globe size={12}/>
              <span>{portfolioPublished ? portfolioUrl : 'preview — not yet published'}</span>
            </div>
          </div>
          <div className="portfolio-site">
            <PortfolioRenderer
              templateId={selectedPortfolioTemplate}
              data={resumeData}
              style={portfolioStyle}
              pages={portfolioStyle.pageOrder || ['Home','About','Projects','Skills','Contact']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreviewPage;