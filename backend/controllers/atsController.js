const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ats/score - analyze resume/portfolio against a job description
const getATSScore = async (req, res) => {
  try {
    const { resumeText, jobDescription, portfolioData } = req.body;

    if (!resumeText && !portfolioData)
      return res.status(400).json({ success: false, message: 'Resume text or portfolio data is required' });

    const content = resumeText || formatPortfolioAsText(portfolioData);

    const prompt = `You are an ATS (Applicant Tracking System) analyzer. Analyze the following resume/portfolio against the job description.

JOB DESCRIPTION:
${jobDescription || 'General software developer position'}

RESUME/PORTFOLIO:
${content}

Provide a detailed ATS analysis in the following JSON format only:
{
  "overallScore": <0-100>,
  "sections": {
    "keywords": { "score": <0-100>, "matched": ["keyword1", ...], "missing": ["keyword1", ...] },
    "experience": { "score": <0-100>, "feedback": "..." },
    "skills": { "score": <0-100>, "feedback": "..." },
    "education": { "score": <0-100>, "feedback": "..." },
    "formatting": { "score": <0-100>, "feedback": "..." }
  },
  "improvements": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "strengths": ["strength1", "strength2", "strength3"]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const analysis = match ? JSON.parse(match[0]) : { error: 'Could not parse analysis' };

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ats/keywords - extract keywords from job description
const extractKeywords = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ success: false, message: 'Job description is required' });

    const prompt = `Extract the most important ATS keywords from this job description. Categorize them.
Job Description: "${jobDescription}"

Return JSON only:
{
  "technical": ["skill1", ...],
  "soft": ["skill1", ...],
  "tools": ["tool1", ...],
  "certifications": ["cert1", ...]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const keywords = match ? JSON.parse(match[0]) : {};

    res.json({ success: true, keywords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to format portfolio as text
function formatPortfolioAsText(data) {
  if (!data) return '';
  const { personalInfo, skills, experience, education, projects } = data;
  return `
Name: ${personalInfo?.fullName || ''}
Title: ${personalInfo?.title || ''}
Bio: ${personalInfo?.bio || ''}
Skills: ${skills?.map(s => s.name).join(', ') || ''}
Experience: ${experience?.map(e => `${e.role} at ${e.company}`).join(', ') || ''}
Education: ${education?.map(e => `${e.degree} from ${e.institution}`).join(', ') || ''}
Projects: ${projects?.map(p => p.name).join(', ') || ''}
  `.trim();
}

module.exports = { getATSScore, extractKeywords };