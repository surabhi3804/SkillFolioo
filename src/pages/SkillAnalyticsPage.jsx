// SkillAnalyticsPage.jsx — Chart.js powered charts (professional upgrade)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { TARGET_ROLES, ROLE_SKILLS, ALL_SKILLS } from '../data/staticData';
import { customRolesAPI } from '../services/api';
import {
  BarChart3, Check, Plus, Sparkles, TrendingUp,
  AlertCircle, CheckCircle, Target, X, Zap
} from 'lucide-react';
import './SkillAnalyticsPage.css';

/* ═══════════════════════════════════════════════════════════════════
   CHART.JS LOADER — loads once, resolves a promise
═══════════════════════════════════════════════════════════════════ */
let chartJsReady = null;
function loadChartJs() {
  if (chartJsReady) return chartJsReady;
  chartJsReady = new Promise((resolve) => {
    if (window.Chart) { resolve(window.Chart); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload = () => {
      // Register center-text plugin once
      window.Chart.register({
        id: 'centerText',
        afterDraw(chart) {
          const { _centerLabel: label, _centerSub: sub } = chart.config;
          if (!label) return;
          const { ctx, chartArea: { top, left, width, height } } = chart;
          const cx = left + width / 2;
          const cy = top + height / 2;
          ctx.save();
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text') || '#1e293b';
          ctx.font = `bold ${Math.round(width * 0.18)}px "Syne", system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, cx, sub ? cy - height * 0.08 : cy);
          if (sub) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = `${Math.round(width * 0.095)}px "DM Mono", monospace`;
            ctx.fillText(sub, cx, cy + height * 0.13);
          }
          ctx.restore();
        },
      });
      resolve(window.Chart);
    };
    document.head.appendChild(s);
  });
  return chartJsReady;
}

/* ═══════════════════════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════════════════════ */
function DonutChart({ segments, label, sublabel, size = 160 }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    let alive = true;
    loadChartJs().then((Chart) => {
      if (!alive || !canvasRef.current) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

      const total = segments.reduce((s, g) => s + g.value, 0);
      const data  = total ? segments.map(s => s.value) : [1];
      const colors = total ? segments.map(s => s.color) : ['#e2e8f0'];

      const chart = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels: segments.map(s => s.label),
          datasets: [{
            data, backgroundColor: colors,
            borderWidth: 3,
            borderColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--bg-card') || '#ffffff',
            hoverOffset: 5,
          }],
        },
        options: {
          responsive: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => total
                  ? `${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / total * 100)}%)`
                  : '',
              },
            },
          },
          animation: { animateRotate: true, duration: 800 },
        },
      });

      chart.config._centerLabel = label !== undefined ? String(label) : '';
      chart.config._centerSub   = sublabel || '';
      chart.update();
      chartRef.current = chart;
    });
    return () => {
      alive = false;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [JSON.stringify(segments), label, sublabel]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HORIZONTAL BAR CHART
═══════════════════════════════════════════════════════════════════ */
function HBarChart({ bars, maxVal, barThickness = 22, gap = 10 }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const wrapH = bars.length * (barThickness + gap) + 56;

  useEffect(() => {
    let alive = true;
    loadChartJs().then((Chart) => {
      if (!alive || !canvasRef.current) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: bars.map(b => b.label),
          datasets: [{
            data: bars.map(b => b.value),
            backgroundColor: bars.map(b => b.color),
            borderRadius: barThickness / 2,
            borderSkipped: false,
            barThickness,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => bars[ctx.dataIndex].valueLabel
                  ? `${bars[ctx.dataIndex].valueLabel}`
                  : `${ctx.parsed.x}`,
              },
            },
          },
          scales: {
            x: { display: false, grid: { display: false }, max: maxVal || Math.max(...bars.map(b => b.value), 1) * 1.15 },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 12, family: '"DM Mono", monospace' },
                color: '#64748b',
              },
            },
          },
          animation: { duration: 700 },
        },
      });
    });
    return () => {
      alive = false;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [JSON.stringify(bars), maxVal]);

  return (
    <div style={{ position: 'relative', height: wrapH, width: '100%' }}>
      <canvas ref={canvasRef} role="img" aria-label="Horizontal bar chart" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUPED BAR CHART — Market demand by category
═══════════════════════════════════════════════════════════════════ */
function GroupedBarChart({ groups }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    let alive = true;
    loadChartJs().then((Chart) => {
      if (!alive || !canvasRef.current || !groups.length) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: groups.map(g => g.label.length > 9 ? g.label.slice(0, 8) + '…' : g.label),
          datasets: [
            {
              label: 'High',
              data: groups.map(g => g.values[0]?.value ?? 0),
              backgroundColor: '#34d399',
              borderRadius: 5,
              borderSkipped: false,
            },
            {
              label: 'Medium',
              data: groups.map(g => g.values[1]?.value ?? 0),
              backgroundColor: '#fbbf24',
              borderRadius: 5,
              borderSkipped: false,
            },
            {
              label: 'Low',
              data: groups.map(g => g.values[2]?.value ?? 0),
              backgroundColor: '#f87171',
              borderRadius: 5,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 11, family: '"DM Mono", monospace' }, color: '#64748b' },
            },
            y: {
              max: 100,
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: v => v + '%',
                font: { size: 10 },
                color: '#94a3b8',
              },
            },
          },
          animation: { duration: 700 },
        },
      });
    });
    return () => {
      alive = false;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [JSON.stringify(groups)]);

  return (
    <div style={{ position: 'relative', height: 200, width: '100%' }}>
      <canvas ref={canvasRef} role="img" aria-label="Grouped bar chart of market demand by category" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PALETTE & CATEGORY MAP
═══════════════════════════════════════════════════════════════════ */
const CAT_COLORS = {
  'Languages':      '#0891b2',
  'Frontend':       '#a78bfa',
  'Backend':        '#34d399',
  'Data & AI':      '#fbbf24',
  'DevOps & Cloud': '#f87171',
  'Tools':          '#fb923c',
  'Other':          '#94a3b8',
};
const DEMAND_COLORS = { high: '#34d399', medium: '#fbbf24', low: '#f87171' };

const SKILL_CAT_MAP = {
  'Languages':      ['python','javascript','typescript','java','c++','go','rust','swift','kotlin','scala','php','ruby','dart','r'],
  'Frontend':       ['react','vue.js','next.js','html5','css3','tailwind css','tailwindcss','svelte','angular','redux','webpack','vite'],
  'Backend':        ['node.js','fastapi','django','rest apis','graphql','express','spring','laravel','flask','nestjs'],
  'Data & AI':      ['tensorflow','pytorch','pandas','numpy','sql','llms','machine learning','deep learning','spark','airflow','mlflow','scikit-learn','ai/ml','nlp','data analysis'],
  'DevOps & Cloud': ['docker','kubernetes','aws','gcp','azure','ci/cd','terraform','ansible','jenkins','prometheus','linux','helm'],
  'Tools':          ['git','jira','figma','postman','agile','linux','notion','confluence','vs code','intellij'],
};
function categorizeSkill(skill) {
  const sl = skill.toLowerCase();
  for (const [cat, list] of Object.entries(SKILL_CAT_MAP)) {
    if (list.some(k => sl.includes(k) || k.includes(sl))) return cat;
  }
  return 'Other';
}

/* ═══════════════════════════════════════════════════════════════════
   CHART LEGEND ROW (reusable)
═══════════════════════════════════════════════════════════════════ */
function LegendRow({ items }) {
  return (
    <div className="chart-legend-row">
      {items.map(([label, color]) => (
        <span key={label} className="chart-legend-item">
          <span className="chart-legend-dot" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHART PANEL
═══════════════════════════════════════════════════════════════════ */
function ChartPanel({ userSkills, roleSkills, presentSkills, missingSkills, matchPct, localRole, marketResult, roleLabel }) {

  /* 1. Skill category breakdown (donut) */
  const catCounts = {};
  userSkills.forEach(s => {
    const c = categorizeSkill(s);
    catCounts[c] = (catCounts[c] || 0) + 1;
  });
  const catSegments = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({ label: cat, value: count, color: CAT_COLORS[cat] || '#94a3b8' }));

  /* 2. Role match donut */
  const matchSegments = localRole && roleSkills.length
    ? [
        { label: 'You have', value: presentSkills.length, color: '#34d399' },
        { label: 'Missing',  value: missingSkills.length, color: '#f87171' },
      ]
    : [{ label: 'No role', value: 1, color: '#e2e8f0' }];

  /* 3. Category skill bars */
  const catBars = Object.entries(CAT_COLORS)
    .map(([cat, color]) => ({
      label: cat,
      value: userSkills.filter(s => categorizeSkill(s) === cat).length,
      color,
    }))
    .filter(b => b.value > 0);

  /* 4. Role skill bars */
  const roleMatchBars = localRole && roleSkills.length
    ? [
        { label: 'You have', value: presentSkills.length, color: '#34d399', valueLabel: `${presentSkills.length}/${roleSkills.length}` },
        { label: 'Missing',  value: missingSkills.length, color: '#f87171', valueLabel: String(missingSkills.length) },
        { label: 'Extra',    value: Math.max(0, userSkills.length - presentSkills.length), color: '#6ee7f7', valueLabel: String(Math.max(0, userSkills.length - presentSkills.length)) },
      ]
    : [];

  /* 5. Market demand grouped bar */
  const demandGroups = marketResult ? (() => {
    const grouped = {};
    (marketResult.marketDemand || []).forEach(item => {
      const cat = categorizeSkill(item.skill);
      if (!grouped[cat]) grouped[cat] = { high: 0, medium: 0, low: 0, total: 0 };
      grouped[cat][item.demand]++;
      grouped[cat].total++;
    });
    return Object.entries(grouped).slice(0, 7).map(([cat, counts]) => ({
      label: cat,
      values: [
        { value: Math.round((counts.high   / counts.total) * 100), color: '#34d399' },
        { value: Math.round((counts.medium / counts.total) * 100), color: '#fbbf24' },
        { value: Math.round((counts.low    / counts.total) * 100), color: '#f87171' },
      ],
    }));
  })() : [];

  /* 6. Market demand horizontal bars */
  const demandBars = marketResult
    ? (marketResult.marketDemand || []).map(item => ({
        label:      item.skill,
        value:      item.demand === 'high' ? 90 : item.demand === 'medium' ? 55 : 25,
        color:      DEMAND_COLORS[item.demand] || '#94a3b8',
        valueLabel: item.demand,
      }))
    : [];

  if (!userSkills.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Row 1: two donuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Skill mix donut */}
        <div className="card">
          <h3 className="card-section-title" style={{ fontSize: '0.78rem' }}>
            <BarChart3 size={15} /> Skill Mix
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <DonutChart
              segments={catSegments.length ? catSegments : [{ label: 'Skills', value: 1, color: '#6ee7f7' }]}
              size={148}
              label={userSkills.length}
              sublabel="skills"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              {catSegments.map(seg => (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: seg.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{seg.label}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: seg.color, marginLeft: 'auto', paddingLeft: 8 }}>{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role match donut */}
        <div className="card">
          <h3 className="card-section-title" style={{ fontSize: '0.78rem' }}>
            <Target size={15} /> Role Match
          </h3>
          {localRole && roleSkills.length ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <DonutChart
                segments={matchSegments}
                size={148}
                label={`${matchPct}%`}
                sublabel={roleLabel || 'match'}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'You have', value: presentSkills.length, color: '#34d399' },
                  { label: 'Missing',  value: missingSkills.length, color: '#f87171' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: item.color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: item.color, marginLeft: 'auto', paddingLeft: 8 }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 6, fontSize: '0.68rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  {roleSkills.length} total required
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 130, color: 'var(--border)', fontSize: '0.76rem', gap: 8 }}>
              <Target size={28} style={{ opacity: 0.3 }} />
              Select a target role
            </div>
          )}
        </div>
      </div>

      {/* Row 2: skills per category */}
      {catBars.length > 0 && (
        <div className="card">
          <h3 className="card-section-title" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
            <BarChart3 size={15} /> Skills per Category
          </h3>
          <HBarChart bars={catBars} maxVal={Math.max(...catBars.map(b => b.value), 1)} barThickness={22} />
        </div>
      )}

      {/* Row 3: role skill breakdown */}
      {roleMatchBars.length > 0 && (
        <div className="card">
          <h3 className="card-section-title" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
            <CheckCircle size={15} /> Skills for <span style={{ color: 'var(--primary)', marginLeft: 4 }}>{roleLabel}</span>
          </h3>
          <HBarChart bars={roleMatchBars} maxVal={roleSkills.length || 1} barThickness={22} />
        </div>
      )}

      {/* Row 4: market demand bars */}
      {demandBars.length > 0 && (
        <>
          <div className="card">
            <h3 className="card-section-title" style={{ fontSize: '0.78rem', marginBottom: 4 }}>
              <TrendingUp size={15} /> Your Skills — Market Demand Score
            </h3>
            <HBarChart bars={demandBars} maxVal={100} barThickness={20} />
            <LegendRow items={[['High demand','#34d399'],['Medium','#fbbf24'],['Lower','#f87171']]} />
          </div>

          {demandGroups.length > 0 && (
            <div className="card">
              <h3 className="card-section-title" style={{ fontSize: '0.78rem', marginBottom: 16 }}>
                <BarChart3 size={15} /> Demand Distribution by Category
              </h3>
              <GroupedBarChart groups={demandGroups} />
              <LegendRow items={[['High','#34d399'],['Medium','#fbbf24'],['Low','#f87171']]} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const SkillAnalyticsPage = () => {
  const { resumeData, setResumeData, targetRole, setTargetRole } = useApp();
  const [localRole, setLocalRole] = useState(targetRole);
  const [query, setQuery]         = useState('');

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillError, setCustomSkillError] = useState('');
  const customSkillRef = useRef(null);

  const [aiTab,          setAiTab]          = useState('gap');
  const [marketResult,   setMarketResult]   = useState(null);
  const [marketLoading,  setMarketLoading]  = useState(false);
  const [marketError,    setMarketError]    = useState('');
  const [customRoles,    setCustomRoles]    = useState([]);
  const [showCustomInput,setShowCustomInput]= useState(false);
  const [customRoleLabel,setCustomRoleLabel]= useState('');
  const [customRoleJD,   setCustomRoleJD]   = useState('');
  const [savingRole,     setSavingRole]     = useState(false);

  const userSkills            = resumeData.skills || [];
  const userSkillsLower       = userSkills.map(s => s.toLowerCase());
  const predefinedSkillsLower = ALL_SKILLS.map(s => s.toLowerCase());
  const customAddedSkills     = userSkills.filter(s => !predefinedSkillsLower.includes(s.toLowerCase()));
  const roleSkills            = localRole && localRole !== 'other' ? ROLE_SKILLS[localRole] || [] : [];
  const presentSkills         = roleSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
  const missingSkills         = roleSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));
  const extraSkills           = userSkills.filter(s => !roleSkills.map(r => r.toLowerCase()).includes(s.toLowerCase()));
  const matchPct              = roleSkills.length > 0 ? Math.round((presentSkills.length / roleSkills.length) * 100) : 0;
  const roleLabel             = TARGET_ROLES.find(r => r.id === localRole)?.label || customRoles.find(r => r._id === localRole)?.label || '';

  const suggestions = query.length > 1
    ? ALL_SKILLS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !userSkillsLower.includes(s.toLowerCase())).slice(0, 8)
    : [];

  const addSkill    = (skill) => { setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), skill] })); setQuery(''); };
  const removeSkill = (skill) => { setResumeData(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skill) })); };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (userSkillsLower.includes(trimmed.toLowerCase())) { setCustomSkillError(`"${trimmed}" is already in your skills.`); return; }
    if (trimmed.length > 40) { setCustomSkillError('Skill name must be 40 characters or fewer.'); return; }
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
        setLocalRole(data.role._id); setTargetRole(data.role._id);
        setShowCustomInput(false); setCustomRoleLabel(''); setCustomRoleJD(''); setMarketResult(null);
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

  const MARKET_DATA = {
    'Python':{ demand:'high',trend:'rising'},'JavaScript':{ demand:'high',trend:'stable'},'TypeScript':{ demand:'high',trend:'rising'},'React':{ demand:'high',trend:'stable'},'Node.js':{ demand:'high',trend:'stable'},'Next.js':{ demand:'high',trend:'rising'},'SQL':{ demand:'high',trend:'stable'},'AWS':{ demand:'high',trend:'rising'},'Docker':{ demand:'high',trend:'rising'},'Kubernetes':{ demand:'high',trend:'rising'},'Git':{ demand:'high',trend:'stable'},'REST APIs':{ demand:'high',trend:'stable'},'GraphQL':{ demand:'medium',trend:'rising'},'Java':{ demand:'high',trend:'stable'},'Go':{ demand:'high',trend:'rising'},'Rust':{ demand:'medium',trend:'rising'},'C++':{ demand:'medium',trend:'stable'},'Vue.js':{ demand:'medium',trend:'stable'},'TailwindCSS':{ demand:'high',trend:'rising'},'CSS3':{ demand:'medium',trend:'stable'},'HTML5':{ demand:'medium',trend:'stable'},'FastAPI':{ demand:'high',trend:'rising'},'Django':{ demand:'medium',trend:'stable'},'TensorFlow':{ demand:'high',trend:'rising'},'PyTorch':{ demand:'high',trend:'rising'},'Pandas':{ demand:'high',trend:'stable'},'NumPy':{ demand:'medium',trend:'stable'},'LLMs':{ demand:'high',trend:'rising'},'GCP':{ demand:'high',trend:'rising'},'CI/CD':{ demand:'high',trend:'rising'},'Terraform':{ demand:'high',trend:'rising'},'Figma':{ demand:'high',trend:'rising'},'Agile':{ demand:'medium',trend:'stable'},'Jira':{ demand:'medium',trend:'stable'},'Postman':{ demand:'medium',trend:'stable'},'MongoDB':{ demand:'medium',trend:'stable'},'PostgreSQL':{ demand:'high',trend:'rising'},'Redis':{ demand:'high',trend:'rising'},'Linux':{ demand:'high',trend:'stable'},'Spark':{ demand:'medium',trend:'stable'},'Kafka':{ demand:'medium',trend:'rising'},'Microservices':{ demand:'high',trend:'stable'},'Tailwind CSS':{ demand:'high',trend:'rising'},'AI/ML':{ demand:'high',trend:'rising'},'Machine Learning':{ demand:'high',trend:'rising'},'Deep Learning':{ demand:'high',trend:'rising'},'Data Analysis':{ demand:'high',trend:'rising'},
  };

  useEffect(() => {
    customRolesAPI.getAll().then(data => { if (data.success) setCustomRoles(data.roles); }).catch(() => {});
  }, []);

  const ROLE_RECOMMENDATIONS = {
    'frontend-developer':    ['TypeScript','Next.js','TailwindCSS','GraphQL','Vitest'],
    'backend-developer':     ['Go','PostgreSQL','Redis','Kafka','Kubernetes'],
    'fullstack-developer':   ['TypeScript','Next.js','PostgreSQL','Docker','Redis'],
    'data-scientist':        ['PyTorch','LLMs','Spark','MLflow','Airflow'],
    'aiml-engineer':         ['LLMs','PyTorch','TensorFlow','FastAPI','Kubernetes'],
    'data-engineer':         ['Spark','Kafka','Airflow','dbt','Snowflake'],
    'devops-engineer':       ['Kubernetes','Terraform','CI/CD','Prometheus','Helm'],
    'cloud-engineer':        ['AWS','Terraform','Kubernetes','GCP','CI/CD'],
    'mobile-developer':      ['React Native','Swift','Kotlin','Firebase','TypeScript'],
    'product-manager':       ['Agile','Figma','SQL','Jira','A/B Testing'],
    'uiux-designer':         ['Figma','User Research','Prototyping','CSS3','Accessibility'],
    'cybersecurity-engineer':['Penetration Testing','SIEM','Zero Trust','IAM','OWASP'],
    'qa-engineer':           ['Cypress','Playwright','Jest','CI/CD','Selenium'],
    'embedded-engineer':     ['C++','Rust','RTOS','CAN Bus','FPGA'],
    'blockchain-developer':  ['Solidity','Web3.js','Rust','Smart Contracts','Hardhat'],
  };

  const generateRecommendation = (fit, roleName, missingCount) => {
    if (fit >= 80) return `Your skills are an excellent match for ${roleName} roles — you're well above the industry baseline. Focus on deepening expertise in your strongest areas and staying current with emerging tools.`;
    if (fit >= 55) return `You have a solid foundation for ${roleName} roles with ${fit}% market alignment. Picking up ${missingCount} key missing skills could make you a top-tier candidate.`;
    if (fit >= 30) return `You're building toward a ${roleName} profile. With ${missingCount} targeted skill additions, you can close the gap quickly.`;
    return `Your current skillset is a starting point for ${roleName} roles. Consider a focused 3–6 month learning plan targeting the high-demand skills listed below.`;
  };

  const handleMarketAnalysis = () => {
    if (!userSkills.length) return;
    setMarketLoading(true); setMarketError(''); setMarketResult(null); setAiTab('market');
    setTimeout(() => {
      try {
        const roleName     = TARGET_ROLES.find(r => r.id === localRole)?.label || 'Software Developer';
        const marketDemand = userSkills.map(skill => {
          const key = Object.keys(MARKET_DATA).find(k => k.toLowerCase() === skill.toLowerCase());
          return key ? { skill, ...MARKET_DATA[key] } : { skill, demand: 'medium', trend: 'stable' };
        });
        const scoreMap   = { high: 100, medium: 60, low: 25 };
        const rawScore   = marketDemand.reduce((sum, s) => sum + (scoreMap[s.demand] || 60), 0) / marketDemand.length;
        const roleBonus  = localRole && localRole !== 'other' ? Math.min(20, Math.round((presentSkills.length / Math.max(roleSkills.length, 1)) * 20)) : 0;
        const overallMarketFit   = Math.min(100, Math.round(rawScore * 0.8 + roleBonus));
        const roleRecs           = ROLE_RECOMMENDATIONS[localRole] || ['TypeScript','Docker','PostgreSQL','CI/CD','Redis'];
        const missingHighDemand  = roleRecs.filter(s => !userSkillsLower.includes(s.toLowerCase())).slice(0, 5);
        setMarketResult({ overallMarketFit, recommendation: generateRecommendation(overallMarketFit, roleName, missingHighDemand.length), marketDemand, missingHighDemand });
      } catch (err) { setMarketError('Analysis failed. Please try again.'); console.error(err); }
      finally { setMarketLoading(false); }
    }, 900);
  };

  const getDemandColor = (demand) => ({ high: 'var(--success)', medium: 'var(--warning)', low: 'var(--error)' }[demand] || 'var(--text-muted)');

  const skillCategories = [
    { label: 'Languages',      skills: ['Python','JavaScript','TypeScript','Java','C++','Go','Rust'] },
    { label: 'Frontend',       skills: ['React','Vue.js','Next.js','HTML5','CSS3','Tailwind CSS'] },
    { label: 'Backend',        skills: ['Node.js','FastAPI','Django','REST APIs','GraphQL'] },
    { label: 'Data & AI',      skills: ['TensorFlow','PyTorch','Pandas','NumPy','SQL','LLMs'] },
    { label: 'DevOps & Cloud', skills: ['Docker','Kubernetes','AWS','GCP','CI/CD','Terraform'] },
    { label: 'Tools',          skills: ['Git','Jira','Figma','Postman','Agile'] },
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
          {/* ═══ LEFT SIDEBAR ═══ */}
          <aside className="analytics-sidebar">

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
                {customRoles.map(role => (
                  <button key={role._id}
                    className={`analytics-role-btn analytics-role-custom ${localRole === role._id ? 'active' : ''}`}
                    onClick={() => { setLocalRole(role._id); setTargetRole(role._id); setMarketResult(null); }}>
                    {localRole === role._id && <Check size={12} />}
                    {role.label}
                    <span className="analytics-role-delete" onClick={(e) => handleDeleteCustomRole(role._id, e)}><X size={11} /></span>
                  </button>
                ))}
                <button className="analytics-role-btn analytics-role-add" onClick={() => setShowCustomInput(true)}>
                  <Plus size={12} /> Add Custom Role
                </button>
              </div>
              {showCustomInput && (
                <div className="ats-custom-role-input" style={{ marginTop: 12 }}>
                  <label className="form-label">Role Name</label>
                  <input type="text" className="form-input" placeholder="e.g. React Native Developer" value={customRoleLabel} onChange={e => setCustomRoleLabel(e.target.value)} autoFocus style={{ marginBottom: 10 }} />
                  <label className="form-label">Job Description <span style={{ color: 'var(--error, #ef4444)' }}>*</span></label>
                  <textarea className="form-input" rows={4} placeholder="Paste job description..." value={customRoleJD} onChange={e => setCustomRoleJD(e.target.value)} style={{ marginBottom: 10 }} />
                  <div className="ats-custom-role-row">
                    <button className="btn-primary ats-save-role-btn" onClick={handleSaveCustomRole} disabled={!customRoleLabel.trim() || !customRoleJD.trim() || savingRole}>{savingRole ? 'Saving...' : 'Save Role'}</button>
                    <button className="ats-cancel-role-btn" onClick={() => { setShowCustomInput(false); setCustomRoleLabel(''); setCustomRoleJD(''); }}><X size={14} /> Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="card-section-title"><Zap size={17} /> Market Analysis</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Compare your skills with real market demand.
              </p>
              {marketError && <p style={{ color: 'var(--error)', fontSize: '0.78rem', marginBottom: 8 }}>{marketError}</p>}
              <button className="btn-primary calculate-btn" onClick={handleMarketAnalysis} disabled={marketLoading || userSkills.length === 0} style={{ width: '100%' }}>
                {marketLoading ? 'Analyzing...' : <><TrendingUp size={15} /> Analyze Market Demand</>}
              </button>
              {userSkills.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>Add skills above to enable analysis</p>}
            </div>
          </aside>

          {/* ═══ RIGHT MAIN ═══ */}
          <div className="analytics-main">
            <div className="analytics-tabs">
              <button className={`analytics-tab ${aiTab === 'gap' ? 'active' : ''}`} onClick={() => setAiTab('gap')}>📊 Skill Gap Analysis</button>
              <button className={`analytics-tab ${aiTab === 'market' ? 'active' : ''}`} onClick={() => setAiTab('market')}>📈 Market Demand</button>
              <button className={`analytics-tab ${aiTab === 'charts' ? 'active' : ''}`} onClick={() => setAiTab('charts')}>
                🎯 Visual Overview{userSkills.length > 0 ? ` (${userSkills.length})` : ''}
              </button>
            </div>

            {/* TAB: Gap Analysis */}
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
                        <div className="match-bar-fill" style={{ width: `${matchPct}%`, background: matchPct >= 70 ? 'var(--success)' : matchPct >= 40 ? 'var(--warning)' : 'var(--error)' }} />
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
                    <div className="chip-grid">{presentSkills.map(s => <span key={s} className="analytics-chip present-chip">{s}</span>)}</div>
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
                            <button key={s} className={`analytics-chip category-chip ${added ? 'added' : ''}`} onClick={() => !added && addSkill(s)} disabled={added}>
                              {added && <Check size={11} />} {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="custom-skill-section">
                    <p className="category-label" style={{ marginBottom: 10 }}>Custom Skill</p>
                    <p className="custom-skill-hint-text">Don't see your skill above? Add any custom skill.</p>
                    <div className="custom-skill-input-row">
                      <input ref={customSkillRef} type="text" className="form-input custom-skill-input" placeholder="e.g. Prompt Engineering, Solidity…" value={customSkillInput} onChange={e => { setCustomSkillInput(e.target.value); if (customSkillError) setCustomSkillError(''); }} onKeyDown={e => e.key === 'Enter' && handleAddCustomSkill()} maxLength={40} />
                      <button className="btn-primary custom-skill-add-btn" onClick={handleAddCustomSkill} disabled={!customSkillInput.trim()}><Plus size={14} /> Add Skill</button>
                    </div>
                    {customSkillError && <p className="custom-skill-error">{customSkillError}</p>}
                    {customAddedSkills.length > 0 && (
                      <div className="custom-added-skills-wrap">
                        <p className="custom-added-label">Your custom skills:</p>
                        <div className="chip-grid">
                          {customAddedSkills.map(skill => (
                            <span key={skill} className="analytics-chip custom-chip">✦ {skill}<button className="skill-remove-x" style={{ color: 'inherit' }} onClick={() => removeSkill(skill)}><X size={11} /></button></span>
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

            {/* TAB: Market Demand */}
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
                    <p>Comparing your skills with current industry trends.</p>
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
                      {marketResult.recommendation && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 10 }}>{marketResult.recommendation}</p>}
                    </div>
                    <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                      <h3 className="card-section-title"><BarChart3 size={17} /> Your Skills — Market Demand</h3>
                      <div className="chip-grid">
                        {(marketResult.marketDemand || []).map((item, i) => (
                          <div key={i} className="market-skill-card">
                            <span className="market-skill-name">
                              {item.skill}
                              {!predefinedSkillsLower.includes(item.skill.toLowerCase()) && <span className="market-custom-tag">custom</span>}
                            </span>
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
                            <button key={s} className="analytics-chip missing-chip-btn" onClick={() => addSkill(s)}><Plus size={12} /> {s}</button>
                          ))}
                        </div>
                        <p className="add-skill-hint">Click any skill to add it to your resume</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* TAB: Visual Overview */}
            {aiTab === 'charts' && (
              userSkills.length === 0 ? (
                <div className="card analytics-empty">
                  <BarChart3 size={44} className="empty-icon" />
                  <h3>No skills to visualize yet</h3>
                  <p>Add skills using the panel on the left — charts will appear here instantly.</p>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="charts-tip-banner">
                    <span className="charts-tip-icon">💡</span>
                    <span className="charts-tip-text">
                      {!localRole
                        ? 'Select a target role on the left to unlock role-match charts.'
                        : !marketResult
                        ? 'Run "Analyze Market Demand" to unlock market demand charts.'
                        : 'All charts are live — add or remove skills and they update instantly.'}
                    </span>
                  </div>
                  <ChartPanel
                    userSkills={userSkills}
                    roleSkills={roleSkills}
                    presentSkills={presentSkills}
                    missingSkills={missingSkills}
                    matchPct={matchPct}
                    localRole={localRole}
                    marketResult={marketResult}
                    roleLabel={roleLabel}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAnalyticsPage;
