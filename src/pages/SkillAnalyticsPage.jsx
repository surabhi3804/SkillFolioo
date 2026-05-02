//skillanakyticspage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TARGET_ROLES, ROLE_SKILLS, ALL_SKILLS } from '../data/staticData';
import { customRolesAPI } from '../services/api';
import { BarChart3, Check, Plus, Sparkles, TrendingUp, AlertCircle, CheckCircle, Target, X, Zap } from 'lucide-react';
import './SkillAnalyticsPage.css';

const SkillAnalyticsPage = () => {
  const { resumeData, setResumeData, targetRole, setTargetRole } = useApp();
  const [localRole, setLocalRole] = useState(targetRole);
  const [query, setQuery]         = useState('');

  // ── Custom skill input state ──────────────────────────────────
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillError, setCustomSkillError] = useState('');
  const customSkillRef = useRef(null);

  // AI market comparison state
  const [aiTab, setAiTab]               = useState('gap');    // 'gap' | 'market'
  const [marketResult, setMarketResult] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError]   = useState('');
  const [customRoles,     setCustomRoles]     = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRoleLabel, setCustomRoleLabel] = useState('');
  const [customRoleJD,    setCustomRoleJD]    = useState('');
  const [savingRole,      setSavingRole]      = useState(false);

  const userSkills      = resumeData.skills || [];
  const userSkillsLower = userSkills.map(s => s.toLowerCase());

  // Track which skills were added as custom (not from predefined lists)
  const predefinedSkillsLower = ALL_SKILLS.map(s => s.toLowerCase());
  const customAddedSkills     = userSkills.filter(s => !predefinedSkillsLower.includes(s.toLowerCase()));

  const roleSkills      = localRole && localRole !== 'other' ? ROLE_SKILLS[localRole] || [] : [];

  const presentSkills = roleSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
  const missingSkills = roleSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));
  const extraSkills   = userSkills.filter(s => !roleSkills.map(r => r.toLowerCase()).includes(s.toLowerCase()));
  const matchPct      = roleSkills.length > 0 ? Math.round((presentSkills.length / roleSkills.length) * 100) : 0;

  const suggestions = query.length > 1
    ? ALL_SKILLS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !userSkillsLower.includes(s.toLowerCase())).slice(0, 8)
    : [];

  const addSkill    = (skill) => { setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), skill] })); setQuery(''); };
  const removeSkill = (skill) => { setResumeData(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skill) })); };

  // ── Add a fully custom skill ──────────────────────────────────
  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    if (userSkillsLower.includes(trimmed.toLowerCase())) {
      setCustomSkillError(`"${trimmed}" is already in your skills.`);
      return;
    }
    if (trimmed.length > 40) {
      setCustomSkillError('Skill name must be 40 characters or fewer.');
      return;
    }

    addSkill(trimmed);
    setCustomSkillInput('');
    setCustomSkillError('');
    customSkillRef.current?.focus();
  };
  
  const handleSaveCustomRole = async () => {
  if (!customRoleLabel.trim() || !customRoleJD.trim()) return;
  setSavingRole(true);
  try {
    const data = await customRolesAPI.save(customRoleLabel.trim(), customRoleJD.trim());
    if (data.success) {
      if (!data.duplicate) setCustomRoles(r => [data.role, ...r]);
      setLocalRole(data.role._id);
      setTargetRole(data.role._id);
      setShowCustomInput(false);
      setCustomRoleLabel('');
      setCustomRoleJD('');
      setMarketResult(null);
    }
  } catch (e) { console.error(e); }
  finally { setSavingRole(false); }
};

