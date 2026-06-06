/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Trophy, Star, Search, Flame, MapPin, Award, ArrowUpRight } from "lucide-react";
import { INITIAL_LEADERBOARD } from "../data";
import { StudentStats } from "../types";

interface LeaderboardProps {
  stats: StudentStats;
}

export default function Leaderboard({ stats }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeaderboard = INITIAL_LEADERBOARD.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Upper header summary */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg">
        {/* Decorative ambient sphere */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        
        <div className="max-w-xl space-y-2 relative">
          <span className="text-[10px] bg-white/20 border border-white/10 px-3.5 py-1.5 rounded-full font-black tracking-wider uppercase select-none inline-block">
            🏆 জাতীয় পরীক্ষা র‍্যাংকিং
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight pt-2">National MCQ Leaderboard</h2>
          <p className="text-xs text-emerald-100 leading-relaxed font-medium">
            সারাদেশের হাজারো এইচএসসি ও এডমিশন পরীক্ষার্থীদের সাথে প্রতিযোগিতায় এগিয়ে থাকুন। প্রতি লাইভ ব্যাটেল এবং কুইজ আপনার র‍্যাংক এগিয়ে দিবে!
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        
        {/* #2 Ranked */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-sm order-2 md:order-1 md:py-8">
          <div className="relative inline-block">
            <img 
              src={INITIAL_LEADERBOARD[1]?.avatarUrl} 
              alt="Rank 2"
              className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-slate-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
              #2
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{INITIAL_LEADERBOARD[1]?.name}</h3>
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-slate-300" />
              {INITIAL_LEADERBOARD[1]?.district}
            </p>
          </div>

          <div className="flex justify-around items-center pt-2 border-t border-slate-50 dark:border-slate-850/60 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">পয়েন্টস</span>
              <strong className="text-slate-700 dark:text-slate-200 font-extrabold">{INITIAL_LEADERBOARD[1]?.points} XP</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">টানা দিন</span>
              <strong className="text-amber-500 font-extrabold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-current" />
                {INITIAL_LEADERBOARD[1]?.streak}
              </strong>
            </div>
          </div>
        </div>

        {/* #1 Winner Podium (taller, bold border) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/80 p-6 rounded-3xl text-center space-y-4 shadow-md order-1 md:order-2 md:py-12 relative">
          {/* Winner gold badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow flex items-center gap-1">
            <Star className="w-3 h-3 fill-current animate-spin" />
            CHAMPION
          </div>

          <div className="relative inline-block">
            <img 
              src={INITIAL_LEADERBOARD[0]?.avatarUrl} 
              alt="Rank 1"
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full">
              #1
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-105">{INITIAL_LEADERBOARD[0]?.name}</h3>
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-amber-450" />
              {INITIAL_LEADERBOARD[0]?.district}
            </p>
          </div>

          <div className="flex justify-around items-center pt-2 border-t border-slate-50 dark:border-slate-850/60 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">পয়েন্টস</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{INITIAL_LEADERBOARD[0]?.points} XP</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">টানা দিন</span>
              <strong className="text-amber-500 font-extrabold flex items-center gap-0.5 animate-pulse">
                <Flame className="w-3 h-3 fill-current" />
                {INITIAL_LEADERBOARD[0]?.streak}
              </strong>
            </div>
          </div>
        </div>

        {/* #3 Ranked */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-sm order-3 md:py-8">
          <div className="relative inline-block">
            <img 
              src={INITIAL_LEADERBOARD[2]?.avatarUrl} 
              alt="Rank 3"
              className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-slate-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
              #3
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{INITIAL_LEADERBOARD[2]?.name}</h3>
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-slate-300" />
              {INITIAL_LEADERBOARD[2]?.district}
            </p>
          </div>

          <div className="flex justify-around items-center pt-2 border-t border-slate-50 dark:border-slate-850/60 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">পয়েন্টস</span>
              <strong className="text-slate-700 dark:text-slate-200 font-extrabold">{INITIAL_LEADERBOARD[2]?.points} XP</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[9px] uppercase">টানা দিন</span>
              <strong className="text-amber-500 font-extrabold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-current" />
                {INITIAL_LEADERBOARD[2]?.streak}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Main Ranking Table listing */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-extrabold text-slate-805 dark:text-slate-200">সারাদেশের টপ র‍্যাংক হোল্ডারগণ</h3>
          
          <div className="relative max-w-xs w-full bg-transparent">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="জেলা বা প্রতিযোগী খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-350 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-850 select-none">
                <th className="py-4 px-6">র‍্যাংক</th>
                <th className="py-4 px-6">পরীক্ষার্থী নাম</th>
                <th className="py-4 px-6">জেলা</th>
                <th className="py-4 px-6 text-center">ডেইলি স্ট্রিক</th>
                <th className="py-4 px-6 text-right">XP পয়েন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 font-semibold text-slate-700 dark:text-slate-250">
              {filteredLeaderboard.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition-all font-medium">
                  <td className="py-4 px-6 font-mono font-bold text-slate-500 select-none">
                    #{user.rank}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarUrl} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-850" 
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          {user.name}
                          {user.points > 250 && <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 select-none font-medium text-slate-550 dark:text-slate-400">
                    {user.district}
                  </td>
                  <td className="py-4 px-6 text-center select-none font-mono font-bold text-amber-500">
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {user.streak}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {user.points} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Persistent footer statistics highlighting the active user/guest's rank inside the list */}
      <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#059669]/15 text-[#059669] flex items-center justify-center font-bold">
            YOU
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100">{stats.name}</h4>
            <p className="text-[10px] text-slate-400 font-medium">আপনার অর্জিত মোট পড়াশোনা পয়েন্ট</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-right">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">আপনার র‍্যাংক</span>
            <strong className="text-amber-400 font-mono text-sm leading-none font-black">#99,912</strong>
          </div>
          <div className="border-l border-slate-800 h-8 font-light" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">আপনার স্কোর</span>
            <strong className="text-emerald-400 font-mono text-sm leading-none font-black">{stats.points || 15} XP</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
