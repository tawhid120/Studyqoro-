/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  ChevronRight, 
  BrainCircuit, 
  BadgeCheck, 
  Bookmark, 
  Compass, 
  HelpCircle, 
  History, 
  MessageSquareCode, 
  Flame, 
  Zap, 
  Users, 
  Star, 
  Check, 
  X, 
  Lock,
  Download,
  AlertCircle,
  ShieldCheck,
  Award
} from "lucide-react";
import { StudentStats } from "../types";

interface LandingPageProps {
  onOpenAuth: () => void;
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingPage({ onOpenAuth, stats, setStats, darkMode, setDarkMode }: LandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Programmatic custom SVG Flat Vector Illustration of a student-with-AI setup based on user's custom design
  const mainHeroVector = (
    <svg viewBox="0 0 500 330" className="w-full h-auto drop-shadow-xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Embedded CSS style overrides to support fine-grained modular animations */}
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
          transform-origin: 250px 242px;
        }
      `}</style>

      {/* 1. SOFT LEVEL FLOOR SHADOW / UNDERLAY RUG */}
      <ellipse cx="250" cy="286" rx="200" ry="14" fill="#D3E2F4" opacity="0.6" />
      <ellipse cx="250" cy="286" rx="150" ry="9" fill="#B9CEEA" opacity="0.4" />

      {/* 2. BACKGROUND SOFT ROUND LIGHT BLUE STUDY GLOW */}
      <circle cx="250" cy="155" r="110" fill="url(#hero-orb-gradient)" opacity="0.65" />

      {/* 3. CUTE LEFT FLOWER PLANT POT & 5 BEAUTIFUL LEAVES */}
      <g className="plant-leaf-sway-anim">
        {/* Yellow-Orange Terracotta Flower Pot */}
        <path d="M74 250 L106 250 L101 282 L79 282 Z" fill="#F4A261" stroke="#E76F51" strokeWidth="1" />
        <rect x="71" y="244" width="38" height="6" rx="1.5" fill="#E76F51" />
        {/* Soil Base */}
        <ellipse cx="90" cy="247" rx="16" ry="1.5" fill="#5F4335" />

        {/* 5 Beautiful Fan-Shaped Mint Leaves with detailed center support veins */}
        {/* Outer Left Leaf */}
        <path d="M82 244 C65 215, 60 185, 72 170 C80 185, 86 215, 88 244 Z" fill="#3AA07D" stroke="#257258" strokeWidth="0.5" />
        {/* Middle-Left Leaf */}
        <path d="M86 244 C76 195, 76 140, 88 126 C95 140, 97 195, 92 244 Z" fill="#51B898" stroke="#368D72" strokeWidth="0.5" />
        {/* Center Vertical Tall Leaf */}
        <path d="M90 244 C90 185, 88 115, 97 105 C103 115, 103 185, 95 244 Z" fill="#338F70" stroke="#1F624C" strokeWidth="0.5" />
        {/* Middle-Right Leaf */}
        <path d="M94 244 C104 195, 114 140, 102 126 C97 140, 95 195, 92 244 Z" fill="#51B898" stroke="#368D72" strokeWidth="0.5" />
        {/* Outer Right Leaf */}
        <path d="M98 244 C115 215, 120 185, 108 170 C100 185, 94 215, 92 244 Z" fill="#3AA07D" stroke="#257258" strokeWidth="0.5" />
      </g>

      {/* 4. HIGH-FIDELITY BOOKSTACK & 3 BRIGHT STANDING VERTICAL FILES */}
      <g>
        {/* Flat Stack of 5 Premium Color-Coded Textbooks */}
        {/* Book 1 (Bottom Thick Navy Book) */}
        <path d="M340 270 L435 270 L432 280 L343 280 Z" fill="#324970" />
        <rect x="345" y="272" width="81" height="5" fill="#FFFFFF" />
        
        {/* Book 2 (Red Textbook) */}
        <path d="M346 259 L429 259 L426 270 L349 270 Z" fill="#DE584E" />
        <rect x="351" y="261" width="71" height="5" fill="#FFFFFF" stroke="#9A2620" strokeWidth="0.25" />
        
        {/* Book 3 (Brilliant Mint Green Textbook) */}
        <path d="M342 248 L432 248 L429 259 L345 259 Z" fill="#50B195" />
        <rect x="347" y="250" width="77" height="6" fill="#FFFFFF" stroke="#2F7B66" strokeWidth="0.25" />
        
        {/* Book 4 (Plum Purple Book with Yellow Accent Spine) */}
        <path d="M348 237 L424 237 L421 248 L351 248 Z" fill="#884271" />
        <rect x="353" y="239" width="65" height="6" fill="#FFFFFF" stroke="#60294F" strokeWidth="0.25" />
        
        {/* Book 5 (Top Vibrant Yellow Book) */}
        <path d="M344 227 L427 227 L424 238 L347 238 Z" fill="#F4C758" />
        <rect x="349" y="229" width="72" height="6" fill="#FFFFFF" fillOpacity="0.95" />

        {/* 3 Standing Vertical Binders/Folders resting perfectly on Book 5 */}
        {/* Red Binder (Left) */}
        <rect x="356" y="171" width="14" height="56" rx="2" fill="#DE584E" />
        <rect x="360" y="177" width="6" height="15" fill="#FFF3F2" rx="1" opacity="0.9" />
        <circle cx="363" cy="214" r="2.5" fill="#FFFFFF" />

        {/* Golden-Yellow Binder (Middle) */}
        <rect x="372" y="171" width="14" height="56" rx="2" fill="#F4C758" />
        <rect x="376" y="177" width="6" height="15" fill="#FFFDF5" rx="1" opacity="0.9" />
        <circle cx="379" cy="214" r="2.5" fill="#FFFFFF" />

        {/* Royal Blue Binder (Right) */}
        <rect x="388" y="171" width="14" height="56" rx="2" fill="#3D64A2" />
        <rect x="392" y="177" width="6" height="15" fill="#F2F6FC" rx="1" opacity="0.9" />
        <circle cx="395" cy="214" r="2.5" fill="#FFFFFF" />
      </g>

      {/* 5. COGNITIVE ANIMATED STUDENT CARINGLY STUDYING (Sways together with the lap-mounted laptop) */}
      <g className="student-body-pulse">
        {/* Cross-Legged Jeans/Trousers (Lotus Pose, Blue Denim accents) */}
        <path d="M150 252 C130 256, 126 284, 212 284 C238 284, 245 278, 250 278" stroke="#164A6A" strokeWidth="2.5" fill="#2C5B7E" strokeLinecap="round" />
        <path d="M350 252 C370 256, 374 284, 288 284 C262 284, 255 278, 250 278" stroke="#164A6A" strokeWidth="2.5" fill="#214A69" strokeLinecap="round" strokeLinejoin="round" />

        {/* Red Slippers/Shoes Peeking at left and right cross-fold */}
        {/* Left foot/slipper */}
        <path d="M172 280 C167 276, 194 270, 197 282 C198 285, 176 286, 172 280 Z" fill="#DE584E" stroke="#9E2A2B" strokeWidth="1" />
        {/* Right foot/slipper */}
        <path d="M328 280 C333 276, 306 270, 303 282 C302 285, 324 286, 328 280 Z" fill="#DE584E" stroke="#9E2A2B" strokeWidth="1" />

        {/* Torso in Comfortable Wide Yellow T-Shirt */}
        <path d="M192 254 C192 176, 308 176, 308 254 Z" fill="#FFDE59" />
        {/* High-Fidelity T-Shirt Shade for stunning flat design look */}
        <path d="M250 176 C278 176, 308 206, 308 254 L250 254 Z" fill="#E2BD39" opacity="0.38" />

        {/* Beautiful Peach-warm Skin Neck Column */}
        <rect x="241" y="146" width="18" height="24" rx="4" fill="#FCAC8C" />
        {/* Collar Neck Shadow */}
        <path d="M241 161 L259 161 L250 170 Z" fill="#E58F6C" />

        {/* Friendly Round Chin Face Skin Canvas */}
        <path d="M216 112 C216 82, 284 82, 284 112 C284 135, 272 144, 250 144 C228 144, 216 135, 216 112 Z" fill="#FCAC8C" />

        {/* Highly Detailed Ears with Inside Folds */}
        <circle cx="212" cy="112" r="7.5" fill="#FCAC8C" />
        <circle cx="288" cy="112" r="7.5" fill="#FCAC8C" />
        <circle cx="213" cy="112" r="3.5" fill="#E58F6C" opacity="0.75" />
        <circle cx="287" cy="112" r="3.5" fill="#E58F6C" opacity="0.75" />

        {/* Layered Illustrated Blue/Navy Hair with structured spikes matching the requested image */}
        {/* Back Hair Underlay */}
        <path d="M210 110 C206 95, 210 70, 240 60 C265 52, 290 65, 290 100 C290 115, 280 120, 280 120 V105 C280 85, 220 85, 220 105 V120 C220 120, 210 115, 210 110 Z" fill="#1C263A" />
        {/* Main Side-Swept Hair Volume */}
        <path d="M210 100 C205 82, 214 62, 238 52 C265 42, 296 55, 294 88 C294 92, 285 98, 276 98 C266 102, 258 92, 248 92 C236 92, 224 100, 212 98 Z" fill="#203254" />
        {/* Gorgeous individual stroke sweeps on forehead */}
        <path d="M220 74 C225 66, 240 66, 244 76" stroke="#2D436D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M256 74 C260 66, 272 66, 276 76" stroke="#2D436D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Sideburn Lock Triggers */}
        <path d="M215 106 L217 114" stroke="#203254" strokeWidth="3" strokeLinecap="round" />
        <path d="M285 106 L283 114" stroke="#203254" strokeWidth="3" strokeLinecap="round" />

        {/* High-Fidelity Facial Features */}
        {/* Happy Smiling Arch Eyebrows */}
        <path d="M228 102 C232 98, 240 98, 244 102" stroke="#1C2134" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M256 102 C260 98, 268 98, 272 102" stroke="#1C2134" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Shiny Focused Cartoon Eyes */}
        <ellipse cx="236" cy="111" rx="2" ry="4.5" fill="#1C2134" />
        <ellipse cx="264" cy="111" rx="2" ry="4.5" fill="#1C2134" />
        <circle cx="235" cy="109" r="0.7" fill="#FFFFFF" />
        <circle cx="263" cy="109" r="0.7" fill="#FFFFFF" />
        {/* Cozy Rose Red Cheeks Glow */}
        <ellipse cx="222" cy="119" rx="4" ry="2" fill="#F48B7A" opacity="0.6" />
        <ellipse cx="278" cy="119" rx="4" ry="2" fill="#F48B7A" opacity="0.6" />
        {/* Cute Minimalist Button Nose */}
        <path d="M250 112 C252 112, 251 117, 248 117" stroke="#E58F6C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Bright Joyous Heart-Melting Teeth Smile */}
        <path d="M241 123 C241 133, 259 133, 259 123 Z" fill="#FFFFFF" stroke="#DF4843" strokeWidth="1.8" strokeLinejoin="round" />

        {/* Arms and Yellow Sleeves reaching towards the laptop */}
        {/* Left Sleeve & Arm */}
        <path d="M205 180 C182 188, 172 208, 185 218 Z" fill="#FFDE59" />
        <path d="M182 204 C170 216, 172 238, 210 240" stroke="#FCAC8C" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        
        {/* Right Sleeve & Arm */}
        <path d="M295 180 C318 188, 328 208, 315 218 Z" fill="#FFDE59" />
        <path d="M318 204 C330 216, 328 238, 290 240" stroke="#FCAC8C" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* 6. INDIGO/ROYAL BLUE LAPTOP MOUNTED DIRECTLY ON THE LAP */}
        <g>
          {/* Laptop Base Keyboard Deck Resting on the Knees */}
          <path d="M200 240 Q250 242 300 240 L310 244 Q250 246 190 244 Z" fill="#A1AFCE" />
          {/* Opened Royal Blue Display Back Cover */}
          <path d="M205 240 L195 182 Q250 180 305 182 L295 240 Z" fill="#3D538C" stroke="#2B3C68" strokeWidth="1.5" />
          {/* Centered Modern Branding Emblem */}
          <circle cx="250" cy="211" r="5" fill="#889CC9" />
        </g>

        {/* 7. DYNAMIC TYPING HANDS PLACED CARINGLY IN FOREGROUND */}
        <g className="hands-typing-anim">
          {/* Left hand typing with natural finger line details */}
          <circle cx="218" cy="242" r="7.5" fill="#FCAC8C" />
          <path d="M211 242 H223" stroke="#E58F6C" strokeWidth="1" strokeLinecap="round" />
          {/* Right hand typing with natural finger line details */}
          <circle cx="282" cy="242" r="7.5" fill="#FCAC8C" />
          <path d="M277 242 H289" stroke="#E58F6C" strokeWidth="1" strokeLinecap="round" />
        </g>
      </g>

      {/* Definitions for reusable robust lighting and gradients */}
      <defs>
        {/* Radial light backdrop gradient */}
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-400/20 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {title}
            </h4>
            {badgeText && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-650 dark:text-emerald-400">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div id="landing-page-root" className={`min-h-screen font-sans ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50/50 text-slate-800"}`}>
      
      {/* Navigation Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-850 px-4 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-md shadow-emerald-500/10 text-slate-950">
              <span className="text-lg font-black font-sans">Q</span>
            </div>
            <div className="text-left leading-none">
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                Study Qoro <span className="text-emerald-600 dark:text-emerald-400 text-xs">AI</span>
              </h1>
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">অ্যাকাডেমিক ও এডমিশন পোর্টাল</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode toggle widget embedded inside the navbar */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="থিম পরিবর্তন"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={onOpenAuth}
              className="py-1.5 sm:py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl transition-all"
            >
              লগইন (Sign In)
            </button>
            <button
              onClick={onOpenAuth}
              className="py-1.5 sm:py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-all whitespace-nowrap"
            >
              ফ্রি রেজিস্ট্রেশন (Sign Up)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">

        {/* 1. HERO BANNER: Premium High-Contrast visual header */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Launch Banner Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 text-[10px] sm:text-xs font-bold leading-none mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>এইচএসসি, এসএসসি ও এডমিশন প্রস্তুতির প্রথম AI পোর্টাল</span>
            </div>
            
            <h2 className="text-3px text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.12] tracking-tight font-sans">
              পড়াশোনা করো <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
                নিজের গতিতে, সম্পূর্ণ AI সহায়তায়!
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              হাজার হাজার রিয়েল বোর্ড প্রশ্ন ব্যাংক, অধ্যায়ভিত্তিক কাস্টম মক টেস্ট, স্পিড ডাবলিং টাইমার, এবং তাত্ক্ষণিক AI ডাউট সলভ নিয়ে প্রস্তুত হও যেকোনো প্রতিযোগিতামূলক পরীক্ষার জন্য।
            </p>

            {/* Quick Metrics stats strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 pt-2 pb-2">
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">১০ লক্ষ+</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">রিয়েল প্রশ্ন ব্যাংক</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">১ সেকেন্ডে</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">তাত্ক্ষণিক AI উত্তর</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">৯৯.৭%</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">সবচেয়ে নির্ভুল ব্যাখ্যা</div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ফ্রি ক্লাস ও প্র্যাকটিস শুরু করো</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <a
                href="https://play.google.com/store/apps/details?id=com.chorcha.ai"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3.5 px-8 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-850 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>মোবাইল অ্যাপ ডাউনলোড করুন</span>
              </a>
            </div>

            {/* Tiny informational trust strip */}
            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center justify-center lg:justify-start gap-2.5 pt-1.5">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">🕌 সম্পূর্ণ হালাল ও অ্যাড-ফ্রি (No Ads)</span>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <span>HSC ও বিশ্ববিদ্যালয় এডমিশন কারিকুলাম দ্বারা পরিচালিত</span>
            </div>

          </div>

          {/* Right Side: flat illustration vector graphic programmatically rendered */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-md relative bg-emerald-50/10 dark:bg-emerald-950/5 rounded-3xl p-4 border border-emerald-500/10">
              {mainHeroVector}
            </div>
          </div>
        </section>


        {/* 2. CHORCHA FEATURE CARDS GRID: Aesthetic feature bento items */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
              প্রিমিয়াম ফিচারসমূহ • STUDY QORO FEATURES
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              আমাদের পোর্টালের মজাদার ও আধুনিক ইন্টারফেস
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-semibold">
              বোর্ড প্রশ্নের ডাটাবেজ থেক শুরু করে প্রতিযোগিতামূলক কুইজ এবং AI ডাউট সলভার সমাধান, সবই থাকছে হাতের নাগালে।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {renderInteractiveFeatureCard(
              "১ ক্লিকে কাস্টম মক টেস্ট",
              "নিজের সুবিধামত বিষয়, অধ্যায়, সময় ও নেগেটিভ মার্কিং নির্বাচন করে ১ ক্লিকেই যেকোনো সিলেবাসে মক এক্সাম জেনারেট করো।",
              <Trophy className="w-6 h-6 animate-pulse" />,
              0,
              "Premium"
            )}
            {renderInteractiveFeatureCard(
              "Study Qoro AI ডাউট সলভার",
              "যেকোনো প্রশ্ন অথবা পড়ার টেবিলে আটকে যাওয়া বিষয়ের ইমেজ/ফাইল আপলোড করলেই সোর্স বুক সহ নির্ভুল উত্তর ও ব্যাখ্যা বুঝে নাও।",
              <BrainCircuit className="w-6 h-6" />,
              0.1,
              "AI Powered"
            )}
            {renderInteractiveFeatureCard(
              "দলগত কুইজ যুদ্ধ (Battle Room)",
              "রিয়েল-টাইম মাল্টিপ্লেয়ার ব্যাটল রুমে বন্ধুদের সাথে লাইভ বোর্ড এক্সাম প্রতিযোগিতায় মেতে ওঠো এবং বিজয়ী হয়ে XP অর্জন করো।",
              <Flame className="w-6 h-6" />,
              0.2,
              "Live Multi"
            )}
            {renderInteractiveFeatureCard(
              "দেশসেরা লাইভ লিডারবোর্ড",
              "সারা দেশের হাজারো মেধাবী পরীক্ষার্থীদের সাথে রিয়েল-টাইম পয়েন্ট তালিকায় নিজের পজিশন যাচাই করো ও প্রোগ্রেস বাড়াও।",
              <Award className="w-6 h-6" />,
              0.3
            )}
            {renderInteractiveFeatureCard(
              "নামাজী ও ইসলামিক ওয়াচগার্ড",
              "পড়াশোনায় বরকত বাড়াতে নামাজ ও ইসলামিক নিয়মতান্ত্রিক রুটিন ট্র্যাকার, যা পড়াশোনার পাশাপাশি তোমাকে দ্বীনের আলোয় রাখবে।",
              <ShieldCheck className="w-6 h-6" />,
              0.4,
              "Islamic Base"
            )}
            {renderInteractiveFeatureCard(
              "mistake Vault ও গভীর এনালাইটিক্স",
              "যেকোনো টেস্টে করা ভুল উত্তরগুলো স্বয়ংক্রিয়ভাবে মিস্টেক ভল্টে জমা হবে, যাতে পরবর্তীতে রিভিশন দিয়ে প্রস্তুতি নিখুঁত করা যায়।",
              <History className="w-6 h-6" />,
              0.5,
              "New"
            )}
          </div>
        </section>


        {/* 3. COMPETITOR COMPARISON TABLE: "কেন আমরাই সেরা?" */}
        <section className="p-1 sm:p-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/40 dark:to-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-850 shadow-xs relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
          
          <div className="p-6 md:p-10 space-y-10 relative z-10">
            <div className="text-center space-y-3">
              <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block">
                COMPETITOR ANALYSIS • কেন আমরা অন্যদের চেয়ে আলাদা?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                মার্কেটের অন্যান্য প্ল্যাটফর্ম বনাম Study Qoro
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-semibold">
                আমরা বিশ্বাস করি পড়াশোনার মান ও গভীরতা সুন্দর এস্টেটিক্স ডিজাইনের মাধ্যমেই বাড়ে। নিচে পার্থক্যটি দেখে নাও:
              </p>
            </div>

            {/* Clean responsive side-by-side comparison tiles */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              
              {/* Ordinary Competitors */}
              <div className="bg-slate-100/50 dark:bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-900 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-300">চিরাচরিত সাধারণ প্ল্যাটফর্ম ও অ্যাপসমূহ</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <span>অতিরিক্ত ও বিভ্রান্তিকর বিরক্তিদায়ক অ্যাডভার্টাইজমেন্টস এবং পপ-আপস।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <span>ধীরগতির ও সেঁকেলে ব্যাকএন্ড লোডিং টাইম (৩-১০ সেকেন্ড পর্যন্ত অপেক্ষা করতে হয়)।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <span>শুধু একঘেয়ে এমসিকিউ পরীক্ষা, কোনো লাইভ এনালাইসিস বা স্টাডি মেম্বার যুদ্ধ রুম নেই।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <span>সাধারণ গড়পড়তা Mock সমাধান, কোনো নির্ভরযোগ্য AI Doubt Solver বা সোর্স হাইলাইট নেই।</span>
                  </div>
                </div>
              </div>

              {/* Study Qoro highlights */}
              <div className="bg-emerald-500/[0.02] dark:bg-emerald-950/[0.04] p-6 sm:p-8 rounded-3xl border border-emerald-500/25 dark:border-emerald-400/15 space-y-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1.5 px-3.5 bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 text-[9px] font-extrabold uppercase rounded-bl-2xl">
                  BEST CHOICE
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">🚀</span>
                  <h3 className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">Study Qoro পোর্টালের আধুনিক রূপ</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>১০০% অ্যাড-ফ্রি (No Ads) প্রিমিয়াম পরিবেশ:</strong> কোনো অপ্রীতিকর অ্যাডভার্টাইজমেন্ট নেই।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>আল্ট্রা-ফাস্ট রেসপন্স টাইম:</strong> মিলি-সেকেন্ডে কাস্টম পরীক্ষা জেনারেশন ও লাইভ উত্তর।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>মাল্টিপ্লেয়ার গ্যামিফাইড যুদ্ধ:</strong> বন্ধুদের সাথে লাইভ লড়াই ও জাতীয় লিডারবোর্ড।</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>স্মার্ট Gemini Powered AI ডাউট সলভার:</strong> ম্যাথ সমীকরণের নিখুঁত KaTeX রেন্ডারিং সমর্থন করে।</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 4. PREMIUM PRICING TABLE: Standard Duolingo-styled packages */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block">
              PRICING PLANS • প্যাকেজ ও সাবস্ক্রিপশন ফি
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              পড়াশোনার কোনো অফার মিস কোরো না!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-semibold">
              সাশ্রয়ী মূল্যে আমাদের অল-ইন-ওয়ান AI পোর্টালের মেম্বারশিপ নিয়ে আনলক করো সম্পূর্ণ শক্তি।
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setSelectedPlan("monthly")}
                className={`py-2 px-5 text-xs font-bold rounded-xl transition-all uppercase cursor-pointer ${selectedPlan === "monthly" ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-950"}`}
              >
                মাসিক (Monthly)
              </button>
              <button 
                onClick={() => setSelectedPlan("yearly")}
                className={`py-2 px-5 text-xs font-bold rounded-xl transition-all uppercase cursor-pointer flex items-center gap-1.5 ${selectedPlan === "yearly" ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-950"}`}
              >
                <span>বার্ষিক (Yearly)</span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded text-[8px] font-extrabold uppercase">Save 35%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Plan 1: S-BASIC */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-800 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">S-BASIC</h4>
                  <p className="text-xl font-black text-slate-900 dark:text-white">ফ্রি ওয়ান-ট্যাপ ট্রায়াল</p>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ৳০ <span className="text-xs text-slate-400">/ ১৫ দিন</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-450 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>৫টি কাস্টম মক টেস্ট জেনারেটর</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="line-through">আনলিমিটেড AI Doubt Solver</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>লিডারবোর্ড ও প্রোগ্রেস ট্র্যাকার ভিউ</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="line-through">মাল্টিপ্লেয়ার ব্যাটলরুম এক্সেস</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 mt-6 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                গেট স্টার্টেড
              </button>
            </div>

            {/* Plan 2: S-PLUS (Popular) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-450 flex flex-col justify-between hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-extrabold uppercase text-[8px] py-1 px-3 rounded-bl-xl tracking-wider">
                POPULAR CHOICE
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">S-PLUS</h4>
                  <p className="text-xl font-black text-slate-900 dark:text-white">প্রিমিয়াম এডমিশন এক্সেস</p>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedPlan === "monthly" ? "৳১৪৯" : "৳৩৯৯"} <span className="text-xs text-slate-400">/ সেশনভিত্তিক</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-450 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span><strong>আনলিমিটেড কাস্টম মক টেস্ট</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>১০০টি AI ডাউট কুয়েরি / মাস</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>মাল্টিপ্লেয়ার ব্যাটলরুম আনলকড</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mistake Vault ও ব্যক্তিগত এনালাইটিক্স</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>নামাজী রুটিন ট্র্যাকার ওয়াচগার্ড</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-3 mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:brightness-105 active:scale-95 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                প্যাকেজটি এনরোল করুন
              </button>
            </div>

            {/* Plan 3: S-PRO */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-800 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">S-PRO</h4>
                  <p className="text-xl font-black text-slate-900 dark:text-white">অল-ইন-ওয়ান গোল্ড মেম্বার</p>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedPlan === "monthly" ? "৳২৪৯" : "৳৫৯৯"} <span className="text-xs text-slate-400">/ ওয়ান-টাইম ফি</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-450 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span><strong>সবকিছু আনলিমিটেড (Unlimited Access)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সীমাহীন মক টেস্ট ও রিয়েল সমাধান</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সীমাহীন স্মার্ট AI ডাউট সলভার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>লাইভ ২৪/৭ সাপোর্ট ও স্পেশাল গাইডলাইন</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>মোবাইল ও উইন্ডোজ অ্যাপের লাইসেন্স</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 mt-6 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                জানতে যোগাযোগ করুন
              </button>
            </div>

          </div>
        </section>


        {/* 5. USER TESTIMONIALS: Real human feedback from top Bangladeshi institutions */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block">
              STUDENT FEEDBACK • শিক্ষার্থী ও শিক্ষকদের প্রশংসাপত্র
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              হাজারো শিক্ষার্থী ও মেন্টরদের প্রথম চয়েস
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-semibold">
              আমাদের পোর্টালের সাথে প্রস্তুতি নিয়ে বুয়েট, ঢাবি এবং মেডিকেলে চান্স পাওয়া সহপাঠীদের অভিজ্ঞতা শুনুন।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl relative overflow-hidden">
              <div className="text-amber-400 flex gap-0.5 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic">
                "১ ক্লিকে প্রশ্ন তৈরি এবং লোগো, মোটো ও জলছাপ অটো যুক্ত হওয়ার ফিচারটা দারুণ! অনেক সময় বাঁচায়।"
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-500 flex items-center justify-center">M</div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Minhaz Shuvo Sir</h4>
                  <p className="text-[10px] text-slate-400">এইচএসসি ফিজিক্স মেন্টর</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl relative overflow-hidden">
              <div className="text-amber-400 flex gap-0.5 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic">
                "নিজের ইচ্ছেমতো বিষয়, টপিক ও সময় সিলেক্ট করে আনলিমিটেড মক টেস্ট দেওয়ার এবং নামাজি ট্র্যাকার সিস্টেমটা জাস্ট জোস!"
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-500 flex items-center justify-center">T</div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Tanvir Ahmed</h4>
                  <p className="text-[10px] text-slate-400">বুয়েট (BUET-23)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl relative overflow-hidden">
              <div className="text-amber-400 flex gap-0.5 mb-3.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic">
                "কঠিন ম্যাথ বা পদার্থবিজ্ঞান গাণিতিক সমীকরণে আটকে গেলে এদের AI ডাউট সলভার তাৎক্ষণিক নির্ভুল উত্তর জেনারেট করে।"
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-500 flex items-center justify-center">S</div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Sara Khatun</h4>
                  <p className="text-[10px] text-slate-400">ঢাকা বিশ্ববিদ্যালয় (DU-24)</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* 6. CALL TO ACTION BOTTOM SLATE CONTAINER */}
        <section className="p-8 sm:p-12 bg-gradient-to-tr from-emerald-600 to-cyan-500 text-slate-950 rounded-[2.5rem] relative overflow-hidden text-center space-y-6 shadow-xl shadow-emerald-500/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay" />
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              আজই শুরু হোক তোমার অগ্রযাত্রার সুন্দর প্রস্তুতি!
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 font-bold max-w-lg mx-auto leading-relaxed">
              দেরি না করে এখনই রেজিস্ট্রেশন করে আনলক করো ফ্রি কাস্টম টেস্ট সমাধান, নামাজ ট্র্যাকার ও দলগত ব্যাটলরুম ক্যুইজ সেশন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto py-4 px-8 bg-slate-950 text-white hover:text-emerald-400 font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ফ্রি অ্যাকাউন্ট তৈরি করুন (Sign Up)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto py-4 px-8 bg-[#F7F8F9]/20 hover:bg-[#F7F8F9]/30 text-slate-950 font-black text-sm rounded-2xl transition-all cursor-pointer"
            >
              মেন্টরদের সাথে আলোচনা
            </button>
          </div>
        </section>

      </div>

      {/* Modern minimalistic clean Footer */}
      <footer className="bg-slate-100 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-850 px-4 transition-colors text-center text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-extrabold uppercase tracking-widest text-[#059669] dark:text-emerald-400 text-[10px] sm:text-xs">STUDY QORO AI PLATFORM</p>
          <p className="max-w-lg mx-auto text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            © {new Date().getFullYear()} Study Qoro পোর্টালে তোমার পড়াশোনা সহজ হোক। সমস্ত তথ্যাদি বাংলাদেশ শিক্ষাবোর্ড HSC ও এডমিশন কারিকুলাম অনুসারে সাজানো।
          </p>
        </div>
      </footer>

    </div>
  );
}
