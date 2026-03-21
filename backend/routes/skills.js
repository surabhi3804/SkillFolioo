// backend/routes/skills.js
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

module.exports = router;