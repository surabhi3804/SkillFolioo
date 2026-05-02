import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import './PortfolioTemplatesPage.css';



/* ─── Template definitions ─────────────────────────────────────── */
export const PORTFOLIO_TEMPLATES = [
  {
    id: 'midnight-dev',
    name: 'Midnight Dev',
    description: 'Dark portfolio with purple-to-pink gradient name, typing animation hero, and neon skill tags.',
    tags: ['Dark', 'Developer', 'Modern'],
    accent: '#7C3AED',
    theme: 'dark',
    defaultStyle: { layout: 'dark', primaryColor: '#7C3AED', accentColor: '#06B6D4', bgColor: '#0A0A0F', textColor: '#F8FAFC' },
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'Bright professional layout with a split hero, photo placeholder, and card-based skills grid.',
    tags: ['Light', 'Professional', 'Clean'],
    accent: '#6D28D9',
    theme: 'light',
    defaultStyle: { layout: 'light', primaryColor: '#6D28D9', accentColor: '#0EA5E9', bgColor: '#FFFFFF', textColor: '#1E293B' },
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Bold gradient hero with oversized animated text. Designed for designers and creatives.',
    tags: ['Gradient', 'Creative', 'Bold'],
    accent: '#EC4899',
    theme: 'dark',
    defaultStyle: { layout: 'gradient', primaryColor: '#EC4899', accentColor: '#F59E0B', bgColor: '#0D0221', textColor: '#F8FAFC' },
  },
  {
    id: 'glass-dark',
    name: 'Glassmorphism',
    description: 'Frosted glass cards over a deep aurora background. Includes timeline experience and glowing nav.',
    tags: ['Dark', 'Glass', 'Sleek'],
    accent: '#0EA5E9',
    theme: 'dark',
    defaultStyle: { layout: 'dark', primaryColor: '#0EA5E9', accentColor: '#8B5CF6', bgColor: '#060B18', textColor: '#E0F2FE' },
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Ultra-clean white portfolio with strong black typography, red accents, and a listed works section.',
    tags: ['Light', 'Minimal', 'Elegant'],
    accent: '#DC2626',
    theme: 'light',
    defaultStyle: { layout: 'light', primaryColor: '#18181B', accentColor: '#DC2626', bgColor: '#FAFAFA', textColor: '#18181B' },
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Electric cyan and purple neon on jet black. Skill cards glow, timeline pulses, perfect for tech standouts.',
    tags: ['Dark', 'Neon', 'Tech'],
    accent: '#22D3EE',
    theme: 'dark',
    defaultStyle: { layout: 'dark', primaryColor: '#22D3EE', accentColor: '#A855F7', bgColor: '#020817', textColor: '#E2E8F0' },
  },
];

