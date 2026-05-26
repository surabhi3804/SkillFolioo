// backend/controllers/atsController.js
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { extractText } = require('../utils/resumeParse');
const CustomRole = require('../models/CustomRole');

/* ══════════════════════════════════════════════════════════════
   KEYWORD BANKS  (role-specific, no false-positive short words)
══════════════════════════════════════════════════════════════ */
const GENERAL_KEYWORDS = [
  'developed', 'designed', 'implemented', 'managed', 'led', 'built',
  'created', 'optimised', 'improved', 'delivered', 'collaborated',
  'architected', 'deployed', 'automated', 'analysed', 'maintained',
  'mentored', 'launched', 'scaled', 'resolved', 'experience', 'education',
  'skills', 'projects', 'certifications', 'summary', 'achievements',
  'communication', 'leadership', 'teamwork', 'problem-solving', 'analytical',
];

<<<<<<< HEAD
<<<<<<< HEAD
const TECH_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','go','rust','ruby',
=======
// NOTE: 'go' removed — causes false matches inside 'mongodb', 'algorithm' etc.
const TECH_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','rust','ruby',
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  'react','angular','vue','node','express','django','flask','spring','laravel',
  'html','css','sql','nosql','mongodb','postgresql','mysql','redis',
  'aws','azure','gcp','docker','kubernetes','ci/cd','git','linux',
  'rest','api','graphql','microservices','agile','scrum',
];

<<<<<<< HEAD
/* ── Role-specific keyword map ─────────────────────────────── */
=======
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
=======
const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'rust', 'ruby',
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
  'html', 'css', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux',
  'rest', 'graphql', 'microservices', 'agile', 'scrum',
];

