/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { 
  BookOpen, 
  Check, 
  X, 
  BookMarked,
  Search, 
  Sparkles, 
  Brain, 
  Timer,
  ChevronRight, 
  Info, 
  SlidersHorizontal, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  Trash2,
  GraduationCap,
  HelpCircle,
  HelpCircle as HelpIcon,
  XCircle,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Subject, Question, StudentStats } from "../types";
import { QUESTION_BANK } from "../data";

interface QuestionBankProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  questions?: Question[];
}

export default function QuestionBank({ stats, setStats, questions }: QuestionBankProps) {
  // Merge loaded database questions
  const dbQuestions = questions && questions.length > 0 ? questions : QUESTION_BANK;

  // Bookmarked questions state (synchronized via LocalStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("qoro_question_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (qId: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      try {
        localStorage.setItem("qoro_question_bookmarks", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save bookmarks:", err);
      }
      return updated;
    });
  };

  // Extract subjects dynamically
  const availableSubjects = useMemo(() => {
    const list = dbQuestions.map(q => q.subject as string);
    const unique = Array.from(new Set(list));
    // Sort beautifully
    const enumOrder = Object.values(Subject) as string[];
    return unique.sort((a, b) => {
      const idxA = enumOrder.indexOf(a);
      const idxB = enumOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [dbQuestions]);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);

  // Practice Modes: "practice" (Immediate Feedback) or "exam" (Silent timed board practice)
  const [practiceMode, setPracticeMode] = useState<"practice" | "exam">("practice");

  // Adjust selectedSubject if not empty initially
  useEffect(() => {
    if (availableSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [availableSubjects, selectedSubject]);

  // Track immediate practice answers
  const [answeredPracticeList, setAnsweredPracticeList] = useState<{ [qId: string]: number }>({});

  // ----------------------------------------------------
  // EXAM MODE STATES
  // ----------------------------------------------------
  const [examState, setExamState] = useState<"idle" | "running" | "ended">("idle");
  const [examSelections, setExamSelections] = useState<{ [qId: string]: number }>({});
  const [examTimeLimit, setExamTimeLimit] = useState<number>(10); // minutes
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const examTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [examResultStats, setExamResultStats] = useState<{
    correctCount: number;
    incorrectCount: number;
    skippedCount: number;
    accuracy: number;
    xpEarned: number;
    timeSpentStr: string;
  } | null>(null);

  // Chapters list dynamic filtering
  const chapters = useMemo(() => {
    const list = dbQuestions
      .filter(q => (q.subject as string) === selectedSubject)
      .map(q => q.chapter);
    return ["All", ...Array.from(new Set(list))];
  }, [selectedSubject, dbQuestions]);

  // Unique Sources / Boards dynamic filtering
  const sources = useMemo(() => {
    const list: string[] = [];
    dbQuestions
      .filter(q => (q.subject as string) === selectedSubject)
      .forEach((q: any) => {
        if (q.source && Array.isArray(q.source)) {
          q.source.forEach((s: string) => list.push(s));
        }
      });
    return ["All", ...Array.from(new Set(list))];
  }, [selectedSubject, dbQuestions]);

  // Master Filtered Questions
  const filteredQuestions = useMemo(() => {
    return dbQuestions.filter(q => {
      // 1. Subject constraint
      if ((q.subject as string) !== selectedSubject) return false;

      // 2. Chapter constraint
      if (selectedChapter !== "All" && q.chapter !== selectedChapter) return false;

      // 3. Source Board constraint
      if (selectedSource !== "All") {
        const qSources = (q as any).source || [];
        if (!qSources.includes(selectedSource)) return false;
      }

      // 4. Bookmarks toggled
      if (showOnlyBookmarks && !bookmarks.includes(q.id)) return false;

      // 5. Text Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const mainTextMatch = q.questionText.toLowerCase().includes(query);
        const explanationMatch = q.explanation.toLowerCase().includes(query);
        const optionsMatch = q.options.some(opt => opt.toLowerCase().includes(query));
        if (!mainTextMatch && !explanationMatch && !optionsMatch) return false;
      }

      return true;
    });
  }, [selectedSubject, selectedChapter, selectedSource, showOnlyBookmarks, bookmarks, searchQuery, dbQuestions]);

  // Reset chapter/source when subject shifts
  useEffect(() => {
    setSelectedChapter("All");
    setSelectedSource("All");
  }, [selectedSubject]);

  // Practice mode handler
  const handleSelectOptionPractice = (questionId: string, choiceIndex: number, correctIndex: number) => {
    if (answeredPracticeList[questionId] !== undefined) return;

    setAnsweredPracticeList(prev => ({ ...prev, [questionId]: choiceIndex }));
    const isCorrect = choiceIndex === correctIndex;

    // Award XP
    setStats(prev => {
      const xpReward = isCorrect ? 10 : 2;
      const newPoints = prev.points + xpReward;
      return {
        ...prev,
        points: newPoints,
        level: Math.floor(newPoints / 100) + 1,
        totalQuestionsSolved: prev.totalQuestionsSolved + 1
      };
    });
  };

  // ----------------------------------------------------
  // EXAM CONTROL FLOW
  // ----------------------------------------------------
  const startExamMode = () => {
    if (filteredQuestions.length === 0) {
      alert("উপযুক্ত প্রশ্ন পাওয়া যায়নি! অনুগ্রহ করে অন্য বিষয় বা অন্য অধ্যায় সিলেক্ট করে পরীক্ষা শুরু করো।");
      return;
    }
    setExamSelections({});
    setSecondsRemaining(examTimeLimit * 60);
    setExamState("running");
    setExamResultStats(null);

    if (examTimerRef.current) clearInterval(examTimerRef.current);
    examTimerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(examTimerRef.current!);
          evaluateExamAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const evaluateExamAnswers = () => {
    if (examTimerRef.current) clearInterval(examTimerRef.current);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    filteredQuestions.forEach(q => {
      const choice = examSelections[q.id];
      if (choice === undefined) {
        skippedCount++;
      } else if (choice === q.correctIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const accuracyVal = filteredQuestions.length > 0 
      ? Math.round((correctCount / filteredQuestions.length) * 100) 
      : 0;

    const xpReward = (correctCount * 12) + (accuracyVal >= 80 ? 30 : 0);
    const secsSpent = (examTimeLimit * 60) - secondsRemaining;
    const minSpent = Math.floor(secsSpent / 60);
    const secSpentRemaining = secsSpent % 60;
    const timeStr = `${minSpent} মিনিট ${secSpentRemaining} সেকেন্ড`;

    setExamResultStats({
      correctCount,
      incorrectCount,
      skippedCount,
      accuracy: accuracyVal,
      xpEarned: xpReward,
      timeSpentStr: timeStr
    });

    setStats(prev => {
      const totalPoints = prev.points + xpReward;
      return {
        ...prev,
        points: totalPoints,
        level: Math.floor(totalPoints / 100) + 1,
        examsGiven: prev.examsGiven + 1,
        totalQuestionsSolved: prev.totalQuestionsSolved + (filteredQuestions.length - skippedCount)
      };
    });

    setExamState("ended");
  };

  const resetExamMode = () => {
    setExamState("idle");
    setExamSelections({});
    setExamResultStats(null);
    if (examTimerRef.current) clearInterval(examTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, []);

  // Format time display
  const examTimerDisplay = useMemo(() => {
    const min = Math.floor(secondsRemaining / 60);
    const sec = secondsRemaining % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, [secondsRemaining]);

  // ----------------------------------------------------
  // INTELLIGENT AI TUTOR SIDE DRAWER
  // ----------------------------------------------------
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiDrawerQuestion, setAiDrawerQuestion] = useState<Question | null>(null);
  const [aiTutorResponse, setAiTutorResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const triggerAiTutor = async (q: Question) => {
    setAiDrawerQuestion(q);
    setAiDrawerOpen(true);
    setAiLoading(true);
    setAiTutorResponse("");

    const optionsListStr = q.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n");
    const aiPrompt = 
      `Explain the following MCQ professionally tailored for Bangladeshi HSC/Admission seekers.\n` +
      `Subject: ${q.subject}\n` +
      `Chapter: ${q.chapter}\n` +
      `Question: ${q.questionText}\n` +
      `Options:\n${optionsListStr}\n\n` +
      `The correct option index is ${q.correctIndex} (which means option letter matches index: 0=A, 1=B, 2=C, 3=D).\n` +
      `Generate a comprehensive study tutor explanation step-by-step using plain markdown and KaTeX equations ($inline$ or $$block$$ formatting as appropriate). ` +
      `Structure as follows: \n` +
      `1. **সঠিক উত্তর (Correct Answer)**: Clear identification of the winning option.\n` +
      `2. **মূল থিওরি বা সূত্র (Core Concept)**: Simple breakdown of the underlying Science/Math equation background.\n` +
      `3. **ধাপ-ভিত্তিক গণনা/ব্যাখ্যা (Step-by-step Solution)**: Detailed breakdown explaining clearly why this succeeds and why other options are incorrect.\n` +
      `4. **বিশেষ টিপস (Tutor Advice/Shortcuts)**: Tricks to answer this quickly under HSC Admission exam conditions. Keep response entirely in beautiful Bengali language.`;

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: aiPrompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiTutorResponse(data.text);
      } else {
        setAiTutorResponse("দুঃখিত, জেমিনি এআই সার্ভারে সংযোগ করা যায়নি। ডেমো মোডে জেমিনি সমাধান পেতে অনুগ্রহ করে API key সংযুক্ত করুন।");
      }
    } catch {
      setAiTutorResponse("টিউটর রেসপন্স ফেচ করতে ত্রুটি হয়েছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করো।");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. ACADEMIC HIGHLIGHT STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">টোটাল XP অর্জন</span>
            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              {stats.points} XP
            </h3>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>লেভেল {stats.level} পরীক্ষার্থী</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">মোট সলভ করা প্রশ্ন</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {stats.totalQuestionsSolved} MCQ
            </h3>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>সহপাঠীদের তুলনায় এগিয়ে আছো</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <BookMarked className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">প্রিয় প্রশ্ন সংকলন</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {bookmarks.length} টি
            </h3>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>ক্লিকের মাধ্যমে প্রাকটিস করো</span>
            </p>
          </div>
          <button 
            onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
              showOnlyBookmarks 
                ? "bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/40" 
                : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            }`}
          >
            <BookMarked className={`w-5 h-5 ${showOnlyBookmarks ? "fill-yellow-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC SUBJECT RAIL DECK */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              <span>এইচএসসি ও এডমিশন বোর্ড প্রশ্নব্যাংক</span>
            </h3>
            <p className="text-xs text-slate-400">
              সাবজেক্ট ও চ্যাপ্টার ওয়াইজ হাজারো বোর্ড প্রশ্নের নির্ভুল এআই সমাধান ও কাউন্টডাউন মক টেস্ট!
            </p>
          </div>

          {/* Mode Selector Toggle */}
          {examState !== "running" && (
            <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl flex items-center border border-slate-200/50 dark:border-slate-800/85">
              <button
                onClick={() => {
                  setPracticeMode("practice");
                  resetExamMode();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  practiceMode === "practice"
                    ? "bg-white dark:bg-slate-900 text-emerald-500 shadow-sm border border-slate-200/20 dark:border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>অনুশীলন মোড</span>
              </button>
              <button
                onClick={() => setPracticeMode("exam")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  practiceMode === "exam"
                    ? "bg-white dark:bg-slate-900 text-cyan-500 shadow-sm border border-slate-200/20 dark:border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>বোর্ড মক এক্সাম</span>
              </button>
            </div>
          )}
        </div>

        {/* Categories Rail List */}
        {examState !== "running" && (
          <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none border-b border-slate-100 dark:border-slate-800/60 mb-5">
            {availableSubjects.map((sub) => {
              const matchesSelected = selectedSubject === sub;
              // Extract question counts
              const subCount = dbQuestions.filter(q => q.subject === sub).length;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedChapter("All");
                    setSelectedSource("All");
                    resetExamMode();
                  }}
                  className={`px-4 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                    matchesSelected
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md transform scale-[1.02]"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-200/60 dark:border-slate-850"
                  }`}
                >
                  <span>{sub}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    matchesSelected ? "bg-slate-950 text-white" : "bg-slate-150 dark:bg-slate-800/80 text-slate-500 dark:text-zinc-400"
                  }`}>
                    {subCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. MULTI-LEVEL FILTER GRID */}
        {examState !== "running" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Search query box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ম্যাথ বা টপিক সার্চ করো..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-400 transition-colors"
              />
            </div>

            {/* Chapter Selection dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedChapter}
                onChange={e => setSelectedChapter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">সব অধ্যায় (All Chapters)</option>
                {chapters.filter(c => c !== "All").map((chap, idx) => (
                  <option key={idx} value={chap}>{chap}</option>
                ))}
              </select>
            </div>

            {/* Source/Board Selection dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSource}
                onChange={e => setSelectedSource(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">সব বোর্ড/উৎস (All Boards)</option>
                {sources.filter(s => s !== "All").map((src, idx) => (
                  <option key={idx} value={src}>{src}</option>
                ))}
              </select>
            </div>

            {/* Toggle show favorites */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                showOnlyBookmarks
                  ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookMarked className={`w-4 h-4 ${showOnlyBookmarks ? "fill-yellow-400 animate-pulse" : ""}`} />
              <span>প্রিয় তালিকায় সংকুচিত করো</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. PRACTICING MODE CORE VIEWPORT */}
      {practiceMode === "practice" ? (
        
        // --- 4.A PRACTICE LISTING VIEW ---
        filteredQuestions.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 shadow-sm max-w-3xl mx-auto">
            <BookOpen className="w-14 h-14 mx-auto text-slate-350 dark:text-slate-700 mb-4 animate-bounce" />
            <h4 className="text-base font-black text-slate-700 dark:text-slate-300">কোনো প্রাসঙ্গিক প্রশ্ন পাওয়া যায়নি!</h4>
            <p className="text-xs text-slate-450 mt-1 max-w-md mx-auto">
              অনুগ্রহ করে উপরের ফিল্টারিং স্লাইড বা সার্চের টেক্সট পরিবর্তন করো। তোমার আপলোড করা JSON ফাইলগুলো সাকসেসফুলি কানেক্টেড আছে।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs px-2 text-slate-400">
              <span>বর্তমানে প্রদর্শিত হচ্ছে: <strong>{filteredQuestions.length} টি MCQ প্রশ্ন</strong></span>
              <span>পরিশোধিত ডিজাইন ও চমৎকার সমাধান সমৃদ্ধ</span>
            </div>

            {filteredQuestions.map((q, idx) => {
              const userChoice = answeredPracticeList[q.id];
              const isAnswered = userChoice !== undefined;
              const isBookmarked = bookmarks.includes(q.id);

              return (
                <div 
                  key={q.id}
                  className={`bg-white dark:bg-slate-900 border p-6 rounded-3xl transition-all shadow-sm relative overflow-hidden ${
                    isAnswered 
                      ? userChoice === q.correctIndex 
                        ? "border-emerald-500/50 ring-2 ring-emerald-500/5 dark:ring-emerald-500/10 shadow-emerald-950/5" 
                        : "border-red-500/30 shadow-md"
                      : "border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-750"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/40 pb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 text-[10px] text-slate-450 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        প্রশ্ন {idx + 1}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {q.chapter}
                      </span>
                      {q.source && Array.isArray(q.source) && q.source.map((src: string, sIdx: number) => (
                        <span key={sIdx} className="bg-cyan-500/10 text-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {src}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Interactive bookmark toggle */}
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isBookmarked 
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                        title="প্রিয় তালিকায় রাখো"
                      >
                        <BookMarked className={`w-4 h-4 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      </button>

                      {/* AI integration solver */}
                      <button
                        onClick={() => triggerAiTutor(q)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[11px] font-black hover:brightness-105 transition-all flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950 animate-pulse" />
                        <span>এআই সলভার</span>
                      </button>
                    </div>
                  </div>

                  {/* MCQ Question and Parts Grid (Including diagrams!) */}
                  <div className="mb-5 space-y-4">
                    {q.questionParts && q.questionParts.length > 0 ? (
                      <div className="space-y-3.5">
                        {q.questionParts.map((part, pIdx) => {
                          if (part.type === "image" && part.url) {
                            return (
                              <div key={pIdx} className="w-full max-w-sm mx-auto bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850/50 flex flex-col items-center relative group">
                                <img 
                                  src={part.url} 
                                  alt="উদ্দীপক চিত্র / Diagram"
                                  className="rounded-xl w-auto max-h-56 object-contain shadow-sm referrerPolicy='no-referrer'"
                                />
                                <span className="absolute bottom-1 right-1 bg-slate-950/50 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded-md font-mono select-none">
                                  উদ্দীপক চিত্র {idx + 1}-{pIdx}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={pIdx} className="markdown-body font-sans text-sm sm:text-base text-slate-800 dark:text-slate-100 font-bold leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {part.content || ""}
                              </ReactMarkdown>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="markdown-body font-sans text-sm sm:text-base text-slate-800 dark:text-slate-100 font-bold leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {q.questionText}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Standard options list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = userChoice === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      let buttonStyle = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900";
                      let stateIcon = null;

                      if (isAnswered) {
                        if (isOptionCorrect) {
                          buttonStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-sm shadow-emerald-500/5";
                          stateIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
                        } else if (isOptionSelected) {
                          buttonStyle = "bg-red-500/15 border-red-500 text-red-800 dark:text-red-300 font-bold";
                          stateIcon = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
                        } else {
                          buttonStyle = "bg-slate-50/40 dark:bg-slate-950/40 border-slate-100 dark:border-slate-900/60 text-slate-400 dark:text-slate-700 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOptionPractice(q.id, optIdx, q.correctIndex)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer ${buttonStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-3xl flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isOptionCorrect && isAnswered 
                                ? "bg-emerald-500 text-white" 
                                : isOptionSelected && isAnswered 
                                  ? "bg-red-500 text-white" 
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-450"
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <div className="leading-relaxed font-semibold">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {opt}
                              </ReactMarkdown>
                            </div>
                          </div>
                          {stateIcon}
                        </button>
                      );
                    })}
                  </div>

                  {/* Diagnostic step-by-step math explanation popup loaded with KaTeX equations */}
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-350 leading-relaxed space-y-2"
                    >
                      <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-bold border-b border-slate-150 dark:border-slate-850 pb-2 mb-2">
                        <HelpCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>বিস্তারিত সমাধান ও ডায়াগনস্টিক ফিডব্যাক (Diagnostic Formula Explanation)</span>
                      </div>
                      <div className="markdown-body text-xs leading-relaxed space-y-1">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {q.explanation}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        
        // --- 4.B BOARD EXAM MODE VIEW ---
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          
          {/* LOBBY WELCOME VIEW */}
          {examState === "idle" && (
            <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                <Timer className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                  এইচএসসি অধ্যায়ভিত্তিক বোর্ড পরীক্ষা সিমুলেটর
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  বাস্তব বোর্ড পরীক্ষার মতো নির্দিষ্ট সময়ের মধ্যে ও কোনো সমাধান দেখা ছাড়া নীরবে পরীক্ষা দেওয়া। পরীক্ষা শেষে নির্ভুল বিশ্লেষণ, সঠিকতা, এবং XP পুরস্কার বুঝে নাও!
                </p>
              </div>

              {/* Exam specs config */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-850 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">পরীক্ষার সময়সীমা</label>
                    <select
                      value={examTimeLimit}
                      onChange={e => setExamTimeLimit(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value={3}>৩ মিনিট (দ্রুত প্র্যাক্টিস)</option>
                      <option value={5}>৫ মিনিট</option>
                      <option value={10}>১০ মিনিট</option>
                      <option value={20}>২০ মিনিট</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">মোট উপলব্ধ বোর্ড প্রশ্ন</label>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-350 font-black">
                      {filteredQuestions.length} টি MCQ
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100/50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850 p-3.5 rounded-2xl text-[11px] text-slate-450 leading-relaxed flex gap-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-650 dark:text-slate-300">গুরুত্বপূর্ণ নির্দেশনা:</span>
                    <p className="mt-0.5">১. একবার পরীক্ষা শুরু হলে ঘড়ি পেছানো বা পজ করা যাবে না।</p>
                    <p>২. প্রতিটি সঠিক উত্তরের জন্য <strong className="text-emerald-400">+12 XP</strong> এবং ৮০%+ সঠিকতায় কাস্টম বোনাস XP প্রদান করা হবে।</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={startExamMode}
                  disabled={filteredQuestions.length === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow-md shadow-cyan-950/10 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                >
                  পরীক্ষায় অংশ নাও এবং প্রস্তুতি ঝালিয়ে নাও
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC RUNNING EXAM SHEETS */}
          {examState === "running" && (
            <div className="space-y-6">
              
              {/* Exam floating metadata stick */}
              <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center z-15 shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">সহযোগিতা ও লড়াই</span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">{selectedSubject} - মক এক্সাম</h4>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-850">
                  <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm font-mono font-black text-cyan-400">{examTimerDisplay}</span>
                </div>
              </div>

              {/* Solved Progress marker bar */}
              <div className="space-y-1 text-[10px] text-slate-400 font-bold uppercase">
                <div className="flex justify-between">
                  <span>সলভড প্রগ্রেস</span>
                  <span>{Object.keys(examSelections).length} / {filteredQuestions.length} সম্পন্ন</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-200" 
                    style={{ width: `${(Object.keys(examSelections).length / filteredQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stacked Sheet questions */}
              <div className="space-y-6">
                {filteredQuestions.map((q, idx) => {
                  const selChoice = examSelections[q.id];
                  const qIsBookmarked = bookmarks.includes(q.id);

                  return (
                    <div key={q.id} className="bg-slate-50 dark:bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-850 relative">
                      
                      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-850 pb-3 mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 text-[10px] text-slate-450 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            এমসিকিউ কোশ্চেন {idx + 1}
                          </span>
                          <span className="bg-cyan-500/10 text-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {q.chapter}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            qIsBookmarked 
                              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" 
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-400"
                          }`}
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display Question Stem / Diagram image links */}
                      <div className="mb-4 space-y-3">
                        {q.questionParts && q.questionParts.length > 0 ? (
                          <div className="space-y-3">
                            {q.questionParts.map((part, pIdx) => {
                              if (part.type === "image" && part.url) {
                                return (
                                  <div key={pIdx} className="w-full max-w-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-250 dark:border-slate-850/50 flex flex-col items-center">
                                    <img src={part.url} alt="MCQ Stimulus Drawing" className="rounded-lg max-h-44 object-contain referrerPolicy='no-referrer'" />
                                  </div>
                                );
                              }
                              return (
                                <div key={pIdx} className="markdown-body font-sans text-sm text-slate-800 dark:text-slate-100 font-bold leading-relaxed">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {part.content || ""}
                                  </ReactMarkdown>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="markdown-body font-sans text-sm text-slate-800 dark:text-slate-100 font-bold leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {q.questionText}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Quiet choices grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selChoice === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setExamSelections(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-400"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850/50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shrink-0 ${
                                  isSelected ? "bg-cyan-500 text-slate-950 font-black" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <div className="leading-snug">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {opt}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit panel */}
              <div className="text-center pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={evaluateExamAnswers}
                  className="px-10 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.01] active:scale-95 shadow-md shadow-emerald-900/10 hover:brightness-105 cursor-pointer"
                >
                  উত্তর জমা দিন ও মূল্যায়ন দেখুন
                </button>
              </div>
            </div>
          )}

          {/* DETAILED RESULTS DASHBOARD REPORT */}
          {examState === "ended" && examResultStats && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Glorious scoreboard cards */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">
                  বোর্ড পরীক্ষার ফলাফল কার্ড (Exam Summary)
                </h4>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-6">
                  {selectedSubject} - {filteredQuestions.length || 0} টি বোর্ড প্রশোত্তর পর্যালোচনা
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">সঠিক উত্তর</span>
                    <span className="text-xl font-black text-emerald-500">{examResultStats.correctCount} টি</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ভুল উত্তর</span>
                    <span className="text-xl font-black text-red-500">{examResultStats.incorrectCount} টি</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">সঠিকতার হার</span>
                    <span className="text-xl font-black text-cyan-400">{examResultStats.accuracy}%</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">XP রিওয়ার্ড</span>
                    <span className="text-xl font-black text-yellow-500">+{examResultStats.xpEarned} XP</span>
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-slate-450 font-bold">
                  পরীক্ষা সম্পন্ন করতে সময় নিয়েছ: <strong className="text-slate-700 dark:text-slate-350">{examResultStats.timeSpentStr}</strong>
                </div>

                <div className="pt-5 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={resetExamMode}
                    className="px-6 py-2.5 bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-350 hover:bg-slate-300 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    নতুন পরীক্ষা দাও
                  </button>
                  <button
                    onClick={() => {
                      setPracticeMode("practice");
                      resetExamMode();
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl transition-all hover:brightness-105 cursor-pointer"
                  >
                    অনুশীলন মোডে ফিরে যাও
                  </button>
                </div>
              </div>

              {/* Solution worksheet review lists */}
              <div className="space-y-5">
                <h5 className="text-sm font-black text-slate-700 dark:text-slate-200 border-l-4 border-cyan-500 pl-3">
                  পরীক্ষায় আসা প্রশ্নোত্তর সমূহ এবং সঠিক ব্যাখ্যা (Diagnostic Work Sheet)
                </h5>

                <div className="space-y-6">
                  {filteredQuestions.map((q, idx) => {
                    const chosen = examSelections[q.id];
                    const choiceIsCorrect = chosen === q.correctIndex;

                    return (
                      <div 
                        key={q.id}
                        className={`bg-slate-50 dark:bg-slate-950/60 p-5 rounded-3xl border ${
                          chosen === undefined
                            ? "border-amber-500/30"
                            : choiceIsCorrect
                              ? "border-emerald-500/30 shadow-sm"
                              : "border-red-500/30"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2.5 py-0.5 rounded-lg text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                            প্রশ্ন {idx + 1}
                          </span>
                          
                          {chosen === undefined ? (
                            <span className="text-[10px] text-amber-500 font-bold">উত্তরিত হয়নি (Skipped)</span>
                          ) : choiceIsCorrect ? (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> সঠিক হয়েছে (Correct)
                            </span>
                          ) : (
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> ভুল হয়েছে (Wrong)
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="markdown-body font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-bold leading-normal mb-3.5">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {q.questionText}
                          </ReactMarkdown>
                        </div>

                        {/* Options overview list */}
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrectOpt = optIdx === q.correctIndex;
                            const isSelectedOpt = optIdx === chosen;

                            let optStyle = "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-150 dark:border-zinc-800";
                            if (isCorrectOpt) {
                              optStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-bold";
                            } else if (isSelectedOpt) {
                              optStyle = "bg-red-500/10 border-red-400/50 text-red-700 dark:text-red-400 font-bold";
                            }

                            return (
                              <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${optStyle}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isCorrectOpt ? "bg-emerald-500 text-white" : isSelectedOpt ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <div className="leading-snug font-semibold">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {opt}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Solution mathematical explanations */}
                        <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-205 dark:border-zinc-850 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-850 dark:text-slate-200 block mb-1">বিশ্লেষণ ও উত্তর:</span>
                          <div className="markdown-body text-[11px] leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {q.explanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SLIDE-OVER DRAWER (INTELLIGENT AI ACADEMIC TUTOR)
          ======================================================== */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="ai-drawer-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Drawer blurred glass overlay backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setAiDrawerOpen(false)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-lg transition-transform transform duration-300">
                <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl relative border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white">
                  
                  {/* Glowing header indicators */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex items-center justify-between relative">
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                    
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span>Study Qoro AI Coach</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">এইচএসসি এআই শিক্ষক</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setAiDrawerOpen(false)}
                      className="p-2 rounded-xl bg-slate-150 dark:bg-slate-850 hover:bg-slate-204 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {aiDrawerQuestion && (
                      <div className="space-y-5">
                        
                        {/* Reference specs indicators */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-850 text-xs">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">প্রশ্ন টীকা (Problem context)</span>
                          <span className="font-extrabold text-emerald-500 dark:text-emerald-400">{aiDrawerQuestion.subject}</span>
                          <span className="mx-1.5 text-slate-300">•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-350">{aiDrawerQuestion.chapter}</span>
                        </div>

                        {/* Active Problem rendering */}
                        <div className="space-y-3 font-sans font-bold leading-relaxed text-sm sm:text-base border-b border-slate-100 dark:border-slate-800/40 pb-5 text-slate-800 dark:text-zinc-100">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {aiDrawerQuestion.questionText}
                          </ReactMarkdown>

                          {aiDrawerQuestion.imageUrl && (
                            <div className="pt-2 w-auto max-w-xs bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-850 flex justify-center">
                              <img src={aiDrawerQuestion.imageUrl} alt="Tutor Diagram" className="rounded-lg object-contain max-h-40 referrerPolicy='no-referrer'" />
                            </div>
                          )}
                        </div>

                        {/* Solve loading state */}
                        {aiLoading ? (
                          <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <span className="relative flex h-10 w-10">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-10 w-10 bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-slate-950 fill-current animate-pulse" />
                              </span>
                            </span>
                            <div className="text-center space-y-1">
                              <p className="text-xs font-black text-slate-700 dark:text-slate-250">বোর্ড প্রশ্ন বিশ্লেষণ করে সলিউশন প্রস্তুত করা হচ্ছে...</p>
                              <p className="text-[10px] text-slate-400">জেমিনী থিংকিং ও সলভিং মেকানিজম যুক্ত হচ্ছে ৩.৫ ফ্ল্যাশ গেটওয়েতে</p>
                            </div>
                          </div>
                        ) : (
                          
                          // Solutions payload returned from Gemin API with KaTeX support!
                          <div className="space-y-4">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              <div className="markdown-body space-y-3">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {aiTutorResponse || "সমাধান বিবরণী পড়া যায়নি। দয়া করে আবার চেষ্টা করুন।"}
                                </ReactMarkdown>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 text-[10px] text-cyan-400/80 bg-cyan-500/5 p-3 rounded-xl border border-cyan-500/10 leading-normal">
                              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>এই সমাধানটি Study Qoro AI ও কাস্টম HSC কারিকুলাম দ্বারা চালিত। তোমার পড়াশোনায় কোনো নির্দিষ্ট জিজ্ঞাসা থাকলে "Chorcha AI" ট্যাবে এসে সরাসরি জিজ্ঞেস করতে পারো!</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
