import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TARGET_ROLES, ROLE_SKILLS } from '../data/staticData';
import { atsAPI } from '../services/api';
import { Target, Check, Sparkles, BarChart3, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import './ATSScorePage.css';

const ATSScorePage = () => {
  const { resumeData, targetRole, setTargetRole, jobDescription, setJobDescription } = useApp();
  const [localRole, setLocalRole]   = useState(targetRole);
  const [localJD, setLocalJD]       = useState(jobDescription);
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [apiResult, setApiResult]   = useState(null);
  const [apiError, setApiError]     = useState('');

  // ── Derive display values from API result ──────────────
  const score        = apiResult?.overallScore ?? null;
  const scoreColor   = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)';
  const scoreLabel   = score >= 75 ? 'Excellent Match' : score >= 50 ? 'Good Match' : 'Needs Improvement';
  const circumference = 2 * Math.PI * 54;
  const dashOffset   = score != null ? circumference - (score / 100) * circumference : circumference;

  const presentSkills = apiResult?.sections?.keywords?.matched || [];
  const missingSkills = apiResult?.sections?.keywords?.missing  || [];
  const improvements  = apiResult?.improvements || [];
  const strengths     = apiResult?.strengths    || [];

  // ── Format resumeData as plain text for the backend ───
  const buildResumeText = () => {
    const r = resumeData;
    return [
      r.name && `Name: ${r.name}`,
      r.professionalTitle && `Title: ${r.professionalTitle}`,
      r.summary && `Summary: ${r.summary}`,
      r.skills?.length && `Skills: ${r.skills.join(', ')}`,
      (r.workExperience || []).map(e => `Experience: ${e.title} at ${e.company}. ${e.description || ''}`).join('\n'),
      (r.education || []).map(e => `Education: ${e.degree} at ${e.institution}`).join('\n'),
      (r.projects || []).map(p => `Project: ${p.name}. ${p.description || ''}`).join('\n'),
      (r.certifications || []).map(c => `Certification: ${c.name} by ${c.issuer}`).join('\n'),
    ].filter(Boolean).join('\n');
  };

  const handleCalculate = async () => {
    if (!localRole || (localRole === 'other' && !localJD.trim())) return;

    setTargetRole(localRole);
    setJobDescription(localJD);
    setLoading(true);
    setApiError('');
    setApiResult(null);

    try {
      // Build job description: use typed JD or generate from role skills
      const jd = localJD.trim()
        ? localJD
        : `We are looking for a ${TARGET_ROLES.find(r => r.id === localRole)?.label}. Required skills: ${(ROLE_SKILLS[localRole] || []).join(', ')}.`;

      const data = await atsAPI.score({
        resumeText: buildResumeText(),
        jobDescription: jd,
      });

      setApiResult(data.analysis);
      setCalculated(true);
    } catch (err) {
      setApiError(err.message || 'Could not connect to backend. Make sure server is running on port 5000.');
      // Fall back to local calculation so UI still works
      const fallback = localCalcScore(resumeData, localRole, localJD);
      if (fallback) { setApiResult(fallback); setCalculated(true); }
    } finally {
      setLoading(false);
    }
  };

  // Fallback local scorer (used if backend is down)
  const localCalcScore = (rd, roleId, jd) => {
    if (!roleId) return null;
    const roleSkills = ROLE_SKILLS[roleId] || [];
    const userSkills = (rd.skills || []).map(s => s.toLowerCase());
    const matched = roleSkills.filter(s => userSkills.includes(s.toLowerCase()));
    const missing = roleSkills.filter(s => !userSkills.includes(s.toLowerCase()));
    let s = 0;
    if (rd.summary?.length > 50) s += 15;
    s += 30 * (matched.length / (roleSkills.length || 1));
    if ((rd.workExperience || []).length >= 2) s += 25;
    else if ((rd.workExperience || []).length === 1) s += 15;
    if ((rd.education || []).length > 0) s += 15;
    if ((rd.projects || []).length >= 2) s += 10;
    if ((rd.certifications || []).length > 0) s += 5;
    return {
      overallScore: Math.round(Math.min(s, 100)),
      sections: { keywords: { matched, missing, score: Math.round(matched.length / (roleSkills.length || 1) * 100) } },
      improvements: [
        rd.summary?.length < 50 && 'Add a detailed professional summary',
        (rd.workExperience || []).length === 0 && 'Add at least one work experience entry',
        (rd.projects || []).length === 0 && 'Add relevant projects',
        (rd.skills || []).length < 8 && 'Add more relevant technical skills',
      ].filter(Boolean),
      strengths: matched.length > 0 ? [`You have ${matched.length} matching skills`] : [],
    };
  };

  return (
    <div className="ats-page">
      <div className="container">
        <div className="ats-page-header">
          <p className="section-eyebrow"><Target size={13} /> ATS Score</p>
          <h1 className="ats-page-title">Check Your ATS Score</h1>
          <p className="ats-page-subtitle">
            Select your target role or paste a job description to see how well your resume
            matches Applicant Tracking System requirements.
          </p>
        </div>

        <div className="ats-page-layout">
          {/* LEFT: Role selector */}
          <div className="ats-left">
            <div className="card">
              <h3 className="card-section-title"><Target size={17} /> Select Target Role</h3>
              <div className="ats-roles-grid">
                {TARGET_ROLES.map(role => (
                  <button
                    key={role.id}
                    className={`ats-role-btn ${localRole === role.id ? 'active' : ''}`}
                    onClick={() => { setLocalRole(role.id); setCalculated(false); setApiResult(null); }}
                  >
                    {localRole === role.id && <Check size={13} />}
                    {role.label}
                  </button>
                ))}
              </div>

              {localRole === 'other' && (
                <div className="form-group jd-group">
                  <label className="form-label">Paste Job Description</label>
                  <textarea
                    className="form-input" rows={8}
                    placeholder="Paste the complete job description here. We'll analyze it to calculate an accurate ATS score..."
                    value={localJD}
                    onChange={e => { setLocalJD(e.target.value); setCalculated(false); }}
                  />
                </div>
              )}

              {apiError && <p className="ats-api-error"><AlertCircle size={14} /> {apiError}</p>}

              <button
                className="btn-primary calculate-btn"
                onClick={handleCalculate}
                disabled={loading || !localRole || (localRole === 'other' && !localJD.trim())}
              >
                {loading ? 'Analyzing...' : <><BarChart3 size={16} /> Calculate ATS Score</>}
              </button>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="ats-right">
            {!calculated && !loading && (
              <div className="ats-empty-state card">
                <Target size={48} className="empty-icon" />
                <h3>Select a role and calculate your score</h3>
                <p>Choose your target job role from the left panel and click "Calculate ATS Score" to see your results.</p>
              </div>
            )}

            {loading && (
              <div className="ats-empty-state card">
                <BarChart3 size={48} className="empty-icon" style={{ opacity: 0.5 }} />
                <h3>Analyzing your resume...</h3>
                <p>Our AI is comparing your resume against the job requirements.</p>
              </div>
            )}

            {calculated && !loading && score != null && (
              <>
                {/* Score card */}
                <div className="card ats-result-card animate-fadeIn">
                  <div className="result-top">
                    <div className="result-ring-wrap">
                      <svg viewBox="0 0 128 128" className="result-ring-svg">
                        <circle cx="64" cy="64" r="54" fill="none" stroke="var(--border)" strokeWidth="11"/>
                        <circle cx="64" cy="64" r="54" fill="none" stroke={scoreColor} strokeWidth="11"
                          strokeDasharray={circumference} strokeDashoffset={dashOffset}
                          strokeLinecap="round" transform="rotate(-90 64 64)"
                          style={{ transition: 'stroke-dashoffset 1.2s ease' }}/>
                      </svg>
                      <div className="result-ring-inner">
                        <span className="result-score" style={{ color: scoreColor }}>{score}</span>
                        <span className="result-max">/100</span>
                      </div>
                    </div>
                    <div className="result-info">
                      <div className="result-label" style={{ color: scoreColor }}>{scoreLabel}</div>
                      <p className="result-role">for <strong>{TARGET_ROLES.find(r => r.id === localRole)?.label}</strong></p>
                      <div className="result-stats">
                        <div className="result-stat">
                          <span className="stat-num" style={{ color: 'var(--success)' }}>{presentSkills.length}</span>
                          <span>Matching Skills</span>
                        </div>
                        <div className="result-stat">
                          <span className="stat-num" style={{ color: 'var(--warning)' }}>{missingSkills.length}</span>
                          <span>Missing Skills</span>
                        </div>
                        <div className="result-stat">
                          <span className="stat-num">{(resumeData.workExperience || []).length}</span>
                          <span>Experiences</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills analysis */}
                {(presentSkills.length > 0 || missingSkills.length > 0) && (
                  <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="card-section-title"><Sparkles size={17} /> Skills Analysis</h3>
                    {presentSkills.length > 0 && (
                      <div className="skills-group">
                        <p className="skills-group-label matched"><CheckCircle size={14} /> Skills You Have ({presentSkills.length})</p>
                        <div className="skills-chip-list">
                          {presentSkills.map(s => <span key={s} className="skill-chip matched-chip">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {missingSkills.length > 0 && (
                      <div className="skills-group">
                        <p className="skills-group-label missing"><AlertCircle size={14} /> Skills to Add ({missingSkills.length})</p>
                        <div className="skills-chip-list">
                          {missingSkills.slice(0, 10).map(s => <span key={s} className="skill-chip missing-chip">{s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths */}
                {strengths.length > 0 && (
                  <div className="card animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                    <h3 className="card-section-title"><CheckCircle size={17} color="var(--success)" /> Strengths</h3>
                    <div className="improvements-list">
                      {strengths.map((s, i) => (
                        <div key={i} className="improvement-item">
                          <div className="improvement-dot" style={{ background: 'var(--success)' }} />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {improvements.length > 0 && (
                  <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <h3 className="card-section-title"><TrendingUp size={17} /> Quick Improvements</h3>
                    <div className="improvements-list">
                      {improvements.map((imp, i) => (
                        <div key={i} className="improvement-item">
                          <div className="improvement-dot" />
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                    <p className="improvement-footer">
                      💡 These improvements could increase your ATS score by 10–25 points.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScorePage;