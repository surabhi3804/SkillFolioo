const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth");
const {
  chat,
  enhance,
  getHistory,
  deleteHistory,
  clearHistory,
} = require("../controllers/chatbotController");

router.post("/chat",          chat);
router.post("/enhance",       enhance);
router.get("/history",        protect, getHistory);
router.delete("/history/:id", protect, deleteHistory);
router.delete("/history",     protect, clearHistory);

module.exports = router;