// ── Role keyword map: ALL unique terms for that role ──────────
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
const ROLE_KEYWORDS = {
  'Software Engineer': [
    'algorithms', 'data structures', 'system design', 'object-oriented',
    'unit testing', 'debugging', 'code review', 'git', 'agile', 'ci/cd',
    'design patterns', 'refactoring', 'api', 'testing', 'java', 'python',
    'javascript', 'typescript', 'docker', 'microservices',
  ],
  'Frontend Developer': [
    'react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript',
    'responsive design', 'webpack', 'accessibility', 'ui', 'ux', 'next.js',
    'tailwind', 'sass', 'redux', 'vite', 'jest', 'figma', 'storybook',
    'performance optimisation', 'cross-browser',
  ],
  'Backend Developer': [
    'api', 'node.js', 'python', 'java', 'databases', 'sql', 'nosql',
    'microservices', 'authentication', 'rest', 'server', 'docker',
    'redis', 'message queues', 'postgresql', 'mongodb', 'express',
    'django', 'flask', 'spring', 'orm', 'caching', 'oauth', 'jwt',
  ],
  'Full Stack Developer': [
    'react', 'node.js', 'api', 'database', 'frontend', 'backend',
    'javascript', 'typescript', 'mongodb', 'postgresql', 'docker',
    'ci/cd', 'html', 'css', 'rest', 'graphql', 'express', 'next.js',
  ],
  'Data Scientist': [
    'python', 'machine learning', 'statistics', 'pandas', 'numpy',
    'scikit-learn', 'data analysis', 'visualisation', 'jupyter', 'sql',
    'matplotlib', 'seaborn', 'feature engineering', 'model evaluation',
    'regression', 'classification', 'clustering', 'power bi', 'tableau',
  ],
  'AI/ML Engineer': [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'neural networks', 'nlp', 'python', 'model training', 'mlops',
    'transformers', 'hugging face', 'llm', 'computer vision', 'cuda',
    'model deployment', 'data pipelines', 'feature engineering',
  ],
  'Data Engineer': [
    'etl', 'pipelines', 'spark', 'hadoop', 'airflow', 'sql', 'python',
    'data warehousing', 'kafka', 'aws', 'azure', 'bigquery', 'dbt',
    'snowflake', 'data modelling', 'batch processing', 'streaming',
    'redshift', 'databricks', 'orchestration',
  ],
  'DevOps Engineer': [
    'docker', 'kubernetes', 'ci/cd', 'terraform', 'ansible', 'aws',
    'linux', 'bash', 'monitoring', 'git', 'jenkins', 'github actions',
    'helm', 'prometheus', 'grafana', 'argocd', 'infrastructure as code',
    'shell scripting', 'nginx', 'logging',
  ],
  'Cloud Engineer': [
    'aws', 'azure', 'gcp', 'terraform', 'kubernetes', 'iam',
    'cloud architecture', 'networking', 'serverless', 'cost optimisation',
    'vpc', 'load balancing', 'auto scaling', 'security groups',
    'cloud migration', 'lambda', 'containers',
  ],
  'Mobile Developer': [
    'react native', 'flutter', 'swift', 'kotlin', 'ios', 'android',
    'mobile ui', 'app store', 'firebase', 'offline support', 'typescript',
    'redux', 'expo', 'push notifications', 'performance optimisation',
    'rest api', 'dart',
  ],
  'Product Manager': [
    'product roadmap', 'user stories', 'stakeholders', 'agile', 'kpis',
    'market research', 'product strategy', 'backlog', 'prioritisation',
    'okrs', 'data analysis', 'user research', 'ab testing', 'sql',
    'jira', 'confluence', 'go-to-market',
  ],
  'UI/UX Designer': [
    'figma', 'user research', 'wireframing', 'prototyping', 'usability testing',
    'accessibility', 'design systems', 'interaction design', 'sketch',
    'adobe xd', 'user flows', 'information architecture', 'heuristic evaluation',
    'personas', 'journey mapping',
  ],
  'Cybersecurity Engineer': [
    'penetration testing', 'siem', 'firewalls', 'vulnerability assessment',
    'soc', 'incident response', 'cryptography', 'owasp', 'compliance',
    'threat modelling', 'zero trust', 'cloud security', 'devsecops',
    'network security', 'identity management',
  ],
  'QA / Test Engineer': [
    'manual testing', 'automation', 'selenium', 'cypress', 'jest',
    'test plans', 'bug reporting', 'regression', 'api testing', 'ci/cd',
    'playwright', 'performance testing', 'test strategy', 'shift-left',
    'contract testing', 'test cases', 'defect tracking',
  ],
  'Embedded Systems Engineer': [
    'c', 'c++', 'rtos', 'microcontrollers', 'firmware', 'hardware',
    'uart', 'spi', 'i2c', 'low-level programming', 'debugging',
    'cmake', 'power management', 'communication protocols', 'bootloader',
    'embedded linux', 'oscilloscope',
  ],
  'Blockchain Developer': [
    'solidity', 'ethereum', 'smart contracts', 'web3', 'defi',
    'cryptography', 'consensus', 'hyperledger', 'truffle', 'hardhat',
    'layer 2', 'zk proofs', 'security auditing', 'ipfs', 'dao',
    'nft', 'metamask',
  ],
};

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const normalise  = (text) => text.toLowerCase().replace(/[^a-z0-9\s.#+]/g, ' ');
const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

<<<<<<< HEAD
<<<<<<< HEAD
const findKeywords = (resumeText, keywordList) => {
  const norm = normalise(resumeText);
  return keywordList.filter(kw => norm.includes(kw.toLowerCase()));
};

/**
 * Build a deduplicated keyword pool from all selected target roles.
 * Falls back to general + tech banks if no roles provided.
 */
=======
// FIX 1: escape special regex chars so keywords like 'c++' don't break the regex
=======
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word match — works for multi-word phrases too */
const matchesKeyword = (norm, kw) => {
  const escaped = escapeRegex(kw.toLowerCase());
  // For single words use \b; for phrases use space-boundary check
  const pattern = kw.includes(' ')
    ? `(^|\\s)${escaped}(\\s|$)`
    : `\\b${escaped}\\b`;
  return new RegExp(pattern, 'i').test(norm);
};

const findKeywords = (resumeText, keywordList) => {
  const norm = normalise(resumeText);
  return keywordList.filter(kw => matchesKeyword(norm, kw));
};

<<<<<<< HEAD
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
const getRoleKeywords = (targetRoles = []) => {
  if (!targetRoles.length) return [...GENERAL_KEYWORDS, ...TECH_KEYWORDS];
  const roleKws = targetRoles.flatMap(role => ROLE_KEYWORDS[role] || []);
  return [...new Set([...GENERAL_KEYWORDS, ...roleKws])];
};

<<<<<<< HEAD
const checkSections = (resumeText) => {
  const norm     = normalise(resumeText);
  const sections = ['experience','education','skills','summary','projects'];
  const found    = sections.filter(s => norm.includes(s));
  return { found, score: Math.round((found.length / sections.length) * 100) };
=======
// FIX 3: section variants — 'Technical Skills' counts as 'Skills',
//        'Work Experience' counts as 'Experience' etc.
=======
/**
 * Build the keyword pool for the selected roles.
 * If no roles selected → use general + tech pool.
 */
const getRoleKeywordPool = (targetRoles = []) => {
  if (!targetRoles.length) {
    return { pool: [...new Set([...GENERAL_KEYWORDS, ...TECH_KEYWORDS])], roleSpecific: [] };
  }
  const roleSpecific = [...new Set(targetRoles.flatMap(r => ROLE_KEYWORDS[r] || []))];
  const pool = [...new Set([...GENERAL_KEYWORDS, ...roleSpecific])];
  return { pool, roleSpecific };
};

>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
const checkSections = (resumeText) => {
  const norm = normalise(resumeText);
  const sectionVariants = {
    experience: ['experience', 'work experience', 'professional experience', 'internship', 'employment'],
    education:  ['education', 'academic background', 'qualifications', 'academic'],
    skills:     ['skills', 'technical skills', 'core competencies', 'technologies', 'tech stack'],
    summary:    ['summary', 'objective', 'profile', 'about me', 'career objective', 'professional summary'],
    projects:   ['projects', 'key projects', 'personal projects', 'academic projects'],
  };
  const found = Object.entries(sectionVariants)
    .filter(([, variants]) => variants.some(v => matchesKeyword(norm, v)))
    .map(([key]) => key);
  return { found, score: Math.round((found.length / Object.keys(sectionVariants).length) * 100) };
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
};

const checkFormatting = (resumeText) => {
  const wordCount = countWords(resumeText);
  let score = 55;
  if (wordCount >= 300 && wordCount <= 800) score += 25;
  else if (wordCount >= 200)               score += 12;
  if (/[•\-\*]/.test(resumeText))          score += 10;
  if (/@/.test(resumeText))                score += 5;
  if (/\+?\d[\d\s\-()]{8,}/.test(resumeText)) score += 5;
  return Math.min(score, 100);
};

const checkReadability = (resumeText) => {
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgLen = sentences.length
    ? sentences.reduce((a, s) => a + countWords(s), 0) / sentences.length : 0;
  let score = 65;
  if (avgLen >= 8 && avgLen <= 20) score += 25;
  else if (avgLen > 0)             score += 12;
  const starts = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
  const unique  = new Set(starts).size;
  if (sentences.length > 0 && unique >= sentences.length * 0.6) score += 10;
  return Math.min(score, 100);
};

const generateSuggestions = ({
  sectionScore, formattingScore, readabilityScore,
  keywordScore, missingKeywords, wordCount, targetRoles,
}) => {
  const tips       = [];
  const rolesLabel = targetRoles?.length ? targetRoles.join(' / ') : 'your target role';

  if (sectionScore < 80)
    tips.push('Add clearly labelled sections: Summary, Experience, Education, Skills, and Projects.');
  if (formattingScore < 70)
    tips.push('Use bullet points for responsibilities and achievements — ATS systems prefer structured lists.');
  if (readabilityScore < 70)
    tips.push('Keep sentences concise (8–20 words). Start each bullet with a strong action verb.');
  if (keywordScore < 60)
    tips.push(`Your resume is missing key terms for ${rolesLabel}. Review "Missing Keywords" and weave them in naturally.`);
  if (wordCount < 250)
    tips.push('Your resume is too short. Aim for 400–700 words to give ATS systems enough signal.');
  if (wordCount > 900)
    tips.push('Your resume may be too long. Trim to 1–2 pages (roughly 400–700 words).');
  if (missingKeywords.length > 5)
    tips.push(`Add these role-specific keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
  if (!tips.length)
    tips.push(`Strong resume for ${rolesLabel}! Add quantified achievements (e.g. "reduced load time by 40%") to stand out.`);
  return tips;
};

/* ══════════════════════════════════════════════════════════════
   POST /api/ats/score
══════════════════════════════════════════════════════════════ */
exports.scoreATS = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';

<<<<<<< HEAD
<<<<<<< HEAD
    // Support file upload fallback
=======
    // Case 1: file uploaded via FormData
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
=======
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
    if (!resumeText && req.file) {
      resumeText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
    // Case 2: frontend sent raw PDF bytes as resumeText string — re-parse it
=======
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
    if (resumeText && resumeText.trimStart().startsWith('%PDF')) {
      try {
        const pdfParse = require('pdf-parse');
        const buffer   = Buffer.from(resumeText, 'binary');
        const data     = await pdfParse(buffer);
        resumeText     = data.text || '';
      } catch (err) {
        console.error('❌ PDF re-parse failed:', err.message);
        resumeText = '';
      }
    }

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Resume text is too short or empty.' });
    }

<<<<<<< HEAD
    // targetRoles arrives as array (JSON body) or JSON string (FormData)
=======
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    let targetRoles = req.body.targetRoles || [];
    if (typeof targetRoles === 'string') {
      try { targetRoles = JSON.parse(targetRoles); } catch { targetRoles = []; }
    }

    console.log('🎯 scoreATS — targetRoles:', targetRoles, '| text length:', resumeText.length);

    const wordCount = countWords(resumeText);
    const { pool: roleKeywords, roleSpecific } = getRoleKeywordPool(targetRoles);

    // ── Keyword scoring ────────────────────────────────────────
    const allMatched = findKeywords(resumeText, roleKeywords);

    // Score against role-specific keywords only (more meaningful signal)
    const scoringPool   = roleSpecific.length ? roleSpecific : TECH_KEYWORDS;
    const scoringHits   = allMatched.filter(k => scoringPool.includes(k));
    const keywordScore  = Math.min(
      Math.round((scoringHits.length / Math.min(scoringPool.length, 25)) * 100),
      100
    );

    const matchedKeywords = allMatched.slice(0, 20);
    const missingKeywords = roleKeywords
      .filter(kw => !allMatched.includes(kw))
      // Prioritise role-specific missing keywords first
      .sort((a, b) => {
        const aRole = roleSpecific.includes(a) ? -1 : 1;
        const bRole = roleSpecific.includes(b) ? -1 : 1;
        return aRole - bRole;
      })
      .slice(0, 15);

<<<<<<< HEAD
    const { score: sectionScore } = checkSections(resumeText);
    const formattingScore         = checkFormatting(resumeText);
    const readabilityScore        = checkReadability(resumeText);

    // Bonus points for matching role-specific keywords
    const roleSpecificKws  = targetRoles.flatMap(r => ROLE_KEYWORDS[r] || []);
    const roleSpecificHits = roleSpecificKws.filter(kw => normalise(resumeText).includes(kw));
    const roleBoost        = roleSpecificKws.length
=======
    const { score: sectionScore, found: foundSections } = checkSections(resumeText);
    const formattingScore  = checkFormatting(resumeText);
    const readabilityScore = checkReadability(resumeText);

    console.log('📊 Sections:', foundSections, '| Keyword score:', keywordScore, '| Matched:', scoringHits.length, '/', scoringPool.length);

<<<<<<< HEAD
    // FIX 4: roleBoost also uses whole-word regex
    const roleSpecificKws  = targetRoles.flatMap(r => ROLE_KEYWORDS[r] || []);
    const norm             = normalise(resumeText);
    const roleSpecificHits = roleSpecificKws.filter(kw =>
      new RegExp(`\\b${escapeRegex(kw)}\\b`).test(norm)
    );
    const roleBoost = roleSpecificKws.length
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
      ? Math.round((roleSpecificHits.length / roleSpecificKws.length) * 15)
=======
    // Role boost: bonus % if role-specific hits are strong
    const roleBoost = roleSpecific.length
      ? Math.round((scoringHits.length / roleSpecific.length) * 10)
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
      : 0;

    const atsScore = Math.min(
      Math.round(
        keywordScore     * 0.35 +
        sectionScore     * 0.25 +
        formattingScore  * 0.20 +
        readabilityScore * 0.20 +
        roleBoost
      ),
      100
    );

    const breakdown = [
      { label: 'Keyword Match',    score: keywordScore,     color: '#7C3AED' },
      { label: 'Section Coverage', score: sectionScore,     color: '#6D28D9' },
      { label: 'Formatting',       score: formattingScore,  color: '#8B5CF6' },
      { label: 'Readability',      score: readabilityScore, color: '#A78BFA' },
    ];

    const suggestions = generateSuggestions({
      sectionScore, formattingScore, readabilityScore,
      keywordScore, missingKeywords, wordCount, targetRoles,
    });

    const rolesLabel = targetRoles.length ? targetRoles.join(' / ') : 'general roles';
    const summary = atsScore >= 75
      ? `Your resume is well-optimised for ${rolesLabel}. A few tweaks will make it outstanding.`
      : atsScore >= 50
      ? `Your resume passes basic ATS checks but could better target ${rolesLabel}. Focus on the missing keywords below.`
      : `Your resume needs improvements to pass ATS filters for ${rolesLabel}. Follow the suggestions below.`;

    // ── Persist ────────────────────────────────────────────────
    const userId = req.user?.id || req.user?._id;
<<<<<<< HEAD
    console.log('👤 atsController — userId:', userId);

=======
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    if (userId) {
      try {
        await ResumeAnalysis.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              fileName:       req.file?.originalname || 'pasted text',
              targetRoles,
              atsScore,
              atsBreakdown:   { keywordScore, formattingScore, readabilityScore, sectionScore },
              matchedKeywords,
              missingKeywords,
              atsSuggestions: suggestions,
              atsSummary:     summary,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
<<<<<<< HEAD
<<<<<<< HEAD
        console.log('✅ ResumeAnalysis (ATS) saved, id:', saved._id);
      } catch (saveErr) {
        console.error('❌ ResumeAnalysis DB save error:', saveErr.message);
      }
    } else {
      console.warn('⚠️  No userId — skipping DB save. req.user:', req.user);
    }

    return res.json({
      score:            atsScore,
      summary,
      breakdown,
      matchedKeywords,
      missingKeywords,
      suggestions,
      keywordScore,
      formattingScore,
      readabilityScore,
      sectionScore,
=======
        console.log('✅ ResumeAnalysis saved, id:', saved._id);
=======
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
      } catch (saveErr) {
        console.error('❌ DB save error:', saveErr.message);
      }
    }

    return res.json({
      score: atsScore, summary, breakdown,
      matchedKeywords, missingKeywords, suggestions,
      keywordScore, formattingScore, readabilityScore, sectionScore,
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
      targetRoles,
    });
  } catch (err) {
    console.error('scoreATS error:', err);
    res.status(500).json({ message: err.message || 'ATS scoring failed.' });
  }
};

exports.getCustomRoles = async (req, res) => {
  try {
    const roles = await CustomRole.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
<<<<<<< HEAD
 
exports.saveCustomRole = async (req, res) => {
  try {
    const { label, jd } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ success: false, error: 'Role label is required.' });
    }
    const existing = await CustomRole.findOne({ user: req.user._id, label: label.trim() });
    if (existing) {
      return res.json({ success: true, role: existing, duplicate: true });
    }
=======

exports.saveCustomRole = async (req, res) => {
  try {
    const { label, jd } = req.body;
    if (!label?.trim())
      return res.status(400).json({ success: false, error: 'Role label is required.' });
    const existing = await CustomRole.findOne({ user: req.user._id, label: label.trim() });
<<<<<<< HEAD
    if (existing)
      return res.json({ success: true, role: existing, duplicate: true });
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
=======
    if (existing) return res.json({ success: true, role: existing, duplicate: true });
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
    const role = await CustomRole.create({ user: req.user._id, label: label.trim(), jd: jd || '' });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
<<<<<<< HEAD
 
=======

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
exports.deleteCustomRole = async (req, res) => {
  try {
    const role = await CustomRole.findOne({ _id: req.params.id, user: req.user._id });
    if (!role) return res.status(404).json({ success: false, error: 'Not found.' });
    await role.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};