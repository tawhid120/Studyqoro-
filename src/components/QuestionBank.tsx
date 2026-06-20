/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  BookOpen, Check, X, BookMarked, Search, Sparkles, Brain, Timer, 
  ChevronRight, Info, AlertCircle, CheckCircle2, Clock, Maximize2, 
  Trash2, GraduationCap, HelpCircle, XCircle, Target,
  Moon, Bell, UserCircle, LayoutDashboard, PenTool, Trophy, Sword, 
  FileText, User, SlidersHorizontal, Printer, PlayCircle, ChevronDown, ChevronUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bangla1stMCQView } from "./Bangla1stMCQView";

// ==========================================
// MOCKED TYPES & DATA (Replaces missing external dependencies)
// ==========================================
enum Subject {
  BANGLA = "বাংলা",
  ENGLISH = "English",
  MATH = "উচ্চতর গণিত",
  PHYSICS = "পদার্থবিদ্যা",
  CHEMISTRY = "রসায়ন",
  BIOLOGY = "জীববিজ্ঞান",
  ICT = "তথ্য ও যোগাযোগ প্রযুক্তি"
}

interface StudentStats {
  points: number;
  level: number;
  totalQuestionsSolved: number;
  examsGiven: number;
}

interface Question {
  id: string;
  subject: string;
  chapter: string;
  source?: string[];
  questionText: string;
  questionParts?: any[];
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
}

const QUESTION_BANK: Question[] = [
  {
    id: "q1",
    subject: "রসায়ন",
    chapter: "পরিবেশ রসায়ন (প্রথম অধ্যায়)",
    source: ["ঢাকা বোর্ড - 2023"],
    questionText: "এস.টি.পি তে ১ মোল গ্যাসের আয়তন কত?",
    options: ["২২.৪ লিটার", "২৪.৭৮৯ লিটার", "২২.৪১৪ ঘনমিটার", "২৫ লিটার"],
    correctIndex: 0,
    explanation: "প্রমাণ তাপমাত্রা ও চাপে (STP) যেকোনো আদর্শ গ্যাসের ১ মোলের আয়তন ২২.৪ লিটার।"
  },
  {
    id: "q2",
    subject: "উচ্চতর গণিত",
    chapter: "ম্যাট্রিক্স ও নির্ণায়ক",
    source: ["রাজশাহী বোর্ড - 2022"],
    questionText: "কোনো ম্যাট্রিক্সের নির্ণায়কের মান শূন্য হলে তাকে কী বলে?",
    options: ["অব্যতিক্রমী ম্যাট্রিক্স", "ব্যতিক্রমী ম্যাট্রিক্স", "প্রতিসম ম্যাট্রিক্স", "বিপ্রতিসম ম্যাট্রিক্স"],
    correctIndex: 1,
    explanation: "যে বর্গ ম্যাট্রিক্সের নির্ণায়কের মান শূন্য, তাকে ব্যতিক্রমী বা Singular Matrix বলে।"
  }
];

