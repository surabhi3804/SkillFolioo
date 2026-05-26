// backend/controllers/skillController.js
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { extractText } = require('../utils/resumeParse');

/* ══════════════════════════════════════════════════════════════
   SKILL TAXONOMY  (used for detection)
══════════════════════════════════════════════════════════════ */
const SKILL_TAXONOMY = {
  'Frontend': [
    'html', 'css', 'javascript', 'typescript', 'react', 'angular', 'vue', 'svelte',
    'next.js', 'nuxt', 'tailwind', 'sass', 'scss', 'bootstrap', 'webpack', 'vite',
    'redux', 'graphql', 'jest', 'cypress', 'figma', 'storybook', 'accessibility',
  ],
  'Backend': [
    'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails',
    'python', 'java', 'c#', 'rust', 'php', 'ruby', 'kotlin', 'scala',
    'rest api', 'grpc', 'websocket', 'oauth', 'jwt', 'microservices', 'caching',
  ],
  'Database': [
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'firebase', 'supabase',
    'dynamodb', 'cassandra', 'elasticsearch', 'sql', 'nosql', 'orm', 'prisma', 'mongoose',
    'snowflake', 'bigquery', 'redshift',
  ],
  'DevOps & Cloud': [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'github actions', 'jenkins',
    'terraform', 'ansible', 'nginx', 'linux', 'bash', 'shell scripting', 'helm',
    'prometheus', 'grafana', 'argocd', 'serverless',
  ],
  'Data & AI': [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'data analysis', 'nlp', 'computer vision',
    'power bi', 'tableau', 'statistics', 'hadoop', 'spark', 'mlops', 'transformers',
    'hugging face', 'llm', 'feature engineering',
  ],
  'Mobile': [
    'react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'xamarin', 'ionic',
    'expo', 'dart',
  ],
  'Soft Skills': [
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'agile', 'scrum', 'time management', 'mentoring',
  ],
};

/* ══════════════════════════════════════════════════════════════
   ROLE → REQUIRED SKILLS  (what the role *needs*)
   Used to compute gap: missing = required - detected
══════════════════════════════════════════════════════════════ */
const ROLE_REQUIRED_SKILLS = {
  'Software Engineer': [
    'algorithms', 'data structures', 'system design', 'design patterns',
    'unit testing', 'ci/cd', 'git', 'docker', 'api', 'agile',
  ],
  'Frontend Developer': [
    'react', 'typescript', 'html', 'css', 'javascript', 'next.js',
    'tailwind', 'accessibility', 'jest', 'webpack',
  ],
  'Backend Developer': [
    'node.js', 'python', 'postgresql', 'redis', 'docker', 'rest api',
    'authentication', 'microservices', 'ci/cd', 'orm',
  ],
  'Full Stack Developer': [
    'react', 'node.js', 'typescript', 'postgresql', 'mongodb',
    'docker', 'ci/cd', 'rest api', 'html', 'css',
  ],
  'Data Scientist': [
    'python', 'pandas', 'numpy', 'scikit-learn', 'statistics',
    'machine learning', 'sql', 'data analysis', 'matplotlib', 'jupyter',
  ],
  'AI/ML Engineer': [
    'python', 'pytorch', 'tensorflow', 'machine learning', 'deep learning',
    'nlp', 'mlops', 'transformers', 'model deployment', 'feature engineering',
  ],
  'Data Engineer': [
    'python', 'sql', 'spark', 'airflow', 'kafka', 'etl', 'aws',
    'data modelling', 'bigquery', 'dbt',
  ],
  'DevOps Engineer': [
    'docker', 'kubernetes', 'terraform', 'ci/cd', 'aws', 'linux',
    'bash', 'github actions', 'prometheus', 'grafana',
  ],
  'Cloud Engineer': [
    'aws', 'terraform', 'kubernetes', 'serverless', 'iam',
    'networking', 'cloud architecture', 'azure', 'gcp', 'cost optimisation',
  ],
  'Mobile Developer': [
    'react native', 'flutter', 'typescript', 'firebase', 'rest api',
    'ios', 'android', 'expo', 'push notifications', 'offline support',
  ],
  'Product Manager': [
    'product roadmap', 'agile', 'user research', 'data analysis', 'sql',
    'okrs', 'ab testing', 'stakeholders', 'jira', 'go-to-market',
  ],
  'UI/UX Designer': [
    'figma', 'user research', 'wireframing', 'prototyping', 'usability testing',
    'accessibility', 'design systems', 'interaction design', 'personas', 'journey mapping',
  ],
  'Cybersecurity Engineer': [
    'penetration testing', 'vulnerability assessment', 'siem', 'owasp',
    'incident response', 'cryptography', 'cloud security', 'devsecops',
    'zero trust', 'compliance',
  ],
  'QA / Test Engineer': [
    'cypress', 'playwright', 'selenium', 'jest', 'api testing',
    'test strategy', 'ci/cd', 'regression', 'performance testing', 'automation',
  ],
  'Embedded Systems Engineer': [
    'c', 'c++', 'rtos', 'firmware', 'microcontrollers', 'uart', 'spi',
    'cmake', 'debugging', 'embedded linux',
  ],
  'Blockchain Developer': [
    'solidity', 'ethereum', 'smart contracts', 'web3', 'defi',
    'hardhat', 'cryptography', 'security auditing', 'layer 2', 'ipfs',
  ],
};

