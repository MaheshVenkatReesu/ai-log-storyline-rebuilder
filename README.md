# 🧠 AI Log Storyline Rebuilder

> Reconstruct readable incident narratives from fragmented log data using AI

![status](https://img.shields.io/badge/status-MVP-green) ![tech](https://img.shields.io/badge/built_with-Node.js%2C%20OpenAI%2C%20MongoDB-blue)

---

## 🧭 Product Vision

Today’s log analysis tools rely heavily on regex and manual searches. Security analysts and SREs spend hours stitching timelines from raw, chaotic logs.  
**This tool changes that — it builds contextual, human-readable narratives from logs using AI.**

---

## 💡 Key Features

- 🔄 Upload & parse logs (multiple formats)
- 📆 Extract timestamps, message patterns
- 🧠 AI-powered event clustering
- 📖 Rebuild chronological storylines
- 💬 Ask basic NL questions like _“What triggered this outage?”_
- 📤 Export incident reports
- 🗃️ Maintain case history

---

## 🎯 Target Audience

- SOC Analysts & Incident Responders  
- Digital Forensics Teams  
- DevOps & SRE Engineers  
- CISOs & Compliance Officers

---

## 🧪 Tech Stack

- **Node.js** – backend logic
- **OpenAI API** – natural language understanding
- **MongoDB** – storing logs and cases
-  **React** – UI
- *(Future: Timeline Visualizer)*

---

## 🔍 Sample Use Case

1. Analyst uploads logs from 3 microservices
2. Tool parses logs → timestamps + messages
3. AI identifies event clusters (auth failure → retry storm → outage)
4. Timeline/storyline is generated in plain English
5. Analyst queries “How did this incident start?”
6. Gets structured summary + exportable report
