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

const ST = ({ title, primary, light }) => (
  <div style={{ textAlign:'center', marginBottom:36 }}>
    <h2 style={{ fontSize:30, fontWeight:800, color:light?'#1E293B':'#fff', marginBottom:8 }}>{title}</h2>
    <div style={{ width:44, height:3, background:primary, borderRadius:2, margin:'0 auto' }} />
  </div>
);

/* ── MIDNIGHT DEV ──────────────────────────────────────────── */
const MidnightDev = ({ data, style, pages }) => {
  const P = style.primaryColor, A = style.accentColor;
  const [cur, setCur] = useState(true);
  useEffect(() => { const t = setInterval(() => setCur(c=>!c), 530); return ()=>clearInterval(t); }, []);
  return (
    <div style={{ background:'#0A0A0F', color:'#F8FAFC', fontFamily:'Inter,sans-serif', minHeight:'100%' }}>
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(10,10,15,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(124,58,237,0.2)',padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:60 }}>
        <span style={{ background:`linear-gradient(90deg,${P},#EC4899)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:800,fontSize:18 }}>{data.name?.split(' ')[0]||'Portfolio'}</span>
        <div style={{ display:'flex',gap:24 }}>{pages.map(p=><a key={p} href="#" onClick={e=>e.preventDefault()} style={{ color:'rgba(248,250,252,0.45)',fontSize:14,textDecoration:'none' }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding:'80px 40px 60px',maxWidth:860,margin:'0 auto' }}>
        <p style={{ color:'rgba(248,250,252,0.4)',fontSize:14,marginBottom:10 }}>Hi, I'm</p>
        <h1 style={{ fontSize:56,fontWeight:900,lineHeight:1.05,marginBottom:14,background:`linear-gradient(90deg,#fff 30%,${P},#EC4899)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{data.name||'Your Name'}</h1>
        <div style={{ fontSize:22,color:A,fontWeight:600,marginBottom:18,display:'flex',alignItems:'center',gap:3 }}>
          {data.professionalTitle||'Your Title'}
          <span style={{ display:'inline-block',width:2,height:26,background:P,marginLeft:4,opacity:cur?1:0,transition:'opacity 0.1s' }}/>
        </div>
        {data.summary&&<p style={{ fontSize:15,color:'rgba(248,250,252,0.5)',maxWidth:580,lineHeight:1.75,marginBottom:30 }}>{data.summary}</p>}
        <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
          {data.github&&<a href={`https://github.com/${data.github}`} target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 22px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,color:'#F8FAFC',textDecoration:'none',fontSize:14 }}><Github size={15}/> GitHub</a>}
          {data.email&&<a href={`mailto:${data.email}`} style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 22px',background:P,borderRadius:8,color:'#fff',textDecoration:'none',fontSize:14,fontWeight:600 }}><Mail size={15}/> Contact</a>}
        </div>
      </section>
      {(data.skills||[]).length>0&&<section style={{ padding:'40px',borderTop:'1px solid rgba(124,58,237,0.12)',borderBottom:'1px solid rgba(124,58,237,0.12)',background:'rgba(124,58,237,0.04)' }}>
        <p style={{ textAlign:'center',color:P,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',marginBottom:20 }}>Skills</p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center' }}>{data.skills.map(s=><span key={s} style={{ padding:'7px 18px',background:`${P}18`,border:`1px solid ${P}45`,borderRadius:20,color:'#a78bfa',fontSize:13 }}>{s}</span>)}</div>
      </section>}
      {(data.workExperience||[]).length>0&&<section style={{ padding:'70px 40px',maxWidth:820,margin:'0 auto' }}>
        <ST title="Work Experience" primary={P}/>
        {data.workExperience.map((exp,i)=>(
          <div key={i} style={{ display:'flex',gap:22,paddingBottom:24 }}>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}>
              <div style={{ width:14,height:14,borderRadius:'50%',background:P,boxShadow:`0 0 12px ${P}90`,flexShrink:0 }}/>
              {i<data.workExperience.length-1&&<div style={{ width:2,flex:1,background:`${P}25`,marginTop:6,minHeight:20 }}/>}
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(124,58,237,0.2)',borderRadius:14,padding:'18px 22px',flex:1,marginBottom:8 }}>
              <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:8 }}>
                <div><h3 style={{ color:'#F8FAFC',fontWeight:700,fontSize:17,margin:0 }}>{exp.title}</h3><p style={{ color:A,fontSize:14,margin:'3px 0 0',fontWeight:500 }}>{exp.company}{exp.location?` · ${exp.location}`:''}</p></div>
                {exp.duration&&<span style={{ padding:'4px 12px',background:`${A}18`,border:`1px solid ${A}40`,borderRadius:20,color:A,fontSize:12,fontWeight:500 }}>{exp.duration}</span>}
              </div>
              {exp.description&&<p style={{ color:'rgba(248,250,252,0.55)',fontSize:14,lineHeight:1.7,margin:0,whiteSpace:'pre-line' }}>{exp.description}</p>}
            </div>
          </div>
        ))}
      </section>}
      {(data.projects||[]).length>0&&<section style={{ padding:'70px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Projects" primary={P}/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18 }}>
          {data.projects.map((proj,i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(124,58,237,0.2)',borderTop:`3px solid ${P}`,borderRadius:14,padding:'20px' }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}><h3 style={{ color:'#F8FAFC',fontWeight:700,fontSize:16,margin:0 }}>{proj.name}</h3>{proj.link&&<a href={proj.link} target="_blank" rel="noreferrer" style={{ color:A }}><ExternalLink size={16}/></a>}</div>
              {proj.tech&&<p style={{ color:P,fontSize:13,margin:'0 0 8px' }}>🛠 {proj.tech}</p>}
              {proj.description&&<p style={{ color:'rgba(248,250,252,0.5)',fontSize:13,lineHeight:1.6,margin:0 }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      </section>}
      {(data.education||[]).length>0&&<section style={{ padding:'70px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Education" primary={P}/>
        {data.education.map((edu,i)=><div key={i} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(124,58,237,0.18)',borderLeft:`4px solid ${P}`,borderRadius:12,padding:'16px 18px',marginBottom:12 }}>
          <h3 style={{ color:'#F8FAFC',fontWeight:700,fontSize:15,margin:'0 0 4px' }}>{edu.degree}</h3>
          <p style={{ color:A,fontSize:13,margin:'0 0 4px' }}>{edu.institution}</p>
          {edu.duration&&<span style={{ color:'rgba(248,250,252,0.4)',fontSize:12 }}>{edu.duration}</span>}
          {edu.gpa&&<span style={{ color:P,fontSize:12,fontWeight:600,marginLeft:10 }}>GPA: {edu.gpa}</span>}
        </div>)}
      </section>}
      <section style={{ padding:'70px 40px',maxWidth:600,margin:'0 auto',textAlign:'center' }}>
        <ST title="Get In Touch" primary={P}/>
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          {data.email&&<a href={`mailto:${data.email}`} style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 18px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(124,58,237,0.18)',borderRadius:12,color:'#F8FAFC',textDecoration:'none',justifyContent:'center' }}><Mail size={18} style={{ color:P }}/>{data.email}</a>}
          {data.phone&&<div style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 18px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(124,58,237,0.18)',borderRadius:12,justifyContent:'center' }}><Phone size={18} style={{ color:P }}/><span style={{ color:'#F8FAFC' }}>{data.phone}</span></div>}
        </div>
      </section>
      <footer style={{ textAlign:'center',padding:'24px',borderTop:'1px solid rgba(124,58,237,0.12)',color:'rgba(248,250,252,0.25)',fontSize:13 }}>Built with SkillFolio · {data.name||'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ── CLEAN LIGHT ───────────────────────────────────────────── */
const CleanLight = ({ data, style, pages }) => {
  const P = style.primaryColor, A = style.accentColor;
  return (
    <div style={{ background:'#fff',color:'#1E293B',fontFamily:'Inter,sans-serif',minHeight:'100%' }}>
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(10px)',borderBottom:'1px solid #E2E8F0',padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64 }}>
        <span style={{ color:P,fontWeight:800,fontSize:20 }}>{data.name?.split(' ')[0]||'Portfolio'}</span>
        <div style={{ display:'flex',gap:28 }}>{pages.map(p=><a key={p} href="#" onClick={e=>e.preventDefault()} style={{ color:'#64748B',fontSize:14,textDecoration:'none',fontWeight:500 }}>{p}</a>)}</div>
      </nav>
      <section style={{ display:'grid',gridTemplateColumns:'1fr 380px',minHeight:480,maxWidth:960,margin:'0 auto',padding:'0 40px',alignItems:'center',gap:48 }}>
        <div>
          <p style={{ color:P,fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:2.5,marginBottom:14 }}>Hello, I'm</p>
          <h1 style={{ fontSize:52,fontWeight:900,lineHeight:1.05,color:'#0F172A',marginBottom:12,letterSpacing:-1 }}>{data.name||'Your Name'}</h1>
          <h2 style={{ fontSize:22,color:P,fontWeight:600,marginBottom:18 }}>{data.professionalTitle||'Your Title'}</h2>
          {data.summary&&<p style={{ fontSize:15,color:'#64748B',lineHeight:1.75,marginBottom:30,maxWidth:460 }}>{data.summary}</p>}
          <div style={{ display:'flex',gap:14 }}>
            <a href={data.email?`mailto:${data.email}`:'#'} style={{ padding:'13px 26px',background:P,color:'#fff',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15 }}>Get In Touch</a>
            <a href={data.github?`https://github.com/${data.github}`:'#'} target="_blank" rel="noreferrer" style={{ padding:'13px 26px',border:`2px solid ${P}`,color:P,borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15 }}>View Work</a>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${P}12,${A}12)`,borderRadius:24,height:380 }}>
          <div style={{ width:170,height:170,borderRadius:'50%',background:`linear-gradient(135deg,${P},${A})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:68,color:'#fff',fontWeight:900,border:'6px solid #fff',boxShadow:`0 12px 40px ${P}35` }}>{data.name?data.name[0].toUpperCase():'Y'}</div>
        </div>
      </section>
      {(data.skills||[]).length>0&&<section style={{ padding:'70px 40px',background:'#F8FAFC' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <ST title="Skills" primary={P} light/>
          <div style={{ display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center' }}>{data.skills.map(s=><span key={s} style={{ padding:'8px 18px',background:'#fff',border:`1.5px solid ${P}30`,borderRadius:20,color:'#334155',fontSize:14,fontWeight:500,boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>{s}</span>)}</div>
        </div>
      </section>}
      {(data.workExperience||[]).length>0&&<section style={{ padding:'70px 40px',maxWidth:820,margin:'0 auto' }}>
        <ST title="Experience" primary={P} light/>
        {data.workExperience.map((exp,i)=>(
          <div key={i} style={{ display:'flex',gap:24,marginBottom:24,alignItems:'flex-start' }}>
            <div style={{ width:50,height:50,borderRadius:14,background:`${P}15`,border:`2px solid ${P}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:20 }}>💼</div>
            <div style={{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:'20px 24px',flex:1,boxShadow:'0 3px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:8 }}>
                <div><h3 style={{ color:'#0F172A',fontWeight:700,fontSize:17,margin:0 }}>{exp.title}</h3><p style={{ color:P,fontSize:14,margin:'3px 0 0',fontWeight:500 }}>{exp.company}{exp.location?` · ${exp.location}`:''}</p></div>
                {exp.duration&&<span style={{ padding:'4px 12px',background:`${P}10`,border:`1px solid ${P}25`,borderRadius:20,color:P,fontSize:12,fontWeight:500 }}>{exp.duration}</span>}
              </div>
              {exp.description&&<p style={{ color:'#64748B',fontSize:14,lineHeight:1.7,margin:0,whiteSpace:'pre-line' }}>{exp.description}</p>}
            </div>
          </div>
        ))}
      </section>}
      {(data.projects||[]).length>0&&<section style={{ padding:'70px 40px',background:'#F8FAFC' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <ST title="Projects" primary={P} light/>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20 }}>
            {data.projects.map((proj,i)=><div key={i} style={{ background:'#fff',border:'1px solid #E2E8F0',borderTop:`3px solid ${P}`,borderRadius:16,padding:'22px',boxShadow:'0 3px 14px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}><h3 style={{ color:'#0F172A',fontWeight:700,fontSize:16,margin:0 }}>{proj.name}</h3>{proj.link&&<a href={proj.link} target="_blank" rel="noreferrer" style={{ color:A }}><ExternalLink size={16}/></a>}</div>
              {proj.tech&&<p style={{ color:P,fontSize:13,margin:'0 0 8px',fontWeight:500 }}>🛠 {proj.tech}</p>}
              {proj.description&&<p style={{ color:'#64748B',fontSize:13,lineHeight:1.6,margin:0 }}>{proj.description}</p>}
            </div>)}
          </div>
        </div>
      </section>}
      {(data.education||[]).length>0&&<section style={{ padding:'70px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Education" primary={P} light/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
          {data.education.map((edu,i)=><div key={i} style={{ background:'#fff',border:'1px solid #E2E8F0',borderLeft:`4px solid ${P}`,borderRadius:12,padding:'18px 20px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color:'#0F172A',fontWeight:700,fontSize:15,margin:'0 0 4px' }}>{edu.degree}</h3>
            <p style={{ color:P,fontSize:13,margin:'0 0 6px',fontWeight:500 }}>{edu.institution}</p>
            <div style={{ display:'flex',gap:12 }}>{edu.duration&&<span style={{ color:'#94A3B8',fontSize:12 }}>{edu.duration}</span>}{edu.gpa&&<span style={{ color:A,fontSize:12,fontWeight:600 }}>GPA: {edu.gpa}</span>}</div>
          </div>)}
        </div>
      </section>}
      <section style={{ padding:'70px 40px',textAlign:'center' }}>
        <ST title="Get In Touch" primary={P} light/>
        <div style={{ display:'flex',justifyContent:'center',gap:14,flexWrap:'wrap' }}>
          {data.email&&<a href={`mailto:${data.email}`} style={{ display:'flex',alignItems:'center',gap:8,padding:'13px 24px',background:P,color:'#fff',borderRadius:8,textDecoration:'none',fontWeight:600,fontSize:14 }}><Mail size={16}/>{data.email}</a>}
          {data.linkedin&&<a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:8,padding:'13px 24px',border:`2px solid ${P}`,color:P,borderRadius:8,textDecoration:'none',fontWeight:600,fontSize:14 }}><Linkedin size={16}/> LinkedIn</a>}
        </div>
      </section>
      <footer style={{ textAlign:'center',padding:'20px',borderTop:'1px solid #E2E8F0',color:'#94A3B8',fontSize:13 }}>Built with SkillFolio · {data.name||'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ── GENERIC (templates 3-6) ───────────────────────────────── */
const Generic = ({ data, style, pages }) => {
  const { primaryColor:P, accentColor:A, bgColor, textColor:T, layout } = style;
  const isLight = layout==='light';
  const cardBg = isLight?'#fff':'rgba(255,255,255,0.05)';
  const cardBorder = isLight?'1px solid #E2E8F0':'1px solid rgba(255,255,255,0.08)';
  const muted = isLight?'#64748B':`${T}80`;
  const bg = layout==='gradient'?`linear-gradient(160deg,${bgColor} 0%,#1a0030 50%,#001a30 100%)`:bgColor;
  return (
    <div style={{ background:bg,color:T,fontFamily:'Inter,sans-serif',minHeight:'100%' }}>
      <nav style={{ position:'sticky',top:0,zIndex:100,background:isLight?'rgba(255,255,255,0.92)':'rgba(0,0,0,0.6)',backdropFilter:'blur(12px)',borderBottom:cardBorder,padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:62 }}>
        <span style={{ color:P,fontWeight:800,fontSize:18 }}>{data.name?.split(' ')[0]||'Portfolio'}</span>
        <div style={{ display:'flex',gap:24 }}>{pages.map(p=><a key={p} href="#" onClick={e=>e.preventDefault()} style={{ color:muted,fontSize:14,textDecoration:'none' }}>{p}</a>)}</div>
      </nav>
      <section style={{ padding:'80px 40px 60px',maxWidth:860,margin:'0 auto' }}>
        <p style={{ color:P,fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:2,marginBottom:10 }}>Hi, I'm</p>
        <h1 style={{ fontSize:52,fontWeight:900,color:T,lineHeight:1.1,marginBottom:12 }}>{data.name||'Your Name'}</h1>
        <h2 style={{ fontSize:22,color:A,fontWeight:600,marginBottom:16 }}>{data.professionalTitle||'Your Title'}</h2>
        {data.summary&&<p style={{ fontSize:15,color:muted,maxWidth:600,lineHeight:1.75,marginBottom:28 }}>{data.summary}</p>}
        <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
          {data.github&&<a href={`https://github.com/${data.github}`} target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 20px',border:cardBorder,borderRadius:8,color:T,textDecoration:'none',fontSize:14 }}><Github size={15}/> GitHub</a>}
          {data.email&&<a href={`mailto:${data.email}`} style={{ display:'flex',alignItems:'center',gap:6,padding:'10px 20px',background:P,borderRadius:8,color:'#fff',textDecoration:'none',fontSize:14,fontWeight:600 }}><Mail size={15}/> Contact</a>}
        </div>
      </section>
      {(data.skills||[]).length>0&&<section style={{ padding:'60px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Skills" primary={P} light={isLight}/>
        <div style={{ display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center' }}>{data.skills.map(s=><span key={s} style={{ padding:'8px 18px',background:`${P}18`,border:`1px solid ${P}40`,borderRadius:20,color:isLight?P:T,fontSize:14,fontWeight:500 }}>{s}</span>)}</div>
      </section>}
      {(data.workExperience||[]).length>0&&<section style={{ padding:'60px 40px',maxWidth:820,margin:'0 auto' }}>
        <ST title="Work Experience" primary={P} light={isLight}/>
        {data.workExperience.map((exp,i)=>(
          <div key={i} style={{ display:'flex',gap:20,marginBottom:20 }}>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}>
              <div style={{ width:14,height:14,borderRadius:'50%',background:P,boxShadow:`0 0 10px ${P}60` }}/>
              {i<data.workExperience.length-1&&<div style={{ width:2,flex:1,background:`${P}30`,minHeight:20,marginTop:4 }}/>}
            </div>
            <div style={{ background:cardBg,border:cardBorder,borderRadius:14,padding:'18px 22px',flex:1,marginBottom:4 }}>
              <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:8 }}>
                <div><h3 style={{ color:T,fontWeight:700,fontSize:16,margin:0 }}>{exp.title}</h3><p style={{ color:A,fontSize:14,margin:'3px 0 0',fontWeight:500 }}>{exp.company}{exp.location?` · ${exp.location}`:''}</p></div>
                {exp.duration&&<span style={{ padding:'4px 12px',background:`${A}18`,border:`1px solid ${A}35`,borderRadius:20,color:A,fontSize:12,fontWeight:500 }}>{exp.duration}</span>}
              </div>
              {exp.description&&<p style={{ color:muted,fontSize:14,lineHeight:1.65,margin:0,whiteSpace:'pre-line' }}>{exp.description}</p>}
            </div>
          </div>
        ))}
      </section>}
      {(data.projects||[]).length>0&&<section style={{ padding:'60px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Projects" primary={P} light={isLight}/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18 }}>
          {data.projects.map((proj,i)=><div key={i} style={{ background:cardBg,border:cardBorder,borderTop:`3px solid ${P}`,borderRadius:14,padding:'20px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}><h3 style={{ color:T,fontWeight:700,fontSize:16,margin:0 }}>{proj.name}</h3>{proj.link&&<a href={proj.link} target="_blank" rel="noreferrer" style={{ color:A }}><ExternalLink size={16}/></a>}</div>
            {proj.tech&&<p style={{ color:P,fontSize:13,margin:'0 0 8px' }}>🛠 {proj.tech}</p>}
            {proj.description&&<p style={{ color:muted,fontSize:13,lineHeight:1.6,margin:0 }}>{proj.description}</p>}
          </div>)}
        </div>
      </section>}
      {(data.education||[]).length>0&&<section style={{ padding:'60px 40px',maxWidth:860,margin:'0 auto' }}>
        <ST title="Education" primary={P} light={isLight}/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
          {data.education.map((edu,i)=><div key={i} style={{ background:cardBg,border:cardBorder,borderLeft:`4px solid ${P}`,borderRadius:12,padding:'18px 20px' }}>
            <h3 style={{ color:T,fontWeight:700,fontSize:15,margin:'0 0 4px' }}>{edu.degree}</h3>
            <p style={{ color:A,fontSize:13,margin:'0 0 6px',fontWeight:500 }}>{edu.institution}</p>
            <div style={{ display:'flex',gap:12 }}>{edu.duration&&<span style={{ color:muted,fontSize:12 }}>{edu.duration}</span>}{edu.gpa&&<span style={{ color:P,fontSize:12,fontWeight:600 }}>GPA: {edu.gpa}</span>}</div>
          </div>)}
        </div>
      </section>}
      <section style={{ padding:'60px 40px',maxWidth:600,margin:'0 auto',textAlign:'center' }}>
        <ST title="Get In Touch" primary={P} light={isLight}/>
        <div style={{ display:'flex',justifyContent:'center',gap:14,flexWrap:'wrap' }}>
          {data.email&&<a href={`mailto:${data.email}`} style={{ display:'flex',alignItems:'center',gap:8,padding:'12px 22px',background:P,color:'#fff',borderRadius:8,textDecoration:'none',fontWeight:600,fontSize:14 }}><Mail size={16}/>{data.email}</a>}
          {data.linkedin&&<a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:8,padding:'12px 22px',border:`2px solid ${P}`,color:isLight?P:T,borderRadius:8,textDecoration:'none',fontWeight:600,fontSize:14 }}><Linkedin size={16}/> LinkedIn</a>}
        </div>
      </section>
      <footer style={{ textAlign:'center',padding:'20px',borderTop:cardBorder,color:muted,fontSize:13 }}>Built with SkillFolio · {data.name||'Your Name'} · {new Date().getFullYear()}</footer>
    </div>
  );
};

/* ── Router ────────────────────────────────────────────────── */
const PortfolioRenderer = ({ templateId, data, style, pages }) => {
  const p = { data, style, pages };
  switch(templateId) {
    case 'midnight-dev':  return <MidnightDev {...p}/>;
    case 'clean-light':   return <CleanLight {...p}/>;
    default:              return <Generic {...p}/>;
  }
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const PortfolioPreviewPage = () => {
  const navigate = useNavigate();
  const { resumeData, portfolioStyle, selectedPortfolioTemplate, portfolioPublished, setPortfolioPublished, portfolioSlug, setPortfolioSlug, savePortfolioToBackend } = useApp();
  const [copied, setCopied]     = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishErr, setPublishErr] = useState('');

  const tpl  = PORTFOLIO_TEMPLATES.find(t => t.id === selectedPortfolioTemplate);
  const slug = portfolioSlug || (resumeData.name||'yourname').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');

  // ✅ Simple relative path — no URL construction, no protocol issues
  const portfolioPath = `/p/${slug}`;

  const handlePublish = async () => {
    setPublishing(true); setPublishErr('');
    try {
      await savePortfolioToBackend();
      const res = await portfolioAPI.publish();
      setPortfolioSlug(res.slug);
      setPortfolioPublished(true);
    } catch(err) {
      setPublishErr(err.message||'Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = () => {
    // Build URL safely from parts — never use origin or template strings
    const url = 'http://localhost:3000' + portfolioPath;
    navigator.clipboard?.writeText(url).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  // ✅ Use React Router navigate — stays in same app, no new tab, no URL mangling
  const handleVisit = () => navigate(portfolioPath);

  return (
    <div className="pfprev-page">
      <div className="container">
        <div className="pfprev-topbar">
          <button className="btn-ghost back-btn" onClick={()=>navigate('/portfolio/customize')}><ArrowLeft size={15}/> Customize</button>
          <div className="pfprev-topbar-center"><Monitor size={15}/><span>Portfolio Preview</span>{tpl&&<span className="tpl-badge">{tpl.name}</span>}</div>
          <div className="pfprev-actions">
            <button className="btn-secondary" onClick={()=>navigate('/portfolio/customize')}><Edit3 size={15}/> Edit</button>
            {!portfolioPublished
              ? <button className="btn-primary" onClick={handlePublish} disabled={publishing}>{publishing?<span className="publish-dots"><span/><span/><span/></span>:<><Globe size={15}/> Publish Portfolio</>}</button>
              : <button className="btn-success" onClick={handleCopy}>{copied?<><Check size={15}/> Copied!</>:<><Copy size={15}/> Copy Link</>}</button>
            }
          </div>
        </div>

        {publishErr&&<div className="publish-error animate-fadeIn">⚠️ {publishErr}</div>}

        {portfolioPublished&&(
          <div className="published-banner animate-fadeIn">
            <div className="published-banner-left">
              <span className="pub-icon">🎉</span>
              <div>
                <p className="pub-title">Your portfolio is live!</p>
                <code className="pub-url" style={{cursor:'pointer'}} onClick={handleVisit}>localhost:3000{portfolioPath}</code>
              </div>
            </div>
            <div className="pub-actions">
              <button className="btn-ghost pub-copy-btn" onClick={handleCopy}>{copied?<><Check size={13}/> Copied</>:<><Copy size={13}/> Copy URL</>}</button>
              {/* ✅ Button uses navigate() — React Router, zero URL issues */}
              <button className="btn-primary pub-visit-btn" onClick={handleVisit}>
                Visit Site <ExternalLink size={13}/>
              </button>
            </div>
          </div>
        )}

        <div className="browser-wrap">
          <div className="browser-chrome">
            <div className="browser-dots"><span style={{background:'#EF4444'}}/><span style={{background:'#F59E0B'}}/><span style={{background:'#10B981'}}/></div>
            <div className="browser-url-bar"><Globe size={12}/><span>{portfolioPublished?`localhost:3000${portfolioPath}`:'preview — not yet published'}</span></div>
          </div>
          <div className="portfolio-site">
            <PortfolioRenderer
              templateId={selectedPortfolioTemplate}
              data={resumeData}
              style={portfolioStyle}
              pages={portfolioStyle.pageOrder||['Home','About','Projects','Skills','Contact']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreviewPage;