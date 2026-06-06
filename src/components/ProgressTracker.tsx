/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Award, Zap, Flame, Trophy, CheckCircle, Clock } from "lucide-react";
import { StudentStats } from "../types";
import { ACHIEVEMENTS } from "../data";

interface ProgressTrackerProps {
  stats: StudentStats;
}

export default function ProgressTracker({ stats }: ProgressTrackerProps) {
  // Mock historical record logs
  const [history] = useState([
    { id: 1, title: "পদার্থবিজ্ঞান - কাস্টম মডেল টেস্ট", result: "৪/৫ সঠিক", score: "৮০%", date: "আজ দুপুর ২:৪৫", reward: "+৭৩ XP", badgeEarned: true },
    { id: 2, title: "ইংরেজি কুইক প্র্যাকটিস", result: "৩টি অধ্যায়", score: "১০০%", date: "গতকাল বিকেল ৪:১৫", reward: "+৩০ XP", badgeEarned: false },
    { id: 3, title: "আইসিটি সংখ্যা পদ্ধতি এমসিকিউ", result: "৫/১০ সঠিক", score: "৫০%", date: "৩ দিন আগে", reward: "+১৫ XP", badgeEarned: false }
  ]);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. LEVEL & POINTS STATUS */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Glowing visual effect background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl" />

        <div className="flex items-center gap-5 text-left w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
            Lv{stats.level}
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-extrabold text-emerald-400">পরীক্ষার্থী রেটিং</span>
            <h3 className="text-xl font-bold text-slate-100 mt-0.5">মেধাবী অগ্রযাত্রা (Active Scholar)</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">সার্বক্ষণিক কঠোর ইবাদত ও ধারাবাহিক অধ্যাবসায়ের প্রতীক।</p>
          </div>
        </div>

        {/* Global Level progress bar status */}
        <div className="w-full md:w-80 text-left">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>আজকের এক্সপি অগ্রযাত্রা:</span>
            <span className="font-bold text-slate-200">{stats.points} মোট XP</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850 p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.points % 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">পরের লেভেলে উন্নীত হতে {(100 - (stats.points % 100))} XP প্রয়োজন</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Achievements list sidebar column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="mb-5">
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>অর্জন ও ব্যাজ সমূহ (Milestone Badges)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">পড়াশোনা ও ধর্মীয় নীতিসমূহ মেনে চলার বিশেষ সম্মাননা ব্যাজ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((badge) => {
                const isUnlocked = stats.completedMilestones.includes(badge.id) || stats.points >= badge.pointsRequired;
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                      isUnlocked
                        ? "bg-gradient-to-br from-slate-950 to-slate-900 border-yellow-500/30"
                        : "bg-slate-950 opacity-55 border-slate-850"
                    }`}
                  >
                    {/* Glowing side effect for unlocked ones */}
                    {isUnlocked && <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-500/5 rounded-full blur-md" />}

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked ? "bg-yellow-500/10 border border-yellow-500/30 animate-pulse" : "bg-slate-900"
                    }`}>
                      {badge.icon}
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{badge.name}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{badge.description}</p>
                      
                      <div className="mt-3.5 flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 font-bold">প্রয়োজন: {badge.pointsRequired} XP</span>
                        {isUnlocked ? (
                          <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            অর্জিত হয়েছে
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-600 bg-slate-900 px-2 py-0.5 rounded-lg">
                            লকড্
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* History of exams logs column */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-200">অনুশীলনের ইতিহাস</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">সাম্প্রতিক সেশনসমূহের সংক্ষিপ্ত ফাইল</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold">{h.date}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold">{h.reward}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-200 leading-relaxed">{h.title}</h5>
                <div className="flex items-center gap-3 pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                  <span>ফলাফল: <strong className="text-slate-300">{h.result}</strong></span>
                  <span>নির্ভুলতা: <strong className="text-cyan-400">{h.score}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
