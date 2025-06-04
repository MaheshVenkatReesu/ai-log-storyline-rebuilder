const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Local AI (Ollama)
router.post("/summary", async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ success: false, message: "Filename is required" });
  }

  const filePath = path.join(__dirname, "..", "uploads", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const prompt = `Summarize the following log file:\n\n${content.substring(0, 10000)}\n\nGive a concise summary and any critical errors.`; // limit to 10k characters

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    const result = await response.json();

    res.json({ success: true, summary: result.response });
  } catch (error) {
    console.error("🛑 Local AI summary error:", error);
    res.status(500).json({ success: false, message: "Local AI failed." });
  }
});

module.exports = router;