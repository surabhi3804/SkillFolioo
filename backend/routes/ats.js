const express = require('express');
const router = express.Router();
const { getATSScore, extractKeywords } = require('../controllers/atsController');
const { protect } = require('../middleware/auth');

router.post('/score',    protect, getATSScore);
router.post('/keywords', protect, extractKeywords);

module.exports = router;