/* ══════════════════════════════════════════════════════════════
   ROLE → NICE-TO-HAVE / SUGGESTED SKILLS
   (not required but boosts profile significantly)
══════════════════════════════════════════════════════════════ */
const ROLE_SUGGESTED_SKILLS = {
  'Software Engineer':         ['rust', 'system design', 'kafka', 'observability', 'grpc'],
  'Frontend Developer':        ['storybook', 'vitest', 'web components', 'web animations', 'pwa'],
  'Backend Developer':         ['grpc', 'elasticsearch', 'message queues', 'load balancing', 'rate limiting'],
  'Full Stack Developer':      ['graphql', 'prisma', 'redis', 'testing', 'state management'],
  'Data Scientist':            ['pytorch', 'mlflow', 'feature engineering', 'bayesian', 'data visualisation'],
  'AI/ML Engineer':            ['cuda', 'rag', 'langchain', 'vector databases', 'quantisation'],
  'Data Engineer':             ['flink', 'delta lake', 'data quality', 'data contracts', 'trino'],
  'DevOps Engineer':           ['chaos engineering', 'service mesh', 'ebpf', 'slos', 'platform engineering'],
  'Cloud Engineer':            ['multi-cloud', 'finops', 'cloud security', 'service mesh', 'edge computing'],
  'Mobile Developer':          ['accessibility', 'deep linking', 'in-app purchases', 'ab testing', 'analytics'],
  'Product Manager':           ['sql', 'product analytics', 'growth', 'experiment design', 'pricing strategy'],
  'UI/UX Designer':            ['motion design', 'design tokens', 'component libraries', 'a11y', 'research ops'],
  'Cybersecurity Engineer':    ['red teaming', 'threat intelligence', 'forensics', 'soar', 'security automation'],
  'QA / Test Engineer':        ['contract testing', 'chaos testing', 'observability', 'shift-left', 'test coverage'],
  'Embedded Systems Engineer': ['power management', 'bootloader', 'oscilloscope', 'can bus', 'ota updates'],
  'Blockchain Developer':      ['zk proofs', 'dao governance', 'cross-chain', 'defi protocols', 'mev'],
};

