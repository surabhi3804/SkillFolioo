const express = require('express');
const router = express.Router();
const {
  getPortfolio, createPortfolio, updatePortfolio,
  updateTemplate, publishPortfolio, getPublicPortfolio
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.get('/',               protect, getPortfolio);
router.post('/',              protect, createPortfolio);
router.put('/',               protect, updatePortfolio);
router.put('/template',       protect, updateTemplate);
router.post('/publish',       protect, publishPortfolio);
router.get('/public/:slug',   getPublicPortfolio);  // public, no auth

module.exports = router;