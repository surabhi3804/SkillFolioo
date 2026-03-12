const Portfolio = require('../models/Portfolio');

// GET /api/portfolio - get user's portfolio
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio)
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/portfolio - create portfolio
const createPortfolio = async (req, res) => {
  try {
    const existing = await Portfolio.findOne({ user: req.user._id });
    if (existing)
      return res.status(400).json({ success: false, message: 'Portfolio already exists. Use PUT to update.' });

    const portfolio = await Portfolio.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/portfolio - update portfolio
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/portfolio/template - change template
const updateTemplate = async (req, res) => {
  try {
    const { template, customization } = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { template, customization },
      { new: true }
    );
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/portfolio/publish - publish/unpublish portfolio
const publishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio)
      return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const slug = `${req.user.name.toLowerCase().replace(/\s+/g, '-')}-${req.user._id.toString().slice(-4)}`;
    portfolio.isPublished = !portfolio.isPublished;
    portfolio.slug = portfolio.isPublished ? slug : null;
    await portfolio.save();

    res.json({ success: true, isPublished: portfolio.isPublished, slug: portfolio.slug });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/portfolio/public/:slug - get public portfolio
const getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublished: true }).populate('user', 'name');
    if (!portfolio)
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolio, createPortfolio, updatePortfolio, updateTemplate, publishPortfolio, getPublicPortfolio };