const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    personalInfo: {
      fullName:  { type: String, default: '' },
      title:     { type: String, default: '' },
      email:     { type: String, default: '' },
      phone:     { type: String, default: '' },
      location:  { type: String, default: '' },
      linkedin:  { type: String, default: '' },
      github:    { type: String, default: '' },
      website:   { type: String, default: '' },
      bio:       { type: String, default: '' },
    },

    skills: [
      {
        name:     { type: String, default: '' },
        level:    { type: Number, default: 70 },
        category: { type: String, default: 'Technical' },
      },
    ],

    experience: [
      {
        role:        { type: String, default: '' },
        company:     { type: String, default: '' },
        description: { type: String, default: '' },
        startDate:   { type: String, default: '' },
        endDate:     { type: String, default: '' },
        current:     { type: Boolean, default: false },
      },
    ],

    education: [
      {
        degree:      { type: String, default: '' },
        institution: { type: String, default: '' },
        field:       { type: String, default: '' },
        grade:       { type: String, default: '' },
        startDate:   { type: String, default: '' },
        endDate:     { type: String, default: '' },
      },
    ],

    projects: [
      {
        name:        { type: String, default: '' },
        description: { type: String, default: '' },
        tech:        [{ type: String }],
        liveUrl:     { type: String, default: '' },
        githubUrl:   { type: String, default: '' },
      },
    ],

    certifications: [
      {
        name:   { type: String, default: '' },
        issuer: { type: String, default: '' },
        date:   { type: String, default: '' },
        url:    { type: String, default: '' },
      },
    ],

    // Portfolio display settings
    style: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Publishing
    isPublished: { type: Boolean, default: false },
    slug: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);