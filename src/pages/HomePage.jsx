import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, FileCheck2, LayoutTemplate, Globe,
  Download, BarChart3, ArrowRight, CheckCircle, Sparkles,
  Palette, Monitor
} from 'lucide-react';
import './HomePage.css';

const FEATURES = [
  {
    icon: <BrainCircuit size={24} />,
    title: 'AI-Powered Assistant',
    description: 'Get real-time suggestions, professional rephrasing, and intelligent content recommendations as you build your resume.',
    color: 'purple',
  },
  {
    icon: <FileCheck2 size={24} />,
    title: 'ATS Score Calculator',
    description: 'Instantly calculate how well your resume performs against Applicant Tracking Systems for your target role.',
    color: 'cyan',
  },
  {
    icon: <LayoutTemplate size={24} />,
    title: 'Custom Resume Templates',
    description: 'Choose from 6 professionally designed ATS-ready templates or craft your own unique layout from scratch.',
    color: 'purple',
  },
  {
    icon: <Monitor size={24} />,
    title: 'Web Portfolio Generator',
    description: 'Generate a full personal portfolio website from your resume data. Choose from tech-themed templates, customize colors, fonts, section order, and publish your own portfolio link instantly.',
    color: 'cyan',
    highlight: true,
  },
  {
    icon: <Palette size={24} />,
    title: 'Portfolio Customization',
    description: `Fully customize your portfolio's look — page order, section order, fonts, colors, and layout styles. Build it your way or use a ready-made tech template.`,
    color: 'purple',
  },
  {
    icon: <Download size={24} />,
    title: 'Easy PDF Export',
    description: 'Export your polished resume as a high-quality PDF, perfectly formatted and ready to submit anywhere.',
    color: 'cyan',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Skill Analytics',
    description: 'Analyze your skill set, identify gaps, and receive role-specific recommendations to maximize your chances.',
    color: 'purple',
  },
  {
    icon: <Globe size={24} />,
    title: 'One-Click Publishing',
    description: 'Publish your portfolio site with a single click and get a shareable skillfolio.app link you can put on your resume and LinkedIn.',
    color: 'cyan',
  },
];

