/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { 
  Clock, 
  Award, 
  CheckCircle, 
  Flame, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Check, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Inbox,
  Timer,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { StudentStats } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface HistoryLogProps {
  stats: StudentStats;
}

interface HistoricalEvent {
  id: string;
  type: "exam" | "study" | "ai" | "streak" | "prayer";
  title: string;
  subtitle: string;
  timestamp: string;
  xp: number;
  meta?: {
    subject?: string;
    score?: number;
    correct?: number;
    total?: number;
  };
}

interface DailyTrend {
  date: string;
  examsCount: number;
  avgAccuracy: number;
  avgTimePerQuestion: number;
  xpEarned: number;
  subject: string;
}

export default function HistoryLog({ stats }: HistoryLogProps) {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [activeChartTab, setActiveChartTab] = useState<"trends" | "accuracy" | "speed">("trends");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  useEffect(() => {
    // Generate clean history state
    setEvents([]);
  }, [stats.isGuest]);

  // programmatically generate realistic empty 30 days dataset matching new user state
  const last30DaysData = useMemo(() => {
    const data: DailyTrend[] = [];
    const subjectsList = ["পদার্থবিজ্ঞান", "রসায়ন", "English", "উচ্চতর গণিত", "জীববিজ্ঞান"];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const bDateStr = date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
      
      data.push({
        date: bDateStr,
        examsCount: 0,
        avgAccuracy: 0,
        avgTimePerQuestion: 0,
        xpEarned: 0,
        subject: subjectsList[0]
      });
    }
    return data;
  }, [stats.isGuest]);

  // Filter trends data according to subject
  const filteredData = useMemo(() => {
    if (selectedSubject === "All") return last30DaysData;
    return last30DaysData.map(item => {
      if (item.subject === selectedSubject) return item;
      // return a neutral item with zero metrics for other subjects to keep the temporal shape but focus on clicked
      return {
        ...item,
        examsCount: 0,
        avgAccuracy: 0,
        avgTimePerQuestion: 0,
        xpEarned: Math.min(item.xpEarned, 15) // simple offline reading xp
      };
    });
  }, [last30DaysData, selectedSubject]);

  // Compute aggregated KPI stats in Bengali
  const summaryKPIs = useMemo(() => {
    let totalExams = 0;
    let accuracySum = 0;
    let accuracyCount = 0;
    let timeSum = 0;
    let timeCount = 0;
    let totalXp = 0;

    filteredData.forEach(d => {
      totalXp += d.xpEarned;
      if (d.examsCount > 0) {
        totalExams += d.examsCount;
        accuracySum += d.avgAccuracy;
        accuracyCount++;
        timeSum += d.avgTimePerQuestion;
        timeCount++;
      }
    });

    const averageAccuracy = accuracyCount > 0 ? Math.round(accuracySum / accuracyCount) : 0;
    const averageQuestionTime = timeCount > 0 ? Math.round(timeSum / timeCount) : 0;

    return {
      totalExams,
      averageAccuracy,
      averageQuestionTime,
      totalXp
    };
  }, [filteredData]);

  const handleClearHistory = () => {
    if (confirm("তুমি কি সত্যিই সকল পড়াশোনার হিস্ট্রি মুছে ফেলতে চাও?")) {
      setEvents([]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto text-slate-800 dark:text-slate-100">
      
      {/* Upper header action controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            পড়াশোনা ও কার্যক্রমের হিস্ট্রি 📈
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            তোমার বিগত ৩০ দিনের বিশ্লেষণ ড্যাশবোর্ড, মক টেস্ট স্কোর ট্রেন্ড এবং অ্যাক্টিভিটি হিস্ট্রি।
          </p>
        </div>

        {events.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] uppercase font-bold rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>মুছে ফেলুন</span>
          </button>
        )}
      </div>

      {/* VISUALIZATION DASHBOARD SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-6">
        
        {/* Dashboard Title & Quick Subject Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 hover:scale-105 duration-100">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-150 font-bengali">
                বিগত ৩০ দিনের অগ্রগতি ড্যাশবোর্ড
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                কুইজ পারফরম্যান্স এবং সঠিকতার গ্রাফিকাল বিশ্লেষণ
              </p>
            </div>
          </div>

          {/* Elegant inline Subject filter dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 font-bengali">বিষয় নির্বাচন:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-bold font-bengali bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <option value="All">সব বিষয় (All Subjects)</option>
              <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান (Physics)</option>
              <option value="রসায়ন">রসায়ন (Chemistry)</option>
              <option value="English">English</option>
              <option value="উচ্চতর গণিত">উচ্চতর গণিত (Higher Math)</option>
              <option value="জীববিজ্ঞান">জীববিজ্ঞান (Biology)</option>
            </select>
          </div>
        </div>

        {/* 4 Summary Cards/Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* XP Widget */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-950/10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">অর্জিত মোট এক্সপি</span>
              <span className="text-xs">⚡</span>
            </div>
            <div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">+{summaryKPIs.totalXp} XP</div>
              <p className="text-[9px] text-slate-400 mt-1">বিগত ৩০ দিনে পড়াশোনা ও রিওয়ার্ডস</p>
            </div>
          </div>

          {/* Average Accuracy Widget */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-950/10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">গড় সঠিকতা হার</span>
              <span className="text-xs">🎯</span>
            </div>
            <div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{summaryKPIs.averageAccuracy}%</div>
              <p className="text-[9px] text-slate-400 mt-1">পরীক্ষায় নির্ভুল উত্তরের গড় হার</p>
            </div>
          </div>

          {/* Speed Widget */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/30 dark:border-amber-950/10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">প্রশ্নে গড় সময়</span>
              <span className="text-xs">⏱️</span>
            </div>
            <div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">{summaryKPIs.averageQuestionTime} সে./প্রশ্ন</div>
              <p className="text-[9px] text-slate-400 mt-1">প্রতিটি এমসিকিউ সমাধানে গড় স্পিড</p>
            </div>
          </div>

          {/* Exams participation Widget */}
          <div className="p-4 rounded-2xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-100/30 dark:border-cyan-950/10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">মোট পরীক্ষা সম্পন্ন</span>
              <span className="text-xs">📝</span>
            </div>
            <div>
              <div className="text-lg font-black text-cyan-500 dark:text-cyan-400">{summaryKPIs.totalExams === 0 ? "০" : summaryKPIs.totalExams} বার</div>
              <p className="text-[9px] text-slate-400 mt-1">মোট কুইজ লড়াই এবং মডেল টেস্ট</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs to toggle between 3 customizable charts */}
        <div className="flex items-center gap-1.5 bg-slate-55 dark:bg-slate-955 p-1 rounded-2xl border border-slate-100 dark:border-slate-850/60 max-w-md">
          <button
            onClick={() => setActiveChartTab("trends")}
            className={`flex-1 text-[11px] py-2 px-3 font-extrabold rounded-xl transition-all font-bengali ${
              activeChartTab === "trends"
                ? "bg-slate-950 dark:bg-slate-800 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            এক্সপি ও পড়াশোনা ট্রেন্ড (XP Trends)
          </button>
          
          <button
            onClick={() => setActiveChartTab("accuracy")}
            className={`flex-1 text-[11px] py-2 px-3 font-extrabold rounded-xl transition-all font-bengali ${
              activeChartTab === "accuracy"
                ? "bg-slate-950 dark:bg-slate-800 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            নির্ভুলতা মেটার (Accuracy Gauge)
          </button>

          <button
            onClick={() => setActiveChartTab("speed")}
            className={`flex-1 text-[11px] py-2 px-3 font-extrabold rounded-xl transition-all font-bengali ${
              activeChartTab === "speed"
                ? "bg-slate-950 dark:bg-slate-800 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            গতির বিশ্লেষণ (Speed Tracking)
          </button>
        </div>

        {/* Map / Draw actual Recharts visual display */}
        <div className="w-full h-[280px] bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-3 md:p-4 border border-slate-100 dark:border-slate-850/60 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === "trends" ? (
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }}
                  interval={4} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: "16px",
                    background: "#090d16",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                    fontSize: "11px",
                    fontWeight: "bold"
                  }} 
                />
                <Area 
                  type="monotone" 
                  name="অর্জিত এক্সপি (Daily XP)"
                  dataKey="xpEarned" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#trendGradient)" 
                />
              </AreaChart>
            ) : activeChartTab === "accuracy" ? (
              <LineChart data={filteredData.filter(d => d.examsCount > 0)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }}
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: "16px",
                    background: "#090d16",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                    fontSize: "11px",
                    fontWeight: "bold"
                  }} 
                  formatter={(value) => [`${value}% সঠিকতা (Accuracy)`, "পরীক্ষার রিপোর্ট"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgAccuracy" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={filteredData.filter(d => d.examsCount > 0)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }}
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(val) => `${val}s`}
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: "bold" }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: "16px",
                    background: "#090d16",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                    fontSize: "11px",
                    fontWeight: "bold"
                  }} 
                  formatter={(value) => [`${value} সেকেন্ড / প্রশ্ন (Sec/Q)`, "স্পিড এনালাইসিস"]}
                />
                <Bar 
                  dataKey="avgTimePerQuestion" 
                  fill="#f59e0b" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={30}
                  name="গড় কুইক সময়"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-12 text-center rounded-3xl space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">কোনো হিস্ট্রি পাওয়া যায়নি</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
            তুমি ড্যাশবোর্ড থেকে স্টাডি সেশন সম্পন্ন করলে অথবা মক পরীক্ষা সম্পন্ন করলে তা এখানে সংরক্ষিত হবে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Left panel: Timeline list */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-6">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider select-none mb-3 font-bengali flex items-center gap-2">
              📋 দৈনিক পড়াশোনা ও কার্যক্রমের লগ (Complete Logs)
            </h4>
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-5 ml-2.5 space-y-6">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  
                  {/* Timeline dot custom decorations */}
                  <div className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-950 flex items-center justify-center text-[10px] ${
                    event.type === "exam" ? "border-emerald-500 text-emerald-500" :
                    event.type === "prayer" ? "border-amber-500 text-amber-500" :
                    event.type === "ai" ? "border-cyan-500 text-cyan-500" :
                    "border-red-500 text-red-500"
                  }`}>
                    {event.type === "exam" && "📝"}
                    {event.type === "prayer" && "⏰"}
                    {event.type === "ai" && "🤖"}
                    {event.type === "streak" && "🔥"}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                        {event.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.timestamp}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/10">
                          +{event.xp} XP
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {event.subtitle}
                    </p>

                    {/* Meta info block showing breakdown */}
                    {event.meta && (
                      <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 flex items-center justify-between text-[10px]">
                        <div className="flex gap-4">
                          <span>সঠিক উত্তর: <strong className="text-emerald-500 font-extrabold">{event.meta.correct}/{event.meta.total}</strong></span>
                          <span>সঠিকতার হার: <strong className="text-emerald-500 font-extrabold">{event.meta.score}%</strong></span>
                        </div>
                        <span className="text-[9px] uppercase font-black text-slate-400">মেধার মূল্যায়ন</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Small recap sidebar */}
          <div className="md:col-span-4 space-y-4">
            
            {/* Stats aggregation bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                ডেইলি এনালাইটিক্স
              </h4>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">মোট সেশন এক্সপি:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">+{stats.points} XP</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">মোট পরীক্ষা সম্পন্ন:</span>
                  <span className="font-mono font-black text-slate-800 dark:text-slate-100 text-sm">{stats.isGuest ? 0 : 4} বার</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">ডেইলি স্টাডি বোনাস:</span>
                  <span className="font-mono font-black text-amber-500 text-sm">{stats.isGuest ? "১ সেশন" : "৪ সেশন"}</span>
                </div>
              </div>

              {/* Progress visual spark chart */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-850 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">আজকের লার্নিং টার্গেট</span>
                  <span className="text-emerald-500">৮৫% অর্জিত</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full w-[85%]" />
                </div>
              </div>
            </div>

            {/* Motivational message card fitting Bangladesh curriculum */}
            <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10 rounded-3xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>ক্রমাগত অগ্রগতি</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                "নিয়মিত অভ্যাসের মাধ্যমে আমরা ডিসিপ্লিনের সর্বোচ্চ ধারা বজায় রাখতে পারি।" Study Qoro-এর সাথে ধারাবাহিক প্রস্তুতি নিতে থাকো, সফলতাই আসবে।
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
