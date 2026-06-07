/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import QuestionBank from "./components/QuestionBank";
import MockExam from "./components/MockExam";
import ChorchaAI from "./components/ChorchaAI";
import BattleExam from "./components/BattleExam";
import StudyTimer from "./components/StudyTimer";
import ProgressTracker from "./components/ProgressTracker";
import HistoryLog from "./components/HistoryLog";
import AuthModal from "./components/AuthModal";
import Leaderboard from "./components/Leaderboard";
import { StudentStats, Question } from "./types";
import { Sparkles, Trophy, X, ShieldAlert, BadgeCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab ] = useState<string>("dashboard");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode matching screenshot!
  const [questions, setQuestions] = useState<Question[]>([]);

  // Default initial Guest account with full informational lists
  const [stats, setStats] = useState<StudentStats>({
    name: "গেস্ট পরীক্ষার্থী (Guest Student)",
    points: 15,
    streak: 0, 
    level: 1,
    rank: 99912,
    examsGiven: 0,
    totalQuestionsSolved: 0,
    plan: "Free",
    completedMilestones: [],
    isGuest: true // Flag to restrict premium actions
  } as any);

  // Sync dark class to the document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Deep-link check to auto-navigate to Battle tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get("room") || urlParams.get("battle");
    if (roomFromUrl) {
      setActiveTab("battle");
    }
  }, []);

  // Study Qoro Security Suite: Disable F12, Right-click Inspect, Dragging, and Copying
  useEffect(() => {
    // 1. Disable context menu (right click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable text selection globally except on input/textarea nodes
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea" || target.isContentEditable) {
          return;
        }
      }
      e.preventDefault();
    };

    // 3. Prevent dragging on image components
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName.toLowerCase() === "img") {
        e.preventDefault();
      }
    };

    // 4. Disable developer shortcut keys: F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+S
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U or Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S or Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S" || e.keyCode === 83)) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I or Cmd+Option+I (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "i" || e.key === "I" || e.keyCode === 73)) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J or Cmd+Option+J (Console window)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "j" || e.key === "J" || e.keyCode === 74)) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C or Cmd+Option+C (Inspect Element selector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "c" || e.key === "C" || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
    };

    // Bind event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    // Add CSS properties to disable selection globally and pointer events on images
    const styleElement = document.createElement("style");
    styleElement.id = "study-qoro-security-styles";
    styleElement.innerHTML = `
      body, html, #root {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      img {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup functions
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
      const style = document.getElementById("study-qoro-security-styles");
      if (style) {
        style.remove();
      }
    };
  }, []);

  // Dynamic questions loader
  useEffect(() => {
    const fetchQ = async () => {
      try {
        const res = await fetch("/api/db/questions");
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          }
        }
      } catch (e) {
        console.error("Error loading db questions in App:", e);
      }
    };
    fetchQ();
  }, [activeTab]);

  const handleQuickExamLauncher = () => {
    setActiveTab("mocks");
  };

  const handleUpgradeToPro = () => {
    if (stats.isGuest) {
      setShowAuthModal(true);
      return;
    }
    setStats(prev => ({ ...prev, plan: "Pro" }));
    setShowUpgradeModal(false);
  };

  // Route tab checks. Allow full navigation for smooth previewing
  const handleTabSelection = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (stats.isGuest) {
    return (
      <>
        <LandingPage 
          onOpenAuth={() => setShowAuthModal(true)}
          stats={stats}
          setStats={setStats}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          stats={stats}
          setStats={setStats}
          isForceLogin={false}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-[#F7F8F9] text-slate-800"}`}>
      <div className="flex font-sans min-h-screen">
        
        {/* 1. Left Navigation Menu Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabSelection} 
          stats={stats} 
          onUpgrade={() => setShowUpgradeModal(true)} 
          onOpenAuth={() => setShowAuthModal(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* 2. Main content area on the right side */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <Header 
            stats={stats} 
            onQuickExam={handleQuickExamLauncher} 
            onUpgrade={() => setShowUpgradeModal(true)} 
            onOpenAuth={() => setShowAuthModal(true)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="flex-grow p-5 sm:p-7 max-w-7xl mx-auto w-full">
            {activeTab === "dashboard" && (
              <Dashboard 
                stats={stats} 
                setStats={setStats} 
                setActiveTab={handleTabSelection} 
                onQuickExam={handleQuickExamLauncher} 
                onOpenAuth={() => setShowAuthModal(true)}
              />
            )}

            {activeTab === "questions" && (
              <QuestionBank 
                stats={stats} 
                setStats={setStats} 
                questions={questions}
              />
            )}

            {activeTab === "mocks" && (
              <MockExam 
                stats={stats} 
                setStats={setStats} 
                questions={questions}
              />
            )}

            {activeTab === "ai" && (
              <ChorchaAI 
                stats={stats} 
                setStats={setStats} 
                onUpgrade={() => setShowUpgradeModal(true)}
              />
            )}

            {activeTab === "battle" && (
              <BattleExam 
                stats={stats} 
                setStats={setStats} 
                questions={questions}
              />
            )}

            {activeTab === "leaderboard" && (
              <Leaderboard 
                stats={stats} 
              />
            )}


            {activeTab === "timer" && (
              <StudyTimer 
                stats={stats} 
                setStats={setStats} 
              />
            )}

            {activeTab === "history" && (
              <HistoryLog 
                stats={stats} 
              />
            )}

            {activeTab === "progress" && (
              <ProgressTracker 
                stats={stats} 
              />
            )}
          </main>

          {/* Dynamic ultra-modern Footer */}
          <footer className="py-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950 text-slate-400 text-[10px] text-center transition-colors">
            <p>© {new Date().getFullYear()} Study Qoro পোর্টালে তোমার পড়াশোনা সহজ হোক। সমস্ত তথ্যাদি বাংলাদেশ শিক্ষাবোর্ড HSC ও এডমিশন কারিকুলাম অনুসারে সাজানো।</p>
          </footer>
        </div>

        {/* 3. Aesthetic Premium Upgrade popup Modal */}
        {showUpgradeModal && (
          <div id="upgrade-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full relative space-y-5 shadow-2xl text-slate-800 dark:text-slate-100">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 mx-auto">
                  <Sparkles className="w-6 h-6 fill-current text-slate-950 animate-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">Upgrade to PRO Member</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সেরা প্রস্তুতি এবং মানসিক স্থিতিশীলতার টুলস আনলক করো!</p>
              </div>

              {/* Benefit highlights list */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                <div className="flex gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <BadgeCheck className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span><strong>সীমাহীন Study Qoro AI কুয়েরি:</strong> প্রতিটি এমসিকিউ প্রশ্নের বিস্তারিত সলিউশন পাও।</span>
                </div>
                <div className="flex gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <BadgeCheck className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span><strong>জাতীয় লিডারবোর্ড আনলক:</strong> তোমার সহপাঠীদের সাথে জাতীয় পর্যায়ে প্রতিযোগিতা করো।</span>
                </div>
                <div className="flex gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <BadgeCheck className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span><strong>কাস্টম রিভিশন সেট ও নামাজী টাইমার:</strong> সেশনসমূহ সুন্দরভাবে পরিচালনার স্পেশাল রুটিন।</span>
                </div>
              </div>

              <div className="text-center pt-1">
                <div className="text-slate-400 text-xs">আজকের অফার প্রাইস:</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">৳২৪৯ <span className="text-xs text-slate-400">/ ওয়ান-টাইম লাইফ-টাইম</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-705 transition-colors"
                >
                  পরে করবো
                </button>
                <button
                  onClick={handleUpgradeToPro}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all"
                >
                  অনুমোদন ও আপগ্রেড দিন
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 4. Elegant signup / login credentials popup portal Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          stats={stats}
          setStats={setStats}
        />

      </div>
    </div>
  );
}
