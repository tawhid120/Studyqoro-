/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  ChevronRight, 
  BrainCircuit, 
  ShieldCheck,
  History, 
  Flame, 
  Award,
  Check, 
  X, 
  Lock,
  Download,
  Sun,
  Moon,
  Info
} from "lucide-react";

export interface StudentStats {
  [key: string]: any;
}

export interface LandingPageProps {
  onOpenAuth?: () => void;
  stats?: StudentStats;
  setStats?: React.Dispatch<React.SetStateAction<StudentStats>>;
  darkMode?: boolean;
  setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function App({ 
  onOpenAuth, 
  stats = {}, 
  setStats = () => {}, 
  darkMode = false, 
  setDarkMode = () => {} 
}: LandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [showModal, setShowModal] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof setDarkMode === 'function') setDarkMode(!isDarkMode);
  };

  const handleAuthClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setShowModal(true);
    }
  };

  // Programmatic custom SVG Flat Vector Illustration of a student-with-AI setup based on user's custom design
  const mainHeroVector = (
    <svg viewBox="0 0 500 330" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes student-focus-breath {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2.5px) scale(1.005); }
        }
        @keyframes plants-gentle-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes dynamic-typing-hands {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-1px) rotate(-0.5deg); }
        }
        .student-body-pulse {
          animation: student-focus-breath 4s ease-in-out infinite;
          transform-origin: 250px 280px;
        }
        .plant-leaf-sway-anim {
          animation: plants-gentle-sway 4s ease-in-out infinite;
          transform-origin: 90px 270px;
        }
        .hands-typing-anim {
          animation: dynamic-typing-hands 1.2s ease-in-out infinite;
          transform-origin: 250px 252px;
        }
      `}</style>

      {/* 1. SOFT LEVEL FLOOR SHADOW / UNDERLAY RUG */}
      <ellipse cx="250" cy="286" rx="200" ry="14" fill="#D3E2F4" opacity="0.6" className="dark:opacity-20" />
      <ellipse cx="250" cy="286" rx="150" ry="9" fill="#B9CEEA" opacity="0.4" className="dark:opacity-10" />

      {/* 2. BACKGROUND SOFT ROUND LIGHT BLUE STUDY GLOW */}
      <circle cx="250" cy="155" r="110" fill="url(#hero-orb-gradient)" opacity="0.65" className="dark:opacity-40" />

      {/* 3. CUTE LEFT FLOWER PLANT POT & 5 BEAUTIFUL LEAVES */}
      <g className="plant-leaf-sway-anim">
        <path d="M74 250 L106 250 L101 282 L79 282 Z" fill="#F4A261" stroke="#E76F51" strokeWidth="1" />
        <rect x="71" y="244" width="38" height="6" rx="1.5" fill="#E76F51" />
        <ellipse cx="90" cy="247" rx="16" ry="1.5" fill="#5F4335" />
        <path d="M82 244 C65 215, 60 185, 72 170 C80 185, 86 215, 88 244 Z" fill="#3AA07D" stroke="#257258" strokeWidth="0.5" />
        <path d="M86 244 C76 195, 76 140, 88 126 C95 140, 97 195, 92 244 Z" fill="#51B898" stroke="#368D72" strokeWidth="0.5" />
        <path d="M90 244 C90 185, 88 115, 97 105 C103 115, 103 185, 95 244 Z" fill="#338F70" stroke="#1F624C" strokeWidth="0.5" />
        <path d="M94 244 C104 195, 114 140, 102 126 C97 140, 95 195, 92 244 Z" fill="#51B898" stroke="#368D72" strokeWidth="0.5" />
        <path d="M98 244 C115 215, 120 185, 108 170 C100 185, 94 215, 92 244 Z" fill="#3AA07D" stroke="#257258" strokeWidth="0.5" />
      </g>

      {/* 4. HIGH-FIDELITY BOOKSTACK & 3 BRIGHT STANDING VERTICAL FILES */}
      <g>
        <path d="M340 270 L435 270 L432 280 L343 280 Z" fill="#324970" />
        <rect x="345" y="272" width="81" height="5" fill="#FFFFFF" />
        <path d="M346 259 L429 259 L426 270 L349 270 Z" fill="#DE584E" />
        <rect x="351" y="261" width="71" height="5" fill="#FFFFFF" stroke="#9A2620" strokeWidth="0.25" />
        <path d="M342 248 L432 248 L429 259 L345 259 Z" fill="#50B195" />
        <rect x="347" y="250" width="77" height="6" fill="#FFFFFF" stroke="#2F7B66" strokeWidth="0.25" />
        <path d="M348 237 L424 237 L421 248 L351 248 Z" fill="#884271" />
        <rect x="353" y="239" width="65" height="6" fill="#FFFFFF" stroke="#60294F" strokeWidth="0.25" />
        <path d="M344 227 L427 227 L424 238 L347 238 Z" fill="#F4C758" />
        <rect x="349" y="229" width="72" height="6" fill="#FFFFFF" fillOpacity="0.95" />
        <rect x="356" y="171" width="14" height="56" rx="2" fill="#DE584E" />
        <rect x="360" y="177" width="6" height="15" fill="#FFF3F2" rx="1" opacity="0.9" />
        <circle cx="363" cy="214" r="2.5" fill="#FFFFFF" />
        <rect x="372" y="171" width="14" height="56" rx="2" fill="#F4C758" />
        <rect x="376" y="177" width="6" height="15" fill="#FFFDF5" rx="1" opacity="0.9" />
        <circle cx="379" cy="214" r="2.5" fill="#FFFFFF" />
        <rect x="388" y="171" width="14" height="56" rx="2" fill="#3D64A2" />
        <rect x="392" y="177" width="6" height="15" fill="#F2F6FC" rx="1" opacity="0.9" />
        <circle cx="395" cy="214" r="2.5" fill="#FFFFFF" />
      </g>

      {/* 5. COGNITIVE ANIMATED STUDENT CARINGLY STUDYING */}
      <g className="student-body-pulse">
        <path d="M150 252 C130 256, 126 284, 212 284 C238 284, 245 278, 250 278" stroke="#164A6A" strokeWidth="2.5" fill="#2C5B7E" strokeLinecap="round" />
        <path d="M350 252 C370 256, 374 284, 288 284 C262 284, 255 278, 250 278" stroke="#164A6A" strokeWidth="2.5" fill="#214A69" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M172 280 C167 276, 194 270, 197 282 C198 285, 176 286, 172 280 Z" fill="#DE584E" stroke="#9E2A2B" strokeWidth="1" />
        <path d="M328 280 C333 276, 306 270, 303 282 C302 285, 324 286, 328 280 Z" fill="#DE584E" stroke="#9E2A2B" strokeWidth="1" />
        <path d="M185 255 L175 190 Q185 168 250 168 Q315 168 325 190 L315 255 Z" fill="#FFDE59" />
        <path d="M250 168 Q315 168 325 190 L315 255 L250 255 Z" fill="#E2BD39" opacity="0.38" />
        <path d="M235 168 Q250 180 265 168" fill="none" stroke="#ECA921" strokeWidth="2" strokeLinecap="round" />
        <rect x="241" y="146" width="18" height="26" rx="4" fill="#FCAC8C" />
        <path d="M241 161 L259 161 L250 170 Z" fill="#E58F6C" />
        <path d="M216 112 C216 82, 284 82, 284 112 C284 135, 272 144, 250 144 C228 144, 216 135, 216 112 Z" fill="#FCAC8C" />
        <circle cx="212" cy="112" r="7.5" fill="#FCAC8C" />
        <circle cx="288" cy="112" r="7.5" fill="#FCAC8C" />
        <circle cx="213" cy="112" r="3.5" fill="#E58F6C" opacity="0.75" />
        <circle cx="287" cy="112" r="3.5" fill="#E58F6C" opacity="0.75" />
        <path d="M210 110 C206 95, 210 70, 240 60 C265 52, 290 65, 290 100 C290 115, 280 120, 280 120 V105 C280 85, 220 85, 220 105 V120 C220 120, 210 115, 210 110 Z" fill="#1C263A" />
        <path d="M210 100 C205 82, 214 62, 238 52 C265 42, 296 55, 294 88 C294 92, 285 98, 276 98 C266 102, 258 92, 248 92 C236 92, 224 100, 212 98 Z" fill="#203254" />
        <path d="M220 74 C225 66, 240 66, 244 76" stroke="#2D436D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M256 74 C260 66, 272 66, 276 76" stroke="#2D436D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M215 106 L217 114" stroke="#203254" strokeWidth="3" strokeLinecap="round" />
        <path d="M285 106 L283 114" stroke="#203254" strokeWidth="3" strokeLinecap="round" />
        <path d="M228 102 C232 98, 240 98, 244 102" stroke="#1C2134" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M256 102 C260 98, 268 98, 272 102" stroke="#1C2134" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="236" cy="111" rx="2" ry="4.5" fill="#1C2134" />
        <ellipse cx="264" cy="111" rx="2" ry="4.5" fill="#1C2134" />
        <circle cx="235" cy="109" r="0.7" fill="#FFFFFF" />
        <circle cx="263" cy="109" r="0.7" fill="#FFFFFF" />
        <ellipse cx="222" cy="119" rx="4" ry="2" fill="#F48B7A" opacity="0.6" />
        <ellipse cx="278" cy="119" rx="4" ry="2" fill="#F48B7A" opacity="0.6" />
        <path d="M250 112 C252 112, 251 117, 248 117" stroke="#E58F6C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M241 123 C241 133, 259 133, 259 123 Z" fill="#FFFFFF" stroke="#DF4843" strokeWidth="1.8" strokeLinejoin="round" />

        <g>
          <path d="M195 250 L188 200 Q250 195 312 200 L305 250 Z" fill="#3D538C" stroke="#2B3C68" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="250" cy="225" r="4" fill="#889CC9" opacity="0.8" />
          <path d="M185 250 Q250 254 315 250 L325 256 Q250 260 175 256 Z" fill="#A1AFCE" />
        </g>

        <path d="M160 212 C145 235, 165 252, 205 252" stroke="#FCAC8C" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M340 212 C355 235, 335 252, 295 252" stroke="#FCAC8C" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M175 190 L145 210 Q155 225 170 215 L180 210 Z" fill="#FFDE59" />
        <path d="M325 190 L355 210 Q345 225 330 215 L320 210 Z" fill="#FFDE59" />
        <path d="M325 190 L355 210 Q345 225 330 215 L320 210 Z" fill="#E2BD39" opacity="0.38" />

        <g className="hands-typing-anim">
          <circle cx="212" cy="252" r="7.5" fill="#FCAC8C" />
          <path d="M205 252 H217" stroke="#E58F6C" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="288" cy="252" r="7.5" fill="#FCAC8C" />
          <path d="M283 252 H295" stroke="#E58F6C" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>

      <defs>
        <radialGradient id="hero-orb-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );

  // Features list card renderer item
  const renderInteractiveFeatureCard = (title: string, desc: string, icon: React.ReactNode, delay: number, badgeText?: string) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay * 0.5 }} // Faster stagger on mobile
      className="bg-white dark:bg-slate-900/80 p-5 sm:p-6 lg:p-7 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all group relative overflow-hidden active:scale-[0.98] cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
          {icon}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {title}
            </h4>
            {badgeText && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div id="landing-page-root" className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${isDarkMode ? "dark bg-[#0B1120] text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      
      {/* Custom Auth Modal replacing alert() */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 relative z-10">লগইন বা সাইন আপ</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10">
                এই ফিচারটি ব্যবহার করতে আপনাকে পোর্টালে যুক্ত হতে হবে। অনুগ্রহ করে আপনার অ্যাকাউন্ট তৈরি করুন।
              </p>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all relative z-10"
              >
                ঠিক আছে, বুঝতে পেরেছি
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Top Header - Optimized for all screens */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-3 sm:py-4 transition-colors">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 shrink-0">
              <span className="text-lg sm:text-xl font-black font-sans">Q</span>
            </div>
            <div className="text-left leading-tight">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans flex items-center gap-1">
                Study Qoro <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-bold">AI</span>
              </h1>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">অ্যাকাডেমিক পোর্টাল</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode toggle */}
            <button 
              onClick={handleThemeToggle}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="থিম পরিবর্তন"
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={handleAuthClick}
              className="hidden sm:block py-2 px-4 bg-transparent text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              লগইন
            </button>
            <button
              onClick={handleAuthClick}
              className="py-2.5 px-4 sm:py-2.5 sm:px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              সাইন আপ
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Optimized max-width for tablet (1280px) and proper spacing */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 lg:space-y-32 py-8 sm:py-12 lg:py-16">

        {/* 1. HERO BANNER - Perfect for Mobile & Tablet Landscape */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-1/4 w-[250px] sm:w-[400px] lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[500px] bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
          
          {/* Text Content - Shows first on mobile */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left order-1 relative z-10">
            {/* Launch Banner Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-bold leading-none mx-auto lg:mx-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
              <span>এইচএসসি, এসএসসি ও এডমিশন প্রস্তুতির প্রথম AI পোর্টাল</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4rem] font-black text-slate-900 dark:text-white leading-[1.2] sm:leading-[1.15] tracking-tight font-sans">
              পড়াশোনা করো <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                নিজের গতিতে, AI সহায়তায়!
              </span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium px-2 sm:px-0">
              হাজার হাজার রিয়েল বোর্ড প্রশ্ন ব্যাংক, অধ্যায়ভিত্তিক কাস্টম মক টেস্ট, স্পিড ডাবলিং টাইমার, এবং তাত্ক্ষণিক AI ডাউট সলভ নিয়ে প্রস্তুত হও যেকোনো প্রতিযোগিতামূলক পরীক্ষার জন্য।
            </p>

            {/* Quick Metrics stats strip - Mobile friendly grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-[320px] sm:max-w-md mx-auto lg:mx-0">
              <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">১০ লক্ষ+</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">প্রশ্ন ব্যাংক</div>
              </div>
              <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">১ সেকে.</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">AI উত্তর</div>
              </div>
              <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">৯৯.৭%</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">নির্ভুলতা</div>
              </div>
            </div>

            {/* CTA action buttons - Full width on mobile for easy tapping */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleAuthClick}
                className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>প্র্যাকটিস শুরু করো</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <a
                href="https://play.google.com/store/apps/details?id=com.chorcha.ai"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm sm:text-base rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                <span>অ্যাপ ডাউনলোড করুন</span>
              </a>
            </div>

            {/* Tiny informational trust strip */}
            <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-2">
              <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                🕌 হালাল ও অ্যাড-ফ্রি
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">
                📚 HSC ও এডমিশন কারিকুলাম
              </span>
            </div>
          </div>

          {/* Right Side: Vector graphic - Now ALWAYS visible and fully responsive */}
          <div className="flex lg:col-span-5 justify-center items-center order-2 mt-4 lg:mt-0 relative z-10 w-full">
            <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-full relative bg-gradient-to-b from-emerald-50/50 to-cyan-50/50 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border border-white/50 dark:border-slate-800/50 shadow-2xl dark:shadow-none">
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl rounded-[2.5rem] -z-10" />
              {mainHeroVector}
            </div>
          </div>
        </section>


        {/* 2. CHORCHA FEATURE CARDS GRID */}
        <section className="space-y-10 sm:space-y-14 relative z-10">
          <div className="text-center space-y-3 sm:space-y-4 px-4">
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
                প্রিমিয়াম ফিচারসমূহ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              আমাদের পোর্টালের <br className="sm:hidden" /> আধুনিক ইন্টারফেস
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              বোর্ড প্রশ্নের ডাটাবেজ থেক শুরু করে প্রতিযোগিতামূলক কুইজ এবং AI ডাউট সলভার সমাধান, সবই থাকছে হাতের নাগালে।
            </p>
          </div>

          {/* Grid setup for mobile (1 col), tablet (2 cols), desktop (3 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {renderInteractiveFeatureCard(
              "১ ক্লিকে কাস্টম মক টেস্ট",
              "নিজের সুবিধামত বিষয়, অধ্যায়, সময় ও নেগেটিভ মার্কিং নির্বাচন করে ১ ক্লিকেই যেকোনো সিলেবাসে মক এক্সাম জেনারেট করো।",
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />,
              0.1,
              "Premium"
            )}
            {renderInteractiveFeatureCard(
              "Study Qoro AI সলভার",
              "যেকোনো প্রশ্ন অথবা পড়ার টেবিলে আটকে যাওয়া বিষয়ের ছবি আপলোড করলেই সোর্স বুক সহ নির্ভুল ব্যাখ্যা বুঝে নাও।",
              <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8" />,
              0.2,
              "AI Powered"
            )}
            {renderInteractiveFeatureCard(
              "দলগত কুইজ ব্যাটল",
              "রিয়েল-টাইম মাল্টিপ্লেয়ার ব্যাটল রুমে বন্ধুদের সাথে লাইভ বোর্ড এক্সাম প্রতিযোগিতায় মেতে ওঠো এবং XP অর্জন করো।",
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />,
              0.3,
              "Live Multi"
            )}
            {renderInteractiveFeatureCard(
              "দেশসেরা লিডারবোর্ড",
              "সারা দেশের হাজারো মেধাবী পরীক্ষার্থীদের সাথে রিয়েল-টাইম পয়েন্ট তালিকায় নিজের পজিশন যাচাই করো ও প্রোগ্রেস বাড়াও।",
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
              0.4
            )}
            {renderInteractiveFeatureCard(
              "নামাজী ওয়াচগার্ড",
              "পড়াশোনায় বরকত বাড়াতে নামাজ ও ইসলামিক নিয়মতান্ত্রিক রুটিন ট্র্যাকার, যা তোমাকে দ্বীনের আলোয় রাখবে।",
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />,
              0.5,
              "Islamic Base"
            )}
            {renderInteractiveFeatureCard(
              "Mistake Vault অ্যানালাইটিক্স",
              "যেকোনো টেস্টে করা ভুল উত্তরগুলো স্বয়ংক্রিয়ভাবে মিস্টেক ভল্টে জমা হবে, যাতে পরবর্তীতে রিভিশন দেওয়া যায়।",
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
              0.6,
              "New"
            )}
          </div>
        </section>


        {/* 3. COMPETITOR COMPARISON TABLE */}
        <section className="p-1 sm:p-2 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-900/10 rounded-[2rem] sm:rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-emerald-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
          
          <div className="p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12 relative z-10">
            <div className="text-center space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block bg-white dark:bg-slate-800 py-1.5 px-4 rounded-full w-fit mx-auto shadow-sm border border-slate-100 dark:border-slate-700">
                COMPETITOR ANALYSIS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                অন্যান্য প্ল্যাটফর্ম <span className="text-slate-400 font-medium px-2">বনাম</span> Study Qoro
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium">
                আমরা বিশ্বাস করি পড়াশোনার মান ও গভীরতা সুন্দর এস্টেটিক্স ডিজাইনের মাধ্যমেই বাড়ে। নিচে পার্থক্যটি দেখে নাও:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              
              {/* Ordinary Competitors */}
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 sm:space-y-8 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">⚠️</div>
                  <h3 className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">সাধারণ প্ল্যাটফর্ম ও অ্যাপ</h3>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-red-50 dark:bg-red-900/20 shrink-0">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                    <span>অতিরিক্ত ও বিভ্রান্তিকর বিরক্তিদায়ক অ্যাডভার্টাইজমেন্টস এবং পপ-আপস।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-red-50 dark:bg-red-900/20 shrink-0">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                    <span>ধীরগতির ব্যাকএন্ড লোডিং টাইম (৩-১০ সেকেন্ড পর্যন্ত অপেক্ষা)।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-red-50 dark:bg-red-900/20 shrink-0">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                    <span>শুধু একঘেয়ে এমসিকিউ, কোনো লাইভ এনালাইসিস বা ব্যাটলরুম নেই।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-red-50 dark:bg-red-900/20 shrink-0">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                    <span>গড়পড়তা Mock সমাধান, কোনো নির্ভরযোগ্য AI Doubt Solver নেই।</span>
                  </div>
                </div>
              </div>

              {/* Study Qoro highlights */}
              <div className="bg-emerald-50 dark:bg-emerald-900/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 space-y-6 sm:space-y-8 shadow-xl shadow-emerald-500/5 relative overflow-hidden transform md:-translate-y-2 transition-transform">
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-black uppercase rounded-bl-2xl shadow-sm">
                  BEST CHOICE
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-xl">🚀</div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">Study Qoro পোর্টাল</h3>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span><strong>১০০% অ্যাড-ফ্রি পরিবেশ:</strong> পড়াশোনায় সম্পূর্ণ মনোযোগ।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span><strong>আল্ট্রা-ফাস্ট রেসপন্স টাইম:</strong> মিলি-সেকেন্ডে কাস্টম পরীক্ষা ও লাইভ উত্তর।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span><strong>গ্যামিফাইড ব্যাটল:</strong> বন্ধুদের সাথে লাইভ লড়াই ও জাতীয় লিডারবোর্ড।</span>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span><strong>স্মার্ট Gemini AI সলভার:</strong> ম্যাথ সমীকরণের নিখুঁত KaTeX রেন্ডারিং সমর্থন করে।</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 4. PREMIUM PRICING TABLE */}
        <section className="space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="text-center space-y-3 sm:space-y-4 px-4">
            <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block bg-emerald-50 dark:bg-emerald-900/20 py-1.5 px-4 rounded-full w-fit mx-auto">
              PRICING PLANS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              সাশ্রয়ী সাবস্ক্রিপশন প্যাকেজ
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium leading-relaxed">
              সাশ্রয়ী মূল্যে আমাদের অল-ইন-ওয়ান AI পোর্টালের মেম্বারশিপ নিয়ে আনলক করো সম্পূর্ণ শক্তি।
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="inline-flex bg-slate-200/50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-inner">
              <button 
                onClick={() => setSelectedPlan("monthly")}
                className={`py-2 px-6 sm:py-2.5 sm:px-8 text-xs sm:text-sm font-bold rounded-xl transition-all uppercase cursor-pointer ${selectedPlan === "monthly" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                মাসিক
              </button>
              <button 
                onClick={() => setSelectedPlan("yearly")}
                className={`py-2 px-6 sm:py-2.5 sm:px-8 text-xs sm:text-sm font-bold rounded-xl transition-all uppercase cursor-pointer flex items-center gap-2 ${selectedPlan === "yearly" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <span>বার্ষিক</span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase">Save 35%</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-[1100px] mx-auto px-4 sm:px-0">
            
            {/* Plan 1: S-BASIC */}
            <div className="bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest">S-BASIC</h4>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">ফ্রি ওয়ান-ট্যাপ ট্রায়াল</p>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                  ৳০ <span className="text-sm font-medium text-slate-400 mb-1">/ ১৫ দিন</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-6 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>৫টি কাস্টম মক টেস্ট জেনারেটর</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                    <div className="p-1 rounded-full bg-slate-50 dark:bg-slate-800"><Lock className="w-4 h-4" /></div>
                    <span className="line-through">আনলিমিটেড AI Doubt Solver</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>লিডারবোর্ড ও প্রোগ্রেস ট্র্যাকার</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                    <div className="p-1 rounded-full bg-slate-50 dark:bg-slate-800"><Lock className="w-4 h-4" /></div>
                    <span className="line-through">মাল্টিপ্লেয়ার ব্যাটলরুম এক্সেস</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleAuthClick}
                className="w-full min-h-[48px] mt-8 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                গেট স্টার্টেড
              </button>
            </div>

            {/* Plan 2: S-PLUS (Popular) */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border-2 border-emerald-500 dark:border-emerald-400 flex flex-col justify-between shadow-2xl shadow-emerald-500/10 relative overflow-hidden transform lg:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
              <div className="absolute top-0 right-6 bg-emerald-500 text-slate-950 font-black uppercase text-[10px] sm:text-xs py-1.5 px-4 rounded-b-xl tracking-wider shadow-sm">
                POPULAR CHOICE
              </div>
              
              <div className="space-y-6 pt-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">S-PLUS</h4>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">প্রিমিয়াম এডমিশন</p>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                  {selectedPlan === "monthly" ? "৳১৪৯" : "৳৩৯৯"} <span className="text-sm font-medium text-slate-400 mb-1">/ {selectedPlan === "monthly" ? "মাস" : "সেশন"}</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-6 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                    <span className="font-bold">আনলিমিটেড কাস্টম মক টেস্ট</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                    <span>১০০টি AI ডাউট কুয়েরি / মাস</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                    <span>মাল্টিপ্লেয়ার ব্যাটলরুম আনলকড</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                    <span>Mistake Vault ও এনালাইটিক্স</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                    <span>নামাজী রুটিন ট্র্যাকার ওয়াচগার্ড</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleAuthClick}
                className="w-full min-h-[52px] mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl hover:brightness-105 active:scale-95 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>প্যাকেজটি এনরোল করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plan 3: S-PRO */}
            <div className="bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest">S-PRO</h4>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">গোল্ড মেম্বার</p>
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                  {selectedPlan === "monthly" ? "৳২৪৯" : "৳৫৯৯"} <span className="text-sm font-medium text-slate-400 mb-1">/ ওয়ান-টাইম</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-6 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">সবকিছু আনলিমিটেড (Unlimited Access)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>সীমাহীন মক টেস্ট ও সমাধান</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>সীমাহীন স্মার্ট AI ডাউট সলভার</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>লাইভ ২৪/৭ সাপোর্ট ও স্পেশাল গাইডলাইন</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30"><Check className="w-4 h-4 text-emerald-500" /></div>
                    <span>মোবাইল ও উইন্ডোজ অ্যাপ লাইসেন্স</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleAuthClick}
                className="w-full min-h-[48px] mt-8 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              >
                যোগাযোগ করুন
              </button>
            </div>

          </div>
        </section>


        {/* 6. CALL TO ACTION BOTTOM SLATE CONTAINER */}
        <section className="px-4 sm:px-0">
          <div className="p-8 sm:p-12 lg:p-16 bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-slate-950 rounded-[2.5rem] sm:rounded-[3rem] relative overflow-hidden text-center space-y-6 sm:space-y-8 shadow-2xl shadow-emerald-500/20 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
                আজই শুরু হোক তোমার অগ্রযাত্রার সুন্দর প্রস্তুতি!
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed">
                দেরি না করে এখনই রেজিস্ট্রেশন করে আনলক করো ফ্রি কাস্টম টেস্ট সমাধান, নামাজ ট্র্যাকার ও দলগত ব্যাটলরুম ক্যুইজ সেশন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center relative z-10 pt-2">
              <button
                onClick={handleAuthClick}
                className="w-full sm:w-auto min-h-[56px] px-8 sm:px-10 bg-slate-950 text-white hover:text-emerald-400 font-black text-base rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ফ্রি অ্যাকাউন্ট তৈরি করুন</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleAuthClick}
                className="w-full sm:w-auto min-h-[56px] px-8 sm:px-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 font-bold text-base rounded-2xl active:scale-95 transition-all cursor-pointer"
              >
                মেন্টরদের সাথে আলোচনা
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Competitor-beating High-Fidelity Professional Brand Footer */}
      <Footer darkMode={isDarkMode} />

    </div>
  );
}