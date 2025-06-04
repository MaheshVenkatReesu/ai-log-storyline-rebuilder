const express = require("express");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/summary", async (req, res) => {
  try {
    const { filename, useAI } = req.body;
    console.log("🧠 AI summary request received:", { filename, useAI });

    if (!filename || !useAI) {
      console.log("⚠️ Missing filename or useAI in request body");
      return res.status(400).json({ success: false, message: "Missing filename or useAI" });
    }

    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (!fs.existsSync(filePath)) {
      console.log("🚫 File not found:", filePath);
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const content = fs.readFileSync(filePath, "utf-8");
    console.log("📄 File content length:", content.length);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a log analysis assistant." },
        { role: "user", content: `Summarize this log:\n\n${content}` },
      ],
    });

    const summary = response.choices[0].message.content;
    console.log("✅ AI summary generated.");
    res.json({ success: true, summary });
  } catch (error) {
    console.error("❌ AI summary error:", error);
    res.status(500).json({ success: false, message: "AI summary failed." });
  }
});

module.exports = router;
