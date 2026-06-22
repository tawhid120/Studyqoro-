import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, CheckCircle2, Bookmark, BadgeAlert, Palette, Eye, FileText, Check, BrainCircuit, Loader2, ChevronLeft, ChevronRight, Award, Sparkles, BookMarked
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ModernQuestionViewerProps {
  onBack: () => void;
  title: string;
  files: string[];
}

export const ModernQuestionViewer: React.FC<ModernQuestionViewerProps> = ({ onBack, title, files }) => {
  const [themeMode, setThemeMode] = useState<"slate">("slate");
  const [studyMode, setStudyMode] = useState<"study" | "exam">("study");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const limitPerPage = 25;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [jumpPageText, setJumpPageText] = useState<string>("");
  const [aiLoaders, setAiLoaders] = useState<Record<string, boolean>>({});
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  
  const [shareToastText, setShareToastText] = useState<string | null>(null);
  const [savedQuestions, setSavedQuestions] = useState<string[]>([]);

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage, files]);

  const fetchQuestions = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("page", pageNum.toString());
      qs.set("limit", limitPerPage.toString());
      files.forEach((f) => qs.append("files", f));
      
      const response = await fetch(`/api/questions/fetch?${qs.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setTotalQuestions(data.total || 0);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.warn("Failed fetching questions:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string) => {
    setShareToastText(text);
    setTimeout(() => {
      setShareToastText(null);
    }, 2500);
  };

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    const question = questions[qIdx];
    if (userAnswers[question.id] !== undefined) return; 

    setUserAnswers(prev => ({
      ...prev,
      [question.id]: oIdx
    }));

    setRevealedSolutions(prev => ({
      ...prev,
      [question.id]: true
    }));

    if (studyMode === "study") {
      resolveAiExplanation(question);
    }
  };

  const resolveAiExplanation = async (question: any) => {
    if (aiExplanations[question.id]) return;

    setAiLoaders(prev => ({ ...prev, [question.id]: true }));
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: `নিম্নোক্ত বহুনির্বাচনি প্রশ্নটির সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা দিন। প্রশ্ন: ${question.questionText}\nঅপশনসমূহ: ${question.options.join(", ")}` }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanations(prev => ({ ...prev, [question.id]: data.text }));
      } else {
        throw new Error("API Failure");
      }
    } catch (e) {
      setAiExplanations(prev => ({
        ...prev,
        [question.id]: `সঠিক উত্তর হলো অপশন নম্বর ${toBnDigit(question.correctIndex + 1)}। বিস্তারিত ব্যাখ্যার জন্য আপনার শিক্ষক বা পাঠ্যবই অনুসরণ করুন।`
      }));
    } finally {
      setAiLoaders(prev => ({ ...prev, [question.id]: false }));
    }
  };

  const toggleRevealSolution = (qId: string, question: any) => {
    const isNowRevealed = !revealedSolutions[qId];
    setRevealedSolutions(prev => ({
      ...prev,
      [qId]: isNowRevealed
    }));
    if (isNowRevealed) {
      resolveAiExplanation(question);
    }
  };

  const handlePageJump = () => {
    const totalPages = Math.ceil(totalQuestions / limitPerPage);
    const rawVal = parseInt(jumpPageText);
    if (!isNaN(rawVal) && rawVal >= 1 && rawVal <= totalPages) {
      setCurrentPage(rawVal);
      setJumpPageText("");
      showToast(`পৃষ্ঠা নং ${toBnDigit(rawVal)} এ চলে যাওয়া হয়েছে`);
    } else {
      showToast("সঠিক পৃষ্ঠা সংখ্যা ১ ও " + toBnDigit(totalPages) + " এর মধ্যে লিখুন");
    }
  };

  const toggleBookmark = (qId: string) => {
    if (savedQuestions.includes(qId)) {
      setSavedQuestions(prev => prev.filter(id => id !== qId));
      showToast("প্রশ্ন সংরক্ষণ তালিকা থেকে বাদ দেওয়া হয়েছে");
    } else {
      setSavedQuestions(prev => [...prev, qId]);
      showToast("বুকমার্কে প্রশ্ন চিরস্থায়ী সংরক্ষিত হয়েছে! 💾");
    }
  };

  const toBnDigit = (num: number | string): string => {
    const digs: Record<string, string> = {
      "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
      "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    return String(num).split("").map(char => digs[char] || char).join("");
  };

  const answeredCountOnPage = questions.filter(q => userAnswers[q.id] !== undefined).length;
  const correctCountOnPage = questions.filter(q => userAnswers[q.id] === q.correctIndex).length;
  const pageAccuracy = answeredCountOnPage > 0 ? Math.round((correctCountOnPage / answeredCountOnPage) * 100) : 0;
  const totalPages = Math.ceil(totalQuestions / limitPerPage);

  const displayedQuestions = questions.filter(q => {
    const qText = q.questionText || "";
    const qSource = Array.isArray(q.source) ? q.source.join(", ") : (q.source || "");
    return qText.toLowerCase().includes(searchQuery.toLowerCase()) || 
           qSource.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col relative w-full text-zinc-800 dark:text-zinc-200 bg-gradient-to-tr from-[#f8fafc] via-[#f1f5f9] to-[#f8fafc] dark:from-zinc-950 dark:via-slate-900/20 dark:to-zinc-950">
      {shareToastText && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 dark:bg-zinc-850/95 text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-2xl shadow-2xl border border-[#0c8a4d]/20 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareToastText}</span>
        </div>
      )}

      <div className="bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/60 dark:border-zinc-800/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-2.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <BookMarked className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0c8a4d] dark:text-[#22c55e]">
                DIGITAL TEST PAPER
              </span>
            </div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mt-1">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-black flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-6">
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Eye className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="প্রশ্ন খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-250 dark:border-zinc-700 dark:bg-zinc-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c8a4d]/50"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-4 w-full md:w-auto justify-end">
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest text-nowrap">
              পদ্ধতি :
            </span>
            <button 
              onClick={() => { setStudyMode("study"); showToast("অধ্যয়ন মোড সক্রিয়"); }}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${studyMode === "study" ? "bg-emerald-500/10 text-[#0c8a4d] border border-emerald-500/35" : "hover:bg-zinc-150 border border-transparent"}`}
            >
              অধ্যয়ন মোড
            </button>
            <button 
              onClick={() => { setStudyMode("exam"); showToast("পরীক্ষা মোড সক্রিয়"); }}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${studyMode === "exam" ? "bg-rose-500/10 text-rose-600 border border-rose-500/30" : "hover:bg-zinc-150 border border-transparent"}`}
            >
              পরীক্ষা মোড
            </button>
          </div>
        </div>

        {answeredCountOnPage > 0 && (
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400 animate-spin" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">পারফরম্যান্স</p>
                <p className="text-xs font-medium text-zinc-200 mt-1">গড় সঠিকতা ইনডেক্স:</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase">শতাংশ</span>
                <span className="text-lg font-black text-yellow-400 tabular-nums">{toBnDigit(pageAccuracy)}%</span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center gap-4 py-32">
            <Loader2 className="w-12 h-12 text-[#0c8a4d] animate-spin" />
            <p className="text-sm font-bold text-[#0c8a4d]">প্রশ্ন লোড করা হচ্ছে...</p>
          </div>
        ) : displayedQuestions.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700 p-12 text-center flex flex-col items-center gap-3">
            <BadgeAlert className="w-12 h-12 text-zinc-400" />
            <h3 className="text-base font-extrabold">কোনো প্রশ্ন পাওয়া যায়নি!</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedQuestions.map((q, qIdx) => {
              const isConfirmed = userAnswers[q.id] !== undefined;
              const chosenOption = userAnswers[q.id];
              const actualCorrectIdx = q.correctIndex;
              const isSolutionOpen = !!revealedSolutions[q.id];

              return (
                <div key={q.id} className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${isConfirmed ? (chosenOption === actualCorrectIdx ? "bg-emerald-500" : "bg-red-500") : "bg-zinc-200 dark:bg-zinc-700"}`} />
                  
                  <div className="flex justify-between items-start gap-4 mb-4 pl-2">
                    <div>
                      <span className="text-base font-extrabold text-[#0c8a4d]/80 mr-1.5">{toBnDigit((currentPage - 1) * limitPerPage + qIdx + 1)}.</span>
                      <h3 className="inline text-base sm:text-md font-black text-zinc-950 dark:text-white"><span className="inline"><ReactMarkdown>{q.questionText}</ReactMarkdown></span></h3>
                    </div>
                    <button onClick={() => toggleBookmark(q.id)} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500 transition-colors shrink-0 border border-zinc-200/50">
                      <Bookmark className={`w-4 h-4 ${savedQuestions.includes(q.id) ? "fill-emerald-500 text-emerald-500" : ""}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                    {q.options.map((opt: string, oIdx: number) => {
                      const isOptCorrect = oIdx === actualCorrectIdx;
                      const isOptSelected = chosenOption === oIdx;
                      
                      let cardStyle = "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-800 dark:text-zinc-200";
                      if (isConfirmed) {
                        if (isOptCorrect) cardStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 font-bold border-2";
                        else if (isOptSelected) cardStyle = "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-900 border-2";
                        else cardStyle = "opacity-50 border-zinc-200";
                      }

                      return (
                        <button key={oIdx} disabled={isConfirmed} onClick={() => handleOptionSelect(qIdx, oIdx)} className={`p-4 rounded-2xl border text-left text-sm flex items-center justify-between gap-3 font-semibold transition-all ${cardStyle}`}>
                           <div className="flex items-center gap-3">
                             <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${isConfirmed && isOptCorrect ? 'bg-emerald-500 text-white' : isConfirmed && isOptSelected ? 'bg-red-500 text-white' : 'bg-white dark:bg-zinc-700'}`}>
                               {["ক", "খ", "গ", "ঘ"][oIdx] || String.fromCharCode(65 + oIdx)}
                             </span>
                             <ReactMarkdown>{opt}</ReactMarkdown>
                           </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 pl-2">
                    <button onClick={() => toggleRevealSolution(q.id, q)} className="text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors bg-[#0c8a4d]/10 text-[#0c8a4d] hover:bg-[#0c8a4d]/20 dark:text-emerald-400">
                      <BrainCircuit className="w-4 h-4" />
                      <span>{isSolutionOpen ? "ব্যাখ্যা বন্ধ করুন" : "উত্তর ও ব্যাখ্যা দেখুন"}</span>
                    </button>
                  </div>

                  {isSolutionOpen && (
                    <div className="mt-4 p-5 rounded-2xl text-left text-sm space-y-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1.5 border-b pb-2 text-emerald-600 font-bold">
                         <CheckCircle2 className="w-4 h-4" /> <span>সঠিক উত্তর: <span className="inline"><ReactMarkdown>{q.options[actualCorrectIdx]}</ReactMarkdown></span></span>
                      </div>
                      {aiLoaders[q.id] ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-xs"><Loader2 className="w-4 h-4 animate-spin" /> জেমিনি এআই সমাধান খুঁজছে...</div>
                      ) : (
                        <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm"><ReactMarkdown>{aiExplanations[q.id] || q.explanation}</ReactMarkdown></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && totalQuestions > 0 && (
          <div className="mt-10 py-6 border-t border-zinc-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-xl text-xs font-black uppercase flex items-center gap-1 bg-white hover:bg-zinc-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <div className="text-xs font-bold text-zinc-500">
              পৃষ্ঠা {toBnDigit(currentPage)} / {toBnDigit(totalPages)}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-xl text-xs font-black uppercase flex items-center gap-1 bg-white hover:bg-zinc-50 disabled:opacity-50">
               Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
