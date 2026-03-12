import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ALL_SKILLS } from '../data/staticData';
import {
  User, Briefcase, GraduationCap, Code2, FolderOpen, Award,
  Info, Plus, Trash2, X, ChevronDown, ChevronUp, ArrowRight, Sparkles,
  Save, CheckCircle
} from 'lucide-react';
import './BuilderPage.css';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
  { id: 'summary', label: 'Professional Summary', icon: <Sparkles size={18} /> },
  { id: 'experience', label: 'Work Experience', icon: <Briefcase size={18} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'skills', label: 'Skills', icon: <Code2 size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={18} /> },
  { id: 'additional', label: 'Additional Info', icon: <Info size={18} /> },
];

const CollapsibleSection = ({ id, label, icon, isOpen, onToggle, children }) => (
  <div className={`builder-section ${isOpen ? 'open' : ''}`}>
    <button className="section-toggle" onClick={() => onToggle(id)}>
      <div className="section-toggle-left">
        <span className="section-icon">{icon}</span>
        <span className="section-label">{label}</span>
      </div>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    {isOpen && <div className="section-body">{children}</div>}
  </div>
);

const SkillSelector = ({ skills, setSkills }) => {
  const [query, setQuery] = useState('');
  const suggestions = query.length > 1
    ? ALL_SKILLS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !skills.includes(s)).slice(0, 8)
    : [];

  const addSkill = (skill) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
    setQuery('');
  };
  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) addSkill(query.trim());
  };

  return (
    <div className="skill-selector">
      <div className="skill-input-wrap">
        <input
          type="text" className="form-input"
          placeholder="Type a skill and press Enter, or pick from suggestions..."
          value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
        />
        {suggestions.length > 0 && (
          <div className="skill-suggestions">
            {suggestions.map(s => (
              <button key={s} className="skill-suggestion-btn" onClick={() => addSkill(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>
      {skills.length > 0 && (
        <div className="skill-tags">
          {skills.map(skill => (
            <span key={skill} className="skill-tag">
              {skill}
              <button className="skill-remove" onClick={() => removeSkill(skill)}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
      <p className="field-hint">Start typing to see suggestions. Press Enter to add custom skills.</p>
    </div>
  );
};

const ExperienceEntry = ({ data, onChange, onRemove, index }) => (
  <div className="entry-card">
    <div className="entry-header">
      <span className="entry-num">Experience {index + 1}</span>
      <button className="remove-btn" onClick={onRemove}><Trash2 size={15} /></button>
    </div>
    <div className="two-col-grid">
      <div className="form-group">
        <label className="form-label">Job Title *</label>
        <input className="form-input" placeholder="e.g. Software Engineer" value={data.title}
          onChange={e => onChange({ ...data, title: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Company *</label>
        <input className="form-input" placeholder="e.g. Google" value={data.company}
          onChange={e => onChange({ ...data, company: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Location</label>
        <input className="form-input" placeholder="e.g. San Francisco, CA" value={data.location}
          onChange={e => onChange({ ...data, location: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Duration</label>
        <input className="form-input" placeholder="e.g. Jan 2022 – Present" value={data.duration}
          onChange={e => onChange({ ...data, duration: e.target.value })} />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Description / Achievements</label>
      <textarea className="form-input" rows={4}
        placeholder="• Led development of...&#10;• Reduced latency by 40%...&#10;• Collaborated with cross-functional teams..."
        value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} />
    </div>
  </div>
);

const EducationEntry = ({ data, onChange, onRemove, index }) => (
  <div className="entry-card">
    <div className="entry-header">
      <span className="entry-num">Education {index + 1}</span>
      <button className="remove-btn" onClick={onRemove}><Trash2 size={15} /></button>
    </div>
    <div className="two-col-grid">
      <div className="form-group">
        <label className="form-label">Degree / Program *</label>
        <input className="form-input" placeholder="e.g. B.Tech Computer Science" value={data.degree}
          onChange={e => onChange({ ...data, degree: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Institution *</label>
        <input className="form-input" placeholder="e.g. IIT Bombay" value={data.institution}
          onChange={e => onChange({ ...data, institution: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Duration</label>
        <input className="form-input" placeholder="e.g. 2019 – 2023" value={data.duration}
          onChange={e => onChange({ ...data, duration: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">GPA / Percentage</label>
        <input className="form-input" placeholder="e.g. 8.5/10" value={data.gpa}
          onChange={e => onChange({ ...data, gpa: e.target.value })} />
      </div>
    </div>
  </div>
);

const ProjectEntry = ({ data, onChange, onRemove, index }) => (
  <div className="entry-card">
    <div className="entry-header">
      <span className="entry-num">Project {index + 1}</span>
      <button className="remove-btn" onClick={onRemove}><Trash2 size={15} /></button>
    </div>
    <div className="two-col-grid">
      <div className="form-group">
        <label className="form-label">Project Name *</label>
        <input className="form-input" placeholder="e.g. E-Commerce Platform" value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Technologies Used</label>
        <input className="form-input" placeholder="e.g. React, Node.js, PostgreSQL" value={data.tech}
          onChange={e => onChange({ ...data, tech: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Project Link</label>
        <input className="form-input" placeholder="https://github.com/..." value={data.link}
          onChange={e => onChange({ ...data, link: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Duration</label>
        <input className="form-input" placeholder="e.g. 3 months" value={data.duration}
          onChange={e => onChange({ ...data, duration: e.target.value })} />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Description</label>
      <textarea className="form-input" rows={3}
        placeholder="Describe what you built and the impact..."
        value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} />
    </div>
  </div>
);

const CertEntry = ({ data, onChange, onRemove, index }) => (
  <div className="entry-card">
    <div className="entry-header">
      <span className="entry-num">Certification {index + 1}</span>
      <button className="remove-btn" onClick={onRemove}><Trash2 size={15} /></button>
    </div>
    <div className="two-col-grid">
      <div className="form-group">
        <label className="form-label">Certification Name *</label>
        <input className="form-input" placeholder="e.g. AWS Solutions Architect" value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Issuing Organization</label>
        <input className="form-input" placeholder="e.g. Amazon Web Services" value={data.issuer}
          onChange={e => onChange({ ...data, issuer: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Date</label>
        <input className="form-input" placeholder="e.g. March 2024" value={data.date}
          onChange={e => onChange({ ...data, date: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Credential ID / URL</label>
        <input className="form-input" placeholder="Optional" value={data.credentialId}
          onChange={e => onChange({ ...data, credentialId: e.target.value })} />
      </div>
    </div>
  </div>
);

const BuilderPage = () => {
  const navigate = useNavigate();
  const { resumeData, setResumeData, savePortfolioToBackend } = useApp();
  const [openSections, setOpenSections] = useState({
    personal: true, summary: false, experience: false, education: false,
    skills: false, projects: false, certifications: false, additional: false,
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [saveError, setSaveError] = useState('');

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const updateField   = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }));
  const addEntry      = (field, template) => setResumeData(prev => ({ ...prev, [field]: [...(prev[field] || []), template] }));
  const updateEntry   = (field, index, value) => {
    const arr = [...(resumeData[field] || [])]; arr[index] = value;
    setResumeData(prev => ({ ...prev, [field]: arr }));
  };
  const removeEntry   = (field, index) => {
    const arr = (resumeData[field] || []).filter((_, i) => i !== index);
    setResumeData(prev => ({ ...prev, [field]: arr }));
  };

  // Save to backend (only if logged in with token)
  const handleSave = async () => {
    setSaving(true); setSaveError('');
    try {
      await savePortfolioToBackend();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError('Could not save. Make sure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    await handleSave(); // auto-save before navigating
    navigate('/preview');
  };

  return (
    <div className="builder-page">
      <div className="container">
        <div className="builder-header">
          <div className="section-eyebrow"><Sparkles size={13} /> Step 2 of 3</div>
          <h1 className="builder-title">Fill Your Details</h1>
          <p className="builder-subtitle">Complete each section to build a comprehensive, ATS-optimized resume.</p>

          {/* Save button */}
          <div className="builder-save-row">
            <button className="builder-save-btn" onClick={handleSave} disabled={saving}>
              {saved
                ? <><CheckCircle size={15} /> Saved!</>
                : saving ? 'Saving...' : <><Save size={15} /> Save Progress</>}
            </button>
            {saveError && <span className="save-error">{saveError}</span>}
          </div>
        </div>

        <div className="builder-layout">
          {/* Sidebar nav */}
          <aside className="builder-nav">
            {SECTIONS.map(s => (
              <button key={s.id} className={`builder-nav-item ${openSections[s.id] ? 'active' : ''}`}
                onClick={() => {
                  setOpenSections(prev => ({ ...prev, [s.id]: true }));
                  document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                <span className="nav-item-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </aside>

          {/* Form sections */}
          <div className="builder-form">

            <div id="section-personal">
              <CollapsibleSection id="personal" label="Personal Info" icon={<User size={18} />} isOpen={openSections.personal} onToggle={toggleSection}>
                <div className="two-col-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="e.g. Rohan Sharma" value={resumeData.name} onChange={e => updateField('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Title *</label>
                    <input className="form-input" placeholder="e.g. Full Stack Developer" value={resumeData.professionalTitle} onChange={e => updateField('professionalTitle', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" placeholder="you@example.com" value={resumeData.email} onChange={e => updateField('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" placeholder="e.g. +91 9876543210" value={resumeData.phone} onChange={e => updateField('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Location</label>
                    <input className="form-input" placeholder="e.g. Mumbai, India" value={resumeData.city} onChange={e => updateField('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile</label>
                    <input className="form-input" placeholder="linkedin.com/in/yourname" value={resumeData.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub Username</label>
                    <input className="form-input" placeholder="github.com/yourname" value={resumeData.github} onChange={e => updateField('github', e.target.value)} />
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            <div id="section-summary">
              <CollapsibleSection id="summary" label="Professional Summary" icon={<Sparkles size={18} />} isOpen={openSections.summary} onToggle={toggleSection}>
                <div className="form-group">
                  <label className="form-label">Summary</label>
                  <textarea className="form-input" rows={5}
                    placeholder="Write a compelling 3-4 sentence summary highlighting your experience, skills, and value proposition..."
                    value={resumeData.summary} onChange={e => updateField('summary', e.target.value)} />
                  <p className="field-hint">Tip: Mention your years of experience, top skills, and a key achievement.</p>
                </div>
              </CollapsibleSection>
            </div>

            <div id="section-experience">
              <CollapsibleSection id="experience" label="Work Experience" icon={<Briefcase size={18} />} isOpen={openSections.experience} onToggle={toggleSection}>
                {(resumeData.workExperience || []).map((exp, i) => (
                  <ExperienceEntry key={i} index={i} data={exp}
                    onChange={val => updateEntry('workExperience', i, val)}
                    onRemove={() => removeEntry('workExperience', i)} />
                ))}
                <button className="add-entry-btn" onClick={() => addEntry('workExperience', { title: '', company: '', location: '', duration: '', description: '' })}>
                  <Plus size={16} /> Add Work Experience
                </button>
              </CollapsibleSection>
            </div>

            <div id="section-education">
              <CollapsibleSection id="education" label="Education" icon={<GraduationCap size={18} />} isOpen={openSections.education} onToggle={toggleSection}>
                {(resumeData.education || []).map((edu, i) => (
                  <EducationEntry key={i} index={i} data={edu}
                    onChange={val => updateEntry('education', i, val)}
                    onRemove={() => removeEntry('education', i)} />
                ))}
                <button className="add-entry-btn" onClick={() => addEntry('education', { degree: '', institution: '', duration: '', gpa: '' })}>
                  <Plus size={16} /> Add Education
                </button>
              </CollapsibleSection>
            </div>

            <div id="section-skills">
              <CollapsibleSection id="skills" label="Skills" icon={<Code2 size={18} />} isOpen={openSections.skills} onToggle={toggleSection}>
                <SkillSelector skills={resumeData.skills || []} setSkills={val => updateField('skills', val)} />
              </CollapsibleSection>
            </div>

            <div id="section-projects">
              <CollapsibleSection id="projects" label="Projects" icon={<FolderOpen size={18} />} isOpen={openSections.projects} onToggle={toggleSection}>
                {(resumeData.projects || []).map((proj, i) => (
                  <ProjectEntry key={i} index={i} data={proj}
                    onChange={val => updateEntry('projects', i, val)}
                    onRemove={() => removeEntry('projects', i)} />
                ))}
                <button className="add-entry-btn" onClick={() => addEntry('projects', { name: '', tech: '', link: '', duration: '', description: '' })}>
                  <Plus size={16} /> Add Project
                </button>
              </CollapsibleSection>
            </div>

            <div id="section-certifications">
              <CollapsibleSection id="certifications" label="Certifications" icon={<Award size={18} />} isOpen={openSections.certifications} onToggle={toggleSection}>
                {(resumeData.certifications || []).map((cert, i) => (
                  <CertEntry key={i} index={i} data={cert}
                    onChange={val => updateEntry('certifications', i, val)}
                    onRemove={() => removeEntry('certifications', i)} />
                ))}
                <button className="add-entry-btn" onClick={() => addEntry('certifications', { name: '', issuer: '', date: '', credentialId: '' })}>
                  <Plus size={16} /> Add Certification
                </button>
              </CollapsibleSection>
            </div>

            <div id="section-additional">
              <CollapsibleSection id="additional" label="Additional Info" icon={<Info size={18} />} isOpen={openSections.additional} onToggle={toggleSection}>
                <div className="form-group">
                  <label className="form-label">Additional Information</label>
                  <textarea className="form-input" rows={4}
                    placeholder="Languages spoken, volunteer experience, hobbies, publications, awards..."
                    value={resumeData.additionalInfo} onChange={e => updateField('additionalInfo', e.target.value)} />
                </div>
              </CollapsibleSection>
            </div>

            <div className="builder-form-footer">
              <button className="btn-primary continue-btn" onClick={handleContinue}>
                Preview Resume <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;