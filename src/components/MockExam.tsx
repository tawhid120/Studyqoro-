/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { 
  FileText, 
  RotateCcw, 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckSquare, 
  Award, 
  Clock, 
  Zap,
  Info
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Subject, Question, StudentStats, ExamSession } from "../types";
import { QUESTION_BANK } from "../data";

interface MockExamProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  questions?: Question[];
}

export default function MockExam({ stats, setStats, questions }: MockExamProps) {
  // Main state flags
  const [quizState, setQuizState] = useState<"setup" | "active" | "results">("setup");
  
  // Custom configurations
  const [selectedSubject, setSelectedSubject] = useState<string>(Subject.PHYSICS);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number>(5);
  const [timerMinutes, setTimerMinutes] = useState<number>(5);

  const dbQuestions = questions && questions.length > 0 ? questions : QUESTION_BANK;

  // Extract subjects list dynamically from questions as strings
  const availableSubjects = useMemo(() => {
    const list = dbQuestions.map(q => q.subject as string);
    const unique = Array.from(new Set(list));
    // Sort according to Subject enum if possible, then any custom ones
    const enumOrder = Object.values(Subject) as string[];
    return unique.sort((a, b) => {
      const idxA = enumOrder.indexOf(a);
      const idxB = enumOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [dbQuestions]);

  // Adjust selectedSubject if it's not in the available lists
  useEffect(() => {
    const subjectsList = availableSubjects as string[];
    if (subjectsList.length > 0 && !subjectsList.includes(selectedSubject)) {
      setSelectedSubject(subjectsList[0]);
    }
  }, [availableSubjects]);

  // Active quiz state
  const [currentExam, setCurrentExam] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userSelections, setUserSelections] = useState<{ [qIndex: number]: number }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(300);

  // References
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up & shuffle questions
  const handleStartExam = () => {
    // Collect possible questions
    const matchingQuestions = dbQuestions.filter(q => (q.subject as string) === selectedSubject);
    
    if (matchingQuestions.length === 0) {
      alert("দুঃখিত, এই বিষয়ের উপর কাস্টম মক টেস্টের প্রশ্ন এখনো আপলোড করা হচ্ছে।");
      return;
    }

    // Shuffle and pick
    const shuffled = [...matchingQuestions].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, Math.min(totalQuestionsCount, matchingQuestions.length));

    const session: ExamSession = {
      id: "exam-" + Date.now(),
      subject: selectedSubject as Subject,
      title: `${selectedSubject} - কাস্টম মডেল টেস্ট`,
      totalQuestions: subset.length,
      durationMinutes: timerMinutes,
      questions: subset
    };

    setCurrentExam(session);
    setUserSelections({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(timerMinutes * 60);
    setQuizState("active");
  };

  // Timer countdown hook
  useEffect(() => {
    if (quizState === "active" && timeRemainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            // Force evaluate on time expiration
            clearInterval(timerIntervalRef.current!);
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [quizState, timeRemainingSeconds]);

  const handleCompleteExam = () => {
    if (!currentExam) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // Score evaluation
    let correctCount = 0;
    currentExam.questions.forEach((q, idx) => {
      if (userSelections[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / currentExam.totalQuestions) * 100);
    const xpEarned = Math.max(0, (correctCount * 12) + (scorePct >= 80 ? 25 : 0)); // bonus for >80% accuracy

    // Save final stats
    setCurrentExam(prev => {
      if (!prev) return null;
      return {
        ...prev,
        score: scorePct,
        correctAnswers: correctCount,
        completedAt: new Date().toLocaleTimeString()
      };
    });

    // Update global student profile
    setStats(prev => {
      const milestones = [...prev.completedMilestones];
      // Add mastermind milestone if score is perfect
      if (scorePct >= 80 && !milestones.includes("badge-3")) {
        milestones.push("badge-3");
      }

      return {
        ...prev,
        points: prev.points + xpEarned,
        level: Math.floor((prev.points + xpEarned) / 100) + 1,
        examsGiven: prev.examsGiven + 1,
        completedMilestones: milestones
      };
    });

    setQuizState("results");
  };

  // Human friendly countdown string
  const formatCountdown = () => {
    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SETUP STATE SCREEN */}
      {quizState === "setup" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 italic">নিজের মডেল টেস্ট ইঞ্জিন তৈরি করো</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">পড়াশোনা ও ডেইলি হ্যাবিট ট্র্যাকিং ও কাস্টম সিলেবাস অনুসারে পরীক্ষা সেট আপ করো।</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">পরীক্ষার বিষয় নির্ধারণ করুন:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {availableSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                      selectedSubject === sub
                        ? "bg-emerald-600 text-white border-2 border-emerald-400/50 shadow-md"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count and timer setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">প্রশ্ন সংখ্যা:</label>
                <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-slate-800 dark:text-slate-100">
                  {[5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTotalQuestionsCount(num)}
                      className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${
                        totalQuestionsCount === num ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {num} টি প্রশ্ন
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">সময়সীমা নির্ধারণ:</label>
                <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-slate-800 dark:text-slate-100">
                  {[3, 5, 10].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimerMinutes(mins)}
                      className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${
                        timerMinutes === mins ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {mins} মিনিট
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Informational Guidelines Card */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 p-4.5 flex gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-400">
              <Info className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">পরীক্ষার নিয়মাবলী ও পুরস্কার:</span>
                <p className="mt-1">
                  ১. পরীক্ষার সময় কাউন্টডাউন টাইমার স্বয়ংক্রিয়ভাবে চলমান থাকবে।
                  <br />
                  ২. ৮০% বা তার বেশি স্কোরে এক্সট্রা <span className="text-amber-600 dark:text-yellow-500 font-bold">+২৫ XP</span> মেগা বোনাস রয়েছে!
                  <br />
                  ৩. প্রতিটি ভুল উত্তরের সংশোধন ও বিস্তারিত সমাধান পরীক্ষা শেষে দেখানো হবে।
                </p>
              </div>
            </div>

            {/* Submit Actions */}
            <button
              id="start-mock-test-btn"
              onClick={handleStartExam}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl tracking-wider active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <Play className="w-4.5 h-4.5 fill-current" />
              মডেল টেস্ট শুরু করুন (START EXAM)
            </button>

          </div>
        </div>
      )}

      {/* 2. ACTIVE QUIZ RUNNING STATE */}
      {quizState === "active" && currentExam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Questions Navigation & Timer sidebar column */}
          <div className="lg:order-2 space-y-6">
            {/* Timer card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl text-center shadow-xs">
              <div className="flex justify-center mb-1 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                অবশিষ্ট সময় (Time Left)
              </div>
              <div className="flex items-center justify-center gap-2.5 text-3xl font-black font-mono text-red-500 dark:text-red-400">
                <Clock className="w-7 h-7 text-red-500 dark:text-red-400 animate-pulse" />
                {formatCountdown()}
              </div>
            </div>

            {/* Questions checklist panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">সব প্রশ্নের সূচক</h4>
              <div className="grid grid-cols-5 gap-2.5">
                {currentExam.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      currentQuestionIndex === i
                        ? "bg-emerald-500 text-white ring-2 ring-emerald-400/40"
                        : userSelections[i] !== undefined
                          ? "bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Status information */}
              <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800/80 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>উত্তর দেওয়া হয়েছে:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Object.keys(userSelections).length} / {currentExam.totalQuestions}
                </span>
              </div>
            </div>

            {/* Quick Finish CTA */}
            <button
              id="submit-exam-btn"
              onClick={handleCompleteExam}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckSquare className="w-4.5 h-4.5" />
              মডেল টেস্ট সাবমিট করুন
            </button>
          </div>

          {/* Active Question pane */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xs">
              {/* Question metadata header */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-xs bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 font-bold">
                  প্রশ্ন {currentQuestionIndex + 1} of {currentExam.totalQuestions}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                  {currentExam.subject}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-6">
                {currentExam.questions[currentQuestionIndex].questionText}
              </h3>

              {/* Options lists */}
              <div className="space-y-3.5">
                {currentExam.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = userSelections[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => setUserSelections(prev => ({ ...prev, [currentQuestionIndex]: optIdx }))}
                      className={`w-full p-4.5 rounded-2xl border text-left text-sm transition-all flex items-center gap-4 ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-slate-900 dark:hover:border-slate-705"
                      }`}
                    >
                      <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-150 dark:bg-slate-850 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-150 dark:border-slate-850">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> আগেরটি
                </button>

                {currentQuestionIndex < currentExam.totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-4 py-2 bg-slate-55 dark:bg-slate-950 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    পরেরটি <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteExam}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    সমাপ্তি <CheckSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. PERFORMANCE RESULTS STATE */}
      {quizState === "results" && currentExam && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-4xl mx-auto shadow-xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-2xl text-slate-950 shadow-md">
              <Award className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-805 dark:text-slate-100 mt-4">মডেল টেস্ট সম্পন্ন হয়েছে!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">অভিনন্দন! তোমার দক্ষতার মূল্যায়ণ নিচে দেওয়া হলো।</p>
          </div>

          {/* Results Score Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">সঠিক উত্তর</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">
                {currentExam.correctAnswers} / {currentExam.totalQuestions}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">গড় নির্ভুলতা (Accuracy)</span>
              <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 block mt-2">
                {currentExam.score}%
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">অর্জিত পড়াশোনা এক্সপি</span>
              <span className="text-3xl font-black text-yellow-600 dark:text-yellow-450 block mt-2 flex items-center justify-center gap-1">
                <Zap className="w-7 h-7 text-amber-500 dark:text-yellow-400 fill-current" />
                +{Math.max(0, (currentExam.correctAnswers || 0) * 12 + ((currentExam.score || 0) >= 80 ? 25 : 0))} XP
              </span>
            </div>

          </div>

          {/* Correct options feedback detail breakdown */}
          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">প্রশ্নের সমাধান সমূহ (Detailed Solutions):</h4>
            
            {currentExam.questions.map((q, qI) => {
              const uSelection = userSelections[qI];
              const isCorrect = uSelection === q.correctIndex;

              return (
                <div key={q.id} className={`p-5 rounded-2xl border text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950 ${
                  isCorrect ? "border-emerald-500/20" : "border-red-500/20"
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-300">প্রশ্ন {qI + 1}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isCorrect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500 dark:text-red-400"
                    }`}>
                      {isCorrect ? "সঠিক উত্তর" : "ভুল উত্তর"}
                    </span>
                  </div>
                  <p className="font-bold text-slate-805 dark:text-slate-100 mb-3">{q.questionText}</p>
                  
                  <div className="text-xs space-y-1 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850">
                    <p className="text-slate-500 dark:text-slate-400">১. তোমার উত্তর: <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-red-550 dark:text-red-400 font-medium"}>
                      {uSelection !== undefined ? q.options[uSelection] : "উত্তর দেওয়া হয়নি"}
                    </span></p>
                    <p className="text-slate-500 dark:text-slate-400">২. সঠিক উত্তর: <span className="text-emerald-600 dark:text-emerald-405 font-bold">{q.options[q.correctIndex]}</span></p>
                    
                    <div className="mt-3.5 pt-3 border-t border-slate-150 dark:border-slate-800">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">সমাধান উক্তি:</span>
                      <p className="text-xs text-slate-650 dark:text-slate-300 leading-normal">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Retake actions */}
          <button
            onClick={() => setQuizState("setup")}
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200 dark:border-slate-750 cursor-pointer"
          >
            <RotateCcw className="w-4.5 h-4.5" />
            আরেকটি নতুন কাস্টম মডেল টেস্ট দিন
          </button>

        </div>
      )}

    </div>
  );
}
