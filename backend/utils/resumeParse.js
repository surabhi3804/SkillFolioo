// backend/routes/resumeParse.js
const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const { protect } = require('../middleware/auth');
const { parseResume } = require('../controllers/resumeParserController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});

/**
 * POST /api/resume/parse
 * Accepts multipart/form-data with field "resume"
 * Returns: { text, wordCount, fileName }
 */
router.post('/parse', protect, upload.single('resume'), parseResume);

module.exports = router;