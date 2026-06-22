import { useState, Dispatch, SetStateAction, FormEvent, useEffect } from "react";
import { StudentStats } from "../types";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowRight, GraduationCap, CalendarDays } from "lucide-react";

interface InitialSetupModalProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
}

export default function InitialSetupModal({ stats, setStats }: InitialSetupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [educationLevel, setEducationLevel] = useState("");
  const [batch, setBatch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const isDarkMode = document.documentElement.classList.contains("dark");

  useEffect(() => {
    // If user is authenticated (not guest) and missing critically required fields
    if (!stats.isGuest && stats.uid && (!stats.educationLevel || !stats.batch)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [stats]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!educationLevel || !batch) {
      setErrorText("দয়া করে ব্যাচ এবং শিক্ষাস্তর উভয়ই নির্বাচন করো।");
      return;
    }
    
    setIsSubmitting(true);
    setErrorText("");

    try {
      if (stats.uid) {
        await updateDoc(doc(db, "students", stats.uid), {
          educationLevel,
          batch,
          classCode: educationLevel, // Fallback mapping
        });
        
        setStats((prev) => ({
          ...prev,
          educationLevel,
          batch,
          classCode: educationLevel,
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setErrorText("তথ্য সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 relative
        ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"}`}
      >
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-500/20">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              তোমার পরিচয় সেট করো
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              সঠিক লিডারবোর্ড এবং সিলেবাস ট্র্যাকিংয়ের জন্য তোমার ব্যাচ ও শিক্ষাস্তর জানা প্রয়োজন।
            </p>
          </div>

          {errorText && (
            <div className="p-3 text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-center font-bold">
              {errorText}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Education Level Selection */}
            <div className="space-y-1.5 text-left">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                কোথায় পড়াশোনা করছো?
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <GraduationCap size={16} />
                </span>
                <select 
                  required
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-300 font-medium appearance-none
                    ${isDarkMode 
                      ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                >
                  <option value="" disabled>শিক্ষাস্তর নির্বাচন করো...</option>
                  <option value="HSC">HSC (Higher Secondary)</option>
                  <option value="SSC">SSC (Secondary)</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 6">Class 6</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Batch Selection */}
            <div className="space-y-1.5 text-left">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                তোমার ব্যাচ (সংখ্যায়)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <CalendarDays size={16} />
                </span>
                <select 
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-300 font-medium appearance-none
                    ${isDarkMode 
                      ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                >
                  <option value="" disabled>ব্যাচ নির্বাচন করো...</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 mt-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-md flex items-center justify-center gap-2
                ${isSubmitting 
                  ? "bg-indigo-700 cursor-not-allowed opacity-90" 
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-600/20"}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>শুরু করা যাক</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
