/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Youtube, 
  Instagram, 
  Linkedin, 
  ArrowUpRight, 
  Bookmark, 
  BookOpen, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  FileText,
  BadgeCheck,
  Send,
  Download
} from "lucide-react";

interface FooterProps {
  darkMode?: boolean;
}

export default function Footer({ darkMode = false }: FooterProps) {
  // Navigation lists for Bangladeshi edtech curriculum
  const academicStreams = [
    { label: "এসএসসি বিজ্ঞান (SSC Science)", link: "#" },
    { label: "এসএসসি মানবিক ও ব্যবসা (SSC Arts & Commerce)", link: "#" },
    { label: "এইচএসসি বিজ্ঞান (HSC Science)", link: "#" },
    { label: "এইচএসসি মানবিক (HSC Arts)", link: "#" },
    { label: "এইচএসসি ব্যবসায় শিক্ষা (HSC Commerce)", link: "#" },
    { label: "বিশ্ববিদ্যালয় ভর্তি (Varsity Admission)", link: "#" },
    { label: "মেডিকেল ও ইঞ্জিনিয়ারিং (Medical & Engineering)", link: "#" },
    { label: "বিসিএস ও চাকুরীর প্রস্তুতি (BCS & Job Prep)", link: "#" }
  ];

  const features = [
    { label: "প্রশ্ন ব্যাংক (Question Bank)", link: "#" },
    { label: "১ ক্লিকে মক টেস্ট (1-Tap Mock Test)", link: "#" },
    { label: "দ্রুত প্র্যাকটিস (Fast Practice)", link: "#" },
    { label: "রিয়েল-টাইম ব্যাটল রুম (Battle Room)", link: "#" },
    { label: "AI ডাউট সলভ (Chorcha AI Solver)", link: "#" },
    { label: "দেশসেরা লিডারবোর্ড (Leaderboard)", link: "#" },
    { label: "মিস্টেক ভল্ট (Mistake Vault)", link: "#" },
    { label: "নামাজী ট্র্যাকার ওয়াচগার্ড (Daily Tracker)", link: "#" }
  ];

  const companyPolicies = [
    { label: "আমাদের সম্পর্কে (About Us)", link: "#" },
    { label: "শর্তাবলী ও নিয়মাবলী (Terms & Conditions)", link: "#" },
    { label: "প্রাইভেসি পলিসি (Privacy Policy)", link: "#" },
    { label: "রিফান্ড পলিসি (Refund Policy)", link: "#" },
    { label: "ক্যানসেলেশন পলিসি (Cancellation Policy)", link: "#" },
    { label: "কুকিজ পলিসি (Cookies Policy)", link: "#" },
    { label: "DMCA পলিসি", link: "#" },
    { label: "জিজ্ঞাসাবাদ ও এফএকিউ (FAQ)", link: "#" }
  ];

  return (
    <footer id="premium-brand-footer" className="relative border-t border-slate-250/60 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 transition-colors duration-300">
      
      {/* 1. TOP INTERACTIVE BAND / NEWSLETTER & HIGHLIGHTS */}
      <div className="border-b border-slate-100 dark:border-slate-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                Chorcha AI / Study Qoro <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">PRO</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">এইচএসসি ও এডমিশন কারিকুলাম ভিত্তিক বাংলাদেশের সবচেয়ে আকর্ষণীয় ও আধুনিক ইন্টারেক্টিভ পোর্টাল</p>
            </div>
          </div>

          {/* Interactive Newsletter / Feedback Subscription form */}
          <div className="w-full md:w-auto flex items-center max-w-md gap-2">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                placeholder="নতুন সাজেশন পেতে ইমেইল ক্রুন..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
              />
            </div>
            <button className="py-2.5 px-4 bg-slate-900 hover:bg-emerald-600 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 select-none shrink-0">
              <span>সাবস্ক্রাইব</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHORCHA MAIN FOOTER CONTENTS GRID */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* COLUMN A: BRAND LOGO, SLOGAN & MOBILE APP DOWNLOAD BADGES */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md">
                <span className="text-lg font-black font-sans">Q</span>
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-1.5 font-sans">
                  Study Qoro <span className="text-emerald-500">AI</span>
                </h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest leading-none mt-0.5">চর্চা ও গ্যামিফাইড প্র্যাকটিস</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              এক প্ল্যাটফর্মে প্রশ্নব্যাংক, সলিউশন বুকলেট, রিয়েল-টাইম লাইভ কুইজ ব্যাটল রুম ও ১ ক্লিকে অধ্যায়ভিত্তিক মক টেস্ট। তোমার পড়ালেখার সঙ্গী এখন হবে আরো গতিশীল ও কার্যকরী!
            </p>

            {/* Competitor-style High Fidelity Mobile Store Download buttons */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">আমাদের মোবাইল অ্যাপ ডাউনলোড করুন:</div>
              <div className="flex flex-wrap gap-2.5">
                
                {/* Google Play app store badge */}
                <a 
                  href="https://play.google.com/store/apps/details?id=com.chorcha.ai" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 bg-slate-900 text-white rounded-xl py-2 px-3.5 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 hover:shadow-lg active:scale-95 transition-all text-left select-none group"
                >
                  <svg viewBox="0 0 512 512" className="w-5 h-5 text-white fill-current group-hover:scale-105 transition-transform" xmlns="http://www.w3.org/2000/svg">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58-33.4-60.7 60.7 60.7 60.7 58-33.4c18.5-10.6 18.5-27.9 0-38.6zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
                  </svg>
                  <div>
                    <div className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">GET IT ON</div>
                    <div className="text-xs font-black tracking-wide leading-tight">Google Play</div>
                  </div>
                </a>

                {/* App Store badge */}
                <a 
                  href="https://apps.apple.com/app/com.chorcha.ai" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 bg-slate-900 text-white rounded-xl py-2 px-3.5 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 hover:shadow-lg active:scale-95 transition-all text-left select-none group"
                >
                  <svg viewBox="0 0 170 170" className="w-5 h-5 text-white fill-current group-hover:scale-105 transition-transform" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.36-6.13-3.69-3.04-7.53-7.79-11.53-14.23-4-6.44-7.46-14.65-10.4-24.62-2.94-9.98-4.41-19.64-4.41-28.98 0-14.34 3.65-25.79 10.96-34.36 7.3-8.56 16.58-12.87 27.84-12.87 5.66 0 11.53 1.63 17.61 4.9 6.08 3.27 10.1 4.9 12.06 4.9 1.45 0 5.14-1.45 11.08-4.34 5.94-2.9 11.44-4.35 16.51-4.35 9.4 0 17.51 2.82 24.32 8.46 6.81 5.63 11.83 12.92 15.06 21.83-9.5 5.74-14.28 13.78-14.34 24.12-.06 7.82 2.64 14.4 8.08 19.75 5.44 5.35 12.06 8.33 19.88 8.93-.9 3.03-2.18 6.25-3.8 9.68zM119.22 30.65c0-6.81 2.4-13.11 7.19-17.9 4.88-4.9 11.04-7.53 18.1-7.75.13 7.18-2.27 13.56-7.19 18.15-4.82 4.69-11.23 7.3-17.65 7.5-.16-.14-.45-.14-.45-.14z" />
                  </svg>
                  <div>
                    <div className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Download on the</div>
                    <div className="text-xs font-black tracking-wide leading-tight">App Store</div>
                  </div>
                </a>

                {/* Web app icon link */}
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2.5 bg-slate-900 text-white rounded-xl py-2 px-3.5 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 hover:shadow-lg active:scale-95 transition-all text-left select-none group"
                >
                  <Download className="w-5 h-5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                  <div>
                    <div className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">WINDOWS APP</div>
                    <div className="text-xs font-black tracking-wide leading-tight">Desktop Client</div>
                  </div>
                </a>

              </div>
            </div>

            {/* Verification badging / halal-certified branding */}
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-3.5 rounded-2xl w-fit">
              <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-[10px] leading-relaxed">
                <div className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[9px]">Sovereign Safety & Islamic values</div>
                <div className="text-slate-500 dark:text-slate-400 font-bold">🕌 ১০০% কুরাআনিক বরকতপূর্ণ ও অ্যাড-ফ্রি লার্নিং সেবা।</div>
              </div>
            </div>

          </div>

          {/* COLUMN B: FEATURES LIST */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
              ফিচারসমূহ (Features)
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {features.map((item, idx) => (
                <li key={idx}>
                  <a href={item.link} className="text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1 group transition-colors leading-relaxed">
                    <span className="text-slate-300 dark:text-slate-700 font-mono text-[10px] sm:text-xs">0{idx+1}.</span>
                    <span className="group-hover:translate-x-1 duration-200 transition-transform">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN C: CURRICULUMS & STEAMS */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
              প্রস্তুতি ও বিভাগ (Streams)
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {academicStreams.map((item, idx) => (
                <li key={idx}>
                  <a href={item.link} className="text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1.5 group transition-colors leading-relaxed">
                    <Bookmark className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                    <span className="group-hover:translate-x-1 duration-200 transition-transform">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN D: COMPANY INFO & LEGAL */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
              কোম্পানি ও পলিসি
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {companyPolicies.map((item, idx) => (
                <li key={idx}>
                  <a href={item.link} className="text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center gap-1.5 group transition-colors leading-relaxed">
                    <FileText className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                    <span className="group-hover:translate-x-1 duration-200 transition-transform">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN E: CONTACT INFRASTRUCTURE & SUPPORT INFO */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
              যোগাযোগ (Contact)
            </h4>
            
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-[11px] sm:text-xs">মহো, হাউজ নং- ৫৬৮, রোড ১/এ, রাজশাহী ৬২০৭, বাংলাদেশ (Moho, House No- 568, Road 1/A, Rajshahi 6207)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-none text-[11px] sm:text-xs">+880 1605-002711, +880 1329637000</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-none text-[11px] sm:text-xs">hi@chorcha.net, info@studyqoro.com</span>
              </div>
            </div>

            {/* E-TIN & TRADE LICENSE DATA AS IN SCREENSHOT 3 */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">
              <div>
                E-TIN NUMBER: <span className="font-mono text-slate-700 dark:text-slate-300">371617991290</span>
              </div>
              <div>
                Trade licence No: <span className="font-mono text-slate-700 dark:text-slate-300">03/B - 2673</span>
              </div>
            </div>

            {/* Social icons list */}
            <div className="space-y-2 pt-3">
              <div className="text-[10px] font-black uppercase text-slate-400">FOLLOW US ON:</div>
              <div className="flex items-center gap-2">
                <a href="https://facebook.com/chorcha" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 hover:scale-105 transition-all cursor-pointer">
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
                <a href="https://youtube.com/@chorcha" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 hover:scale-105 transition-all cursor-pointer">
                  <Youtube className="w-4 h-4 fill-current" />
                </a>
                <a href="https://instagram.com/chorcha" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-200 hover:scale-105 transition-all cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/chorcha" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 hover:scale-105 transition-all cursor-pointer">
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. FINAL LEGAL COPYRIGHT TAGLINE BAR */}
      <div className="border-t border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 py-6 px-4">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <p className="text-left">
            স্বত্ব © ২০২৬ দাঁড়িয়েকমা ও চর্চা লিঃ কর্তৃক সর্বস্বত্ব সংরক্ষিত l © {new Date().getFullYear()} Study Qoro AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a href="#" className="hover:text-emerald-500 transition-colors">শর্তাবলী ও নিয়মাবলি</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-500 transition-colors">প্রাইভেসি পলিসি</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-500 transition-colors">সাপোর্ট সেন্টার</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
