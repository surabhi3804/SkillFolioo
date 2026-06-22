// backend/server.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ─────────────────────────────────────────────────
const authRoutes        = require('./routes/auth');
const portfolioRoutes   = require('./routes/portfolio');
const atsRoutes         = require('./routes/ats');
const skillsRoutes      = require('./routes/skills');
const resumeParseRoutes = require('./routes/resumeParse');
const chatbotRoutes     = require('./routes/chatbot');

app.use('/api/auth',      authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ats',       atsRoutes);
app.use('/api/skills',    skillsRoutes);
app.use('/api/resume',    resumeParseRoutes);
app.use('/api/chatbot',   chatbotRoutes);

// ─── Test route to verify DB collections ────────────────────
app.get('/api/debug/collections', async (req, res) => {
  try {
    const db          = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const dbName      = db.databaseName;
    res.json({
      database:    dbName,
      collections: collections.map(c => c.name),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check route (useful for Render) ─────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// ─── Start server immediately (don't wait on DB) ─────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ─── Connect to MongoDB separately ───────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const dbName = mongoose.connection.db.databaseName;
    console.log('✅ MongoDB Connected to database:', dbName);
    console.log('   Full host:', process.env.MONGO_URI?.split('@')[1]);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections in', dbName + ':', collections.map(c => c.name));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    // Not exiting here — server stays up so Render's port check passes
    // and you can debug via /api/health and logs.
  });