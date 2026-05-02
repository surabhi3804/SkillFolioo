const Portfolio = require('../models/Portfolio');

/* ─── Helper: generate a unique slug ───────────────────────── */
const generateSlug = async (baseName) => {
  const base = (baseName || 'user')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  let slug = base;
  let count = 0;

  while (await Portfolio.findOne({ slug })) {
    count += 1;
    slug = `${base}-${count}`;
  }

  return slug;
};

/* ─── GET /api/portfolio ────────────────────────────────────── */
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.json({ portfolio: null });
    res.json({ portfolio });
  } catch (err) {
    console.error('getPortfolio error:', err);
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
};

/* ─── PUT /api/portfolio ────────────────────────────────────── */
exports.updatePortfolio = async (req, res) => {
  try {
    const {
      personalInfo, skills, experience,
      education, projects, certifications,
      style, templateId,
    } = req.body;

    const updateData = {};
    if (personalInfo)             updateData.personalInfo   = personalInfo;
    if (skills)                   updateData.skills         = skills;
    if (experience)               updateData.experience     = experience;
    if (education)                updateData.education      = education;
    if (projects)                 updateData.projects       = projects;
    if (certifications)           updateData.certifications = certifications;
    if (style)                    updateData.style          = style;
    if (templateId !== undefined) updateData.templateId     = templateId;

    console.log('💾 updatePortfolio — saving templateId:', templateId);

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: false }
    );

    res.json({ message: 'Portfolio saved', portfolio });
  } catch (err) {
    console.error('updatePortfolio error:', err);
    res.status(500).json({ message: 'Server error saving portfolio' });
  }
};

/* ─── POST /api/portfolio/publish ──────────────────────────── */
// ✅ FIX: now accepts templateId + style in the request body so
//    the template is ALWAYS saved atomically with the publish flag.
//    This removes the race-condition between savePortfolioToBackend()
//    and publish() being two separate calls.
exports.publishPortfolio = async (req, res) => {
  try {
    const { templateId, style } = req.body;   // ✅ accept from frontend

    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      return res.status(404).json({ message: 'No portfolio found. Save your data first.' });
    }

    let { slug } = portfolio;
    if (!slug) {
      const baseName = portfolio.personalInfo?.fullName || 'user';
      slug = await generateSlug(baseName);
    }

    portfolio.isPublished = true;
    portfolio.slug        = slug;

    // ✅ Atomically save templateId + style together with isPublished
    if (templateId)                              portfolio.templateId = templateId;
    if (style && Object.keys(style).length > 0) portfolio.style      = style;

    console.log('🚀 publishPortfolio — saving templateId:', portfolio.templateId, '| slug:', slug);

    await portfolio.save();

    res.json({
      message:      'Portfolio published!',
      slug,
      portfolioUrl: `/p/${slug}`,
      portfolio,
    });
  } catch (err) {
    console.error('publishPortfolio error:', err);
    res.status(500).json({ message: 'Server error publishing portfolio' });
  }
};

/* ─── GET /api/portfolio/public/:slug ──────────────────────── */
exports.getPublicPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = await Portfolio.findOne({ slug, isPublished: true });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not published' });
    }

    console.log('📖 getPublicPortfolio — templateId from DB:', portfolio.templateId);

    res.json({ portfolio });
  } catch (err) {
    console.error('getPublicPortfolio error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};