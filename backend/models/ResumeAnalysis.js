// backend/models/ResumeAnalysis.js
const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── What was analysed ───────────────────────────────────
    fileName: { type: String, default: '' },

    // Target roles selected by the user (replaces jobDescription)
    targetRoles: [{ type: String }],

    // ── ATS results ─────────────────────────────────────────
    atsScore: { type: Number, default: 0 },
    atsBreakdown: {
      keywordScore:     { type: Number, default: 0 },
      formattingScore:  { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 0 },
      sectionScore:     { type: Number, default: 0 },
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    atsSuggestions:  [{ type: String }],
    atsSummary:      { type: String, default: '' },

    // ── Skill results ────────────────────────────────────────
    detectedSkills:  [{ type: String }],
    suggestedSkills: [{ type: String }],
    growthAreas:     [{ type: String }],
    skillInsights:   [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);