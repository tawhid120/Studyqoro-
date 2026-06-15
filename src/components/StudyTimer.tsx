/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Timer, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { StudentStats } from "../types";

interface StudyTimerProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
}

export default function StudyTimer({ stats, setStats }: StudyTimerProps) {
  const [activePreset, setActivePreset] = useState("pomodoro"); // pomodoro, gp, review
  const [durationSeconds, setDurationSeconds] = useState(1500); // 25 mins default
  const [isActive, setIsActive] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [
    { id: "pomodoro", name: "এইচএসসি সাধারণ স্প্রিন্ট", description: "২৫ মিনিট নিবিড় পড়া + ৫ মিনিট রিফ্রেশমেন্ট বিরতি", duration: 1500, xp: 20 },
    { id: "quick_gk", name: "অ্যাডমিশন জিকে রাশ", description: "১৫ মিনিট দ্রুত মুখস্থকরণ + ৩ মিনিট হালকা বিশ্রাম", duration: 900, xp: 12 },
    { id: "deep_review", name: "মহা অধ্যায় পর্যালোচক", description: "৪৫ মিনিট মনস্তাত্ত্বিক ফোকাস + ১০ মিনিট দীর্ঘ বিরতি", duration: 2700, xp: 40 }
  ];

  useEffect(() => {
    if (isActive && durationSeconds > 0) {
      timerRef.current = setInterval(() => {
        setDurationSeconds(prev => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, durationSeconds]);

  const handleSelectPreset = (pId: string, duration: number) => {
    setIsActive(false);
    setActivePreset(pId);
    setDurationSeconds(duration);
    setSessionCompleted(false);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    setSessionCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Apply XP point rewards
    const presetObj = presets.find(p => p.id === activePreset);
    const xpReward = presetObj ? presetObj.xp : 15;

    setStats(prev => {
      const newPoints = prev.points + xpReward;
      return {
        ...prev,
        points: newPoints,
        level: Math.floor(newPoints / 100) + 1,
        streak: prev.streak + (Math.random() < 0.1 ? 1 : 0) // potential streak upgrade!
      };
    });
  };

  const formatTime = () => {
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Dynamic header of study timer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Timer className="w-5 h-5 text-emerald-400" />
          <span>স্মার্ট স্টাডি ও ফোকাস টাইমার (Focus Engine)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          নিয়মিত বিরতি ও অনুশীলনের সাথে পড়ার সময়কে সিঙ্ক করে চূড়ান্ত কার্যকারিতা অর্জন করো। পড়াশেষে এক্সপি সংগ্রহ করতে ভুলো না!
        </p>

        {/* Dynamic Presets list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id, p.duration)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                activePreset === p.id
                  ? "bg-emerald-600/10 border-emerald-400 text-slate-200"
                  : "bg-slate-950/60 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              <h4 className={`text-xs font-bold ${activePreset === p.id ? "text-emerald-400 font-extrabold" : "text-slate-300"}`}>{p.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">{p.description}</p>
              <span className="text-[10px] font-bold text-slate-500 font-mono block mt-2.5">+{p.xp} XP পুরষ্কার</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main clock display layout card */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6 relative overflow-hidden">
        
        {/* Floating background decorative effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

        {/* Clocks */}
        <div className="w-64 h-64 rounded-full border-4 border-slate-800 border-t-emerald-500 flex flex-col items-center justify-center mx-auto bg-slate-950 select-none shadow-xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">রানিং সেশন</span>
          <span className="text-5xl font-black font-mono text-slate-100 my-2">{formatTime()}</span>
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/20 border border-emerald-500/10">
            {isActive ? "মনোযোগ বজায় রাখো 🎯" : "স্থগিত রয়েছে ⏸️"}
          </span>
        </div>

        {/* Display completed notification */}
        {sessionCompleted && (
          <div className="max-w-md mx-auto p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2.5 text-xs text-emerald-300 animate-fade-in font-bold">
            <CheckCircle className="w-4.5 h-4.5" />
            <span>অভিনন্দন! তোমার স্টাডি চক্র সম্পূর্ণ হয়েছে এবং প্রোফাইলে বোনাস এক্সপি যোগ করা হয়েছে!</span>
          </div>
        )}

        {/* Controller actions */}
        <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
          {isActive ? (
            <button
              onClick={() => setIsActive(false)}
              className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-705 text-slate-200 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-750"
            >
              <Pause className="w-4 h-4 text-emerald-400" /> সাময়িক বিরতি (PAUSE)
            </button>
          ) : (
            <button
              onClick={() => {
                setSessionCompleted(false);
                setIsActive(true);
              }}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 text-xs rounded-xl font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
            >
              <Play className="w-4 h-4 fill-current" /> সেশন শুরু করুন (START)
            </button>
          )}

          <button
            onClick={() => {
              setIsActive(false);
              const p = presets.find(p => p.id === activePreset);
              setDurationSeconds(p ? p.duration : 1500);
              setSessionCompleted(false);
            }}
            className="p-3.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl transition-all"
            title="টাইমার রিসেট"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
