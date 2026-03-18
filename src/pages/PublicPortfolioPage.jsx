import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Github, Linkedin, Mail, MapPin, Phone, ExternalLink
} from 'lucide-react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─── Fetch public portfolio ──────────────────────────────── */
const fetchPublicPortfolio = async (slug) => {
  const res = await fetch(`${BASE_URL}/portfolio/public/${slug}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Not found');
  return data.portfolio;
};

/* ─── Reuse all 6 template renderers from PortfolioPreviewPage ─ */
// (inline simplified versions so this page is self-contained)

const SectionTitle = ({ title, primary, light }) => (
  <div style={{ textAlign: 'center', marginBottom: 36 }}>
    <h2 style={{ fontSize: 30, fontWeight: 800, color: light ? '#1E293B' : '#fff', marginBottom: 8 }}>{title}</h2>
    <div style={{ width: 44, height: 3, background: primary, borderRadius: 2, margin: '0 auto' }} />
  </div>
);

const renderPortfolio = (portfolio) => {
  const style = portfolio.style || {};
  const primaryColor  = style.primaryColor  || '#7C3AED';
  const accentColor   = style.accentColor   || '#06B6D4';
  const bgColor       = style.bgColor       || '#0F172A';
  const textColor     = style.textColor     || '#F8FAFC';
  const layout        = style.layout        || 'dark';
  const font          = style.font          || 'Inter, sans-serif';
  const templateId    = portfolio.templateId || 'midnight-dev';
  const pages         = style.pageOrder     || ['Home','About','Projects','Skills','Contact'];

  // Map backend portfolio shape → display shape
  const data = {
    name:              portfolio.personalInfo?.fullName || '',
    professionalTitle: portfolio.personalInfo?.title    || '',
    email:             portfolio.personalInfo?.email    || '',
    phone:             portfolio.personalInfo?.phone    || '',
    city:              portfolio.personalInfo?.location || '',
    linkedin:          portfolio.personalInfo?.linkedin || '',
    github:            portfolio.personalInfo?.github   || '',
    summary:           portfolio.personalInfo?.bio      || '',
    skills:            (portfolio.skills || []).map(s => s.name || s),
    workExperience:    (portfolio.experience || []).map(e => ({
      title:       e.role,
      company:     e.company,
      location:    '',
      duration:    `${e.startDate || ''}${e.endDate ? ' – ' + e.endDate : e.current ? ' – Present' : ''}`,
      description: e.description,
    })),
    education:      (portfolio.education || []).map(e => ({
      degree:      `${e.degree || ''} ${e.field || ''}`.trim(),
      institution: e.institution,
      duration:    `${e.startDate || ''}${e.endDate ? ' – ' + e.endDate : ''}`,
      gpa:         e.grade,
    })),
    projects:       (portfolio.projects || []).map(p => ({
      name:        p.name,
      tech:        Array.isArray(p.tech) ? p.tech.join(', ') : p.tech || '',
      link:        p.liveUrl || p.githubUrl || '',
      description: p.description,
    })),
    certifications: (portfolio.certifications || []).map(c => ({
      name:   c.name,
      issuer: c.issuer,
      date:   c.date,
    })),
  };

  const isLight    = layout === 'light';
  const cardBg     = isLight ? '#fff'                    : 'rgba(255,255,255,0.05)';
  const cardBorder = isLight ? '1px solid #E2E8F0'       : '1px solid rgba(255,255,255,0.08)';
  const mutedColor = isLight ? '#64748B'                 : `${textColor}80`;
  const bg         = layout === 'gradient'
    ? `linear-gradient(160deg,${bgColor} 0%,#1a0030 50%,#001a30 100%)`
    : bgColor;

  // Nav
  const Nav = () => (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${cardBorder}`, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, fontFamily: font }}>
      <span style={{ color: primaryColor, fontWeight: 800, fontSize: 18 }}>{data.name?.split(' ')[0] || 'Portfolio'}</span>
      <div style={{ display: 'flex', gap: 24 }}>
        {pages.map(p => <a key={p} href={`#${p.toLowerCase()}`} style={{ color: mutedColor, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{p}</a>)}
      </div>
    </nav>
  );

  return (
    <div style={{ background: bg, color: textColor, fontFamily: font, minHeight: '100vh' }}>
      <Nav />

      {/* HERO */}
      <section id="home" style={{ padding: '80px 40px 60px', maxWidth: 860, margin: '0 auto' }}>
        <p style={{ color: primaryColor, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Hi, I'm</p>
        <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, marginBottom: 14, color: textColor }}>{data.name || 'Your Name'}</h1>
        <h2 style={{ fontSize: 22, color: accentColor, fontWeight: 600, marginBottom: 18 }}>{data.professionalTitle || ''}</h2>
        {data.summary && <p style={{ fontSize: 15, color: mutedColor, maxWidth: 580, lineHeight: 1.75, marginBottom: 30 }}>{data.summary}</p>}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {data.github   && <a href={`https://github.com/${data.github}`}          target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', border:`1px solid ${cardBorder}`, borderRadius:8, color:textColor, textDecoration:'none', fontSize:14 }}><Github size={15}/> GitHub</a>}
          {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`}   target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', border:`1px solid ${cardBorder}`, borderRadius:8, color:textColor, textDecoration:'none', fontSize:14 }}><Linkedin size={15}/> LinkedIn</a>}
          {data.email    && <a href={`mailto:${data.email}`}                        style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:primaryColor, borderRadius:8, color:'#fff', textDecoration:'none', fontSize:14, fontWeight:600 }}><Mail size={15}/> Contact Me</a>}
        </div>
      </section>

      {/* ABOUT */}
      {(data.summary || data.email) && (
        <section id="about" style={{ padding: '60px 40px', maxWidth: 860, margin: '0 auto' }}>
          <SectionTitle title="About Me" primary={primaryColor} light={isLight} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
            <p style={{ color: mutedColor, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{data.summary || 'No summary provided.'}</p>
            <div style={{ background: cardBg, border: cardBorder, borderRadius: 14, padding: '20px' }}>
              {data.email    && <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}><Mail    size={16} style={{ color:primaryColor }}/><span style={{ fontSize:14, color:textColor }}>{data.email}</span></div>}
              {data.phone    && <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}><Phone   size={16} style={{ color:primaryColor }}/><span style={{ fontSize:14, color:textColor }}>{data.phone}</span></div>}
              {data.city     && <div style={{ display:'flex', alignItems:'center', gap:10 }}><MapPin  size={16} style={{ color:primaryColor }}/><span style={{ fontSize:14, color:textColor }}>{data.city}</span></div>}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {(data.skills||[]).length > 0 && (
        <section id="skills" style={{ padding: '60px 40px', background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <SectionTitle title="Skills" primary={primaryColor} light={isLight} />
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
              {data.skills.map(s => <span key={s} style={{ padding:'8px 18px', background:`${primaryColor}18`, border:`1px solid ${primaryColor}40`, borderRadius:20, color:isLight?primaryColor:textColor, fontSize:14, fontWeight:500 }}>{s}</span>)}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {(data.workExperience||[]).length > 0 && (
        <section id="experience" style={{ padding: '60px 40px', maxWidth: 820, margin: '0 auto' }}>
          <SectionTitle title="Work Experience" primary={primaryColor} light={isLight} />
          {data.workExperience.map((exp, i) => (
            <div key={i} style={{ display:'flex', gap:20, marginBottom:20 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:14, height:14, borderRadius:'50%', background:primaryColor, boxShadow:`0 0 10px ${primaryColor}80`, flexShrink:0 }}/>
                {i < data.workExperience.length-1 && <div style={{ width:2, flex:1, background:`${primaryColor}25`, marginTop:4, minHeight:20 }}/>}
              </div>
              <div style={{ background:cardBg, border:cardBorder, borderRadius:14, padding:'18px 22px', flex:1, marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                  <div>
                    <h3 style={{ color:textColor, fontWeight:700, fontSize:16, margin:0 }}>{exp.title}</h3>
                    <p style={{ color:accentColor, fontSize:14, margin:'3px 0 0', fontWeight:500 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  {exp.duration && <span style={{ padding:'4px 12px', background:`${accentColor}18`, border:`1px solid ${accentColor}35`, borderRadius:20, color:accentColor, fontSize:12, fontWeight:500 }}>{exp.duration}</span>}
                </div>
                {exp.description && <p style={{ color:mutedColor, fontSize:14, lineHeight:1.7, margin:0, whiteSpace:'pre-line' }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {(data.projects||[]).length > 0 && (
        <section id="projects" style={{ padding: '60px 40px', background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <SectionTitle title="Projects" primary={primaryColor} light={isLight} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:18 }}>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ background:cardBg, border:cardBorder, borderTop:`3px solid ${primaryColor}`, borderRadius:14, padding:'20px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <h3 style={{ color:textColor, fontWeight:700, fontSize:16, margin:0 }}>{proj.name}</h3>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" style={{ color:accentColor }}><ExternalLink size={16}/></a>}
                  </div>
                  {proj.tech        && <p style={{ color:primaryColor, fontSize:13, margin:'0 0 8px' }}>🛠 {proj.tech}</p>}
                  {proj.description && <p style={{ color:mutedColor, fontSize:13, lineHeight:1.6, margin:0 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {(data.education||[]).length > 0 && (
        <section id="education" style={{ padding: '60px 40px', maxWidth: 860, margin: '0 auto' }}>
          <SectionTitle title="Education" primary={primaryColor} light={isLight} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {data.education.map((edu, i) => (
              <div key={i} style={{ background:cardBg, border:cardBorder, borderLeft:`4px solid ${primaryColor}`, borderRadius:12, padding:'18px 20px' }}>
                <h3 style={{ color:textColor, fontWeight:700, fontSize:15, margin:'0 0 4px' }}>{edu.degree}</h3>
                <p style={{ color:accentColor, fontSize:13, margin:'0 0 6px', fontWeight:500 }}>{edu.institution}</p>
                <div style={{ display:'flex', gap:12 }}>
                  {edu.duration && <span style={{ color:mutedColor, fontSize:12 }}>{edu.duration}</span>}
                  {edu.gpa      && <span style={{ color:primaryColor, fontSize:12, fontWeight:600 }}>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" style={{ padding: '60px 40px', textAlign: 'center' }}>
        <SectionTitle title="Get In Touch" primary={primaryColor} light={isLight} />
        <p style={{ color:mutedColor, fontSize:15, lineHeight:1.7, marginBottom:28, maxWidth:480, margin:'0 auto 28px' }}>
          I'm open to new opportunities. Feel free to reach out!
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
          {data.email    && <a href={`mailto:${data.email}`} style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 24px', background:primaryColor, color:'#fff', borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:14 }}><Mail size={16}/> {data.email}</a>}
          {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 24px', border:`2px solid ${primaryColor}`, color:isLight?primaryColor:textColor, borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:14 }}><Linkedin size={16}/> LinkedIn</a>}
        </div>
      </section>

      <footer style={{ textAlign:'center', padding:'20px', borderTop:`1px solid ${isLight?'#E2E8F0':'rgba(255,255,255,0.08)'}`, color:mutedColor, fontSize:13 }}>
        Built with SkillFolio · {data.name || 'Portfolio'} · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */
const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    fetchPublicPortfolio(slug)
      .then(p => { setPortfolio(p); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F172A', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(124,58,237,0.3)', borderTop:'3px solid #7C3AED', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'rgba(248,250,252,0.5)', fontSize:14 }}>Loading portfolio…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F172A', flexDirection:'column', gap:12 }}>
      <p style={{ fontSize:48 }}>😕</p>
      <h2 style={{ color:'#F8FAFC', fontSize:22, fontWeight:700, margin:0 }}>Portfolio not found</h2>
      <p style={{ color:'rgba(248,250,252,0.4)', fontSize:14 }}>{error}</p>
      <a href="/" style={{ marginTop:8, padding:'10px 22px', background:'#7C3AED', color:'#fff', borderRadius:8, textDecoration:'none', fontSize:14, fontWeight:600 }}>← Back to SkillFolio</a>
    </div>
  );

  return renderPortfolio(portfolio);
};

export default PublicPortfolioPage;