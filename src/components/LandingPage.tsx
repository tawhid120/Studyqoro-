/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import HandDrawnArrow, { ImportantBadge } from "./HandDrawnArrow";
import heroGif from "../../gif/Adobe Express - ezgif-3787d2ce7e4ec185.gif";
import darkIllustration from "../../svg_images/landing/dark.svg";
import lightIllustration from "../../svg_images/landing/light.svg";
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

export function HighlightUnderline({ 
  children,
  variant = "zigzag"
}: { 
  children: React.ReactNode;
  variant?: "zigzag" | "mild" | "smooth";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = React.useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  // Soft elegant waves (much less wavy and frequent than standard zigzag to keep it professional)
  let pathD = "M 3,13 C 12,9 21,8 30,12 C 40,16 50,15 60,11 C 70,7 80,8 90,12 C 93,13 95,13 97,12";

  if (variant === "mild") {
    // Two gentle sweeping waves
    pathD = "M 3,12 C 20,7 35,7 48,12 C 62,17 76,17 90,12 C 93.5,11 95,11.5 97,12";
  } else if (variant === "smooth") {
    // A clean single smooth sweep with a slight end curve
    pathD = "M 3,13 C 30,15 60,13 80,11.5 C 90,11 95,11.5 97,12";
  }

  return (
    <span ref={elementRef} className="highlight-underline relative inline-block mx-1 text-[#00A884] dark:text-[#FF9E57]">
      <span className="relative z-10">{children}</span>
      <svg 
        className="absolute left-0 bottom-[-13px] w-full h-[26px] pointer-events-none overflow-visible" 
        viewBox="0 0 100 30" 
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`crayon-texture-${variant}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* The main hand-drawn wavy underline */}
        <motion.path 
          d={pathD} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          filter={`url(#crayon-texture-${variant})`}
          initial={{ pathLength: 0 }}
          animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Primary ink drip hanging beneath the end (X = 83) */}
        <motion.path
          d="M 81.5,12 C 81.5,15 81,17 81,20 A 1.5,1.5 0 1,0 84.5,20 C 84.5,17 84,15 84,12 Z"
          fill="currentColor"
          filter={`url(#crayon-texture-${variant})`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "83px 12px" }}
        />

        {/* Secondary ink drip hanging beneath the end (X = 91) */}
        <motion.path
          d="M 89.8,11.5 C 89.8,14 89.3,16 89.3,18 A 1.2,1.2 0 1,0 92.3,18 C 92.3,16 91.8,14 91.8,11.5 Z"
          fill="currentColor"
          filter={`url(#crayon-texture-${variant})`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ delay: 1.0, duration: 0.45, ease: "easeOut" }}
          style={{ transformOrigin: "91px 11.5px" }}
        />

        {/* Animate a tiny falling droplet detaching from the primary drip */}
        <motion.circle
          cx="83"
          cy="20.5"
          r="1.2"
          fill="currentColor"
          filter={`url(#crayon-texture-${variant})`}
          initial={{ y: 0, opacity: 0, scale: 1 }}
          animate={isVisible ? { y: 9, opacity: [0, 1, 1, 0], scale: [1, 1, 0.8, 0.4] } : { y: 0, opacity: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: "easeIn" }}
        />

        {/* Animate a tiny falling droplet detaching from the secondary drip */}
        <motion.circle
          cx="91"
          cy="18.5"
          r="0.9"
          fill="currentColor"
          filter={`url(#crayon-texture-${variant})`}
          initial={{ y: 0, opacity: 0, scale: 1 }}
          animate={isVisible ? { y: 7.5, opacity: [0, 1, 1, 0], scale: [1, 1, 0.8, 0.3] } : { y: 0, opacity: 0 }}
          transition={{ delay: 1.45, duration: 0.65, ease: "easeIn" }}
        />
      </svg>
    </span>
  );
}

export function HighlightCircle({ children, size = "large" }: { children: React.ReactNode; size?: "small" | "large" }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = React.useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const isSmall = size === "small";

  return (
    <span 
      ref={elementRef} 
      className={`highlight-circle relative inline-block text-[#00A884] dark:text-[#FF9E57] font-black tracking-wider ${
        isSmall 
          ? "px-1.5 sm:px-2.5 py-0.5 mx-1" 
          : "px-3 py-1 sm:px-5 sm:py-1.5 mx-1"
      }`}
      id={isSmall ? "hero-highlight-circle-small" : "hero-highlight-circle"}
    >
      <span className="relative z-10">{children}</span>
      <svg 
        className="absolute pointer-events-none overflow-visible" 
        style={
          isSmall 
            ? {
                top: "-2px",
                bottom: "-2px",
                left: "-4px",
                right: "-4px",
                width: "calc(100% + 8px)",
                height: "calc(100% + 4px)"
              }
            : {
                top: "-4px",
                bottom: "-4px",
                left: "-10px",
                right: "-10px",
                width: "calc(100% + 20px)",
                height: "calc(100% + 8px)"
              }
        }
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`crayon-texture-circle-${size}`} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={isSmall ? "1.8" : "3.8"} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path 
          d="M 92,20 C 70,6 40,8 20,25 C -2,42 -4,70 15,85 C 34,100 70,96 85,78 C 100,60 98,30 76,15 C 54,0 22,5 8,24 C -6,43 -7,72 12,88 C 31,104 68,102 86,81 C 94,68 96,52 93,35" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={isSmall ? "2.0" : "3.2"} 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter={`url(#crayon-texture-circle-${size})`}
          className={isVisible ? "stroke-draw-circle" : "opacity-0"} 
          style={isVisible ? { strokeDasharray: 850, strokeDashoffset: 850, animation: `drawCircleAnimation ${isSmall ? "2.0s" : "2.8s"} cubic-bezier(0.2, 0.8, 0.2, 1) forwards` } : {}}
        />
      </svg>
    </span>
  );
}

