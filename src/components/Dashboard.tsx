/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import { StudentStats } from "../types";
import { FileText, Target, Trophy, Lock, Users, Sparkles, UserPlus, ArrowUpRight, Award, Shield, Zap, Star, ChevronRight } from "lucide-react";

// ==========================================
// IMPORT PREMIUM MODERN FLAT SVG ILLUSTRATIONS
// ==========================================
import questionBankImg from "../../svg_images/new/question.svg";
import battleImg from "../../svg_images/new/eaxm_war.svg";
import studyMaterialsImg from "../../svg_images/new/studyMATERIALS.svg";
import timerImg from "../../svg_images/new/fast-practise.svg";
import mocksImg from "../../svg_images/new/moktest.svg";
import aiImg from "../../svg_images/instructor_icon-0caxuzpv5pngv.svg";
import leaderboardImg from "../../svg_images/new/leaderboard.svg";
import progressImg from "../../svg_images/new/progress.svg";
import historyImg from "../../svg_images/new/history.svg";
import studentIcon from "../../svg_images/student_icon.0zq-mh67whwod.svg";

const otherFeaturesImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="20" height="20" rx="7" fill="%2300be90" fill-opacity="0.15" stroke="%2300be90" stroke-width="4"/><rect x="36" y="8" width="20" height="20" rx="7" fill="%2300be90" fill-opacity="0.15" stroke="%2300be90" stroke-width="4"/><rect x="8" y="36" width="20" height="20" rx="7" fill="%2300be90" fill-opacity="0.15" stroke="%2300be90" stroke-width="4"/><rect x="36" y="36" width="20" height="20" rx="7" fill="%2300be90" fill-opacity="0.15" stroke="%2300be90" stroke-width="4"/><circle cx="18" cy="18" r="3" fill="%2300be90"/><circle cx="46" cy="18" r="3" fill="%2300be90"/><circle cx="18" cy="46" r="3" fill="%2300be90"/><circle cx="46" cy="46" r="3" fill="%2300be90"/></svg>`;

interface DashboardProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  setActiveTab: (tab: string) => void;
  onQuickExam: () => void;
  onOpenAuth: () => void;
  onOpenSidebar?: () => void;
}

export default function Dashboard({ stats, setStats, setActiveTab, onQuickExam, onOpenAuth, onOpenSidebar }: DashboardProps) {
  const handleBentoClick = (tabId: string) => {
    if (tabId === "other_features") {
      onOpenSidebar?.();
      return;
    }
    if (stats.isGuest && (tabId === "battle" || tabId === "progress")) {
      onOpenAuth();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto text-slate-800 dark:text-slate-100 pb-12 select-none">
      
      {/* Universal Beautiful Responsive Dashboard Header Section */}
      <div className="feature-header-section px-4 sm:px-2 pt-2 md:pt-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-display tracking-tight">
          ড্যাশবোর্ড
        </h1>
      </div>

      {/* 3. MULTI-COLUMN APP-BAR GRID OF PREMIUM CONCEPTUAL ILLUSTRATED TILES */}
      <div id="core-interactive-decks" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] p-4 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        


        {/* 4-Column Grid Layout matching the screenshot for mobile, expansive grid for desktop */}
        <div className="feature-grid grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 justify-center items-stretch">
          
          {[
            {
              id: "questions",
              title: "প্রশ্ন ব্যাংক",
              image: questionBankImg
            },
            {
              id: "timer",
              title: "দ্রুত প্র্যাকটিস",
              image: timerImg
            },
            {
              id: "mocks",
              title: "মক টেস্ট",
              image: mocksImg
            },
            {
              id: "leaderboard",
              title: "লিডারবোর্ড",
              image: leaderboardImg
            },
            {
              id: "battle",
              title: "এক্সাম ওয়ার",
              image: battleImg
            },
            {
              id: "materials",
              title: "স্টাডি ম্যাটেরিয়ালস",
              image: studyMaterialsImg
            },
            {
              id: "progress",
              title: "প্রগ্রেস",
              image: progressImg
            },
            {
              id: "other_features",
              title: "অন্যান্য ফিচারসমূহ",
              image: otherFeaturesImg,
              noInvert: true
            }
          ].map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleBentoClick(item.id)}
              whileTap={{ scale: 0.96 }}
              className="feature-card group flex flex-col items-center justify-start cursor-pointer select-none text-slate-800 dark:text-slate-100 w-full"
            >
              {/* Squircles matching screenshot exactly without cropping and box styled */}
              <div className="feature-icon-container">
                <img 
                  src={item.image} 
                  className={`feature-icon w-full h-full object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-305 group-hover:scale-106 ${item.noInvert ? "no-invert" : ""}`} 
                  referrerPolicy="no-referrer" 
                  alt={item.title} 
                />
              </div>

              {/* Minimal Clean Text Label directly centered below the card tile for both mobile & desktop */}
              <span className="feature-label">
                {item.title}
              </span>
            </motion.div>
          ))}

        </div>
      </div>

      {/* 4. PREMIUM UNIVERSAL RESPONSIVE STATS & FRIENDS PANEL */}
      <div className="stats-friends-panel max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mt-8 px-2 sm:px-0">
        
        {/* Card 1: পরীক্ষা (Completed Exams) */}
        <div className="group relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-3xl p-4.5 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(14,165,233,0.08)] hover:-translate-y-1 hover:border-sky-200/50 dark:hover:border-sky-500/20 transition-all duration-300 overflow-hidden">
          {/* Subtle Ambient Background Aura */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-sky-400/5 dark:bg-sky-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">পরীক্ষা</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <FileText className="w-4.5 h-4.5 pointer-events-none transition-transform group-hover:scale-110" />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white leading-none font-display tracking-tight flex items-baseline gap-1">
              <span>{stats.examsGiven}</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">টি</span>
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>স্মার্ট মূল্যায়ন</span>
            </div>
          </div>
        </div>

        {/* Card 2: প্রশ্নব্যাংক (Question Bank) */}
        <div className="group relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-3xl p-4.5 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] hover:-translate-y-1 hover:border-emerald-200/50 dark:hover:border-emerald-500/20 transition-all duration-300 overflow-hidden">
          {/* Subtle Ambient Background Aura */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-400/5 dark:bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">প্রশ্ন ব্যাংক</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Target className="w-4.5 h-4.5 pointer-events-none transition-transform group-hover:scale-110" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white leading-none font-display tracking-tight text-emerald-600 dark:text-emerald-400">
              9,385+
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>সক্রিয় প্রশ্ন ভাণ্ডার</span>
            </div>
          </div>
        </div>

        {/* Card 3: র‍্যাংক (National Rank) */}
        <div className="group relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-3xl p-4.5 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.08)] hover:-translate-y-1 hover:border-amber-200/50 dark:hover:border-amber-500/20 transition-all duration-300 overflow-hidden">
          {/* Subtle Ambient Background Aura */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/5 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">মেধাক্রম</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Trophy className="w-4.5 h-4.5 pointer-events-none transition-transform group-hover:scale-110" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white leading-none font-display tracking-tight text-amber-600 dark:text-amber-400">
              #{stats.rank || 64}
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>জাতীয় অবস্থান</span>
            </div>
          </div>
        </div>

        {/* Card 4: PLAN (Membership Plan) */}
        <div className="group relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-3xl p-4.5 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(139,92,246,0.08)] hover:-translate-y-1 hover:border-violet-200/50 dark:hover:border-violet-500/20 transition-all duration-300 overflow-hidden">
          {/* Subtle Ambient Background Aura */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-violet-400/5 dark:bg-violet-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">অ্যাকাউন্ট</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 dark:text-violet-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4.5 h-4.5 pointer-events-none transition-transform group-hover:scale-110" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white leading-none font-display tracking-tight text-violet-600 dark:text-violet-400">
              {stats.plan === "Free" ? "ফ্রি প্ল্যান" : "প্রো মেম্বার"}
            </div>
            <div className="flex items-center gap-1 group/btn text-[10.5px] font-bold text-violet-600 dark:text-violet-400 cursor-pointer hover:opacity-85 mt-1.5 transition-all">
              <span className="underline decoration-dotted underline-offset-3">আপগ্রেড করুন</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Card 5: Friends (Classmates) */}
        <div className="group relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-3xl flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(168,85,247,0.08)] hover:-translate-y-1 hover:border-purple-200/50 dark:hover:border-purple-500/20 transition-all duration-300 col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden min-h-[145px]">
          {/* Subtle Ambient Background Aura */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-400/5 dark:bg-purple-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          {/* Header Part with Padding */}
          <div className="p-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6.5 h-6.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4 pointer-events-none transition-transform group-hover:scale-105" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">সহপাঠী</span>
            </div>
            
            <button className="text-[10px] font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 transition-colors">
              সব দেখুন
            </button>
          </div>

          {/* Clean minimal abstract graphics representing empty friends list with visual premium style */}
          <div className="px-4 py-1.5 flex items-center gap-1 justify-center">
            {/* Visual multi-bubble preview initials */}
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border border-white dark:border-slate-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-[8px] font-extrabold text-white">S</div>
              <div className="w-6 h-6 rounded-full border border-white dark:border-slate-950 bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-[8px] font-extrabold text-white">K</div>
              <div className="w-6 h-6 rounded-full border border-white dark:border-slate-950 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[8px] font-extrabold text-white">+</div>
            </div>
          </div>

          <div className="p-4 pt-1 flex flex-col items-center justify-center gap-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold text-center">
              এখনও কোনো সহপাঠী যুক্ত নেই
            </p>
            <button className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 active:scale-97 transition-all cursor-pointer">
              <UserPlus className="w-3.5 h-3.5" />
              <span>সহপাঠী যুক্ত করুন</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. LUXURY PRESTIGE LEADERBOARD & ACHIEVEMENTS ARENA */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-2 sm:px-0">
        
        {/* Left Column: মেধা লীগ (Bronze Arena Leaderboard) */}
        <div className="relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-[32px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.06)] transition-all duration-300 overflow-hidden group">
          {/* Subtle Ambient Golden Background Aura */}
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          {/* Header Part */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  অনলাইন মেধা লীগ 
                  <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full select-none">
                    ব্রোঞ্জ টিয়ার
                  </span>
                </h3>
              </div>
              <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                পড়াশোনা ও পরীক্ষা দিয়ে আজকের লিডারবোর্ডের টপে থাকুন।
              </p>
            </div>
            
            <button 
              onClick={() => setActiveTab("leaderboard")}
              className="group/arr shrink-0 flex items-center gap-1 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-[10.5px] font-bold text-slate-700 dark:text-slate-350 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>সব দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/arr:translate-x-0.5" />
            </button>
          </div>

          {/* Leaderboard Table list */}
          <div className="mt-4 space-y-2.5">
            {[
              { rank: 1, name: "prachi barua", xp: 418, status: "active", iconStyle: "bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20" },
              { rank: 2, name: "Badol Minji", xp: 114, status: "away", iconStyle: "bg-linear-to-r from-slate-200 to-slate-400 dark:from-slate-400 dark:to-slate-500 text-slate-950 shadow-md shadow-slate-400/20" },
              { rank: 3, name: "Ruzana khan", xp: 73, status: "active", iconStyle: "bg-linear-to-r from-orange-400 to-orange-500 text-white shadow-md shadow-orange-500/20" },
              { rank: 4, name: "OC Gaming (512)", xp: 69, status: "active", iconStyle: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450" },
              { rank: 5, name: "Tasnia Hoque", xp: 49, status: "away", iconStyle: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450" },
              { rank: 6, name: "Puspita Devi", xp: 47, status: "active", iconStyle: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450" }
            ].map((user) => (
              <div 
                key={user.rank} 
                className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.005)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:scale-[1.01] transition-all duration-200 min-w-0"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Rank chip */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold font-display flex items-center justify-center shrink-0 text-xs sm:text-sm ${user.iconStyle}`}>
                    #{user.rank}
                  </div>
                  
                  {/* Profile avatar representation with light glows */}
                  <div className="relative shrink-0 select-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300/10">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Active state spot */}
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 ${user.status === "active" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  </div>
                  
                  {/* User Name */}
                  <span className="text-[11.5px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 truncate min-w-0 capitalize">
                    {user.name}
                  </span>
                </div>

                {/* Score XP */}
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  {user.rank <= 3 && (
                    <Zap className={`w-3.5 h-3.5 ${user.rank === 1 ? "text-amber-500 fill-amber-500 animate-pulse" : user.rank === 2 ? "text-slate-400 fill-slate-350" : "text-orange-400 fill-orange-405"}`} />
                  )}
                  <div className="bg-slate-50 dark:bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-slate-850">
                    <span className="font-mono text-[10.5px] font-extrabold text-slate-950 dark:text-white leading-none">
                      {user.xp}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 ml-0.5">
                      XP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: অর্জনসমূহ ও মেডেল (Achievements & Goals) */}
        <div className="relative bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200/40 dark:border-slate-800/60 rounded-[32px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.06)] transition-all duration-300 overflow-hidden group flex flex-col justify-between">
          {/* Subtle Ambient Violet Background Aura */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          <div>
            {/* Header Part */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-violet-500 dark:text-violet-400" />
                  অর্জন ও মেডেলসমূহ
                </h3>
                <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                  পরীক্ষার মাইলফলক ও বিশেষ কার্যাক্রমে আনলক করুন মেডেল।
                </p>
              </div>
              
              <button 
                onClick={() => setActiveTab("progress")}
                className="group/arr shrink-0 flex items-center gap-1 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-[10.5px] font-bold text-slate-700 dark:text-slate-350 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span>সব ব্যাজ</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/arr:translate-x-0.5" />
              </button>
            </div>

            {/* Target bullseye & Progress Section */}
            <div className="mt-6 flex flex-col items-center justify-center p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
              {/* Bullseye SVG custom premium art */}
              <div className="relative group/target flex items-center justify-center cursor-pointer mb-3">
                <div className="absolute w-16 h-16 rounded-full bg-violet-500/10 dark:bg-violet-500/20 animate-pulse" />
                <div className="absolute w-12 h-12 rounded-full bg-violet-500/15 dark:bg-violet-500/30 blur-xs transition-transform duration-500 group-hover/target:scale-120" />
                
                {/* Custom glowing target rendering */}
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Target className="w-5.5 h-5.5 text-white animate-bounce-slow" />
                </div>
              </div>

              <h4 className="text-[12.5px] font-extrabold text-slate-850 dark:text-white mb-1 text-center">
                চলমান কোনো অর্জন ধাপে নেই
              </h4>
              <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 text-center max-w-[280px]">
                আপনার প্রথম মেডেল <span className="text-violet-600 dark:text-violet-400 font-bold">নিয়মিত যোদ্ধা</span> আনলক হতে আর মাত্র কয়েক কুইজ বাকি।
              </p>

              {/* High precision shiny progress bar */}
              <div className="w-full max-w-[260px] mt-4 space-y-1">
                <div className="flex justify-between items-center text-[9.5px] font-extrabold select-none">
                  <span className="text-slate-400 dark:text-slate-500">চলতি অগ্রগতি</span>
                  <span className="text-violet-600 dark:text-violet-400">75%</span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.3)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Locked Badge Micro-grid below for motivation */}
          <div className="mt-5 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <h5 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
              মাইলফলক ব্যাজসমূহ
            </h5>
            
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { id: "star", name: "স্মার্ট স্টার", icon: <Star className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />, level: "৫০ XP" },
                { id: "zap", name: "স্ট্রিক মাস্টার", icon: <Zap className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />, level: "১০০ XP" },
                { id: "shield", name: "ব্যাটেল উইনার", icon: <Shield className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />, level: "১৫০ XP" },
                { id: "award", name: "মেধাবী মস্তিষ্ক", icon: <Award className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />, level: "২০০ XP" }
              ].map((badge) => (
                <div 
                  key={badge.id}
                  className="group relative flex flex-col items-center justify-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-850/40 hover:border-violet-100 dark:hover:border-violet-950 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center min-w-0"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-center justify-center mb-1.5">
                    {badge.icon}
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 truncate w-full">
                    {badge.name}
                  </span>
                  <span className="text-[7.5px] font-bold text-slate-400 dark:text-slate-500 tracking-tight leading-none mt-0.5">
                    {badge.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
