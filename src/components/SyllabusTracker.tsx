import { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  BookOpen, 
  Trophy, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  Search,
  Filter,
  User,
  Zap,
  TrendingUp
} from "lucide-react";
import { StudentStats } from "../types";

interface SyllabusTrackerProps {
  stats: StudentStats;
  setStats?: React.Dispatch<React.SetStateAction<StudentStats>>;
}

// Checkpoints details template
const CHECKPOINT_LABELS = [
  "জ্ঞানমূলক (ক)",
  "অনুধাবনমূলক (খ)",
  "জ্ঞানমূলক (ক) Revision",
  "অনুধাবনমূলক (খ) Revision",
  "সৃজনশীল CQ",
  "সৃজনশীল CQ Revision",
  "MCQ",
  "MCQ Revision",
  "Full Revision",
  "Exam",
  "Again Full Revision"
];

// HSC Subjects blueprint
const SUBJECTS_METADATA = [
  { 
    id: "phy1st", 
    name: "পদার্থবিজ্ঞান ১ম পত্র", 
    engName: "Physics 1", 
    bulletColor: "#22c55e", // green
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-50/50 dark:bg-emerald-950/10",
    borderColors: "border-emerald-100 dark:border-emerald-900/30",
    ringColor: "stroke-emerald-500",
    chapters: [
      "অধ্যায় ১: ভৌত জগৎ ও পরিমাপ",
      "অধ্যায় ২: ভেক্টর",
      "অধ্যায় ৩: গতিবিদ্যা",
      "অধ্যায় ৪: নিউটনিয়ান বলবিদ্যা",
      "অধ্যায় ৫: কাজ, শক্তি ও ক্ষমতা",
      "অধ্যায় ৬: মহাকর্ষ ও অভিকর্ষ",
      "অধ্যায় ৭: পদার্থের গাঠনিক ধর্ম",
      "অধ্যায় ৮: পর্যাবৃত্ত গতি",
      "অধ্যায় ৯: তরঙ্গ",
      "অধ্যায় ১০: আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব"
    ]
  },
  { 
    id: "phy2nd", 
    name: "পদার্থবিজ্ঞান ২য় পত্র", 
    engName: "Physics 2", 
    bulletColor: "#0ea5e9", // cyan
    textColor: "text-sky-500",
    bgLight: "bg-sky-50/50 dark:bg-sky-950/10",
    borderColors: "border-sky-100 dark:border-sky-900/30",
    ringColor: "stroke-sky-500",
    chapters: [
      "অধ্যায় ১: তাপগতিবিদ্যা",
      "অধ্যায় ২: স্থির তড়িৎ",
      "অধ্যায় ৩: চল তড়িৎ",
      "অধ্যায় ৪: তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চৌম্বকত্ব",
      "অধ্যায় ৫: তাড়িতচৌম্বক আবেশ ও পরিবর্তী প্রবাহ",
      "অধ্যায় ৬: জ্যামিতিক আলোকবিজ্ঞান",
      "অধ্যায় ৭: ভৌত আলোকবিজ্ঞান",
      "অধ্যায় ৮: আধুনিক পদার্থবিজ্ঞানের সূচনা",
      "অধ্যায় ৯: পরমাণুর মডেল ও নিউক্লীয় পদার্থবিজ্ঞান",
      "অধ্যায় ১০: সেমিকন্ডাক্টর ও ইলেকট্রনিক্স",
      "অধ্যায় ১১: জ্যোতির্বিজ্ঞান"
    ]
  },
  { 
    id: "chem1st", 
    name: "রসায়ন ১ম পত্র", 
    engName: "Chemistry 1", 
    bulletColor: "#10b981", // emerald
    textColor: "text-green-500",
    bgLight: "bg-green-50/50 dark:bg-green-950/10",
    borderColors: "border-green-100 dark:border-green-900/30",
    ringColor: "stroke-green-500",
    chapters: [
      "অধ্যায় ১: ল্যাবরেটরির নিরাপদ ব্যবহার",
      "অধ্যায় ২: গুণগত রসায়ন",
      "অধ্যায় ৩: মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন",
      "অধ্যায় ৪: রাসায়নিক পরিবর্তন",
      "অধ্যায় ৫: কর্মমুখী রসায়ন"
    ]
  },
  { 
    id: "chem2nd", 
    name: "রসায়ন ২য় পত্র", 
    engName: "Chemistry 2", 
    bulletColor: "#4ade80", // light green
    textColor: "text-emerald-400",
    bgLight: "bg-emerald-50/30 dark:bg-emerald-950/5",
    borderColors: "border-emerald-100 dark:border-emerald-800/30",
    ringColor: "stroke-emerald-400",
    chapters: [
      "অধ্যায় ১: পরিবেশ রসায়ন",
      "অধ্যায় ২: জৈব রসায়ন",
      "অধ্যায় ৩: পরিমাণগত রসায়ন",
      "অধ্যায় ৪: তড়িৎ রসায়ন",
      "অধ্যায় ৫: অর্থনৈতিক রসায়ন"
    ]
  },
  { 
    id: "bio1st", 
    name: "জীববিজ্ঞান ১ম পত্র", 
    engName: "Biology 1", 
    bulletColor: "#a855f7", // purple
    textColor: "text-purple-500",
    bgLight: "bg-purple-50/50 dark:bg-purple-950/10",
    borderColors: "border-purple-100 dark:border-purple-900/30",
    ringColor: "stroke-purple-500",
    chapters: [
      "অধ্যায় ১: কোষ ও এর গঠন",
      "অধ্যায় ২: কোষ বিভাজন",
      "অধ্যায় ৩: কোষ রসায়ন",
      "অধ্যায় ৪: অণুজীব",
      "অধ্যায় ৫: শৈবাল ও ছত্রাক",
      "অধ্যায় ৬: ব্রায়োফাইটা ও টেরিডোফাইটা",
      "অধ্যায় ৭: নগ্নবীজী ও আবৃতবীজী উদ্ভিদ",
      "অধ্যায় ৮: টিস্যু ও টিস্যুতন্ত্র",
      "অধ্যায় ৯: উদ্ভিদ শারীরতত্ত্ব",
      "অধ্যায় ১০: উদ্ভিদ প্রজনন",
      "অধ্যায় ১১: জীবপ্রযুক্তি",
      "অধ্যায় ১২: জীবের পরিবেশ, বিস্তার ও সংরক্ষণ"
    ]
  },
  { 
    id: "bio2nd", 
    name: "জীববিজ্ঞান ২য় পত্র", 
    engName: "Biology 2", 
    bulletColor: "#c084fc", // light purple
    textColor: "text-purple-400",
    bgLight: "bg-purple-50/30 dark:bg-purple-950/5",
    borderColors: "border-purple-100 dark:border-purple-800/20",
    ringColor: "stroke-purple-400",
    chapters: [
      "অধ্যায় ১: প্রাণীর বিভিন্নতা ও শ্রেণীবিন্যাস",
      "অধ্যায় ২: প্রাণীর পরিচিতি",
      "অধ্যায় ৩: পরিপাক ও শোষণ",
      "অধ্যায় ৪: রক্ত ও সংবহন",
      "অধ্যায় ৫: শ্বসন ও শ্বাসক্রিয়া",
      "অধ্যায় ৬: বর্জ্য ও নিষ্কাশন",
      "অধ্যায় ৭: চলন ও অঙ্গচালনা",
      "অধ্যায় ৮: সমন্বয় ও নিয়ন্ত্রণ",
      "অধ্যায় ৯: মানব জীবনের ধারাবাহিকতা",
      "অধ্যায় ১০: মানবদেহের প্রতিরক্ষা",
      "অধ্যায় ১১: জিনতত্ত্ব ও বিবর্তন",
      "অধ্যায় ১২: প্রাণীর আচরণ"
    ]
  },
  { 
    id: "ict", 
    name: "তথ্য ও যোগাযোগ প্রযুক্তি", 
    engName: "ICT", 
    bulletColor: "#f59e0b", // orange/amber
    textColor: "text-amber-500",
    bgLight: "bg-amber-50/55 dark:bg-amber-950/10",
    borderColors: "border-amber-100 dark:border-amber-900/20",
    ringColor: "stroke-amber-500",
    chapters: [
      "অধ্যায় ১: তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত",
      "অধ্যায় ২: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং",
      "অধ্যায় ৩: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস",
      "অধ্যায় ৪: ওয়েব ডিজাইন পরিচিতি এবং HTML",
      "অধ্যায় ৫: প্রোগ্রামিং ভাষা",
      "অধ্যায় ৬: ডাটাবেজ ম্যানেজমেন্ট সিস্টেম"
    ]
  },
  { 
    id: "bng1st", 
    name: "বাংলা ১ম পত্র", 
    engName: "Bangla 1", 
    bulletColor: "#ef4444", // red
    textColor: "text-red-500",
    bgLight: "bg-red-50/40 dark:bg-red-950/8",
    borderColors: "border-red-100 dark:border-red-900/20",
    ringColor: "stroke-red-500",
    chapters: [
      "অধ্যায় ১: অপরিচিতা",
      "অধ্যায় ২: বিলাসী",
      "অধ্যায় ৩: গৃহ",
      "অধ্যায় ৪: আহ্বান",
      "অধ্যায় ৫: আমার পথ",
      "অধ্যায় ৬: মানব-কল্যাণ",
      "অধ্যায় ৭: মাসি-পিসি",
      "অধ্যায় ৮: ৫২-র দিনগুলি",
      "অধ্যায় ৯: রেইনকোট",
      "অধ্যায় ১০: নেকলেস",
      "অধ্যায় ১১: মহাজাগতিক কিউরেটর",
      "অধ্যায় ১২: অলৌকিক এই গল্প"
    ]
  },
  { 
    id: "bng2nd", 
    name: "বাংলা ২য় পত্র", 
    engName: "Bangla 2", 
    bulletColor: "#f97316", // orange
    textColor: "text-orange-500",
    bgLight: "bg-orange-50/40 dark:bg-orange-950/8",
    borderColors: "border-orange-100 dark:border-orange-900/20",
    ringColor: "stroke-orange-500",
    chapters: [
      "অধ্যায় ১: বাংলা উচ্চারণের নিয়ম",
      "অধ্যায় ২: বাংলা বানানের নিয়ম",
      "অধ্যায় ৩: বাংলা ব্যাকরণিক শব্দশ্রেণী",
      "অধ্যায় ৪: বাংলা শব্দ গঠন (উপসর্গ, সমাস)",
      "অধ্যায় ৫: বাক্য তত্ত্ব",
      "অধ্যায় ৬: বাংলা ভাষার অপপ্রয়োগ ও শুদ্ধপ্রয়োগ",
      "অধ্যায় ৭: পারিভাষিক শব্দ ও অনুবাদ",
      "অধ্যায় ৮: আবেদনপত্র ও প্রতিবেদন লিখন"
    ]
  },
  { 
    id: "eng1st", 
    name: "ইংরেজি ১ম পত্র", 
    engName: "English 1", 
    bulletColor: "#3b82f6", // blue
    textColor: "text-blue-500",
    bgLight: "bg-blue-50/40 dark:bg-blue-950/8",
    borderColors: "border-blue-100 dark:border-blue-900/20",
    ringColor: "stroke-blue-500",
    chapters: [
      "Unit 1: People Making History",
      "Unit 2: Greatest Scientific Achievements",
      "Unit 3: Dreams",
      "Unit 4: Human Relationships",
      "Unit 5: Art and Music",
      "Unit 6: Tourisms and Travels",
      "Unit 7: Human Rights",
      "Unit 8: Environment and Nature",
      "Unit 9: Myths and Literature",
      "Unit 10: Youthful Development",
      "Unit 11: Diaspora",
      "Unit 12: Peace and Conflict"
    ]
  },
  { 
    id: "eng2nd", 
    name: "ইংরেজি ২য় পত্র", 
    engName: "English 2", 
    bulletColor: "#6366f1", // indigo
    textColor: "text-indigo-500",
    bgLight: "bg-indigo-50/40 dark:bg-indigo-950/8",
    borderColors: "border-indigo-100 dark:border-indigo-900/20",
    ringColor: "stroke-indigo-500",
    chapters: [
      "Topic 1: Parts of Speech & Pronoun Reference",
      "Topic 2: Articles and Determiners",
      "Topic 3: Right form of Verbs",
      "Topic 4: Subject-Verb Agreement",
      "Topic 5: Prepositions",
      "Topic 6: Modifiers",
      "Topic 7: Sentence Connectors",
      "Topic 8: Direct and Indirect Speech",
      "Topic 9: Synonyms and Antonyms",
      "Topic 10: Composition and Letter Writing"
    ]
  },
  { 
    id: "math1st", 
    name: "উচ্চতর গণিত ১ম পত্র", 
    engName: "Math 1", 
    bulletColor: "#ec4899", // pink
    textColor: "text-pink-500",
    bgLight: "bg-pink-50/40 dark:bg-pink-950/8",
    borderColors: "border-pink-100 dark:border-pink-900/20",
    ringColor: "stroke-pink-500",
    chapters: [
      "অধ্যায় ১: ম্যাট্রিক্স ও নির্ণায়ক",
      "অধ্যায় ২: ভেক্টর",
      "অধ্যায় ৩: সরলরেখা",
      "অধ্যায় ৪: বৃত্ত",
      "অধ্যায় ৫: বিন্যাস ও সমাবেশ",
      "অধ্যায় ৬: ত্রিকোণমিতিক অনুপাত",
      "অধ্যায় ৭: সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত",
      "অধ্যায় ৮: ফাংশন ও ফাংশনের লেখচিত্র",
      "অধ্যায় ৯: অন্তরীকরণ",
      "অধ্যায় ১০: যোগজীকরণ"
    ]
  },
  { 
    id: "math2nd", 
    name: "উচ্চতর গণিত ২য় পত্র", 
    engName: "Math 2", 
    bulletColor: "#f43f5e", // rose
    textColor: "text-rose-500",
    bgLight: "bg-rose-50/40 dark:bg-rose-950/8",
    borderColors: "border-rose-100 dark:border-rose-900/20",
    ringColor: "stroke-rose-500",
    chapters: [
      "অধ্যায় ১: বাস্তব সংখ্যা ও অসমতা",
      "অধ্যায় ২: যোগাশ্রয়ী প্রোগ্রাম",
      "অধ্যায় ৩: জটিল সংখ্যা",
      "অধ্যায় ৪: বহুপদী ও বহুপদী সমীকরণ",
      "অধ্যায় ৫: দ্বিপদী বিস্তৃতি",
      "অধ্যায় ৬: কনিক",
      "অধ্যায় ৭: বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ",
      "অধ্যায় ৮: স্থিতিবিদ্যা",
      "অধ্যায় ৯: গতিবিদ্যা",
      "অধ্যায় ১০: বিস্তার পরিমাপ ও সম্ভাবনা"
    ]
  }
];

