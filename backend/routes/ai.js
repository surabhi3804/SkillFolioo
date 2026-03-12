const express = require('express');
const router = express.Router();
const { chat, improveBio, improveDescription, suggestSkills } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat',                protect, chat);
router.post('/improve-bio',         protect, improveBio);
router.post('/improve-description', protect, improveDescription);
router.post('/suggest-skills',      protect, suggestSkills);

module.exports = router;