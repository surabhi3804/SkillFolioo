<<<<<<< HEAD
// backend/utils/resumeParse.js
const mammoth = require('mammoth');

/**
 * Extracts plain text from a resume file buffer.
 * Supports: PDF, DOC, DOCX, TXT
 *
 * Uses pdf-parse@1.1.1 (stable) for PDF extraction.
 */
const extractText = async (buffer, mimetype, originalname = '') => {
  const name = originalname.toLowerCase();

  console.log('🔍 extractText — mimetype:', mimetype, '| file:', originalname, '| size:', buffer?.length);

  // ── PDF ──────────────────────────────────────────────────────
  if (mimetype === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      const pdfParse = require('pdf-parse');
      const data     = await pdfParse(buffer);
      console.log('✅ pdf extracted, length:', data.text?.length);
      console.log('✅ preview:', data.text?.slice(0, 150));
      return data.text || '';
    } catch (err) {
      console.error('❌ pdf-parse error:', err.message);
      throw new Error('PDF parsing failed: ' + err.message);
    }
  }

  // ── DOCX ─────────────────────────────────────────────────────
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      console.log('✅ docx extracted, length:', result.value?.length);
      return result.value || '';
    } catch (err) {
      console.error('❌ mammoth docx error:', err.message);
      throw new Error('DOCX parsing failed: ' + err.message);
    }
  }

  // ── DOC ───────────────────────────────────────────────────────
  if (mimetype === 'application/msword' || name.endsWith('.doc')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      console.log('✅ doc extracted, length:', result.value?.length);
      return result.value || '';
    } catch (err) {
      console.error('❌ mammoth doc error:', err.message);
      return buffer.toString('utf8');
    }
  }

  // ── TXT ───────────────────────────────────────────────────────
  if (mimetype === 'text/plain' || name.endsWith('.txt')) {
    const text = buffer.toString('utf8');
    console.log('✅ txt extracted, length:', text.length);
    return text;
  }

  console.warn('⚠️  Unknown type, fallback UTF-8:', mimetype);
  return buffer.toString('utf8');
};

module.exports = { extractText };
=======
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
>>>>>>> 212b6900966021a43561d9bc97d3f9a60d45d1a4