// ==========================================
// CUSTOM RENDERING ICONS
// ==========================================
const CustomTriangleCaret = ({ isOpen, className }: { isOpen: boolean; className?: string }) => {
  return (
    <svg 
      viewBox="0 0 256 256" 
      className={`${className} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      fill="currentColor"
    >
      <path d="M211.31,100.69A8,8,0,0,0,208,96H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,211.31,100.69Z" />
    </svg>
  );
};

const CustomRightArrow = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 256 256" 
      className={className}
      fill="currentColor"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,109.66-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,173.66,133.66Z" />
    </svg>
  );
};

// ==========================================
// MAIN COMPONENT (App is default export for Canvas environments)
// ==========================================
export default function App({
  stats: externalStats,
  setStats: externalSetStats,
  questions: externalQuestions
}: {
  stats?: any;
  setStats?: any;
  questions?: any[];
} = {}) {
  const [localStats, setLocalStats] = useState<StudentStats>({
    points: 1250,
    level: 12,
    totalQuestionsSolved: 312,
    examsGiven: 5
  });
  
  const stats = externalStats || localStats;
  const setStats = externalSetStats || setLocalStats;
  const questions = externalQuestions && externalQuestions.length > 0 ? externalQuestions : QUESTION_BANK;

  // ==========================================
  // 1. SATT ACADEMY DASHBOARD STATE
  // ==========================================
  const [activeDashboardView, setActiveDashboardView] = useState<boolean>(true); // true = SATT UI, false = Legacy Practice UI
  const [activeTab, setActiveTab ] = useState<number>(0); // 0=বিষয় ভিত্তিক, 1=প্রশ্ন ব্যাংক, 2=বোর্ড, 3=কলেজ, 4=মডেল টেস্ট
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedPapers, setExpandedPapers] = useState<{ [key: string]: boolean }>({});
  const [showBangla1stPage, setShowBangla1stPage] = useState<boolean>(false);
  const [bangla1stSub, setBangla1stSub] = useState<string | undefined>(undefined);

  // ==========================================
  // 2. EXISTING CORE LOGIC & STATES
  // ==========================================
  const dbQuestions = questions && questions.length > 0 ? questions : QUESTION_BANK;

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

  const availableSubjects = useMemo(() => {
    const list = dbQuestions.map(q => q.subject as string);
    const unique = Array.from(new Set(list));
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
  const [practiceMode, setPracticeMode] = useState<"practice" | "exam">("practice");
  const [answeredPracticeList, setAnsweredPracticeList] = useState<{ [qId: string]: number }>({});

  const [examState, setExamState] = useState<"idle" | "running" | "ended">("idle");
  const [examSelections, setExamSelections] = useState<{ [qId: string]: number }>({});
  const [examTimeLimit, setExamTimeLimit] = useState<number>(10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const examTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [examResultStats, setExamResultStats] = useState<{
    correctCount: number; incorrectCount: number; skippedCount: number;
    accuracy: number; xpEarned: number; timeSpentStr: string;
  } | null>(null);

  const chapters = useMemo(() => {
    const list = dbQuestions.filter(q => (q.subject as string) === selectedSubject).map(q => q.chapter);
    return ["All", ...Array.from(new Set(list))];
  }, [selectedSubject, dbQuestions]);

  const sources = useMemo(() => {
    const list: string[] = [];
    dbQuestions.filter(q => (q.subject as string) === selectedSubject).forEach((q: any) => {
      if (q.source && Array.isArray(q.source)) q.source.forEach((s: string) => list.push(s));
    });
    return ["All", ...Array.from(new Set(list))];
  }, [selectedSubject, dbQuestions]);

  const filteredQuestions = useMemo(() => {
    return dbQuestions.filter(q => {
      if ((q.subject as string) !== selectedSubject) return false;
      if (selectedChapter !== "All" && q.chapter !== selectedChapter) return false;
      if (selectedSource !== "All") {
        const qSources = (q as any).source || [];
        if (!qSources.includes(selectedSource)) return false;
      }
      if (showOnlyBookmarks && !bookmarks.includes(q.id)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const mainTextMatch = (q.questionText || "").toLowerCase().includes(query);
        const explanationMatch = (q.explanation || "").toLowerCase().includes(query);
        const optionsMatch = Array.isArray(q.options) && q.options.some(opt => (opt || "").toLowerCase().includes(query));
        if (!mainTextMatch && !explanationMatch && !optionsMatch) return false;
      }
      return true;
    });
  }, [selectedSubject, selectedChapter, selectedSource, showOnlyBookmarks, bookmarks, searchQuery, dbQuestions]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [availableSubjects, selectedSubject]);

  useEffect(() => {
    setSelectedChapter("All");
    setSelectedSource("All");
  }, [selectedSubject]);

  const handleSelectOptionPractice = (questionId: string, choiceIndex: number, correctIndex: number) => {
    if (answeredPracticeList[questionId] !== undefined) return;
    setAnsweredPracticeList(prev => ({ ...prev, [questionId]: choiceIndex }));
    const isCorrect = choiceIndex === correctIndex;
    setStats(prev => {
      const xpReward = isCorrect ? 10 : 2;
      const newPoints = prev.points + xpReward;
      return { ...prev, points: newPoints, level: Math.floor(newPoints / 100) + 1, totalQuestionsSolved: prev.totalQuestionsSolved + 1 };
    });
  };

  const startExamMode = () => {
    if (filteredQuestions.length === 0) {
      alert("উপযুক্ত প্রশ্ন পাওয়া যায়নি!"); return;
    }
    setExamSelections({}); setSecondsRemaining(examTimeLimit * 60); setExamState("running"); setExamResultStats(null);
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    examTimerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(examTimerRef.current!); evaluateExamAnswers(); return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const evaluateExamAnswers = () => {
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    let correctCount = 0, incorrectCount = 0, skippedCount = 0;
    filteredQuestions.forEach(q => {
      const choice = examSelections[q.id];
      if (choice === undefined) skippedCount++;
      else if (choice === q.correctIndex) correctCount++;
      else incorrectCount++;
    });
    const accuracyVal = filteredQuestions.length > 0 ? Math.round((correctCount / filteredQuestions.length) * 100) : 0;
    const xpReward = (correctCount * 12) + (accuracyVal >= 80 ? 30 : 0);
    const secsSpent = (examTimeLimit * 60) - secondsRemaining;
    const timeStr = `${Math.floor(secsSpent / 60)} মিনিট ${secsSpent % 60} সেকেন্ড`;
    setExamResultStats({ correctCount, incorrectCount, skippedCount, accuracy: accuracyVal, xpEarned: xpReward, timeSpentStr: timeStr });
    setStats(prev => {
      const totalPoints = prev.points + xpReward;
      return { ...prev, points: totalPoints, level: Math.floor(totalPoints / 100) + 1, examsGiven: prev.examsGiven + 1, totalQuestionsSolved: prev.totalQuestionsSolved + (filteredQuestions.length - skippedCount) };
    });
    setExamState("ended");
  };

  const resetExamMode = () => {
    setExamState("idle"); setExamSelections({}); setExamResultStats(null);
    if (examTimerRef.current) clearInterval(examTimerRef.current);
  };

  const examTimerDisplay = useMemo(() => {
    const min = Math.floor(secondsRemaining / 60); const sec = secondsRemaining % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, [secondsRemaining]);

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiDrawerQuestion, setAiDrawerQuestion] = useState<Question | null>(null);
  const [aiTutorResponse, setAiTutorResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const triggerAiTutor = async (q: Question) => {
    setAiDrawerQuestion(q); setAiDrawerOpen(true); setAiLoading(true); setAiTutorResponse("");
    setTimeout(() => {
      setAiTutorResponse("**সঠিক উত্তর**: C\n\n**ব্যাখ্যা**: এটি একটি ডেমো এআই রেসপন্স।");
      setAiLoading(false);
    }, 2000);
  };

  // Integration Logic for SATT Clone
  const launchAppFeature = (mode: "practice" | "exam", subject: string = "উচ্চতর গণিত") => {
    setSelectedSubject(subject);
    setPracticeMode(mode);
    if(mode === 'practice') {
      setExamState("idle");
    } else {
      resetExamMode();
    }
    setActiveDashboardView(false); // Hide SATT UI, Show Original UI
  };

  const sattTabs = ["বিষয় ভিত্তিক", "প্রশ্ন ব্যাংক", "বোর্ড ভিত্তিক", "কলেজ ভিত্তিক", "মডেল টেস্ট"];
  
  const qBankCards = [
    { title: "উচ্চতর গণিত ২য় পত্র", subtitle: "ময়মনসিংহ বোর্ড - 2025", qs: "25 MCQ" },
    { title: "পদার্থবিজ্ঞান ১ম পত্র", subtitle: "ঢাকা বোর্ড - 2024", qs: "25 MCQ" },
    { title: "রসায়ন ২য় পত্র", subtitle: "রাজশাহী বোর্ড - 2024", qs: "25 MCQ" },
    { title: "তথ্য ও যোগাযোগ প্রযুক্তি", subtitle: "চট্টগ্রাম বোর্ড - 2024", qs: "25 MCQ" },
    { title: "English 1st Paper", subtitle: "যশোর বোর্ড - 2024", qs: "25 MCQ" },
    { title: "বাংলা ১ম পত্র", subtitle: "কুমিল্লা বোর্ড - 2024", qs: "25 MCQ" }
  ];

  const boardCards = [
    { name: "ঢাকা বোর্ড", exams: 12, mcq: "3.2k", cq: "450" },
    { name: "রাজশাহী বোর্ড", exams: 10, mcq: "2.8k", cq: "380" },
    { name: "চট্টগ্রাম বোর্ড", exams: 9, mcq: "2.5k", cq: "320" },
    { name: "কুমিল্লা বোর্ড", exams: 8, mcq: "2.4k", cq: "310" },
    { name: "যশোর বোর্ড", exams: 8, mcq: "2.3k", cq: "290" },
    { name: "সিলেট বোর্ড", exams: 7, mcq: "1.9k", cq: "250" },
    { name: "বরিশাল বোর্ড", exams: 6, mcq: "1.7k", cq: "220" },
    { name: "দিনাজপুর বোর্ড", exams: 7, mcq: "2.0k", cq: "280" }
  ];

  const collegeCards = [
    { name: "ঢাকা কলেজ", exams: 6, mcq: "1.5k" },
    { name: "নটর ডেম কলেজ, ঢাকা", exams: 8, mcq: "2.2k" },
    { name: "রাজউক উত্তরা মডেল কলেজ", exams: 7, mcq: "1.8k" },
    { name: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ", exams: 5, mcq: "1.4k" },
    { name: "আদমজী ক্যান্টনমেন্ট কলেজ", exams: 6, mcq: "1.6k" },
    { name: "হলিক্রস কলেজ", exams: 5, mcq: "1.3k" }
  ];

  const modelTestCards = [
    { title: "এইচএসসি পদার্থবিজ্ঞান ১ম পত্র ও ২য় পত্র কম্বাইন্ড টেস্ট" },
    { title: "মডিউল টেস্ট - ০১: উচ্চতর গণিত জটিল সংখ্যা ও দ্বিপদী" },
    { title: "এইচএসসি রসায়ন ২য় পত্র পূর্ণাঙ্গ প্রি-টেস্ট মডেল টেস্ট" },
    { title: "মেডিকেল ভর্তি পরীক্ষা প্রস্তুতি বিশেষ মক টেস্ট" },
    { title: "ঢাকা বিশ্ববিদ্যালয় ক-ইউনিট গণিত চূড়ান্ত মডেল টেস্ট" }
  ];

  const subjectCards = [
    { 
      name: "বাংলা", 
      mcq: "26.8k", 
      cq: "3.8k", 
      board: "76", 
      model: "897", 
      hasChapters: true,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      shading: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
      accent: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700/50",
      chapters: [
        { label: "বাংলা ১ম পত্র", sub: ["গদ্য", "কবিতা", "বাংলা নাটক", "বাংলা উপন্যাস"] },
        { label: "বাংলা ২য় পত্র", sub: ["সারাংশ ও সারমর্ম", "সংলাপ", "ব্যাকারণ কাঠামো", "ধ্বনিতত্ত্ব ( Phonology)", "শব্দতত্ত্ব বা রূপতত্ত্ব ( Morphology)", "বাক্যতত্ত্ব বা পদক্রম (Syntax)", "অর্থতত্ত্ব ( Semantics )", "ছন্দ ও অলংকার", "নির্মিতি"] },
        { label: "বাংলা ১ম পত্র (অ্যাডমিশন)", sub: ["বাংলা সাহিত্যিক ও সাহিত্যকর্ম", "বাংলা সাহিত্যের যুগ বিভাগ", "বাংলা সংবাদপত্র", "বাংলা সাহিত্যের শাখা", "ভাষা আন্দোলনভিত্তিক সাহিত্য", "মুক্তিযুদ্ধভিত্তিক বাংলা সাহিত্য", "বাংলায় উল্লেখযোগ্য গ্রন্থ ও চরিত্র", "সাহিত্যিকদের উপাধি ও ছদ্মনাম", "প্রায় একই নামের গ্রন্থ ও রচয়িতা", "আত্মজীবনী ও স্মৃতিকথা"] }
      ]
    },
    { 
      name: "English", 
      mcq: "31.9k", 
      cq: "1.4k", 
      board: "88", 
      model: "995", 
      hasChapters: true,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600",
      shading: "bg-indigo-50 text-indigo-850 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
      accent: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700/50",
      chapters: [
        { label: "English 1st Paper", sub: ["People or Institutions Making History", "Dreams", "Lifestyle", "Adolescence", "Youthful Achievers", "Relationships", "Human Rights", "Peace and Conflict", "Tours and Travels", "Environment and Nature", "Art and Craft", "Education and Life", "Myths and Literature"] },
        { label: "English Literature( for Admission)", sub: ["Titles of important writers", "Periods of english literature", "A list of dramatists, poets, novelists, essayists, woman writers and critics", "The old english period (450-1066)", "The middle english period (1066-1500)", "The Renaissance (1500-1660)", "The Neoclassical Period (1660-1798)", "The Romantic Period (1798-1832)", "The Victorian Period (1832-1901)", "The Modern Period (1901-1939)", "The Post Modern Period (1939-Present)", "Famous books of different writers", "Awards in literature (Noble & Booker Prize)", "Nicknames of various writers", "Poet Laureate", "বিভিন্ন দেশের জাতীয় কবি", "Elaboration of the name of some writers", "ইংরেজি সাহিত্যে বিখ্যাত মহাকাব্য (Epics)", "ইংরেজি সাহিত্যে বিখ্যাত শোককাব্য", "ইংরেজি সাহিত্যে বিখ্যাত বিভিন্ন চরিত্র", "ভিন্ন ভিন্ন লেখকের সমজাতীয় সাহিত্য", "সরকার কর্তৃক নিষিদ্ধকৃত গ্রন্থসমূহ", "ইংরেজি গল্পের বাংলা অনুবাদ", "বাংলা গল্পের ইংরেজি অনুবাদ", "Bangladesh writers in english", "Indian writers in english", "Italian writers in english(Translation)", "Russian writers in english", "Irish writers in english", "Scottish writers in english", "American writers in english", "Prominent Greek writers and their works", "Prominent Roman writers and their works", "Literary terms and genres", "Important Quotations from different disciplines", "theme of some important literary pieces", "Ancient Mariner", "Miscellaneous", "Quotations"] },
        { label: "English 2nd Paper", sub: ["Completing sentence", "Parts of Speech", "Idioms & Phrases", "The Clauses", "Corrections", "Sentences & Transformations", "words", "Tense", "Right Form of Verbs", "Sentence Completion", "Narrations: Direct and Indirect", "Tag Questions", "Inversion", "Modifiers", "Conditional Sentences", "Pin Point Error", "Redundancy", "Analogy", "Translation", "Proverbs", "Embedded Questions", "Pair of Words", "Reading Comprehension", "Parallelism", "Conjugation of verb", "Miscellaneous", "Consonent", "Subjunctive", "Alphabet", "Writting precis", "Writing Paragraph", "Writing Essay", "Making Sentence", "Dangling Modifier", "Identifying Missing Word", "same word uses as different part of speech", "Sequence of Tense", "Latin Adjective"] }
      ]
    },
    { 
      name: "তথ্য ও যোগাযোগ প্রযুক্তি", 
      mcq: "20.9k", 
      cq: "78", 
      board: "36", 
      model: "264", 
      hasChapters: true,
      color: "purple",
      gradient: "from-purple-500 to-fuchsia-600",
      shading: "bg-purple-50 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
      accent: "text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700/50",
      chapters: [
        { label: "তথ্য ও যোগাযোগ প্রযুক্তি", sub: ["বিশ্ব ও বাংলাদেশ প্রেক্ষিত", "কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং", "সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস", "ওয়েব ডিজাইন পরিচিতি এবং HTML", "প্রোগ্রামিং ভাষা", "ডাটাবেজ ম্যানেজমেন্ট সিস্টেম"] }
      ]
    },
    { 
      name: "পদার্থবিদ্যা", 
      mcq: "14.8k", 
      cq: "207", 
      board: "73", 
      model: "469", 
      hasChapters: true,
      color: "rose",
      gradient: "from-rose-500 to-pink-600",
      shading: "bg-rose-50 text-rose-850 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
      accent: "text-rose-600 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700/50",
      chapters: [
        { label: "পদার্থবিজ্ঞান ১ম পত্র", sub: ["ভৌত জগৎ ও পরিমাপ", "ভেক্টর", "গতিবিদ্যা", "নিউটনিয়ান বলবিদ্যা", "কাজ, শক্তি ও ক্ষমতা", "মহাকর্ষ ও অভিকর্ষ", "পদার্থের গাঠনিক ধর্ম", "পর্যাবৃত্ত গতি", "তরঙ্গ", "আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব"] },
        { label: "পদার্থবিজ্ঞান ২য় পত্র", sub: ["তাপগতিবিদ্যা", "স্থির তড়িৎ", "চল তড়িৎ", "জ্যামিতিক আলোকবিজ্ঞান", "সেমিকন্ডাক্টর ও ইলেকট্রনিক্স"] }
      ]
    },
    { 
      name: "সাধারণ জ্ঞান", 
      mcq: "12k", 
      cq: "0", 
      board: "10", 
      model: "150", 
      hasChapters: true,
      color: "blue",
      gradient: "from-blue-500 to-cyan-600",
      shading: "bg-blue-50 text-blue-850 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
      accent: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-cyan-700/50",
      chapters: [
        { label: "বাংলাদেশ বিষয়াবলী", sub: ["ভাষা আন্দোলন ও মুক্তিযুদ্ধ", "ভৌগোলিক অবস্থান ও সীমানা", "বাংলাদেশের ঐতিহ্য ও সংস্কৃতি"] }
      ]
    },
    { 
      name: "পরিসংখ্যান", 
      mcq: "5k", 
      cq: "305", 
      board: "20", 
      model: "3", 
      hasChapters: true,
      color: "sky",
      gradient: "from-sky-500 to-indigo-500",
      shading: "bg-sky-50 text-sky-850 dark:bg-sky-950/20 dark:text-sky-400 border-sky-100 dark:border-sky-900/30",
      accent: "text-sky-600 dark:text-sky-400",
      border: "border-sky-100 dark:border-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700/50",
      chapters: [
        { label: "পরিসংখ্যান ১ম পত্র", sub: ["পরিসংখ্যান, চলক ও বিভিন্ন প্রতীকের ধারণা", "তথ্য সংগ্রহ, সংক্ষিপ্তকরণ ও উপস্থাপন", "কেন্দ্রীয় প্রবণতা"] },
        { label: "পরিসংখ্যান ২য় পত্র", sub: ["সম্ভাবনা", "দৈব চলক ও গাণিতিক প্রত্যাশা"] }
      ]
    }
  ];

  const renderSattDashboard = () => {
    return (
      <div className="flex-1 overflow-y-auto space-y-6 w-full pb-12 animate-fade-in relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 px-4 sm:px-6 md:px-8 mt-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] sm:text-[12px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                এইচএসসি স্পেশাল প্রশ্নব্যাংক
              </div>
              <h1 className="text-[28px] md:text-3.5xl font-black text-zinc-900 dark:text-white tracking-tight mt-1 leading-none">
                প্রশ্নব্যাংক <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 font-black">ড্যাশবোর্ড</span>
              </h1>
            </div>
          </div>

          {/* Navigation and Search Module */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 mx-4 sm:mx-6 md:mx-8">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 xl:pb-0 scrollbar-none scroll-smooth w-full flex-nowrap min-w-0">
              {sattTabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15" 
                        : "bg-transparent text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Minimal Search Deck */}
            <div className="relative w-full xl:w-72">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="প্রশ্ন বা বিষয় খুঁজুন..." 
                className="w-full bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm text-zinc-750 dark:text-zinc-200 py-2.5 sm:py-3 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/10 border border-transparent focus:border-zinc-200 dark:focus:border-zinc-800 transition-all font-medium"
              />
            </div>
          </div>

          {/* Dynamic Tab Content */}
          {activeTab === 0 && (
            <div className="animate-fade-in px-4 sm:px-6 md:px-8">
              <div className="mb-6">
                <h2 className="text-[22px] font-extrabold text-zinc-900 dark:text-zinc-100">সকল বিষয়ের প্রশ্নব্যাংক</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">বিষয়ভিত্তিক সাজানো প্রশ্ন ও অনুশীলন</p>
                <div className="w-16 h-1 bg-[#0c8a4d] rounded-full mt-3"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                {subjectCards.map((card, i) => {
                  const isExpanded = expandedSubject === card.name;
                  return (
                    <div 
                      key={i} 
                      className={`bg-white dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                        isExpanded ? 'ring-1 ring-[#0c8a4d]/30 shadow-lg' : ''
                      }`}
                    >
                      {isExpanded && <div className="absolute top-0 left-0 right-0 h-1 bg-[#0c8a4d]" />}
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <h3 
                            className="font-bold text-zinc-900 dark:text-zinc-100 text-[18px] tracking-tight hover:text-[#0c8a4d] dark:hover:text-green-400 cursor-pointer transition-colors"
                            onClick={() => {
                              if (card.hasChapters) {
                                setExpandedSubject(isExpanded ? null : card.name);
                              } else {
                                launchAppFeature('practice', card.name);
                              }
                            }}
                          >
                            {card.name}
                          </h3>
                          
                          <div className="flex items-center gap-2">
                            {card.hasChapters && (
                              <button 
                                onClick={() => setExpandedSubject(isExpanded ? null : card.name)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-700 transition-all ${
                                  isExpanded 
                                    ? "bg-[#0c8a4d] border-[#0c8a4d] text-white" 
                                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                                title={isExpanded ? "Collapse" : "Expand"}
                              >
                                <CustomTriangleCaret isOpen={isExpanded} className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition">
                              <Printer className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" /> Print
                            </button>
                          </div>
                        </div>

                        {/* Compact Box Grid Metrics Design matching board-based cards */}
                        <div className="grid grid-cols-4 gap-1 border-y border-zinc-100 dark:border-zinc-800/80 py-3 my-3">
                          <div className="text-center">
                            <div className="text-[10px] text-[#0c8a4d] dark:text-[#a5d6a7] font-bold uppercase tracking-wider">MCQ</div>
                            <div className="text-[13px] font-extrabold text-zinc-850 dark:text-zinc-200 mt-0.5">{card.mcq}</div>
                          </div>
                          <div className="text-center border-l border-zinc-150 dark:border-zinc-800/80">
                            <div className="text-[10px] text-[#0c8a4d] dark:text-[#a5d6a7] font-bold uppercase tracking-wider">CQ</div>
                            <div className="text-[13px] font-extrabold text-zinc-850 dark:text-zinc-200 mt-0.5">{card.cq}</div>
                          </div>
                          <div className="text-center border-l border-zinc-150 dark:border-zinc-800/80">
                            <div className="text-[10px] text-[#0c8a4d] dark:text-[#a5d6a7] font-bold uppercase tracking-wider">বোর্ড</div>
                            <div className="text-[13px] font-extrabold text-zinc-850 dark:text-zinc-200 mt-0.5">{card.board}</div>
                          </div>
                          <div className="text-center border-l border-zinc-150 dark:border-zinc-800/80">
                            <div className="text-[10px] text-[#0c8a4d] dark:text-[#a5d6a7] font-bold uppercase tracking-wider">মডেল</div>
                            <div className="text-[13px] font-extrabold text-zinc-850 dark:text-zinc-200 mt-0.5">{card.model}</div>
                          </div>
                        </div>

                        {/* Papers Accordion List */}
                        {isExpanded && card.chapters && (
                          <div className="my-3 space-y-2 border-t border-zinc-100 dark:border-zinc-700/60 pt-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                            {card.chapters.map((chapGroup, idx) => {
                              const paperKey = `${card.name}-${chapGroup.label}`;
                              const isPaperExpanded = !!expandedPapers[paperKey];
                              return (
                                <div 
                                  key={idx} 
                                  className="bg-zinc-50 dark:bg-zinc-900/60 rounded-lg border border-zinc-150 dark:border-zinc-800/40 overflow-hidden transition-all"
                                >
                                  <div 
                                    onClick={() => setExpandedPapers(prev => ({ ...prev, [paperKey]: !isPaperExpanded }))}
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-805 transition-colors"
                                  >
                                    <span className="text-[13px] font-bold text-zinc-750 dark:text-zinc-250 leading-snug">
                                      {chapGroup.label}
                                    </span>
                                    {chapGroup.sub && chapGroup.sub.length > 0 && (
                                      <CustomTriangleCaret isOpen={isPaperExpanded} className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                                    )}
                                  </div>
                                  
                                  {isPaperExpanded && chapGroup.sub && chapGroup.sub.length > 0 && (
                                    <div className="px-3 pb-3 pt-1 space-y-2 border-t border-zinc-100/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30">
                                      {chapGroup.sub.map((sub, sIdx) => (
                                        <div 
                                          key={sIdx} 
                                          onClick={() => {
                                            if (card.name === "বাংলা" && chapGroup.label === "বাংলা ১ম পত্র") {
                                              let catId = "goddo";
                                              if (sub === "কবিতা") catId = "kobita";
                                              if (sub === "বাংলা নাটক") catId = "natok";
                                              if (sub === "বাংলা উপন্যাস") catId = "ouponnash";
                                              setBangla1stSub(catId);
                                              setShowBangla1stPage(true);
                                            } else {
                                              launchAppFeature('practice', card.name);
                                            }
                                          }}
                                          className="flex items-start gap-2 text-xs text-zinc-630 dark:text-zinc-350 hover:text-[#0c8a4d] dark:hover:text-green-400 cursor-pointer group/item transition-colors py-0.5"
                                        >
                                          <CustomRightArrow className="w-3 h-3 text-[#0c8a4d] shrink-0 mt-0.5 group-hover/item:translate-x-0.5 transition-transform" />
                                          <span className="leading-relaxed font-medium group-hover/item:underline">{sub}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="px-5 pb-5 pt-1">
                        <button 
                          onClick={() => {
                            if (card.hasChapters) {
                              setExpandedSubject(isExpanded ? null : card.name);
                            } else {
                              launchAppFeature('practice', card.name);
                            }
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                            isExpanded 
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border-transparent hover:brightness-110" 
                              : "bg-emerald-50 dark:bg-emerald-950/20 text-[#0c8a4d] dark:text-emerald-400 border-emerald-200/20 dark:border-emerald-800/20 hover:bg-[#0c8a4d] hover:text-white dark:hover:bg-[#0c8a4d] dark:hover:text-white"
                          }`}
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" />
                          <span>{isExpanded ? "অধ্যায়সমূহ বন্ধ করুন" : "প্র্যাকটিস করুন"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="animate-fade-in px-4 sm:px-6 md:px-8">
              <div className="mb-4">
                <h2 className="text-[22px] font-extrabold text-gray-850 dark:text-slate-100">বিগত বছরের বোর্ড পরীক্ষার প্রশ্ন ব্যাংক</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">বিগত বছরের বোর্ড পরীক্ষার প্রশ্ন ও সমাধান</p>
                <div className="w-16 h-1 bg-[#0c8a4d] rounded-full mt-3"></div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qBankCards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-[14px] hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-[#212529] dark:text-slate-100 text-[17px]">{card.title}</h3>
                        <button className="text-gray-400 dark:text-slate-500 hover:text-gray-605 dark:hover:text-white"><Printer className="w-4 h-4" /></button>
                      </div>
                      <p className="text-[13px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0c8a4d]"></span>
                        {card.subtitle} &nbsp; {card.qs}
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => launchAppFeature('exam')}
                          className="flex-1 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-[#0c8a4d] dark:hover:bg-[#0c8a4d] text-[#0c8a4d] dark:text-emerald-400 hover:text-white dark:hover:text-white border border-emerald-200/20 dark:border-emerald-800/20 shadow-sm transition-all duration-300 rounded-xl text-xs font-extrabold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                        >
                          <PlayCircle className="w-4 h-4 text-[#0c8a4d] dark:text-emerald-400 group-hover/btn:text-white transition-colors" />
                          <span>Start Exam</span>
                        </button>
                        <button 
                          onClick={() => launchAppFeature('practice')}
                          className="flex-1 bg-teal-50 dark:bg-teal-950/15 hover:bg-[#0c8a4d] dark:hover:bg-[#0c8a4d] text-teal-700 dark:text-teal-400 hover:text-white dark:hover:text-white border border-teal-200/20 dark:border-teal-850/20 shadow-sm transition-all duration-300 rounded-xl text-xs font-extrabold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                        >
                          <Sword className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover/btn:text-white transition-colors" />
                          <span>Challenge</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Filter Sidebar */}
                <div className="w-full lg:w-72 bg-white dark:bg-slate-900 rounded-[14px] border border-gray-200 dark:border-slate-800 p-5 shrink-0 hidden lg:block sticky top-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-850 pb-3 mb-4">
                    <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-slate-100">
                      <SlidersHorizontal className="w-4 h-4 text-[#0c8a4d]" />
                      <span>ফিল্টার</span>
                    </div>
                    <button className="text-red-500 text-xs font-semibold hover:underline">রিসেট</button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <span className="text-[13px] font-bold text-gray-700 dark:text-slate-300 block mb-2">প্রশ্নের ধরন</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850">MCQ</button>
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850">CQ</button>
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850">MCQ + CQ</button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[13px] font-bold text-gray-700 dark:text-slate-300 block mb-2">ক্যাটাগরি</span>
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-[#0c8a4d] text-white text-xs font-semibold">বোর্ড</button>
                        <button className="px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-850">কলেজ</button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[13px] font-bold text-gray-700 dark:text-slate-300 block mb-2">বোর্ড</span>
                      <div className="relative mb-3">
                        <input type="text" placeholder="বোর্ড খুঁজুন..." className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-lg text-xs py-2 px-3 outline-none focus:border-[#0c8a4d]/50 text-slate-800 dark:text-slate-100" />
                      </div>
                      <div className="space-y-2 h-40 overflow-y-auto custom-scrollbar">
                        {["ঢাকা বোর্ড", "রাজশাহী বোর্ড", "চট্টগ্রাম বোর্ড", "সিলেট বোর্ড", "যশোর বোর্ড", "কুমিল্লা বোর্ড"].map((b,i) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 dark:border-slate-700 text-[#0c8a4d] focus:ring-[#0c8a4d] dark:bg-slate-950" />
                            <span className="text-[13px] text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-white">{b}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-[22px] font-extrabold text-gray-850 dark:text-slate-100">সকল বোর্ড ভিত্তিক প্রশ্নব্যাংক</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">বোর্ড ভিত্তিক সাজানো প্রশ্ন ও অনুশীলন</p>
                <div className="w-16 h-1 bg-[#0c8a4d] rounded-full mt-3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {boardCards.map((card, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-[14px] hover:shadow-md transition-shadow flex flex-col justify-between">
                    <h3 className="font-bold text-[#212529] dark:text-slate-100 text-[16px] mb-3">{card.name}</h3>
                    
                    {/* Compact Metrics Grid */}
                    <div className="grid grid-cols-3 gap-1 border-t border-b border-gray-100 dark:border-slate-805 py-3 my-3">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">Exams</div>
                        <div className="text-[13px] font-extrabold text-gray-800 dark:text-slate-200">{card.exams}</div>
                      </div>
                      <div className="text-center border-l border-gray-100 dark:border-slate-805">
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">MCQ</div>
                        <div className="text-[13px] font-extrabold text-gray-800 dark:text-slate-200">{card.mcq}</div>
                      </div>
                      <div className="text-center border-l border-gray-100 dark:border-slate-805">
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">CQ</div>
                        <div className="text-[13px] font-extrabold text-gray-800 dark:text-slate-200">{card.cq}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => launchAppFeature('practice')} 
                      className="w-full bg-emerald-50 dark:bg-emerald-950/20 hover:bg-[#0c8a4d] dark:hover:bg-[#0c8a4d] text-[#0c8a4d] dark:text-emerald-400 hover:text-white dark:hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-1 border border-emerald-200/20 dark:border-emerald-800/20 group/btn cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4 text-[#0c8a4d] dark:text-emerald-400 group-hover/btn:text-white dark:group-hover/btn:text-white transition-colors" />
                      <span>প্র্যাকটিস করুন</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 3 && (
             <div className="animate-fade-in">
             <div className="mb-6">
               <h2 className="text-[22px] font-extrabold text-gray-850 dark:text-slate-100">সকল কলেজ ভিত্তিক প্রশ্নব্যাংক</h2>
               <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">কলেজ ভিত্তিক টেস্ট পেপার সাজানো প্রশ্ন ও অনুশীলন</p>
               <div className="w-16 h-1 bg-[#0c8a4d] rounded-full mt-3"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {collegeCards.map((card, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-[14px] hover:shadow-md transition-shadow flex flex-col justify-between">
                   <h3 className="font-bold text-[#212529] dark:text-slate-100 text-[15px] mb-3 line-clamp-1">{card.name}</h3>
                   
                   {/* Compact Metrics Grid */}
                   <div className="grid grid-cols-2 gap-1 border-t border-b border-gray-100 dark:border-slate-805 py-3 my-3">
                     <div className="text-center">
                       <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">Exams</div>
                       <div className="text-[13px] font-extrabold text-gray-800 dark:text-slate-200">{card.exams}</div>
                     </div>
                     <div className="text-center border-l border-gray-100 dark:border-slate-805">
                       <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">MCQ</div>
                       <div className="text-[13px] font-extrabold text-gray-800 dark:text-slate-200">{card.mcq}</div>
                     </div>
                   </div>

                   <button 
                     onClick={() => launchAppFeature('practice')} 
                     className="w-full bg-emerald-50 dark:bg-emerald-950/20 hover:bg-[#0c8a4d] dark:hover:bg-[#0c8a4d] text-[#0c8a4d] dark:text-emerald-400 hover:text-white dark:hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-1 border border-emerald-200/20 dark:border-emerald-800/20 group/btn cursor-pointer"
                   >
                     <PlayCircle className="w-4 h-4 text-[#0c8a4d] dark:text-emerald-400 group-hover/btn:text-white dark:group-hover/btn:text-white transition-colors" />
                     <span>প্র্যাকটিস করুন</span>
                   </button>
                 </div>
               ))}
             </div>
           </div>
          )}

          {activeTab === 4 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-[22px] font-extrabold text-gray-850 dark:text-slate-100">মডেল টেস্ট ও ভর্তি পরীক্ষা</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">প্রশ্ন ও সমাধান সহ মডেল টেস্ট</p>
                <div className="w-16 h-1 bg-[#0c8a4d] rounded-full mt-3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {modelTestCards.map((card, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-[14px] hover:shadow-md transition-shadow relative">
                    <span className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 font-bold text-[10px]">৳5</span>
                    <h3 className="font-bold text-[#212529] dark:text-slate-100 text-[15px] mb-3 pr-6 leading-snug">{card.title}</h3>
                    <div className="flex gap-4 text-[12px] text-gray-500 dark:text-slate-400 font-medium mb-5">
                      <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5"/> 25 Ques</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> 25 Mins</span>
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5"/> 25 Marks</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-850">
                      <span className="text-[#0c8a4d] text-xs font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0c8a4d]"></span> Ongoing
                      </span>
                      <button 
                        onClick={() => launchAppFeature('exam')}
                        className="bg-[#0c8a4d] hover:bg-[#0a7340] text-white px-4 py-1.5 rounded flex items-center gap-1 text-xs font-semibold transition-colors"
                      >
                        Start Exam <PlayCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
    );
  };

  // ==========================================
  // RENDER APP COMPONENT
  // ==========================================
  if (showBangla1stPage) {
    return (
      <div className="flex h-full w-full bg-[#fcfefe] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative rounded-xl overflow-y-auto shadow-sm border border-gray-200/50 dark:border-zinc-800 h-full">
        <div className="flex-1 w-full h-full">
          <Bangla1stMCQView 
            onBack={() => {
              setShowBangla1stPage(false);
              setBangla1stSub(undefined);
            }} 
            initialCategory={bangla1stSub} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full text-zinc-900 dark:text-zinc-100 relative">
      {/* MAIN VIEWPORT - Removed the hardcoded duplicate sidebar and top header to fit Chorcha AI layout correctly */}
      {activeDashboardView ? (
        renderSattDashboard()
      ) : (
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 overflow-y-auto relative h-full">
          
          {/* Overlay Top Bar to return to SATT UI */}
          <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
            <button 
              onClick={() => setActiveDashboardView(true)}
              className="flex items-center gap-2 text-sm font-semibold text-[#0c8a4d] hover:bg-[#0c8a4d]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              &larr; প্রশ্নব্যাংক ড্যাশবোর্ড এ ফিরে যান
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedSubject} • {practiceMode === 'exam' ? 'Exam Mode' : 'Practice Mode'}</span>
          </div>

          <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pt-8">
            
            {/* --- ORIGINAL COMPONENT CONTENT WRAPPER --- */}
            
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
                    <span>সহপাঠীদের তুলনায় এগিয়ে আছো</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <BookMarked className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">প্রিয় প্রশ্ন সংকলন</span>
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
                    <span>{selectedSubject} অনুশীলনী কক্ষ</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    সাবজেক্ট ও চ্যাপ্টার ওয়াইজ হাজারো বোর্ড প্রশ্নের নির্ভুল এআই সমাধান ও কাউন্টডাউন মক টেস্ট!
                  </p>
                </div>

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

              {examState !== "running" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedChapter}
                      onChange={e => setSelectedChapter(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="All">সব অধ্যায় (All Chapters)</option>
                      {chapters.filter(c => c !== "All").map((chap, idx) => (
                        <option key={idx} value={chap}>{chap}</option>
                      ))}
                    </select>
                  </div>

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

                  <button
                    onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                    className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      showOnlyBookmarks
                        ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BookMarked className={`w-4 h-4 ${showOnlyBookmarks ? "fill-yellow-400 animate-pulse" : ""}`} />
                    <span>প্রিয় তালিকায় সংকুচিত করো</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. PRACTICING MODE / EXAM MODE VIEWS */}
            {practiceMode === "practice" ? (
              filteredQuestions.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 shadow-sm max-w-3xl mx-auto">
                  <BookOpen className="w-14 h-14 mx-auto text-slate-350 dark:text-slate-700 mb-4 animate-bounce" />
                  <h4 className="text-base font-black text-slate-700 dark:text-slate-300">কোনো প্রাসঙ্গিক প্রশ্ন পাওয়া যায়নি!</h4>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredQuestions.map((q, idx) => {
                    const userChoice = answeredPracticeList[q.id];
                    const isAnswered = userChoice !== undefined;
                    const isBookmarked = bookmarks.includes(q.id);

                    return (
                      <div key={q.id} className={`bg-white dark:bg-slate-900 border p-6 rounded-3xl transition-all shadow-sm ${isAnswered ? userChoice === q.correctIndex ? "border-emerald-500/50" : "border-red-500/30 shadow-md" : "border-slate-200/90 hover:border-slate-300"}`}>
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-50 border border-slate-200 text-[10px] px-2.5 py-1 rounded-full font-black">প্রশ্ন {idx + 1}</span>
                            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full">{q.chapter}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => toggleBookmark(q.id)} className={`p-2 rounded-xl border ${isBookmarked ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"}`}>
                              <BookMarked className="w-4 h-4" />
                            </button>
                            <button onClick={() => triggerAiTutor(q)} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[11px] font-black hover:brightness-105 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> <span>এআই সলভার</span>
                            </button>
                          </div>
                        </div>
                        <div className="mb-5 space-y-4 font-bold">
                          <ReactMarkdown>{q.questionText}</ReactMarkdown>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              disabled={isAnswered}
                              onClick={() => handleSelectOptionPractice(q.id, optIdx, q.correctIndex)}
                              className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-3 ${isAnswered ? optIdx === q.correctIndex ? "bg-emerald-500/15 border-emerald-500 text-emerald-800" : userChoice === optIdx ? "bg-red-500/15 border-red-500 text-red-800" : "bg-slate-50 border-slate-100 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isAnswered && optIdx === q.correctIndex ? "bg-emerald-500 text-white" : isAnswered && userChoice === optIdx ? "bg-red-500 text-white" : "bg-slate-200 text-slate-500"}`}>{String.fromCharCode(65 + optIdx)}</span>
                                <ReactMarkdown>{opt}</ReactMarkdown>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                {examState === "idle" && (
                  <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                      <Timer className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">এইচএসসি অধ্যায়ভিত্তিক বোর্ড পরীক্ষা সিমুলেটর</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">নির্দিষ্ট সময়ের মধ্যে নীরবে পরীক্ষা দেওয়া।</p>
                    </div>
                    <div className="pt-2">
                      <button onClick={startExamMode} disabled={filteredQuestions.length === 0} className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:brightness-105 active:scale-95 shadow-md shadow-cyan-950/10">
                        পরীক্ষায় অংশ নাও
                      </button>
                    </div>
                  </div>
                )}

                {examState === "running" && (
                  <div className="space-y-6">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl flex justify-between items-center z-15 shadow-sm">
                      <div><h4 className="text-sm font-black text-slate-800">{selectedSubject} - মক এক্সাম</h4></div>
                      <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-200">
                        <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span className="text-sm font-mono font-black text-cyan-400">{examTimerDisplay}</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {filteredQuestions.map((q, idx) => (
                        <div key={q.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                           <div className="flex items-center gap-2 mb-4"><span className="bg-white border border-slate-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">এমসিকিউ কোশ্চেন {idx + 1}</span></div>
                           <div className="mb-4 font-bold text-sm"><ReactMarkdown>{q.questionText}</ReactMarkdown></div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             {q.options.map((opt, optIdx) => (
                               <button key={optIdx} onClick={() => setExamSelections(prev => ({ ...prev, [q.id]: optIdx }))} className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold ${examSelections[q.id] === optIdx ? "bg-cyan-500/10 border-cyan-400 text-cyan-600" : "bg-white border-slate-200"}`}>
                                 <div className="flex items-center gap-2.5">
                                   <span className={`w-5 h-5 rounded-md flex justify-center items-center text-[9px] font-black shrink-0 ${examSelections[q.id] === optIdx ? "bg-cyan-500 text-slate-950" : "bg-slate-200 text-slate-500"}`}>{String.fromCharCode(65 + optIdx)}</span>
                                   <ReactMarkdown>{opt}</ReactMarkdown>
                                 </div>
                               </button>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center pt-6"><button onClick={evaluateExamAnswers} className="px-10 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-[1.01]">উত্তর জমা দিন</button></div>
                  </div>
                )}
                
                {examState === "ended" && examResultStats && (
                  <div className="p-6 text-center space-y-4">
                    <h4 className="text-lg font-black text-slate-800">ফলাফল কার্ড</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white p-4 border rounded-2xl"><span className="text-xl font-black text-emerald-500">{examResultStats.correctCount}</span></div>
                      <div className="bg-white p-4 border rounded-2xl"><span className="text-xl font-black text-red-500">{examResultStats.incorrectCount}</span></div>
                      <div className="bg-white p-4 border rounded-2xl"><span className="text-xl font-black text-cyan-400">{examResultStats.accuracy}%</span></div>
                      <div className="bg-white p-4 border rounded-2xl"><span className="text-xl font-black text-yellow-500">+{examResultStats.xpEarned}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* --- END ORIGINAL COMPONENT CONTENT WRAPPER --- */}

          </div>
        </div>
      )}

      {/* AI DRAWER (Shared) */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setAiDrawerOpen(false)} />
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-lg transition-transform bg-white h-full flex flex-col shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-500"/> AI Coach</h4>
                <button onClick={() => setAiDrawerOpen(false)} className="p-2 bg-gray-100 rounded-xl"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {aiLoading ? <p>Thinking...</p> : <ReactMarkdown>{aiTutorResponse}</ReactMarkdown>}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}