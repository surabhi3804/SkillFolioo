// backend/controllers/chatbotController.js
const { spawn } = require("child_process");
const path      = require("path");
const ChatHistory = require("../models/ChatHistory");

// ── Enhance text via Python NLP engine ──────────────────────
exports.enhance = (req, res) => {
  const { text, context, tone } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Text is required." });
  }

  const scriptPath = path.join(__dirname, "../python", "nlp_engine.py");
  const inputData  = JSON.stringify({ text, context: context || "Experience", tone: tone || "Professional" });

  const python = spawn("python", [scriptPath]);
  let result = "";
  let error  = "";

  python.stdout.on("data", (data) => { result += data.toString(); });
  python.stderr.on("data", (data) => { error  += data.toString(); });
  python.on("error", (err) => {
    return res.status(500).json({ success: false, error: "Python not found: " + err.message });
  });

  python.stdin.write(inputData);
  python.stdin.end();

  python.on("close", async (code) => {
    if (code !== 0 || error) {
      return res.status(500).json({ success: false, error: "NLP processing failed: " + error });
    }
    try {
      const parsed = JSON.parse(result);

      // Save to history if user is logged in
      if (parsed.success && req.user) {
        await ChatHistory.create({
          user:       req.user._id,
          original:   parsed.original,
          enhanced:   parsed.enhanced,
          context:    context || "Experience",
          tone:       tone    || "Professional",
          domain:     parsed.domain    || "general",
          metric_tip: parsed.metric_tip || "",
        });
      }

      res.json(parsed);
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to parse result." });
    }
  });
};

// ── Get history for logged-in user ──────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete a history item ────────────────────────────────────
exports.deleteHistory = async (req, res) => {
  try {
    const item = await ChatHistory.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ success: false, error: "Not found." });
    await item.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Clear all history for logged-in user ────────────────────
exports.clearHistory = async (req, res) => {
  try {
    await ChatHistory.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};