const WHY_ITEMS = [
  'ATS-optimized templates trusted by top engineers',
  'Real-time skill gap analysis for your dream role',
  'Generate a full portfolio website from your resume data',
  'One-click portfolio publishing with a shareable link',
  'Intelligent AI writing assistant built-in',
  'Role-specific keyword recommendations',
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg-orb orb-1" />
        <div className="hero-bg-orb orb-2" />
        <div className="container hero-content">
          <div className="hero-badge animate-fadeInUp">
            <Sparkles size={14} />
            AI-Powered Resume & Portfolio Builder
          </div>
          <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Build Resumes &amp; Portfolios<br />
            <span className="hero-highlight">That Get You Hired</span>
          </h1>
          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Create ATS-optimized resumes and stunning personal portfolio websites with intelligent
            AI assistance, real-time skill analytics, and beautiful tech-themed templates — all in one place.
          </p>
          <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <button className="btn-primary hero-cta" onClick={() => navigate('/signin')}>
              Get Started Free <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-trust animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="trust-avatars">
              {['A', 'R', 'S', 'K'].map((l, i) => (
                <div key={i} className="trust-avatar" style={{ left: i * 22 }}>{l}</div>
              ))}
            </div>
            <p>Trusted by <strong>10,000+</strong> engineers &amp; developers</p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO HIGHLIGHT BANNER */}
      <section className="portfolio-banner-section">
        <div className="container">
          <div className="portfolio-banner">
            <div className="portfolio-banner-orb" />
            <div className="portfolio-banner-left">
              <span className="banner-badge"><Monitor size={14} /> New Feature</span>
              <h2 className="banner-title">Web Portfolio Generator</h2>
              <p className="banner-desc">
                Enter your details once, then generate both a polished ATS resume <em>and</em> a
                full personal portfolio website. Pick from tech-themed templates, customise colors,
                fonts, and page/section order, then publish and share your portfolio link.
              </p>
              <div className="banner-pills">
                <span className="banner-pill">6 Tech Templates</span>
                <span className="banner-pill">Custom Colors &amp; Fonts</span>
                <span className="banner-pill">Drag Section Order</span>
                <span className="banner-pill">Instant Publish</span>
              </div>
              <button className="btn-primary banner-btn" onClick={() => navigate('/signin')}>
                Try Portfolio Builder <ArrowRight size={16} />
              </button>
            </div>
            <div className="portfolio-banner-right">
              <div className="portfolio-mockup">
                <div className="pm-bar">
                  <span className="pm-dot" style={{ background: '#EF4444' }} />
                  <span className="pm-dot" style={{ background: '#F59E0B' }} />
                  <span className="pm-dot" style={{ background: '#10B981' }} />
                  <span className="pm-url">skillfolio.app/yourname</span>
                </div>
                <div className="pm-body">
                  <div className="pm-hero-block">
                    <div className="pm-avatar" />
                    <div className="pm-hero-text">
                      <div className="pm-line w80 bold" />
                      <div className="pm-line w55 accent" />
                      <div className="pm-line w70" />
                    </div>
                  </div>
                  <div className="pm-section">
                    <div className="pm-section-title" />
                    <div className="pm-chips">
                      {[60, 45, 70, 50, 65, 40].map((w, i) => (
                        <div key={i} className="pm-chip" style={{ width: w }} />
                      ))}
                    </div>
                  </div>
                  <div className="pm-section">
                    <div className="pm-section-title" />
                    <div className="pm-card-row">
                      <div className="pm-card" />
                      <div className="pm-card" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-eyebrow">What We Offer</p>
            <h2 className="section-title">Everything You Need to<br />Land Your Next Role</h2>
            <p className="section-subtitle">
              SkillFolio combines intelligent tools to give you an unfair advantage in your job search.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card feature-${f.color} ${f.highlight ? 'feature-highlight' : ''}`}>
                <div className={`feature-icon-wrap icon-${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SKILLFOLIO */}
      <section className="section why-section">
        <div className="container why-inner">
          <div className="why-left">
            <p className="section-eyebrow">Why SkillFolio</p>
            <h2 className="section-title">Resume + Portfolio,<br />Together in One Place</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              We understand what technical recruiters look for. SkillFolio is built specifically
              for engineering and technology professionals who want to stand out — both on paper
              and online.
            </p>
            <ul className="why-list">
              {WHY_ITEMS.map((item, i) => (
                <li key={i} className="why-item">
                  <CheckCircle size={18} className="check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary" style={{ marginTop: 32 }} onClick={() => navigate('/signin')}>
              Start Building <ArrowRight size={16} />
            </button>
          </div>
          <div className="why-right">
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-dot red" />
                <div className="mockup-dot yellow" />
                <div className="mockup-dot green" />
                <span>ATS Score Report</span>
              </div>
              <div className="mockup-body">
                <div className="ats-score-display">
                  <div className="ats-score-ring">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="10"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#7C3AED" strokeWidth="10"
                        strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round"
                        transform="rotate(-90 60 60)"/>
                    </svg>
                    <div className="ats-score-num">
                      <span className="score-val">88</span>
                      <span className="score-max">/100</span>
                    </div>
                  </div>
                  <div className="ats-score-details">
                    {[['Skills Match','85%','#7C3AED',85],['Keywords','90%','#06B6D4',90],['Format','95%','#10B981',95],['Experience','78%','#F59E0B',78]].map(([l,v,c,w]) => (
                      <div key={l} className="score-item">
                        <span>{l}</span>
                        <div className="score-bar"><div style={{ width: `${w}%`, background: c }} /></div>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg-orb" />
            <h2 className="cta-title">Ready to Build Your Resume & Portfolio?</h2>
            <p className="cta-subtitle">Join thousands of engineers who've landed their dream jobs with SkillFolio.</p>
            <button className="btn-primary cta-btn" onClick={() => navigate('/signin')}>
              Sign In &amp; Start Building <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="brand-name">SkillFolio</span>
            <p>Build resumes &amp; portfolios that get you hired.</p>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} SkillFolio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
