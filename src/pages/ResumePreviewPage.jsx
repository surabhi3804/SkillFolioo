import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TEMPLATES as RESUME_TEMPLATES } from '../data/staticData';
import {
  ArrowLeft, Download, Edit3, BarChart2,
  FileText, Monitor, Printer
} from 'lucide-react';
import './ResumePreviewPage.css';

/* ─────────────────────────────────────────────────────────────
   SMALL HELPER COMPONENTS
───────────────────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 10, color: '#111' }}>{title}</h2>
    {children}
  </div>
);

const ModernSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accent, margin: '0 0 10px', borderBottom: `2px solid ${accent}20`, paddingBottom: 5 }}>{title}</h2>
    {children}
  </div>
);

const SidebarSection = ({ title, children }) => (
  <div>
    <h3 style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.45, margin: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 5 }}>{title}</h3>
    {children}
  </div>
);

const SidebarItem = ({ label, value }) => (
  <div style={{ marginBottom: 7 }}>
    <div style={{ fontSize: 9.5, opacity: 0.45, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 }}>{label}</div>
    <div style={{ fontSize: 11.5, opacity: 0.85, wordBreak: 'break-all' }}>{value}</div>
  </div>
);

/* Red Accent section divider helper */
const RedSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ flex: 1, height: 1, background: accent }} />
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#111', margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: accent }} />
    </div>
    {children}
  </div>
);

/* AutoCV italic section helper */
const AutoSection = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{ fontSize: 12, fontStyle: 'italic', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#333', margin: '0 0 8px', borderBottom: '1px solid #ccc', paddingBottom: 4 }}>{title}</h2>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: CLASSIC CLEAN  (id: 'classic-clean')
───────────────────────────────────────────────────────────── */
const ClassicTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Georgia, serif', color: '#111', lineHeight: 1.55 }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: 22, borderBottom: '2px solid #111', paddingBottom: 14 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: 0.5 }}>{data.name || 'Your Name'}</h1>
      {data.professionalTitle && <p style={{ fontSize: 14, color: '#444', margin: '0 0 8px' }}>{data.professionalTitle}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', fontSize: 12, color: '#555' }}>
        {data.email    && <span>{data.email}</span>}
        {data.phone    && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
        {data.linkedin && <span>linkedin.com/in/{data.linkedin}</span>}
        {data.github   && <span>github.com/{data.github}</span>}
      </div>
    </div>

    {data.summary && <Section title="Summary"><p style={{ fontSize: 13, color: '#333', margin: 0 }}>{data.summary}</p></Section>}

    {(data.workExperience || []).length > 0 && (
      <Section title="Work Experience">
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 14 }}>{exp.title}</strong>
              <span style={{ fontSize: 12, color: '#666' }}>{exp.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
            {exp.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
          </div>
        ))}
      </Section>
    )}

    {(data.education || []).length > 0 && (
      <Section title="Education">
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 14 }}>{edu.degree}</strong>
              <span style={{ fontSize: 12, color: '#666' }}>{edu.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: '#444' }}>{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </Section>
    )}

    {(data.skills || []).length > 0 && (
      <Section title="Skills">
        <p style={{ fontSize: 13, margin: 0 }}>{data.skills.join(' · ')}</p>
      </Section>
    )}

    {(data.projects || []).length > 0 && (
      <Section title="Projects">
        {data.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 14 }}>{proj.name}</strong>
              {proj.link && <a href={proj.link} style={{ fontSize: 11, color: '#555' }}>{proj.link}</a>}
            </div>
            {proj.tech && <div style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>{proj.tech}</div>}
            {proj.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0 }}>{proj.description}</p>}
          </div>
        ))}
      </Section>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: MODERN HEADER  (id: 'modern-header')
