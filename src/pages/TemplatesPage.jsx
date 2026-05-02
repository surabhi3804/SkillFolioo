import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TEMPLATES } from '../data/staticData';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import './TemplatesPage.css';

/* ── Mini previews — each matches the uploaded template image ── */
const TemplatePreviewMini = ({ template }) => {
  const previews = {

    /* Image 2: Harshibar — centered name, bold section dividers, bullets */
    'classic-clean': (
      <div style={{ padding: '10px 12px', background: '#fff', height: '100%', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', paddingBottom: 5, marginBottom: 6, borderBottom: '1.5px solid #111' }}>
          <div style={{ height: 7, background: '#111', borderRadius: 1, width: '50%', margin: '0 auto 3px' }} />
          <div style={{ height: 3.5, background: '#666', borderRadius: 1, width: '72%', margin: '0 auto' }} />
        </div>
        <div style={{ height: 4, background: '#111', borderRadius: 1, width: '28%', marginBottom: 2 }} />
        <div style={{ height: 1, background: '#111', width: '100%', marginBottom: 4 }} />
        {['88%','72%','80%','65%'].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 2.5 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#444', flexShrink: 0 }} />
            <div style={{ height: 3, background: '#ccc', borderRadius: 1, width: w }} />
          </div>
        ))}
        <div style={{ height: 4, background: '#111', borderRadius: 1, width: '22%', marginTop: 6, marginBottom: 2 }} />
        <div style={{ height: 1, background: '#111', width: '100%', marginBottom: 4 }} />
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {['38%','30%','42%','28%','36%'].map((w, i) => (
            <div key={i} style={{ height: 3, background: '#bbb', borderRadius: 1, width: w }} />
          ))}
        </div>
      </div>
    ),

    /* Image 3: Guillaume — dark navy sidebar with photo circle, two-column */
    'sidebar-pro': (
      <div style={{ display: 'flex', height: '100%', background: '#fff', overflow: 'hidden' }}>
        <div style={{ width: '37%', background: '#2C3E6B', padding: '10px 7px', boxSizing: 'border-box' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', margin: '0 auto 5px', border: '1.5px solid rgba(255,255,255,0.4)' }} />
          <div style={{ height: 5, background: 'rgba(255,255,255,0.8)', borderRadius: 1, width: '82%', margin: '0 auto 3px' }} />
          <div style={{ height: 3, background: 'rgba(255,255,255,0.45)', borderRadius: 1, width: '92%', margin: '0 auto 8px' }} />
          <div style={{ height: 3, background: 'rgba(255,255,255,0.55)', borderRadius: 1, width: '65%', marginBottom: 2 }} />
          {['80%','72%','60%','76%','58%'].map((w, i) => (
            <div key={i} style={{ height: 2.5, background: 'rgba(255,255,255,0.3)', borderRadius: 1, width: w, marginBottom: 2 }} />
          ))}
        </div>
        <div style={{ flex: 1, padding: '8px 7px', boxSizing: 'border-box' }}>
          <div style={{ fontSize: 4, fontWeight: 700, color: '#2C3E6B', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 1 }}>EXPERIENCE</div>
          <div style={{ height: 0.75, background: '#2C3E6B', marginBottom: 4 }} />
          {['90%','70%','82%','65%','78%'].map((w, i) => (
            <div key={i} style={{ height: 3, background: i % 3 === 0 ? '#888' : '#ddd', borderRadius: 1, width: w, marginBottom: 2.5 }} />
          ))}
          <div style={{ fontSize: 4, fontWeight: 700, color: '#2C3E6B', textTransform: 'uppercase', letterSpacing: 0.8, margin: '5px 0 1px' }}>EDUCATION</div>
          <div style={{ height: 0.75, background: '#2C3E6B', marginBottom: 3 }} />
          {['80%','62%'].map((w, i) => (
            <div key={i} style={{ height: 3, background: '#ddd', borderRadius: 1, width: w, marginBottom: 2 }} />
          ))}
        </div>
      </div>
    ),

    /* Image 4: John Doe — gray header band, status/skills row, colored section labels */
    'modern-header': (
      <div style={{ background: '#fff', height: '100%', overflow: 'hidden' }}>
        <div style={{ background: '#4A5568', padding: '7px 9px 8px', marginBottom: 5 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.92)', borderRadius: 1, width: '48%', marginBottom: 3 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {['30%','28%','25%'].map((w, i) => (
              <div key={i} style={{ height: 3, background: 'rgba(255,255,255,0.5)', borderRadius: 1, width: w }} />
            ))}
          </div>
        </div>
        <div style={{ padding: '0 9px' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
            {['Status','Skills','Interests'].map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: 3.5, color: '#fff', background: '#4A5568', padding: '1px 3px', borderRadius: 2, marginBottom: 2, display: 'inline-block' }}>{label}</div>
                <div style={{ height: 2.5, background: '#e2e8f0', borderRadius: 1, width: '90%' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
            <div style={{ width: 2, height: 9, background: '#4A5568', borderRadius: 1 }} />
            <div style={{ fontSize: 4, fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: 0.8 }}>Experience</div>
          </div>
          {['88%','72%','80%'].map((w, i) => (
            <div key={i} style={{ height: 2.5, background: '#e2e8f0', borderRadius: 1, width: w, marginBottom: 2 }} />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, margin: '4px 0 3px' }}>
            <div style={{ width: 2, height: 9, background: '#4A5568', borderRadius: 1 }} />
            <div style={{ fontSize: 4, fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: 0.8 }}>Education</div>
          </div>
          {['75%','60%'].map((w, i) => (
            <div key={i} style={{ height: 2.5, background: '#e2e8f0', borderRadius: 1, width: w, marginBottom: 2 }} />
          ))}
        </div>
      </div>
    ),

    /* Image 5: Clean CV — centered name, blue underlined sections, GitHub/LinkedIn footer */
    'minimal-blue': (
      <div style={{ padding: '9px 11px', background: '#fff', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ borderBottom: '1.5px solid #1E40AF', paddingBottom: 4, marginBottom: 5 }}>
          <div style={{ height: 7, background: '#1E40AF', borderRadius: 1, width: '42%', marginBottom: 3 }} />
          <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            {['24%','22%','26%','20%'].map((w, i) => (
              <div key={i} style={{ height: 2.5, background: '#94a3b8', borderRadius: 1, width: w }} />
            ))}
          </div>
        </div>
        <div style={{ height: 2.5, background: '#e2e8f0', borderRadius: 1, width: '94%', marginBottom: 1.5 }} />
        <div style={{ height: 2.5, background: '#e2e8f0', borderRadius: 1, width: '78%', marginBottom: 5 }} />
        <div style={{ fontSize: 4, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1E40AF', paddingBottom: 1, marginBottom: 3 }}>WORK EXPERIENCE</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ height: 3.5, background: '#555', borderRadius: 1, width: '45%' }} />
          <div style={{ height: 3, background: '#94a3b8', borderRadius: 1, width: '25%' }} />
        </div>
        {['88%','72%','80%'].map((w, i) => (
          <div key={i} style={{ height: 2.5, background: '#dde', borderRadius: 1, width: w, marginBottom: 2 }} />
        ))}
        <div style={{ fontSize: 4, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1E40AF', paddingBottom: 1, margin: '5px 0 3px' }}>PROJECTS</div>
        {['85%','65%'].map((w, i) => (
          <div key={i} style={{ height: 2.5, background: '#dde', borderRadius: 1, width: w, marginBottom: 2 }} />
        ))}
      </div>
    ),

    /* Image 6: Red CV — centered name/subtitle, 3-column info, red accent bars on sections */
    'red-accent': (
      <div style={{ background: '#fff', height: '100%', padding: '9px 11px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <div style={{ height: 6, background: '#DC2626', borderRadius: 1, width: '38%', margin: '0 auto 3px' }} />
          <div style={{ height: 3, background: '#888', borderRadius: 1, width: '50%', margin: '0 auto' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '4px 0', borderTop: '0.75px solid #eee', borderBottom: '0.75px solid #eee', marginBottom: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 3, background: '#DC2626', borderRadius: 1, width: '55%', marginBottom: 2 }} />
              <div style={{ height: 2.5, background: '#ccc', borderRadius: 1, width: '80%' }} />
              <div style={{ height: 5, background: '#e5e5e5', borderRadius: 2, width: '90%', marginTop: 2 }} />
            </div>
          ))}
        </div>
        {[
          { label: 'EDUCATION', lines: ['82%','62%','70%'] },
          { label: 'WORK EXPERIENCES', lines: ['88%','65%'] },
        ].map(({ label, lines }, si) => (
          <div key={si} style={{ marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <div style={{ flex: 1, height: 0.75, background: '#DC2626' }} />
              <div style={{ fontSize: 4, fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>{label}</div>
              <div style={{ flex: 1, height: 0.75, background: '#DC2626' }} />
            </div>
            {lines.map((w, i) => (
              <div key={i} style={{ height: i === 0 ? 3.5 : 2.5, background: i === 0 ? '#DC2626' : '#ddd', borderRadius: 1, width: w, marginBottom: 2 }} />
            ))}
          </div>
        ))}
      </div>
    ),
    /* Image new: autoCV — centered name + icon row, italic small-caps sections, publications */
    'auto-cv': (
      <div style={{ padding: '9px 12px', background: '#fff', height: '100%', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }}>
        {/* Centered name */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ height: 7, background: '#111', borderRadius: 1, width: '44%', margin: '0 auto 3px' }} />
          {/* Icon links row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 2 }}>
            {['1a56db','1a56db','1a56db','1a56db'].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: `#${c}`, opacity: 0.7 }} />
                <div style={{ height: 2.5, background: `#${c}`, borderRadius: 1, width: 18, opacity: 0.8 }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 0.75, background: '#ccc', marginBottom: 3 }} />
        {/* Summary */}
        <div style={{ fontSize: 4.5, fontStyle: 'italic', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Summary</div>
        <div style={{ height: 2.5, background: '#ddd', borderRadius: 1, width: '94%', marginBottom: 1.5 }} />
        <div style={{ height: 2.5, background: '#ddd', borderRadius: 1, width: '70%', marginBottom: 3 }} />
        <div style={{ height: 0.75, background: '#ccc', marginBottom: 3 }} />
        {/* Work Experience */}
        <div style={{ fontSize: 4.5, fontStyle: 'italic', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Work Experience</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
          <div style={{ height: 3, background: '#555', borderRadius: 1, width: '40%' }} />
          <div style={{ height: 2.5, background: '#aaa', borderRadius: 1, width: '28%' }} />
        </div>
        {['92%','76%','84%'].map((w, i) => (
          <div key={i} style={{ height: 2, background: '#ddd', borderRadius: 1, width: w, marginBottom: 1.5 }} />
        ))}
        <div style={{ height: 0.75, background: '#ccc', margin: '3px 0' }} />
        {/* Education */}
        <div style={{ fontSize: 4.5, fontStyle: 'italic', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Education</div>
        {[['2039–pres','PhD Subject, University','GPA: 4.0'],['2023–27','Bachelor\'s, College','GPA: 4.0']].map(([yr, deg, gpa], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
            <div style={{ height: 2.5, background: '#999', borderRadius: 1, width: '18%' }} />
            <div style={{ height: 2.5, background: '#bbb', borderRadius: 1, width: '48%' }} />
            <div style={{ height: 2.5, background: '#1a56db', borderRadius: 1, width: '18%', opacity: 0.6 }} />
          </div>
        ))}
      </div>
    ),
  };

  return previews[template.id] || (
    <div style={{ padding: 12, background: '#f8f8f8', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ height: 4, background: '#ccc', width: '60%', borderRadius: 2 }} />
    </div>
  );
};

/* ── Template Card ─────────────────────────────────────────── */
const TemplateCard = ({ template, isSelected, onSelect }) => (
  <div
    className={`template-card ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(template.id)}
  >
    {isSelected && (
      <div className="selected-badge">
        <CheckCircle size={16} /> Selected
      </div>
    )}
    <div className="template-preview" style={{ '--template-accent': template.accent, background: '#fff', overflow: 'hidden' }}>
      <TemplatePreviewMini template={template} />
    </div>
    <div className="template-info">
      <div className="template-name-row">
        <h3 className="template-name">{template.name}</h3>
        <div className="template-dot" style={{ background: template.accent }} />
      </div>
      <p className="template-desc">{template.description}</p>
      <div className="template-tags">
        {template.tags.map(t => (
          <span key={t} className={`template-tag ${t === 'ATS-Ready' ? 'tag-ats' : 'tag-other'}`}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

/* ── Main Page ─────────────────────────────────────────────── */
const TemplatesPage = () => {
  const navigate = useNavigate();
  const { selectedTemplate, setSelectedTemplate } = useApp();

  const handleSelect = (id) => {
    setSelectedTemplate(id);
  };

  const handleContinue = () => {
    if (!selectedTemplate) return;
    navigate('/builder');
  };

  return (
    <div className="templates-page">
      <div className="container">
        <div className="templates-header">
          <div className="section-eyebrow">
            <Sparkles size={13} /> Step 1 of 3
          </div>
          <h1 className="templates-title">Choose Your Template</h1>
          <p className="templates-subtitle">
            Select from our professionally designed ATS-ready templates, or create your own from scratch.
          </p>
        </div>

        <div className="templates-grid">
          {TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="templates-footer">
          {selectedTemplate && (
            <div className="selected-info animate-fadeIn">
              <CheckCircle size={18} color="var(--success)" />
              <span>
                <strong>{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong> selected
              </span>
            </div>
          )}
          <button
            className="btn-primary continue-btn"
            onClick={handleContinue}
            disabled={!selectedTemplate}
          >
            Continue to Builder <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;