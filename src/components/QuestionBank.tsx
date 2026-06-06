/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { BookOpen, Check, X, ArrowRight, HelpCircle, GraduationCap } from "lucide-react";
import { Subject, Question, StudentStats } from "../types";
import { QUESTION_BANK } from "../data";

interface QuestionBankProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  questions?: Question[];
}

export default function QuestionBank({ stats, setStats, questions }: QuestionBankProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.PHYSICS);
  const [selectedChapter, setSelectedChapter] = useState<string>("All");

  // Fallback to static bank if db is empty
  const dbQuestions = questions && questions.length > 0 ? questions : QUESTION_BANK;

  // Keep track of user's answers for questions
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [qId: string]: number }>({});

  // Filter questions based on subject and chapter
  const filteredQuestions = useMemo(() => {
    return dbQuestions.filter(q => {
      const matchSub = q.subject === selectedSubject;
      if (selectedChapter === "All") return matchSub;
      return matchSub && q.chapter === selectedChapter;
    });
  }, [selectedSubject, selectedChapter, dbQuestions]);

  // Extract chapters dynamically for selected subject
  const chapters = useMemo(() => {
    const list = dbQuestions.filter(q => q.subject === selectedSubject).map(q => q.chapter);
    return ["All", ...Array.from(new Set(list))];
  }, [selectedSubject, dbQuestions]);

  const handleSelectOption = (questionId: string, choiceIndex: number, correctIndex: number) => {
    // If already answered, do nothing
    if (answeredQuestions[questionId] !== undefined) return;

    setAnsweredQuestions(prev => ({ ...prev, [questionId]: choiceIndex }));

    const isCorrect = choiceIndex === correctIndex;

    // Award XP and increment stats
    setStats(prev => {
      const xpReward = isCorrect ? 10 : 2; // small consolation XP
      const newPoints = prev.points + xpReward;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        totalQuestionsSolved: prev.totalQuestionsSolved + 1
      };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Subject Header Navigation */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>স্মার্ট প্রশ্নব্যাংক ও চ্যাপ্টার প্র্যাকটিস</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              সঠিক অপশনে চাপ দিয়ে দ্রুত প্রস্তুতি ঝালিয়ে নাও ও প্রতিটি সঠিক উত্তরে +10 XP বুঝে নাও!
            </p>
          </div>
          
          {/* Chapter Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">অধ্যায় বাছাই করুন:</span>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 w-full md:w-48"
            >
              {chapters.map((chap, i) => (
                <option key={i} value={chap}>{chap === "All" ? "সব অধ্যায়" : chap}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subjects horizontal scroll rail */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {Object.values(Subject).map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  setSelectedChapter("All"); // Reset chapter
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md" 
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main List of Subject Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold">দুঃখিত! এই বিষয় বা চ্যাপ্টারের প্রশ্নের ওপর আমরা নিয়মিত কাজ করছি।</p>
          <p className="text-xs text-slate-500 mt-1">অন্যান্য বিষয় বাছাই করার জন্য অনুগ্রহ করে উপরের রেইল ব্যবহার করুন।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const userChoice = answeredQuestions[q.id];
            const isAnswered = userChoice !== undefined;

            return (
              <div 
                key={q.id} 
                className={`bg-slate-900 border p-6 rounded-3xl transition-all ${
                  isAnswered 
                    ? userChoice === q.correctIndex 
                      ? "border-emerald-500/30 shadow-lg shadow-emerald-950/10" 
                      : "border-red-500/20"
                    : "border-slate-800/80 hover:border-slate-700/60"
                }`}
              >
                {/* Question Info Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-950 border border-slate-800 text-[10px] text-zinc-400 font-bold px-2 py-1 rounded-full">
                      প্রশ্ন নং {idx + 1}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full">
                      {q.chapter}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">HSC Standard MCQ</span>
                </div>

                {/* Question Text */}
                <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed mb-5">
                  {q.questionText}
                </h4>

                {/* Options Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = userChoice === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;
                    
                    let buttonStyle = "bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700/85";
                    let stateIcon = null;

                    if (isAnswered) {
                      if (isOptionCorrect) {
                        buttonStyle = "bg-emerald-500/15 border-emerald-400/80 text-emerald-300 font-bold";
                        stateIcon = <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
                      } else if (isOptionSelected) {
                        buttonStyle = "bg-red-500/15 border-red-500/80 text-red-300 font-bold";
                        stateIcon = <X className="w-4 h-4 text-red-400 shrink-0" />;
                      } else {
                        buttonStyle = "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                            isOptionCorrect && isAnswered 
                              ? "bg-emerald-400 text-slate-950" 
                              : isOptionSelected && isAnswered 
                                ? "bg-red-400 text-slate-950" 
                                : "bg-slate-800 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>
                        {stateIcon}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text showing after answer (student psychology feedback) */}
                {isAnswered && (
                  <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-300 text-xs leading-relaxed animate-fade-in flex items-start gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400 block mb-1">ব্যাখ্যা (Diagnostic Feedback):</span>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