const handleDeleteCustomRole = async (id, e) => {
  e.stopPropagation();
  try {
    await customRolesAPI.delete(id);
    setCustomRoles(r => r.filter(role => role._id !== id));
    if (localRole === id) { setLocalRole(''); setTargetRole(''); setMarketResult(null); }
  } catch (e) { console.error(e); }
};

  // ── 100% free client-side market analysis (no API key needed) ──
  const MARKET_DATA = {
    // demand: high/medium/low  trend: rising/stable/declining
    'Python':        { demand: 'high',   trend: 'rising'    },
    'JavaScript':    { demand: 'high',   trend: 'stable'    },
    'TypeScript':    { demand: 'high',   trend: 'rising'    },
    'React':         { demand: 'high',   trend: 'stable'    },
    'Node.js':       { demand: 'high',   trend: 'stable'    },
    'Next.js':       { demand: 'high',   trend: 'rising'    },
    'SQL':           { demand: 'high',   trend: 'stable'    },
    'AWS':           { demand: 'high',   trend: 'rising'    },
    'Docker':        { demand: 'high',   trend: 'rising'    },
    'Kubernetes':    { demand: 'high',   trend: 'rising'    },
    'Git':           { demand: 'high',   trend: 'stable'    },
    'REST APIs':     { demand: 'high',   trend: 'stable'    },
    'GraphQL':       { demand: 'medium', trend: 'rising'    },
    'Java':          { demand: 'high',   trend: 'stable'    },
    'Go':            { demand: 'high',   trend: 'rising'    },
    'Rust':          { demand: 'medium', trend: 'rising'    },
    'C++':           { demand: 'medium', trend: 'stable'    },
    'Vue.js':        { demand: 'medium', trend: 'stable'    },
    'TailwindCSS':   { demand: 'high',   trend: 'rising'    },
    'CSS3':          { demand: 'medium', trend: 'stable'    },
    'HTML5':         { demand: 'medium', trend: 'stable'    },
    'FastAPI':       { demand: 'high',   trend: 'rising'    },
    'Django':        { demand: 'medium', trend: 'stable'    },
    'TensorFlow':    { demand: 'high',   trend: 'rising'    },
    'PyTorch':       { demand: 'high',   trend: 'rising'    },
    'Pandas':        { demand: 'high',   trend: 'stable'    },
    'NumPy':         { demand: 'medium', trend: 'stable'    },
    'LLMs':          { demand: 'high',   trend: 'rising'    },
    'GCP':           { demand: 'high',   trend: 'rising'    },
    'CI/CD':         { demand: 'high',   trend: 'rising'    },
    'Terraform':     { demand: 'high',   trend: 'rising'    },
    'Figma':         { demand: 'high',   trend: 'rising'    },
    'Agile':         { demand: 'medium', trend: 'stable'    },
    'Jira':          { demand: 'medium', trend: 'stable'    },
    'Postman':       { demand: 'medium', trend: 'stable'    },
    'MongoDB':       { demand: 'medium', trend: 'stable'    },
    'PostgreSQL':    { demand: 'high',   trend: 'rising'    },
    'Redis':         { demand: 'high',   trend: 'rising'    },
    'Linux':         { demand: 'high',   trend: 'stable'    },
    'Spark':         { demand: 'medium', trend: 'stable'    },
    'Kafka':         { demand: 'medium', trend: 'rising'    },
    'Microservices': { demand: 'high',   trend: 'stable'    },
    'Tailwind CSS':  { demand: 'high',   trend: 'rising'    },
    'AI/ML':         { demand: 'high',   trend: 'rising'    },
    'Machine Learning': { demand: 'high', trend: 'rising'  },
    'Deep Learning': { demand: 'high',   trend: 'rising'    },
    'Data Analysis': { demand: 'high',   trend: 'rising'    },
  };

useEffect(() => {
  customRolesAPI.getAll()
    .then(data => { if (data.success) setCustomRoles(data.roles); })
    .catch(() => {});
}, []);
  // High-demand skills recommended per role
  const ROLE_RECOMMENDATIONS = {
    'frontend-developer':    ['TypeScript', 'Next.js', 'TailwindCSS', 'GraphQL', 'Vitest'],
    'backend-developer':     ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes'],
    'fullstack-developer':   ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Redis'],
    'data-scientist':        ['PyTorch', 'LLMs', 'Spark', 'MLflow', 'Airflow'],
    'aiml-engineer':         ['LLMs', 'PyTorch', 'TensorFlow', 'FastAPI', 'Kubernetes'],
    'data-engineer':         ['Spark', 'Kafka', 'Airflow', 'dbt', 'Snowflake'],
    'devops-engineer':       ['Kubernetes', 'Terraform', 'CI/CD', 'Prometheus', 'Helm'],
    'cloud-engineer':        ['AWS', 'Terraform', 'Kubernetes', 'GCP', 'CI/CD'],
    'mobile-developer':      ['React Native', 'Swift', 'Kotlin', 'Firebase', 'TypeScript'],
    'product-manager':       ['Agile', 'Figma', 'SQL', 'Jira', 'A/B Testing'],
    'uiux-designer':         ['Figma', 'User Research', 'Prototyping', 'CSS3', 'Accessibility'],
    'cybersecurity-engineer':['Penetration Testing', 'SIEM', 'Zero Trust', 'IAM', 'OWASP'],
    'qa-engineer':           ['Cypress', 'Playwright', 'Jest', 'CI/CD', 'Selenium'],
    'embedded-engineer':     ['C++', 'Rust', 'RTOS', 'CAN Bus', 'FPGA'],
    'blockchain-developer':  ['Solidity', 'Web3.js', 'Rust', 'Smart Contracts', 'Hardhat'],
  };

  const generateRecommendation = (fit, roleName, missingCount) => {
    if (fit >= 80) return `Your skills are an excellent match for ${roleName} roles — you're well above the industry baseline. Focus on deepening expertise in your strongest areas and staying current with emerging tools to stay competitive.`;
    if (fit >= 55) return `You have a solid foundation for ${roleName} roles with ${fit}% market alignment. Picking up ${missingCount} key missing skills could make you a top-tier candidate and significantly widen your job opportunities.`;
    if (fit >= 30) return `You're building toward a ${roleName} profile. With ${missingCount} targeted skill additions, you can close the gap quickly — focus on the high-demand skills flagged below for the best return on your learning time.`;
    return `Your current skillset is a starting point for ${roleName} roles. Consider a focused 3–6 month learning plan targeting the high-demand skills listed below — they will give you the fastest path to landing your first role.`;
  };

  const handleMarketAnalysis = () => {
    if (!userSkills.length) return;
    setMarketLoading(true);
    setMarketError('');
    setMarketResult(null);
    setAiTab('market');

    // Simulate a brief "thinking" delay for UX
    setTimeout(() => {
      try {
        const roleName = TARGET_ROLES.find(r => r.id === localRole)?.label || 'Software Developer';

        // Score each user skill against market data
        const marketDemand = userSkills.map(skill => {
          const key = Object.keys(MARKET_DATA).find(k => k.toLowerCase() === skill.toLowerCase());
          return key
            ? { skill, ...MARKET_DATA[key] }
            : { skill, demand: 'medium', trend: 'stable' }; // reasonable default for unknown/custom skills
        });

        // Overall fit: weighted score (high=100, medium=60, low=25) averaged
        const scoreMap = { high: 100, medium: 60, low: 25 };
        const rawScore = marketDemand.reduce((sum, s) => sum + (scoreMap[s.demand] || 60), 0) / marketDemand.length;

        // Boost if skills align well with target role
        const roleBonus = localRole && localRole !== 'other'
          ? Math.min(20, Math.round((presentSkills.length / Math.max(roleSkills.length, 1)) * 20))
          : 0;
        const overallMarketFit = Math.min(100, Math.round(rawScore * 0.8 + roleBonus));

        // Missing high-demand skills for the role, not already in user's list
        const roleRecs = ROLE_RECOMMENDATIONS[localRole] || ['TypeScript', 'Docker', 'PostgreSQL', 'CI/CD', 'Redis'];
        const missingHighDemand = roleRecs
          .filter(s => !userSkillsLower.includes(s.toLowerCase()))
          .slice(0, 5);

        setMarketResult({
          overallMarketFit,
          recommendation: generateRecommendation(overallMarketFit, roleName, missingHighDemand.length),
          marketDemand,
          missingHighDemand,
        });
      } catch (err) {
        setMarketError('Analysis failed. Please try again.');
        console.error(err);
      } finally {
        setMarketLoading(false);
      }
    }, 900);
  };

  const getDemandColor = (demand) =>
    ({ high: 'var(--success)', medium: 'var(--warning)', low: 'var(--error)' }[demand] || 'var(--text-muted)');

  const skillCategories = [
    { label: 'Languages',     skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'] },
    { label: 'Frontend',      skills: ['React', 'Vue.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { label: 'Backend',       skills: ['Node.js', 'FastAPI', 'Django', 'REST APIs', 'GraphQL'] },
    { label: 'Data & AI',     skills: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'LLMs'] },
    { label: 'DevOps & Cloud',skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD', 'Terraform'] },
    { label: 'Tools',         skills: ['Git', 'Jira', 'Figma', 'Postman', 'Agile'] },
  ];

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="analytics-header">
          <p className="section-eyebrow"><BarChart3 size={13} /> Skill Analytics</p>
          <h1 className="analytics-title">Skill Analytics</h1>
          <p className="analytics-subtitle">
            Analyze your skills, discover gaps, and get targeted recommendations to match your dream role.
          </p>
        </div>

        <div className="analytics-layout">
          {/* LEFT PANEL */}
          <aside className="analytics-sidebar">
            {/* Current skills */}
            <div className="card">
              <h3 className="card-section-title"><Sparkles size={17} /> Your Skills ({userSkills.length})</h3>
              <div className="skill-input-wrap" style={{ position: 'relative', marginBottom: 12 }}>
                <input
                  type="text" className="form-input"
                  placeholder="Search & add skills..."
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && query.trim() && addSkill(query.trim())}
                />
                {suggestions.length > 0 && (
                  <div className="dropdown-suggestions">
                    {suggestions.map(s => (
                      <button key={s} className="dropdown-item" onClick={() => addSkill(s)}>
                        <Plus size={12} /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {userSkills.length === 0 ? (
                <p className="empty-skills-msg">No skills added yet. Add skills from the resume builder or search above.</p>
              ) : (
                <div className="user-skills-wrap">
                  {userSkills.map(skill => {
                    const isCustom = !predefinedSkillsLower.includes(skill.toLowerCase());
                    return (
                      <span key={skill} className={`user-skill-chip ${isCustom ? 'user-skill-chip--custom' : ''}`}>
                        {isCustom && <span className="custom-skill-badge">custom</span>}
                        {skill}
                        <button className="skill-remove-x" onClick={() => removeSkill(skill)}><X size={11} /></button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role selector */}
            <div className="card">
              <h3 className="card-section-title"><Target size={17} /> Target Role</h3>
                            <div className="analytics-roles">
                {TARGET_ROLES.filter(r => r.id !== 'other').map(role => (
                  <button key={role.id}
                    className={`analytics-role-btn ${localRole === role.id ? 'active' : ''}`}
                    onClick={() => { setLocalRole(role.id); setTargetRole(role.id); setMarketResult(null); }}>
                    {localRole === role.id && <Check size={12} />}
                    {role.label}
                  </button>
                ))}

                {/* Custom roles */}
                {customRoles.map(role => (
                  <button key={role._id}
                    className={`analytics-role-btn analytics-role-custom ${localRole === role._id ? 'active' : ''}`}
                    onClick={() => { setLocalRole(role._id); setTargetRole(role._id); setMarketResult(null); }}>
                    {localRole === role._id && <Check size={12} />}
                    {role.label}
                    <span className="analytics-role-delete" onClick={(e) => handleDeleteCustomRole(role._id, e)}>
                      <X size={11} />
                    </span>
                  </button>
                ))}

                {/* Add custom role button */}
                <button className="analytics-role-btn analytics-role-add" onClick={() => setShowCustomInput(true)}>
                  <Plus size={12} /> Add Custom Role
                </button>
              </div>

              {/* Custom role input form */}
              {showCustomInput && (
                <div className="ats-custom-role-input" style={{ marginTop: 12 }}>
                  <label className="form-label">Role Name</label>
                  <input
                    type="text" className="form-input"
                    placeholder="e.g. React Native Developer"
                    value={customRoleLabel}
                    onChange={e => setCustomRoleLabel(e.target.value)}
                    autoFocus
                    style={{ marginBottom: 10 }}
                  />
                  <label className="form-label">
                    Job Description <span style={{ color: 'var(--error, #ef4444)' }}>*</span>
                  </label>
                  <textarea
                    className="form-input" rows={4}
                    placeholder="Paste job description to enable accurate skill gap analysis..."
                    value={customRoleJD}
                    onChange={e => setCustomRoleJD(e.target.value)}
                    style={{ marginBottom: 10 }}
                  />
                  <div className="ats-custom-role-row">
                    <button className="btn-primary ats-save-role-btn"
                      onClick={handleSaveCustomRole}
                      disabled={!customRoleLabel.trim() || !customRoleJD.trim() || savingRole}>
                      {savingRole ? 'Saving...' : 'Save Role'}
                    </button>
                    <button className="ats-cancel-role-btn"
                      onClick={() => { setShowCustomInput(false); setCustomRoleLabel(''); setCustomRoleJD(''); }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Market Analysis button */}
            <div className="card">
              <h3 className="card-section-title"><Zap size={17} /> AI Market Analysis</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Compare your skills with real market demand using AI.
              </p>
              {marketError && <p style={{ color: 'var(--error)', fontSize: '0.78rem', marginBottom: 8 }}>{marketError}</p>}
              <button
                className="btn-primary calculate-btn"
                onClick={handleMarketAnalysis}
                disabled={marketLoading || userSkills.length === 0}
                style={{ width: '100%' }}
              >
                {marketLoading
                  ? 'Analyzing...'
                  : <><TrendingUp size={15} /> Analyze Market Demand</>
                }
              </button>
              {userSkills.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                  Add skills above to enable analysis
                </p>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <div className="analytics-main">

            {/* Tabs */}
            <div className="analytics-tabs">
              <button className={`analytics-tab ${aiTab === 'gap' ? 'active' : ''}`} onClick={() => setAiTab('gap')}>
                📊 Skill Gap Analysis
              </button>
              <button className={`analytics-tab ${aiTab === 'market' ? 'active' : ''}`} onClick={() => setAiTab('market')}>
                📈 Market Demand
              </button>
            </div>

            {/* GAP ANALYSIS TAB */}
            {aiTab === 'gap' && (
              <>
                {localRole && localRole !== 'other' && (
                  <div className="card match-overview animate-fadeIn">
                    <div className="match-header">
                      <h3 className="card-section-title" style={{ marginBottom: 0 }}>
                        Role Match: <span style={{ color: matchPct >= 70 ? 'var(--success)' : matchPct >= 40 ? 'var(--warning)' : 'var(--error)' }}>{matchPct}%</span>
                      </h3>
                      <span className="match-role-label">for {TARGET_ROLES.find(r => r.id === localRole)?.label}</span>
                    </div>
                    <div className="match-bar-wrap">
                      <div className="match-bar">
                        <div className="match-bar-fill" style={{
                          width: `${matchPct}%`,
                          background: matchPct >= 70 ? 'var(--success)' : matchPct >= 40 ? 'var(--warning)' : 'var(--error)'
                        }} />
                      </div>
                      <span className="match-bar-label">{presentSkills.length} / {roleSkills.length} skills</span>
                    </div>
                    <div className="match-stats-row">
                      <div className="match-stat"><CheckCircle size={18} color="var(--success)" /><span className="match-stat-num">{presentSkills.length}</span><span className="match-stat-label">You Have</span></div>
                      <div className="match-stat"><AlertCircle size={18} color="var(--warning)" /><span className="match-stat-num">{missingSkills.length}</span><span className="match-stat-label">Missing</span></div>
                      <div className="match-stat"><TrendingUp size={18} color="var(--accent)" /><span className="match-stat-num">{extraSkills.length}</span><span className="match-stat-label">Extra Skills</span></div>
                    </div>
                  </div>
                )}

                {localRole && presentSkills.length > 0 && (
                  <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="card-section-title"><CheckCircle size={17} color="var(--success)" /> Skills You Already Have</h3>
                    <div className="chip-grid">
                      {presentSkills.map(s => <span key={s} className="analytics-chip present-chip">{s}</span>)}
                    </div>
                  </div>
                )}

                {localRole && missingSkills.length > 0 && (
                  <div className="card animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                    <h3 className="card-section-title"><AlertCircle size={17} color="var(--warning)" /> Skills to Add for Better Match</h3>
                    <p className="rec-subtitle">Adding these skills could significantly improve your profile for <strong>{TARGET_ROLES.find(r => r.id === localRole)?.label}</strong> roles:</p>
                    <div className="chip-grid">
                      {missingSkills.map(s => (
                        <button key={s} className="analytics-chip missing-chip-btn" onClick={() => addSkill(s)}>
                          <Plus size={12} /> {s}
                        </button>
                      ))}
                    </div>
                    <p className="add-skill-hint">Click any skill to add it to your resume</p>
                  </div>
                )}

                {/* ── Browse Skills by Category (with custom skill input) ── */}
                <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <h3 className="card-section-title"><BarChart3 size={17} /> Browse Skills by Category</h3>
                  <p className="rec-subtitle">Click any skill to add it to your resume.</p>

                  {skillCategories.map(cat => (
                    <div key={cat.label} className="skill-category">
                      <p className="category-label">{cat.label}</p>
                      <div className="chip-grid">
                        {cat.skills.map(s => {
                          const added = userSkillsLower.includes(s.toLowerCase());
                          return (
                            <button key={s} className={`analytics-chip category-chip ${added ? 'added' : ''}`}
                              onClick={() => !added && addSkill(s)} disabled={added}>
                              {added && <Check size={11} />} {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* ── Custom Skill Input ─────────────────────────────── */}
                  <div className="custom-skill-section">
                    <p className="category-label" style={{ marginBottom: 10 }}>
                      Custom Skill
                    </p>
                    <p className="custom-skill-hint-text">
                      Don't see your skill above? Add any custom skill and it will be included in your analytics.
                    </p>
                    <div className="custom-skill-input-row">
                      <input
                        ref={customSkillRef}
                        type="text"
                        className="form-input custom-skill-input"
                        placeholder="e.g. Prompt Engineering, Solidity, Blender…"
                        value={customSkillInput}
                        onChange={e => {
                          setCustomSkillInput(e.target.value);
                          if (customSkillError) setCustomSkillError('');
                        }}
                        onKeyDown={e => e.key === 'Enter' && handleAddCustomSkill()}
                        maxLength={40}
                      />
                      <button
                        className="btn-primary custom-skill-add-btn"
                        onClick={handleAddCustomSkill}
                        disabled={!customSkillInput.trim()}
                      >
                        <Plus size={14} /> Add Skill
                      </button>
                    </div>
                    {customSkillError && (
                      <p className="custom-skill-error">{customSkillError}</p>
                    )}

                    {/* Show custom skills the user has already added */}
                    {customAddedSkills.length > 0 && (
                      <div className="custom-added-skills-wrap">
                        <p className="custom-added-label">Your custom skills:</p>
                        <div className="chip-grid">
                          {customAddedSkills.map(skill => (
                            <span key={skill} className="analytics-chip custom-chip">
                              ✦ {skill}
                              <button
                                className="skill-remove-x"
                                style={{ color: 'inherit' }}
                                onClick={() => removeSkill(skill)}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!localRole && (
                  <div className="card analytics-empty">
                    <BarChart3 size={44} className="empty-icon" />
                    <h3>Select a target role</h3>
                    <p>Choose a role from the left panel to see a detailed skill gap analysis and recommendations.</p>
                  </div>
                )}
              </>
            )}

            {/* MARKET DEMAND TAB */}
            {aiTab === 'market' && (
              <>
                {!marketResult && !marketLoading && (
                  <div className="card analytics-empty">
                    <TrendingUp size={44} className="empty-icon" />
                    <h3>Run AI Market Analysis</h3>
                    <p>Click "Analyze Market Demand" in the left panel to see how your skills compare to current market trends.</p>
                  </div>
                )}

                {marketLoading && (
                  <div className="card analytics-empty">
                    <Zap size={44} className="empty-icon" style={{ opacity: 0.5 }} />
                    <h3>Analyzing market demand...</h3>
                    <p>AI is comparing your skills with current industry trends.</p>
                  </div>
                )}

                {marketResult && !marketLoading && (
                  <>
                    <div className="card animate-fadeIn">
                      <div className="match-header">
                        <h3 className="card-section-title" style={{ marginBottom: 0 }}>
                          Market Fit Score:{' '}
                          <span style={{ color: marketResult.overallMarketFit >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                            {marketResult.overallMarketFit}/100
                          </span>
                        </h3>
                      </div>
                      {marketResult.recommendation && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 10 }}>
                          {marketResult.recommendation}
                        </p>
                      )}
                    </div>

                    <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                      <h3 className="card-section-title"><BarChart3 size={17} /> Your Skills — Market Demand</h3>
                      <div className="chip-grid">
                        {(marketResult.marketDemand || []).map((item, i) => (
                          <div key={i} className="market-skill-card">
                            <span className="market-skill-name">
                              {item.skill}
                              {!predefinedSkillsLower.includes(item.skill.toLowerCase()) && (
                                <span className="market-custom-tag">custom</span>
                              )}
                            </span>
                            <span className="market-demand-badge" style={{ background: getDemandColor(item.demand) }}>{item.demand}</span>
                            <span className="market-trend">
                              {item.trend === 'rising' ? '↑' : item.trend === 'declining' ? '↓' : '→'} {item.trend}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {marketResult.missingHighDemand?.length > 0 && (
                      <div className="card animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                        <h3 className="card-section-title"><AlertCircle size={17} color="var(--warning)" /> High-Demand Skills You're Missing</h3>
                        <div className="chip-grid">
                          {marketResult.missingHighDemand.map(s => (
                            <button key={s} className="analytics-chip missing-chip-btn" onClick={() => addSkill(s)}>
                              <Plus size={12} /> {s}
                            </button>
                          ))}
                        </div>
                        <p className="add-skill-hint">Click any skill to add it to your resume</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAnalyticsPage;