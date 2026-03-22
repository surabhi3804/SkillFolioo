// backend/controllers/atsController.js
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { extractText } = require('../utils/resumeParse');
const CustomRole = require('../models/CustomRole');

/* ══════════════════════════════════════════════════════════════
   KEYWORD BANKS
══════════════════════════════════════════════════════════════ */
const GENERAL_KEYWORDS = [
  'developed','designed','implemented','managed','led','built','created',
  'optimised','improved','delivered','collaborated','architected','deployed',
  'automated','analysed','maintained','mentored','launched','scaled','resolved',
  'experience','education','skills','projects','certifications','summary',
  'objective','achievements','responsibilities','accomplishments',
  'communication','leadership','teamwork','problem-solving','analytical',
  'detail-oriented','proactive','adaptable',
];

const TECH_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','go','rust','ruby',
  'react','angular','vue','node','express','django','flask','spring','laravel',
  'html','css','sql','nosql','mongodb','postgresql','mysql','redis',
  'aws','azure','gcp','docker','kubernetes','ci/cd','git','linux',
  'rest','api','graphql','microservices','agile','scrum',
];

/* ── Role-specific keyword map ─────────────────────────────── */
const ROLE_KEYWORDS = {
  'Software Engineer':          ['algorithms','data structures','system design','object-oriented','testing','debugging','code review','git','agile'],
  'Frontend Developer':         ['react','vue','angular','html','css','javascript','typescript','responsive design','webpack','accessibility','ui','ux'],
  'Backend Developer':          ['api','node.js','python','java','databases','sql','nosql','microservices','authentication','rest','server'],
  'Full Stack Developer':       ['react','node.js','api','database','frontend','backend','javascript','typescript','mongodb','postgresql'],
  'Data Scientist':             ['python','machine learning','statistics','pandas','numpy','scikit-learn','data analysis','visualisation','jupyter','sql'],
  'AI/ML Engineer':             ['machine learning','deep learning','tensorflow','pytorch','neural networks','nlp','python','model training','mlops','transformers'],
  'Data Engineer':              ['etl','pipelines','spark','hadoop','airflow','sql','python','data warehousing','kafka','aws','azure','bigquery'],
  'DevOps Engineer':            ['docker','kubernetes','ci/cd','terraform','ansible','aws','linux','bash','monitoring','git','jenkins','github actions'],
  'Cloud Engineer':             ['aws','azure','gcp','terraform','kubernetes','iam','cloud architecture','networking','serverless','cost optimisation'],
  'Mobile Developer':           ['react native','flutter','swift','kotlin','ios','android','mobile ui','app store','firebase','offline support'],
  'Product Manager':            ['product roadmap','user stories','stakeholders','agile','kpis','market research','product strategy','backlog','prioritisation'],
  'UI/UX Designer':             ['figma','user research','wireframing','prototyping','usability testing','accessibility','design systems','interaction design'],
  'Cybersecurity Engineer':     ['penetration testing','siem','firewalls','vulnerability assessment','soc','incident response','cryptography','owasp','compliance'],
  'QA / Test Engineer':         ['manual testing','automation','selenium','cypress','jest','test plans','bug reporting','regression','api testing','ci/cd'],
  'Embedded Systems Engineer':  ['c','c++','rtos','microcontrollers','firmware','hardware','uart','spi','i2c','low-level programming','debugging'],
  'Blockchain Developer':       ['solidity','ethereum','smart contracts','web3','defi','nft','cryptography','consensus','hyperledger','truffle'],
};

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const normalise  = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const findKeywords = (resumeText, keywordList) => {
  const norm = normalise(resumeText);
  return keywordList.filter(kw => norm.includes(kw.toLowerCase()));
};

/**
 * Build a deduplicated keyword pool from all selected target roles.
 * Falls back to general + tech banks if no roles provided.
 */
const getRoleKeywords = (targetRoles = []) => {
  if (!targetRoles.length) return [...GENERAL_KEYWORDS, ...TECH_KEYWORDS];
  const roleKws = targetRoles.flatMap(role => ROLE_KEYWORDS[role] || []);
  return [...new Set([...GENERAL_KEYWORDS, ...roleKws])];
};

