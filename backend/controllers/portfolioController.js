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

    if (!portfolio) {
      return res.json({ portfolio: null });
    }

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
      education, projects, certifications, style,
    } = req.body;

    const updateData = {};
    if (personalInfo)   updateData.personalInfo   = personalInfo;
    if (skills)         updateData.skills         = skills;
    if (experience)     updateData.experience     = experience;
    if (education)      updateData.education      = education;
    if (projects)       updateData.projects       = projects;
    if (certifications) updateData.certifications = certifications;
    if (style)          updateData.style          = style;

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
exports.publishPortfolio = async (req, res) => {
  try {
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
    await portfolio.save();

    // ✅ Return just the path — frontend uses window.location.origin to build full URL
    // In dev:  http://localhost:3000/p/rohan-sharma
    // In prod: https://skillfolio.app/p/rohan-sharma
    const portfolioUrl = `/p/${slug}`;

    res.json({
      message: 'Portfolio published!',
      slug,
      portfolioUrl,
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

    res.json({ portfolio });
  } catch (err) {
    console.error('getPublicPortfolio error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};