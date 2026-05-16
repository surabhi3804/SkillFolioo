// backend/routes/skills.js
const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { protect } = require('../middleware/auth');
const { analyzeSkills, getTargetRoles } = require('../controllers/skillController');

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

// POST /api/skills/analyze — accepts file OR JSON body
router.post('/analyze', protect, upload.single('resume'), analyzeSkills);

// GET /api/skills/roles
router.get('/roles', protect, getTargetRoles);

module.exports = router;