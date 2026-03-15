const express = require("express");
const router  = express.Router();
const { enhance } = require("../controllers/chatbotController");

router.post("/enhance", enhance);

module.exports = router;