/* ─── Mini Website Previews ────────────────────────────────────── */
const MiniPreview = ({ template }) => {
  const previews = {

    'midnight-dev': (
      <div style={{ background: '#0A0A0F', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid rgba(124,58,237,0.2)', flexShrink: 0 }}>
          <div style={{ background: 'linear-gradient(90deg,#7C3AED,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 10, fontWeight: 700 }}>Surabhi Tyagi</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {['Home','About','Skills','Projects','Contact'].map((l,i) => (
              <div key={i} style={{ fontSize: 7, color: i===0 ? '#7C3AED' : 'rgba(255,255,255,0.4)', borderBottom: i===0 ? '1px solid #7C3AED' : 'none', paddingBottom: 1 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '18px 14px 10px', flexShrink: 0 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Hi, I'm</div>
          <div style={{ fontSize: 16, fontWeight: 800, background: 'linear-gradient(90deg,#fff 30%,#7C3AED,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2, marginBottom: 4 }}>Surabhi Tyagi</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Web Developer</div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 10, maxWidth: '80%' }}>Passionate about creating elegant solutions to complex problems.</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ height: 16, width: 56, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 6.5, color: '#fff', fontWeight: 600 }}>View Projects</span>
            </div>
            <div style={{ height: 16, width: 50, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.7)' }}>Contact Me</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(124,58,237,0.15)', marginTop: 'auto' }}>
          <div style={{ fontSize: 7, color: '#7C3AED', marginBottom: 5, fontWeight: 600 }}>Skills & Expertise</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {['React','Node.js','Python','MongoDB','CSS'].map((s,i) => (
              <div key={i} style={{ fontSize: 6, padding: '2px 7px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 10, color: '#a78bfa' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    ),

    'clean-light': (
      <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #E2E8F0', flexShrink: 0, background: '#fff' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9' }}>Portfolio</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Home','About','Skills','Projects','Contact'].map((l,i) => (
              <div key={i} style={{ fontSize: 7, color: i===0 ? '#6D28D9' : '#64748B', borderBottom: i===0 ? '1.5px solid #6D28D9' : 'none', paddingBottom: 1 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 7, color: '#6D28D9', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Hello, I'm</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', lineHeight: 1.2, marginBottom: 4 }}>Your Name</div>
            <div style={{ fontSize: 8, color: '#6D28D9', fontWeight: 600, marginBottom: 6 }}>Web Developer</div>
            <div style={{ fontSize: 7, color: '#64748B', lineHeight: 1.6, marginBottom: 10 }}>Passionate about building beautiful web experiences.</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ height: 16, width: 52, background: '#6D28D9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 6, color: '#fff', fontWeight: 600 }}>View Work</span>
              </div>
              <div style={{ height: 16, width: 44, border: '1.5px solid #6D28D9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 6, color: '#6D28D9', fontWeight: 600 }}>Contact</span>
              </div>
            </div>
          </div>
          <div style={{ width: '38%', background: 'linear-gradient(160deg,#F3F0FF,#E0F2FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff', fontWeight: 700, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(109,40,217,0.3)' }}>S</div>
          </div>
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
            {[['⚡','Frontend'],['🛠','Tools'],['🗄','Backend']].map(([icon, label], i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 6px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, background: `rgba(109,40,217,${0.1 + i * 0.08})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>{icon}</div>
                <span style={{ fontSize: 6.5, fontWeight: 600, color: '#334155' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    'creative-gradient': (
      <div style={{ background: 'linear-gradient(135deg,#0D0221 0%,#1a0535 50%,#0D0221 100%)', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 30, left: '40%', width: 80, height: 80, background: 'rgba(236,72,153,0.2)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg,#EC4899,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>S</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Work','About','Contact'].map((l,i) => <div key={i} style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>{l}</div>)}
          </div>
        </div>
        <div style={{ padding: '12px 14px 0', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ fontSize: 7, color: 'rgba(245,158,11,0.8)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Creative Developer</div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>
            <span style={{ color: '#fff' }}>Making</span><br/>
            <span style={{ background: 'linear-gradient(90deg,#EC4899,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Art</span>
          </div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 10 }}>Turning ideas into immersive digital experiences.</div>
          <div style={{ height: 18, width: 80, background: 'linear-gradient(90deg,#EC4899,#F59E0B)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 7, color: '#fff', fontWeight: 700 }}>See My Work ✦</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, padding: '10px 14px 14px', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
          {[['#EC4899','Project 1'],['#F59E0B','Project 2'],['#8B5CF6','Project 3']].map(([c, label], i) => (
            <div key={i} style={{ height: 36, background: 'rgba(255,255,255,0.04)', border: `1px solid ${c}30`, borderTop: `2px solid ${c}`, borderRadius: 8, padding: '5px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ height: 3, width: '70%', background: `${c}80`, borderRadius: 2, marginBottom: 2 }} />
              <div style={{ height: 2, width: '50%', background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
            </div>
          ))}
        </div>
      </div>
    ),

    'glass-dark': (
      <div style={{ background: 'linear-gradient(135deg,#060B18 0%,#0D1B2A 100%)', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, width: 70, height: 70, background: 'rgba(14,165,233,0.15)', borderRadius: '50%', filter: 'blur(25px)' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 10, width: 60, height: 60, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', filter: 'blur(20px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(14,165,233,0.15)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0EA5E9' }}>Portfolio</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {['Home','About','Skills','Contact'].map((l,i) => <div key={i} style={{ fontSize: 7, color: 'rgba(224,242,254,0.4)' }}>{l}</div>)}
          </div>
        </div>
        <div style={{ padding: '14px 14px 8px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ fontSize: 7, color: 'rgba(14,165,233,0.8)', fontWeight: 600, marginBottom: 5, letterSpacing: 1.5, textTransform: 'uppercase' }}>Welcome to my portfolio</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#E0F2FE', lineHeight: 1.2, marginBottom: 4 }}>Your Name</div>
          <div style={{ fontSize: 8.5, color: '#0EA5E9', fontWeight: 600, marginBottom: 8 }}>Full Stack Developer</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 14px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          {[['About Me','Passionate developer...'],['Experience','2+ years building...']].map(([title, desc], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '8px 9px' }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#E0F2FE', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 6.5, color: 'rgba(224,242,254,0.5)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 14px 12px', position: 'relative', zIndex: 1, marginTop: 8 }}>
          <div style={{ fontSize: 7, color: '#0EA5E9', fontWeight: 600, marginBottom: 6 }}>Experience</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0EA5E9', boxShadow: '0 0 8px rgba(14,165,233,0.6)' }} />
              <div style={{ width: 1, height: 20, background: 'rgba(14,165,233,0.3)' }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, padding: '5px 8px', flex: 1 }}>
              <div style={{ fontSize: 7, fontWeight: 600, color: '#E0F2FE' }}>Software Engineer</div>
              <div style={{ fontSize: 6, color: '#0EA5E9' }}>Company Name · 2023–Present</div>
            </div>
          </div>
        </div>
      </div>
    ),

    'minimal-light': (
      <div style={{ background: '#FAFAFA', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderBottom: '1px solid #E4E4E7', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#18181B', letterSpacing: -0.5 }}>YN.</div>
          <div style={{ display: 'flex', gap: 9 }}>
            {['Work','About','Contact'].map((l,i) => <div key={i} style={{ fontSize: 7, color: '#71717A', fontWeight: 500 }}>{l}</div>)}
          </div>
        </div>
        <div style={{ padding: '18px 14px 10px', borderBottom: '1px solid #E4E4E7', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ height: 2, width: 20, background: '#DC2626' }} />
            <div style={{ fontSize: 7, color: '#DC2626', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>Available for work</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#18181B', lineHeight: 1.15, marginBottom: 6, letterSpacing: -0.5 }}>
            Crafting<br/><span style={{ color: '#DC2626' }}>Digital</span> Experiences
          </div>
          <div style={{ fontSize: 7, color: '#71717A', lineHeight: 1.6, marginBottom: 10 }}>Full-stack developer focused on clean, performant interfaces.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 18, width: 52, background: '#18181B', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 6.5, color: '#fff', fontWeight: 700 }}>View Work</span></div>
            <div style={{ fontSize: 6.5, color: '#DC2626', fontWeight: 600 }}>Resume ↗</div>
          </div>
        </div>
        <div style={{ padding: '8px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: '#18181B', textTransform: 'uppercase', letterSpacing: 1 }}>Selected Work</div>
            <div style={{ fontSize: 6.5, color: '#DC2626' }}>View all →</div>
          </div>
          {[['E-Commerce Platform','React, Node.js'],['Portfolio Website','Next.js, Tailwind'],['Chat App','Socket.io, MongoDB']].map(([name, tech], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #E4E4E7' }}>
              <span style={{ fontSize: 7, fontWeight: 600, color: '#27272A' }}>{name}</span>
              <span style={{ fontSize: 6, color: '#A1A1AA' }}>{tech}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    'neon-cyber': (
      <div style={{ background: '#020817', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(34,211,238,0.015) 3px,rgba(34,211,238,0.015) 4px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid rgba(34,211,238,0.15)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, background: '#22D3EE', borderRadius: 2, boxShadow: '0 0 8px #22D3EE' }} />
            <div style={{ fontSize: 9, fontWeight: 700, color: '#22D3EE', letterSpacing: 1 }}>NEXUS</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Home','Skills','Projects','Contact'].map((l,i) => <div key={i} style={{ fontSize: 7, color: 'rgba(226,232,240,0.35)', letterSpacing: 0.5 }}>{l}</div>)}
          </div>
        </div>
        <div style={{ padding: '14px 14px 8px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ fontSize: 7, color: 'rgba(168,85,247,0.8)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>// Full Stack Developer</div>
          <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.15, marginBottom: 4 }}>
            <span style={{ color: '#E2E8F0' }}>Hi, I'm </span>
            <span style={{ color: '#22D3EE', textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>Your Name</span>
          </div>
          <div style={{ fontSize: 7, color: 'rgba(226,232,240,0.4)', lineHeight: 1.6, marginBottom: 10 }}>Building the future with code and creativity.</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ height: 17, width: 60, background: 'linear-gradient(90deg,#22D3EE,#A855F7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(34,211,238,0.4)' }}>
              <span style={{ fontSize: 6.5, color: '#000', fontWeight: 700 }}>View Projects</span>
            </div>
            <div style={{ height: 17, width: 50, border: '1px solid rgba(34,211,238,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 6.5, color: '#22D3EE' }}>GitHub</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 14px 8px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[['React','#22D3EE'],['Node.js','#A855F7'],['Python','#22D3EE'],['AWS','#A855F7'],['Docker','#22D3EE']].map(([s,c],i) => (
              <div key={i} style={{ fontSize: 6, padding: '2px 7px', background: `${c}10`, border: `1px solid ${c}40`, borderRadius: 10, color: c, boxShadow: `0 0 6px ${c}20` }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, padding: '0 14px 12px', position: 'relative', zIndex: 1, marginTop: 'auto' }}>
          {[['#22D3EE','Project Alpha'],['#A855F7','Project Beta']].map(([c, name], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c}25`, borderTop: `2px solid ${c}`, borderRadius: 8, padding: '6px 8px', boxShadow: `0 0 10px ${c}10` }}>
              <div style={{ fontSize: 7, fontWeight: 600, color: '#E2E8F0', marginBottom: 3 }}>{name}</div>
              <div style={{ height: 2, width: '60%', background: `${c}60`, borderRadius: 1 }} />
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return previews[template.id] || (
    <div style={{ background: '#f0f0f0', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ height: 4, width: '50%', background: '#ccc', borderRadius: 2 }} />
    </div>
  );
};

/* ─── Template Card ────────────────────────────────────────────── */
const PortfolioTemplateCard = ({ template, isSelected, onSelect }) => (
  <div
    className={`ptpl-card ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(template)}
  >
    {isSelected && (
      <div className="ptpl-selected-badge">
        <CheckCircle size={13} /> Selected
      </div>
    )}
    <div className={`ptpl-theme-badge ${template.theme}`}>
      {template.theme === 'light' ? <Sun size={10} /> : <Moon size={10} />}
      {template.theme === 'light' ? 'Light' : 'Dark'}
    </div>
    <div className="ptpl-preview">
      <MiniPreview template={template} />
    </div>
    <div className="ptpl-info">
      <div className="ptpl-name-row">
        <h3 className="ptpl-name">{template.name}</h3>
        <div className="ptpl-color-dot" style={{ background: template.accent }} />
      </div>
      <p className="ptpl-desc">{template.description}</p>
      <div className="ptpl-tags">
        {template.tags.map(t => (
          <span key={t} className="ptpl-tag-badge tag-std">{t}</span>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Main Page ────────────────────────────────────────────────── */
const PortfolioTemplatesPage = () => {
  const navigate = useNavigate();
  const {
    selectedPortfolioTemplate,
    setSelectedPortfolioTemplate,
    portfolioStyle,
    setPortfolioStyle,
  } = useApp();

  const handleSelect = (template) => {
    setSelectedPortfolioTemplate(template.id);
    setPortfolioStyle(prev => ({ ...prev, ...template.defaultStyle }));
  };

  const handleCustomise = () => {
    if (!selectedPortfolioTemplate) return;
    navigate('/portfolio/customize');
  };

  return (
    <div className="ptpl-page">
      <div className="container">
        <div className="ptpl-header">
          <p className="section-eyebrow"><Sparkles size={13} /> Portfolio Builder — Step 1 of 3</p>
          <h1 className="ptpl-title">Choose Your Portfolio Style</h1>
          <p className="ptpl-subtitle">
            Pick a website template that matches your personality. Fully customise colours,
            fonts, and sections in the next step.
          </p>
          <div className="ptpl-filter-row">
            <span className="ptpl-filter-label">Filter:</span>
            <span className="ptpl-filter-chip all active">All</span>
            <span className="ptpl-filter-chip light"><Sun size={11} /> Light</span>
            <span className="ptpl-filter-chip dark"><Moon size={11} /> Dark</span>
          </div>
        </div>

        <div className="ptpl-grid">
          {PORTFOLIO_TEMPLATES.map(template => (
            <PortfolioTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedPortfolioTemplate === template.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="ptpl-footer">

          {/* ── Selected info ── */}
          {selectedPortfolioTemplate && (
            <div className="ptpl-selected-info animate-fadeIn">
              <CheckCircle size={18} color="var(--success)" />
              <span>
                <strong>
                  {PORTFOLIO_TEMPLATES.find(t => t.id === selectedPortfolioTemplate)?.name}
                </strong>{' '}selected
              </span>
            </div>
          )}

          <button
            className="btn-primary ptpl-continue-btn"
            onClick={handleCustomise}
            disabled={!selectedPortfolioTemplate}
          >
            Customise Portfolio <ArrowRight size={17} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplatesPage;