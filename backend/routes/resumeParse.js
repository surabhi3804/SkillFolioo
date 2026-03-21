// backend/routes/resumeParser.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { protect } = require('../middleware/auth');
const { parseResume } = require('../controllers/resumeParserController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
});

// POST /api/resume/parse
router.post('/parse', protect, upload.single('resume'), parseResume);

module.exports = router;