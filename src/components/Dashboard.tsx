/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Play, 
  Flame, 
  Trophy, 
  ArrowRight, 
  ChevronDown, 
  Lock, 
  Sparkles,
  BookmarkCheck,
  Zap,
  Check,
  Swords,
  Timer,
  ClipboardList,
  Target,
  ChevronRight,
  Sparkle,
  User,
  Activity,
  Heart
} from "lucide-react";
import { StudentStats } from "../types";

// ==========================================
// UNIQUE PREMIUM CONCEPTUAL FLAT VECTOR ILLUSTRATIONS
// ==========================================

function QuestionBankVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#F59E0B" fillOpacity="0.08" />
      <g transform="translate(15, 15)">
        {/* Flat Folder tab design */}
        <path d="M5,15 L25,15 L32,23 L65,23 C68,23 70,25 70,28 L70,55 C70,58 68,60 65,60 L5,60 C2,60 0,58 0,55 L0,18 C0,15 2,15 5,15 Z" fill="#FBBF24" />
        {/* Floating pages coming out */}
        <path d="M15,10 L55,10 C58,10 60,12 60,15 L60,32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="18" y="28" width="34" height="22" rx="4" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
        {/* Page text lines */}
        <line x1="24" y1="34" x2="42" y2="34" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="40" x2="46" y2="40" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="24" y1="45" x2="36" y2="45" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
        {/* Star Sparkle */}
        <polygon points="58,25 61,31 67,32 62,36 64,42 58,38 52,42 54,36 49,32 55,31" fill="#FBBF24" />
      </g>
    </svg>
  );
}

function BattleArenaVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#F43F5E" fillOpacity="0.08" />
      <g transform="translate(18, 18)">
        {/* Shield background */}
        <path d="M32,5 C50,5 58,8 58,15 C58,35 48,50 32,58 C16,50 6,35 6,15 C6,8 14,5 32,5 Z" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2" />
        {/* Crossed energy sabers / lightsabers */}
        <g transform="translate(10, 8)">
          <line x1="4" y1="38" x2="38" y2="4" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="6" y1="36" x2="3" y2="33" stroke="#9F1239" strokeWidth="3.5" strokeLinecap="round" />
          
          <line x1="38" y1="38" x2="4" y2="4" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="36" y1="36" x2="39" y2="33" stroke="#065F46" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        {/* Small collision sparkle */}
        <polygon points="32,22 34,26 38,27 34,29 32,33 30,29 26,27 30,26" fill="#FBBF24" />
      </g>
    </svg>
  );
}

function FocusSpeedVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#0EA5E9" fillOpacity="0.08" />
      <g transform="translate(20, 20)">
        {/* Stopwatch Dial */}
        <circle cx="30" cy="32" r="24" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2.5" />
        {/* Dial ticks */}
        <line x1="30" y1="12" x2="30" y2="16" stroke="#0284C7" strokeWidth="2" />
        <line x1="30" y1="48" x2="30" y2="52" stroke="#0284C7" strokeWidth="2" />
        <line x1="12" y1="32" x2="16" y2="32" stroke="#0284C7" strokeWidth="2" />
        <line x1="48" y1="32" x2="52" y2="32" stroke="#0284C7" strokeWidth="2" />
        {/* High energy Lightning inside stopwatch */}
        <path d="M30,18 L24,30 L31,30 L29,43 L37,29 L31,29 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        {/* Top button */}
        <rect x="25" y="4" width="10" height="4" rx="1" fill="#0284C7" />
        <line x1="30" y1="2" x2="30" y2="5" stroke="#0EA5E9" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

function MockExamVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#10B981" fillOpacity="0.08" />
      <g transform="translate(20, 16)">
        {/* Clipboard backplate */}
        <rect x="8" y="10" width="44" height="54" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" className="dark:fill-slate-900 dark:stroke-slate-100" />
        {/* Top metal clip */}
        <path d="M22,6 C22,4 24,3 27,3 L33,3 C36,3 38,4 38,6 L38,10 L22,10 Z" fill="#64748B" />
        {/* Form rows with custom ticks */}
        <line x1="16" y1="22" x2="40" y2="22" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="32" x2="44" y2="32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="42" x2="32" y2="42" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        {/* Perfect check badge */}
        <circle cx="44" cy="48" r="9" fill="#10B981" />
        <path d="M40.5,48 L43,50.5 L47.5,45.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function StudyHelperAIVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#8B5CF6" fillOpacity="0.08" />
      <g transform="translate(18, 18)">
        {/* Floating Robot Body */}
        <rect x="14" y="20" width="36" height="28" rx="14" fill="#6366F1" stroke="#312E81" strokeWidth="2" />
        {/* Animated Face screen */}
        <rect x="20" y="25" width="24" height="15" rx="6" fill="#1E1B4B" />
        {/* Smart glowing eyes */}
        <circle cx="27" cy="32" r="2.5" fill="#A78BFA" className="animate-pulse" />
        <circle cx="37" cy="32" r="2.5" fill="#A78BFA" className="animate-pulse" />
        {/* Cute AI Ears */}
        <rect x="10" y="28" width="4" height="12" rx="2" fill="#8B5CF6" />
        <rect x="50" y="28" width="4" height="12" rx="2" fill="#8B5CF6" />
        {/* Golden top wifi antenna */}
        <line x1="32" y1="10" x2="32" y2="20" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="32" cy="7" r="3" fill="#F59E0B" />
        {/* Sparkles around bot */}
        <path d="M12,12 L13.5,14 L16,14 L14.5,15 L15,17.5 L12,16 L9,17.5 L9.5,15 L8,14 L10.5,14 Z" fill="#A78BFA" />
      </g>
    </svg>
  );
}

function TrophyLeaderboardVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#14B8A6" fillOpacity="0.08" />
      <g transform="translate(18, 16)">
        {/* Championship trophy */}
        <path d="M12,18 C12,10 18,8 32,8 C46,8 52,10 52,18 C52,36 38,44 32,44 C26,44 12,36 12,18 Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2.5" />
        <path d="M12,14 L4,14 C2,14 2,22 8,22 C12,22 12,18 12,18 Z" stroke="#F59E0B" strokeWidth="2" fill="none" />
        <path d="M52,14 L60,14 C62,14 62,22 56,22 C52,22 52,18 52,18 Z" stroke="#F59E0B" strokeWidth="2" fill="none" />
        <rect x="25" y="44" width="14" height="12" rx="2" fill="#FBBF24" />
        <line x1="20" y1="56" x2="44" y2="56" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        {/* Glow Stars */}
        <polygon points="32,18 34,22 39,23 35,26 36,31 32,28 28,31 29,26 25,23 30,22" fill="#FBBF24" />
      </g>
    </svg>
  );
}

function ProgressTrackerVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#6366F1" fillOpacity="0.08" />
      <g transform="translate(18, 18)">
        {/* Circle radar rings */}
        <circle cx="32" cy="32" r="24" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="32" cy="32" r="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
        {/* Arrow hits center */}
        <line x1="4" y1="60" x2="28" y2="36" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
        <polygon points="28,36 20,38 26,44" fill="#4F46E5" />
        {/* Progressive graph bars behind */}
        <rect x="42" y="12" width="6" height="28" rx="2" fill="#818CF8" />
        <rect x="42" y="24" width="6" height="16" rx="2" fill="#4F46E5" />
      </g>
    </svg>
  );
}

function HistoryLogVector() {
  return (
    <svg className="w-12 h-12 sm:w-14 sm:h-14 select-none pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/250/svg">
      <circle cx="50" cy="50" r="40" fill="#64748B" fillOpacity="0.08" />
      <g transform="translate(18, 18)">
        {/* Circular clock trail with custom arrow */}
        <circle cx="32" cy="32" r="22" stroke="#64748B" strokeWidth="2.5" strokeDasharray="40 10" strokeLinecap="round" fill="none" />
        <path d="M50.5,23.5 L53.5,31 L46,28 Z" fill="#64748B" />
        {/* Sand Glass inner representing past countdown logic */}
        <path d="M22,14 L42,14 L32,32 L22,14 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
        <path d="M22,50 L42,50 L32,32 L22,50 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
        {/* Drop lines */}
        <circle cx="32" cy="32" r="1.5" fill="#475569" />
        <circle cx="32" cy="37" r="1.5" fill="#475569" />
      </g>
    </svg>
  );
}

