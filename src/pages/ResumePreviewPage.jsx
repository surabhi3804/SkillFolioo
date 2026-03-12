import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, Edit3, FileText } from 'lucide-react';
import './ResumePreviewPage.css';

const ClassicClean = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const SectionTitle = ({ children }) => (
    <div style={{ borderBottom: '1.5px solid #111', marginBottom: 6, marginTop: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 3px', color: '#111' }}>{children}</h2>
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Georgia, serif', color: '#111', fontSize: 11 }}>
      <div style={{ textAlign: 'center', marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: 0.5 }}>{name || 'Your Name'}</h1>
        {professionalTitle && <p style={{ fontSize: 12, color: '#555', margin: '0 0 4px' }}>{professionalTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', fontSize: 10.5, color: '#444' }}>
          {phone && <span>📞 {phone}</span>}
          {email && <span>✉ {email}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
          {city && <span>📍 {city}</span>}
          {github && <span>⌥ {github}</span>}
        </div>
      </div>

      {summary && (<><SectionTitle>Summary</SectionTitle><p style={{ margin: '0 0 4px', lineHeight: 1.5 }}>{summary}</p></>)}

      {workExperience.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11.5 }}>{exp.company}</strong>
                <span style={{ color: '#555', fontSize: 10.5 }}>{exp.duration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <em style={{ color: '#333', fontSize: 10.5 }}>{exp.title}</em>
                {exp.location && <span style={{ color: '#777', fontSize: 10 }}>{exp.location}</span>}
              </div>
              {exp.description && (
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.45 }}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                {p.link && <span style={{ color: '#1a56db', fontSize: 10 }}>{p.link}</span>}
              </div>
              {p.tech && <em style={{ fontSize: 10, color: '#555' }}>{p.tech}</em>}
              {p.description && <p style={{ margin: '2px 0 0', lineHeight: 1.45 }}>{p.description}</p>}
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <strong>{e.degree}</strong>
                <p style={{ margin: '1px 0', color: '#555', fontSize: 10.5 }}>{e.institution}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10.5, color: '#555' }}>
                <div>{e.duration}</div>
                {e.gpa && <div>GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (<><SectionTitle>Skills</SectionTitle><p style={{ margin: 0, lineHeight: 1.6 }}>{skills.join(' · ')}</p></>)}

      {certifications.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <strong>{c.name}</strong>
              {c.issuer && <span style={{ color: '#555', marginLeft: 8, fontSize: 10.5 }}>{c.issuer}</span>}
              {c.date && <span style={{ color: '#777', marginLeft: 8, fontSize: 10 }}>{c.date}</span>}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const SidebarPro = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const sidebarBg = '#2C3E6B';
  const accent = '#7B9FDE';

  const SidebarSection = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8.5, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1.2, borderBottom: `1px solid ${accent}50`, paddingBottom: 3, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );

  const MainSection = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#2C3E6B', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #2C3E6B', paddingBottom: 3, marginBottom: 7 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Inter, sans-serif', display: 'flex', padding: 0, overflow: 'hidden' }}>
      <div style={{ width: '34%', background: sidebarBg, padding: '24px 14px', color: '#e8edf5', fontSize: 10, flexShrink: 0 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 auto 10px' }}>
          {name ? name[0].toUpperCase() : 'Y'}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{name || 'Your Name'}</div>
          <div style={{ fontSize: 10, color: accent, marginTop: 2 }}>{professionalTitle}</div>
        </div>
        {summary && (<SidebarSection title="Profile"><p style={{ lineHeight: 1.5, color: '#c8d4e8', fontSize: 9.5 }}>{summary}</p></SidebarSection>)}
        <SidebarSection title="Contact">
          {email && <div style={{ marginBottom: 4, wordBreak: 'break-all' }}>✉ {email}</div>}
          {phone && <div style={{ marginBottom: 4 }}>📞 {phone}</div>}
          {city && <div style={{ marginBottom: 4 }}>📍 {city}</div>}
          {linkedin && <div style={{ marginBottom: 4 }}>🔗 {linkedin}</div>}
          {github && <div style={{ marginBottom: 4 }}>⌥ {github}</div>}
        </SidebarSection>
        {skills.length > 0 && (
          <SidebarSection title="Skills">
            {skills.map(s => (
              <div key={s} style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: 9.5, color: '#c8d4e8' }}><span>{s}</span></div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${65 + (s.length % 30)}%`, background: accent, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </SidebarSection>
        )}
        {certifications.length > 0 && (
          <SidebarSection title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <div style={{ fontWeight: 600, fontSize: 9.5, color: '#e8edf5' }}>{c.name}</div>
                {c.issuer && <div style={{ color: accent, fontSize: 9 }}>{c.issuer}</div>}
              </div>
            ))}
          </SidebarSection>
        )}
      </div>
      <div style={{ flex: 1, padding: '24px 18px', fontSize: 10.5 }}>
        {workExperience.length > 0 && (
          <MainSection title="Experience">
            {workExperience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 11, color: '#1a2744' }}>{exp.title}</strong>
                  <span style={{ fontSize: 9.5, color: '#7b8ab0' }}>{exp.duration}</span>
                </div>
                <em style={{ color: '#2C3E6B', fontSize: 10 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</em>
                {exp.description && (
                  <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j} style={{ marginBottom: 2, lineHeight: 1.45, color: '#333' }}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}
        {education.length > 0 && (
          <MainSection title="Education">
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <div>
                  <strong style={{ color: '#1a2744' }}>{e.degree}</strong>
                  <p style={{ margin: '2px 0', color: '#2C3E6B', fontSize: 10 }}>{e.institution}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 9.5, color: '#7b8ab0' }}>
                  <div>{e.duration}</div>
                  {e.gpa && <div style={{ color: '#2C3E6B' }}>GPA: {e.gpa}</div>}
                </div>
              </div>
            ))}
          </MainSection>
        )}
        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#1a2744' }}>{p.name}</strong>
                  {p.link && <span style={{ color: '#1a56db', fontSize: 9.5 }}>{p.link}</span>}
                </div>
                {p.tech && <em style={{ color: '#2C3E6B', fontSize: 10 }}>{p.tech}</em>}
                {p.description && <p style={{ margin: '3px 0 0', color: '#444', lineHeight: 1.4 }}>{p.description}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
};

const ModernHeader = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const headerBg = '#4A5568';
  const accent = '#4A5568';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <div style={{ width: 3, height: 14, background: accent, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, padding: 0, overflow: 'hidden' }}>
      <div style={{ background: headerBg, padding: '20px 24px 16px', color: '#fff' }}>
        <h1 style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>{name || 'Your Name'}</h1>
        {professionalTitle && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{professionalTitle}</p>}
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
          {email && <span>✉ {email}</span>}
          {phone && <span>📞 {phone}</span>}
          {city && <span>📍 {city}</span>}
          {linkedin && <span>🔗 {linkedin}</span>}
          {github && <span>⌥ {github}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', background: '#F7F8FA', borderBottom: '1px solid #e2e8f0', padding: '8px 24px', gap: 24, fontSize: 10, color: '#4A5568' }}>
        {skills.slice(0, 6).map(s => (
          <span key={s} style={{ background: '#4A5568', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 9.5 }}>{s}</span>
        ))}
      </div>
      <div style={{ padding: '16px 24px' }}>
        {summary && (<Section title="Summary"><p style={{ margin: 0, lineHeight: 1.55, color: '#444' }}>{summary}</p></Section>)}
        {workExperience.length > 0 && (
          <Section title="Experience">
            {workExperience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#1a2744' }}>{exp.title}</strong>
                  <span style={{ fontSize: 9.5, color: '#888', whiteSpace: 'nowrap' }}>{exp.duration}</span>
                </div>
                <em style={{ color: accent, fontSize: 10 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</em>
                {exp.description && (
                  <ul style={{ margin: '4px 0 0 12px', padding: 0 }}>
                    {exp.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j} style={{ marginBottom: 2, lineHeight: 1.45, color: '#333' }}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            {education.length > 0 && (
              <Section title="Education">
                {education.map((e, i) => (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#1a2744', fontSize: 10.5 }}>{e.degree}</strong>
                      <span style={{ fontSize: 9.5, color: '#888' }}>{e.duration}</span>
                    </div>
                    <em style={{ color: accent, fontSize: 10 }}>{e.institution}</em>
                    {e.gpa && <div style={{ fontSize: 9.5, color: '#666' }}>GPA: {e.gpa}</div>}
                  </div>
                ))}
              </Section>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {projects.length > 0 && (
              <Section title="Projects">
                {projects.map((p, i) => (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#1a2744', fontSize: 10.5 }}>{p.name}</strong>
                      {p.link && <span style={{ color: '#1a56db', fontSize: 9 }}>link</span>}
                    </div>
                    {p.tech && <em style={{ color: accent, fontSize: 9.5 }}>{p.tech}</em>}
                    {p.description && <p style={{ margin: '2px 0 0', color: '#555', lineHeight: 1.4, fontSize: 10 }}>{p.description}</p>}
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
        {certifications.length > 0 && (
          <Section title="Certifications">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {certifications.map((c, i) => (
                <div key={i} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 9.5 }}>
                  <strong>{c.name}</strong>{c.issuer ? ` · ${c.issuer}` : ''}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

const MinimalBlue = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github, website,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const blue = '#1E40AF';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 13 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: blue, borderBottom: `1.5px solid ${blue}`, paddingBottom: 3 }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Calibri, Inter, sans-serif', fontSize: 10.5, color: '#1a1a2e' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: 0.5 }}>{name || 'Your Name'}</h1>
        {professionalTitle && <p style={{ margin: '0 0 5px', fontSize: 11.5, color: '#555' }}>{professionalTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', fontSize: 10, color: '#333' }}>
          {linkedin && <a href='#' style={{ color: blue, textDecoration: 'none' }}>🔗 {linkedin}</a>}
          {github && <a href='#' style={{ color: blue, textDecoration: 'none' }}>⌥ {github}</a>}
          {website && <a href='#' style={{ color: blue, textDecoration: 'none' }}>🌐 {website}</a>}
          {email && <a href='#' style={{ color: blue, textDecoration: 'none' }}>✉ {email}</a>}
          {phone && <span>📞 {phone}</span>}
          {city && <span>📍 {city}</span>}
        </div>
      </div>
      {summary && (<Section title="Summary"><p style={{ margin: 0, lineHeight: 1.55, color: '#333' }}>{summary}</p></Section>)}
      {workExperience.length > 0 && (
        <Section title="Work Experience">
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11 }}>{exp.title}</strong>
                <span style={{ fontSize: 9.5, color: '#666' }}>{exp.duration}</span>
              </div>
              <em style={{ color: blue, fontSize: 10 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</em>
              {exp.description && (
                <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.45, color: '#333' }}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                {p.link && <a href={p.link} style={{ color: blue, fontSize: 10 }} target="_blank" rel="noreferrer">Link to Demo</a>}
              </div>
              {p.tech && <em style={{ color: '#555', fontSize: 10 }}>{p.tech}</em>}
              {p.description && <p style={{ margin: '2px 0 0', color: '#444', lineHeight: 1.45 }}>{p.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <div>
                <strong>{e.degree}</strong>
                <p style={{ margin: '1px 0 0', color: blue, fontSize: 10 }}>{e.institution}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: '#666' }}>
                <div>{e.duration}</div>
                {e.gpa && <div>GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </Section>
      )}
      {skills.length > 0 && (<Section title="Skills"><p style={{ margin: 0, lineHeight: 1.7, color: '#333' }}>{skills.join('  ·  ')}</p></Section>)}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div><strong>{c.name}</strong>{c.issuer && <span style={{ color: '#555' }}> · {c.issuer}</span>}</div>
              <span style={{ color: '#888', fontSize: 10 }}>{c.date}</span>
            </div>
          ))}
        </Section>
      )}
      <div style={{ textAlign: 'center', fontSize: 9, color: '#aaa', marginTop: 16, borderTop: '1px solid #eee', paddingTop: 6 }}>
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
};

const RedAccent = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const red = '#DC2626';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <div style={{ flex: 1, height: 1, background: red }} />
        <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: 1.2, whiteSpace: 'nowrap' }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: red }} />
      </div>
      {children}
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5, color: '#111' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 700, color: red, letterSpacing: 0.5 }}>{name || 'Your Name'}</h1>
        {professionalTitle && <p style={{ margin: '0 0 6px', fontSize: 11, color: '#555' }}>{professionalTitle}</p>}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '6px 0', marginBottom: 14 }}>
        {[{ label: 'Email', value: email }, { label: 'Phone', value: phone }, { label: 'Location', value: city }]
          .filter(f => f.value).map(({ label, value }) => (
          <div key={label} style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee', padding: '0 8px' }}>
            <div style={{ fontSize: 9, color: red, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 10, color: '#333' }}>{value}</div>
          </div>
        ))}
        {linkedin && (
          <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: 9, color: red, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>LinkedIn</div>
            <div style={{ fontSize: 10, color: '#333' }}>{linkedin}</div>
          </div>
        )}
      </div>
      {summary && (<Section title="Summary"><p style={{ margin: 0, lineHeight: 1.55 }}>{summary}</p></Section>)}
      {workExperience.length > 0 && (
        <Section title="Work Experiences">
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.title}</strong>
                <span style={{ color: '#666', fontSize: 10 }}>{exp.duration}</span>
              </div>
              <em style={{ color: red, fontSize: 10 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</em>
              {exp.description && (
                <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.45 }}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <strong>{e.degree}</strong>
                <p style={{ margin: '1px 0 0', color: red, fontSize: 10 }}>{e.institution}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: '#666' }}>
                <div>{e.duration}</div>
                {e.gpa && <div style={{ color: red }}>GPA: {e.gpa}</div>}
              </div>
            </div>
          ))}
        </Section>
      )}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                {p.link && <a href={p.link} style={{ color: red, fontSize: 10 }} target="_blank" rel="noreferrer">{p.link}</a>}
              </div>
              {p.tech && <em style={{ color: '#555', fontSize: 10 }}>{p.tech}</em>}
              {p.description && <p style={{ margin: '2px 0 0', lineHeight: 1.45 }}>{p.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map(s => (
              <span key={s} style={{ border: `1px solid ${red}`, color: red, padding: '2px 8px', borderRadius: 3, fontSize: 9.5 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <strong>{c.name}</strong>
              {c.issuer && <em style={{ color: '#555', marginLeft: 8, fontSize: 10 }}>{c.issuer}</em>}
              {c.date && <span style={{ color: '#888', marginLeft: 8, fontSize: 9.5 }}>{c.date}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
};

const AutoCV = ({ data }) => {
  const { name, professionalTitle, email, phone, city, linkedin, github, website,
          summary, workExperience = [], education = [],
          skills = [], projects = [], certifications = [] } = data;

  const blue = '#1a56db';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ margin: '0 0 5px', fontSize: 12.5, fontStyle: 'italic', fontVariant: 'small-caps', fontWeight: 600, color: '#111', borderBottom: '1px solid #ccc', paddingBottom: 3 }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="resume-sheet" style={{ fontFamily: 'Georgia, serif', fontSize: 10.5, color: '#111' }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, letterSpacing: 0.3 }}>{name || 'Your Name'}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 10, flexWrap: 'wrap' }}>
          {linkedin && <a href="#" style={{ color: blue, textDecoration: 'none' }}>🔗 {linkedin}</a>}
          {github && <a href="#" style={{ color: blue, textDecoration: 'none' }}>⌥ {github}</a>}
          {website && <a href="#" style={{ color: blue, textDecoration: 'none' }}>🌐 {website}</a>}
          {email && <a href="#" style={{ color: blue, textDecoration: 'none' }}>✉ {email}</a>}
          {phone && <span>📞 {phone}</span>}
          {city && <span>📍 {city}</span>}
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #aaa', marginBottom: 10 }} />
      {summary && (<Section title="Summary"><p style={{ margin: 0, lineHeight: 1.6, color: '#333' }}>{summary}</p></Section>)}
      {workExperience.length > 0 && (
        <Section title="Work Experience">
          {workExperience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11 }}>{exp.title}</strong>
                <span style={{ fontSize: 10, color: '#555' }}>{exp.duration}</span>
              </div>
              <em style={{ color: '#333', fontSize: 10 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</em>
              {exp.description && (
                <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.5 }}>— {line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                {p.link && <a href={p.link} style={{ color: blue, fontSize: 10 }} target="_blank" rel="noreferrer">Link to Demo</a>}
              </div>
              {p.tech && <span style={{ fontSize: 10, color: '#555', fontStyle: 'italic' }}>{p.tech}</span>}
              {p.description && <p style={{ margin: '3px 0 0', lineHeight: 1.55, color: '#444' }}>{p.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <div>
                <div><strong>{e.degree}</strong></div>
                <div style={{ color: '#333', fontSize: 10 }}>{e.institution}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, color: '#555' }}>
                <div>{e.duration}</div>
                {e.gpa && <div style={{ color: blue }}>(GPA: {e.gpa}/4.0)</div>}
              </div>
            </div>
          ))}
        </Section>
      )}
      {skills.length > 0 && (<Section title="Skills"><p style={{ margin: 0, lineHeight: 1.7, color: '#333' }}>{skills.join('  ·  ')}</p></Section>)}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <p key={i} style={{ margin: '0 0 4px', lineHeight: 1.5 }}>
              <strong>{c.name}</strong>
              {c.issuer && <em>, {c.issuer}</em>}
              {c.date && <span style={{ color: '#666' }}> ({c.date})</span>}
            </p>
          ))}
        </Section>
      )}
      <div style={{ textAlign: 'center', fontSize: 9, color: '#aaa', marginTop: 20, borderTop: '1px solid #ddd', paddingTop: 6 }}>
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
};

const TEMPLATE_MAP = {
  'classic-clean': ClassicClean,
  'sidebar-pro':   SidebarPro,
  'modern-header': ModernHeader,
  'minimal-blue':  MinimalBlue,
  'red-accent':    RedAccent,
  'auto-cv':       AutoCV,
};

const ResumePreviewPage = () => {
  const navigate = useNavigate();
  const { resumeData, selectedTemplate } = useApp();
  const printRef = useRef(null);

  const TemplateComponent = TEMPLATE_MAP[selectedTemplate] || ClassicClean;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-size: 11px; }
            @page {
              size: A4;
              margin: 12mm 14mm 12mm 14mm;
              marks: none;
            }
            html, body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
              }
              .resume-sheet {
                width: 100% !important;
                min-height: unset !important;
                padding: 0 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
              }
            }
            ul { list-style: disc; }
          </style>
        </head>
        <body onload="
          if(window.chrome){
            document.title='';
          }
          window.print();
        ">${content.innerHTML}</body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="resume-preview-page">
      <div className="container">
        <div className="preview-topbar">
          <button className="btn-ghost back-btn" onClick={() => navigate('/builder')}>
            <ArrowLeft size={15} /> Back to Builder
          </button>
          <div className="preview-topbar-center">
            <FileText size={15} />
            <span>Resume Preview</span>
            {selectedTemplate && (
              <span className="tpl-badge">
                {selectedTemplate.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            )}
          </div>
          <div className="preview-actions">
            <button className="btn-secondary" onClick={() => navigate('/builder')}>
              <Edit3 size={15} /> Edit
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>

        {!selectedTemplate && (
          <div className="no-template-msg">
            <p>No template selected. <button className="link-btn" onClick={() => navigate('/templates')}>Choose a template</button></p>
          </div>
        )}

        <div className="resume-preview-wrap">
          <div ref={printRef}>
            <TemplateComponent data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPage;