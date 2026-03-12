import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TARGET_ROLES, ROLE_SKILLS, ALL_SKILLS } from '../data/staticData';
import { skillsAPI } from '../services/api';
import { BarChart3, Check, Plus, Sparkles, TrendingUp, AlertCircle, CheckCircle, Target, X, Zap } from 'lucide-react';
import './SkillAnalyticsPage.css';

const SkillAnalyticsPage = () => {
  const { resumeData, setResumeData, targetRole, setTargetRole } = useApp();
  const [localRole, setLocalRole] = useState(targetRole);
  const [query, setQuery]         = useState('');

  // AI market comparison state
  const [aiTab, setAiTab]               = useState('gap');    // 'gap' | 'market'
  const [marketResult, setMarketResult] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError]   = useState('');

  const userSkills      = resumeData.skills || [];
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
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

  const handleMarketAnalysis = async () => {
    if (!userSkills.length) return;
    setMarketLoading(true);
    setMarketError('');
    try {
      const roleName = TARGET_ROLES.find(r => r.id === localRole)?.label || 'Software Developer';
      const data = await skillsAPI.marketComparison({ skills: userSkills, jobTitle: roleName });
      setMarketResult(data.comparison);
    } catch (err) {
      setMarketError('Could not connect to backend. Make sure server is running on port 5000.');
    } finally {
      setMarketLoading(false);
    }
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
                  {userSkills.map(skill => (
                    <span key={skill} className="user-skill-chip">
                      {skill}
                      <button className="skill-remove-x" onClick={() => removeSkill(skill)}><X size={11} /></button>
                    </span>
                  ))}
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
              </div>
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
                {marketLoading ? 'Analyzing...' : <><TrendingUp size={15} /> Analyze Market Demand</>}
              </button>
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
                          Market Fit Score: <span style={{ color: marketResult.overallMarketFit >= 70 ? 'var(--success)' : 'var(--warning)' }}>{marketResult.overallMarketFit}/100</span>
                        </h3>
                      </div>
                      {marketResult.recommendation && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 10 }}>{marketResult.recommendation}</p>
                      )}
                    </div>

                    <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                      <h3 className="card-section-title"><BarChart3 size={17} /> Your Skills — Market Demand</h3>
                      <div className="chip-grid">
                        {(marketResult.marketDemand || []).map((item, i) => (
                          <div key={i} className="market-skill-card">
                            <span className="market-skill-name">{item.skill}</span>
                            <span className="market-demand-badge" style={{ background: getDemandColor(item.demand) }}>{item.demand}</span>
                            <span className="market-trend">{item.trend === 'rising' ? '↑' : item.trend === 'declining' ? '↓' : '→'} {item.trend}</span>
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