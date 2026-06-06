/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from "react";
import { X, Sparkles, ShieldAlert, BadgeCheck, Compass, HeartHandshake } from "lucide-react";
import { StudentStats } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  isForceLogin?: boolean;
}

export default function AuthModal({ isOpen, onClose, stats, setStats, isForceLogin }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(stats.isGuest ? "" : stats.name);
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Simulate real database login / registration
    const finalName = name.trim() || "Tawhid Islam";
    setStats({
      name: finalName,
      points: 145, // Set realistic initial points corresponding to the screens
      streak: 3,   // Activated streak
      level: 2,
      rank: 50,    // Unlocked standard national rank
      examsGiven: 4,
      totalQuestionsSolved: 32,
      plan: "Free", // Unlocked free mode (can upgrade to Pro anytime)
      completedMilestones: ["badge-2"],
      isGuest: false
    });

    onClose();
  };

  const handleGuestRestore = () => {
    // Restore default stats to demo Guest session with complete placeholder info
    setStats({
      name: "গেস্ট পরীক্ষার্থী (Guest User)",
      points: 5,
      streak: 0,
      level: 1,
      rank: 99912,
      examsGiven: 0,
      totalQuestionsSolved: 0,
      plan: "Free",
      completedMilestones: [],
      isGuest: true
    });
    onClose();
  };

  return (
    <div id="auth-modal-main" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-sm w-full relative space-y-5 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-100">
        
        {/* Close trigger button */}
        {!isForceLogin && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Identity & visual highlights */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <span className="text-2xl animate-pulse">🕌</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Study Qoro পোর্টালে লগইন"}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-normal">
            মেধাবী অগ্রযাত্রা এবং পড়ালেখার ধারাবাহিকতা বজায় রেখে আল্লাহর সন্তুষ্টি ও পার্থিব সফলতা অর্জন করো।
          </p>
        </div>

        {/* Dynamic warning bar */}
        {stats.isGuest && (
          <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-center gap-2 text-[10px] text-red-600 dark:text-red-400">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>লগইন না থাকলে হিস্ট্রি, লিডারবোর্ড ট্র্যাকিং লক থাকবে!</span>
          </div>
        )}

        {/* Active form handler */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">শিক্ষার্থীর পূর্ণ নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Tawhid Islam"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">ইমেইল এড্রেস</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. lorddanju@gmail.com"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">কলেজ / শিক্ষাপ্রতিষ্ঠান</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="যেমন: Dhaka College, Dhaka"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/15"
          >
            {isSignUp ? "অ্যাকাউন্ট তৈরি নিশ্চিত করুন" : "অ্যাকাউন্টে প্রবেশ করুন"}
          </button>
        </form>

        {/* Foot switches */}
        <div className="flex flex-col gap-2.5 pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
          >
            {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে? প্রবেশ করুন" : "নতুন অ্যাকাউন্ট খুলতে চান? এখানে ক্লিক করুন →"}
          </button>

          {!isForceLogin && (!stats.isGuest ? (
            <button
              onClick={handleGuestRestore}
              className="text-[11px] text-red-500 hover:underline hover:text-red-400 mt-1 font-bold"
            >
              🚪 লগ আউট করে গেস্ট মোডে যান
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-[10px] text-slate-400 hover:underline mt-1"
            >
              অ্যাকাউন্ট ছাড়া সাধারণভাবে দেখতে থাকুন 
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
