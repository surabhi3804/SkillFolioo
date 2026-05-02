import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  PORTFOLIO_SECTIONS, PORTFOLIO_PAGES, PORTFOLIO_FONT_OPTIONS,
  PORTFOLIO_BG_PRESETS, COLOR_PRESETS, PORTFOLIO_TEMPLATES
} from '../data/staticData';
import {
  Palette, Type, LayoutGrid, ArrowRight, ArrowLeft,
  GripVertical, Check, ChevronUp, ChevronDown, Eye, Monitor,
  Plus, X, Sparkles
} from 'lucide-react';
import './PortfolioCustomizerPage.css';

const TABS = [
  { id: 'style', label: 'Style & Colors', icon: <Palette size={16} /> },
  { id: 'fonts', label: 'Fonts', icon: <Type size={16} /> },
  { id: 'sections', label: 'Section Order', icon: <LayoutGrid size={16} /> },
  { id: 'pages', label: 'Pages', icon: <Monitor size={16} /> },
];

const LAYOUT_OPTIONS = [
  { id: 'dark', label: 'Dark', desc: 'Dark background, light text' },
  { id: 'light', label: 'Light', desc: 'White background, dark text' },
  { id: 'gradient', label: 'Gradient', desc: 'Gradient dark background' },
];

const DraggableList = ({ items, allItems, onReorder, onToggle, labelKey = 'label' }) => {
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const handleDragStart = (id) => setDragging(id);
  const handleDragOver = (e, id) => { e.preventDefault(); setOver(id); };
  const handleDrop = (targetId) => {
    if (dragging === null || dragging === targetId) { setDragging(null); setOver(null); return; }
    const arr = [...items];
    const fromIdx = arr.indexOf(dragging);
    const toIdx = arr.indexOf(targetId);
    arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, dragging);
    onReorder(arr);
    setDragging(null);
    setOver(null);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const arr = [...items];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onReorder(arr);
  };
  const moveDown = (idx) => {
    if (idx === items.length - 1) return;
    const arr = [...items];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onReorder(arr);
  };

  return (
    <div className="draggable-list">
      {items.map((id, idx) => {
        const item = allItems.find(s => s.id === id || s === id);
        const label = item ? (item[labelKey] || item) : id;
        return (
          <div
            key={id}
            className={`drag-item ${dragging === id ? 'dragging' : ''} ${over === id ? 'drag-over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(id)}
            onDragOver={e => handleDragOver(e, id)}
            onDrop={() => handleDrop(id)}
            onDragEnd={() => { setDragging(null); setOver(null); }}
          >
            <div className="drag-grip"><GripVertical size={16} /></div>
            <span className="drag-label">{label}</span>
            <div className="drag-actions">
              <button className="drag-arrow" onClick={() => moveUp(idx)} disabled={idx === 0}><ChevronUp size={14} /></button>
              <button className="drag-arrow" onClick={() => moveDown(idx)} disabled={idx === items.length - 1}><ChevronDown size={14} /></button>
              {onToggle && (
                <button className="drag-remove" onClick={() => onToggle(id)}><X size={13} /></button>
              )}
            </div>
          </div>
        );
      })}
      {onToggle && (
        <div className="add-section-area">
          {allItems
            .filter(s => !items.includes(s.id || s))
            .map(s => {
              const sid = s.id || s;
              const slabel = s[labelKey] || s;
              return (
                <button key={sid} className="add-section-btn" onClick={() => onToggle(sid)}>
                  <Plus size={12} /> {slabel}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

const ColorPicker = ({ label, value, onChange, presets }) => (
  <div className="color-picker-row">
    <span className="cp-label">{label}</span>
    <div className="cp-controls">
      <div className="cp-presets">
        {presets.map(c => (
          <button
            key={c}
            className={`cp-swatch ${value === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
          >
            {value === c && <Check size={9} />}
          </button>
        ))}
      </div>
      <input type="color" className="cp-native" value={value} onChange={e => onChange(e.target.value)} title="Custom color" />
    </div>
  </div>
);

const LivePreviewMini = ({ style }) => {
  const bg = style.bgColor;
  const primary = style.primaryColor;
  const accent = style.accentColor;
  const text = style.textColor;
  const isLight = style.layout === 'light';
  const lineColor = isLight ? '#E2E8F0' : 'rgba(255,255,255,0.12)';
  return (
    <div className="live-preview" style={{ background: style.layout === 'gradient' ? `linear-gradient(135deg, ${bg} 0%, #1a0030 100%)` : bg, fontFamily: style.font }}>
      <div className="lp-nav" style={{ background: isLight ? '#fff' : 'rgba(255,255,255,0.05)', borderBottom: `1px solid ${lineColor}` }}>
        <div className="lp-logo" style={{ color: primary }}>●  Portfolio</div>
        <div className="lp-nav-links">
          {['Home','About','Projects'].map(p => <span key={p} style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.5)', fontSize: 9 }}>{p}</span>)}
        </div>
      </div>
      <div className="lp-hero">
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${primary}, ${accent})`, marginBottom: 8 }} />
        <div style={{ height: 9, width: '60%', background: isLight ? '#0F172A' : text, borderRadius: 4, marginBottom: 5 }} />
        <div style={{ height: 6, width: '40%', background: primary, borderRadius: 3, marginBottom: 5 }} />
        <div style={{ height: 5, width: '70%', background: lineColor, borderRadius: 3 }} />
        <div className="lp-btns">
          <div style={{ height: 18, width: 60, background: primary, borderRadius: 9 }} />
          <div style={{ height: 18, width: 60, border: `1px solid ${accent}`, borderRadius: 9 }} />
        </div>
      </div>
      <div className="lp-section">
        <div style={{ height: 5, width: 60, background: primary, borderRadius: 3, marginBottom: 8 }} />
        <div className="lp-chips">
          {[50,40,55,45,60].map((w,i) => <div key={i} style={{ width: w, height: 14, background: `${primary}25`, border: `1px solid ${primary}50`, borderRadius: 7 }} />)}
        </div>
      </div>
      <div className="lp-cards">
        {[0,1].map(i => (
          <div key={i} className="lp-card" style={{ background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.05)', border: `1px solid ${lineColor}` }}>
            <div style={{ height: 6, width: '80%', background: lineColor, borderRadius: 3 }} />
            <div style={{ height: 5, width: '60%', background: lineColor, borderRadius: 3, marginTop: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioCustomizerPage = () => {
  const navigate = useNavigate();
  const { portfolioStyle, setPortfolioStyle, selectedPortfolioTemplate, resumeData } = useApp();
  const [activeTab, setActiveTab] = useState('style');

  const selectedTpl = PORTFOLIO_TEMPLATES.find(t => t.id === selectedPortfolioTemplate);

  const update = (key, val) => setPortfolioStyle(prev => ({ ...prev, [key]: val }));

  const toggleSection = (id) => {
    const current = portfolioStyle.sectionOrder;
    if (current.includes(id)) {
      update('sectionOrder', current.filter(s => s !== id));
    } else {
      update('sectionOrder', [...current, id]);
    }
  };

  const togglePage = (page) => {
    const current = portfolioStyle.pageOrder;
    if (current.includes(page)) {
      if (current.length <= 2) return; // min 2 pages
      update('pageOrder', current.filter(p => p !== page));
    } else {
      update('pageOrder', [...current, page]);
    }
  };

  return (
    <div className="pcust-page">
      <div className="container">
        <div className="pcust-header">
          <button className="btn-ghost back-btn" onClick={() => navigate('/portfolio/templates')}>
            <ArrowLeft size={15} /> Back to Templates
          </button>
          <div>
            <p className="section-eyebrow"><Sparkles size={13} /> Portfolio Builder — Step 2 of 3</p>
            <h1 className="pcust-title">Customize Your Portfolio</h1>
          </div>
          <button className="btn-primary" onClick={() => navigate('/portfolio/preview')}>
            <Eye size={16} /> Preview <ArrowRight size={15} />
          </button>
        </div>

        <div className="pcust-layout">
          {/* Left panel: tabs + controls */}
          <div className="pcust-controls">
            <div className="pcust-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`pcust-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="pcust-panel">
              {/* STYLE TAB */}
              {activeTab === 'style' && (
                <div className="tab-content animate-fadeIn">
                  <div className="control-section">
                    <h4 className="control-heading">Layout Style</h4>
                    <div className="layout-options">
                      {LAYOUT_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          className={`layout-opt ${portfolioStyle.layout === opt.id ? 'active' : ''}`}
                          onClick={() => update('layout', opt.id)}
                        >
                          <span className="layout-opt-label">{opt.label}</span>
                          <span className="layout-opt-desc">{opt.desc}</span>
                          {portfolioStyle.layout === opt.id && <Check size={13} className="layout-check" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="control-section">
                    <h4 className="control-heading">Colors</h4>
                    <ColorPicker label="Primary Color" value={portfolioStyle.primaryColor} onChange={v => update('primaryColor', v)} presets={COLOR_PRESETS} />
                    <ColorPicker label="Accent Color" value={portfolioStyle.accentColor} onChange={v => update('accentColor', v)} presets={['#06B6D4','#22D3EE','#10B981','#F59E0B','#EF4444','#8B5CF6','#F059DA','#0EA5E9']} />
                    <ColorPicker label="Background" value={portfolioStyle.bgColor} onChange={v => update('bgColor', v)} presets={PORTFOLIO_BG_PRESETS} />
                    <ColorPicker label="Text Color" value={portfolioStyle.textColor} onChange={v => update('textColor', v)} presets={['#F8FAFC','#E2E8F0','#CBD5E1','#0F172A','#1E293B','#374151','#ffffff','#94A3B8']} />
                  </div>
                </div>
              )}

              {/* FONTS TAB */}
              {activeTab === 'fonts' && (
                <div className="tab-content animate-fadeIn">
                  <div className="control-section">
                    <h4 className="control-heading">Body Font</h4>
                    <div className="font-options">
                      {PORTFOLIO_FONT_OPTIONS.map(f => (
                        <button
                          key={f.value}
                          className={`font-opt ${portfolioStyle.font === f.value ? 'active' : ''}`}
                          style={{ fontFamily: f.value }}
                          onClick={() => update('font', f.value)}
                        >
                          <span className="font-name">{f.label}</span>
                          <span className="font-sample">Aa Bb Cc 123</span>
                          {portfolioStyle.font === f.value && <Check size={13} />}
                        </button>
                      ))}
                    </div>
                    <p className="control-hint">Headings always use Poppins as per the design system.</p>
                  </div>
                </div>
              )}

              {/* SECTIONS TAB */}
              {activeTab === 'sections' && (
                <div className="tab-content animate-fadeIn">
                  <div className="control-section">
                    <h4 className="control-heading">Section Order</h4>
                    <p className="control-hint" style={{ marginBottom: 14 }}>
                      Drag to reorder, or use the arrows. Click ✕ to remove a section. Click "+" to re-add.
                    </p>
                    <DraggableList
                      items={portfolioStyle.sectionOrder}
                      allItems={PORTFOLIO_SECTIONS}
                      onReorder={arr => update('sectionOrder', arr)}
                      onToggle={toggleSection}
                      labelKey="label"
                    />
                  </div>
                </div>
              )}

              {/* PAGES TAB */}
              {activeTab === 'pages' && (
                <div className="tab-content animate-fadeIn">
                  <div className="control-section">
                    <h4 className="control-heading">Page Order &amp; Selection</h4>
                    <p className="control-hint" style={{ marginBottom: 14 }}>
                      Choose which pages appear in your portfolio and drag to reorder navigation.
                    </p>
                    <DraggableList
                      items={portfolioStyle.pageOrder}
                      allItems={PORTFOLIO_PAGES}
                      onReorder={arr => update('pageOrder', arr)}
                      onToggle={togglePage}
                      labelKey={null}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: live preview */}
          <div className="pcust-preview-col">
            <div className="pcust-preview-label">
              <Eye size={14} /> Live Preview
            </div>
            <LivePreviewMini style={portfolioStyle} />
            <div className="pcust-preview-caption">
              This is a simplified preview. See the full portfolio in the next step.
            </div>

            {/* Current settings summary */}
            <div className="settings-summary">
              <div className="ss-row"><span>Template</span><strong>{selectedTpl?.name || '—'}</strong></div>
              <div className="ss-row"><span>Layout</span><strong style={{ textTransform: 'capitalize' }}>{portfolioStyle.layout}</strong></div>
              <div className="ss-row"><span>Font</span><strong>{portfolioStyle.font}</strong></div>
              <div className="ss-row"><span>Sections</span><strong>{portfolioStyle.sectionOrder.length} active</strong></div>
              <div className="ss-row"><span>Pages</span><strong>{portfolioStyle.pageOrder.join(', ')}</strong></div>
              <div className="ss-row">
                <span>Colors</span>
                <div className="ss-colors">
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: portfolioStyle.primaryColor }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: portfolioStyle.accentColor }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: portfolioStyle.bgColor, border: '1px solid var(--border)' }} />
                </div>
              </div>
            </div>

            <button className="btn-primary pcust-next-btn" onClick={() => navigate('/portfolio/preview')}>
              Preview Full Portfolio <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCustomizerPage;
