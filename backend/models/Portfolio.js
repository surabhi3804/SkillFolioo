const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, default: 'My Portfolio' },
  template:     { type: String, default: 'modern' },
  isPublished:  { type: Boolean, default: false },
  slug:         { type: String, unique: true, sparse: true },

  personalInfo: {
    fullName:   String,
    title:      String,
    bio:        String,
    email:      String,
    phone:      String,
    location:   String,
    website:    String,
    linkedin:   String,
    github:     String,
    avatar:     String,
  },

  skills: [{
    name:       String,
    level:      { type: Number, min: 0, max: 100 },
    category:   String,
  }],

  experience: [{
    company:    String,
    role:       String,
    startDate:  String,
    endDate:    String,
    current:    Boolean,
    description:String,
  }],

  education: [{
    institution:String,
    degree:     String,
    field:      String,
    startDate:  String,
    endDate:    String,
    grade:      String,
  }],

  projects: [{
    name:       String,
    description:String,
    tech:       [String],
    liveUrl:    String,
    githubUrl:  String,
    image:      String,
  }],

  certifications: [{
    name:       String,
    issuer:     String,
    date:       String,
    url:        String,
  }],

  customization: {
    primaryColor:   { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#8b5cf6' },
    fontFamily:     { type: String, default: 'Inter' },
    darkMode:       { type: Boolean, default: false },
  },

  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
});

portfolioSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);