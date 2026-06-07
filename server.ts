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

function toBengaliDigits(numStr: string): string {
  const digits: { [key: string]: string } = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
  };
  return numStr.split("").map(char => digits[char] || char).join("");
}

function inferFromPath(filePath: string): { subject: string; chapter: string } {
  // Normalize path and remove base directory
  const relative = path.relative(path.join(process.cwd(), "uploaded_questions"), filePath);
  const parts = relative.split(path.sep).map(p => p.toLowerCase());
  
  let mappedSubject = "";
  let mappedChapter = "";
  
  // Look for subject keywords in path parts
  for (const part of parts) {
    if (part.includes("phy1st") || part.includes("physics1st") || part === "phy1") {
      mappedSubject = "পদার্থবিজ্ঞান ১ম পত্র";
    } else if (part.includes("phy2nd") || part.includes("physics2nd") || part === "phy2") {
      mappedSubject = "পদার্থবিজ্ঞান ২য় পত্র";
    } else if (part === "phy" || part === "physics") {
      mappedSubject = "পদার্থবিজ্ঞান";
    } else if (part.includes("chem1st") || part.includes("chm1st") || part.includes("chemistry1st") || part === "chem1") {
      mappedSubject = "রসায়ন ১ম পত্র";
    } else if (part.includes("chem2nd") || part.includes("chm2nd") || part.includes("chemistry2nd") || part === "chem2") {
      mappedSubject = "রসায়ন ২য় পত্র";
    } else if (part === "chem" || part === "chemistry" || part === "chm") {
      mappedSubject = "রসায়ন";
    } else if (part.includes("math1st") || part.includes("mth1st") || part.includes("highermath1st") || part === "math1") {
      mappedSubject = "উচ্চতর গণিত ১ম পত্র";
    } else if (part.includes("math2nd") || part.includes("mth2nd") || part.includes("highermath2nd") || part === "math2") {
      mappedSubject = "উচ্চতর গণিত ২য় পত্র";
    } else if (part === "math" || part === "highermath" || part === "mth") {
      mappedSubject = "উচ্চতর গণিত";
    } else if (part.includes("bio1st") || part.includes("biology1st") || part === "bio1") {
      mappedSubject = "জীববিজ্ঞান ১ম পত্র";
    } else if (part.includes("bio2nd") || part.includes("biology2nd") || part === "bio2") {
      mappedSubject = "জীববিজ্ঞান ২য় পত্র";
    } else if (part === "bio" || part === "biology") {
      mappedSubject = "জীববিজ্ঞান";
    } else if (part === "ict" || part === "computer") {
      mappedSubject = "আইসিটি";
    } else if (part === "gk" || part === "general_knowledge" || part.includes("general")) {
      mappedSubject = "সাধারণ জ্ঞান";
    } else if (part === "bng" || part === "bangla" || part.includes("bangla")) {
      mappedSubject = "বাংলা";
    } else if (part === "eng" || part === "english") {
      mappedSubject = "English";
    }
    
    // Look for chapter keywords (e.g. ch1, ch2, chapter1, etc)
    const chMatch = part.match(/(?:ch|chapter|chap|part|অধ্যায়|অধ্যায়)\s*(-?\d+)/i);
    if (chMatch) {
      const num = chMatch[1];
      mappedChapter = `অধ্যায় ${toBengaliDigits(num)}`;
    }
  }
  
  return { subject: mappedSubject, chapter: mappedChapter };
}

