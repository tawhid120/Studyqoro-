/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sun, Moon, X, ShieldAlert } from "lucide-react";
import { StudentStats } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: StudentStats;
  onUpgrade: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// ----------------- HIGH-FIDELITY CUSTOM SVG ICONS -----------------

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

function SyllabusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="m9 6 6-1" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

function WarIcon({ className }: { className?: string }) {
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

function Cube3DIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// ----------------- TEACHER SUB-MODULE SVG ICONS -----------------

function TripleGearsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Large Gear Bottom Left */}
      <path d="M6 14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
      <path d="M6 11.5v1M6 21v1M3.5 16.5h1M7.5 16.5h1" strokeWidth="1.8" />
      
      {/* Medium Gear Top Left */}
      <path d="M11 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" strokeWidth="1.8" />
      <path d="M11 3.5v1M11 11.5v1M8.5 8h1M12.5 8h1" strokeWidth="1.8" />

      {/* Small Gear Right */}
      <path d="M17 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" strokeWidth="1.6" />
      <path d="M17 9.5v1M17 15.5v1M15 13h1M18 13h1" strokeWidth="1.6" />
    </svg>
  );
}

function QuestionPencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {/* Rounded question mark container */}
      <path d="M12 2a8 8 0 1 0 4.5 14.6" />
      {/* Question mark glyph */}
      <path d="M10 8.5a1.8 1.8 0 0 1 3.2 1.1c0 1.1-1 1.7-1.7 2.2" />
      <circle cx="11.5" cy="15" r="0.8" fill="currentColor" />
      {/* Pencil at bottom-right */}
      <path d="M14.5 20.5l6-6-2-2-6 6v2z" />
      <path d="M16.5 14.5l2 2" />
    </svg>
  );
}

function SheetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {/* Lightbulb glass outline */}
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      {/* Socket lines */}
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      {/* Light rays */}
      <line x1="12" y1="2" x2="12" y2="3" />
      <line x1="3" y1="8" x2="4" y2="8" />
      <line x1="20" y1="8" x2="21" y2="8" />
      <line x1="5.6" y1="13.1" x2="6.3" y2="12.4" />
      <line x1="17.7" y1="12.4" x2="18.4" y2="13.1" />
      <line x1="17.7" y1="3.6" x2="17" y2="4.3" />
      <line x1="6.3" y1="4.3" x2="5.6" y2="3.6" />
    </svg>
  );
}

function OnlineExamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Laptop Screen */}
      <rect x="3" y="4" width="18" height="12" rx="2" />
      {/* Laptop Stand / Base */}
      <path d="M2 20h20M7 16l-1 4M17 16l1 4" />
      {/* Profile Card Inside Screen */}
      <circle cx="8" cy="9" r="1.8" />
      <path d="M5.5 13a2.5 2.5 0 0 1 5 0" />
      {/* Details layout lines */}
      <line x1="14" y1="8" x2="18" y2="8" strokeWidth="1.6" />
      <line x1="14" y1="11" x2="17" y2="11" strokeWidth="1.6" />
    </svg>
  );
}

function OmrCheckerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Main OMR Calculator frame */}
      <rect x="4" y="2" width="14" height="20" rx="2" />
      {/* Top display screen */}
      <rect x="7" y="5" width="8" height="3" rx="0.5" strokeWidth="1.6" />
      {/* Bubble circle grid rows */}
      <circle cx="8" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11.5" r="1" fill="currentColor" stroke="none" />
      
      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="15" r="1" fill="currentColor" stroke="none" />
      
      {/* Check Badge on Bottom Right */}
      <circle cx="17" cy="18" r="4.5" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1.6" />
      {/* Small Checkmark */}
      <path d="m15.5 18 1 1 2-2.2" strokeWidth="1.6" />
    </svg>
  );
}

function SchoolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
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
  setDarkMode,
  isOpen,
  onClose
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
    { id: "battle", label: "Exam War", icon: WarIcon },
    { id: "materials", label: "স্টাডি ম্যাটেরিয়ালস", icon: BookOpenIcon },
    { id: "simulations", label: "থ্রিডি ও সিমুলেশন", icon: Cube3DIcon },
    { id: "syllabus", label: "সিলেবাস ট্র্যাকার", icon: SyllabusIcon },
    { id: "timer", label: "দ্রুত প্র্যাকটিস", icon: InfinityIcon },
    { id: "mocks", label: "মক পরীক্ষা", icon: EditPaperIcon },
    { id: "ai", label: "Study Qoro AI", icon: SparklesIcon },
    { id: "history", label: "হিস্ট্রি", icon: RibbonIcon },
    { id: "leaderboard", label: "লিডারবোর্ড", icon: PodiumIcon },
    { id: "progress", label: "প্রোগ্রেস", icon: ProgressGaugeIcon },
  ];

  if (stats.email === "lorddanju@gmail.com") {
    menuItems.push({ id: "admin", label: "Admin Panel", icon: ShieldAlert as any });
  }

  const teacherItem = { id: "teacher", label: "টিচার কর্নার", icon: SchoolIcon };

  return (
    <>
      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-45 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        id="app-sidebar" 
        className={`bg-white dark:bg-slate-900 border-r border-[#eaeaea] dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none transition-all duration-300 z-50 
          lg:flex 
          ${isOpen ? "fixed inset-y-0 left-0 flex shadow-2xl" : "hidden lg:flex"} 
          ${asideClass} ${asidePadding}`}
      >
        
        {/* Sleek circular floating toggle button sitting on the right edge/border, aligned vertically with Dashboard */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute top-[26px] -right-3.5 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full w-7 h-7 items-center justify-center text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
          title={isCollapsed ? "মেনু প্রসারিত করুন" : "মেনু সংকুচিত করুন"}
        >
          {isCollapsed ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>

        {/* Mobile close button inside mobile drawer */}
        {isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-450 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden cursor-pointer z-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            title="মেনু বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 2. Navigation items matching the photo perfectly */}
        <nav className="flex-grow space-y-0.5 overflow-y-auto scrollbar-none pt-14 lg:pt-5 pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
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
                
                {(!isCollapsed || isOpen) && (
                  <span className="tracking-wide">{item.label}</span>
                )}
              </button>
            );
          })}

          {(() => {
            const Icon = teacherItem.icon;
            const isActive = activeTab === "teacher" || activeTab.startsWith("teacher_");
            
            return (
              <button
                key={teacherItem.id}
                onClick={() => {
                  setActiveTab(teacherItem.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center rounded-xl text-left font-semibold transition-all duration-150 select-none group relative ${itemPadding} ${
                  isActive 
                    ? "bg-[#ecf6f3] dark:bg-emerald-950/20 text-[#059669] dark:text-emerald-400 font-bold shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title={teacherItem.label}
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
                
                {(!isCollapsed || isOpen) && (
                  <span className="tracking-wide">{teacherItem.label}</span>
                )}
              </button>
            );
          })()}
        </nav>

      </aside>
    </>
  );
}
