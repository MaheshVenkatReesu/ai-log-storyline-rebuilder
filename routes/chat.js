const express = require("express");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const { spawn } = require("child_process");
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { filename, question, useAI, useLocalAI } = req.body;

  if (!filename || !question) {
    return res.status(400).json({ success: false, message: "Missing filename or question." });
  }

  const filePath = path.join(__dirname, "..", "uploads", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found." });
  }

  const logContent = fs.readFileSync(filePath, "utf-8");

  try {
    if (useAI && !useLocalAI) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful log analyst." },
          { role: "user", content: `Here is the log:\n\n${logContent}\n\nQuestion: ${question}` }
        ],
        stream: true,
      }, { responseType: 'stream' });

      const answer = response.choices[0].message.content;
      return res.json({ success: true, answer });
    }

        // Local LLM via Ollama HTTP API (streamed)
    if (useLocalAI && !useAI) {
      const prompt = `Log:\n${logContent}\n\nQuestion:\n${question}`;

      // Inside some async function
        const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama3",
            prompt: "Your prompt here",
            stream: false,
        }),
        });

        const result = await response.json();
        console.log(result);

    }


  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ success: false, message: "Failed to generate chat response." });
  }
});

module.exports = router;
