const express = require('express');
const router  = express.Router();

// ✅ auth.js exports { protect } — must destructure it
const { protect } = require('../middleware/auth');

const {
  getPortfolio,
  updatePortfolio,
  publishPortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');

// Public — no auth needed
router.get('/public/:slug', getPublicPortfolio);

// Protected — must be logged in
router.get('/',         protect, getPortfolio);
router.put('/',         protect, updatePortfolio);
router.post('/publish', protect, publishPortfolio);

module.exports = router;