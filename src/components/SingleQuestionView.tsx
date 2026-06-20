import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import { Question } from "../types";

export default function SingleQuestionView({ id, onBack }: { id: string, onBack: () => void }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  useEffect(() => {
    const win = window as any;
    if (win.__INITIAL_QUESTION_DATA__ && win.__INITIAL_QUESTION_DATA__.id === id) {
      setQuestion(win.__INITIAL_QUESTION_DATA__);
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/db/questions`);
        if (res.ok) {
          const data = await res.json();
          const found = data.questions?.find((q: any) => q.id === id);
          if (found) setQuestion(found);
        }
      } catch (err) {
        console.error("Failed to load question", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">প্রশ্ন লোড হচ্ছে...</div>;
  }

  if (!question) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">প্রশ্নটি খুঁজে পাওয়া যায়নি</h2>
        <button onClick={onBack} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold">
          ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">ফিরে যান</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <div className="flex gap-2 items-center mb-6 flex-wrap">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">
            {question.subject || "Subject"}
          </span>
          <span className="text-slate-500 text-sm font-medium">| {question.chapter || "Chapter"}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap">
          {question.questionText}
        </h1>

        <div className="grid gap-3 mb-8">
          {question.options.map((opt, idx) => {
            let isCorrect = selectedOpt !== null && question.correctIndex === idx;
            let isWrong = selectedOpt === idx && question.correctIndex !== idx;

            return (
              <button
                key={idx}
                disabled={selectedOpt !== null}
                onClick={() => setSelectedOpt(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3
                  ${selectedOpt === null 
                    ? "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                    : isCorrect
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : isWrong
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                        : "border-slate-100 dark:border-slate-800/50 opacity-50"
                  }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5
                  ${selectedOpt === null ? "border-slate-300 dark:border-slate-600" 
                    : isCorrect ? "border-emerald-500 bg-emerald-500" 
                    : isWrong ? "border-rose-500 bg-rose-500 text-white" 
                    : "border-slate-200 dark:border-slate-700"}
                `}>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 font-medium text-slate-800 dark:text-slate-200">
                  {typeof opt === "string" ? opt : (opt as any)?.text}
                </div>
              </button>
            )
          })}
        </div>

        {selectedOpt !== null && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               সঠিক উত্তর: 
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium pl-7">
              {typeof question.options[question.correctIndex] === "string" ? question.options[question.correctIndex] : (question.options[question.correctIndex] as any)?.text}
            </p>
            
            <h4 className="font-bold text-slate-900 dark:text-white mt-4 mb-2">💡 ব্যাখ্যা:</h4>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {question.explanation || "কোনো ব্যাখ্যা পাওয়া যায়নি।"}
            </div>
          </div>
        )}

        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert(" লিংক কপি করা হয়েছে!");
          }}
          className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors"
        >
          <Copy className="w-4 h-4" /> লিংক কপি করুন
        </button>
      </div>
    </div>
  );
}