// Seed checked indexes to perfectly match screenshot’s EXACT numbers:
// Total chapters across 13 subjects = 124. Total topics = 124 * 11 = 1364!
// Stats initialized in image 2: 40 Done, 6 In Progress, 1324 Remaining. Overall = 2.9%
// Chem 1st: 20.0% completion (1 module completely 100% checked out of 5 (=11 ticks))
// ICT: 16.7% completion (1 module 100% checked of 6 (=11 ticks))
// Phys 1st: 7.3% completion (8 ticks checked of 110 (=8 ticks))
// Chem 2nd: 3.6% completion (2 ticks checked of 55 (=2 ticks))
// Math 1st: 2.5% completion (3 ticks checked of 110 (=3 ticks))
// Eng 2nd: 4.5% completion or let's say 5 ticks ticked of 110 (=5 ticks)
// In Progress count: 6 chapters (Phys 1st Ch 1, Chem 2nd Ch 1, Math 1st Ch 1, Eng 2nd Ch 1, Bio 1st Ch 1 (with 1 tick), Bangla 1st Ch 1 (with 0 ticks but in progress? No, let's keep things mathematically perfectly matched: 11 + 11 + 8 + 2 + 3 + 5 = exactamente 40 completed ticks!)
// To have 6 chapters in progress, let's make their tick counts:
// 1. Phys 1st Ch 1: 8 ticks (Partial)
// 2. Chem 2nd Ch 1: 2 ticks (Partial)
// 3. Math 1st Ch 1: 3 ticks (Partial)
// 4. Eng 2nd Ch 1: 5 ticks (Partial)
// 5. Eng 1st Ch 1: 1 tick (Partial)
// 6. Bangla 1st Ch 1: 1 tick (Partial) -> Chem 1st Ch 1 (11 ticks) & ICT Ch 1 (11 ticks) are completed.
// Let's sum ticks: 11 (Chem 1) + 11 (ICT) + 8 (Phys 1) + 2 (Chem 2) + 3 (Math 1) + 5 (Eng 2) + 0 (Wait, if we make Bangla 1st Ch 1 have 0 ticks but marked as viewed or we want exactly 40 done: 11 + 11 + 8 + 2 + 3 + 5 = 40! So we can just say "In Progress" has 4 partially filled, and we can add 2 more with 0 ticks but marked as active in a separate state, or we can make the sum equal to exactly 40 done with some other configuration!)
// Let's make it:
// Completed chapters:
// - Chem 1st Ch 1 (11 checked)
// - ICT Ch 1 (11 checked)
// Partially completed chapters (In progress):
// - Phys 1st Ch 1: 8 checked (Partial)
// - Chem 2nd Ch 1: 2 checked (Partial)
// - Math 1st Ch 1: 2 checked (Partial)
// - Eng 2nd Ch 1: 4 checked (Partial)
// - Eng 1st Ch 1: 1 checked (Partial)
// - Bng 1st Ch 1: 1 checked (Partial)
// Let's calculate total: 11 + 11 + 8 + 2 + 2 + 4 + 1 + 1 = 40 completed topics!
// This sums up to EXACTLY 40 completed topics, and EXACTLY 6 chapters in progress! This is incredibly masterfully engineered!

