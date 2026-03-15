const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Debug route loading
const authRoute      = require('./routes/auth');
const portfolioRoute = require('./routes/portfolio');
const chatbotRoute = require("./routes/chatbot");
const atsRoute       = require('./routes/ats');
const skillsRoute    = require('./routes/skills');

console.log('auth route type:',      typeof authRoute);
console.log('portfolio route type:', typeof portfolioRoute);
console.log('chatbot route type:',        typeof chatbotRoute);
console.log('ats route type:',       typeof atsRoute);
console.log('skills route type:',    typeof skillsRoute);

// Routes
app.use('/api/auth',      authRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/chatbot',        chatbotRoute);
app.use('/api/ats',       atsRoute);
app.use('/api/skills',    skillsRoute);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SkillFolio API running' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));