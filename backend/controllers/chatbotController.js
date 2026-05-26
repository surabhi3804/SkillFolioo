// backend/controllers/chatbotController.js
<<<<<<< HEAD
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/ChatHistory");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// ── Dynamic Chat ─────────────────────────────────────────────
exports.chat = async (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  if (!message?.trim())
    return res.status(400).json({ success: false, error: "Message is required." });

  const systemPrompt = `You are a smart, helpful career, resume and portfolio assistant. You can:
- Enhance resume bullet points and professional writing
- Answer career advice questions
- Help structure CVs, cover letters, LinkedIn summaries
- Detect the domain (web, data, ML, DevOps, etc.) and tailor advice
- Suggest quantifiable metrics when text lacks numbers
Always be concise, professional, and actionable.
Behavior Rules:
- If the user sends resume/project content, enhance and improve it professionally
- If the user asks normal conversational questions, respond naturally and friendly
- Keep responses concise, professional, and actionable
- Do NOT say "Not applicable" for casual conversation
- Be supportive and career-focused
`;

  try {
    // Convert your history format to Gemini's format
    const geminiHistory = conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        // Inject system prompt as first user/model exchange
        { role: "user",  parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I'm ready to help with your career and resume needs." }] },
        ...geminiHistory,
      ],
    });

    const result  = await chat.sendMessage(message);
    const reply   = result.response.text();

    // Save to history if user is logged in
    if (req.user) {
      await ChatHistory.create({
        user:     req.user._id,
        original: message,
        enhanced: reply,
        context:  "Chat",
        tone:     "Dynamic",
      });
    }

    res.json({
      success: true,
      message: reply,
      conversationHistory: [
        ...conversationHistory,
        { role: "user",      content: message },
        { role: "assistant", content: reply   },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Enhance ──────────────────────────────────────────────────
exports.enhance = async (req, res) => {
  const { text, context = "Experience", tone = "Professional" } = req.body;
  if (!text?.trim())
    return res.status(400).json({ success: false, error: "Text is required." });

  try {
    const prompt = `Enhance this resume bullet point for a ${context} section with a ${tone} tone.
Return ONLY the enhanced text, nothing else.

Original: ${text}`;

    const result   = await model.generateContent(prompt);
    const enhanced = result.response.text().trim();

    if (req.user) {
      await ChatHistory.create({
        user: req.user._id,
        original: text,
        enhanced,
        context,
        tone,
      });
    }

    res.json({ success: true, original: text, enhanced });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── History (unchanged) ──────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(50);
=======
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
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

<<<<<<< HEAD
=======
// ── Delete a history item ────────────────────────────────────
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
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

<<<<<<< HEAD
=======
// ── Clear all history for logged-in user ────────────────────
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
exports.clearHistory = async (req, res) => {
  try {
    await ChatHistory.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};