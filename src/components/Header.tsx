/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Bell, Flame, Sparkles, Moon, Sun, Play, LogIn, User, Menu } from "lucide-react";
import { StudentStats } from "../types";

interface HeaderProps {
  stats: StudentStats;
  onQuickExam: () => void;
  onUpgrade: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onProfileClick?: () => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export default function Header({ 
  stats, 
  onQuickExam, 
  onUpgrade, 
  onOpenAuth, 
  darkMode, 
  setDarkMode, 
  onProfileClick,
  isSidebarOpen,
  setIsSidebarOpen
}: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Time-based Bangla greeting
  const getBanglaGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "সুপ্রভাত";
    if (hours < 16) return "শুভ দুপুর";
    if (hours < 18) return "শুভ বিকেল";
    return "শুভ সন্ধ্যা";
  };

  const dummyNotifications = [
    { id: 1, text: "🔥 তোমার ৩ দিনের স্টাডি স্ট্রেইক বজায় রাখতে ১টি কুইক টেস্ট দাও!", time: "১০ মিনিট আগে" },
    { id: 2, text: "🏆 Asha Khatun লিডারবোর্ডে নতুন রেকর্ড গড়েছে, তাকে টক্কর দাও!", time: "১ ঘণ্টা আগে" }
  ];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-150/50 dark:border-slate-800/80 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
      
      {/* 1. Left side Greetings - Exact text weight and formatting of the screenshot */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Hamburger Menu Button for mobile/tablet */}
        <button
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors shadow-sm shrink-0"
          title="মেনু খুলুন"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Greeting deleted as requested */}
      </div>

      {/* 2. Right side elements from the screenshot: Notification, Avatar Profile, Theme switch slider */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Notification Bell Outlined Button with subtle boundary and small red circle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-slate-700 dark:text-slate-300 transition-colors shadow-sm relative animate-none"
          >
            <Bell className="w-4.5 h-4.5 sm:w-[19px] sm:h-[19px] text-[#475569] dark:text-slate-400 stroke-[2.2]" />
            <span className="absolute top-[2px] right-[2px] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#ef4444] border border-white dark:border-slate-950 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3.5 w-72 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-700 dark:text-slate-300">সাম্প্রতিক বিজ্ঞপ্তি</span>
                <span 
                  onClick={() => setNotificationsOpen(false)}
                  className="text-emerald-600 dark:text-emerald-400 cursor-pointer text-[10px] hover:underline"
                >
                  সব বন্ধ করুন
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-900">
                {dummyNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{notif.text}</p>
                    <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emerald green gradient circular profile badge containing white bold first letter of the name */}
        <div 
          onClick={onProfileClick}
          className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full bg-gradient-to-tr from-emerald-500 to-[#00ce9b] dark:from-emerald-600 dark:to-teal-500 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-sm select-none tracking-wide cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
          title="আপনার প্রোগ্রেস ও প্রোফাইল এ যান"
        >
          {stats.name ? stats.name.trim().charAt(0).toUpperCase() : "T"}
        </div>

        {/* Sliding Pill Custom switch for Theme Toggling */}
        <div 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-[56px] h-[32px] sm:w-[68px] sm:h-[36px] flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 relative border shrink-0 ${
            darkMode 
              ? "bg-slate-800 border-slate-700" 
              : "bg-slate-200 border-slate-300/40"
          }`}
          title="থিম পরিবর্তন করুন"
        >
          <div
            className={`w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 transform ${
              darkMode ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <span className="text-[10px] sm:text-[11.5px] select-none">☀️</span>
            ) : (
              <span className="text-[10px] sm:text-[11.5px] select-none">🌙</span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
