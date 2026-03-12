const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are SkillFolio AI, a professional career and portfolio assistant. 
You help users with:
- Writing compelling bio and summaries
- Improving project descriptions
- Suggesting skills to add based on their experience
- Rephrasing job experience bullet points to be more impactful
- Resume and portfolio tips
- Career advice

Keep responses concise, actionable, and professional. Use bullet points when listing items.`;

// POST /api/ai/chat - general AI chat
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    res.json({ success: true, reply: response.content[0].text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/improve-bio - improve user bio
const improveBio = async (req, res) => {
  try {
    const { bio, jobTitle, skills } = req.body;
    const prompt = `Improve this professional bio for a ${jobTitle}. Make it engaging, professional, and around 3-4 sentences.
Skills: ${skills?.join(', ') || 'not provided'}
Current bio: "${bio}"
Return only the improved bio text, nothing else.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ success: true, improvedBio: response.content[0].text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/improve-description - improve project/experience description
const improveDescription = async (req, res) => {
  try {
    const { description, type } = req.body; // type: 'project' | 'experience'
    const prompt = `Rewrite this ${type} description to be more impactful and professional. Use action verbs and quantify achievements where possible.
Original: "${description}"
Return only the improved description, nothing else.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ success: true, improvedDescription: response.content[0].text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/suggest-skills - suggest skills based on role/experience
const suggestSkills = async (req, res) => {
  try {
    const { jobTitle, currentSkills, experience } = req.body;
    const prompt = `Suggest 10 relevant skills for a ${jobTitle} that are in demand in 2025.
Current skills: ${currentSkills?.join(', ') || 'none'}
Experience: ${experience || 'not provided'}
Return a JSON array of skill names only, like: ["Skill1", "Skill2", ...]`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const match = text.match(/\[.*\]/s);
    const skills = match ? JSON.parse(match[0]) : [];

    res.json({ success: true, suggestedSkills: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat, improveBio, improveDescription, suggestSkills };