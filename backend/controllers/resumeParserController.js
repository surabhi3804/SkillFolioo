// backend/controllers/resumeParserController.js
// Accepts a multipart file upload and returns extracted plain text.
const { extractText } = require('../utils/resumeParse');

/**
 * POST /api/resume/parse
 * Accepts: multipart/form-data  field: "resume"
 * Returns: { text, wordCount, fileName }
 */
exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded. Send file as multipart field "resume".',
      });
    }

    const text = await extractText(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    if (!text || text.trim().length < 30) {
      return res.status(422).json({
        message: 'Could not extract readable text from this file. Try a different format.',
      });
    }

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    return res.json({
      text,
      wordCount,
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error('parseResume error:', err);
    res.status(500).json({ message: err.message || 'File parsing failed.' });
  }
};