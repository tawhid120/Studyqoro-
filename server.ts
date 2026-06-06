/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Lazy initialization of Gemini client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Features will fall back to simulation.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health query
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // API Route: Gemini chat endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Generate context for academic study assistant
      const systemInstruction = 
        "You are 'Study Qoro AI', a friendly, highly intelligent academic tutor for Bangladeshi secondary (SSC), higher secondary (HSC), and university admission test candidates. " +
        "Guidelines for response:\n" +
        "1. Write in a warm, welcoming mix of Bengali and conversational English (Banglish / Benglish is fine, but correct Bangla script is highly preferred for core concepts).\n" +
        "2. Explain academic theories (Physics, Chemistry, Biology, Mathematics, ICT, English, etc.) very simply with illustrative examples and real-life analogies appropriate for HSC/SSC students.\n" +
        "3. Provide answers formatted in clean Markdown (including bullet points, bold headers, and mathematical notations when needed).\n" +
        "4. Dynamic file/image queries: If the student uploaded an image, a PDF, or academic study materials, read, analyse, solve its question, or summarise detail as requested.\n" +
        "5. Always motivate students to keep up their study routine, maintain stress-free mental state, pray/worship correctly and stick to morals.\n" +
        "6. Keep explanations clear, engaging, and compact. End with a motivational encouraging phrase.";
 
      // Fallback if no real API key
      if (!process.env.GEMINI_API_KEY) {
         // Return simulated academic reply
         const lastUserMsg = messages[messages.length - 1]?.text || "পড়াশোনা সংক্রান্ত প্রশ্ন";
         const attachmentsText = messages[messages.length - 1]?.attachments?.map((a: any) => `📎 ${a.name} (${a.mimeType})`).join(", ") || "";
         const attachmentNotice = attachmentsText ? `\n\n(সংযুক্ত ফাইল: **${attachmentsText}** সফলভাবে সার্ভারে আপলোড করা হয়েছে এবং তা প্রসেসিংয়ের জন্য প্রস্তুত)` : "";
         return res.json({
           text: `[Study Qoro AI - ডেমো মোড]\n\nআপনাদের জিজ্ঞেস করা প্রশ্ন: **"${lastUserMsg}"**${attachmentNotice}\n\nএটি একটি চমৎকার শিক্ষামূলক প্রশ্ন! আমাদের সার্ভার বর্তমানে ডেমো মোডে চলছে কারণ API কি সংযুক্ত করা হয়নি। কিন্তু আপনি যখন আপনার রিয়াল ডোমেইন বা সিক্রেট কি অ্যাড করবেন, তখন সরাসরি জেমিনি এআই এর সাহায্যে ১০০% রিয়াল ও বিস্তারিত একাডেমিক উত্তর ও আপলোডকৃত ফাইলটির নির্ভুল বিশ্লেষণ পাবেন। \n\nধারাবাহিকভাবে পড়াশোনা করে যাও, তুমিই হবে आगामी দিনের টপার! 🚀`
         });
       }

      const client = getGeminiClient();

      // Convert messages to structure suited for contents parameter
      const contents = messages.map((m: any) => {
        const parts: any[] = [];
        
        // Handle parts - 1. User text
        parts.push({ text: m.text || "" });

        // Handle parts - 2. Multi-modal attachments if present
        if (m.attachments && Array.isArray(m.attachments)) {
          for (const att of m.attachments) {
            let b64Data = att.data;
            if (b64Data && b64Data.includes("base64,")) {
              b64Data = b64Data.split("base64,")[1];
            }
            if (b64Data) {
              parts.push({
                inlineData: {
                  mimeType: att.mimeType,
                  data: b64Data
                }
              });
            }
          }
        }

        return {
          role: m.role === "user" ? "user" : "model",
          parts: parts
        };
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini route error:", err);
      res.status(500).json({ error: err.message || "Internal server error during chat." });
    }
  });

  // ========================================================
  // DATABASE AND BATTLE ENGINE SYSTEM (DYNAMIC CO-PRESENCE)
  // ========================================================

  const QUESTIONS_FILE = path.join(process.cwd(), "questions.json");

  // Initial standard seed questions corresponding to high-quality Bangla curriculum syllabus
  const INITIAL_QUESTIONS = [
    {
      id: "phy-01",
      subject: "পদার্থবিজ্ঞান",
      chapter: "ভৌত জগৎ ও পরিমাপ",
      questionText: "কোনটি সিস্টেমেটিক ত্রুটির অন্তর্ভুক্ত নয়?",
      options: [
        "যন্ত্রের ব্যক্তিগত ত্রুটি",
        "যান্ত্রিক ত্রুটি",
        "পদ্ধতিগত ত্রুটি",
        "ব্যক্তিগত পর্যবেক্ষণ বা অনিয়মিত ত্রুটি"
      ],
      correctIndex: 3,
      explanation: "অনিয়মিত বা দৈব ত্রুটি (Random errors) গুলো সিস্টেমেটিক বা পদ্ধতিগত ত্রুটির অন্তর্ভুক্ত নয়।"
    },
    {
      id: "phy-02",
      subject: "পদার্থবিজ্ঞান",
      chapter: "ভেক্টর",
      questionText: "দুটি সমমানের ভেক্টরের লব্ধির মান তাদের যেকোনো একটির মানের সমান হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?",
      options: ["60°", "90°", "120°", "180°"],
      correctIndex: 2,
      explanation: "R^2 = P^2 + Q^2 + 2PQ cosθ সূত্রনুসারে θ = 120° হয়।"
    },
    {
      id: "phy-03",
      subject: "পদার্থবিজ্ঞান",
      chapter: "নিউটনিয়ান বলবিদ্যা",
      questionText: "রকেটের গতি কোন নীতির ওপর ভিত্তি করে কাজ করে?",
      options: [
        "ভরের নিত্যতা সূত্র",
        "শক্তির নিত্যতা সূত্র",
        "রৈখিক ভরবেগের সংরক্ষণ সূত্র",
        "কৌণিক ভরবেগের সংরক্ষণ সূত্র"
      ],
      correctIndex: 2,
      explanation: "রকেটের গ্যাস নির্গমণ রৈখিক ভরবেগের সংরক্ষণ নীতি অনুযায়ী রকেটকে প্রচণ্ড গতিতে সামনে চালিত করে।"
    },
    {
      id: "chem-01",
      subject: "রসায়ন",
      chapter: "গুণগত রসায়ন",
      questionText: "কোন অরবিটালের শক্তি সবচেয়ে কম?",
      options: ["3d", "4s", "4p", "4f"],
      correctIndex: 1,
      explanation: "n+l নিয়মে: 3d এর মান ৫ এবং 4s এর মান ৪। তাই 4s এর শক্তি কম।"
    },
    {
      id: "chem-02",
      subject: "রসায়ন",
      chapter: "গুণগত রসায়ন",
      questionText: "সাধারণ রক্তরসে pH-এর মান কত থাকে?",
      options: ["7.00 - 7.20", "7.35 - 7.45", "6.50 - 7.00", "7.80 - 8.00"],
      correctIndex: 1,
      explanation: "মানুষের রক্তের pH স্বাভাবিক অবস্থায় ৭.৩৫ থেকে ৭.৪৫ পর্যন্ত থাকে।"
    },
    {
      id: "bng-01",
      subject: "বাংলা",
      chapter: "বাংলা প্রথম পত্র - অপরিচিতা",
      questionText: "'অপরিচিতা' গল্পে অনুপমের আসল অভিভাবক কে ছিলেন?",
      options: ["অনুপমের মা", "অনুপম নিজে", "অনুপমের মামা", "অনুপমের পিসা"],
      correctIndex: 2,
      explanation: "'অপরিচিতা' গল্পে অনুপমের অভিভাবক বা সাংসারিক সর্বময় ক্ষমতার অধিকারী ছিলেন তার মামা।"
    },
    {
      id: "eng-01",
      subject: "English",
      chapter: "Right Forms of Verbs",
      questionText: "Choose the correct sentence:",
      options: [
        "He speaks as if he knew everything.",
        "He speaks as if he knows everything.",
        "He speaks as if he has known everything.",
        "He speaks as if he would know everything."
      ],
      correctIndex: 0,
      explanation: "After 'as if' preceding simple present clause leads to subjuntive simple past."
    },
    {
      id: "ict-01",
      subject: "আইসিটি",
      chapter: "সংখ্যা পদ্ধতি",
      questionText: "হেক্সাডেসিমেল সংখ্যা পদ্ধতির বেস বা ভিত্তি কত?",
      options: ["2", "8", "10", "16"],
      correctIndex: 3,
      explanation: "Hexadecimal এ ১৬টি প্রতীক ব্যবহৃত হয় বিধায় এর ভিত্তি ১৬।"
    },
    {
      id: "ict-02",
      subject: "আইসিটি",
      chapter: "এইচটিএমএল (HTML)",
      questionText: "এইচটিএমএল-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?",
      options: ["<h6>", "<h1>", "<head>", "<header>"],
      correctIndex: 1,
      explanation: "HTML-এ সবচেয়ে বড় হেডিং সাইজ হলো h1।"
    },
    {
      id: "gk-01",
      subject: "সাধারণ জ্ঞান",
      chapter: "বাংলাদেশ বিষয়াবলী",
      questionText: "বাংলাদেশের সংবিধানের মূল ভিত্তি বা মূলনীতি কয়টি?",
      options: ["৩টি", "৪টি", "৫টি", "৬টি"],
      correctIndex: 1,
      explanation: "সংবিধানের প্রধান মূলনীতি বা স্তম্ভ ৪টি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা।"
    },
    {
      id: "gk-02",
      subject: "সাধারণ জ্ঞান",
      chapter: "মুক্তিযুদ্ধ",
      questionText: "মুজিবনগর সরকার কবে গঠিত হয়েছিল?",
      options: [
        "১০ এপ্রিল ১৯৭১",
        "১৭ এপ্রিল ১৯৭১",
        "৭ মার্চ ১৯৭১",
        "২৫ মার্চ ১৯৭১"
      ],
      correctIndex: 0,
      explanation: "১০ এপ্রিল ১৯৭১ সালে স্বাধীন বাংলাদেশ সরকার বা মুজিবনগর সরকার আনুষ্ঠানিকভাবে গঠিত হয়েছিল।"
    }
  ];

  function loadQuestions() {
    try {
      if (fs.existsSync(QUESTIONS_FILE)) {
        const raw = fs.readFileSync(QUESTIONS_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to read database questions:", e);
    }
    // write seed initially
    try {
      fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(INITIAL_QUESTIONS, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save seed questions:", err);
    }
    return INITIAL_QUESTIONS;
  }

  function writeQuestions(questionsList: any[]) {
    try {
      fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questionsList, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed write questions file:", e);
    }
  }

  // Active real-time multi-player battle rooms list
  let activeBattles: any[] = [];

  const SUBJECTS_LIST = [
    "পদার্থবিজ্ঞান ১ম পত্র", "রসায়ন ১ম পত্র", "জীববিজ্ঞান ১ম পত্র", "উচ্চতর গণিত ১ম পত্র", "English", "আইসিটি", "সাধারণ জ্ঞান"
  ];

  function generateRandomBattle(subject?: string) {
    const chosenSubject = subject || SUBJECTS_LIST[Math.floor(Math.random() * SUBJECTS_LIST.length)];
    const qDB = loadQuestions();
    
    // Filter questions if we have them, else take from seed
    const matchingQs = qDB.filter((q: any) => q.subject === chosenSubject);
    const chosenQs = matchingQs.length > 0
      ? matchingQs.sort(() => 0.5 - Math.random()).slice(0, 5)
      : qDB.sort(() => 0.5 - Math.random()).slice(0, 5);

    return {
      id: "btl-" + Math.floor(100 + Math.random() * 900),
      subject: chosenSubject,
      chapter: "সব অধ্যায়",
      totalQuestions: chosenQs.length || 5,
      secondsPerQuestion: 30,
      status: "open",
      maxPlayers: 2,
      players: [], // EMPTY initially, 100% honest and real!
      questions: chosenQs,
      createdAt: Date.now()
    };
  }

  function resetBattles() {
    activeBattles = [
      generateRandomBattle("পদার্থবিজ্ঞান ১ম পত্র"),
      generateRandomBattle("উচ্চতর গণিত ১ম পত্র")
    ];
  }
  resetBattles();


  // GET: load questions from JSON file database
  app.get("/api/db/questions", (req, res) => {
    const list = loadQuestions();
    res.json({ questions: list });
  });

  // POST: create & update questions (Admin update system requested)
  app.post("/api/db/questions", (req, res) => {
    try {
      const newOrUpdate = req.body;
      if (!newOrUpdate.questionText || !newOrUpdate.subject || !newOrUpdate.options) {
        return res.status(400).json({ error: "Required fields of MCQ are missing!" });
      }

      const list = loadQuestions();
      if (!newOrUpdate.id) {
        newOrUpdate.id = "dtb-" + Math.floor(1000 + Math.random() * 9000);
        list.unshift(newOrUpdate); // prepend new
      } else {
        const idx = list.findIndex((q: any) => q.id === newOrUpdate.id);
        if (idx > -1) {
          list[idx] = { ...list[idx], ...newOrUpdate };
        } else {
          list.unshift(newOrUpdate);
        }
      }

      writeQuestions(list);
      res.json({ success: true, question: newOrUpdate, questions: list });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE: delete a question from the database list
  app.delete("/api/db/questions/:id", (req, res) => {
    try {
      const qId = req.params.id;
      const list = loadQuestions();
      const updatedList = list.filter((q: any) => q.id !== qId);
      writeQuestions(updatedList);
      res.json({ success: true, questions: updatedList });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET: load active list of battle exam lobby rooms
  app.get("/api/db/battles", (req, res) => {
    res.json({ battles: activeBattles });
  });

  // POST: create a new battle room in the database
  app.post("/api/db/battles", (req, res) => {
    try {
      const { subject, chapter, totalQuestions, secondsPerQuestion, maxPlayers, players } = req.body;
      if (!subject || !chapter) {
        return res.status(400).json({ error: "Subject & chapter are required!" });
      }

      // Grab matching questions from our current questions DB or fallback
      const qDB = loadQuestions();
      const matchingQs = qDB.filter((q: any) => q.subject === subject || subject === "যেকোনো বিষয়");
      const chosenQs = matchingQs.length > 0 
        ? matchingQs.sort(() => 0.5 - Math.random()).slice(0, totalQuestions || 5)
        : qDB.sort(() => 0.5 - Math.random()).slice(0, totalQuestions || 5);

      const newBattle = {
        id: "btl-" + Math.floor(100 + Math.random() * 900),
        subject,
        chapter,
        totalQuestions: totalQuestions || chosenQs.length,
        secondsPerQuestion: secondsPerQuestion || 20,
        status: "open",
        maxPlayers: maxPlayers || 3,
        players: players || [],
        questions: chosenQs,
        createdAt: Date.now()
      };

      activeBattles.unshift(newBattle);
      res.json({ success: true, battle: newBattle, battles: activeBattles });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: join a battle room
  app.post("/api/db/battles/:id/join", (req, res) => {
    try {
      const bId = req.params.id;
      const { player } = req.body; // { id, name, avatarInitials }
      if (!player || !player.name) {
        return res.status(400).json({ error: "Player specifications are missing!" });
      }

      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(444).json({ error: "Battle Room not found!" });
      }

      // Check if already joined
      const existed = match.players.find((p: any) => p.id === player.id);
      if (existed) {
        return res.json({ success: true, battle: match, battles: activeBattles });
      }

      if (match.status !== "open") {
        return res.status(400).json({ error: "Battle has already started or finished!" });
      }

      if (match.players.length >= match.maxPlayers) {
        return res.status(400).json({ error: "রুমটি ইতিমধ্যে সফলভাবে পূর্ণ হয়ে গিয়েছে!" });
      }

      match.players.push({
        id: player.id,
        name: player.name,
        score: 0,
        avatarInitials: player.avatarInitials || player.name[0],
        isReady: true,
        shout: "",
        answers: {}
      });

      res.json({ success: true, battle: match, battles: activeBattles });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: start a battle room manually
  app.post("/api/db/battles/:id/start", (req, res) => {
    try {
      const bId = req.params.id;
      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(404).json({ error: "Battle Room not found!" });
      }

      if (match.players.length < match.maxPlayers) {
        return res.status(400).json({ error: "সব কয়জন প্রতিযোগী এখনও রুমটিতে যুক্ত হননি!" });
      }

      match.status = "active";
      res.json({ success: true, battle: match, battles: activeBattles });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: update live score during gameplay
  app.post("/api/db/battles/:id/update-score", (req, res) => {
    try {
      const bId = req.params.id;
      const { playerId, score, currentQIdx } = req.body;
      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(404).json({ error: "Battle Room not found!" });
      }

      const pIdx = match.players.findIndex((p: any) => p.id === playerId);
      if (pIdx > -1) {
        match.players[pIdx].score = score;
        match.players[pIdx].currentQIdx = currentQIdx;
      }
      res.json({ success: true, battle: match });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: shout inside the waiting lobby
  app.post("/api/db/battles/:id/shout", (req, res) => {
    try {
      const bId = req.params.id;
      const { playerId, shout } = req.body;
      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(404).json({ error: "Battle Room not found!" });
      }

      const pIdx = match.players.findIndex((p: any) => p.id === playerId);
      if (pIdx > -1) {
        match.players[pIdx].shout = shout;
        // Auto reset shout after 6 seconds to avoid sticky speech bubbles
        setTimeout(() => {
          const freshMatch = activeBattles.find(b => b.id === bId);
          if (freshMatch) {
            const player = freshMatch.players.find((p: any) => p.id === playerId);
            if (player && player.shout === shout) {
              player.shout = "";
            }
          }
        }, 6000);
      }
      res.json({ success: true, battle: match });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: submit score or end battle
  app.post("/api/db/battles/:id/submit", (req, res) => {
    try {
      const bId = req.params.id;
      const { playerId, score } = req.body;
      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(404).json({ error: "Battle Room not found!" });
      }

      const pIdx = match.players.findIndex((p: any) => p.id === playerId);
      if (pIdx > -1) {
        match.players[pIdx].score = score;
        match.players[pIdx].finished = true;
        if (!match.players[pIdx].finishedAt) {
          match.players[pIdx].finishedAt = Date.now();
        }
      }

      // If all players in room have finished, set status as completed
      const allDone = match.players.every((p: any) => p.finished === true || p.score > 0);
      if (allDone) {
        match.status = "completed";
      }

      res.json({ success: true, battle: match, battles: activeBattles });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: force complete a battle room (failsafe fallback for stuck users)
  app.post("/api/db/battles/:id/force-complete", (req, res) => {
    try {
      const bId = req.params.id;
      const match = activeBattles.find(b => b.id === bId);
      if (!match) {
        return res.status(404).json({ error: "Battle Room not found!" });
      }

      match.players.forEach((p: any) => {
        if (!p.finished) {
          p.finished = true;
          if (!p.finishedAt) {
            p.finishedAt = Date.now();
          }
        }
      });
      match.status = "completed";

      res.json({ success: true, battle: match, battles: activeBattles });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: Reset rooms
  app.post("/api/db/battles/reset", (req, res) => {
    resetBattles();
    res.json({ success: true, battles: activeBattles });
  });

  // Vite middleware for asset serving or static fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