function getJsonFilesRecursive(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
         results = results.concat(getJsonFilesRecursive(fullPath));
      } else if (file.endsWith(".json")) {
         results.push(fullPath);
      }
    });
  } catch (err) {
    console.error("Error walking directory:", err);
  }
  return results;
}

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
    let baseQuestions: any[] = [];
    try {
      if (fs.existsSync(QUESTIONS_FILE)) {
        const raw = fs.readFileSync(QUESTIONS_FILE, "utf-8");
        baseQuestions = JSON.parse(raw);
      } else {
        baseQuestions = [...INITIAL_QUESTIONS];
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(baseQuestions, null, 2), "utf-8");
      }
    } catch (e) {
      console.error("Failed to read database questions:", e);
      baseQuestions = [...INITIAL_QUESTIONS];
    }

    const uploadedFolder = path.join(process.cwd(), "uploaded_questions");
    if (!fs.existsSync(uploadedFolder)) {
      try {
        fs.mkdirSync(uploadedFolder, { recursive: true });
        // Create an empty fallback readme details inside it
        fs.writeFileSync(
          path.join(uploadedFolder, ".gitkeep"),
          "Placeholder file for dynamic JSON questions. Upload questions inside subdirectories e.g., hsc/phy1st/ch1/quantum.json."
        );
      } catch (err) {
        console.error("Failed to create uploaded_questions directory:", err);
      }
    }

    const uploadedFiles = getJsonFilesRecursive(uploadedFolder);
    const uploadedQuestions: any[] = [];

    uploadedFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, "utf-8");
        if (!content.trim()) return;
        const parsed = JSON.parse(content);
        const pathInferences = inferFromPath(file);

        const extractCorrectIndex = (answerText: string, optsArray: any[]): number => {
          if (!answerText) return 0;
          const text = answerText.toLowerCase().trim();
          
          // Explicit check for common Bengali option matching
          if (text.includes("উত্তরঃখ") || text.includes("উত্তর: খ") || text.includes("উত্তর খ") || text.includes("উত্তরঃ খ") || text.includes("হল খ") || text.includes("হল **খ")) return 1;
          if (text.includes("উত্তরঃখ") || text.includes("উত্তর:খ") || text.includes("উত্তর খ")) return 1;
          if (text.includes("উত্তরঃগ") || text.includes("উত্তর: গ") || text.includes("উত্তর গ") || text.includes("উত্তরঃ গ") || text.includes("হল গ") || text.includes("হল **গ")) return 2;
          if (text.includes("উত্তরঃগ") || text.includes("উত্তর:গ") || text.includes("উত্তর গ")) return 2;
          if (text.includes("উত্তরঃঘ") || text.includes("উত্তর: ঘ") || text.includes("উত্তর ঘ") || text.includes("উত্তরঃ ঘ") || text.includes("হল ঘ") || text.includes("হল **ঘ")) return 3;
          if (text.includes("উত্তরঃঘ") || text.includes("উত্তর:ঘ") || text.includes("উত্তর ঘ")) return 3;
          if (text.includes("উত্তরঃক") || text.includes("উত্তর: ক") || text.includes("উত্তর ক") || text.includes("উত্তরঃ ক") || text.includes("হল ক") || text.includes("হল **ক")) return 0;
          if (text.includes("উত্তরঃক") || text.includes("উত্তর:ক") || text.includes("উত্তর ক")) return 0;

          // English equivalents
          if (text.includes("answer: b") || text.includes("correct answer: b") || text.includes("answer is b") || text.includes("উত্তর হল b") || text.includes("উত্তর হল **b") || text.includes("উত্তর: b") || text.includes("হল **b")) return 1;
          if (text.includes("answer: c") || text.includes("correct answer: c") || text.includes("answer is c") || text.includes("উত্তর হল c") || text.includes("উত্তর হল **c") || text.includes("উত্তর: c") || text.includes("হল **c")) return 2;
          if (text.includes("answer: d") || text.includes("correct answer: d") || text.includes("answer is d") || text.includes("উত্তর হল d") || text.includes("উত্তর হল **d") || text.includes("উত্তর: d") || text.includes("হল **d")) return 3;
          if (text.includes("answer: a") || text.includes("correct answer: a") || text.includes("answer is a") || text.includes("উত্তর হল a") || text.includes("উত্তর হল **a") || text.includes("উত্তর: a") || text.includes("হল **a")) return 0;

          // Search for first bold letter in answers like "**খ.**" or "**b**"
          const boldMatch = text.match(/\*\*(a|b|c|d|ক|খ|গ|ঘ)\b/i);
          if (boldMatch) {
            const char = boldMatch[1];
            if (char === "a" || char === "ক") return 0;
            if (char === "b" || char === "খ") return 1;
            if (char === "c" || char === "গ") return 2;
            if (char === "d" || char === "ঘ") return 3;
          }

          // Try checking options labels
          for (let i = 0; i < optsArray.length; i++) {
            const lbl = optsArray[i] && optsArray[i].label ? optsArray[i].label.toString().toLowerCase().trim() : "";
            if (lbl && (text.includes(`উত্তরঃ ${lbl}`) || text.includes(`উত্তর হল ${lbl}`) || text.includes(`উত্তর: ${lbl}`) || text.includes(`হল **${lbl}`) || text.includes(`**${lbl}**`))) {
              return i;
            }
          }

          return 0; // Default fallback representation
        };

        const addQuestionSafely = (q: any) => {
          if (!q || typeof q !== "object") return;
          
          // Fill in missing properties from file path inferences
          if (!q.subject && pathInferences.subject) {
            q.subject = pathInferences.subject;
          }
          if (!q.chapter && pathInferences.chapter) {
            q.chapter = pathInferences.chapter;
          }
          
          // Fallback to defaults if still missing
          if (!q.subject) q.subject = "পদার্থবিজ্ঞান";
          if (!q.chapter) q.chapter = "অধ্যায় ১";

          // Parse question parts to construct fallback full question text
          if (q.question_parts && Array.isArray(q.question_parts)) {
            q.questionParts = q.question_parts; // preserve the rich parts
            const partTexts = q.question_parts
              .filter((p: any) => p && p.type === "text" && p.content)
              .map((p: any) => p.content);
            if (!q.questionText && partTexts.length > 0) {
              q.questionText = partTexts.join("\n");
            }
            // If there's an image in parts, store it as q.imageUrl
            const imgPart = q.question_parts.find((p: any) => p && p.type === "image" && p.url);
            if (imgPart && !q.imageUrl) {
              q.imageUrl = imgPart.url;
            }
          }

          if (!q.questionText) q.questionText = "প্রশ্ন টেক্সট পাওয়া যায়নি";

          // Parse Option objects to flat string list
          if (q.options && Array.isArray(q.options)) {
            const firstOptIsObj = q.options.length > 0 && typeof q.options[0] === "object" && q.options[0] !== null;
            if (firstOptIsObj) {
              q.richOptions = [...q.options]; // Save rich objects structure
              q.options = q.options.map((opt: any) => opt.text || opt.image_url || "");
            }
          }

          if (!q.options || !Array.isArray(q.options)) {
            q.options = ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"];
          }

          // Extract correctIndex from answer text
          if (typeof q.correctIndex !== "number") {
            if (q.answer) {
              q.correctIndex = extractCorrectIndex(q.answer, q.richOptions || []);
            } else {
              q.correctIndex = 0;
            }
          }

          // Move rich answer text to explanation field if empty
          if (q.answer && !q.explanation) {
            q.explanation = q.answer;
          }

          if (!q.explanation) q.explanation = "কোনো ব্যাখ্যা পাওয়া যায়নি।";

          // Generate stable and human-readable ID if not exists
          if (!q.id) {
            const cleanSub = q.subject.replace(/\s+/g, "-");
            const cleanChap = q.chapter.replace(/\s+/g, "-");
            q.id = `upl-${cleanSub}-${cleanChap}-${Math.floor(Math.random() * 1000000)}`;
          }

          uploadedQuestions.push(q);
        };

        if (Array.isArray(parsed)) {
          parsed.forEach(addQuestionSafely);
        } else if (parsed && typeof parsed === "object") {
          if (parsed.questions && Array.isArray(parsed.questions)) {
            parsed.questions.forEach(addQuestionSafely);
          } else {
            addQuestionSafely(parsed);
          }
        }
      } catch (err) {
        console.error(`Error parsing uploaded JSON file ${file}:`, err);
      }
    });

    if (uploadedQuestions.length > 0) {
      console.log(`Successfully parsed and loaded ${uploadedQuestions.length} dynamic questions from uploaded_questions directory.`);
    }

    // Merge them! Let's ensure no ID duplicates, prioritizing uploaded questions if IDs collide.
    const mergedMap = new Map<string, any>();
    baseQuestions.forEach((q: any) => {
      if (q && q.id) mergedMap.set(q.id, q);
    });
    uploadedQuestions.forEach((q: any) => {
      if (q && q.id) mergedMap.set(q.id, q);
    });

    return Array.from(mergedMap.values());
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
