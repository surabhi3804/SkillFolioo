<<<<<<< HEAD
const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth");
const {
  chat,
=======
// backend/routes/chatbot.js
const express  = require("express");
const router   = express.Router();
const { protect } = require("../middleware/auth");
const {
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  enhance,
  getHistory,
  deleteHistory,
  clearHistory,
} = require("../controllers/chatbotController");

<<<<<<< HEAD
router.post("/chat",          chat);
router.post("/enhance",       enhance);
=======
// Enhance — optionally protected (saves history if logged in)
router.post("/enhance",  enhance);

// History routes — all protected
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
router.get("/history",        protect, getHistory);
router.delete("/history/:id", protect, deleteHistory);
router.delete("/history",     protect, clearHistory);

module.exports = router;