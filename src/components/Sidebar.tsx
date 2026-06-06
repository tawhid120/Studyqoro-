/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { StudentStats } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: StudentStats;
  onUpgrade: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

// ----------------- HIGH-FIDELITY CUSTOM SVG ICONS -----------------

function BrandLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none shrink-0 cursor-pointer">
      <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
        Q
      </div>
      {!isCollapsed && (
        <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100">
          Study <span className="text-emerald-600 dark:text-emerald-400">Qoro</span>
        </span>
      )}
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v8H4v-8M22 6H2v6h20V6z" />
      <path d="M10 16h4" />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
    </svg>
  );
}

function EditPaperIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
    </svg>
  );
}

function RibbonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function PodiumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M6 20v-6h4v6" />
      <path d="M10 20v-10h4v10" />
      <path d="M14 20v-4h4v4" />
      <path d="m12 3 .6 1.2 1.3.2-.9.9.2 1.3-1.2-.6-1.2.6.2-1.3-.9-.9 1.3-.2Z" fill="currentColor" />
    </svg>
  );
}

function ProgressGaugeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      <path d="m12 14 4-4" />
    </svg>
  );
}

function BattleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
      <path d="m13 19 6-6" />
      <path d="M9.5 17.5 21 6V3h-3L6.5 14.5" />
      <path d="m11 19-6-6" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

// ----------------- SIDEBAR EXPORT -----------------

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  onUpgrade, 
  onOpenAuth, 
  darkMode, 
  setDarkMode 
}: SidebarProps) {
  
  // Collapse controller for smooth desktop space reclaiming
  const [isCollapsed, setIsCollapsed] = useState(false);

  // States to monitor the window size and full screen status geometrically
  const [viewportHeight, setViewportHeight] = useState(800);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateMetrics = () => {
        setViewportHeight(window.innerHeight);
        setViewportWidth(window.innerWidth);

        // Check if maximized or full screen:
        // Window width/height covers most of the available screen workspace
        const isWidthNearlyMax = window.innerWidth >= (window.screen.availWidth - 80);
        const isHeightNearlyMax = window.innerHeight >= (window.screen.availHeight - 120);
        const isFull = document.fullscreenElement !== null;
        
        setIsMaximized((isWidthNearlyMax && isHeightNearlyMax) || isFull || window.innerWidth >= 1366);
      };

      updateMetrics();
      window.addEventListener("resize", updateMetrics);
      document.addEventListener("fullscreenchange", updateMetrics);

      return () => {
        window.removeEventListener("resize", updateMetrics);
        document.removeEventListener("fullscreenchange", updateMetrics);
      };
    }
  }, []);

  // Determine dense vs regular classes geometrically
  // If resolution/viewport is smaller vertically (< 768px) or we are on desktop full-screen/maximized,
  // we apply more compact margins, paddings, and typography so all items fit cleanly without any scrollbar.
  const isCompactViewport = viewportHeight < 768 || isMaximized;

  const asideClass = isCollapsed 
    ? "w-[68px]" 
    : (isCompactViewport ? "w-[210px]" : "w-[260px]");

  const asidePadding = isCollapsed
    ? "px-2"
    : (isCompactViewport ? "px-3" : "px-4");

  const headerMargin = isCompactViewport ? "mb-2 py-3" : "mb-6 py-5";
  
  const itemPadding = isCollapsed 
    ? "py-2.5 justify-center" 
    : (isCompactViewport ? "px-2.5 py-1.5 my-0.5 rounded-xl gap-2 text-[11px]" : "px-3.5 py-2.5 my-1 rounded-2xl gap-3.5 text-[13px]");

  const iconDimension = isCompactViewport ? "w-[16px] h-[16px]" : "w-[19px] h-[19px]";

  // Exact menu map matching screenshot from top to bottom
  const menuItems = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: HomeIcon },
    { id: "questions", label: "প্রশ্নব্যাংক", icon: ArchiveIcon },
    { id: "battle", label: "Battle Exam", icon: BattleIcon },
    { id: "timer", label: "দ্রুত প্র্যাকটিস", icon: InfinityIcon },
    { id: "mocks", label: "মক পরীক্ষা", icon: EditPaperIcon },
    { id: "ai", label: "Study Qoro AI", icon: SparklesIcon },
    { id: "history", label: "হিস্ট্রি", icon: RibbonIcon },
    { id: "leaderboard", label: "লিডারবোর্ড", icon: PodiumIcon },
    { id: "progress", label: "প্রোগ্রেস", icon: ProgressGaugeIcon },
  ];

  return (
    <aside 
      id="app-sidebar" 
      className={`bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none transition-all duration-300 ${asideClass} ${asidePadding}`}
    >
      
      {/* 1. Header Toolbar matches the screenshot exactly */}
      <div className={`flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 ${headerMargin} ${
        isCollapsed ? "flex-col gap-3 align-middle" : "flex-row"
      }`}>
        
        {/* Playful brand custom glyph letter logo with dynamic scaling */}
        <div className={`transition-all duration-200 ${isCompactViewport && !isCollapsed ? "scale-90 origin-left" : ""}`}>
          <BrandLogo isCollapsed={isCollapsed} />
        </div>

        {/* Sliding Dual Sun/Moon Slider pill perfectly styled */}
        {!isCollapsed && (
          <div 
            onClick={() => setDarkMode(!darkMode)}
            className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full items-center gap-0.5 cursor-pointer select-none border border-slate-200/40 dark:border-slate-700/50 hover:brightness-98 active:scale-95 transition-all text-[11px]"
            title="থিম পরিবর্তন করুন (Light/Dark Switcher)"
          >
            <div className={`p-1 rounded-full transition-all duration-200 ${!darkMode ? "bg-white text-amber-500 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}>
              <Sun className="w-3 h-3" />
            </div>
            <div className={`p-1 rounded-full transition-all duration-200 ${darkMode ? "bg-slate-700 text-yellow-400 shadow-sm" : "text-slate-400 dark:text-slate-500"}`}>
              <Moon className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Dynamic Column Split/Collapse Layout trigger */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
          title={isCollapsed ? "মেনু প্রসারিত করুন" : "মেনু সংকুচিত করুন"}
        >
          <svg 
            width="15" 
            height="15" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-slate-450 dark:text-slate-500"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
          </svg>
        </button>
      </div>

      {/* 2. Navigation items matching the photo perfectly */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-none py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-xl text-left font-semibold transition-all duration-150 select-none group relative ${itemPadding} ${
                isActive 
                  ? "bg-[#ecf6f3] dark:bg-emerald-950/20 text-[#059669] dark:text-emerald-400 font-bold shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title={item.label}
            >
              {/* Highlight bar for active items when collapsed */}
              {isActive && isCollapsed && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-md" />
              )}

              <Icon className={`shrink-0 transition-all ${iconDimension} ${
                isActive 
                  ? "text-[#059669] dark:text-emerald-400 drop-shadow-sm scale-[1.03]" 
                  : "text-slate-400 dark:text-slate-500 group-hover:scale-105 group-hover:text-slate-500 dark:group-hover:text-slate-450"
              }`} />
              
              {!isCollapsed && (
                <span className="tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Small Clean brand endorsement at footer */}
      {!isCollapsed && (
        <div className={`border-t border-slate-50 dark:border-slate-800/40 text-center text-[10px] text-slate-400 select-none ${isCompactViewport ? "py-2" : "py-4"}`}>
          <span className="font-bold text-emerald-600 dark:text-emerald-500/80">Study Qoro</span>
          <span className="opacity-70"> v1.2</span>
        </div>
      )}

    </aside>
  );
}