const TRENDING_SKILLS = [
  'typescript', 'next.js', 'tailwind', 'fastapi', 'kubernetes', 'terraform',
  'aws', 'github actions', 'prisma', 'redis', 'graphql', 'rust',
  'machine learning', 'pytorch', 'react native', 'flutter', 'llm',
  'transformers', 'mlops', 'dbt',
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalise   = (text) => text.toLowerCase().replace(/[^a-z0-9\s.#+]/g, ' ');

const matchesSkill = (norm, sk) => {
  const escaped = escapeRegex(sk.toLowerCase());
  const pattern = sk.includes(' ')
    ? `(^|\\s)${escaped}(\\s|$)`
    : `\\b${escaped}\\b`;
  return new RegExp(pattern, 'i').test(norm);
};

const detectSkills = (resumeText) => {
  const norm     = normalise(resumeText);
  const found    = [];
  const byDomain = {};

  for (const [domain, skills] of Object.entries(SKILL_TAXONOMY)) {
    const matched = skills.filter(sk => matchesSkill(norm, sk));
    if (matched.length) {
      byDomain[domain] = matched;
      found.push(...matched);
    }
  }
  return { detected: [...new Set(found)], byDomain };
};

/**
 * Compute skill gaps per selected role.
 * growthAreas = union of required skills the resume is missing.
 */
const getGrowthAreas = (detectedSkills, targetRoles = []) => {
  const detected = detectedSkills.map(s => s.toLowerCase());

  const roleGaps = targetRoles.flatMap(role =>
    (ROLE_REQUIRED_SKILLS[role] || []).filter(s => !detected.includes(s.toLowerCase()))
  );

  // Also append trending skills not yet on resume
  const trending = TRENDING_SKILLS.filter(ts => !detected.includes(ts.toLowerCase()));

  return [...new Set([...roleGaps, ...trending])].slice(0, 12);
};

/**
 * Suggested = nice-to-have for role that the resume doesn't have yet.
 */
const getSuggestions = (detectedSkills, targetRoles = []) => {
  const detected  = detectedSkills.map(s => s.toLowerCase());
  const suggested = new Set();

  for (const role of targetRoles) {
    (ROLE_SUGGESTED_SKILLS[role] || []).forEach(s => {
      if (!detected.includes(s.toLowerCase())) suggested.add(s);
    });
  }
  return [...suggested].slice(0, 10);
};

const generateInsights = ({ detected, byDomain, suggested, growthAreas, targetRoles }) => {
  const insights    = [];
  const domainCount = Object.keys(byDomain).length;
  const rolesLabel  = targetRoles?.length ? targetRoles.join(' / ') : null;

  if (rolesLabel)
    insights.push(`Analysed against target role(s): ${rolesLabel}.`);

  if (domainCount >= 3)
    insights.push(`You have skills across ${domainCount} domains — great for cross-functional roles.`);
  else if (domainCount === 1)
    insights.push(`Skills concentrated in ${Object.keys(byDomain)[0]}. Broadening into adjacent areas can help.`);

  if (byDomain['Frontend'] && byDomain['Backend'])
    insights.push('You have both frontend and backend skills — highlight this for full-stack roles.');

  if (byDomain['DevOps & Cloud'])
    insights.push('Cloud/DevOps skills stand out. Mention specific services (e.g. AWS EC2, S3, Lambda) for better ATS matching.');

  if (byDomain['Data & AI'])
    insights.push('AI/ML skills are in high demand. Highlight projects with measurable outcomes (accuracy, latency, etc.).');

  if (growthAreas.length)
    insights.push(`Key gaps to close for ${rolesLabel || 'your target role'}: ${growthAreas.slice(0, 4).join(', ')}.`);

  if (detected.length < 6)
    insights.push('Your resume lists fewer skills than typical. Expand the skills section with daily-use tools and technologies.');

  if (!insights.length)
    insights.push('Strong skill profile! Quantify experience per skill (e.g. "3 years of React, built 5 production apps") to score higher.');

  return insights;
};

/* ══════════════════════════════════════════════════════════════
   POST /api/skills/analyze
══════════════════════════════════════════════════════════════ */
exports.analyzeSkills = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';

    if (!resumeText && req.file) {
      resumeText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    console.log('📄 skillController — text length:', resumeText?.length);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Resume text is too short or empty.' });
    }

    let targetRoles = req.body.targetRoles || [];
    if (typeof targetRoles === 'string') {
      try { targetRoles = JSON.parse(targetRoles); } catch { targetRoles = []; }
    }

    console.log('🎯 skillController — targetRoles:', targetRoles);

    const { detected, byDomain } = detectSkills(resumeText);
    const suggested              = getSuggestions(detected, targetRoles);
    const growthAreas            = getGrowthAreas(detected, targetRoles);
    const insights               = generateInsights({ detected, byDomain, suggested, growthAreas, targetRoles });
    const strongSkills           = detected.filter(s => TRENDING_SKILLS.includes(s.toLowerCase()));

<<<<<<< HEAD
<<<<<<< HEAD
    // ── Persist to DB ─────────────────────────────────────────
    const userId = req.user?.id || req.user?._id;
    console.log('👤 skillController — userId:', userId);

=======
    console.log('✅ skillController — detected:', detected);
=======
    console.log('✅ skillController — detected:', detected.length, 'skills | gaps:', growthAreas.length);
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c

    // ── Persist ────────────────────────────────────────────────
    const userId = req.user?.id || req.user?._id;
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    if (userId) {
      try {
        await ResumeAnalysis.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              targetRoles,
              detectedSkills:  detected,
              suggestedSkills: suggested,
              growthAreas,
              skillInsights:   insights,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (saveErr) {
        console.error('❌ Skills DB save error:', saveErr.message);
      }
<<<<<<< HEAD
    } else {
      console.warn('⚠️  No userId — skipping DB save. req.user:', req.user);
    }

    return res.json({
      // Primary response shape (matches frontend field names)
=======
    }

    return res.json({
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
      detectedSkills:  detected,
      strongSkills,
      suggestedSkills: suggested,
      growthAreas,
      insights,
      byDomain,
      targetRoles,
<<<<<<< HEAD
<<<<<<< HEAD
      // Legacy aliases kept for backwards compat
      skills:   detected,
      matched:  strongSkills,
      suggested,
      missing:  growthAreas,
      tips:     insights,
=======
      // Legacy aliases
=======
      // Legacy aliases kept for UI compatibility
>>>>>>> 4555d1d27bb82dce0b180a0e7191f255a057099c
      skills:    detected,
      matched:   strongSkills,
      suggested,
      missing:   growthAreas,
      tips:      insights,
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    });
  } catch (err) {
    console.error('analyzeSkills error:', err);
    res.status(500).json({ message: err.message || 'Skill analysis failed.' });
  }
};

/* ══════════════════════════════════════════════════════════════
<<<<<<< HEAD
   GET /api/skills/roles  — return default target roles list
=======
   GET /api/skills/roles
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
══════════════════════════════════════════════════════════════ */
exports.getTargetRoles = (_req, res) => {
  const roles = Object.keys(ROLE_REQUIRED_SKILLS);
  return res.json({ success: true, data: roles });
};