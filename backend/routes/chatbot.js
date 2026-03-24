// backend/routes/chatbot.js
const express  = require("express");
const router   = express.Router();
const { protect } = require("../middleware/auth");
const {
  enhance,
  getHistory,
  deleteHistory,
  clearHistory,
} = require("../controllers/chatbotController");

// Enhance — optionally protected (saves history if logged in)
router.post("/enhance", protect, enhance);

// History routes — all protected
router.get("/history",        protect, getHistory);
router.delete("/history/:id", protect, deleteHistory);
router.delete("/history",     protect, clearHistory);

module.exports = router;