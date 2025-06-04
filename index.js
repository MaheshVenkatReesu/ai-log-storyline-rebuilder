require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const aiRoutes = require("./routes/ai.js");



const app = express();
const apiKey = process.env.OPENAI_API_KEY;



// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // frontend port
  credentials: true
}));

app.use(express.json());

const localAiRoutes = require("./routes/local-ai.js");

app.use("/api/ai", aiRoutes);
app.use("/api/local-ai", localAiRoutes);

const chatRoutes = require("./routes/chat.js");
app.use("/api/chat", chatRoutes);


// Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".log") {
      return cb(new Error("Only .log files are allowed"), false);
    }
    cb(null, true);
  }
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend is working!" });
});

// Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    filename: req.file.filename
  });
});

// ✅ Listen on PORT 5050
app.listen(5050, () => {
  console.log("🚀 Server running on http://localhost:5050");
});

app.get("/api/files", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ success: false, message: "Could not list files." });

    const result = files.map((file) => ({
      name: file,
      path: `/files/${file}`,
    }));

    res.json({ success: true, files: result });
  });
});

app.get("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Security check
  if (!filename.endsWith(".log")) {
    return res.status(400).json({ success: false, message: "Invalid file type." });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ success: false, message: "Failed to read file." });
    }
    res.json({ success: true, filename, content: data });
  });
});


app.delete("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;

  // Prevent malicious path traversal
  if (!filename.endsWith(".log")) {
    return res.status(400).json({ success: false, message: "Invalid file type" });
  }

  const filePath = path.join(__dirname, "uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Delete failed:", err);
      return res.status(500).json({ success: false, message: "File deletion failed" });
    }

    res.json({ success: true, message: "File deleted successfully" });
  });
});