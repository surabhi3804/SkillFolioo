// backend/controllers/skillController.js
const ResumeAnalysis = require('../models/ResumeAnalysis');

/* ══════════════════════════════════════════════════════════════
   SKILL TAXONOMY
══════════════════════════════════════════════════════════════ */
const SKILL_TAXONOMY = {
  'Frontend': [
    'html','css','javascript','typescript','react','angular','vue','svelte',
    'next.js','nuxt','tailwind','sass','scss','bootstrap','webpack','vite',
    'redux','graphql','jest','cypress','figma',
  ],
  'Backend': [
    'node.js','express','django','flask','fastapi','spring','laravel','rails',
    'python','java','c#','go','rust','php','ruby','kotlin','scala',
    'rest api','grpc','websocket','oauth','jwt',
  ],
  'Database': [
    'mysql','postgresql','mongodb','redis','sqlite','firebase','supabase',
    'dynamodb','cassandra','elasticsearch','sql','nosql','orm','prisma','mongoose',
  ],
  'DevOps & Cloud': [
    'docker','kubernetes','aws','azure','gcp','ci/cd','github actions','jenkins',
    'terraform','ansible','nginx','linux','bash','shell scripting','helm',
  ],
  'Data & AI': [
    'machine learning','deep learning','tensorflow','pytorch','scikit-learn',
    'pandas','numpy','matplotlib','data analysis','nlp','computer vision',
    'power bi','tableau','excel','r','statistics','hadoop','spark',
  ],
  'Mobile': [
    'react native','flutter','swift','kotlin','android','ios','xamarin','ionic',
  ],
  'Soft Skills': [
    'communication','leadership','teamwork','problem solving','critical thinking',
    'project management','agile','scrum','time management','mentoring',
  ],
};

/* ── Skills recommended per target role ───────────────────── */
const ROLE_SUGGESTED_SKILLS = {
  'Software Engineer':         ['system design','algorithms','design patterns','testing','ci/cd','docker'],
  'Frontend Developer':        ['typescript','next.js','tailwind','accessibility','testing','storybook'],
  'Backend Developer':         ['docker','redis','message queues','api design','database optimisation','microservices'],
  'Full Stack Developer':      ['typescript','docker','ci/cd','testing','api design','state management'],
  'Data Scientist':            ['pytorch','mlflow','statistics','feature engineering','sql','data visualisation'],
  'AI/ML Engineer':            ['mlops','transformers','model deployment','python','pytorch','hugging face'],
  'Data Engineer':             ['airflow','dbt','kafka','spark','data modelling','bigquery','snowflake'],
  'DevOps Engineer':           ['terraform','prometheus','grafana','helm','argocd','chaos engineering'],
  'Cloud Engineer':            ['terraform','serverless','cloud security','cost optimisation','multi-cloud','kubernetes'],
  'Mobile Developer':          ['typescript','firebase','offline support','app performance','push notifications','testing'],
  'Product Manager':           ['okrs','data analysis','user research','roadmapping','ab testing','sql'],
  'UI/UX Designer':            ['user research','prototyping','design systems','accessibility','motion design','figma'],
  'Cybersecurity Engineer':    ['threat modelling','zero trust','siem','scripting','cloud security','devsecops'],
  'QA / Test Engineer':        ['playwright','k6','contract testing','test strategy','shift-left testing','performance testing'],
  'Embedded Systems Engineer': ['rtos','cmake','unit testing','power management','communication protocols','debugging tools'],
  'Blockchain Developer':      ['layer 2','zk proofs','defi protocols','security auditing','ipfs','dao governance'],
};

const TRENDING_SKILLS = [
  'typescript','next.js','tailwind','fastapi','kubernetes','terraform',
  'aws','github actions','prisma','redis','graphql','rust','go',
  'machine learning','pytorch','react native','flutter',
];

const SUGGESTIONS_MAP = {
  'react':            ['typescript','redux','next.js','jest','tailwind'],
  'node.js':          ['express','mongodb','redis','docker','typescript'],
  'python':           ['fastapi','django','pandas','numpy','docker'],
  'java':             ['spring','kubernetes','aws','maven','microservices'],
  'aws':              ['terraform','docker','kubernetes','github actions','linux'],
  'docker':           ['kubernetes','ci/cd','aws','linux','github actions'],
  'mongodb':          ['mongoose','redis','node.js','express'],
  'postgresql':       ['prisma','sql','redis','node.js','docker'],
  'machine learning': ['python','pytorch','tensorflow','pandas','numpy'],
  'react native':     ['typescript','redux','expo','firebase'],
  'flutter':          ['dart','firebase','rest api'],
};

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const normalise = (text) => text.toLowerCase().replace(/[^a-z0-9.\s]/g, ' ');

const detectSkills = (resumeText) => {
  const norm     = normalise(resumeText);
  const found    = [];
  const byDomain = {};

  for (const [domain, skills] of Object.entries(SKILL_TAXONOMY)) {
    const matched = skills.filter(sk => {
      const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|\\s|[,/])${escaped}(\\s|[,/.]|$)`, 'i').test(norm);
    });
    if (matched.length) {
      byDomain[domain] = matched;
      found.push(...matched);
    }
  }
  return { detected: [...new Set(found)], byDomain };
};

/**
 * Build a suggested skills list from:
 *   1. Role-specific recommendations for each selected target role
 *   2. Complement map for detected skills
 * Excludes skills already detected in the resume.
 */
const getSuggestions = (detectedSkills, targetRoles = []) => {
  const detected = detectedSkills.map(s => s.toLowerCase());
  const suggested = new Set();

  // Role-specific suggestions first
  for (const role of targetRoles) {
    const roleSuggested = ROLE_SUGGESTED_SKILLS[role] || [];
    roleSuggested.forEach(s => {
      if (!detected.includes(s.toLowerCase())) suggested.add(s);
    });
  }

  // Complement-map suggestions
  for (const sk of detectedSkills) {
    const complements = SUGGESTIONS_MAP[sk.toLowerCase()] || [];
    complements.forEach(c => {
      if (!detected.includes(c.toLowerCase())) suggested.add(c);
    });
  }

  return [...suggested].slice(0, 12);
};

const getGrowthAreas = (detectedSkills, targetRoles = []) => {
  const detected = detectedSkills.map(s => s.toLowerCase());

  // Priority: skills missing from the chosen roles
  const roleGrowth = targetRoles
    .flatMap(role => ROLE_SUGGESTED_SKILLS[role] || [])
    .filter(s => !detected.includes(s.toLowerCase()));

  // Fill up with trending skills
  const trending = TRENDING_SKILLS.filter(ts => !detected.includes(ts.toLowerCase()));

  return [...new Set([...roleGrowth, ...trending])].slice(0, 10);
};

const generateInsights = ({ detected, byDomain, suggested, growthAreas, targetRoles }) => {
  const insights    = [];
  const domainCount = Object.keys(byDomain).length;
  const rolesLabel  = targetRoles?.length ? targetRoles.join(' / ') : null;

  if (rolesLabel)
    insights.push(`Analysed against target role(s): ${rolesLabel}.`);

  if (domainCount >= 3)
    insights.push(`You have a diverse skill set spanning ${domainCount} domains — great for full-stack or cross-functional roles.`);
  else if (domainCount === 1)
    insights.push(`Your skills are focused in ${Object.keys(byDomain)[0]}. Consider broadening into adjacent areas.`);

  if (byDomain['Frontend'] && byDomain['Backend'])
    insights.push('You have both frontend and backend skills — highlight this to stand out for full-stack roles.');
  if (byDomain['DevOps & Cloud'])
    insights.push('Cloud/DevOps skills are highly valued. Mention specific services (e.g. AWS EC2, S3) for better ATS matching.');
  if (byDomain['Data & AI'])
    insights.push('AI/ML skills are among the fastest-growing in demand. Highlight projects with measurable outcomes.');
  if (growthAreas.length)
    insights.push(`Trending skills to consider adding: ${growthAreas.slice(0, 4).join(', ')}.`);
  if (detected.length < 6)
    insights.push('Your resume lists fewer skills than typical candidates. Expand the skills section with tools and technologies you use daily.');
  if (!insights.length)
    insights.push('Strong skill profile! Quantify experience with each skill (e.g. "3 years of React") to score higher.');

  return insights;
};

/* ══════════════════════════════════════════════════════════════
   POST /api/skills/analyze
   Body: { resumeText, targetRoles: string[] }
══════════════════════════════════════════════════════════════ */
exports.analyzeSkills = async (req, res) => {
  try {
    const resumeText = req.body.resumeText || '';

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Resume text is too short or empty.' });
    }

    let targetRoles = req.body.targetRoles || [];
    if (typeof targetRoles === 'string') {
      try { targetRoles = JSON.parse(targetRoles); } catch { targetRoles = []; }
    }

    const { detected, byDomain } = detectSkills(resumeText);
    const suggested              = getSuggestions(detected, targetRoles);
    const growthAreas            = getGrowthAreas(detected, targetRoles);
    const insights               = generateInsights({ detected, byDomain, suggested, growthAreas, targetRoles });
    const strongSkills           = detected.filter(s => TRENDING_SKILLS.includes(s.toLowerCase()));

    // ── Persist to DB ─────────────────────────────────────────
    const userId = req.user?.id || req.user?._id;
    console.log('👤 skillController — userId:', userId);

    if (userId) {
      try {
        const saved = await ResumeAnalysis.findOneAndUpdate(
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
        console.log('✅ Skills saved to DB, id:', saved._id);
      } catch (saveErr) {
        console.error('❌ Skills DB save error:', saveErr.message);
      }
    } else {
      console.warn('⚠️  No userId — skipping DB save. req.user:', req.user);
    }

    return res.json({
      // Primary response shape (matches frontend field names)
      detectedSkills:  detected,
      strongSkills,
      suggestedSkills: suggested,
      growthAreas,
      insights,
      byDomain,
      targetRoles,
      // Legacy aliases kept for backwards compat
      skills:   detected,
      matched:  strongSkills,
      suggested,
      missing:  growthAreas,
      tips:     insights,
    });
  } catch (err) {
    console.error('analyzeSkills error:', err);
    res.status(500).json({ message: err.message || 'Skill analysis failed.' });
  }
};

/* ══════════════════════════════════════════════════════════════
   GET /api/skills/roles  — return default target roles list
══════════════════════════════════════════════════════════════ */
exports.getTargetRoles = (_req, res) => {
  const roles = Object.keys(ROLE_SUGGESTED_SKILLS);
  return res.json({ success: true, data: roles });
};