export function StudyIllustration({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="relative w-full max-w-[640px] md:max-w-none md:w-[122%] lg:w-[130%] xl:w-[135%] md:-mr-[10%] lg:-mr-[15%] xl:-mr-[18%] ml-auto select-none overflow-visible">
      {/* Dynamic backdrop soft gradient blob container matching mockup */}
      <div className={`absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[110%] rounded-full blur-[50px] opacity-25 transition-all duration-500 ${darkMode ? "bg-indigo-500/20" : "bg-[#4FD1C5]/10"}`} />
      
      <motion.img 
        src={darkMode ? darkIllustration : lightIllustration} 
        alt="Study Qoro Live Demo Illustration" 
        className="w-full h-auto object-contain select-none transition-all duration-300 relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function App({ 
  onOpenAuth, 
  stats = {}, 
  setStats = () => {}, 
  darkMode = false, 
  setDarkMode = () => {} 
  }: LandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [showModal, setShowModal] = useState(false);

  const handleThemeToggle = () => {
    if (typeof setDarkMode === "function") {
      setDarkMode(!darkMode);
    }
  };

  const handleAuthClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setShowModal(true);
    }
  };

  // SVG Graphic placeholder replaced with gorgeous interactive GIF inside mockup window

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
    <div id="landing-page-root" className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 ${darkMode ? "dark bg-gradient-to-tr from-[#0F1123] to-[#120F2E] text-slate-100" : "bg-[#FAFCFB] text-slate-800"}`}>
      
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
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center"
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
                className="w-full py-3 px-4 bg-[#92E3CE] text-slate-900 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all relative z-10"
              >
                ঠিক আছে, বুঝতে পেরেছি
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Top Header - Matching wireframes */}
      <header className="sticky top-0 z-40 bg-[#FAFCFB]/90 dark:bg-[#120F2E]/90 border-b border-teal-100/40 dark:border-slate-800/60 backdrop-blur-xl px-4 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={() => window.location.reload()}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4FD1C5] flex items-center justify-center shadow-lg shadow-emerald-500/10 text-slate-950 shrink-0">
              <span className="text-lg sm:text-xl font-black font-sans">S</span>
            </div>
            <div className="text-left leading-tight">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans flex items-center gap-1">
                study <span className="px-1.5 py-0.5 rounded bg-[#EBF8F6] dark:bg-emerald-950/40 text-[#00A884] dark:text-[#4FD1C5] text-[9px] sm:text-[10px] font-bold">qoro</span>
              </h1>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">অ্যাকাডেমিক পোর্টাল</p>
            </div>
          </div>

          {/* Centered navigation links from mockup */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">
            <a href="#home" className="hover:text-[#00A884] dark:hover:text-[#4FD1C5] transition-colors">HOME</a>
            <a href="#categories" className="hover:text-[#00A884] dark:hover:text-[#4FD1C5] transition-colors">CATEGORIES</a>
            <a href="#sitemap" className="hover:text-[#00A884] dark:hover:text-[#4FD1C5] transition-colors">SITEMAP</a>
            <a href="#news" className="hover:text-[#00A884] dark:hover:text-[#4FD1C5] transition-colors">NEWS</a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode toggle */}
            <button 
              onClick={handleThemeToggle}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:text-[#00A884] dark:hover:text-[#4FD1C5] hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="থিম পরিবর্তন"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={handleAuthClick}
              className="hidden sm:block py-2 px-3 text-slate-700 dark:text-slate-200 hover:text-[#00A884] dark:hover:text-[#4FD1C5] font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider"
            >
              লগইন
            </button>
            <button
              onClick={handleAuthClick}
              className={`py-2 px-4 sm:py-2.5 sm:px-6 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-95 uppercase tracking-wider ${
                darkMode 
                  ? "bg-[#2B3645] text-white hover:bg-[#374558]" 
                  : "bg-[#92E3CE] text-slate-900 hover:bg-[#7DCABC]"
              }`}
            >
              সাইন আপ
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO BANNER - Perfect for Mobile & Tablet Landscape, with foreground SVG illustration & custom code wavy background */}
      <div id="landing-hero-container" className="relative w-full overflow-hidden bg-[#FAFCFB] dark:bg-[#120F2E] py-6 sm:py-8 md:py-12 flex items-center">
        
        {/* Hero Content Wrapper aligned center */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-2 sm:pt-0 sm:pb-3 md:pt-0 md:pb-4 relative z-10 w-full">
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
            
            {/* Left Side: Text Content */}
            <div className="md:col-span-6 space-y-6 sm:space-y-8 text-center md:text-left relative z-10 md:pr-4">
              
              <h2 className="text-[17px] xs:text-xl sm:text-2xl md:text-[25px] lg:text-[28px] xl:text-[32px] font-black text-slate-900 dark:text-white leading-[1.3] tracking-tight font-sans pb-1 flex flex-wrap items-center justify-center md:justify-start gap-y-2">
                পড়াশোনা করো{" "}
                <br className="hidden sm:block" />
                <HighlightUnderline>নিজের গতিতে</HighlightUnderline>,{" "}
                <HighlightCircle>(AI সহায়তায়!)</HighlightCircle>
              </h2>

              <p className="text-xs sm:text-sm md:text-sm lg:text-base text-slate-700 dark:text-slate-300 max-w-lg mx-auto md:mx-0 leading-relaxed font-semibold px-2 sm:px-0">
                হাজার হাজার রিয়েল বোর্ড প্রশ্ন ব্যাংক, অধ্যায়ভিত্তিক <span className="text-[#00A884] dark:text-[#4FD1C5] border-b-2 border-[#92E3CE] dark:border-[#4FD1C5]/50 font-black px-0.5">কাস্টম মক টেস্ট</span> , স্পিড ডাবলিং টাইমার, এবং তাৎক্ষণিক <span className="text-[#00A884] dark:text-[#4FD1C5] border-b-2 border-[#92E3CE] dark:border-[#4FD1C5]/50 font-black px-0.5 font-sans">AI ডাউট সলভ</span> নিয়ে প্রস্তুত হও যেকোনো প্রতিযোগিতামূলক পরীক্ষার জন্য।
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1">
                <button
                  id="btn-free-trial"
                  onClick={handleAuthClick}
                  className={`w-full sm:w-auto min-h-[46px] py-3 px-8 font-black text-xs sm:text-sm rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer ${
                    darkMode 
                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-[#10B981] text-emerald-400 hover:bg-emerald-500/35" 
                      : "bg-[#92E3CE] text-slate-900 hover:bg-[#7DCABC] shadow-emerald-500/10"
                  }`}
                >
                  <span>FREE TRIAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  id="btn-download"
                  onClick={handleAuthClick}
                  className={`w-full sm:w-auto min-h-[46px] py-3 px-8 font-black text-xs sm:text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                    darkMode 
                      ? "border border-slate-705 bg-transparent text-slate-300 hover:bg-slate-800/40" 
                      : "bg-[#92E3CE] text-slate-900 hover:bg-[#7DCABC] shadow-emerald-500/10"
                  }`}
                >
                  <Download className="w-4 h-4 text-slate-900 dark:text-[#4FD1C5]" />
                  <span>DOWNLOAD</span>
                </button>
              </div>

              {/* Tiny informational trust strip */}
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/10 px-2.5 py-1 rounded-md text-emerald-700 dark:text-[#4FD1C5] border border-emerald-100/60 dark:border-emerald-800/20">
                  🕌 হালাল ও অ্যাড-ফ্রি
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/40">
                  📚 HSC ও এডমিশন কারিকুলাম
                </span>
              </div>
            </div>

            {/* Right Side Column: Interactive foreground illustration with custom designed wavy background and Metrics */}
            <div className="md:col-span-6 flex flex-col items-center md:items-end w-full relative z-10 mt-6 md:mt-0">
              
              {/* Illustration container with wave background */}
              <div className="relative w-full max-w-[640px] flex items-center justify-center select-none overflow-visible">
                
                {/* 1. BEAUTIFUL DYNAMIC SVG WAVE BACKDROP */}
                <svg 
                  className="absolute -left-[5%] top-[10%] w-[110%] h-[90%] pointer-events-none z-0 overflow-visible opacity-85" 
                  viewBox="0 0 600 500" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Soft gorgeous ambient gradient */}
                    <linearGradient id="fluid-wave-gradient" x1="0%" y1="30%" x2="100%" y2="80%">
                      <stop offset="0%" stopColor={darkMode ? "#312E81" : "#E2E8F0"} stopOpacity="0.8" />
                      <stop offset="50%" stopColor={darkMode ? "#4F46E5" : "#E0E7FF"} stopOpacity="0.55" />
                      <stop offset="100%" stopColor={darkMode ? "#1E1B4B" : "#F1F5F9"} stopOpacity="0.2" />
                    </linearGradient>

                    {/* Primary wave glow/shadow */}
                    <filter id="wave-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="15" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Diagonal Slanted Pattern Shading matching the crop marks/lines on the mockup */}
                    <pattern id="diagonal-hatched-pattern" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                      <line x1="0" y1="0" x2="0" y2="24" stroke={darkMode ? "rgba(129, 140, 248, 0.25)" : "rgba(99, 102, 241, 0.12)"} strokeWidth="2" />
                    </pattern>
                  </defs>

                  {/* Background organic shaded wave element (Hatched overlay) */}
                  <path 
                    d="M 60,320 C 130,220 180,380 280,240 C 380,100 480,140 550,60 C 580,20 620,10 650,20 L 650,480 C 650,510 580,520 520,500 C 440,480 340,490 260,470 C 140,440 40,410 20,380 Z" 
                    fill="url(#diagonal-hatched-pattern)" 
                    className="animate-pulse"
                    style={{ animationDuration: "6s" }}
                  />

                  {/* Main abstract fluid wave silhouette with drop shadow glow */}
                  <path 
                    d="M 45,305 C 125,205 165,355 265,225 C 365,95 465,115 535,45 C 565,15 595,10 625,20 L 625,445 C 625,475 565,490 505,475 C 425,455 325,465 245,445 C 125,415 65,385 25,350 Z" 
                    fill="url(#fluid-wave-gradient)" 
                    filter="url(#wave-soft-glow)"
                  />

                  {/* Secondary outline wave for depth */}
                  <path 
                    d="M 45,305 C 125,205 165,355 265,225 C 365,95 465,115 535,45" 
                    stroke={darkMode ? "rgba(129, 140, 248, 0.5)" : "rgba(99, 102, 241, 0.22)"} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />

                  {/* Beautiful decorative trailing dotted curves exactly from the screenshot */}
                  <path 
                    d="M 25,320 C 105,220 145,370 245,240 C 345,110 445,130 515,60" 
                    stroke={darkMode ? "#818CF8" : "#818CF8"} 
                    strokeWidth="3.5" 
                    strokeDasharray="2, 10" 
                    strokeLinecap="round" 
                    opacity="0.4"
                  />

                  <path 
                    d="M 50,280 C 130,180 170,330 270,200" 
                    stroke={darkMode ? "#6366F1" : "#4F46E5"} 
                    strokeWidth="2" 
                    strokeDasharray="1, 8" 
                    strokeLinecap="round" 
                    opacity="0.3"
                  />

                  {/* Ambient dots matching screenshot's lavender accents */}
                  <circle cx="80" cy="180" r="14" fill={darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.08)"} />
                  <circle cx="280" cy="380" r="20" fill={darkMode ? "rgba(165, 180, 252, 0.15)" : "rgba(165, 180, 252, 0.1)"} />
                  <circle cx="450" cy="120" r="10" fill={darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.08)"} />
                </svg>

                {/* 2. FOREGROUND ILLUSTRATION - Perfectly sized, never collides with buttons */}
                <motion.img 
                  src={darkMode ? darkIllustration : lightIllustration} 
                  alt="Study Qoro Live Demo Illustration" 
                  className="w-full h-auto object-contain select-none transition-all duration-300 relative z-10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Quick Metrics stats strip placed beautifully UNDER code-built SVG illustration container */}
              <div className="w-full max-w-xl md:max-w-none mt-6 relative z-10">
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3 w-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-md p-3 rounded-2xl border border-white/80 dark:border-slate-800/40 shadow-xl">
                  {[
                    { label: "১০ লক্ষ+", desc: "প্রশ্ন ব্যাংক" },
                    { label: "১ সেকে.", desc: "AI উত্তর" },
                    { label: "৯৯.৭%", desc: "নির্ভুলতা" },
                    { label: "৯৯.৭%", desc: "নির্ভুলতা" }
                  ].map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-xl flex items-center gap-1.5 border transition-all duration-300 ${
                        darkMode 
                          ? "bg-[#181B34]/60 border-[#2B2F4E]/40 hover:border-[#10B981]/50" 
                          : "bg-white/95 border-slate-200/50 hover:border-emerald-300/50"
                      }`}
                    >
                      {/* Small round checkbox indicator */}
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
                        <Check className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 stroke-[3]" />
                      </div>
                      <div className="text-left select-none leading-none">
                        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-none mb-0.5 whitespace-nowrap">{m.label}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-none whitespace-nowrap">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </section>
        </div>
      </div>

      {/* Main Container - Optimized max-width for tablet (1280px) and proper spacing */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-20 py-6 sm:py-8 lg:py-12">


        {/* 2. CHORCHA FEATURE CARDS GRID */}
        <section className="space-y-10 sm:space-y-14 relative z-10">
          <div className="text-center space-y-3 sm:space-y-4 px-4">
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
                প্রিমিয়াম ফিচারসমূহ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug pb-1">
              আমাদের পোর্টালের <br className="sm:hidden" /> <HighlightUnderline>আধুনিক ইন্টারফেস</HighlightUnderline>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
              বোর্ড প্রশ্নের ডাটাবেজ থেকে শুরু করে প্রতিযোগিতামূলক কুইজ এবং AI ডাউট সলভার সমাধান, সবই থাকছে হাতের নাগালে।
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
              "Study Qoro সলভার",
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
              "ডেইলি স্টাডি ওয়াচগার্ড",
              "পড়াশোনায় গভীর মনোযোগ বাড়াতে দৈনিক নিয়মতান্ত্রিক রুটিন ট্র্যাকার, যা তোমাকে সবসময় এগিয়ে রাখবে।",
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />,
              0.5,
              "Daily Habit"
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
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium leading-loose">
                আমরা বিশ্বাস করি পড়াশোনার মান ও গভীরতা <HighlightCircle size="small">সুন্দর এস্টেটিক্স</HighlightCircle> ডিজাইনের মাধ্যমেই বাড়ে। নিচে পার্থক্যটি দেখে নাও:
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

              {/* study qoro highlights */}
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-loose pb-2">
              সাশ্রয়ী <HighlightUnderline>সাবস্ক্রিপশন প্যাকেজ</HighlightUnderline>
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
                    <span>ডেইলি রুটিন ট্র্যাকার ওয়াচগার্ড</span>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.4] pb-4">
                আজই শুরু হোক তোমার অগ্রযাত্রার <HighlightCircle>সুন্দর প্রস্তুতি!</HighlightCircle>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed">
                দেরি না করে এখনই রেজিস্ট্রেশন করে আনলক করো ফ্রি কাস্টম টেস্ট সমাধান, স্টাডি ট্র্যাকার ও দলগত ব্যাটলরুম ক্যুইজ সেশন।
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
      <Footer darkMode={darkMode} />

    </div>
  );
}