───────────────────────────────────────────────────────────── */
const ModernHeaderTemplate = ({ data, accentColor = '#4A5568' }) => (
  <div style={{ fontFamily: 'Inter, sans-serif', color: '#1E293B' }}>
    <div style={{ background: accentColor, color: '#fff', padding: '28px 36px 22px', marginBottom: 0 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.5 }}>{data.name || 'Your Name'}</h1>
      {data.professionalTitle && <p style={{ fontSize: 15, opacity: 0.88, margin: '0 0 14px', fontWeight: 500 }}>{data.professionalTitle}</p>}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12, opacity: 0.8 }}>
        {data.email    && <span>✉ {data.email}</span>}
        {data.phone    && <span>☎ {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
        {data.linkedin && <span>in/{data.linkedin}</span>}
        {data.github   && <span>⌥ {data.github}</span>}
      </div>
    </div>

    <div style={{ padding: '24px 36px' }}>
      {data.summary && (
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7, borderLeft: `3px solid ${accentColor}`, paddingLeft: 12 }}>{data.summary}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div>
          {(data.skills || []).length > 0 && (
            <ModernSection title="Skills" accent={accentColor}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.skills.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0 }}/>
                    {s}
                  </div>
                ))}
              </div>
            </ModernSection>
          )}
          {(data.education || []).length > 0 && (
            <ModernSection title="Education" accent={accentColor}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 12.5, display: 'block' }}>{edu.degree}</strong>
                  <span style={{ fontSize: 12, color: accentColor }}>{edu.institution}</span>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{edu.duration}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </ModernSection>
          )}
        </div>

        <div>
          {(data.workExperience || []).length > 0 && (
            <ModernSection title="Experience" accent={accentColor}>
              {data.workExperience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < data.workExperience.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <strong style={{ fontSize: 13.5 }}>{exp.title}</strong>
                    <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0, marginLeft: 8 }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: accentColor, fontWeight: 500, marginBottom: 4 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  {exp.description && <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</p>}
                </div>
              ))}
            </ModernSection>
          )}
          {(data.projects || []).length > 0 && (
            <ModernSection title="Projects" accent={accentColor}>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: 13 }}>{proj.name}</strong>
                  {proj.tech && <span style={{ fontSize: 11, color: accentColor, marginLeft: 8 }}>{proj.tech}</span>}
                  {proj.description && <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0', lineHeight: 1.6 }}>{proj.description}</p>}
                </div>
              ))}
            </ModernSection>
          )}
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: SIDEBAR PRO  (id: 'sidebar-pro')
───────────────────────────────────────────────────────────── */
const SidebarProTemplate = ({ data, accentColor = '#2C3E6B' }) => (
  <div style={{ fontFamily: 'Inter, sans-serif', display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100%' }}>
    <div style={{ background: accentColor, color: '#F8FAFC', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          {data.name ? data.name[0].toUpperCase() : 'Y'}
        </div>
        <h1 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>{data.name || 'Your Name'}</h1>
        {data.professionalTitle && <p style={{ fontSize: 11.5, opacity: 0.65, margin: 0, lineHeight: 1.5 }}>{data.professionalTitle}</p>}
      </div>

      <SidebarSection title="Contact">
        {data.email    && <SidebarItem label="Email"    value={data.email}/>}
        {data.phone    && <SidebarItem label="Phone"    value={data.phone}/>}
        {data.location && <SidebarItem label="Location" value={data.location}/>}
        {data.linkedin && <SidebarItem label="LinkedIn" value={data.linkedin}/>}
        {data.github   && <SidebarItem label="GitHub"   value={data.github}/>}
      </SidebarSection>

      {(data.skills || []).length > 0 && (
        <SidebarSection title="Skills">
          {data.skills.map(s => (
            <div key={s} style={{ fontSize: 12, opacity: 0.8, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }}/>
              {s}
            </div>
          ))}
        </SidebarSection>
      )}

      {(data.education || []).length > 0 && (
        <SidebarSection title="Education">
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{edu.degree}</div>
              <div style={{ fontSize: 11, opacity: 0.65 }}>{edu.institution}</div>
              {edu.duration && <div style={{ fontSize: 10.5, opacity: 0.5 }}>{edu.duration}</div>}
            </div>
          ))}
        </SidebarSection>
      )}
    </div>

    <div style={{ padding: '32px 28px', background: '#fff', color: '#1E293B' }}>
      {data.summary && (
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accentColor, margin: '0 0 8px' }}>Profile</h2>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7 }}>{data.summary}</p>
        </div>
      )}

      {(data.workExperience || []).length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accentColor, margin: '0 0 12px', borderBottom: `2px solid ${accentColor}`, paddingBottom: 6 }}>Experience</h2>
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <strong style={{ fontSize: 14 }}>{exp.title}</strong>
                <span style={{ fontSize: 11.5, color: '#94A3B8' }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic', marginBottom: 5 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {exp.description && <p style={{ fontSize: 12.5, color: '#475569', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {(data.projects || []).length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accentColor, margin: '0 0 12px', borderBottom: `2px solid ${accentColor}`, paddingBottom: 6 }}>Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13.5 }}>{proj.name}</strong>
                {proj.link && <a href={proj.link} style={{ fontSize: 11, color: accentColor }}>{proj.link}</a>}
              </div>
              {proj.tech && <div style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 4px' }}>{proj.tech}</div>}
              {proj.description && <p style={{ fontSize: 12.5, color: '#475569', margin: 0, lineHeight: 1.6 }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: MINIMAL BLUE  (id: 'minimal-blue')
───────────────────────────────────────────────────────────── */
const MinimalTemplate = ({ data, accentColor = '#1E40AF' }) => (
  <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#1E293B', padding: '0 4px' }}>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 300, margin: '0 0 4px', letterSpacing: -1 }}>{data.name || 'Your Name'}</h1>
      {data.professionalTitle && <p style={{ fontSize: 15, color: accentColor, margin: '0 0 12px', fontWeight: 500 }}>{data.professionalTitle}</p>}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#64748B' }}>
        {data.email    && <span>{data.email}</span>}
        {data.phone    && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
        {data.linkedin && <span>linkedin.com/in/{data.linkedin}</span>}
        {data.github   && <span>github.com/{data.github}</span>}
      </div>
      <div style={{ height: 1, background: '#E2E8F0', marginTop: 16 }}/>
    </div>

    {data.summary && <div style={{ marginBottom: 22 }}><p style={{ fontSize: 13.5, color: '#475569', margin: 0, lineHeight: 1.75 }}>{data.summary}</p></div>}

    {(data.workExperience || []).length > 0 && (
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: accentColor, margin: '0 0 8px', borderBottom: `1px solid ${accentColor}`, paddingBottom: 4 }}>Work Experience</h2>
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: '#94A3B8', paddingTop: 2 }}>{exp.duration}</div>
            <div>
              <strong style={{ fontSize: 13.5 }}>{exp.title}</strong>
              <div style={{ fontSize: 12.5, color: '#64748B', marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {exp.description && <p style={{ fontSize: 12.5, color: '#475569', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{exp.description}</p>}
            </div>
          </div>
        ))}
      </div>
    )}

    {(data.education || []).length > 0 && (
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: accentColor, margin: '0 0 8px', borderBottom: `1px solid ${accentColor}`, paddingBottom: 4 }}>Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 11.5, color: '#94A3B8', paddingTop: 2 }}>{edu.duration}</div>
            <div>
              <strong style={{ fontSize: 13.5 }}>{edu.degree}</strong>
              <div style={{ fontSize: 12.5, color: '#64748B' }}>{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
            </div>
          </div>
        ))}
      </div>
    )}

    {(data.skills || []).length > 0 && (
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: accentColor, margin: '0 0 8px', borderBottom: `1px solid ${accentColor}`, paddingBottom: 4 }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 13 }}>
          {data.skills.map(s => <span key={s} style={{ color: '#334155' }}>{s}</span>)}
        </div>
      </div>
    )}

    {(data.projects || []).length > 0 && (
      <div>
        <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: accentColor, margin: '0 0 8px', borderBottom: `1px solid ${accentColor}`, paddingBottom: 4 }}>Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: 13.5 }}>{proj.name}</strong>
            {proj.tech && <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 10 }}>{proj.tech}</span>}
            {proj.description && <p style={{ fontSize: 12.5, color: '#475569', margin: '3px 0 0', lineHeight: 1.6 }}>{proj.description}</p>}
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: RED ACCENT  (id: 'red-accent')
───────────────────────────────────────────────────────────── */
const RedAccentTemplate = ({ data, accentColor = '#DC2626' }) => (
  <div style={{ fontFamily: 'Georgia, serif', color: '#111', lineHeight: 1.55 }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: 18 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: 0.3 }}>{data.name || 'Your Name'}</h1>
      {data.professionalTitle && <p style={{ fontSize: 13, color: '#555', margin: '0 0 10px' }}>{data.professionalTitle}</p>}
      {/* 3-column info row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 12, color: '#444', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '8px 0' }}>
        {data.email    && <span>{data.email}</span>}
        {data.phone    && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
        {data.linkedin && <span>linkedin.com/in/{data.linkedin}</span>}
        {data.github   && <span>github.com/{data.github}</span>}
      </div>
    </div>

    {data.summary && (
      <RedSection title="Summary" accent={accentColor}>
        <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{data.summary}</p>
      </RedSection>
    )}

    {(data.workExperience || []).length > 0 && (
      <RedSection title="Work Experience" accent={accentColor}>
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 13.5 }}>{exp.title}</strong>
              <span style={{ fontSize: 12, color: '#666' }}>{exp.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: accentColor, marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
            {exp.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
          </div>
        ))}
      </RedSection>
    )}

    {(data.education || []).length > 0 && (
      <RedSection title="Education" accent={accentColor}>
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 13.5 }}>{edu.degree}</strong>
              <span style={{ fontSize: 12, color: '#666' }}>{edu.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: '#444' }}>{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </RedSection>
    )}

    {(data.skills || []).length > 0 && (
      <RedSection title="Skills" accent={accentColor}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 13, color: '#333' }}>
          {data.skills.map(s => <span key={s}>{s}</span>)}
        </div>
      </RedSection>
    )}

    {(data.projects || []).length > 0 && (
      <RedSection title="Projects" accent={accentColor}>
        {data.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 13.5 }}>{proj.name}</strong>
              {proj.link && <a href={proj.link} style={{ fontSize: 11, color: '#555' }}>{proj.link}</a>}
            </div>
            {proj.tech && <div style={{ fontSize: 12, color: '#666', marginBottom: 3 }}>{proj.tech}</div>}
            {proj.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0, lineHeight: 1.6 }}>{proj.description}</p>}
          </div>
        ))}
      </RedSection>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE: AUTO CV  (id: 'auto-cv')
───────────────────────────────────────────────────────────── */
const AutoCVTemplate = ({ data, accentColor = '#1a56db' }) => (
  <div style={{ fontFamily: 'Georgia, serif', color: '#222', lineHeight: 1.6 }}>
    {/* Centered header */}
    <div style={{ textAlign: 'center', marginBottom: 14 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.3 }}>{data.name || 'Your Name'}</h1>
      {data.professionalTitle && <p style={{ fontSize: 13, color: '#555', margin: '0 0 10px' }}>{data.professionalTitle}</p>}
      {/* Icon-style contact links row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', fontSize: 12, color: accentColor }}>
        {data.email    && <span>✉ {data.email}</span>}
        {data.phone    && <span>☎ {data.phone}</span>}
        {data.linkedin && <span>in/{data.linkedin}</span>}
        {data.github   && <span>⌥ {data.github}</span>}
      </div>
    </div>
    <div style={{ height: 1, background: '#ccc', marginBottom: 14 }} />

    {data.summary && (
      <AutoSection title="Summary">
        <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{data.summary}</p>
      </AutoSection>
    )}

    {(data.workExperience || []).length > 0 && (
      <AutoSection title="Work Experience">
        {data.workExperience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 13.5 }}>{exp.title}</strong>
              <span style={{ fontSize: 12, color: '#888' }}>{exp.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: accentColor, marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
            {exp.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>}
          </div>
        ))}
      </AutoSection>
    )}

    {(data.education || []).length > 0 && (
      <AutoSection title="Education">
        {data.education.map((edu, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div>
              <strong style={{ fontSize: 13.5 }}>{edu.degree}</strong>
              <div style={{ fontSize: 13, color: '#555' }}>{edu.institution}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#888' }}>{edu.duration}</div>
              {edu.gpa && <div style={{ fontSize: 12, color: accentColor }}>GPA: {edu.gpa}</div>}
            </div>
          </div>
        ))}
      </AutoSection>
    )}

    {(data.skills || []).length > 0 && (
      <AutoSection title="Skills">
        <p style={{ fontSize: 13, margin: 0, color: '#333' }}>{data.skills.join(' · ')}</p>
      </AutoSection>
    )}

    {(data.projects || []).length > 0 && (
      <AutoSection title="Projects">
        {data.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: 13.5 }}>{proj.name}</strong>
              {proj.link && <a href={proj.link} style={{ fontSize: 11, color: accentColor }}>{proj.link}</a>}
            </div>
            {proj.tech && <div style={{ fontSize: 12, color: '#888', marginBottom: 3 }}>{proj.tech}</div>}
            {proj.description && <p style={{ fontSize: 12.5, color: '#555', margin: 0, lineHeight: 1.6 }}>{proj.description}</p>}
          </div>
        ))}
      </AutoSection>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TEMPLATE ROUTER  — IDs match exactly what TemplatesPage uses
───────────────────────────────────────────────────────────── */
const ResumeRenderer = ({ templateId, data, accentColor }) => {
  const props = { data, accentColor };
  switch (templateId) {
    case 'classic-clean':  return <ClassicTemplate       {...props} />;
    case 'modern-header':  return <ModernHeaderTemplate  {...props} />;
    case 'sidebar-pro':    return <SidebarProTemplate    {...props} />;
    case 'minimal-blue':   return <MinimalTemplate       {...props} />;
    case 'red-accent':     return <RedAccentTemplate     {...props} />;
    case 'auto-cv':        return <AutoCVTemplate        {...props} />;
    default:               return <ClassicTemplate       {...props} />;
  }
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const ResumePreviewPage = () => {
  const navigate = useNavigate();
  const sheetRef = useRef(null);
  const { resumeData, selectedTemplate, templateAccentColor } = useApp();

  const tpl = (typeof RESUME_TEMPLATES !== 'undefined' && RESUME_TEMPLATES)
    ? RESUME_TEMPLATES.find(t => t.id === selectedTemplate)
    : null;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const style = document.createElement('style');
    style.textContent = `@media print { body > *:not(#resume-print-target) { display: none !important; } #resume-print-target { display: block !important; } }`;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <div className="resume-preview-page">
      <div className="container">

        {/* ── Top bar ── */}
        <div className="preview-topbar">
          <button className="btn-ghost back-btn" onClick={() => navigate('/builder')}>
            <ArrowLeft size={15} /> Edit Resume
          </button>

          <div className="preview-topbar-center">
            <FileText size={15} />
            <span>Resume Preview</span>
            {tpl && <span className="tpl-badge">{tpl.name}</span>}
          </div>

          <div className="preview-actions">
            <button className="btn-secondary" onClick={() => navigate('/ats-score')}>
              <BarChart2 size={15} /> ATS Score
            </button>
            <button className="btn-secondary" onClick={handlePrint}>
              <Printer size={15} /> Print
            </button>
            <button className="btn-primary" onClick={handleDownload}>
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>

        {/* ── Resume Sheet ── */}
        <div className="resume-preview-wrap">
          {selectedTemplate ? (
            <div
              ref={sheetRef}
              className="resume-sheet"
              data-template={selectedTemplate}
            >
              <ResumeRenderer
                templateId={selectedTemplate}
                data={resumeData}
                accentColor={templateAccentColor || tpl?.accent || '#DC2626'}
              />
            </div>
          ) : (
            <div className="no-template-msg">
              No template selected.{' '}
              <button className="link-btn" onClick={() => navigate('/templates')}>
                Choose a template
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumePreviewPage;