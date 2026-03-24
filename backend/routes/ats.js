// backend/routes/ats.js
const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const { protect } = require('../middleware/auth');
const { scoreATS, getCustomRoles, saveCustomRole, deleteCustomRole } = require('../controllers/atsController');

// multer — memory storage (we only need the buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
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

// Existing score route
router.post('/score', protect, upload.single('resume'), scoreATS);

// Custom roles routes
router.get   ('/custom-roles',     protect, getCustomRoles);
router.post  ('/custom-roles',     protect, saveCustomRole);
router.delete('/custom-roles/:id', protect, deleteCustomRole);

module.exports = router;