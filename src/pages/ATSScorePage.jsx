import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TARGET_ROLES } from '../data/staticData';
import { atsAPI, customRolesAPI } from '../services/api';
import { Target, Check, Sparkles, BarChart3, AlertCircle, CheckCircle, TrendingUp, Plus, X } from 'lucide-react';
import './ATSScorePage.css';

const ATSScorePage = () => {
  // ✅ FIX 1: Only pull resumeData — setTargetRole/setJobDescription removed from context
  const { resumeData } = useApp();

  const [localRole, setLocalRole]   = useState('');
  const [localJD, setLocalJD]       = useState('');
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [apiResult, setApiResult]   = useState(null);
  const [apiError, setApiError]     = useState('');

  // ── Custom roles state ─────────────────────────────────────
  const [customRoles,     setCustomRoles]     = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRoleLabel, setCustomRoleLabel] = useState('');
  const [customRoleJD,    setCustomRoleJD]    = useState('');
  const [savingRole,      setSavingRole]      = useState(false);

  // ── Load custom roles on mount ─────────────────────────────
  useEffect(() => {
    customRolesAPI.getAll()
      .then(data => { if (data.success) setCustomRoles(data.roles); })
      .catch(() => {}); // silently fail if not logged in
  }, []);

  // ── Save new custom role ───────────────────────────────────
  const handleSaveCustomRole = async () => {
    if (!customRoleLabel.trim()) return;
    setSavingRole(true);
    try {
      const data = await customRolesAPI.save(customRoleLabel.trim(), customRoleJD.trim());
      if (data.success) {
        if (!data.duplicate) setCustomRoles(r => [data.role, ...r]);
        setLocalRole(data.role._id);
        setShowCustomInput(false);
        setCustomRoleLabel('');
        setCustomRoleJD('');
      }
    } catch (e) {
      console.error('Failed to save role:', e);
    } finally {
      setSavingRole(false);
    }
  };

  // ── Delete custom role ─────────────────────────────────────
  const handleDeleteCustomRole = async (id, e) => {
    e.stopPropagation();
    try {
      await customRolesAPI.delete(id);
      setCustomRoles(r => r.filter(role => role._id !== id));
      if (localRole === id) { setLocalRole(''); setCalculated(false); setApiResult(null); }
    } catch (e) {
      console.error('Failed to delete role:', e);
    }
  };

  // ── Derive display values from apiResult ───────────────────
  const score        = apiResult?.overallScore ?? null;
  const scoreColor   = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)';
  const scoreLabel   = score >= 75 ? 'Excellent Match' : score >= 50 ? 'Good Match' : 'Needs Improvement';
  const circumference = 2 * Math.PI * 54;
  const dashOffset   = score != null ? circumference - (score / 100) * circumference : circumference;

  const presentSkills = apiResult?.sections?.keywords?.matched || [];
  const missingSkills = apiResult?.sections?.keywords?.missing  || [];
  const improvements  = apiResult?.improvements || [];
  const strengths     = apiResult?.strengths    || [];

  // ── Get label for selected role ────────────────────────────
  const getSelectedRoleLabel = () => {
    const defaultRole = TARGET_ROLES.find(r => r.id === localRole);
    if (defaultRole) return defaultRole.label;
    const customRole = customRoles.find(r => r._id === localRole);
    if (customRole) return customRole.label;
    return 'Selected Role';
  };

  // ── Build plain-text resume for backend ───────────────────
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

  // ✅ FIX 2: Normalize backend response → component shape
  // Backend returns: { score, matchedKeywords, missingKeywords, suggestions, ... }
  // Component needs: { overallScore, sections.keywords.matched/missing, improvements, strengths }
  const normalizeAPIResponse = (data) => ({
    overallScore: data.score ?? data.overallScore ?? 0,
    sections: {
      keywords: {
        matched: data.matchedKeywords || data.sections?.keywords?.matched || [],
        missing: data.missingKeywords || data.sections?.keywords?.missing || [],
        score:   data.keywordScore    || data.sections?.keywords?.score   || 0,
      },
    },
    improvements: data.suggestions || data.improvements || [],
    strengths: data.strengths || (
      (data.matchedKeywords?.length)
        ? [`You have ${data.matchedKeywords.length} matching keywords for this role`]
        : []
    ),
  });

  const handleCalculate = async () => {
    if (!localRole) return;
    if (localRole === 'other' && !localJD.trim()) return;

    // ✅ FIX 3: Removed setTargetRole / setJobDescription (no longer in context)
    setLoading(true);
    setApiError('');
    setApiResult(null);

    try {
      const customRole  = customRoles.find(r => r._id === localRole);
      const defaultRole = TARGET_ROLES.find(r => r.id === localRole);

      // ✅ FIX 4: Backend expects targetRoles[] (array of role label strings like "Full Stack Developer")
      // NOT jobDescription — backend uses these labels to look up its ROLE_KEYWORDS bank
      const targetRolesPayload = defaultRole
        ? [defaultRole.label]
        : customRole
          ? [customRole.label]
          : [];

      const jd = localJD.trim()
        ? localJD
        : customRole?.jd
          ? `We are looking for a ${customRole.label}. ${customRole.jd}`
          : '';

      const data = await atsAPI.score({
        resumeText:    buildResumeText(),
        targetRoles:   targetRolesPayload, // ✅ what backend reads
        jobDescription: jd,                // extra context
      });

      console.log('ATS API response:', data); // keep for debugging

      setApiResult(normalizeAPIResponse(data));
      setCalculated(true);
    } catch (err) {
      console.error('ATS score error:', err);
      setApiError(err.message || 'Could not connect to backend. Make sure server is running on port 5000.');
      const fallback = localCalcScore(resumeData, localRole);
      if (fallback) { setApiResult(fallback); setCalculated(true); }
    } finally {
      setLoading(false);
    }
  };

  // ── Fallback local scorer (when backend is unreachable) ───
  const localCalcScore = (rd, roleId) => {
    if (!roleId) return null;
    const userSkills = (rd.skills || []).map(s => s.toLowerCase());
    let s = 0;
    if (rd.summary?.length > 50) s += 15;
    if ((rd.workExperience || []).length >= 2) s += 25;
    else if ((rd.workExperience || []).length === 1) s += 15;
    if ((rd.education || []).length > 0) s += 15;
    if ((rd.projects || []).length >= 2) s += 10;
    if ((rd.certifications || []).length > 0) s += 5;
    if (userSkills.length >= 5) s += 20;
    else if (userSkills.length >= 3) s += 10;
    return {
      overallScore: Math.round(Math.min(s, 100)),
      sections: { keywords: { matched: userSkills.slice(0, 10), missing: [], score: 50 } },
      improvements: [
        rd.summary?.length < 50 && 'Add a detailed professional summary',
        (rd.workExperience || []).length === 0 && 'Add at least one work experience entry',
        (rd.projects || []).length === 0 && 'Add relevant projects',
        (rd.skills || []).length < 8 && 'Add more relevant technical skills',
      ].filter(Boolean),
      strengths: userSkills.length > 0
        ? [`You have ${userSkills.length} skills listed on your resume`]
        : [],
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

                {customRoles.map(role => (
                  <button
                    key={role._id}
                    className={`ats-role-btn ats-role-custom ${localRole === role._id ? 'active' : ''}`}
                    onClick={() => { setLocalRole(role._id); setLocalJD(role.jd || ''); setCalculated(false); setApiResult(null); }}
                  >
                    {localRole === role._id && <Check size={13} />}
                    {role.label}
                    <span
                      className="ats-role-delete"
                      onClick={(e) => handleDeleteCustomRole(role._id, e)}
                      title="Remove this role"
                    >
                      <X size={11} />
                    </span>
                  </button>
                ))}

                <button
                  className="ats-role-btn ats-role-add"
                  onClick={() => setShowCustomInput(true)}
                >
                  <Plus size={13} /> Add Custom Role
                </button>
              </div>

              {showCustomInput && (
                <div className="ats-custom-role-input">
                  <label className="form-label">Custom Role Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React Native Developer"
                    value={customRoleLabel}
                    onChange={e => setCustomRoleLabel(e.target.value)}
                    autoFocus
                    style={{ marginBottom: '10px' }}
                  />
                  <label className="form-label">
                    Paste Job Description <span style={{ color: 'var(--error, #ef4444)' }}>*</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="Paste the job description here..."
                    value={customRoleJD}
                    onChange={e => setCustomRoleJD(e.target.value)}
                    style={{ marginBottom: '10px' }}
                  />
                  <div className="ats-custom-role-row">
                    <button
                      className="btn-primary ats-save-role-btn"
                      onClick={handleSaveCustomRole}
                      disabled={!customRoleLabel.trim() || !customRoleJD.trim() || savingRole}
                    >
                      {savingRole ? 'Saving...' : 'Save Role'}
                    </button>
                    <button
                      className="ats-cancel-role-btn"
                      onClick={() => { setShowCustomInput(false); setCustomRoleLabel(''); setCustomRoleJD(''); }}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {localRole === 'other' && (
                <div className="form-group jd-group">
                  <label className="form-label">Paste Job Description</label>
                  <textarea
                    className="form-input" rows={8}
                    placeholder="Paste the complete job description here..."
                    value={localJD}
                    onChange={e => { setLocalJD(e.target.value); setCalculated(false); }}
                  />
                </div>
              )}

              {apiError && (
                <p className="ats-api-error"><AlertCircle size={14} /> {apiError}</p>
              )}

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

            {/* ✅ FIX 5: Safety net — never leave right panel blank */}
            {calculated && !loading && score == null && (
              <div className="ats-empty-state card">
                <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--error)' }} />
                <h3>Could not calculate score</h3>
                <p>The server returned an unexpected response. Please try again.</p>
              </div>
            )}

            {calculated && !loading && score != null && (
              <>
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
                      <p className="result-role">for <strong>{getSelectedRoleLabel()}</strong></p>
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