const checkSections = (resumeText) => {
  const norm     = normalise(resumeText);
  const sections = ['experience','education','skills','summary','projects'];
  const found    = sections.filter(s => norm.includes(s));
  return { found, score: Math.round((found.length / sections.length) * 100) };
};

const checkFormatting = (resumeText) => {
  const wordCount = countWords(resumeText);
  let score = 60;
  if (wordCount >= 300 && wordCount <= 800) score += 20;
  else if (wordCount >= 200)               score += 10;
  if (/[•\-\*]/.test(resumeText))          score += 10;
  if (/@/.test(resumeText))                score += 5;
  if (/\+?\d[\d\s\-()]{8,}/.test(resumeText)) score += 5;
  return Math.min(score, 100);
};

const checkReadability = (resumeText) => {
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgLen    = sentences.length
    ? sentences.reduce((a, s) => a + countWords(s), 0) / sentences.length
    : 0;
  let score = 70;
  if (avgLen >= 8 && avgLen <= 20) score += 20;
  else if (avgLen > 0)             score += 10;
  const starts = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
  const unique  = new Set(starts).size;
  if (unique >= sentences.length * 0.6) score += 10;
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
  if (keywordScore < 50)
    tips.push(`Your resume is missing key terms for ${rolesLabel}. Review "Missing Keywords" and weave them in naturally.`);
  if (wordCount < 250)
    tips.push('Your resume is too short. Aim for 400–700 words to give ATS systems enough signal.');
  if (wordCount > 900)
    tips.push('Your resume may be too long. Trim to 1–2 pages (roughly 400–700 words).');
  if (missingKeywords.length > 5)
    tips.push(`Include these role-specific keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
  if (!tips.length)
    tips.push(`Strong resume for ${rolesLabel}! Add quantified achievements to make it outstanding.`);
  return tips;
};

/* ══════════════════════════════════════════════════════════════
   POST /api/ats/score
   Body (JSON):      { resumeText, targetRoles: string[] }
   Body (FormData):  resume (file) + targetRoles (JSON string)
══════════════════════════════════════════════════════════════ */
exports.scoreATS = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';

    // Support file upload fallback
    if (!resumeText && req.file) {
      resumeText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Resume text is too short or empty.' });
    }

    // targetRoles arrives as array (JSON body) or JSON string (FormData)
    let targetRoles = req.body.targetRoles || [];
    if (typeof targetRoles === 'string') {
      try { targetRoles = JSON.parse(targetRoles); } catch { targetRoles = []; }
    }

    const wordCount    = countWords(resumeText);
    const roleKeywords = getRoleKeywords(targetRoles);
    const allMatched   = findKeywords(resumeText, roleKeywords);

    const keywordScore = Math.min(
      Math.round((allMatched.length / Math.min(roleKeywords.length, 30)) * 100),
      100
    );

    const matchedKeywords = allMatched.slice(0, 20);
    const missingKeywords = roleKeywords
      .filter(kw => !allMatched.includes(kw))
      .slice(0, 15);

    const { score: sectionScore } = checkSections(resumeText);
    const formattingScore         = checkFormatting(resumeText);
    const readabilityScore        = checkReadability(resumeText);

    // Bonus points for matching role-specific keywords
    const roleSpecificKws  = targetRoles.flatMap(r => ROLE_KEYWORDS[r] || []);
    const roleSpecificHits = roleSpecificKws.filter(kw => normalise(resumeText).includes(kw));
    const roleBoost        = roleSpecificKws.length
      ? Math.round((roleSpecificHits.length / roleSpecificKws.length) * 15)
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

    const rolesLabel = targetRoles.length ? targetRoles.join(' / ') : 'your target role';
    const summary    = atsScore >= 75
      ? `Your resume is well-optimised for ${rolesLabel}. A few tweaks will make it outstanding.`
      : atsScore >= 50
      ? `Your resume passes basic ATS checks but could better target ${rolesLabel}.`
      : `Your resume needs improvements to pass ATS filters for ${rolesLabel}. Follow the suggestions below.`;

    // ── Persist to DB ─────────────────────────────────────────
    const userId = req.user?.id || req.user?._id;
    console.log('👤 atsController — userId:', userId);

    if (userId) {
      try {
        const saved = await ResumeAnalysis.findOneAndUpdate(
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
    const role = await CustomRole.create({ user: req.user._id, label: label.trim(), jd: jd || '' });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
 
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