interface DashboardProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  setActiveTab: (tab: string) => void;
  onQuickExam: () => void;
  onOpenAuth: () => void;
}

export default function Dashboard({ stats, setStats, setActiveTab, onQuickExam, onOpenAuth }: DashboardProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number>(20);
  
  const radius = 28;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;

  const currentProgress = stats.totalQuestionsSolved || 0;
  const percentage = Math.min(Math.round((currentProgress / dailyGoal) * 100), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleSimulateIncrement = () => {
    setStats(prev => ({
      ...prev,
      totalQuestionsSolved: prev.totalQuestionsSolved + 1
    }));
  };

  const handleSimulateDecrement = () => {
    setStats(prev => ({
      ...prev,
      totalQuestionsSolved: Math.max(0, prev.totalQuestionsSolved - 1)
    }));
  };

  // Prayer Planner States & Logic
  const [completedSlots, setCompletedSlots] = useState<{ [key: string]: boolean }>({
    fazr: true,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });

  const prayerStudySlots = [
    { id: "fazr", name: "ফজর সেশন", time: "ভোর ৫:৩০ - ৮:০০", focus: "English ও GK মুখস্থ", xp: 15, tag: "স্মরণ পার্ট" },
    { id: "dhuhr", name: "যোহর সেশন", time: "দুপুর ২:০০ - ৪:০০", focus: "উচ্চতর গণিত ও পদার্থবিজ্ঞান", xp: 15, tag: "সমস্যা সমাধান" },
    { id: "asr", name: "আসর সেশন", time: "বিকেল ৪:৪৫ - ৫:৩০", focus: "ডেইলি কুইজ ও প্র্যাকটিস", xp: 10, tag: "স্পীড কুইজ" },
    { id: "maghrib", name: "মাগরিব সেশন", time: "সন্ধ্যা ৬:৪৫ - ৮:১৫", focus: "অপ্রস্তুত অধ্যায় রিভিউ", xp: 20, tag: "রিভিশন" },
    { id: "isha", name: "এশা সেশন", time: "রাত ৯:১৫ - ১০:৪৫", focus: "মক টেস্ট ও মূল্যায়ন", xp: 20, tag: "মক রেডি" }
  ];

  const handleTogglePrayerSlot = (slotId: string, xpReward: number) => {
    if (stats.isGuest) {
      onOpenAuth();
      return;
    }

    const wasChecked = completedSlots[slotId];
    setCompletedSlots(prev => ({ ...prev, [slotId]: !prev[slotId] }));

    setStats(prev => {
      const addedPoints = wasChecked ? -xpReward : xpReward;
      const newPoints = Math.max(0, prev.points + addedPoints);
      return {
        ...prev,
        points: newPoints,
        level: Math.floor(newPoints / 100) + 1
      };
    });
  };

  const subjectProgressList = [
    { name: "বাংলা", progress: stats.isGuest ? 0 : 45, count: "৮টি টপিক প্রস্তুত", details: "অপরিচিতা, ঐতিহাসিক ভাষণ ও কবিতা রিভিশন সম্পন্ন।" },
    { name: "English", progress: stats.isGuest ? 0 : 30, count: "৫টি টপিক প্রস্তুত", details: "Right Forms of Verbs, Subjunctive & Prepositions." },
    { name: "সাধারণ জ্ঞান", progress: stats.isGuest ? 0 : 80, count: "১২টি টপিক প্রস্তুত", details: "সংবিধানের ইতিহাস, মুক্তিযুদ্ধ এবং মুজিবনগর সরকার।" }
  ];

  const handleBentoClick = (tabId: string) => {
    if (stats.isGuest && (tabId === "battle" || tabId === "progress")) {
      onOpenAuth();
    } else {
      setActiveTab(tabId);
    }
  };

  // Time-based Bangla greeting inside dashboard header
  const getBanglaGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "শুভ সকাল";
    if (hours < 16) return "শুভ দুপুর";
    if (hours < 18) return "শুভ বিকেল";
    return "শুভ সন্ধ্যা";
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto text-slate-800 dark:text-slate-100 pb-12 select-none">
      
      {/* 1. Guest warning strip */}
      {stats.isGuest && (
        <div className="bg-gradient-to-r from-[#00be90]/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>গেস্ট হিসেবে আছেন। পরীক্ষার পূর্ণাঙ্গ ট্র্যাক পেতে ও লিডারবোর্ডে অংশ নিতে এখনই অ্যাকাউন্ট খুলুন!</span>
          </div>
          <button 
            onClick={onOpenAuth}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-[#00be90] hover:brightness-105 active:scale-95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shrink-0 cursor-pointer"
          >
            লগইন / রিজিষ্ট্রেশন
          </button>
        </div>
      )}

      {/* 3. MULTI-COLUMN APP-BAR GRID OF PREMIUM CONCEPTUAL ILLUSTRATED TILES (Exactly like the requested layout but ultra-smooth and interactive) */}
      <div id="core-interactive-decks" className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-[32px] p-6 sm:p-8 shadow-sm">
        
        {/* Descriptive Section Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xs font-black uppercase text-[#00be90] tracking-widest font-mono flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-[#00dda6] animate-pulse" />
              প্রধান ফিচার ডেক্স (Study Qoro Main Features Arena)
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
              তোমার HSC বোর্ড ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার অনন্য প্রস্তুতির জন্য নিচের ডেকগুলো অনুশীলন করো
            </p>
          </div>
          
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full shrink-0">
            ৮টি মূল মডিউল সক্রিয়
          </span>
        </div>

        {/* 8-Column Grid Layout matching the screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 sm:gap-6 justify-center items-stretch">
          
          {[
            {
              id: "questions",
              title: "প্রশ্ন ব্যাংক",
              badge: "১০k+ MCQ",
              badgeBg: "bg-amber-500",
              colorClass: "bg-amber-100/40 dark:bg-amber-950/20 group-hover:bg-amber-100 hover:shadow-amber-100/40 border-amber-250 hover:border-amber-400 group-hover:scale-105",
              vector: <QuestionBankVector />
            },
            {
              id: "battle",
              title: "ব্যাটেল এক্সাম",
              badge: "লাইভ 🎮",
              badgeBg: "bg-rose-500 animate-pulse",
              colorClass: "bg-rose-100/40 dark:bg-rose-950/20 group-hover:bg-rose-100 hover:shadow-rose-100/40 border-rose-250 hover:border-rose-450 group-hover:scale-105",
              vector: <BattleArenaVector />
            },
            {
              id: "timer",
              title: "দ্রুত প্র্যাকটিস",
              badge: "স্পীড ⚡",
              badgeBg: "bg-sky-500",
              colorClass: "bg-sky-100/40 dark:bg-sky-950/20 group-hover:bg-sky-100 hover:shadow-sky-100/40 border-sky-250 hover:border-sky-450 group-hover:scale-105",
              vector: <FocusSpeedVector />
            },
            {
              id: "mocks",
              title: "মক পরীক্ষা",
              badge: "OMR 📊",
              badgeBg: "bg-[#00be90]",
              colorClass: "bg-emerald-100/40 dark:bg-emerald-950/20 group-hover:bg-emerald-110 hover:shadow-emerald-100/40 border-emerald-250 hover:border-[#00be90] group-hover:scale-105",
              vector: <MockExamVector />
            },
            {
              id: "ai",
              title: "Study Qoro AI",
              badge: "এআই ✨",
              badgeBg: "bg-violet-500",
              colorClass: "bg-violet-100/40 dark:bg-violet-950/20 group-hover:bg-violet-100 hover:shadow-violet-100/40 border-violet-250 hover:border-violet-450 group-hover:scale-105",
              vector: <StudyHelperAIVector />
            },
            {
              id: "leaderboard",
              title: "লিডারবোর্ড",
              badge: "জাতীয় 🏆",
              badgeBg: "bg-teal-500",
              colorClass: "bg-teal-100/40 dark:bg-teal-950/20 group-hover:bg-teal-100 hover:shadow-teal-100/40 border-teal-250 hover:border-teal-450 group-hover:scale-105",
              vector: <TrophyLeaderboardVector />
            },
            {
              id: "progress",
              title: "প্রোগ্রেস ট্র্যাকার",
              badge: "নতুন 🎯",
              badgeBg: "bg-indigo-500",
              colorClass: "bg-indigo-100/40 dark:bg-indigo-950/20 group-hover:bg-indigo-100 hover:shadow-indigo-100/40 border-indigo-250 hover:border-indigo-450 group-hover:scale-105",
              vector: <ProgressTrackerVector />
            },
            {
              id: "history",
              title: "অনুশীলন ইতিহাস",
              badge: "লগ ⏳",
              badgeBg: "bg-slate-500",
              colorClass: "bg-slate-100/40 dark:bg-slate-900/40 group-hover:bg-slate-200 hover:shadow-slate-100/40 border-slate-250 hover:border-slate-450 group-hover:scale-105",
              vector: <HistoryLogVector />
            }
          ].map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleBentoClick(item.id)}
              whileTap={{ scale: 0.96 }}
              className="group flex flex-col items-center justify-between cursor-pointer space-y-3 p-2 text-center text-slate-800 dark:text-slate-100"
            >
              {/* Launcher Rounded App-Style Tile Container exactly like screenshot */}
              <div className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center relative shadow-sm group-hover:shadow-md transition-all duration-300 ${item.colorClass}`}>
                
                {/* Micro Smart Corner Badge */}
                <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full shadow-sm z-20 ${item.badgeBg}`}>
                  {item.badge}
                </span>

                {/* Conceptual flat vector illustration */}
                <div className="relative z-10">
                  {item.vector}
                </div>
              </div>

              {/* Minimal Clean Text Label directly centered under the button exactly like screenshot */}
              <div className="space-y-0.5">
                <span className="block text-xs sm:text-[13px] font-black text-slate-800 dark:text-slate-100 group-hover:text-[#00be90] transition-colors leading-tight">
                  {item.title}
                </span>
                <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 tracking-tight leading-none uppercase shrink-0">
                  {item.id === "ai" ? "Assistant" : (item.id === "questions" ? "Practice" : "Live Exam")}
                </span>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 4. SPLIT TWO-COLUMN SECONDARY METRICS (8 Column Left / 4 Column Right) */}
      <div id="secondary-metrics-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Study Planner / Namaz Tracker Widget */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Unique Study Planner Tracker Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[28px] shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                <BookmarkCheck className="w-4.5 h-4.5 text-[#00be90]" />
                <span>ইবাদত ও পড়ালেখার লাইভ প্ল্যানার (Namaz & Study Tracker)</span>
              </h3>
              <span className="text-[10px] font-bold text-[#00be90] bg-[#00dda6]/10 px-2.5 py-0.5 rounded-full">XP বোনাস</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {prayerStudySlots.map((slot) => {
                const isCompleted = completedSlots[slot.id];
                return (
                  <div 
                    key={slot.id} 
                    className={`p-3 rounded-2xl border text-center transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                      isCompleted 
                        ? "bg-slate-50/60 dark:bg-slate-950/70 border-[#00be90]/40 text-slate-800 dark:text-slate-200" 
                        : "bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850/60 text-slate-500"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono font-extrabold tracking-wider text-slate-400 block dark:text-slate-500">
                        {slot.tag}
                      </span>
                      <h6 className="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-tight">
                        {slot.name}
                      </h6>
                      <span className="text-[9px] text-slate-405 dark:text-slate-500 block">
                        {slot.time}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between mt-auto">
                      <span className="text-[9px] font-mono font-bold text-[#00be90]">+{slot.xp}XP</span>
                      <button 
                        onClick={() => handleTogglePrayerSlot(slot.id, slot.xp)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                          isCompleted 
                            ? "bg-[#00be90] text-white" 
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-black">+</span>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MINDFULNESS/HEALTH STATEMENT BANNER */}
          <div className="bg-gradient-to-r from-indigo-50/40 to-slate-50 border border-slate-200/60 dark:from-slate-950/20 dark:to-slate-900 p-4.5 rounded-[24px] flex items-start gap-3">
            <Heart className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 fill-current" />
            <div className="space-y-1">
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                মাইন্ডফুলনেস সাপোর্ট ও স্বাস্থ্য টিপস
              </span>
              <p className="text-[11px] text-slate-520 dark:text-slate-400 leading-relaxed font-semibold">
                সারাদিনের অতিরিক্ত পড়ায় নিজের মানসিক অবস্থা শান্ত রাখা জরুরি। প্রতিটি ৩ ঘন্টা স্টডির পর নামাজ পড়ার মাধ্যমে দেহ ও মনকে সতেজ রাখবে, যা দীর্ঘমেয়াদে মনে রাখার শক্তি দ্বিগুণ করে দেবে।
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Goal & Subject Progress scorecard widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DAILY STUDY GOAL PANEL with glowing radial rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[28px] shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  দৈনিক পড়ার লক্ষ্যমাত্রা
                </h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">My Solving Goal</p>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black px-2.5 py-0.5 rounded-full tracking-wide">
                লাস্ট গোল: {dailyGoal}টি
              </span>
            </div>

            <div className="flex items-center gap-5">
              {/* Specialized Progress Circle */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center select-none">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="36"
                    cy="36"
                    r={radius}
                    className="stroke-[#00be90]"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Internal representation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {percentage >= 100 ? (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-base"
                    >
                      👑
                    </motion.span>
                  ) : (
                    <span className="text-[11px] font-black font-mono text-slate-850 dark:text-slate-100">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress text description */}
              <div className="flex-grow space-y-1 select-none">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                    {currentProgress}
                  </span>
                  <span className="text-xs text-slate-400 font-extrabold">/ {dailyGoal} সম্পন্ন</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {percentage >= 100 ? (
                    <span className="text-[#00be90] font-black flex items-center gap-1">
                      <span>🏆 গোল অর্জন সম্পূর্ণ হয়েছে!</span>
                    </span>
                  ) : percentage >= 50 ? (
                    <span>অর্ধেক সম্পূর্ণ হয়েছে। এগিয়ে যাও! 🔥</span>
                  ) : (
                    <span>প্রতিদিন কাস্টম প্র্যাকটিস সম্পন্ন করে গোলটি লালন করুন।</span>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated toolset */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase select-none font-mono">চেঞ্জ:</span>
                <div className="flex gap-1.5">
                  {[10, 20, 30, 50].map((g) => (
                    <button
                      key={g}
                      onClick={() => setDailyGoal(g)}
                      className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer ${
                        dailyGoal === g 
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900" 
                          : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incrementor/Decrementor for simulated checking */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded-xl border border-slate-150 dark:border-slate-800">
                <button
                  onClick={handleSimulateDecrement}
                  title="কমিয়ে দিন"
                  className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all cursor-pointer"
                >
                  -
                </button>
                <span className="text-[9px] font-extrabold text-slate-400 px-0.5 select-none">টেস্ট</span>
                <button
                  onClick={handleSimulateIncrement}
                  title="বাড়িয়ে দিন"
                  className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95 transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>

          {/* SUBTOPICS / SUBJECT REPORT CARDS SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[28px] shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-1">
              <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                সাবজেক্ট ভিত্তিক ট্র্যাকার
              </h3>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">HSC • Admission</span>
            </div>

            <div className="space-y-4">
              {subjectProgressList.map((sub, sidx) => {
                const isExpanded = expandedSubject === sub.name;
                return (
                  <div key={sidx} className="border-b border-slate-105 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <button 
                      onClick={() => setExpandedSubject(isExpanded ? null : sub.name)}
                      className="w-full flex items-center justify-between text-left text-xs font-extrabold text-slate-800 dark:text-slate-200 group py-1.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-[#00be90]" />
                        {sub.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-[#00be90] font-black">{sub.progress}%</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    
                    {/* Modern Dynamic progress line */}
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 select-none">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-[#00be90] h-full rounded-full transition-all duration-500"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 rounded-2xl text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed space-y-1 animate-fade-in select-text">
                        <p className="font-extrabold text-slate-705 dark:text-slate-205">{sub.count}</p>
                        <p>{sub.details}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
