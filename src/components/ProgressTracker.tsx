/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { 
  Award, 
  Zap, 
  Flame, 
  Trophy,
  CheckCircle, 
  Clock, 
  Target, 
  ShieldAlert, 
  Check, 
  X, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Lock, 
  Unlock, 
  HelpCircle,
  Filter,
  CheckCheck,
  User,
  GraduationCap,
  Settings,
  ShieldCheck,
  Calendar,
  ChevronRight,
  TrendingUp,
  Share2,
  LogOut,
  AlertCircle,
  UserCheck,
  KeyRound,
  Fingerprint,
  RotateCcw
} from "lucide-react";
import { StudentStats, Subject, Question } from "../types";
import { ACHIEVEMENTS, QUESTION_BANK } from "../data";

interface ProgressTrackerProps {
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
}

const AVATAR_OPTIONS = [
  { id: "stud-1", emoji: "👨‍🎓", label: "তুখোড় ছাত্র", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
  { id: "stud-2", emoji: "👩‍🎓", label: "মেধাবী ছাত্রী", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { id: "stud-3", emoji: "🧑‍💻", label: "কোড রাইডার", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300" },
  { id: "stud-4", emoji: "🚀", label: "স্টার এচিভার", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  { id: "stud-5", emoji: "🦊", label: "স্মার্ট ফক্স", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
  { id: "stud-6", emoji: "⚡", label: "স্পার্ক কুইন", color: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" }
];

export default function ProgressTracker({ stats, setStats }: ProgressTrackerProps) {
  // Navigation tabs of the right panel
  const [activeRightTab, setActiveTab] = useState<"overview" | "subjects" | "settings" | "mistakes" | "planner" | "rewards" | "reportcard" | "orders">("overview");

  // Setting sub-categories: "personal" | "academic" | "security" | "danger"
  const [activeSettingSub, setActiveSettingSub] = useState<"personal" | "academic" | "security" | "danger">("personal");

  // New States for Custom Rich Features
  const [plannerTasks, setPlannerTasks] = useState<{ id: string, text: string, completed: boolean, xp: number }[]>(() => {
    if (stats.plannerTasks) return stats.plannerTasks;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user-profile-planner-tasks");
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: "task-1", text: "পদার্থবিজ্ঞানের ভেক্টর অধ্যায়ের ২৫টি MCQ প্রাকটিস শেষ করা", completed: true, xp: 15 },
      { id: "task-2", text: "রসায়নের গুণগত রসায়ন নোট ও কোয়ান্টাম কপার পরমাণুর ইলেকট্রন বিন্যাস রিভিশন করা", completed: false, xp: 20 },
      { id: "task-3", text: "Study Qoro AI এসিস্ট্যান্টের সাথে জৈব রসায়ন বিক্রিয়ার সমস্যা কাটিয়ে উঠা", completed: false, xp: 15 },
      { id: "task-4", text: "আজকের লাইভ ব্যাটেল কুইজ চ্যালেঞ্জে অংশ নিয়ে মেধা পারফরম্যান্স বাড়ানো", completed: false, xp: 25 },
    ];
  });

  const [newTaskText, setNewTaskText] = useState("");

  const [purchasedRewards, setPurchasedRewards] = useState<string[]>(() => {
    if (stats.purchasedRewards) return stats.purchasedRewards;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user-unlocked-rewards");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; date: string; amount: string; plan: string; txn: string } | null>(null);
  const [targetGPAInputs, setTargetGPAInputs] = useState<Record<string, number>>({
    bangla: 5,
    english: 5,
    physics: 5,
    chemistry: 5,
    math: 5,
    ict: 5
  });
  const [calculatedGPA, setCalculatedGPA] = useState<number>(5.00);
  const [showCertificate, setShowCertificate] = useState(false);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem("user-profile-planner-tasks", JSON.stringify(plannerTasks));
    setStats(prev => {
      if (JSON.stringify(prev.plannerTasks) !== JSON.stringify(plannerTasks)) {
        return { ...prev, plannerTasks };
      }
      return prev;
    });
  }, [plannerTasks, setStats]);

  useEffect(() => {
    localStorage.setItem("user-unlocked-rewards", JSON.stringify(purchasedRewards));
    setStats(prev => {
      if (JSON.stringify(prev.purchasedRewards) !== JSON.stringify(purchasedRewards)) {
        return { ...prev, purchasedRewards };
      }
      return prev;
    });
  }, [purchasedRewards, setStats]);

  // Handle planner actions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      xp: 15
    };
    setPlannerTasks(prev => [...prev, newTask]);
    setNewTaskText("");
  };

  const handleToggleTask = (taskId: string) => {
    setPlannerTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          setStats(prevStats => ({
            ...prevStats,
            points: prevStats.points + t.xp,
          }));
          const toast = document.createElement("div");
          toast.className = "fixed bottom-5 right-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg z-50 animate-bounce";
          toast.innerHTML = `🌟 টাস্ক সম্পন্ন! +${t.xp} XP অর্জিত`;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2500);
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setPlannerTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handle reward redemption
  const handlePurchaseReward = (itemId: string, pointsCost: number, labelName: string) => {
    if (purchasedRewards.includes(itemId)) {
      alert("এটি ইতিমধ্যে কাস্টম ডায়েরীতে আনলক করা আছে!");
      return;
    }
    if (stats.points < pointsCost) {
      alert(`দুঃখিত! এই রিওয়ার্ডটি আনলক করতে আপনার আরও ${pointsCost - stats.points} মেধা পয়েন্ট প্রয়োজন। অনুগ্রহ করে বেশি বেশি কুইজের সঠিক উত্তর দিয়ে XP পয়েন্ট অর্জন করুন!`);
      return;
    }

    setStats(prev => ({
      ...prev,
      points: Math.max(0, prev.points - pointsCost)
    }));
    setPurchasedRewards(prev => [...prev, itemId]);

    if (itemId === "reward-avatar-eagle") {
      setFormAvatar("🦅");
      localStorage.setItem("profile-avatar", "🦅");
    } else if (itemId === "reward-avatar-dragon") {
      setFormAvatar("🐉");
      localStorage.setItem("profile-avatar", "🐉");
    }

    const successToast = document.createElement("div");
    successToast.className = "fixed bottom-5 right-5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-4 py-3 rounded-2xl text-xs shadow-2xl z-50 animate-bounce";
    successToast.innerHTML = `🎉 অভিনন্দন! "${labelName}" সফলভাবে আনলক করা হয়েছে!`;
    document.body.appendChild(successToast);
    setTimeout(() => successToast.remove(), 3550);
  };

  // Form states initialized with current global or custom persistent storage values
  const [formName, setFormName] = useState(stats.name);
  
  useEffect(() => {
    if (stats.name && stats.name !== "গেস্ট পরীক্ষার্থী" && stats.name !== "গেস্ট পরীক্ষার্থী (Guest Student)") {
      setFormName(stats.name);
    }
  }, [stats.name]);

  const [formDob, setFormDob] = useState(() => stats.dob || localStorage.getItem("profile-dob") || "2008-01-01");
  const [formGender, setFormDobGender] = useState(() => stats.gender || localStorage.getItem("profile-gender") || "male");
  const [formAddress, setFormAddress] = useState(() => stats.address || localStorage.getItem("profile-address") || "ঢাকা, বাংলাদেশ");
  
  const [formClassCode, setFormClassCode] = useState(() => stats.classCode || localStorage.getItem("profile-class") || "HSC");
  const [formGroup, setFormGroup] = useState(() => stats.group || localStorage.getItem("profile-group") || "SCIENCE");
  const [formBatch, setFormBatch] = useState(() => stats.batch || localStorage.getItem("profile-batch") || "HSC_2027");
  const [formSscRoll, setFormSscRoll] = useState(() => stats.sscRoll || localStorage.getItem("profile-ssc-roll") || "214050");
  const [formSscReg, setFormSscReg] = useState(() => stats.sscReg || localStorage.getItem("profile-ssc-reg") || "1710405230");
  const [formBoard, setFormBoard] = useState(() => stats.board || localStorage.getItem("profile-board") || "Dhaka");
  const [formPassingYear, setFormPassingYear] = useState(() => stats.passingYear || localStorage.getItem("profile-passing-year") || "2025");
  
  const [formOptionalSubjects, setFormOptionalSubjects] = useState<string[]>(() => {
    if (stats.optionalSubjects) return stats.optionalSubjects;
    const saved = localStorage.getItem("profile-optionals");
    return saved ? JSON.parse(saved) : ["biology", "higher-math"];
  });

  const [formAvatar, setFormAvatar] = useState(() => stats.avatar || localStorage.getItem("profile-avatar") || "👨‍🎓");

  useEffect(() => {
    if (stats.dob) setFormDob(stats.dob);
    if (stats.gender) setFormDobGender(stats.gender);
    if (stats.address) setFormAddress(stats.address);
    if (stats.classCode) setFormClassCode(stats.classCode);
    if (stats.group) setFormGroup(stats.group);
    if (stats.batch) setFormBatch(stats.batch);
    if (stats.sscRoll) setFormSscRoll(stats.sscRoll);
    if (stats.sscReg) setFormSscReg(stats.sscReg);
    if (stats.board) setFormBoard(stats.board);
    if (stats.passingYear) setFormPassingYear(stats.passingYear);
    if (stats.optionalSubjects) setFormOptionalSubjects(stats.optionalSubjects);
    if (stats.avatar) setFormAvatar(stats.avatar);
  }, [stats]);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Account delete typing check
  const [deleteConfirmType, setDeleteConfirmType] = useState("");
  const [isDeletedSimulated, setIsDeletedSimulated] = useState(false);

  // Form status feedback hooks
  const [saveFeedback, setSaveFeedback] = useState("");

  // Mistake Vault local state - auto-saves and provides instant XP
  const [mistakes, setMistakes] = useState<Question[]>(() => {
    if (stats.mistakes) return stats.mistakes;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user-mistake-bank");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [quizFeedbacks, setQuizFeedbacks] = useState<Record<string, { status: "correct" | "incorrect"; text: string }>>({});

  // Sync mistakes list
  useEffect(() => {
    localStorage.setItem("user-mistake-bank", JSON.stringify(mistakes));
    setStats(prev => {
      if (mistakes.length !== (prev.mistakes?.length || 0)) {
        return { ...prev, mistakes };
      }
      return prev;
    });
  }, [mistakes, setStats]);

  // Calendar Day Click states
  const [selectedStreakDay, setSelectedStreakDay] = useState<number | null>(14);

  // Expanded subject performance dropdown states
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // Core event handlers for the newly added rich features
  const handleAnswerOption = (mId: string, optionIdx: number, correctIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [mId]: optionIdx }));
    const isCorr = optionIdx === correctIndex;
    
    setQuizFeedbacks(prev => ({
      ...prev,
      [mId]: {
        status: isCorr ? "correct" : "incorrect",
        text: isCorr ? "সঠিক উত্তর!" : "ভুল উত্তর, আবার চেষ্টা করুন।"
      }
    }));

    if (isCorr) {
      setStats(prev => ({ ...prev, points: prev.points + 25 }));
      const toast = document.createElement("div");
      toast.className = "fixed bottom-5 right-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg z-50 animate-bounce";
      toast.innerHTML = "🌟 সঠিক উত্তর! +২৫ XP মেধা পয়েন্ট অর্জিত হয়েছে।";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  };

  const removeMistake = (mId: string) => {
    setMistakes(prev => prev.filter(m => m.id !== mId));
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-slate-900 border border-slate-850 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg z-50 animate-bounce";
    toast.innerHTML = "🗑️ কুইজটি সফলভাবে ভল্ট থেকে মুছে ফেলা হয়েছে।";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const toggleOptionalSubject = (subId: string) => {
    setFormOptionalSubjects(prev => 
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPasswordFeedback("❌ অনুগ্রহ করে একটি বৈধ নতুন পাসওয়ার্ড টাইপ করুন।");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("❌ নিশ্চিতকরণ পাসওয়ার্ড দুটি হুবহু মেলেনি!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback("❌ পাসওয়ার্ডটি অবশ্যই কমপক্ষে ৬ অক্ষরের দীর্ঘ হতে হবে।");
      return;
    }
    setPasswordFeedback("✅ আপনার পাসওয়ার্ড সফলভাবে লোকাল সার্ভারে ড্রাফট ও আপডেট হয়েছে!");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordFeedback(""), 4500);
  };

  const handleDeleteProceed = (e: React.MouseEvent) => {
    e.preventDefault();
    setStats({
      name: "게스트 পরীক্ষার্থী",
      level: 1,
      points: 10,
      streak: 0,
      rank: 9999,
      plan: "Free",
      examsGiven: 0,
      totalQuestionsSolved: 0,
      completedMilestones: [],
      isGuest: true
    });
    setDeleteConfirmType("");
    localStorage.clear();
    
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-red-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs z-50 shadow-xl animate-bounce";
    toast.innerHTML = "🗑️ আপনার সমস্ত স্টাডি প্রোফাইল ও সংরক্ষিত ডেটা সার্থকভাবে সম্পূর্ণ মুছে ফেলা হয়েছে!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      window.location.reload();
    }, 2000);
  };

  // Subject statistics matching Satt Academy progress percentages
  const subjectProgressList = [
    { subject: Subject.PHYSICS, icon: "⚛️", chapters: 10, solved: 142, accuracy: 84, completedPercent: 78, level: "প্রো লেভেল", 
      breakdown: [
        { name: "ভেক্টর ও গতিবিদ্যা", progress: 95 },
        { name: "নিউটনীয় বলবিদ্যা", progress: 75 },
        { name: "কাজ, শক্তি ও ক্ষমতা", progress: 85 },
        { name: "মহাকর্ষ ও আদর্শ গ্যাস", progress: 40 }
      ]
    },
    { subject: Subject.CHEMISTRY, icon: "🧪", chapters: 8, solved: 115, accuracy: 76, completedPercent: 64, level: "উন্নতিশীল",
      breakdown: [
        { name: "ল্যাবরেটরীর নিরাপদ ব্যবহার", progress: 100 },
        { name: "গুণগত রসায়ন", progress: 82 },
        { name: "পর্যায়বৃত্ত ধর্ম", progress: 60 },
        { name: "জৈব রসায়ন", progress: 35 }
      ]
    },
    { subject: Subject.MATHEMATICS, icon: "📐", chapters: 12, solved: 128, accuracy: 89, completedPercent: 82, level: "মাস্টার লেভেল",
      breakdown: [
        { name: "ম্যাট্রিক্স ও নির্ণায়ক", progress: 100 },
        { name: "সরলরেখা ও বৃত্ত", progress: 92 },
        { name: "ত্রিকোণমিতি", progress: 80 },
        { name: "ক্যালকুলাস ও যোগজীকরণ", progress: 65 }
      ]
    },
    { subject: Subject.ICT, icon: "💻", chapters: 6, solved: 145, accuracy: 92, completedPercent: 95, level: "মাস্টার লেভেল",
      breakdown: [
        { name: "সংখ্যাপদ্ধতি ও ডিজিটাল ডিভাইস", progress: 100 },
        { name: "ওয়েব ডিজাইন ও HTML", progress: 98 },
        { name: "সি-প্রোগ্রামিং ও মেমোরি", progress: 88 }
      ]
    },
    { subject: Subject.BANGLA, icon: "✍️", chapters: 14, solved: 66, accuracy: 71, completedPercent: 48, level: "শিক্ষানবিস",
      breakdown: [
        { name: "অপরিচিতা ও সোনার তরী", progress: 80 },
        { name: "বিদ্রোহী ও চাষার দুক্ষু", progress: 50 }
      ]
    },
    { subject: Subject.ENGLISH, icon: "🇬🇧", chapters: 10, solved: 82, accuracy: 70, completedPercent: 55, level: "শিক্ষানবিস",
      breakdown: [
        { name: "Grammar & Prepositions", progress: 65 },
        { name: "Synonyms & Antonyms", progress: 50 }
      ]
    }
  ];

  // XP progression breakdown logic for custom styled SVG chart
  const weeklyXPData = [
    { day: "শনি", xp: Math.floor((stats.points || 0) * 0.05) },
    { day: "রবি", xp: Math.floor((stats.points || 0) * 0.15) },
    { day: "সোম", xp: Math.floor((stats.points || 0) * 0.2) },
    { day: "মঙ্গল", xp: Math.floor((stats.points || 0) * 0.1) },
    { day: "বুধ", xp: Math.floor((stats.points || 0) * 0.25) },
    { day: "বৃহ", xp: Math.floor((stats.points || 0) * 0.15) },
    { day: "শুক্র", xp: Math.floor((stats.points || 0) * 0.1) }
  ];

  // Presets of days for Streak calendar
  const todayDate = new Date().getDate();
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const isStreakDay = i >= todayDate - 1 - stats.streak && i <= todayDate - 1;
    return {
      day: i + 1,
      hasStreak: stats.streak > 0 && isStreakDay,
      isToday: i === todayDate - 1
    };
  });

  // Handle saving general configurations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to LocalStorage for persistence
    localStorage.setItem("profile-dob", formDob);
    localStorage.setItem("profile-gender", formGender);
    localStorage.setItem("profile-address", formAddress);
    localStorage.setItem("profile-class", formClassCode);
    localStorage.setItem("profile-group", formGroup);
    localStorage.setItem("profile-batch", formBatch);
    localStorage.setItem("profile-ssc-roll", formSscRoll);
    localStorage.setItem("profile-ssc-reg", formSscReg);
    localStorage.setItem("profile-board", formBoard);
    localStorage.setItem("profile-passing-year", formPassingYear);
    localStorage.setItem("profile-optionals", JSON.stringify(formOptionalSubjects));
    localStorage.setItem("profile-avatar", formAvatar);

    // Sync state and firebase
    const newName = formName || stats.name;
    const newStatsMap = {
      name: newName,
      dob: formDob,
      gender: formGender,
      address: formAddress,
      classCode: formClassCode,
      group: formGroup,
      batch: formBatch,
      sscRoll: formSscRoll,
      sscReg: formSscReg,
      board: formBoard,
      passingYear: formPassingYear,
      optionalSubjects: formOptionalSubjects,
      avatar: formAvatar,
      isGuest: false
    };

    setStats(prev => ({
      ...prev,
      ...newStatsMap
    }));

    if (stats.uid) {
      try {
        await updateDoc(doc(db, "students", stats.uid), newStatsMap);
      } catch (err) {
        console.error("Failed to save profile to Firebase", err);
      }
    }

    setSaveFeedback("✅ আপনার প্রোফাইল সেটিংস সফলভাবে আপডেট ও লোকাল স্টোরেজে সংরক্ষিত হয়েছে!");
    setTimeout(() => setSaveFeedback(""), 4500);

    // Dynamic positive success bubble
    const soundFeed = document.createElement("div");
    soundFeed.className = "fixed bottom-5 right-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-2xl z-[200] shadow-xl text-xs flex items-center gap-2 animate-bounce";
    soundFeed.innerHTML = "💾 প্রোফাইল সফলভাবে সেইভ করা হয়েছে!";
    document.body.appendChild(soundFeed);
    setTimeout(() => soundFeed.remove(), 2500);
  };

  return (
    <div id="progress-statistics-hub" className="space-y-6 font-sans">
      
      {/* 2-Column Responsive Layout: Left Sidebar info & Right Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==========================================
           LEFT COLUMN: CHORCHA STYLE PROFILE SIDEBAR
           ========================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main profile brief & Avatar picker card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm text-center relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/25">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-xl" />
            
            {/* User Avatar circle emoji with absolute overlay of editing preset */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-[#00ce9b] to-teal-500 flex items-center justify-center text-4xl shadow-md border-4 border-slate-100 dark:border-slate-950 transition-transform group-hover:scale-105 select-none duration-300">
                  {formAvatar}
                </div>
                
                {/* Fast badge membership */}
                <span className="absolute bottom-0 right-0 text-xs px-2 py-0.5 bg-yellow-500 text-slate-950 font-black rounded-full shadow border-2 border-white dark:border-slate-950 uppercase tracking-tight scale-90">
                  {stats.plan}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg flex items-center justify-center gap-1">
                  <span>{stats.name}</span>
                  <span className="text-emerald-500">✔</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{stats.isGuest ? "গেস্ট পরীক্ষার্থী" : "রেজিস্ট্রার্ড স্টুডেন্ট"}</p>
                <div className="relative inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[10px] font-black tracking-normal rounded-full mt-2 border border-rose-100 dark:border-rose-900/40">
                  <Flame className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
                  <span>ব্যাচ: {formBatch.replace("_", " ")}</span>
                </div>
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-850 pt-4 mt-1 flex justify-center gap-3 text-xs text-slate-500">
                <div className="text-center flex-1 border-r border-slate-100 dark:border-slate-850">
                  <span className="block font-black text-slate-700 dark:text-slate-200">{stats.points}</span>
                  <span className="text-[10px] text-slate-400">মেধা পয়েন্ট</span>
                </div>
                <div className="text-center flex-1 border-r border-slate-100 dark:border-slate-850">
                  <span className="block font-black text-slate-700 dark:text-slate-200">LVL {stats.level}</span>
                  <span className="text-[10px] text-slate-400">কারেন্ট লেভেল</span>
                </div>
                <div className="text-center flex-1">
                  <span className="block font-black text-slate-700 dark:text-slate-200">#{stats.rank}</span>
                  <span className="text-[10px] text-slate-400">দেশব্যাপী র‍্যাংক</span>
                </div>
              </div>

            </div>

          </div>

          {/* Competitor sidebar options for quick navigation settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl p-4 shadow-sm overflow-hidden select-none">
            <div className="text-[9px] font-extrabold tracking-wider text-slate-450 dark:text-slate-500 uppercase px-2 mb-3.5">
              প্রোফাইল সেটিংস ও নেভিগেশন
            </div>

            <div className="space-y-1">
              {[
                { id: "overview", label: "মেধা পারফরম্যান্স (Overview)", icon: TrendingUp },
                { id: "subjects", label: "সিলেবাস সমাপ্তি ট্র্যাক", icon: Target },
                { id: "planner", label: "ডেইলি স্টডি প্ল্যানার (Task Tracker)", icon: Calendar },
                { id: "rewards", label: "মেধা কয়েন শপ (Points Shop)", icon: Sparkles },
                { id: "reportcard", label: "GPA কার্ড ও সার্টিফিকেট জেনারেটর", icon: GraduationCap },
                { id: "orders", label: "অর্ডার ও সাবস্ক্রিপশন (Orders History)", icon: CheckCheck },
                { id: "mistakes", label: "ভুল উত্তরের ডায়েরী ভল্ট", icon: ShieldAlert, badge: mistakes.length },
                { id: "settings", label: "প্রোফাইল ও সেটিংস এডিট", icon: Settings }
              ].map(opt => {
                const isActive = activeRightTab === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setActiveTab(opt.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                      isActive
                        ? "bg-[#ecf6f3] dark:bg-emerald-950/30 text-[#059669] dark:text-emerald-400 border border-[#059669]/15"
                        : "hover:bg-slate-50 dark:hover:bg-slate-950/70 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <opt.icon className="w-4.5 h-4.5" />
                      <span>{opt.label}</span>
                    </div>
                    {opt.badge ? (
                      <span className="bg-rose-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full">
                        {opt.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-3.5">
              <button
                onClick={async () => {
                  if (confirm("আপনি কি নিশ্চিতভাবে আপনার সেশন থেকে লগ আউট করতে চান?")) {
                    try {
                      await signOut(auth);
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }
                }}
                className="w-full flex items-center gap-2.5 p-3 text-red-500 hover:bg-rose-500/10 rounded-2xl font-bold text-xs transition-colors text-left"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>অ্যাকাউন্ট থেকে লগ আউট</span>
              </button>
            </div>

          </div>

          {/* Quick link account widget */}
          <div className="bg-gradient-to-tr from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm text-xs space-y-3.5 relative overflow-hidden">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>লিংক অ্যাকাউন্ট (Connected Accounts)</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl leading-tight">
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-700 dark:text-slate-200 text-xs">গুগল সাইন-ইন লিংকড</p>
                <p className="text-[10px] text-slate-400 font-mono">lorddanju@gmail.com</p>
              </div>
              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black px-2 py-0.5 rounded-full uppercase">অনলাইন সিঙ্ক</span>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              আপনার ইমেইল ও পাসওয়ার্ডের সাথে গুগল সিকিউরিটি সংযুক্ত রয়েছে। আপনার মেধা পয়েন্ট ও ব্যাজগুলো সার্ভারে নিরাপদ রয়েছে।
            </p>
          </div>

        </div>

        {/* ==========================================
           RIGHT COLUMN: DYNAMIC PANEL CONTENTS (COMPETITORS' BLENDED VIEW)
           ========================================== */}
        <div className="lg:col-span-8 space-y-6">

          {/* DYNAMIC VIEW 1: OVERVIEW STATISTICS (Satt Academy Pro style) */}
          {activeRightTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Premium membership offer slide */}
              <div className="p-5 bg-gradient-to-r from-purple-500/10 via-indigo-600/5 to-transparent border border-purple-500/15 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all">
                <div className="space-y-1 text-center sm:text-left leading-normal">
                  <span className="flex items-center justify-center sm:justify-start gap-1 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse fill-current" />
                    Ultra Academic Upgrade
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Study Qoro মেম্বারশিপে আপনাকে স্বাগতম!</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-lg">আপনি ইতিমধ্যে পূর্ণ সংস্করণে আছেন। দেশের যেকোনো বুয়েটিয়ান বা মেডিকেলের মেক-নোটস প্রিমিয়াম ট্র্যাকিং ফিচারে এক্সেস রয়েছে।</p>
                </div>
                <span className="px-4 py-1.5 bg-yellow-500 text-slate-950 text-xs font-black rounded-xl select-none uppercase shadow-md scale-95 border-2 border-white dark:border-slate-800">
                  PRO MEMBER
                </span>
              </div>

              {/* Statistics Grid Blocks (Satt Academy style layout) */}
              <div>
                <h4 className="text-[10px] font-extrabold tracking-wider text-slate-450 dark:text-slate-500 uppercase mb-3 px-1">
                  পরিসংখ্যান ও কুইক কাউন্টার (Learning Statistics)
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "streak", label: "🔥 Day Streak (ধারাবাহিকতা)", val: `${stats.streak} দিন`, color: "text-rose-500 font-display font-black" },
                    { id: "reward", label: "⚡ XP Earned (মোট পয়েন্ট)", val: `${stats.points} XP`, color: "text-amber-500 font-display font-black" },
                    { id: "rank", label: "🥈 National Rank (র‍্যাম)", val: `#${stats.rank}`, color: "text-[#059669] font-display font-black" },
                    { id: "exams", label: "🚀 Exams Taken (পরীক্ষাময়)", val: `${stats.examsGiven} বার`, color: "text-indigo-500 font-display font-black" }
                  ].map(stat => (
                    <div key={stat.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2.5xl text-center shadow-sm relative overflow-hidden">
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 font-medium truncate">{stat.label}</p>
                      <div className={`text-lg sm:text-xl font-black mt-1.5 ${stat.color}`}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { id: "try", label: "🎯 Qs Attempted (অনুশীলন)", val: `${stats.totalQuestionsSolved} টি`, color: "text-slate-800 dark:text-slate-100" },
                    { id: "right", label: "✅ Right Answers (সঠিক)", val: `${Math.max(0, stats.totalQuestionsSolved - mistakes.length)} টি`, color: "text-emerald-500" },
                    { id: "wrong", label: "❌ Wrong Answers (ভুল)", val: `${mistakes.length} টি`, color: "text-rose-500" },
                    { id: "accuracy", label: "📈 G.PA Accuracy (গড় মান)", val: `${stats.totalQuestionsSolved > 0 ? ((Math.max(0, stats.totalQuestionsSolved - mistakes.length) / stats.totalQuestionsSolved) * 100).toFixed(1) : 0}%`, color: "text-cyan-500 font-mono text-base" }
                  ].map(stat => (
                    <div key={stat.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2.5xl text-center transition shadow-sm">
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 font-medium truncate">{stat.label}</p>
                      <div className={`text-sm sm:text-base font-extrabold mt-1 ${stat.color}`}>{stat.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Streaks Monthly Calendar Widget (Competitor upgraded widget) */}
              <div id="calendar-streaks-card" className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3.5 mb-4">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm">দৈনিক ধারাবাহিকতা ক্যালেন্ডার (Streak Calendar)</h4>
                      <p className="text-[10px] text-slate-400">প্রতিদিন পড়াশোনায় সক্রিয় থাকুন এবং লাভ করুন আকর্ষণীয় ব্যাজ!</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#059669] dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {new Intl.DateTimeFormat('bn-BD', { month: 'long', year: 'numeric' }).format(new Date())}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-display text-[10px] text-slate-400 font-black mb-3 uppercase tracking-wider">
                  <div>রবি</div><div>সোম</div><div>মঙ্গল</div><div>বুধ</div><div>বৃহ</div><div>শুক্র</div><div>শনি</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Empty offsets for June 2026 starting on Monday (index 1) */}
                  <div className="h-9 w-full invisible" />
                  
                  {calendarDays.map((d) => {
                    const isSelected = selectedStreakDay === d.day;
                    
                    return (
                      <div 
                        key={d.day}
                        onClick={() => setSelectedStreakDay(d.day)}
                        className={`h-9 w-full rounded-xl flex items-center justify-center text-xs font-black cursor-pointer transition-all relative ${
                          d.hasStreak 
                            ? "bg-rose-500/15 border-rose-500 text-rose-500 ring-2 ring-rose-500/10" 
                            : d.isToday
                              ? "bg-emerald-500 text-slate-950 shadow-md transform scale-105"
                              : isSelected
                                ? "bg-slate-200 dark:bg-slate-800 text-[#059669] dark:text-emerald-400 border-2 border-emerald-500"
                                : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        <span>{d.day}</span>
                        {d.hasStreak && (
                          <span className="absolute -top-1.5 -right-1 text-[9px] select-none text-rose-500 drop-shadow-sm font-sans">🔥</span>
                        )}
                        {d.isToday && (
                          <span className="absolute -bottom-1 left-1.2 shrink-0 w-1.2 h-1.2 bg-slate-950 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedStreakDay && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-[11px] text-slate-500 leading-normal flex items-start gap-2.5 animate-fadeIn">
                    <span className="text-lg leading-none">🧠</span>
                    <div>
                      <p className="font-extrabold text-[#059669] dark:text-emerald-400">
                        {new Intl.DateTimeFormat('bn-BD', { month: 'long' }).format(new Date())} {selectedStreakDay.toLocaleString('bn-BD')}, {new Date().getFullYear()} সেশনের বিশ্লেষণ:
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {selectedStreakDay % 3 === 0 
                          ? "আপনি সেদিন ২ টি বড় অধ্যায় মক পরীক্ষা দিয়েছিলেন। গণিতে সর্বোচ্চ ১০০% নির্ভুলতা অর্জিত হয়েছিল।" 
                          : "সেদিন আপনি ১ ঘণ্টা ১৪ মিনিট দ্রুত প্র্যাকটিস পোর্টাল ব্যবহার করে প্রশ্ন সলভ করেছেন।"}
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* XP 7 Days Statistics Vector Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-cyan-500" />
                    <h5 className="font-extrabold text-xs sm:text-sm">গত ৭ দিনের পয়েন্ট অগ্রগতি (XP Analysis Graph)</h5>
                  </div>
                  <span className="text-[10px] text-slate-400">টোটাল সপ্তাহ অগ্রগতি ট্র্যাক</span>
                </div>

                <div className="flex items-end justify-between h-20 pt-4 px-1 gap-2.5 select-none md:px-6">
                  {weeklyXPData.map((d, index) => {
                    const maxBarXP = Math.max(75, ...weeklyXPData.map(w => w.xp));
                    const barHeightPct = Math.max(10, Math.min(100, (d.xp / maxBarXP) * 100));
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="text-[9px] font-mono text-slate-400 font-medium leading-none">{d.xp || 5} XP</div>
                        <div className="w-full bg-slate-50 dark:bg-slate-955 rounded-t-lg h-full relative border border-slate-100 dark:border-slate-850/80">
                          <div 
                            className="absolute bottom-0 left-0 right-0 rounded-t-md bg-gradient-to-t from-emerald-500 to-cyan-500/80 transition-all duration-500"
                            style={{ height: `${barHeightPct}%` }}
                          />
                        </div>
                        <div className="text-[10px] font-bold text-slate-450 dark:text-slate-400 truncate">{d.day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievements cabinet block */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-amber-500" />
                    <span>সাফল্য পদক মন্ত্রক (Trophy Cabinet)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">রিসেন্টলি আনলকড্</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  {ACHIEVEMENTS.map(badge => {
                    const isUnlocked = stats.points >= badge.pointsRequired;
                    return (
                      <div 
                        key={badge.id} 
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isUnlocked 
                            ? "bg-[#fffbf0] dark:bg-amber-950/20 border-amber-300 text-slate-800 dark:text-slate-100" 
                            : "bg-slate-50 dark:bg-slate-950 opacity-40 border-slate-250 dark:border-slate-850 text-slate-400"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{badge.icon}</span>
                        <p className="text-[10px] font-black truncate">{badge.name}</p>
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{badge.pointsRequired} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* DYNAMIC VIEW 2: SUBJECT PERFORMANCE & ACCURACY LIST (Satt style syllabus) */}
          {activeRightTab === "subjects" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-3xl bg-[#ecf6f3] dark:bg-emerald-950/20 text-[#059669] dark:text-emerald-400 border border-emerald-500/15 leading-relaxed text-xs">
                🎈 প্রতিটি বিষয়ের ডান পাশের ড্রপ-ডাউন চিহ্নে ক্লিক করে সিলেবাস অনুযায়ী সাব-চ্যাপ্টার ভিত্তিক সূক্ষ্ম প্রগ্রেস দেখুন।
              </div>

              <div className="space-y-4">
                {subjectProgressList.map(subj => {
                  const isExpanded = expandedSubject === subj.subject;
                  
                  return (
                    <div 
                      key={subj.subject}
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2.5xl overflow-hidden shadow-sm transition-all"
                    >
                      {/* Header line toggle */}
                      <div 
                        onClick={() => setExpandedSubject(isExpanded ? null : subj.subject)}
                        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50 select-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                            {subj.icon}
                          </span>
                          <div>
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100">{subj.subject}</h4>
                            <span className="text-[10px] text-slate-400 block">{subj.chapters} অধ্যায় সূচি • {subj.solved} MCQ সমাধান করা হয়েছে</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3.5 shrink-0 text-right">
                          <div>
                            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">{subj.completedPercent}%</span>
                            <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mt-0.5">সিলেবাস সমাপ্তি</span>
                          </div>
                          
                          <div className="w-1.5 h-8 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="bg-emerald-500 w-full rounded-md transition-all duration-300"
                              style={{ height: `${subj.completedPercent}%` }}
                            />
                          </div>

                          <span className="text-xs text-slate-400 sm:ml-2">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {/* Expandable breakdown drawer matching Satt Academy */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/30 p-4 sm:p-5 space-y-4 animate-fadeIn">
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center select-none mb-2">
                            <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">গড় উপযোগিতা</span>
                              <strong className="text-xs text-slate-700 dark:text-slate-200">{subj.accuracy}% সঠিক উত্তর</strong>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">লেভেল স্তর</span>
                              <strong className="text-xs text-slate-700 dark:text-slate-200">{subj.level}</strong>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">অধ্যায় সমাপ্ত</span>
                              <strong className="text-xs text-slate-705 dark:text-slate-202">{Math.ceil(subj.chapters * subj.completedPercent / 100)} / {subj.chapters} টি</strong>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">বুকমার্ক নোট</span>
                              <strong className="text-xs text-slate-700 dark:text-slate-200">৫ টি সেভড্</strong>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">অধ্যায় ভিত্তিক অগ্রগতি সূচি:</p>
                            
                            {subj.breakdown.map((ch, idx) => (
                              <div key={idx} className="space-y-1 sm:space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-655 dark:text-slate-300 font-medium">{ch.name}</span>
                                  <span className="font-extrabold text-slate-450">{ch.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${ch.progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* DYNAMIC VIEW 2B: DAILY STUDY PLANNER & MISSION TASK TRACKER */}
          {activeRightTab === "planner" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left leading-normal">
                  <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    ডেইলি স্টডি প্ল্যানার ও মিশন (Dynamic Study Mission Tracker)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">প্রতিদিন আপনার কাস্টম মিশন সম্পন্ন করুন। প্রতিটি মিশন সম্পূর্ণ করার মাধ্যমে নিজেকে একাডেমিক শীর্ষে নিয়ে যান!</p>
                </div>
                <div className="bg-emerald-500 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shrink-0 select-none">
                  🎯 প্রতি মিশন: +১৫টি XP
                </div>
              </div>

              {/* Form to add a new task */}
              <form onSubmit={handleAddTask} className="flex gap-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-3 rounded-2.5xl shadow-sm">
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="যেমন: গুণগত রসায়নের ৩০টি MCQ সলভ করবো..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-slate-150 focus:outline-none focus:border-emerald-500"
                />
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-[#00ce9b] text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition duration-200 shrink-0"
                >
                  যুক্ত করুন ➕
                </button>
              </form>

              {/* Task list container */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl p-5 shadow-sm space-y-3.5">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-855 dark:text-slate-200 flex items-center gap-2">
                    <span>আজকের মোট মিশনসমূহ:</span>
                    <span className="bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md font-mono text-xs">{plannerTasks.length} টি</span>
                  </h5>
                  <span className="text-[10px] text-slate-400 font-medium">কমপ্লিট করতে বক্সে টিক দিন</span>
                </div>

                {plannerTasks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    কোন স্টাডি মেগা মিশন নেই। উপরে আপনার নতুন স্টাডি মিশন অ্যাড করুন!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {plannerTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          task.completed 
                            ? "bg-slate-50/70 dark:bg-slate-955 border-slate-100 dark:border-slate-850/40 opacity-75" 
                            : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-850 hover:border-emerald-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id)}
                            className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                              task.completed 
                                ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                                : "border-slate-300 dark:border-slate-700 hover:border-emerald-500"
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                          </button>
                          <span className={`text-xs select-none truncate pr-2 ${task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200 font-semibold"}`}>
                            {task.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-955 font-mono font-bold text-slate-450 dark:text-slate-400 px-2 py-0.5 rounded-md">
                            +{task.xp} XP
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC VIEW 2C: POINTS EXCHANGE / XP STORE */}
          {activeRightTab === "rewards" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left leading-normal">
                  <h4 className="font-extrabold text-sm text-amber-600 dark:text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
                    <Sparkles className="w-5 h-5 text-amber-500 fill-current animate-pulse" />
                    মেধা কয়েন ও রিওয়ার্ড স্টোর (Study Qoro XP Redeem Center)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">পরীক্ষায় সঠিক উত্তর দিয়ে অর্জিত XP ব্যয় করে লক হওয়া মেডিকেল লেকচার নোটস, বুয়েট ইঞ্জিনিয়ারিং ম্যাপ ও স্পেশাল অ্যাভাটার কিনুন!</p>
                </div>
                <div className="bg-slate-955 dark:bg-slate-900 border border-slate-700 font-mono text-xs font-black text-amber-400 px-4 py-2 rounded-2xl shrink-0 select-none">
                  আপনার কয়েন: {stats.points} XP
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "reward-book-1", title: "মেডিকেল ও ডেন্টাল এক্সক্লুসিভ নোটস", desc: "জীববিজ্ঞান ১ম ও ২য় পত্রের সকল ড্রয়িং, চার্ট ও শর্টকার্ট সূত্র সংকলন পিডিফ বুকলেট।", cost: 100, tag: "PDF BOOKLET", icon: "📚" },
                  { id: "reward-book-2", title: "বুয়েট ইঞ্জিনিয়ারিং ফ্ল্যাশ কার্ডস", desc: "রসায়নের সকল বিক্রিয়া ও পদার্থবিজ্ঞানের জটিল ইন্টিগ্রাল মেথডস মেমরি কার্ডস।", cost: 150, tag: "LEARNING UNIT", icon: "🧠" },
                  { id: "reward-book-3", title: "ঢাবি বিজ্ঞান ইউনিট এক্সক্লুসিভ প্রশ্ন ব্যাংক", desc: "বিগত ১০ বছরের ঢাকা বিশ্ববিদ্যালয়ের ক খ গ ইউনিটের ফিজিক্স-ম্যাথ নিখুঁত সলিউশন।", cost: 200, tag: "EXAM MASTER", icon: "🏆" },
                  { id: "reward-avatar-eagle", title: "প্রিমিয়াম অ্যাভাটার: সোনার ঈগল 🦅", desc: "এই অ্যাভাটারটি কিনলে প্রোফাইলের ঈগল অ্যাভাটার আনলক হবে যা সবার কাছে আপনার মেধা তুলে ধরবে।", cost: 300, tag: "EXCLUSIVE AVATAR", icon: "🦅" },
                  { id: "reward-avatar-dragon", title: "স্পেশাল অ্যাভাটার: ড্রাগন লর্ড 🐉", desc: "চূড়ান্ত কিংবদন্তী অ্যাভাটার। সবার উপরে লিডারবোর্ডে আপনার পাশে জ্বলজ্বল করবে এই ড্রাগন আইকন।", cost: 400, tag: "LEGEND AVATAR", icon: "🐉" },
                ].map(item => {
                  const isClaimed = purchasedRewards.includes(item.id);
                  const canAfford = stats.points >= item.cost;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-5 bg-white dark:bg-slate-900 border rounded-3xl flex flex-col justify-between gap-4 shadow-sm transition-all hover:border-amber-500/25 ${
                        isClaimed ? "border-emerald-500/20 bg-emerald-500/5 bg-opacity-30 animate-pulse" : "border-slate-150 dark:border-slate-850"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-955 text-slate-500 font-extrabold px-2 py-0.5 rounded-full uppercase">
                            {item.tag}
                          </span>
                          <span className="text-3xl">{item.icon}</span>
                        </div>
                        <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">{item.title}</h5>
                        <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 mt-1.5">
                        <span className="font-mono font-black text-amber-500 text-xs">
                          💰 {item.cost} XP
                        </span>
                        
                        {isClaimed ? (
                          <span className="text-emerald-500 dark:text-emerald-400 font-black text-xs inline-flex items-center gap-1 bg-emerald-100/10 px-3 py-1 rounded-xl">
                            Unlocked ✅
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePurchaseReward(item.id, item.cost, item.title)}
                            className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all ${
                              canAfford 
                                ? "bg-amber-500 hover:bg-yellow-400 text-slate-950 cursor-pointer" 
                                : "bg-slate-100 dark:bg-slate-955 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            আনলক করুন ⚡
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DYNAMIC VIEW 2D: GPA CARD & ACADEMIC CERTIFICATE */}
          {activeRightTab === "reportcard" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left leading-normal">
                  <h4 className="font-extrabold text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center md:justify-start gap-1.5">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    GPA কার্ড ও সার্টিফিকেট জেনারেটর (Academic Merit Certificate Generator)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">আপনার সিলেবাস ও প্রগ্রেশনের ওপর ভিত্তি করে ইনস্ট্যান্ট একাডেমিক রিপোর্ট কার্ড ও সার্টিফিকেট অফ মেরিট প্রস্তুত করুন!</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const total = Object.values(targetGPAInputs).reduce((a, b) => a + b, 0);
                    const avg = Number((total / Object.keys(targetGPAInputs).length).toFixed(2));
                    setCalculatedGPA(avg);
                    setShowCertificate(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2 rounded-xl text-xs transition duration-200 shrink-0"
                >
                  সার্টিফিকেট ইস্যু 🎖️
                </button>
              </div>

              {/* GPA projection calculator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
                <h5 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                  টার্গেট জিপিএ প্রজেকশন (Subject wise Target GPA)
                </h5>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: "bangla", label: "বাংলা ১ম ও ২য়" },
                    { id: "english", label: "English" },
                    { id: "physics", label: "পদার্থবিজ্ঞান" },
                    { id: "chemistry", label: "রসায়ন" },
                    { id: "math", label: "উচ্চতর গণিত" },
                    { id: "ict", label: "আইসিটি" }
                  ].map(su => (
                    <div key={su.id} className="space-y-1.5">
                      <label className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block">{su.label}</label>
                      <select 
                        value={targetGPAInputs[su.id] || 5}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTargetGPAInputs(prev => ({ ...prev, [su.id]: val }));
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="5">GPA 5.00 (Outstanding)</option>
                        <option value="4">GPA 4.00 (Excellent)</option>
                        <option value="3.5">GPA 3.50 (Good)</option>
                        <option value="3">GPA 3.00 (Pass)</option>
                        <option value="2">GPA 2.00 (Average)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate view */}
              {showCertificate ? (
                <div className="bg-amber-500/5 dark:bg-yellow-500/5 border-2 border-dashed border-amber-300 rounded-[28px] p-6 text-center space-y-6 relative overflow-hidden animate-fadeIn select-none">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/20 blur-xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-yellow-500/20 blur-xl" />
                  
                  <div id="printable-certificate" className="bg-white dark:bg-slate-950 border border-amber-500/40 p-8 rounded-2xl relative shadow-lg leading-relaxed text-slate-800 dark:text-slate-200">
                    <div className="absolute inset-2 border-2 border-double border-amber-500/25 rounded-xl pointer-events-none" />
                    
                    <span className="text-4xl block mb-2">⚜️</span>
                    <h3 className="font-serif italic text-amber-600 dark:text-amber-400 text-lg sm:text-xl font-bold tracking-tight">Study Qoro Digital Certificate</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Certificate of Academic Outstanding Merit</p>
                    
                    <div className="my-6 space-y-3.5">
                      <p className="text-xs text-slate-500">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,</p>
                      <h4 className="text-lg sm:text-xl font-black text-slate-855 dark:text-slate-100 font-sans border-b border-dashed border-slate-300 dark:border-slate-800 pb-2 max-w-sm mx-auto">
                        {stats.name}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                        তিনি সফলভাবে এইচএসসি সেশনের সিলেবাস প্রসেসিং এবং চ্যাপ্টার ওয়াইজ মডেল টেস্টে অসাধারণ পারফরম্যান্সের মাধ্যমে প্রোজেক্টেড ও সমন্বিত <span className="font-extrabold text-amber-500">জিপিএ {calculatedGPA.toFixed(2)}</span> স্কোর সম্পন্ন করেছেন।
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-6 text-[10px] text-slate-400">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">২রা জুন, ২০২৬</p>
                        <p>ইস্যুর তারিখ</p>
                      </div>
                      <div>
                        <p className="font-serif italic font-black text-amber-500 text-lg leading-tight">Dr. Qoro H.S.C</p>
                        <p className="border-t border-slate-200 dark:border-slate-800 max-w-[120px] mx-auto pt-0.5">অধ্যক্ষ, Study Qoro</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="bg-amber-500 hover:bg-yellow-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition duration-200"
                    >
                      সার্টিফিকেট প্রিন্ট করুন 🖨️
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCertificate(false)}
                      className="bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black px-4 py-2 rounded-xl text-xs transition duration-200"
                    >
                      বন্ধ করুন ✖
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* DYNAMIC VIEW 2E: ORDERS & MEMBERSHIP HISTORY */}
          {activeRightTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left leading-normal">
                  <h4 className="font-extrabold text-sm text-purple-600 dark:text-purple-400 flex items-center justify-center md:justify-start gap-1.5">
                    <CheckCheck className="w-5 h-5 text-purple-500" />
                    অর্ডার ও সাবস্ক্রিপশন (Invoice Logs & Payment Receipts)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">আপনার ক্রয়কৃত মেম্বারশিপ ও প্রিমিয়াম মডিউলের বিস্তারিত ই-রসিদসমূহ নিচে সংরক্ষিত রয়েছে।</p>
                </div>
                <div className="bg-purple-100 dark:bg-[#251e36] text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 text-[10px] font-black px-3.5 py-1.5 rounded-full select-none uppercase">
                  PRO LIFETIME ACTIVE
                </div>
              </div>

              {/* Invoices list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl p-5 shadow-sm space-y-4">
                <h5 className="font-extrabold text-xs sm:text-sm text-slate-855 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                  রসিদ মেমোর্যান্ডাম লগ (Authorized Payment Receipts)
                </h5>

                <div className="space-y-2.5">
                  {[
                    { id: "INV-2026-892348", date: "১৬ই জুন, ২০২৬", amount: "৳২৪৯ BDT", plan: "Study Qoro Premium Lifetime Modulo", txn: "TXN-STUDYQORO-892348A9" },
                    { id: "INV-2026-614050", date: "০২রা জুন, ২০২৬", amount: "৳০ BDT (ফ্রি ট্রায়াল)", plan: "Basic Student Initial Access", txn: "TXN-FREE-TRIAL" },
                  ].map((inv) => (
                    <div 
                      key={inv.id}
                      className="p-4 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-850/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:border-[#02ce9b]/25"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-inner">🧾</span>
                        <div>
                          <h6 className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100">{inv.plan}</h6>
                          <p className="text-[10px] text-slate-400 mt-0.5">ক্রয়কাল: {inv.date} • আইডি: {inv.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-center sm:text-right shrink-0">
                        <div>
                          <span className="block font-black text-xs text-slate-700 dark:text-slate-200">{inv.amount}</span>
                          <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-extrabold uppercase leading-none mt-1">সফল (Paid)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="bg-slate-900 hover:bg-slate-955 dark:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] transition"
                        >
                          রসিদ দেখুন 📜
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Detail Modal Popup */}
              {selectedInvoice && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl p-6 max-w-md w-full relative shadow-2xl leading-relaxed text-slate-800 dark:text-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 text-lg transition"
                    >
                      ✖
                    </button>

                    <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-3xl block">❇️</span>
                      <h4 className="font-extrabold text-slate-855 dark:text-slate-100 text-sm sm:text-base mt-2">Study Qoro Payment Memo</h4>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Official Bill of Transaction</p>
                    </div>

                    <div className="space-y-3.5 py-5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>ডাউট আইডি:</span>
                        <strong className="text-slate-855 dark:text-white font-mono">{selectedInvoice.id}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>তারিখ ও সময়:</span>
                        <strong className="text-slate-855 dark:text-white">{selectedInvoice.date}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>সাবস্ক্রিপশন প্রোডাক্ট:</span>
                        <strong className="text-slate-855 dark:text-white text-right">{selectedInvoice.plan}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>লেনদেন (TXN) আইডি:</span>
                        <strong className="text-slate-855 dark:text-white font-mono">{selectedInvoice.txn}</strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-sm">
                        <span>মোট পরিশোধিত মূল্য:</span>
                        <strong className="text-emerald-500 font-extrabold">{selectedInvoice.amount}</strong>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-955 rounded-2xl text-[10px] text-slate-400">
                      🔒 এটি একটি স্বয়ংক্রিয় ব্যাংক-ভেরিফাইড রসিদ মেমোর্যান্ডাম। bKash / SSC Online GATEWAY দ্বারা পরিশোধিত।
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                        }}
                        className="flex-1 bg-emerald-505 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition"
                      >
                        প্রিন্ট রসিদ PDF 🖨️
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(null)}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs transition border border-slate-300 dark:border-slate-700"
                      >
                        বন্ধ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC VIEW 3: MISTAKE VAULT RETRY EXAMS */}
          {activeRightTab === "mistakes" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-5 rounded-3xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/15 leading-relaxed space-y-1.5 text-center sm:text-left">
                <h4 className="font-extrabold text-xs sm:text-sm text-rose-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                  ভুল উত্তরের ডায়েরী ভল্ট (Mistake Vault)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">পরীক্ষার প্রস্তুতি নিতে গিয়ে যে প্রশ্নগুলো আপনার ভুল হয়েছিল, তা এখানে সংরক্ষিত আছে। প্রতিটি সমস্যা সমাধান করে সংশোধিত করুন এবং লাভ করুন <strong className="text-yellow-600 dark:text-yellow-400">+২৫ XP বোনাস</strong>!</p>
              </div>

              {mistakes.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <span className="text-4xl block mb-2">🎉</span>
                  <h5 className="font-black text-slate-800 dark:text-slate-100 text-sm">কোনো পেন্ডিং ভুল প্রশ্নপত্র নেই!</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">সব কুইজ সার্থকভাবে সংশোধিত হয়েছে। চমৎকার!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mistakes.map((m, index) => {
                    const isCorrect = quizFeedbacks[m.id]?.status === "correct";
                    const hasSelected = selectedAnswers[m.id] !== undefined;

                    return (
                      <div 
                        key={m.id}
                        className={`p-5 bg-white dark:bg-slate-900 border rounded-2.5xl transition-all shadow-sm ${
                          isCorrect ? "border-emerald-500 bg-emerald-500/5" : "border-slate-150 dark:border-slate-850"
                        }`}
                      >
                        <div className="flex justify-between items-center pb-2.5 mb-3.5 border-b border-slate-100 dark:border-slate-850 text-[10px] text-slate-400">
                          <span className="font-black uppercase tracking-wider text-slate-550 dark:text-slate-400">{m.subject} • {m.chapter}</span>
                          <span className="font-black text-rose-500">{isCorrect ? "✅ সংশোধিত" : "❌ পেন্ডিং রিবিল্ড"}</span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">{m.questionText}</p>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {m.options.map((opt, oIdx) => {
                              const picked = selectedAnswers[m.id] === oIdx;
                              const isCorrectOpt = m.correctIndex === oIdx;
                              
                              let styleCol = "bg-slate-50/70 hover:bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300 border-slate-100 dark:border-slate-850";
                              if (picked) {
                                styleCol = isCorrectOpt ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" : "bg-rose-500/10 border-rose-500 text-rose-600";
                              } else if (revealedExplanations[m.id] && isCorrectOpt) {
                                styleCol = "bg-emerald-500/10 border-emerald-500/40 text-emerald-600";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={isCorrect}
                                  onClick={() => handleAnswerOption(m.id, oIdx, m.correctIndex)}
                                  className={`w-full p-2.5 border rounded-xl text-xs text-left transition-all ${styleCol}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {quizFeedbacks[m.id] && (
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl leading-relaxed text-[11px] text-slate-500">
                              <p className="font-black text-slate-700 dark:text-slate-200">সঠিক উত্তর ও বিশ্লেষণ:</p>
                              <p className="mt-1">{m.explanation}</p>
                            </div>
                          )}

                          {!quizFeedbacks[m.id] && (
                            <div className="flex justify-between items-center pt-1.5 text-[10px]">
                              <button
                                onClick={() => setRevealedExplanations(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                                className="text-slate-400 hover:text-emerald-500 transition-colors uppercase font-black"
                              >
                                {revealedExplanations[m.id] ? "ব্যাখ্যা বন্ধ করুন" : "সঠিক উত্তর দেখুন"}
                              </button>
                              <button 
                                onClick={() => removeMistake(m.id)}
                                className="text-slate-400 hover:text-rose-500 transition-colors font-bold"
                              >
                                ভল্ট থেকে সরাসরি ডিলিট
                              </button>
                            </div>
                          )}

                          {revealedExplanations[m.id] && !quizFeedbacks[m.id] && (
                            <p className="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 text-[10px] text-slate-450 leading-normal">
                              {m.explanation}
                            </p>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* DYNAMIC VIEW 4: PERSONAL & ACADEMIC EDITING PANEL (Chorcha fully customizable style) */}
          {activeRightTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Settings Category Switching Header pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-955 rounded-2xl overflow-x-auto scrollbar-none border border-slate-150 dark:border-slate-850 select-none">
                {[
                  { id: "personal", label: "ব্যক্তিগত তথ্য", icon: User },
                  { id: "academic", label: "একাডেমিক তথ্য", icon: GraduationCap },
                  { id: "security", label: "নিরাপত্তা ও লিঙ্ক অ্যাকাউন্ট", icon: KeyRound },
                  { id: "danger", label: "ডেঞ্জার জোন", icon: AlertCircle }
                ].map(pSub => (
                  <button
                    key={pSub.id}
                    onClick={() => setActiveSettingSub(pSub.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                      activeSettingSub === pSub.id
                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    }`}
                  >
                    <pSub.icon className="w-3.5 h-3.5" />
                    <span>{pSub.label}</span>
                  </button>
                ))}
              </div>

              {saveFeedback && (
                <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl text-xs font-bold font-sans animate-bounce">
                  {saveFeedback}
                </div>
              )}

              {/* 4.1 PERSONAL INFORMATION FORM */}
              {activeSettingSub === "personal" && (
                <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-1">
                    <User className="w-4.5 h-4.5 text-emerald-500" />
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-150">ব্যক্তিগত তথ্যাদি এডিট (Personal Info)</h4>
                  </div>

                  {/* Avatar Picker layout */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">প্রোফাইল অ্যাভাটার ইমোজি নির্বাচন করুন:</label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVATAR_OPTIONS.map(av => {
                        const isSelected = formAvatar === av.emoji;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setFormAvatar(av.emoji)}
                            className={`p-3 rounded-2xl text-xl transition-all border shrink-0 flex flex-col items-center gap-1 ${
                              isSelected 
                                ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 scale-105" 
                                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
                            }`}
                          >
                            <span>{av.emoji}</span>
                            <span className="text-[8px] font-bold text-slate-400">{av.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">শিক্ষার্থীর নাম (Name):</label>
                      <input 
                        type="text" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                        maxLength={40}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">জন্ম তারিখ (Date of Birth):</label>
                      <input 
                        type="date" 
                        value={formDob}
                        onChange={(e) => setFormDob(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">শিক্ষার্থী লিঙ্গ (Gender):</label>
                      <select 
                        value={formGender}
                        onChange={(e) => setFormDobGender(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-955 border border-slate-200 dark:border-slate-805 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="male">ছাত্র (Male)</option>
                        <option value="female">ছাত্রী (Female)</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">স্থায়ী বা বর্তমান ঠিকানা (Address):</label>
                      <input 
                        type="text" 
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="ঠিকানা প্রদান করুন (যেমন: ঢাকা)"
                        className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                    >
                      ব্যক্তিগত তথ্য সংরক্ষণ করুন 💾
                    </button>
                  </div>
                </form>
              )}

              {/* 4.2 ACADEMIC INFORMATION FORM */}
              {activeSettingSub === "academic" && (
                <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-5 animate-fadeIn">
                  
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-1">
                    <GraduationCap className="w-4.5 h-4.5 text-emerald-500" />
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-150">একাডেমিক রেকর্ড ও বোর্ড এডিট (Academic Info)</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">শিক্ষা প্রতিষ্ঠানের নাম (College/School):</label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                        <div className="flex-1 min-w-0">
                          {stats.collegeName ? (
                            <>
                              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{stats.collegeName}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{stats.division} • {stats.district}</div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-500 italic">এখনো কলেজ নির্বাচন করা হয়নি</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new CustomEvent("open-college-selector"))}
                          className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg text-[10px] sm:text-xs font-bold transition-colors shrink-0 border border-emerald-200 dark:border-emerald-800/50"
                        >
                          কলেজ পরিবর্তন
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">কী নিয়ে আলোচনা বা চর্চা করতে চাও? (Category):</label>
                      <select 
                        value={formClassCode}
                        onChange={(e) => setFormClassCode(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="HSC">এইচএসসি / বিশ্ববিদ্যালয় অ্যাডমিশন</option>
                        <option value="SSC">এসএসসি / দাখিল মাধ্যমিক</option>
                        <option value="BCS">বিসিএস প্রিলিমিনারি / সরকারি চাকরি</option>
                        <option value="CLASS_8">ক্লাস ৮ম / জুনিয়র কারিকুলাম</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">পড়াশোনার গ্রুপ (Division):</label>
                      <select 
                        value={formGroup}
                        onChange={(e) => setFormGroup(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="SCIENCE">বিজ্ঞান (Science)</option>
                        <option value="COMMERCE">বাণিজ্য (Business Studies)</option>
                        <option value="ARTS">মানবিক (Humanities)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">শিক্ষাবর্ষ ব্যাচ (Academic Batch):</label>
                      <select 
                        value={formBatch}
                        onChange={(e) => setFormBatch(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="HSC_2025">রি-অ্যাডমিশন ২০২৫</option>
                        <option value="HSC_2026">এইচএসসি ২০২৬</option>
                        <option value="HSC_2027">এইচএসসি ২০২৭</option>
                        <option value="HSC_2028">এইচএসসি ২০২৮</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">শিক্ষা বোর্ড (Education Board):</label>
                      <select 
                        value={formBoard}
                        onChange={(e) => setFormBoard(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="Dhaka">ঢাকা (Dhaka Board)</option>
                        <option value="Comilla">কুমিল্লা Board</option>
                        <option value="Rajshahi">রাজশাহী Board</option>
                        <option value="Chattogram">চট্টগ্রাম Board</option>
                        <option value="Mymensingh">ময়মনসিংহ Board</option>
                        <option value="Sylhet">সিলেট Board</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">এসএসসি রোল নম্বর (SSC Roll):</label>
                      <input 
                        type="number" 
                        value={formSscRoll}
                        onChange={(e) => setFormSscRoll(e.target.value)}
                        placeholder="রোল নম্বর"
                        className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">এসএসসি রেজিস্ট্রেশন (SSC Reg):</label>
                      <input 
                        type="number" 
                        value={formSscReg}
                        onChange={(e) => setFormSscReg(e.target.value)}
                        placeholder="রেজিস্ট্রেশন"
                        className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">এসএসসি পাসের বছর (Passing Year):</label>
                      <select 
                        value={formPassingYear}
                        onChange={(e) => setFormPassingYear(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50/55 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Subjects Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">ঐচ্ছিক বিষয়সমূহ ও অতিরিক্ত কোর্স কোটা (Optional Subjects):</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: "higher-math", label: "উচ্চতর গণিত" },
                        { id: "biology", label: "জীববিজ্ঞান" },
                        { id: "agriculture", label: "কৃষিশিক্ষা" },
                        { id: "statistics", label: "পরিসংখ্যান" }
                      ].map(vSub => {
                        const isSet = formOptionalSubjects.includes(vSub.id);
                        return (
                          <div 
                            key={vSub.id}
                            onClick={() => toggleOptionalSubject(vSub.id)}
                            className={`p-3 rounded-2xl border text-xs text-center cursor-pointer transition-all flex items-center justify-center gap-2 select-none ${
                              isSet 
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-450 font-bold" 
                                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span>{isSet ? "✓" : "○"}</span>
                            <span>{vSub.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                    >
                      একাডেমিক রেকর্ড সংরক্ষণ দিন 🎓
                    </button>
                  </div>
                </form>
              )}

              {/* 4.3 CHANGE PASSWORD & CREDENTIALS SECURITIES */}
              {activeSettingSub === "security" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Password update form */}
                  <form onSubmit={handlePasswordSave} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-1">
                      <KeyRound className="w-4.5 h-4.5 text-emerald-500" />
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-150 font-bengali">পাসওয়ার্ড পরিবর্তন (Change Password)</h4>
                    </div>

                    {passwordFeedback && (
                      <p className="text-[11px] font-bold text-amber-500">{passwordFeedback}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">নতুন পাসওয়ার্ড (New Password):</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="কমপক্ষে ৬টি অক্ষর"
                          className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">পাসওয়ার্ড নিশ্চিত করুন (Confirm Password):</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="পুনরায় টাইপ করুন"
                          className="w-full px-3.5 py-2 bg-slate-50/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        পাসওয়ার্ড আপডেট করুন 🔑
                      </button>
                    </div>
                  </form>

                  {/* Device session tracker matching Chorcha */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-3.5 text-xs text-slate-550 leading-relaxed font-sans">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-1">
                      <Fingerprint className="w-4.5 h-4.5 text-emerald-500" />
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-150">সক্রিয় লগইন ডিভাইস (Active Browser Sessions)</h4>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800 dark:text-white">Active Chrome (Current Browser)</p>
                        <p className="text-[10px] text-zinc-400">IP: 104.28.32.115 • Cloud Run Container Ingress Node</p>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase">অনলাইন</span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal">
                      এটি একটি প্রিমিয়াম এন্ড-টু-এন্ড সিকিউরিটির পার্ট। একাধিক ব্রাউজারে একই সাথে একটি সেশন খোলা থাকলে এই প্যানেল থেকে তা ডিটেক্ট করা যায়।
                    </p>
                  </div>

                </div>
              )}

              {/* 4.4 ACCOUNTS DANGER ZONE RESET & DELETE */}
              {activeSettingSub === "danger" && (
                <div className="bg-white dark:bg-slate-900 border border-rose-500/25 p-6 rounded-3xl shadow-sm space-y-5 animate-fadeIn">
                  
                  <div className="flex items-center gap-2 border-b border-rose-100 dark:border-rose-950/20 pb-2 mb-1 text-rose-500">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                    <h4 className="font-extrabold text-xs sm:text-sm">বিপদজনক জোন (Danger Zone - Danger Area)</h4>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                    নিচের অ্যাকশনটি অত্যন্ত সংবেদনশীল। অ্যাকাউন্ট রিসেট বা সম্পন্ন ক্যাশে ডিলিট করলে আপনার অর্জিত সমস্ত সিলেবাস প্রোগ্রেস, লেকচার নোটস এবং মেধা এক্সপি চিরতরে মুছে যাবে।
                  </p>

                  <div className="p-4 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/15 rounded-2xl space-y-3.5">
                    <label className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block">নিশ্চিত করতে নিচে 'DELETE' শব্দটি বড়হাতে টাইপ করুন:</label>
                    <input 
                      type="text" 
                      value={deleteConfirmType}
                      onChange={(e) => setDeleteConfirmType(e.target.value)}
                      placeholder="সবচেয়ে বিপজ্জনক অ্যাকশন নিশ্চিত করুন"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-900/60 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-rose-500 transition-colors uppercase font-mono"
                    />
                  </div>

                  <div className="flex justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmType("")}
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-500 font-bold text-xs rounded-xl transition-all"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteProceed}
                      disabled={deleteConfirmType !== "DELETE"}
                      className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      নিশ্চিত সম্পূর্ণ অ্যাকাউন্ট ডিলিট করুন 🗑️
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
