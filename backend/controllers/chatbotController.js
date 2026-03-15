//chatbotController.js
const { spawn } = require("child_process");
const path      = require("path");

exports.enhance = (req, res) => {
  const { text, context } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Text is required." });
  }

  const scriptPath = path.join(__dirname, "../python", "nlp_engine.py");
  const inputData  = JSON.stringify({ text, context: context || "Experience" });

  // Use stdin instead of argv to avoid Windows quote escaping issues
  const python = spawn("python", [scriptPath]);

  let result = "";
  let error  = "";

  python.stdout.on("data", (data) => { result += data.toString(); });
  python.stderr.on("data", (data) => { error  += data.toString(); });

  python.on("error", (err) => {
    console.log("Spawn error:", err.message);
    return res.status(500).json({ success: false, error: "Python not found: " + err.message });
  });

  // Write input via stdin instead of argv
  python.stdin.write(inputData);
  python.stdin.end();

  python.on("close", (code) => {
    if (code !== 0 || error) {
      console.error("Python error:", error);
      return res.status(500).json({ success: false, error: "NLP processing failed: " + error });
    }
    try {
      res.json(JSON.parse(result));
    } catch (e) {
      res.status(500).json({ success: false, error: "Failed to parse result." });
    }
  });
};