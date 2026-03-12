const express = require('express');
const router = express.Router();
const { getSkillAnalytics, marketComparison, getLearningRoadmap } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/analytics',         protect, getSkillAnalytics);
router.post('/market-comparison', protect, marketComparison);
router.post('/roadmap',          protect, getLearningRoadmap);

module.exports = router;