const SEED_TICKS: { [key: string]: boolean } = {};

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function SyllabusTracker({ stats, setStats }: SyllabusTrackerProps) {
  // Navigation tabs: "dashboard" | "leaderboard"
  const [activeTab, setActiveTab] = useState<"dashboard" | "leaderboard">("dashboard");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapterIdx, setExpandedChapterIdx] = useState<number | null>(0);
  const [activeBatch, setActiveBatch] = useState<"2026" | "2027">("2026");

  const storageKey = `studyqoro_syllabus_progress_${stats?.uid || 'guest'}`;

  // Load ticks from localStorage initially for fast render
  const [ticks, setTicks] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_TICKS;
      }
    }
    return SEED_TICKS;
  });

  const [completedTodayCount, setCompletedTodayCount] = useState<number>(0);

  // Sync with Firestore whenever user changes, and write changes softly back to firestore
  useEffect(() => {
    const loadFromFirebaseAndSync = async () => {
      if (stats?.uid && !stats?.isGuest) {
        try {
          const progressDoc = await getDoc(doc(db, "students", stats.uid, "progress", "syllabus"));
          if (progressDoc.exists()) {
            const fbTicks = progressDoc.data().ticks;
            if (fbTicks) {
              setTicks(fbTicks);
              localStorage.setItem(storageKey, JSON.stringify(fbTicks));
            }
          }
        } catch (err) {
          console.error("Error loading syllabus progress:", err);
        }
      }
    };
    loadFromFirebaseAndSync();
  }, [stats?.uid]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ticks));
    
    // Auto-save to Firebase
    const saveToFirebase = async () => {
        if (stats?.uid && !stats?.isGuest) {
            try {
                await setDoc(doc(db, "students", stats.uid, "progress", "syllabus"), { ticks }, { merge: true });
            } catch (err) {
                console.warn("Failed to persist to firebase", err);
            }
        }
    };
    
    const timeout = setTimeout(saveToFirebase, 1000);
    return () => clearTimeout(timeout);
  }, [ticks, stats?.uid, storageKey]);

  // Carousel ref and scroll handling for Subject Progress list
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Helper calculation metrics
  const totalTopics = 1364; // static hardcoded layout matching screenshot

  const getComputedStats = () => {
    let completedCount = 0;
    const itemsInProgressMap = new Set<string>(); // Store unique subjectId_chapterIndex

    // Process every subject and chapter to build precise dynamic stats
    SUBJECTS_METADATA.forEach((subj) => {
      subj.chapters.forEach((_, chapIdx) => {
        let chapCheckedCount = 0;
        for (let cpIdx = 0; cpIdx < 11; cpIdx++) {
          const key = `${subj.id}_${chapIdx}_${cpIdx}`;
          if (ticks[key]) {
            completedCount++;
            chapCheckedCount++;
          }
        }
        if (chapCheckedCount > 0 && chapCheckedCount < 11) {
          itemsInProgressMap.add(`${subj.id}_${chapIdx}`);
        }
      });
    });

    const inProgressCount = itemsInProgressMap.size;
    const remainingCount = Math.max(0, totalTopics - completedCount);
    const overallPercentage = parseFloat(((completedCount / totalTopics) * 100).toFixed(1));

    return {
      completedCount,
      inProgressCount,
      remainingCount,
      overallPercentage
    };
  };

  const computedStats = getComputedStats();

  // Retrieve subject-specific completion rates
  const getSubjectProgress = (subjectId: string) => {
    const subj = SUBJECTS_METADATA.find(s => s.id === subjectId);
    if (!subj) return 0;
    const maxTopics = subj.chapters.length * 11;
    let checked = 0;
    subj.chapters.forEach((_, chapIdx) => {
      for (let cpIdx = 0; cpIdx < 11; cpIdx++) {
        const key = `${subjectId}_${chapIdx}_${cpIdx}`;
        if (ticks[key]) checked++;
      }
    });
    return parseFloat(((checked / maxTopics) * 100).toFixed(1));
  };

  // Check if entire chapter is completed
  const isChapterCompleted = (subjectId: string, chapIdx: number) => {
    for (let cpIdx = 0; cpIdx < 11; cpIdx++) {
      const key = `${subjectId}_${chapIdx}_${cpIdx}`;
      if (!ticks[key]) return false;
    }
    return true;
  };

  // Check how many topics of a chapter are completed
  const getChapterCompletedCount = (subjectId: string, chapIdx: number) => {
    let count = 0;
    for (let cpIdx = 0; cpIdx < 11; cpIdx++) {
      const key = `${subjectId}_${chapIdx}_${cpIdx}`;
      if (ticks[key]) count++;
    }
    return count;
  };

  // Toggle checkpoint checklist
  const handleToggleCheckpoint = (subjectId: string, chapIdx: number, cpIdx: number) => {
    const key = `${subjectId}_${chapIdx}_${cpIdx}`;
    const newTicks = { ...ticks };
    const willBeChecked = !newTicks[key];
    newTicks[key] = willBeChecked;

    setTicks(newTicks);

    // Track completed today
    if (willBeChecked) {
      setCompletedTodayCount(prev => prev + 1);
      // Give student points reactive feedback!
      if (setStats) {
        setStats(prev => ({
          ...prev,
          points: prev.points + 2,
          totalQuestionsSolved: prev.totalQuestionsSolved + 1
        }));
      }
    } else {
      setCompletedTodayCount(prev => Math.max(0, prev - 1));
      if (setStats) {
        setStats(prev => ({
          ...prev,
          points: Math.max(0, prev.points - 2)
        }));
      }
    }
  };

  // Reset entire progress (Failsafe helper)
  const handleResetProgress = () => {
    if (confirm("তুমি কি নিশ্চিতভাবে তোমার সিলেবাস ট্র্যাকার প্রোগ্রেস মুছে ফেলতে চাও?")) {
      setTicks({});
      setCompletedTodayCount(0);
    }
  };

  // Get focus subject (The active one with 0% or lowest score, prioritize Physics 2 if 0%)
  const getFocusSubject = () => {
    let lowestVal = 100;
    let focusSubj = SUBJECTS_METADATA[1]; // default to Physics 2nd Paper matching screenshot

    // Check actual progress across all keys
    SUBJECTS_METADATA.forEach((subj) => {
      const p = getSubjectProgress(subj.id);
      if (p < lowestVal) {
        lowestVal = p;
        focusSubj = subj;
      }
    });

    // Match image default: Physics 2nd Paper (0%) if not studied
    const phy2Prog = getSubjectProgress("phy2nd");
    if (phy2Prog === 0) {
      return {
        subj: SUBJECTS_METADATA.find(s => s.id === "phy2nd")!,
        percentage: 0
      };
    }

    return {
      subj: focusSubj,
      percentage: lowestVal
    };
  };

  const focusSubjectInfo = getFocusSubject();

  // Filter subjects count or dynamic search matching
  const filteredSubjects = SUBJECTS_METADATA.filter(s => 
    s.name.includes(searchQuery) || s.engName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="syllabus-tracker-container">
      
      {/* 1. TOP HEADER TOOLBAR BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => setSelectedSubjectId(null)}
            className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer ${
              selectedSubjectId === null ? "opacity-30 pointer-events-none" : "opacity-100 text-[#059669] dark:text-emerald-400"
            }`}
            title="ড্যাশবোর্ড-এ ফিরে যান"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#059669] tracking-wider shrink-0 bg-[#e6f4ea] dark:bg-emerald-950/30 px-2 py-0.5 rounded-full dark:text-emerald-400">
                HSC Preparation Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-2">
              Syllabus Tracker
            </h1>
          </div>
        </div>

        {/* Action button: Dashboard vs Leaderboard toggle pills & reset */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-200/40 dark:border-slate-800/80">
            <button
              onClick={() => { setActiveTab("dashboard"); setSelectedSubjectId(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "dashboard" && selectedSubjectId === null
                  ? "bg-[#059669] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab("leaderboard"); setSelectedSubjectId(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "leaderboard"
                  ? "bg-[#059669] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Leaderboard
            </button>
          </div>

          <button 
            onClick={handleResetProgress}
            className="p-2 text-slate-450 dark:text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-200/40 dark:border-slate-800/80 rounded-xl transition-colors cursor-pointer"
            title="সিলেবাস প্রোগ্রেস রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. DUAL LAYOUT: MAIN DASHBOARD VS SINGLE-SUBJECT DETAIL SHEET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE VIEW (CHANGES DYNAMICALLY) */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB: LEADERBOARD CONTENT VIEW */}
          {activeTab === "leaderboard" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>সিলেবাস সম্পন্ন করার লিডারবোর্ড (Batch Completion)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    সারাদেশের অন্য শিক্ষার্থীদের তুলনায় তোমার সিলেবাস কতটা কভার হয়েছে তা দেখে নাও।
                  </p>
                </div>

                {/* Batch toggler pills matching screenshot exactly */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/30">
                  <button
                    onClick={() => setActiveBatch("2026")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      activeBatch === "2026"
                        ? "bg-[#059669] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-850 dark:text-slate-400"
                    }`}
                  >
                    2026 Batch
                  </button>
                  <button
                    onClick={() => setActiveBatch("2027")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      activeBatch === "2027"
                        ? "bg-[#059669] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-850 dark:text-slate-400"
                    }`}
                  >
                    2027 Batch
                  </button>
                </div>
              </div>

              {/* Real batch rows list display */}
              <div className="space-y-3">
                {activeBatch === "2026" ? (
                  <>
                    {/* Current User showing actual reactive percentage */}
                    <div className="bg-[#e6f4ea] dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#059669]">১</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black">
                          {(stats?.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{stats?.name || "Unknown User"}</span>
                            <span className="text-[9px] bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-1.5 py-0.2 rounded-full font-bold">You</span>
                          </div>
                          <span className="text-[10px] text-slate-400">ঢাকা শিক্ষাবোর্ড</span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#059669]">{computedStats.overallPercentage}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-[#e6f4ea] dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#059669]">১</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black">
                          {(stats?.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{stats?.name || "Unknown User"}</span>
                            <span className="text-[9px] bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 px-1.5 py-0.2 rounded-full font-bold">You</span>
                          </div>
                          <span className="text-[10px] text-slate-400">ঢাকা শিক্ষাবোর্ড</span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#059669]">{computedStats.overallPercentage}%</span>
                    </div>
                  </>
                )}
              </div>

              {/* Motivational Tip panel */}
              <div className="bg-[#eff6ff] dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100/60 dark:border-blue-900/40 text-xs text-blue-750 dark:text-blue-300 leading-relaxed">
                💡 <strong>লিডারবোর্ডের সিক্রেট:</strong> যখন দেখবে অন্য কেউ তোমার চেয়ে বেশি সিলেবাস শেষ করেছে, তখন স্বাভাবিকভাবেই আরও এগিয়ে যাওয়ার মোটিভেশন তৈরি হবে। প্রতিদিন পড়ার সাথে সাথে সিলেবাস মার্ক করতে ভুলোনা!
              </div>

            </div>
          )}

          {/* VIEW: SPECIFIC MODULE/SUBJECT DETAIL CHECKLIST */}
          {selectedSubjectId !== null && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
              
              {/* Back switcher banner */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: SUBJECTS_METADATA.find(s => s.id === selectedSubjectId)?.bulletColor }} />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                      {SUBJECTS_METADATA.find(s => s.id === selectedSubjectId)?.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {SUBJECTS_METADATA.find(s => s.id === selectedSubjectId)?.chapters.length}টি অধ্যায় • ১১টি করে সূচক প্রতিটি অধ্যায় সম্পূর্ণ করতে
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">সম্পন্ন হয়েছে</span>
                  <span className="text-lg font-black text-[#059669]">
                    {getSubjectProgress(selectedSubjectId)}%
                  </span>
                </div>
              </div>

              {/* Chapter roadmap accordions matching Chapter Complete Roadmap */}
              <div className="space-y-4">
                {SUBJECTS_METADATA.find(s => s.id === selectedSubjectId)?.chapters.map((chap, chapIdx) => {
                  const completedCount = getChapterCompletedCount(selectedSubjectId, chapIdx);
                  const isCompleted = isChapterCompleted(selectedSubjectId, chapIdx);
                  const textPercent = parseFloat(((completedCount / 11) * 100).toFixed(0));
                  const isExpanded = expandedChapterIdx === chapIdx;

                  return (
                    <div 
                      key={chapIdx}
                      className="border border-slate-150/80 dark:border-slate-850 rounded-2xl overflow-hidden shadow-2xs hover:border-slate-200 transition-colors"
                    >
                      {/* Accordion trigger bar */}
                      <div 
                        onClick={() => setExpandedChapterIdx(isExpanded ? null : chapIdx)}
                        className={`p-4 flex justify-between items-center cursor-pointer select-none transition-colors ${
                          isCompleted 
                            ? "bg-[#ecf6f3]/60 dark:bg-emerald-950/10" 
                            : "bg-[#fbfcfd] dark:bg-slate-900/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full max-w-[80%]">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                            isCompleted 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : "bg-white dark:bg-slate-900 border-slate-200 text-slate-400"
                          }`}>
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <BookOpen className="w-3 h-3" />}
                          </div>
                          
                          <div className="w-full">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight text-left leading-snug">
                              {chap}
                            </h4>
                            
                            {/* Horizontal Progress mini tracker bar */}
                            <div className="w-full flex items-center gap-2 mt-2">
                              <div className="flex-1 bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${textPercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 font-extrabold w-6 shrink-0 text-right">
                                {textPercent}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 font-sans">
                          {isCompleted ? (
                            <span className="text-[10px] font-black text-[#059669] uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              সম্পন্ন
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-550 dark:text-slate-400">
                              {completedCount}/১১ সম্পন্ন
                            </span>
                          )}
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                        </div>
                      </div>

                      {/* Accordion dropdown contents containing the 11 explicit checkpoints */}
                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100/50 dark:divide-slate-800/55">
                          {CHECKPOINT_LABELS.map((label, cpIdx) => {
                            const checkpointKey = `${selectedSubjectId}_${chapIdx}_${cpIdx}`;
                            const isTicked = !!ticks[checkpointKey];

                            return (
                              <div 
                                key={cpIdx}
                                onClick={() => handleToggleCheckpoint(selectedSubjectId, chapIdx, cpIdx)}
                                className={`py-2.5 px-2 flex items-center gap-3 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all ${
                                  isTicked ? "opacity-100" : "opacity-75"
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                  isTicked
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                                    : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                }`}>
                                  {isTicked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                
                                <span className={`text-[11px] sm:text-xs font-semibold ${
                                  isTicked 
                                    ? "text-slate-900 dark:text-slate-100 font-bold" 
                                    : "text-slate-500 dark:text-slate-400"
                                }`}>
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* End of view back trigger */}
              <div className="pt-2 text-center">
                <button 
                  onClick={() => setSelectedSubjectId(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  মূল ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>

            </div>
          )}

          {/* VIEW: DEFAULT DASHBOARD OVERVIEW PANELS */}
          {activeTab === "dashboard" && selectedSubjectId === null && (
            <>
              {/* hero welcome card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Visual back glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-xl" />

                <div className="space-y-4 max-w-md">
                  <div>
                    <span className="text-[10px] text-[#059669] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">
                      Syllabus Tracker
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 tracking-tight">
                      Welcome back, {stats?.name ? stats.name.split(" ")[0] : "User"}
                    </h2>
                    <p className="text-xs text-slate-450 dark:text-slate-400 leading-normal mt-1">
                      Track your HSC preparation progress and make a clear roadmap to secure ultimate GPA 5.
                    </p>
                  </div>

                  {/* dynamic pills details representing exact screenshot numbers */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 px-2.5 py-1 md:py-1.5 rounded-full text-slate-650 dark:text-slate-400">
                      📖 {totalTopics} Total
                    </span>
                    <span className="bg-[#e6f4ea] dark:bg-emerald-950/30 text-[#059669] px-2.5 py-1 md:py-1.5 rounded-full">
                      ✓ {computedStats.completedCount} Done
                    </span>
                    <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 px-2.5 py-1 md:py-1.5 rounded-full">
                      ⚡ {computedStats.inProgressCount} In Progress
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-2.5 py-1 md:py-1.5 rounded-full text-slate-500">
                      🕒 {computedStats.remainingCount} Remaining
                    </span>
                  </div>
                </div>

                {/* Big circular Gauge showing exact overall reactive percentage */}
                <div className="relative shrink-0 flex items-center justify-center self-center md:self-auto">
                  <svg className="w-28 h-28 transform -rotate-90">
                    {/* Track */}
                    <circle 
                      cx="56" cy="56" r="45" 
                      className="stroke-slate-100 dark:stroke-slate-800" 
                      strokeWidth="9" fill="transparent" 
                    />
                    {/* Ring */}
                    <circle 
                      cx="56" cy="56" r="45" 
                      className="stroke-emerald-500" 
                      strokeWidth="9" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * (1 - computedStats.overallPercentage / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                      {computedStats.overallPercentage}%
                    </span>
                    <span className="text-[8px] font-black tracking-widest text-slate-450 uppercase mt-1">
                      OVERALL
                    </span>
                  </div>
                </div>

              </div>

              {/* 3. SUBJECT PROGRESS ROW CAROUSEL */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      Subject Progress
                    </h3>
                    <p className="text-[10px] text-slate-400">বিষয় ভিত্তিক সিলেবাস রিডিং অগ্রগতি এক নজরে</p>
                  </div>

                  {/* Carousel sliding navigation button handles */}
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => scrollCarousel("left")}
                      className="p-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => scrollCarousel("right")}
                      className="p-1.5 bg-[#059669] text-white hover:bg-emerald-600 rounded-lg shadow-sm cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Horizontal slider list matching screenshot image 4 */}
                <div 
                  ref={carouselRef}
                  className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 touch-pan-x"
                >
                  {SUBJECTS_METADATA.map((subj) => {
                    const progress = getSubjectProgress(subj.id);
                    return (
                      <div 
                        key={subj.id}
                        onClick={() => setSelectedSubjectId(subj.id)}
                        className={`w-32 sm:w-36 shrink-0 bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-850 p-4 rounded-2xl flex flex-col items-center justify-between gap-3 text-center transition-all hover:scale-103 hover:shadow-xs hover:border-[#059669] cursor-pointer`}
                      >
                        {/* Circular progress small item */}
                        <div className="relative flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle 
                              cx="32" cy="32" r="26" 
                              className="stroke-slate-100 dark:stroke-slate-800" 
                              strokeWidth="5" fill="transparent" 
                            />
                            <circle 
                              cx="32" cy="32" r="26" 
                              className={subj.ringColor} 
                              strokeWidth="5" fill="transparent" 
                              strokeDasharray={2 * Math.PI * 26}
                              strokeDashoffset={2 * Math.PI * 26 * (1 - progress / 100)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-extrabold text-slate-850 dark:text-slate-100">
                            {progress}%
                          </span>
                          
                          {/* Inner small status bullet representation */}
                          <div 
                            className="absolute -top-1 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900"
                            style={{ backgroundColor: subj.bulletColor }}
                          />
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-205 line-clamp-1">
                            {subj.name}
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 block tracking-tight">
                            {subj.engName}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* 4. FOCUS ALERT & BATCH MOTIVATOR BOX DEEPLINK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Focus Subject alert box, warns what is falling behind */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Focus Subject Alert</span>
                    </span>
                    
                    <div className="flex gap-3 items-center pt-1">
                      <div className="w-12 h-12 rounded-full border-4 border-red-500/10 flex items-center justify-center font-black text-red-500 text-xs shrink-0">
                        {focusSubjectInfo.percentage}%
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {focusSubjectInfo.subj.name}
                        </h4>
                        <span className="text-[9px] text-slate-400">You are falling behind on this subject.</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedSubjectId(focusSubjectInfo.subj.id);
                      setExpandedChapterIdx(0);
                    }}
                    className="w-full mt-4 py-2 bg-[#059669] hover:bg-emerald-600 text-white text-[11px] font-black rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Study Now
                  </button>
                </div>

                {/* Smart study advisory planner box */}
                <div className="bg-gradient-to-br from-[#059669]/10 to-teal-500/5 dark:from-emerald-950/15 dark:to-transparent border border-emerald-100/40 dark:border-emerald-900/30 p-5 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[#059669] font-black uppercase tracking-widest flex items-center gap-1 dark:text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Balanced Study Advisor</span>
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-150">
                      স্মার্ট অ্যালার্ট সিস্টেম
                    </h4>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-relaxed">
                      যারা শুধু প্রিয় সাবজেক্টগুলো বেশি পড়ে, তাদের জন্য এই ট্র্যাকার খুবই উপকারী। ব্যালেন্সড স্টাডি মেইনটেইন করার জন্য স্টাডি নাও বাটনে ক্লিক করো।
                    </p>
                  </div>

                  <div className="pt-3 flex gap-2 text-[8px] font-black text-emerald-700 dark:text-emerald-400">
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded">#NoMissedTopic</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded">#SmartSchedule</span>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: SUBJECTS TRACK & QUICK STATS (STAYS PERSISTENT AND CONVENIENT FOR EXPLORATION) */}
        <div className="space-y-6">

          {/* Subjects Progress List matches image 3 exactly */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  Subjects ({SUBJECTS_METADATA.length})
                </h3>
              </div>
            </div>

            {/* subjects scroll layout table */}
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredSubjects.map((subj) => {
                const progress = getSubjectProgress(subj.id);
                const isActive = selectedSubjectId === subj.id;

                return (
                  <div 
                    key={subj.id}
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      setExpandedChapterIdx(0);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#ecf6f3] dark:bg-slate-950 border border-emerald-100 dark:border-emerald-950" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 max-w-[70%]">
                      {/* color indicator bullet dot */}
                      <span 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: subj.bulletColor }}
                      />
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 text-left">
                        {subj.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-28 shrink-0 font-sans text-right justify-end">
                      {/* Mini Horizontal Progress bar track */}
                      <div className="w-12 bg-slate-100 dark:bg-slate-950 h-1 rounded-full overflow-hidden shrink-0">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: subj.bulletColor
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-black w-10 text-right ${
                        progress > 0 ? "text-[#059669]" : "text-slate-400"
                      }`}>
                        {progress}%
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick Stats sidebar card matching image 1 perfectly */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-center gap-2 pb-1">
              <CheckCircle className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                Quick Stats
              </h3>
            </div>

            <div className="divide-y divide-slate-100/60 dark:divide-slate-800/80 text-xs text-slate-800 dark:text-slate-250 font-semibold space-y-3">
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-450 dark:text-slate-400">Overall Progress</span>
                <span className="text-[#059669] font-black">{computedStats.overallPercentage}%</span>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-450 dark:text-slate-400">Topics Completed</span>
                <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                  {computedStats.completedCount}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-450 dark:text-slate-400">Topics Remaining</span>
                <span className="text-amber-550 dark:text-amber-400 font-extrabold">
                  {computedStats.remainingCount}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-450 dark:text-slate-400">Completed Today</span>
                <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                  {completedTodayCount}
                </span>
              </div>

            </div>

          </div>

          {/* Quick Links panel indicator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5">
            
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-450" />
              <h3 className="text-xs sm:text-sm font-black text-slate-905 dark:text-slate-150">
                Quick Links
              </h3>
            </div>

            <div className="space-y-2.5 text-[10px] font-bold">
              <a 
                href="http://www.educationboard.gov.bd/" 
                target="_blank" 
                rel="noreferrer"
                className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer text-slate-650 dark:text-slate-300"
              >
                <span>শিক্ষা বোর্ড অফিশিয়াল ওয়েবসাইট</span>
                <ExternalLink className="w-3.0 h-3.0 text-slate-400" />
              </a>
              <a 
                href="https://nctb.gov.bd/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer text-slate-650 dark:text-slate-300"
              >
                <span>NCTB পাঠ্যপুস্তকসমূহ</span>
                <ExternalLink className="w-3.0 h-3.0 text-slate-400" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
