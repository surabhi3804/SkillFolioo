// backend/routes/skills.js
<<<<<<< HEAD
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
=======
const express   = require('express');
const router    = express.Router();
const { protect } = require('../middleware/auth');
const { analyzeSkills, getTargetRoles } = require('../controllers/skillController');

/**
 * GET /api/skills/roles
 * Returns the list of supported target roles.
 * Public — no auth needed (used to populate the role selector on first load).
 */
router.get('/roles', getTargetRoles);

/**
 * POST /api/skills/analyze
 * Body: { resumeText: string, targetRoles: string[] }
 */
router.post('/analyze', protect, analyzeSkills);
>>>>>>> 212b6900966021a43561d9bc97d3f9a60d45d1a4

module.exports = router;