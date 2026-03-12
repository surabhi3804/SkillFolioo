import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PORTFOLIO_TEMPLATES, PORTFOLIO_SECTIONS } from '../data/staticData';
import {
  Globe, ArrowLeft, ExternalLink, Edit3, Check,
  Github, Linkedin, Mail, MapPin, Phone, Monitor, Copy
} from 'lucide-react';
import './PortfolioPreviewPage.css';

/* ===================== SECTION RENDERERS ===================== */

const HeroSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, bgColor, layout } = style;
  const lineColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.15)';
  return (
    <section className="pf-hero" style={{ borderBottom: `1px solid ${lineColor}` }}>
      <div className="pf-hero-avatar" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
        {data.name ? data.name[0].toUpperCase() : 'Y'}
      </div>
      <div className="pf-hero-text">
        <p className="pf-greeting" style={{ color: primaryColor }}>Hi, I'm</p>
        <h1 className="pf-name" style={{ color: textColor }}>{data.name || 'Your Name'}</h1>
        <h2 className="pf-role" style={{ color: accentColor }}>{data.professionalTitle || 'Your Professional Title'}</h2>
        {data.summary && <p className="pf-tagline" style={{ color: `${textColor}CC` }}>{data.summary.slice(0, 120)}{data.summary.length > 120 ? '…' : ''}</p>}
        <div className="pf-hero-links">
          {data.github && <a href={`https://github.com/${data.github}`} className="pf-link-btn" style={{ borderColor: primaryColor, color: primaryColor }} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>}
          {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} className="pf-link-btn" style={{ borderColor: accentColor, color: accentColor }} target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>}
          {data.email && <a href={`mailto:${data.email}`} className="pf-link-btn-fill" style={{ background: primaryColor }} target="_blank" rel="noreferrer"><Mail size={14} /> Contact Me</a>}
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ data, style }) => {
  const { primaryColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)';
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>About Me</h2>
      <div className="pf-about-grid">
        <p className="pf-about-text" style={{ color: `${textColor}CC` }}>{data.summary || 'Add a professional summary in the Resume Builder to show it here.'}</p>
        <div className="pf-contact-info" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }}>
          {data.email && <div className="pf-contact-item"><Mail size={15} style={{ color: primaryColor }} /><span style={{ color: textColor }}>{data.email}</span></div>}
          {data.phone && <div className="pf-contact-item"><Phone size={15} style={{ color: primaryColor }} /><span style={{ color: textColor }}>{data.phone}</span></div>}
          {data.city && <div className="pf-contact-item"><MapPin size={15} style={{ color: primaryColor }} /><span style={{ color: textColor }}>{data.city}</span></div>}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const tagBg = `${primaryColor}20`;
  const tagBorder = `${primaryColor}40`;
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Skills</h2>
      {(data.skills || []).length > 0 ? (
        <div className="pf-skills-wrap">
          {data.skills.map(s => (
            <span key={s} className="pf-skill-tag" style={{ background: tagBg, border: `1px solid ${tagBorder}`, color: layout === 'light' ? primaryColor : textColor }}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="pf-empty" style={{ color: `${textColor}60` }}>Add skills in the Resume Builder to display them here.</p>
      )}
    </section>
  );
};

const ExperienceSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#fff' : 'rgba(255,255,255,0.04)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.08)';
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Work Experience</h2>
      {(data.workExperience || []).length > 0 ? (
        <div className="pf-timeline">
          {data.workExperience.map((exp, i) => (
            <div key={i} className="pf-timeline-item" style={{ borderLeft: `2px solid ${primaryColor}40` }}>
              <div className="pf-timeline-dot" style={{ background: primaryColor }} />
              <div className="pf-exp-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }}>
                <div className="pf-exp-header">
                  <div>
                    <h3 className="pf-exp-title" style={{ color: textColor }}>{exp.title}</h3>
                    <p className="pf-exp-company" style={{ color: accentColor }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span className="pf-exp-date" style={{ color: `${textColor}70` }}>{exp.duration}</span>
                </div>
                {exp.description && <p className="pf-exp-desc" style={{ color: `${textColor}90` }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pf-empty" style={{ color: `${textColor}60` }}>Add work experience in the Resume Builder.</p>
      )}
    </section>
  );
};

const ProjectsSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#fff' : 'rgba(255,255,255,0.04)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)';
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Projects</h2>
      {(data.projects || []).length > 0 ? (
        <div className="pf-projects-grid">
          {data.projects.map((proj, i) => (
            <div key={i} className="pf-project-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderTop: `3px solid ${primaryColor}` }}>
              <div className="pf-proj-header">
                <h3 className="pf-proj-name" style={{ color: textColor }}>{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="pf-proj-link" style={{ color: accentColor }}>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
              {proj.tech && <p className="pf-proj-tech" style={{ color: primaryColor }}>🛠 {proj.tech}</p>}
              {proj.description && <p className="pf-proj-desc" style={{ color: `${textColor}90` }}>{proj.description}</p>}
              {proj.duration && <p className="pf-proj-duration" style={{ color: `${textColor}60` }}>⏱ {proj.duration}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="pf-empty" style={{ color: `${textColor}60` }}>Add projects in the Resume Builder.</p>
      )}
    </section>
  );
};

const EducationSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.04)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.08)';
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Education</h2>
      {(data.education || []).length > 0 ? (
        <div className="pf-edu-list">
          {data.education.map((edu, i) => (
            <div key={i} className="pf-edu-item" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, borderLeft: `4px solid ${primaryColor}` }}>
              <div className="pf-edu-main">
                <h3 className="pf-edu-degree" style={{ color: textColor }}>{edu.degree}</h3>
                <p className="pf-edu-institution" style={{ color: accentColor }}>{edu.institution}</p>
              </div>
              <div className="pf-edu-right">
                {edu.duration && <span className="pf-edu-date" style={{ color: `${textColor}70` }}>{edu.duration}</span>}
                {edu.gpa && <span className="pf-edu-gpa" style={{ color: primaryColor }}>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pf-empty" style={{ color: `${textColor}60` }}>Add education details in the Resume Builder.</p>
      )}
    </section>
  );
};

const CertificationsSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.04)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.08)';
  return (
    <section className="pf-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Certifications</h2>
      {(data.certifications || []).length > 0 ? (
        <div className="pf-cert-grid">
          {data.certifications.map((cert, i) => (
            <div key={i} className="pf-cert-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 10 }}>
              <div className="pf-cert-badge" style={{ background: `${primaryColor}20`, color: primaryColor }}>🏅</div>
              <div>
                <h4 className="pf-cert-name" style={{ color: textColor }}>{cert.name}</h4>
                {cert.issuer && <p className="pf-cert-issuer" style={{ color: accentColor }}>{cert.issuer}</p>}
                {cert.date && <p className="pf-cert-date" style={{ color: `${textColor}60` }}>{cert.date}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="pf-empty" style={{ color: `${textColor}60` }}>Add certifications in the Resume Builder.</p>
      )}
    </section>
  );
};

const ContactSection = ({ data, style }) => {
  const { primaryColor, accentColor, textColor, layout } = style;
  const cardBg = layout === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)';
  return (
    <section className="pf-section pf-contact-section">
      <h2 className="pf-section-title" style={{ color: primaryColor }}>Get In Touch</h2>
      <p className="pf-contact-tagline" style={{ color: `${textColor}CC` }}>
        I'm currently open to new opportunities. Feel free to reach out!
      </p>
      <div className="pf-contact-cards">
        {data.email && (
          <a href={`mailto:${data.email}`} className="pf-contact-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }}>
            <Mail size={22} style={{ color: primaryColor }} />
            <div><span style={{ color: `${textColor}80`, fontSize: 12 }}>Email</span><p style={{ color: textColor }}>{data.email}</p></div>
          </a>
        )}
        {data.linkedin && (
          <a href={`https://linkedin.com/in/${data.linkedin}`} className="pf-contact-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }} target="_blank" rel="noreferrer">
            <Linkedin size={22} style={{ color: accentColor }} />
            <div><span style={{ color: `${textColor}80`, fontSize: 12 }}>LinkedIn</span><p style={{ color: textColor }}>{data.linkedin}</p></div>
          </a>
        )}
        {data.github && (
          <a href={`https://github.com/${data.github}`} className="pf-contact-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12 }} target="_blank" rel="noreferrer">
            <Github size={22} style={{ color: textColor }} />
            <div><span style={{ color: `${textColor}80`, fontSize: 12 }}>GitHub</span><p style={{ color: textColor }}>{data.github}</p></div>
          </a>
        )}
      </div>
    </section>
  );
};

const SECTION_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
  certifications: CertificationsSection,
  contact: ContactSection,
};

/* ===================== PORTFOLIO NAV ===================== */
const PortfolioNav = ({ pages, style, name }) => {
  const { primaryColor, bgColor, textColor, layout, font } = style;
  const navBg = layout === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)';
  const borderColor = layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.1)';
  return (
    <nav className="pf-nav" style={{ background: navBg, borderBottom: `1px solid ${borderColor}`, fontFamily: font }}>
      <div className="pf-nav-brand" style={{ color: primaryColor }}>
        {name ? `${name.split(' ')[0]}'s Portfolio` : 'My Portfolio'}
      </div>
      <div className="pf-nav-links">
        {pages.map(p => <a key={p} href="#" className="pf-nav-link" style={{ color: `${textColor}CC` }} onClick={e => e.preventDefault()}>{p}</a>)}
      </div>
    </nav>
  );
};

/* ===================== MAIN PAGE ===================== */
const PortfolioPreviewPage = () => {
  const navigate = useNavigate();
  const {
    resumeData, portfolioStyle, selectedPortfolioTemplate,
    portfolioPublished, setPortfolioPublished, portfolioSlug, setPortfolioSlug
  } = useApp();
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const tpl = PORTFOLIO_TEMPLATES.find(t => t.id === selectedPortfolioTemplate);
  const finalStyle = portfolioStyle;

  const activeSections = finalStyle.sectionOrder.filter(id => SECTION_COMPONENTS[id]);

  const slug = portfolioSlug || (resumeData.name || 'yourname').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const portfolioUrl = `skillfolio.app/p/${slug}`;

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPortfolioSlug(slug);
      setPortfolioPublished(true);
      setPublishing(false);
    }, 1400);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${portfolioUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bgStyle = finalStyle.layout === 'gradient'
    ? `linear-gradient(160deg, ${finalStyle.bgColor} 0%, #1a0030 50%, #001a30 100%)`
    : finalStyle.bgColor;

  return (
    <div className="pfprev-page">
      <div className="container">
        {/* Top bar */}
        <div className="pfprev-topbar">
          <button className="btn-ghost back-btn" onClick={() => navigate('/portfolio/customize')}>
            <ArrowLeft size={15} /> Customize
          </button>
          <div className="pfprev-topbar-center">
            <Monitor size={15} />
            <span>Portfolio Preview</span>
            {tpl && <span className="tpl-badge">{tpl.name}</span>}
          </div>
          <div className="pfprev-actions">
            <button className="btn-secondary" onClick={() => navigate('/portfolio/customize')}>
              <Edit3 size={15} /> Edit
            </button>
            {!portfolioPublished ? (
              <button className="btn-primary" onClick={handlePublish} disabled={publishing}>
                {publishing ? (
                  <span className="publish-dots"><span /><span /><span /></span>
                ) : (
                  <><Globe size={15} /> Publish Portfolio</>
                )}
              </button>
            ) : (
              <button className="btn-success" onClick={handleCopy}>
                {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
              </button>
            )}
          </div>
        </div>

        {/* Published banner */}
        {portfolioPublished && (
          <div className="published-banner animate-fadeIn">
            <div className="published-banner-left">
              <span className="pub-icon">🎉</span>
              <div>
                <p className="pub-title">Your portfolio is live!</p>
                <a href={`https://${portfolioUrl}`} className="pub-url" target="_blank" rel="noreferrer">
                  {portfolioUrl} <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <div className="pub-actions">
              <button className="btn-ghost pub-copy-btn" onClick={handleCopy}>
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy URL</>}
              </button>
              <a href={`https://${portfolioUrl}`} target="_blank" rel="noreferrer" className="btn-primary pub-visit-btn">
                Visit Site <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* Browser mock wrapper */}
        <div className="browser-wrap">
          <div className="browser-chrome">
            <div className="browser-dots">
              <span style={{ background: '#EF4444' }} />
              <span style={{ background: '#F59E0B' }} />
              <span style={{ background: '#10B981' }} />
            </div>
            <div className="browser-url-bar">
              <Globe size={12} />
              <span>{portfolioPublished ? portfolioUrl : 'preview — not yet published'}</span>
            </div>
          </div>

          {/* THE ACTUAL PORTFOLIO SITE */}
          <div
            className="portfolio-site"
            style={{
              background: finalStyle.layout === 'gradient' ? bgStyle : finalStyle.bgColor,
              fontFamily: finalStyle.font,
            }}
          >
            <PortfolioNav pages={finalStyle.pageOrder} style={finalStyle} name={resumeData.name} />

            <div className="portfolio-body">
              {activeSections.map(sectionId => {
                const Comp = SECTION_COMPONENTS[sectionId];
                return Comp ? <Comp key={sectionId} data={resumeData} style={finalStyle} /> : null;
              })}
            </div>

            <footer className="pf-footer" style={{ borderTop: `1px solid ${finalStyle.layout === 'light' ? '#E2E8F0' : 'rgba(255,255,255,0.08)'}`, color: `${finalStyle.textColor}60` }}>
              <p>Built with SkillFolio · {resumeData.name || 'Your Name'} · {new Date().getFullYear()}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreviewPage;
