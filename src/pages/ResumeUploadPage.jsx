import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, FileText, Target, Zap, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, BarChart2, Star, TrendingUp,
  Lightbulb, X, Sparkles, Plus
} from 'lucide-react';
import { atsAPI, skillsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import './ResumeUploadPage.css';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const DEFAULT_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'AI/ML Engineer',
  'Data Engineer', 'DevOps Engineer', 'Cloud Engineer',
  'Mobile Developer', 'Product Manager', 'UI/UX Designer',
  'Cybersecurity Engineer', 'QA / Test Engineer',
  'Embedded Systems Engineer', 'Blockchain Developer',
];

/* ══════════════════════════════════════════════════════════════
   CIRCULAR SCORE RING
══════════════════════════════════════════════════════════════ */
const ScoreRing = ({ score, size = 160, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 75 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';
  const label  = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="#E5E7EB" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div className="score-ring-inner">
        <span className="score-number" style={{ color }}>{score}</span>
        <span className="score-slash">/100</span>
        <span className="score-label" style={{ color }}>{label}</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SKILL TAG
══════════════════════════════════════════════════════════════ */
const SkillTag = ({ skill, type }) => {
  const styles = {
    matched:   { bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' },
    missing:   { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B' },
    suggested: { bg: '#FFFBEB', border: '#FCD34D', color: '#92400E' },
    neutral:   { bg: '#F3F4F6', border: '#E5E7EB', color: '#374151' },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span className="skill-tag" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {type === 'matched'   && <CheckCircle2 size={11} />}
      {type === 'missing'   && <XCircle size={11} />}
      {type === 'suggested' && <Lightbulb size={11} />}
      {skill}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   SCORE BAR
══════════════════════════════════════════════════════════════ */
const ScoreBar = ({ label, score, color }) => (
  <div className="score-bar-row">
    <div className="score-bar-label">
      <span>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{score}%</span>
    </div>
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   TARGET ROLE SELECTOR
   Reads/writes selectedRoles from AppContext via props
══════════════════════════════════════════════════════════════ */
const TargetRoleSelector = ({ selectedRoles, onChange }) => {
  const [customInput, setCustomInput] = useState('');
  const [customRoles, setCustomRoles] = useState([]);
  const [inputError,  setInputError]  = useState('');
  const inputRef = useRef(null);

  const allRoles = [...DEFAULT_ROLES, ...customRoles];

  const toggleRole = (role) => {
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    onChange(next);
  };

  const addCustomRole = () => {
    const val = customInput.trim();
    if (!val) return;
    if (allRoles.map(r => r.toLowerCase()).includes(val.toLowerCase())) {
      setInputError('Role already exists');
      setTimeout(() => setInputError(''), 2000);
      return;
    }
    setCustomRoles(prev => [...prev, val]);
    onChange([...selectedRoles, val]);
    setCustomInput('');
    setInputError('');
  };

  const removeCustomRole = (role, e) => {
    e.stopPropagation();
    setCustomRoles(prev => prev.filter(r => r !== role));
    onChange(selectedRoles.filter(r => r !== role));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomRole(); }
  };

  return (
    <div className="rup-role-wrap">
      <label className="rup-jd-label">
        <Target size={14} /> Target Role
        <span className="rup-optional"> — select one or more to improve accuracy</span>
      </label>

      <div className="rup-roles-grid">
        {DEFAULT_ROLES.map(role => (
          <button
            key={role}
            type="button"
            className={`rup-role-chip ${selectedRoles.includes(role) ? 'selected' : ''}`}
            onClick={() => toggleRole(role)}
          >
            {selectedRoles.includes(role) && <CheckCircle2 size={11} />}
            {role}
          </button>
        ))}

        {customRoles.map(role => (
          <button
            key={role}
            type="button"
            className={`rup-role-chip custom ${selectedRoles.includes(role) ? 'selected' : ''}`}
            onClick={() => toggleRole(role)}
          >
            {selectedRoles.includes(role) && <CheckCircle2 size={11} />}
            {role}
            <span
              className="rup-role-chip-remove"
              onClick={(e) => removeCustomRole(role, e)}
              title="Remove"
            >
              <X size={10} />
            </span>
          </button>
        ))}
      </div>

      <div className="rup-role-add-row">
        <div className={`rup-role-input-wrap ${inputError ? 'has-error' : ''}`}>
          <Plus size={14} className="rup-role-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="rup-role-input"
            placeholder="Add a custom role…"
            value={customInput}
            onChange={e => { setCustomInput(e.target.value); setInputError(''); }}
            onKeyDown={handleKeyDown}
            maxLength={50}
          />
          {inputError && <span className="rup-role-input-error">{inputError}</span>}
        </div>
        <button
          type="button"
          className="rup-role-add-btn"
          onClick={addCustomRole}
          disabled={!customInput.trim()}
        >
          Add
        </button>
      </div>

      {selectedRoles.length > 0 && (
        <div className="rup-role-summary">
          <span className="rup-role-summary-count">{selectedRoles.length}</span>
          {selectedRoles.length === 1 ? ' role' : ' roles'} selected:&nbsp;
          <span className="rup-role-summary-names">{selectedRoles.join(', ')}</span>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const ResumeUploadPage = () => {
  const fileRef = useRef(null);

  // ── Pull targetRoles from global context so selection persists
  // across navigation and is available to other pages (e.g. chatbot)
  const { targetRoles, setTargetRoles } = useApp();

  const [file,      setFile]      = useState(null);
  const [dragging,  setDragging]  = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('ats');

  const [atsResult,   setAtsResult]   = useState(null);
  const [skillResult, setSkillResult] = useState(null);

  const acceptFile = (f) => {
    if (!f) return;
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx|doc|txt)$/i)) {
      setError('Please upload a PDF, DOCX, or TXT file.'); return;
    }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError(''); setFile(f); setAtsResult(null); setSkillResult(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]);
  }, []);

  const readFileText = (f) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = (e) => res(e.target.result);
    reader.onerror = () => rej(new Error('Could not read file'));
    reader.readAsText(f);
  });

  const handleAnalyse = async () => {
    if (!file) { setError('Please upload your resume first.'); return; }
    setAnalyzing(true); setError('');
    try {
      const resumeText = await readFileText(file);

      const [atsRes, skillRes] = await Promise.allSettled([
        // Both calls now send targetRoles from global context
        atsAPI.score({ resumeText, targetRoles }),
        skillsAPI.analyze({ resumeText, targetRoles }),
      ]);

      if (atsRes.status   === 'fulfilled') setAtsResult(atsRes.value);
      if (skillRes.status === 'fulfilled') setSkillResult(skillRes.value);
      if (atsRes.status === 'rejected' && skillRes.status === 'rejected')
        throw new Error(atsRes.reason?.message || 'Analysis failed');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const hasResults = atsResult || skillResult;

  return (
    <div className="rup-page">
      <div className="rup-container">

        {/* ── Header ── */}
        <div className="rup-header">
          <div className="rup-eyebrow">
            <Sparkles size={13} /> AI-Powered Resume Analyser
          </div>
          <h1 className="rup-title">
            Know How Your Resume <span className="rup-title-accent">Really Performs</span>
          </h1>
          <p className="rup-subtitle">
            Upload your resume and get an instant ATS compatibility score,
            skill gap analysis, and personalised improvement tips.
          </p>
        </div>

        {/* ── Upload card ── */}
        <div className="rup-card">

          {/* Drop zone */}
          <div
            className={`rup-dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }} onChange={e => acceptFile(e.target.files[0])} />

            {file ? (
              <div className="rup-file-preview">
                <div className="rup-file-icon"><FileText size={26} /></div>
                <div className="rup-file-info">
                  <p className="rup-file-name">{file.name}</p>
                  <p className="rup-file-size">{(file.size / 1024).toFixed(1)} KB · Ready to analyse</p>
                </div>
                <button className="rup-file-remove" onClick={e => {
                  e.stopPropagation(); setFile(null); setAtsResult(null); setSkillResult(null);
                }}>
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="rup-drop-content">
                <div className="rup-drop-icon"><Upload size={28} /></div>
                <p className="rup-drop-title">Drop your resume here</p>
                <p className="rup-drop-sub">or click to browse &nbsp;·&nbsp; PDF, DOCX, TXT &nbsp;·&nbsp; max 5 MB</p>
              </div>
            )}
          </div>

          {/* ── Target Role Selector (reads/writes global context) ── */}
          <TargetRoleSelector
            selectedRoles={targetRoles}
            onChange={setTargetRoles}
          />

          {error && (
            <div className="rup-error"><AlertCircle size={14} /> {error}</div>
          )}

          <button className="rup-analyse-btn" onClick={handleAnalyse} disabled={!file || analyzing}>
            {analyzing
              ? <><span className="rup-btn-spinner" /> Analysing your resume…</>
              : <><Zap size={16} /> {hasResults ? 'Re-analyse' : 'Analyse Resume'}</>}
          </button>
        </div>

        {/* ── Results ── */}
        {hasResults && (
          <div className="rup-results">
            <div className="rup-tabs">
              <button className={`rup-tab ${activeTab === 'ats' ? 'active' : ''}`} onClick={() => setActiveTab('ats')}>
                <Target size={14} /> ATS Score
              </button>
              <button className={`rup-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
                <BarChart2 size={14} /> Skill Analytics
              </button>
            </div>

            {/* ATS tab */}
            {activeTab === 'ats' && atsResult && (
              <div className="rup-tab-content">
                <div className="rup-ats-hero">
                  <ScoreRing score={atsResult.score ?? atsResult.atsScore ?? 0} />
                  <div className="rup-ats-summary">
                    <h2 className="rup-section-heading">ATS Compatibility Score</h2>
                    <p className="rup-muted">{atsResult.summary || 'Your resume has been analysed against ATS systems.'}</p>
                    <div className="rup-score-bars">
                      {(atsResult.breakdown || [
                        { label: 'Keyword Match',    score: atsResult.keywordScore     ?? 70, color: '#7C3AED' },
                        { label: 'Formatting',       score: atsResult.formattingScore  ?? 80, color: '#8B5CF6' },
                        { label: 'Readability',      score: atsResult.readabilityScore ?? 75, color: '#6D28D9' },
                        { label: 'Section Coverage', score: atsResult.sectionScore     ?? 65, color: '#A78BFA' },
                      ]).map((item, i) => (
                        <ScoreBar key={i} label={item.label} score={item.score} color={item.color || '#7C3AED'} />
                      ))}
                    </div>
                  </div>
                </div>

                {(atsResult.matchedKeywords || atsResult.keywords?.matched || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><CheckCircle2 size={15} style={{ color: '#059669' }} /> Keywords Found</h3>
                    <div className="rup-tags">
                      {(atsResult.matchedKeywords || atsResult.keywords?.matched || []).map((k, i) => <SkillTag key={i} skill={k} type="matched" />)}
                    </div>
                  </div>
                )}

                {(atsResult.missingKeywords || atsResult.keywords?.missing || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><XCircle size={15} style={{ color: '#DC2626' }} /> Missing Keywords</h3>
                    <div className="rup-tags">
                      {(atsResult.missingKeywords || atsResult.keywords?.missing || []).map((k, i) => <SkillTag key={i} skill={k} type="missing" />)}
                    </div>
                  </div>
                )}

                {(atsResult.suggestions || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><TrendingUp size={15} style={{ color: '#D97706' }} /> How to Improve</h3>
                    <ul className="rup-suggestions">
                      {(atsResult.suggestions || []).map((s, i) => (
                        <li key={i} className="rup-suggestion-item">
                          <ChevronRight size={13} style={{ color: '#7C3AED', flexShrink: 0 }} />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Skills tab */}
            {activeTab === 'skills' && skillResult && (
              <div className="rup-tab-content">
                <div className="rup-skill-stats">
                  {[
                    { icon: <Star size={18}/>,        label: 'Skills Found',  value: (skillResult.detectedSkills || skillResult.skills || []).length,   color: '#7C3AED' },
                    { icon: <CheckCircle2 size={18}/>, label: 'Strong Match',  value: (skillResult.strongSkills   || skillResult.matched || []).length,   color: '#059669' },
                    { icon: <Lightbulb size={18}/>,   label: 'Suggested',     value: (skillResult.suggestedSkills|| skillResult.suggested || []).length, color: '#D97706' },
                    { icon: <TrendingUp size={18}/>,  label: 'Growth Areas',  value: (skillResult.growthAreas    || skillResult.missing || []).length,   color: '#DC2626' },
                  ].map((stat, i) => (
                    <div key={i} className="rup-stat-card">
                      <div style={{ color: stat.color }}>{stat.icon}</div>
                      <div className="rup-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="rup-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {(skillResult.detectedSkills || skillResult.skills || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><Star size={15} style={{ color: '#7C3AED' }} /> Detected Skills</h3>
                    <div className="rup-tags">
                      {(skillResult.detectedSkills || skillResult.skills || []).map((s, i) => <SkillTag key={i} skill={typeof s === 'object' ? s.name : s} type="matched" />)}
                    </div>
                  </div>
                )}

                {(skillResult.suggestedSkills || skillResult.suggested || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><Lightbulb size={15} style={{ color: '#D97706' }} /> Skills to Add</h3>
                    <p className="rup-muted">These skills would strengthen your profile for similar roles.</p>
                    <div className="rup-tags">
                      {(skillResult.suggestedSkills || skillResult.suggested || []).map((s, i) => <SkillTag key={i} skill={typeof s === 'object' ? s.name : s} type="suggested" />)}
                    </div>
                  </div>
                )}

                {(skillResult.growthAreas || skillResult.missing || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><TrendingUp size={15} style={{ color: '#DC2626' }} /> Growth Areas</h3>
                    <p className="rup-muted">Skills increasingly in-demand for your target roles.</p>
                    <div className="rup-tags">
                      {(skillResult.growthAreas || skillResult.missing || []).map((s, i) => <SkillTag key={i} skill={typeof s === 'object' ? s.name : s} type="missing" />)}
                    </div>
                  </div>
                )}

                {(skillResult.insights || skillResult.tips || []).length > 0 && (
                  <div className="rup-section">
                    <h3 className="rup-section-title"><Sparkles size={15} style={{ color: '#7C3AED' }} /> Insights</h3>
                    <ul className="rup-suggestions">
                      {(skillResult.insights || skillResult.tips || []).map((tip, i) => (
                        <li key={i} className="rup-suggestion-item">
                          <ChevronRight size={13} style={{ color: '#7C3AED', flexShrink: 0 }} />{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ats' && !atsResult && (
              <div className="rup-empty"><AlertCircle size={20} style={{ color: '#D97706' }} /><p>ATS results unavailable. Try re-analysing with a target role selected.</p></div>
            )}
            {activeTab === 'skills' && !skillResult && (
              <div className="rup-empty"><AlertCircle size={20} style={{ color: '#D97706' }} /><p>Skill analytics unavailable. Try re-analysing.</p></div>
            )}
          </div>
        )}

        {/* ── Empty state steps ── */}
        {!hasResults && !analyzing && (
          <div className="rup-steps">
            {[
              { icon: <Upload size={20}/>,     n: '01', title: 'Upload Resume',    desc: 'PDF, DOCX, or plain text — any format.' },
              { icon: <Target size={20}/>,     n: '02', title: 'Pick Target Role', desc: 'Select the role(s) you are applying for.' },
              { icon: <Zap size={20}/>,        n: '03', title: 'Instant Analysis', desc: 'ATS score + full skill breakdown in seconds.' },
              { icon: <TrendingUp size={20}/>, n: '04', title: 'Act on Insights',  desc: 'Know exactly what to fix to land more interviews.' },
            ].map((step, i) => (
              <div key={i} className="rup-step">
                <div className="rup-step-num">{step.n}</div>
                <div className="rup-step-icon">{step.icon}</div>
                <h3 className="rup-step-title">{step.title}</h3>
                <p className="rup-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeUploadPage;