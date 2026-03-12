const Portfolio = require('../models/Portfolio');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /api/skills/analytics - get skill analytics for user's portfolio
const getSkillAnalytics = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio)
      return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const skills = portfolio.skills || [];

    // Group skills by category
    const byCategory = skills.reduce((acc, skill) => {
      const cat = skill.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    // Average level per category
    const categoryAverages = Object.entries(byCategory).map(([category, catSkills]) => ({
      category,
      average: Math.round(catSkills.reduce((sum, s) => sum + (s.level || 0), 0) / catSkills.length),
      count: catSkills.length,
    }));

    // Top skills
    const topSkills = [...skills].sort((a, b) => (b.level || 0) - (a.level || 0)).slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalSkills: skills.length,
        byCategory,
        categoryAverages,
        topSkills,
        skillDistribution: {
          expert:       skills.filter(s => s.level >= 80).length,
          intermediate: skills.filter(s => s.level >= 50 && s.level < 80).length,
          beginner:     skills.filter(s => s.level < 50).length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/skills/market-comparison - compare skills with market demand
const marketComparison = async (req, res) => {
  try {
    const { skills, jobTitle } = req.body;
    if (!skills || !skills.length)
      return res.status(400).json({ success: false, message: 'Skills are required' });

    const prompt = `Compare these skills with current market demand for a ${jobTitle || 'software developer'} in 2025.
Skills: ${skills.join(', ')}

Return JSON only:
{
  "marketDemand": [
    { "skill": "...", "demand": "high|medium|low", "trend": "rising|stable|declining", "salaryImpact": "high|medium|low" }
  ],
  "missingHighDemand": ["skill1", "skill2"],
  "overallMarketFit": <0-100>,
  "recommendation": "..."
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const comparison = match ? JSON.parse(match[0]) : {};

    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/skills/roadmap - generate learning roadmap
const getLearningRoadmap = async (req, res) => {
  try {
    const { currentSkills, targetRole, timeframe } = req.body;

    const prompt = `Create a learning roadmap to become a ${targetRole} in ${timeframe || '6 months'}.
Current skills: ${currentSkills?.join(', ') || 'none'}

Return JSON only:
{
  "phases": [
    {
      "phase": 1,
      "title": "...",
      "duration": "...",
      "skills": ["skill1", ...],
      "resources": ["resource1", ...]
    }
  ],
  "totalDuration": "...",
  "prioritySkills": ["skill1", "skill2", "skill3"]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const roadmap = match ? JSON.parse(match[0]) : {};

    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkillAnalytics, marketComparison, getLearningRoadmap };