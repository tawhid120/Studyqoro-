/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  Tv, 
  Camera, 
  Download, 
  Printer, 
  Sliders, 
  BookOpen, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  User, 
  Clock, 
  Eye, 
  Trash2,
  BookmarkCheck,
  Calendar,
  Lock,
  Award,
  Maximize2
} from "lucide-react";
import { Question } from "../types";

interface TeacherCornerProps {
  initialSubTab?: string;
  onBackToDashboard?: () => void;
}

export default function TeacherCorner({ 
  initialSubTab = "overview",
  onBackToDashboard
}: TeacherCornerProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Auto Question Maker state
  const [instName, setInstName] = useState<string>("আদর্শ ক্যাডেট কলেজ ও উচ্চ বিদ্যালয়");
  const [examName, setExamName] = useState<string>("এইচএসসি নির্বাচনী ও প্রাক-নির্বাচনী যাচাই পরীক্ষা ২০২৬");
  const [selectedSubject, setSelectedSubject] = useState<string>("biology_1st");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [difficulty, setDifficulty] = useState<string>("balanced");
  const [includeExplainer, setIncludeExplainer] = useState<boolean>(true);
  const [generatedPaper, setGeneratedPaper] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Manual Question state
  const [manualTitle, setManualTitle] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0);
  const [manualExplanation, setManualExplanation] = useState("");
  const [manualTag, setManualTag] = useState("কোষ ও এর গঠন");
  const [manualDifficulty, setManualDifficulty] = useState("medium");
  const [createdQuestions, setCreatedQuestions] = useState<any[]>([
    {
      id: "mq1",
      question: "নিচের কোন অঙ্গাণুটি কোষে প্রোটিন সংশ্লেষণে সক্রিয়ভাবে অংশগ্রহণ করে?",
      options: ["ক্লোরোপ্লাস্ট", "মাইটোকন্ড্রিয়া", "রাইবোসোম", "লাইসোসোম"],
      correctIndex: 2,
      explanation: "রাইবোসোম কোষে প্রোটিন তৈরির কারখানা (Protein Factory) হিসেবে পরিচিত এবং প্রোটিন সংশ্লেষণ করে থাকে।",
      topic: "কোষ ও এর গঠন",
      difficulty: "easy"
    },
    {
      id: "mq2",
      question: "ডিএনএ (DNA) অণুর ডাবল হেলিক্স কাঠামোর আবিষ্কারক কারা?",
      options: ["রবার্ট হুক ও রবার্ট ব্রাউন", "ওয়াটসন ও ক্রিক", "গ্রেগর জোহান মেন্ডেল", "সিঙ্গার ও নিকলসন"],
      correctIndex: 1,
      explanation: "১৯৫৩ সালে জেমস ওয়াটসন এবং ফ্রান্সিস ক্রিক ডিএনএ অণুর ডাবল হেলিক্স মডেল প্রস্তাব করেন যার জন্য তাঁরা নোবেল পুরস্কার পান।",
      topic: "ডিএনএ রাসায়নিক গঠন",
      difficulty: "easy"
    }
  ]);

  // Sheets Builder state
  const [sheetSubject, setSheetSubject] = useState("জীববিজ্ঞান");
  const [sheetTopic, setSheetTopic] = useState("সালোকসংশ্লেষণ ও শ্বসন (HSC Exclusive Summary)");
  const [sheetRows, setSheetRows] = useState<any[]>([
    { title: "আলোক নিরপেক্ষ পর্যায় (C3 চক্র / ক্যালভিন চক্র)", details: "প্রথম স্থায়ী পদার্থ ৩-ফসফোগ্লিসারিক এসিড (৩-PGA)। এনজাইম হিসেবে কাজ করে রুবিস্কো (Rubisco)।" },
    { title: "আলোক নিরপেক্ষ পর্যায় (C4 চক্র / হ্যাচ ও স্ল্যাক চক্র)", details: "প্রথম স্থায়ী কার্বন যৌগ ৪-কার্বন বিশিষ্ট অক্সালোএসিটিক এসিড। ভুট্টা, আখ ইত্যাদিতে ঘটে।" },
    { title: "চক্রীয় ফটোফসফোরাইলেশন", details: "কেবলমাত্র ATP উৎপন্ন হয়, NADPH+H+ উৎপন্ন হয় না। ফটোসিস্টেম-১ (PS-I) জড়িত।" },
    { title: "অচক্রীয় ফটোফসফোরাইলেশন", details: "ফটোসিস্টেম-১ ও ফটোসিস্টেম-২ উভয়ই জড়িত। ATP, NADPH+H+ এবং অক্সিজেন তৈরি হয়।" }
  ]);
  const [newSheetTitle, setNewSheetTitle] = useState("");
  const [newSheetDetail, setNewSheetDetail] = useState("");

  // Suggestions state
  const [suggestClass, setSuggestClass] = useState("HSC 2026");
  const [suggestSubject, setSuggestSubject] = useState("পদার্থবিজ্ঞান ১ম পত্র");
  const [suggestedChapters, setSuggestedChapters] = useState<any[]>([
    { chapter: "ভেক্টর (Chapter 2)", importance: "৯৯%", questions: ["ত্রিমাত্রিক স্থানাঙ্ক ব্যাবস্থায় ভেক্টরের লব্ধি নির্ণয়", "নৌকা ও নদীর অতিক্রান্ত দূরত্ব ও ন্যূনতম সময়", "ডট ও ক্রস গুণন এবং সামান্তরিকের ক্ষেত্রফল"] },
    { chapter: "পর্যায়বৃত্ত গতি (Chapter 8)", importance: "৯৫%", questions: ["সরল দোলকের কম্পাঙ্ক ও বিভিন্ন অবস্থানে বিভবশক্তি", "সেকেন্ড দোলকের দৈর্ঘ্য পাহাড়ের চূড়ায় পরিবর্তন", "দোলনকাল ও অভিকর্ষজ ত্বরণের সম্পর্ক"] },
    { chapter: "নিউটনীয় বলবিদ্যা (Chapter 4)", importance: "৯২%", questions: ["রাস্তার ব্যাংকিং কোণ নির্ণয় ও সর্বোচ্চ নিরাপদ বেগ", "কৌণিক ভরবেগ ও জড়তার ভ্রামক সংরক্ষণশীল নীতি", "ঘর্ষণ বলের প্রভাবে গতিশীল বস্তুর ত্বরণ"] },
    { chapter: "কাজ, শক্তি ও ক্ষমতা (Chapter 5)", importance: "৯০%", questions: ["কুয়া খালি করার ক্ষেত্রে পাম্পের কর্মদক্ষতা ও কৃতকাজ", "সংরক্ষণশীল ও অসংরক্ষণশীল বলের গাণিতিক ব্যাখ্যা", "গতিশক্তি ও ভরবেগের মাঝে সম্পর্ক প্রতিপাদন"] }
  ]);

  // Live Online Exams state
  const [exams, setExams] = useState<any[]>([
    { id: "ex1", examTitle: "জীববিজ্ঞান ১ম পত্র: কোষ রসায়ন স্পেশাল মক", date: "২০২৬-০৬-১৫", time: "সন্ধ্যা ৮:০০", duration: "৩০ মিনিট", totalMarks: 30, passcode: "BIO26" },
    { id: "ex2", examTitle: "রসায়ন ২য় পত্র: জৈব রসায়ন প্রস্তুতি হাইপ", date: "২০২৬-০৬-১৮", time: "বিকাল ৪:৩০", duration: "৪৫ মিনিট", totalMarks: 50, passcode: "CHEM26" }
  ]);
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamDate, setNewExamDate] = useState("২০২৬-০৬-২০");
  const [newExamTime, setNewExamTime] = useState("সন্ধ্যা ৭:৩০");
  const [newExamDuration, setNewExamDuration] = useState("৩০ মিনিট");
  const [newExamMarks, setNewExamMarks] = useState(30);
  const [newExamPass, setNewExamPass] = useState("");

  // OMR Scanner Simulator states
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [omrAnswers, setOmrAnswers] = useState<any[]>([
    { q: 1, correct: "C", student: "C", status: "correct" },
    { q: 2, correct: "B", student: "B", status: "correct" },
    { q: 3, correct: "D", student: "A", status: "incorrect" },
    { q: 4, correct: "A", student: "A", status: "correct" },
    { q: 5, correct: "C", student: "B", status: "incorrect" },
    { q: 6, correct: "C", student: "C", status: "correct" },
    { q: 7, correct: "B", student: "B", status: "correct" },
    { q: 8, correct: "D", student: "D", status: "correct" },
    { q: 9, correct: "A", student: "A", status: "correct" },
    { q: 10, correct: "B", student: "C", status: "incorrect" },
    { q: 11, correct: "D", student: "D", status: "correct" },
    { q: 12, correct: "C", student: "C", status: "correct" },
    { q: 13, correct: "A", student: "A", status: "correct" },
    { q: 14, correct: "B", student: "B", status: "correct" },
    { q: 15, correct: "C", student: "D", status: "incorrect" }
  ]);
  const [omrThreshold, setOmrThreshold] = useState<number>(85);
  const [omrStudentName, setOmrStudentName] = useState<string>("সাকিব আল হাসান");
  const [omrRollNo, setOmrRollNo] = useState<string>("১০৫৭২২");

  // Subject chapters helpers
  const subjectsList = [
    { id: "biology_1st", name: "জীববিজ্ঞান ১ম পত্র" },
    { id: "biology_2nd", name: "জীববিজ্ঞান ২য় পত্র" },
    { id: "chemistry_1st", name: "রসায়ন ১ম পত্র" },
    { id: "math_1st", name: "উচ্চতর গণিত ১ম পত্র" },
    { id: "physics_1st", name: "পদার্থবিজ্ঞান ১ম পত্র" }
  ];

  // Dummy generation logic
  const handleAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Mock generated bank questions matching selected criteria
      const subjectNamesMap: { [key: string]: string } = {
        biology_1st: "জীববিজ্ঞান ১ম পত্র",
        biology_2nd: "জীববিজ্ঞান ২য় পত্র",
        chemistry_1st: "রসায়ন ১ম পত্র",
        math_1st: "উচ্চতর গণিত ১ম পত্র",
        physics_1st: "পদার্থবিজ্ঞান ১ম পত্র"
      };

      const mockBank = [
        {
          question: "উদ্ভিদের কোন অঙ্গে সালোকসংশ্লেষণ প্রক্রিয়াটি ঘটে?",
          options: ["মূল", "সবুজ পাতা (মেসোফিল কলা)", "কাণ্ড", "পুষ্পদণ্ড"],
          correctIndex: 1,
          explanation: "ক্লোরোপ্লাস্ট সমৃদ্ধ সবুজ পাতার মেসোফিল টিস্যু সালোকসংশ্লেষণের প্রধান স্থান।"
        },
        {
          question: "পানি নিষ্কাশনের জন্য পত্ররন্ধ্রের বিশেষ ছিদ্রপথকে কী বলা হয়?",
          options: ["লেন্টিসেল", "স্টোমাটা", "হাইডাথোড (Hydathode)", "কিউটিকল"],
          correctIndex: 2,
          explanation: "হাইডাথোড বা পানিপত্ররন্ধ্র দিয়ে তরল আকারে পানি বের হয়ে আসাকে গাটেশন বা সিকিউরিটি রন্ধ্র নিঃসরণ বলে।"
        },
        {
          question: "জিন ক্লোনিং এর ক্ষেত্রে বাহক হিসেবে সর্বাধিক ব্যবহৃত প্লাজমিড কোনটি?",
          options: ["Ti Plasmid", "ColE1 Plasmid", "pBR322", "pUC19"],
          correctIndex: 2,
          explanation: "pBR322 কৃত্রিম উপায়ে তৈরিকৃত প্রথম প্লাজমিড ক্লোনিং ভেক্টর যা জিন প্রকৌশলে অত্যন্ত সমাদৃত।"
        },
        {
          question: "ভাইরাসের নিষ্ক্রিয় ও সম্পূর্ণ সংক্রামক কণিকাকে কী বলা হয়?",
          options: ["ক্যাপসিড", "ভিরিয়ন", "ভিরয়েড", "প্রিয়ন"],
          correctIndex: 1,
          explanation: "সম্পূর্ণ সংক্রামক ভাইরাস কণিকাকে ভিরিয়ন (Virion) বলে।"
        },
        {
          question: "প্রাণীদেহের সরলতম এবং দ্বিপার্শ্বীয় প্রতিসাম্য পর্ব কোনটি?",
          options: ["পরিফেরা", "প্লাটিহেলমিনথিস", "নিডারিয়া", "অ্যানেলিডা"],
          correctIndex: 1,
          explanation: "প্লাটিহেলমিনথিস পর্বের প্রাণীরা চ্যাপ্টা কৃমি ও দ্বিপার্শ্বীয় প্রতিসম অঙ্গ ধারণকারী।"
        }
      ];

      // Replicate up to required count
      const paper: any[] = [];
      for (let i = 0; i < questionCount; i++) {
        const template = mockBank[i % mockBank.length];
        paper.push({
          id: `qp_${i + 1}`,
          question: `${i + 1}. ${template.question}`,
          options: [...template.options],
          correctIndex: template.correctIndex,
          explanation: template.explanation
        });
      }
      setGeneratedPaper(paper);
      setIsGenerating(false);
    }, 1200);
  };

  // Add custom manual question
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !optA || !optB || !optC || !optD) return;
    
    const newQ = {
      id: `mq_${Date.now()}`,
      question: manualTitle,
      options: [optA, optB, optC, optD],
      correctIndex: correctIdx,
      explanation: manualExplanation,
      topic: manualTag,
      difficulty: manualDifficulty
    };

    setCreatedQuestions([newQ, ...createdQuestions]);
    // Clear Form
    setManualTitle("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setManualExplanation("");
  };

  // Simulated Camera / upload scan
  const handleSimulatedScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Set randomized score
      const randomized = omrAnswers.map(ans => {
        const isCorrect = Math.random() > 0.15; // 85% correct chance
        return {
          ...ans,
          student: isCorrect ? ans.correct : ["A", "B", "C", "D"].find(c => c !== ans.correct),
          status: isCorrect ? "correct" : "incorrect"
        };
      });

      const studentNameList = ["আরিফুর রহমান", "মো: জোবায়ের হোসেন", "নুসরাত সুলতানা", "ফাহমিদা আক্তার", "সাকিব আল হাসান"];
      const rollList = ["১০৫৭২২", "১০৫৮১৪", "১১২৪০১", "১৪২৮৯০", "১৫০০৪২"];
      
      setOmrStudentName(studentNameList[Math.floor(Math.random() * studentNameList.length)]);
      setOmrRollNo(rollList[Math.floor(Math.random() * rollList.length)]);
      setOmrAnswers(randomized);
      setScannedImage("Scanned_OMR_Sheet_Verified");
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-250/60 dark:border-slate-800/80 p-4 sm:p-6 w-full animate-fadeIn">
      {/* 1. Header with dynamic tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#00be90] bg-[#00da66]/10 px-2.5 py-1 rounded-md mb-2 inline-block">
            টিচার কর্ণার 🏫
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            টিচারস ক্রিয়েটিভ টুলকিট
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            শ্রেণীকক্ষের মূল্যায়ন, স্বয়ংক্রিয় প্রশ্নপত্র মুদ্রণ ও উত্তরপত্র ডিজিটালাইজেশন পোর্টাল
          </p>
        </div>

        {onBackToDashboard && (
          <button 
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all font-bold text-xs"
          >
            ড্যাশবোর্ডে ফিরুন
          </button>
        )}
      </div>

      {/* 2. Horizontal Subnavigation Menu tab switcher */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-slate-150 dark:border-slate-900/60 font-bengali">
        {[
          { id: "overview", label: "প্যানেল ড্যাশবোর্ড", icon: BookOpen },
          { id: "auto_question", label: "অটোপ্রশ্ন তৈরি", icon: Sliders },
          { id: "question_create", label: "প্রশ্ন তৈরি", icon: PlusCircle },
          { id: "sheet_create", label: "শীট তৈরি", icon: Layers },
          { id: "suggestion_create", label: "সাজেশন তৈরি", icon: Sparkles },
          { id: "online_exam", label: "অনলাইন পরীক্ষা তৈরি", icon: Tv },
          { id: "omr_checker", label: "OMR চেকার", icon: Camera }
        ].map((subTab) => {
          const Icon = subTab.icon;
          const isSelected = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => {
                setActiveSubTab(subTab.id);
                setGeneratedPaper(null);
                setScannedImage(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap scroll-mx-4 ${
                isSelected 
                  ? "bg-[#059669] text-white shadow-md shadow-emerald-500/10 scale-102" 
                  : "bg-white dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Panel content display based on active sub-tab */}
      <div className="min-h-[400px]">
        
        {/* ================= TEACHER PANEL MAIN DASHBOARD / OVERVIEW ================= */}
        {activeSubTab === "overview" && (
          <div className="space-y-6 animate-fadeIn font-bengali">
            {/* Elegant Welcome Banner Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    স্বাগতম টিচার্স অ্যাডমিন প্যানেলে! 🏫
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    এখানে আপনি পাবেন অটোপদ্ধতিতে পরীক্ষার প্রশ্ন তৈরি, কাস্টম সাজেশন প্রিপারেশন, অনলাইন লাইভ এক্সাম সেটআপ এবং ওএমআর শীট স্ক্যানারের মতো চমৎকার সব একাডেমি টুলস। যেকোনো একটি টুল বাছাই করে আজই আপনার ক্লাসরুম মূল্যায়ন প্রক্রিয়াকে করুন সম্পূর্ণ ডিজিটাল ও স্মার্ট!
                  </p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-400/20 text-center text-emerald-600 dark:text-[#00be90] font-black shrink-0">
                  <div className="text-[10px] uppercase tracking-wider opacity-80 flex justify-center">টুলকিট স্ট্যাটাস</div>
                  <div className="text-sm mt-0.5">৬টি ফিচার সক্রিয় 🟢</div>
                </div>
              </div>
            </div>

            {/* Hub Bento Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  id: "auto_question",
                  title: "স্বয়ংক্রিয় প্রশ্নপত্র (Auto Exam Generator)",
                  desc: "ইনস্ট্যান্টভাবে অধ্যায়ভিত্তিক MCQ পরীক্ষার প্রশ্নপত্র হেডার ও উত্তরমালা প্রিন্ট রেডি করুন মাত্র কয়েক ক্লিকে।",
                  tag: "AI ভিত্তিক ⚡",
                  icon: Sliders,
                  color: "from-emerald-500/10 dark:from-emerald-950/40 border-emerald-500/20",
                  iconColor: "text-emerald-500 bg-emerald-500/10"
                },
                {
                  id: "question_create",
                  title: "কাস্টম প্রশ্ন ব্যাংক (Manual Studio)",
                  desc: "আপনার নিজস্ব ইউনিক প্রশ্নমালা টাইপ ও ব্যাখ্যাসহ কাস্টম রিপোজিটরি হিসেবে সংরক্ষণ ও এডিট করে রাখুন অত্যন্ত কাস্টমাইজড উপায়ে।",
                  tag: "কাস্টম রিপো ও লাইভ প্রিভিউ 💾",
                  icon: PlusCircle,
                  color: "from-violet-500/10 dark:from-violet-955/40 border-violet-500/20",
                  iconColor: "text-violet-500 bg-violet-500/10"
                },
                {
                  id: "sheet_create",
                  title: "লেকচার ও শীট মেকার (PDF Sheets Builder)",
                  desc: "শিক্ষার্থীদের সহজে রিভিশনের জন্য পরিচ্ছন্ন ও হাই-কোয়ালিটি গাইডেন্স পত্র, সুত্রাবলির লেকচার নোট শীট ও মডিউল তৈরি করুন।",
                  tag: "ডাউনলোড ও প্রিন্ট রেডি 🖨️",
                  icon: Layers,
                  color: "from-amber-500/10 dark:from-amber-955/40 border-amber-500/20",
                  iconColor: "text-amber-500 bg-amber-500/10"
                },
                {
                  id: "suggestion_create",
                  title: "সাজেশন ক্রিয়েটর (Smart Suggestions Creator)",
                  desc: "বিগত বছরের বোর্ড প্রশ্ন চুলচেরা বিশ্লেষণ করে পরীক্ষার জন্য গুরুত্বপূর্ণ টপিক ও প্রশ্ন নিয়ে ১০০% কার্যকর স্পেশাল সাজেশন শীট সাজান।",
                  tag: "পরীক্ষা সহায়ক ও সাকসেস বুস্টার 🎯",
                  icon: Sparkles,
                  color: "from-sky-500/10 dark:from-sky-955/40 border-sky-500/20",
                  iconColor: "text-sky-500 bg-sky-500/10"
                },
                {
                  id: "online_exam",
                  title: "অনলাইন লাইভ এক্সাম (Live Online Exam Portal)",
                  desc: "আপনার নিজস্ব রিয়েল-টাইম মূল্যায়ন মক টেস্ট রুম এবং এক্সক্লুসিভ পাসকোড লকড অনলাইন পরীক্ষা সম্পন্ন করে ফলাফল সংরক্ষণ করুন।",
                  tag: "ডিজিটাল ক্লাসরুম ট্র্যাকার 🌐",
                  icon: Tv,
                  color: "from-rose-500/10 dark:from-rose-955/40 border-rose-500/20",
                  iconColor: "text-rose-500 bg-rose-500/10"
                },
                {
                  id: "omr_checker",
                  title: "ওএমআর চেকার ও স্ক্যানার (OMR Evaluator)",
                  desc: "ক্যামেরা বা আপলোড অপশন ব্যবহার করে অত্যন্ত কার্যকারী উপায়ে শত শত শিক্ষার্থীর উত্তরপত্র স্বয়ংক্রিয় দ্রুত স্ক্যান পূর্বক গ্রেডিং করুন।",
                  tag: "ইনস্ট্যান্ট গ্রেডিং ও মার্কশিট 📊",
                  icon: Camera,
                  color: "from-teal-500/10 dark:from-teal-955/40 border-teal-500/20",
                  iconColor: "text-teal-500 bg-teal-500/10"
                }
              ].map((card) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      setActiveSubTab(card.id);
                      setGeneratedPaper(null);
                      setScannedImage(null);
                    }}
                    className={`group p-5 bg-gradient-to-b ${card.color} dark:bg-slate-900 border hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl flex flex-col justify-between gap-5 cursor-pointer`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2.5">
                        <div className={`p-2.5 rounded-xl ${card.iconColor} group-hover:scale-110 transition-transform`}>
                          <CardIcon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {card.tag}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-805/60 flex items-center justify-between text-[11px] font-black text-slate-450 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      <span>টুলটি স্টার্ট করুন</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= AUTO QUESTION MAKER ================= */}
        {activeSubTab === "auto_question" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                <span>প্রশ্ন সাজানোর প্যারামিটার</span>
              </h3>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">শিক্ষা প্রতিষ্ঠানের নাম</label>
                <input 
                  type="text" 
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                  placeholder="যেমন: মতিঝিল আইডিয়াল স্কুল"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">পরীক্ষার নাম/শিরোনাম</label>
                <input 
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                  placeholder="যেমন: অর্ধবার্ষিক পরীক্ষা"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">বিষয় নির্বাচন করুন</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                >
                  {subjectsList.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">অধ্যায়</label>
                <select 
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                >
                  <option value="all">সকল অধ্যায় মিলিয়ে</option>
                  <option value="ch1">অধ্যায় ১ - কোষ ও এর রাসায়নিক গঠন</option>
                  <option value="ch2">অধ্যায় ২ - কোষ বিভাজন</option>
                  <option value="ch3">অধ্যায় ৩ - শল্য ও শরীরতত্ত্ব</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">প্রশ্নের সংখ্যা</label>
                  <select 
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                  >
                    <option value={10}>১০টি</option>
                    <option value={20}>২০টি</option>
                    <option value={25}>২৫টি</option>
                    <option value={50}>৫০টি</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">কাঠিন্যতা স্তর</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                  >
                    <option value="easy">সহজ প্রশ্ন</option>
                    <option value="balanced">ভারসাম্যপূর্ণ (Balanced)</option>
                    <option value="hard">কঠিন প্রশ্ন</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="inc-explain"
                  checked={includeExplainer}
                  onChange={(e) => setIncludeExplainer(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="inc-explain" className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">প্রশ্নের নিচে সমাধান শীট প্রিন্ট করুন</label>
              </div>

              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="w-full mt-2 py-3 bg-[#059669] hover:bg-emerald-600 disabled:bg-emerald-600/50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>প্রশ্ন সেট জেনারেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>প্রশ্নপত্র জেনারেট করুন ⚡</span>
                  </>
                )}
              </button>
            </div>

            <div className="col-span-1 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl min-h-[450px] flex flex-col items-center justify-center relative">
              <AnimatePresence mode="wait">
                {!generatedPaper && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center max-w-sm px-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 inline-flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-1">কোনো প্রশ্নপত্র জেনারেট করা হয়নি</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      বামে প্রয়োজনীয় প্যারামিটার সিলেক্ট করুন এবং "প্রশ্নপত্র জেনারেট করুন" বাটনে ক্লিক করে সাথে সাথে পূর্ণাঙ্গ প্রিন্ট করার যোগ্য প্রশ্নপত্র সেট সম্পন্ন করুন।
                    </p>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#00be90] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                      <div className="absolute inset-4.5 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">AI ও ডাটাবেস সমন্বয় হচ্ছে</h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      সিলেক্টেড অধ্যায় থেকে উচ্চমানের স্ট্যান্ডার্ড প্রশ্নসমূহ সংগ্রহ পূর্বক প্রশ্নের বিন্যাস ও কাস্টম হেডার কনফিগার করা হচ্ছে...
                    </p>
                  </motion.div>
                )}

                {generatedPaper && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col h-full"
                  >
                    {/* Operations toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4 mb-4 select-none">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase">
                        মোট {generatedPaper.length}টি MCQ প্রশ্ন তৈরি হয়েছে
                      </span>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-1 bg-[#f1f5f9] dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>প্রিন্ট করুন</span>
                        </button>
                        <button 
                          onClick={() => alert("PDF ডাউনলোড সম্পন্ন হয়েছে!")}
                          className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-emerald-500/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড করুন</span>
                        </button>
                      </div>
                    </div>

                    {/* Highly Professional Classroom Printed Exam Paper look */}
                    <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-950 shadow-sm relative text-black dark:text-slate-100 max-h-[500px] overflow-y-auto">
                      
                      {/* Institutional Heading Frame */}
                      <div className="text-center pb-4 mb-5 border-b-2 border-double border-slate-300 dark:border-slate-800">
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase leading-tight tracking-wide mb-1">
                          {instName}
                        </h2>
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                          {examName}
                        </h3>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 max-w-md mx-auto px-2 font-bold font-mono">
                          <span>বিষয়: {subjectsList.find(s => s.id === selectedSubject)?.name}</span>
                          <span>পূর্ণমান: {generatedPaper.length}</span>
                          <span>সময়: {generatedPaper.length * 1} মিনিট</span>
                        </div>
                      </div>

                      {/* Instruction strip */}
                      <p className="text-[10px] italic text-slate-500 dark:text-slate-400 mb-6 text-center select-none font-bold">
                        (বিশেষ নির্দেশনাবলী: প্রতিটি প্রশ্নের সর্বোত্তম সঠিক উত্তরের পাশে বৃত্তটি ভরাট করো। প্রতিটি সত্য উত্তরের মান ১ নম্বর।)
                      </p>

                      {/* Question loop rendered in a classy formal style */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left">
                        {generatedPaper.map((qp, idx) => (
                          <div key={qp.id} className="text-xs flex flex-col gap-1.5 border-b border-dashed border-slate-100 dark:border-slate-900/60 pb-3">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              {qp.question.replace(/^\d+\.\s*/, `${idx + 1}. `)}
                            </span>
                            <div className="grid grid-cols-2 gap-y-1 pl-4 text-slate-600 dark:text-slate-400">
                              {qp.options.map((opt: string, oIdx: number) => (
                                <span key={oIdx} className="inline-flex items-center gap-1">
                                  <span className="font-bold text-[10px] text-slate-400">
                                    ({String.fromCharCode(65 + oIdx)})
                                  </span> 
                                  <span>{opt}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Optional Interactive Explainer solutions strip at bottom of exam sheet */}
                      {includeExplainer && (
                        <div className="mt-8 pt-6 border-t border-slate-250 dark:border-slate-800 select-none">
                          <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bengali">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>আদর্শ সমাধান শীট (Answer Keys & Solutions)</span>
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {generatedPaper.map((qp, idx) => (
                              <div key={`ans_${qp.id}`} className="text-[10px] bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                                <span className="font-black text-slate-800 dark:text-slate-300">প্রশ্ন {idx + 1}: ({String.fromCharCode(65 + qp.correctIndex)} )</span>
                                <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{qp.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* ================= MANUAL QUESTION BANK STUDIO ================= */}
        {activeSubTab === "question_create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-4 tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>নতুন মানসম্মত প্রশ্ন তৈরি ফর্ম</span>
              </h3>
              
              <form onSubmit={handleAddManual} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">প্রশ্ন টাইটেল বা বর্ণনা</label>
                  <textarea 
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    required
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-slate-300 focus:outline-[#00be90]"
                    placeholder="যেমন: অবতল দর্পণের বক্রতার কেন্দ্রে কোনো বস্তু রাখলে এর প্রতিবিম্ব কেমন হবে?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">অপশন A</label>
                    <input 
                      type="text" 
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      placeholder="অপশন A লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">অপশন B</label>
                    <input 
                      type="text" 
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      placeholder="অপশন B লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">অপশন C</label>
                    <input 
                      type="text" 
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      placeholder="অপশন C লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">অপশন D</label>
                    <input 
                      type="text" 
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      placeholder="অপশন D লিখুন"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">সঠিক উত্তর অপশন</label>
                    <select 
                      value={correctIdx}
                      onChange={(e) => setCorrectIdx(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                    >
                      <option value={0}>অপশন A এবং সঠিক</option>
                      <option value={1}>অপশন B এবং সঠিক</option>
                      <option value={2}>অপশন C এবং সঠিক</option>
                      <option value={3}>অপশন D এবং সঠিক</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">কাঠিন্যতা টাইপ</label>
                    <select 
                      value={manualDifficulty}
                      onChange={(e) => setManualDifficulty(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 focus:outline-[#00be90]"
                    >
                      <option value="easy">সহজ (Easy)</option>
                      <option value="medium">মধ্যম (Medium)</option>
                      <option value="hard">কঠিন (Hard)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">অধ্যায় ট্যাগ / টপিক</label>
                  <input 
                    type="text" 
                    value={manualTag}
                    onChange={(e) => setManualTag(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                    placeholder="যেমন: আলোর প্রতিফলন"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">ব্যাখ্যা (Solution Explainer)</label>
                  <textarea 
                    value={manualExplanation}
                    onChange={(e) => setManualExplanation(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-slate-350 focus:outline-[#00be90]"
                    placeholder="শিক্ষার্থীরা যাতে সঠিক কারণ সহজে বুঝতে পারে তার যৌক্তিক ব্যাখ্যা লিখুন..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-1.5 py-3 bg-[#059669] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>তৈরিকৃত প্রশ্ন ব্যাংকে সেভ করুন</span>
                </button>
              </form>
            </div>

            <div className="col-span-1 lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-150 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-[#00be90]" />
                  <span>সংরক্ষিত কাস্টম প্রশ্ন ব্যাংক ({createdQuestions.length})</span>
                </h3>
                <span className="text-[10px] font-bold bg-[#00dda6]/10 text-emerald-600 dark:text-[#00be90] px-2 py-0.5 rounded-full">
                  লাইভ প্রিভিউ রেডি
                </span>
              </div>

              {/* Created list rendered elegantly */}
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {createdQuestions.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-955/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2.5 relative group">
                    <button 
                      onClick={() => setCreatedQuestions(createdQuestions.filter(x => x.id !== q.id))}
                      className="absolute top-3.5 right-3.5 p-1 bg-slate-200 dark:bg-slate-850 hover:bg-red-500 hover:text-white transition-all rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 cursor-pointer"
                      title="প্রশ্ন মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase text-white bg-slate-500 dark:bg-slate-700 px-2 py-0.5 rounded">
                        {q.topic}
                      </span>
                      <span className="text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                        {q.difficulty === "easy" ? "সহজ" : q.difficulty === "medium" ? "মধ্যম" : "কঠিন"}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 pr-6">
                      {q.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt: string, idx: number) => {
                        const isCorrect = idx === q.correctIndex;
                        return (
                          <div 
                            key={idx} 
                            className={`p-2 rounded-xl border flex items-center justify-between gap-1 ${
                              isCorrect 
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-450 font-extrabold" 
                                : "bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                             <span className="truncate">{String.fromCharCode(65 + idx)}. {opt}</span>
                             {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                           </div>
                         );
                       })}
                     </div>
 
                     {q.explanation && (
                       <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800 mt-1 leading-relaxed">
                         <span className="font-extrabold text-[#059669] dark:text-emerald-400">ব্যাখ্যা:</span> {q.explanation}
                       </p>
                     )}
                   </div>
                 ))}
               </div>
             </div>
 
           </div>
         )}

        {/* ================= LECTURE / STUDY LEAFLET BUILDER ================= */}
        {activeSubTab === "sheet_create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            <div className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>লেকচার ও স্টাডি শীট কাস্টমাইজেশন</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">দাখিলকৃত বিষয়</label>
                  <input 
                    type="text" 
                    value={sheetSubject}
                    onChange={(e) => setSheetSubject(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                    placeholder="যেমন: জীববিজ্ঞান ১ম পত্র"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">লেকচার শীটের প্রধান টপিক / অধ্যায়</label>
                  <input 
                    type="text" 
                    value={sheetTopic}
                    onChange={(e) => setSheetTopic(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  <span className="text-[10px] font-black text-[#059669] dark:text-emerald-450 uppercase tracking-wider block mb-2">নতুন নোট রো যোগ করুন</span>
                  
                  <div className="space-y-3">
                    <div>
                      <input 
                        type="text" 
                        value={newSheetTitle}
                        onChange={(e) => setNewSheetTitle(e.target.value)}
                        placeholder="নোট শিরোনাম (যেমন: চক্রীয় ফটোফসফোরাইলেশন)"
                        className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      />
                    </div>
                    <div>
                      <textarea 
                        value={newSheetDetail}
                        onChange={(e) => setNewSheetDetail(e.target.value)}
                        placeholder="বিস্তারিত লেকচার বা ব্যাখ্যা..."
                        rows={3}
                        className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      />
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        if (!newSheetTitle || !newSheetDetail) return;
                        setSheetRows([...sheetRows, { title: newSheetTitle, details: newSheetDetail }]);
                        setNewSheetTitle("");
                        setNewSheetDetail("");
                      }}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 text-[#059669] dark:text-emerald-450 text-[11px] font-bold rounded-xl transition-all border border-emerald-500/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>শীটে এই নোট পয়েন্টটি যুক্ত করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-150 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#00be90]" />
                    <span>জেনারেটেড স্টাডি শীট প্রিভিউ</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>প্রিন্ট</span>
                    </button>
                    <button 
                      onClick={() => alert("শীটটি PDF হিসেবে সংরক্ষণ করা হয়েছে।")}
                      className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>ডাউনলোড</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 max-h-[380px] overflow-y-auto">
                  <div className="text-center pb-3 mb-4 border-b-2 border-double border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{sheetSubject} স্পেশাল লেকচার শীট</span>
                    <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 mt-1">{sheetTopic}</h3>
                  </div>

                  <div className="space-y-4">
                    {sheetRows.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-6">কোনো নোট রো পাওয়া যায়নি। বাঁপাশের প্যানেল থেকে তৈরি করুন।</p>
                    ) : (
                      sheetRows.map((row, rIdx) => (
                        <div key={rIdx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 relative group">
                          <button 
                            onClick={() => setSheetRows(sheetRows.filter((_, i) => i !== rIdx))}
                            className="absolute top-2 right-2 p-1.5 bg-slate-50 dark:bg-slate-855 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-black text-indigo-500 mr-1">পয়েন্ট {rIdx + 1}.</span>
                          <span className="font-extrabold text-xs text-slate-850 dark:text-slate-200">{row.title}</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed pl-1.5 border-l-2 border-emerald-500/30">
                            {row.details}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-400 font-semibold font-mono text-center pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 select-none">
                💡 শিক্ষকরা এই ইন্টারেক্টিভ লেকচার শীটটি ক্লাসরুমের মাল্টিমিডিয়া স্ক্রিনে পড়াতে কিংবা সরাসরি পিডিএফ প্রিন্ট করে শিক্ষার্থীদের বিতরণ করতে পারেন।
              </div>
            </div>

          </div>
        )}

        {/* ================= HIGH SCHOOL / COLLEGE SUGGESTION BUILDER ================= */}
        {activeSubTab === "suggestion_create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            <div className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>বোর্ড ফাইনাল সাজেশন বোর্ড মেকার</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">টার্গেট পরীক্ষা / ক্লাস</label>
                  <input 
                    type="text" 
                    value={suggestClass}
                    onChange={(e) => setSuggestClass(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">পরিক্ষার মূল বিষয়</label>
                  <input 
                    type="text" 
                    value={suggestSubject}
                    onChange={(e) => setSuggestSubject(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  <span className="text-[10px] font-black text-[#059669] dark:text-emerald-450 uppercase tracking-wider block mb-2">নতুন চ্যাপ্টার কাস্টম সাজেশন যুক্ত করুন</span>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const chapter = fd.get("chapter")?.toString() || "";
                    const importance = fd.get("importance")?.toString() || "95%";
                    const questionStr = fd.get("questions")?.toString() || "";
                    if (!chapter) return;
                    
                    const questions = questionStr ? questionStr.split(",").map(q => q.trim()).filter(Boolean) : [];
                    setSuggestedChapters([...suggestedChapters, { chapter, importance, questions }]);
                    e.currentTarget.reset();
                  }} className="space-y-3">
                    <div>
                      <input 
                        name="chapter"
                        type="text" 
                        required
                        placeholder="অধ্যায় নাম (সম্পূর্ণ, যেমন: বলবিদ্যা (Chapter 4))"
                        className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      />
                    </div>
                    <div>
                      <input 
                        name="importance"
                        type="text" 
                        defaultValue="95%"
                        placeholder="গুরুত্ব পার্সেন্টেজ (যেমন: ৯৫%)"
                        className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      />
                    </div>
                    <div>
                      <textarea 
                        name="questions"
                        placeholder="টপিক বা সম্ভাব্য প্রশ্নসমূহ (কমা দিয়ে আলাদা করুন)"
                        rows={2.5}
                        className="w-full text-xs p-2 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-955/20 dark:hover:bg-emerald-900/30 text-[#059669] dark:text-emerald-450 text-[11px] font-bold rounded-xl transition-all border border-emerald-500/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>সাজেশন তালিকায় যুক্ত করুন</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-150 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#00be90]" />
                    <span>সেশন সাজেশন তালিকা ও ড্যাশবোর্ড</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>মুদ্রণ</span>
                    </button>
                    <button 
                      onClick={() => alert("সাজেশন লিস্টটি ডাউনলোড হয়েছে।")}
                      className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>সংরক্ষণ</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl relative select-none">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">
                      <span>ব্যাচ: {suggestClass}</span>
                      <span>শ্রেণী: {suggestSubject}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 text-center mt-1 uppercase">বোর্ড ফাইনাল সুপার সাজেশন চার্ট</h3>
                  </div>

                  {suggestedChapters.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-6">কোনো সাজেশনের তথ্য পাওয়া যায়নি।</p>
                  ) : (
                    suggestedChapters.map((sc, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-955/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl relative group flex flex-col gap-2">
                        <button 
                          onClick={() => setSuggestedChapters(suggestedChapters.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-red-500 hover:text-white dark:bg-slate-850 dark:hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100">{sc.chapter}</span>
                          <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                            গুরুত্ব: {sc.importance}
                          </span>
                        </div>

                        {/* Progress line representing priority */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden select-none">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" 
                            style={{ width: sc.importance.includes("%") ? sc.importance : "90%" }}
                          />
                        </div>

                        <div className="flex flex-col gap-2 pl-3 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">সবচেয়ে গুরুত্বপূর্ণ টপিকসমূহ (Board Hot Topics):</span>
                          {sc.questions.map((q, qIdx) => (
                            <div key={qIdx} className="flex items-start gap-2 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span className="text-slate-600 dark:text-slate-300 font-bold">{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold font-mono text-center pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 select-none">
                💡 শিক্ষকরা এই সাজেশন চার্টটি শিক্ষার্থীদের board প্রস্তুতির গুরুত্বপূর্ণ রূপরেখা হিসেবে সরবরাহ করতে পারবেন।
              </div>
            </div>

          </div>
        )}

        {/* ================= ONLINE LIVE EXAM SCHEDULER ================= */}
        {activeSubTab === "online_exam" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            <div className="col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00be90]" />
                <span>নতুন অনলাইন পরীক্ষা আয়োজন করুন</span>
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newExamTitle) return;
                  const newEx = {
                    id: `ex_${Date.now()}`,
                    examTitle: newExamTitle,
                    date: newExamDate,
                    time: newExamTime,
                    duration: newExamDuration,
                    totalMarks: newExamMarks,
                    passcode: newExamPass || "EXAM26"
                  };
                  setExams([newEx, ...exams]);
                  setNewExamTitle("");
                  setNewExamPass("");
                }}
                className="flex flex-col gap-3"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">পরীক্ষার শিরোনাম</label>
                  <input 
                    type="text" 
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    required
                    placeholder="যেমন: জীববিজ্ঞান অধ্যায় ১০ সাপ্তাহিক এক্সাম"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-155 dark:border-slate-855 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-[#00be90]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">তারিখ</label>
                    <input 
                      type="text" 
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 bg-slate-50 dark:bg-slate-950 text-slate-800 focus:outline-[#00be90]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">সময়</label>
                    <input 
                      type="text" 
                      value={newExamTime}
                      onChange={(e) => setNewExamTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 bg-slate-50 dark:bg-slate-950 text-slate-800 focus:outline-[#00be90]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">পরীক্ষার ডিউরেশন</label>
                    <input 
                      type="text" 
                      value={newExamDuration}
                      onChange={(e) => setNewExamDuration(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-150 bg-slate-50 dark:bg-slate-950 text-slate-850 focus:outline-[#00be90]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">মোট নম্বর</label>
                    <input 
                      type="number" 
                      value={newExamMarks}
                      onChange={(e) => setNewExamMarks(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-154 bg-slate-50 dark:bg-slate-950 text-slate-800 focus:outline-[#00be90]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">সিকিউরিটি পাসকোড (ঐচ্ছিক)</label>
                  <input 
                    type="text" 
                    value={newExamPass}
                    onChange={(e) => setNewExamPass(e.target.value)}
                    placeholder="লিংক প্রটেক্ট সুরক্ষার জন্য পাসকোড"
                    className="w-full text-xs p-2 rounded-lg border border-slate-150 bg-slate-50 dark:bg-slate-950 text-slate-805 focus:outline-[#00be90]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#059669] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>এক্সাম লিংক তৈরি করুন ⚡</span>
                </button>
              </form>
            </div>

            <div className="col-span-1 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-155 dark:border-slate-800 select-none">
                <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-500" />
                  <span>সক্রিয় শিক্ষক শিডিউল ও এক্সাম লিংকসমূহ ({exams.length})</span>
                </h3>
              </div>

              {/* Online exam links display */}
              <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1">
                {exams.map((ex) => (
                  <div key={ex.id} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/65 dark:border-slate-855 rounded-2xl relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>আজকে {ex.time}</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">তারিখ: {ex.date}</span>
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100 pr-6">
                        {ex.examTitle}
                      </h4>

                      <div className="flex items-center gap-3.5 text-[11px] text-slate-400 font-semibold font-mono mt-0.5">
                        <span className="flex items-center gap-1">⏱️ {ex.duration}</span>
                        <span className="flex items-center gap-1">📊 {ex.totalMarks} MCQs</span>
                        <span className="flex items-center gap-1 text-indigo-500"><Lock className="w-3 h-3" /> কোড: {ex.passcode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button 
                        onClick={() => {
                          const examUrl = `https://studyqoro.ai/exam-portal/hsc-${ex.id}`;
                          navigator.clipboard.writeText(examUrl);
                          alert("পরীক্ষার লিঙ্কটি ক্লিপবোর্ডে কপি সম্পন্ন হয়েছে:\n" + examUrl);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#f1f5f9] dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>লিংক কপি করুন</span>
                      </button>
                      
                      <button 
                        onClick={() => setExams(exams.filter(x => x.id !== ex.id))}
                        className="py-2.5 px-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-550 hover:text-white dark:hover:bg-red-500 text-red-500 font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-red-500/10"
                      >
                        বাতিল
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= OMR CARD SCANNER MACHINE SIMULATOR ================= */}
        {activeSubTab === "omr_checker" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            <div className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#00be90]" />
                <span>AI উত্তরপত্র স্ক্যানিং ইন্টারফেস</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">ডিটেক্ট সেন্সিটিভিটি (পিক্সেল থ্রেশহোল্ড)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="50" 
                      max="98" 
                      value={omrThreshold}
                      onChange={(e) => setOmrThreshold(Number(e.target.value))}
                      className="w-full accent-[#00be90] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-extrabold font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">{omrThreshold}%</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-205 dark:border-slate-855 text-center relative overflow-hidden h-[160px] flex flex-col items-center justify-center select-none">
                  {scannedImage ? (
                    <div className="flex flex-col items-center justify-center animate-fadeIn text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 animate-bounce">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 text-emerald-600 dark:text-emerald-400">OMR শিট স্ক্যান সম্পন্ন!</span>
                      <p className="text-[9px] text-slate-400 mt-1">রোল ও কোড সাফল্যের সাথে ফিল্টার করা হয়েছে।</p>
                    </div>
                  ) : isScanning ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="relative w-12 h-12 mb-3">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-100 border-t-emerald-500 animate-spin" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">ক্যামেরা ডেক ও OMR মার্কস পার্সিং হচ্ছে...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold max-w-xs mb-3">
                        কম্পিউটার ক্যামেরা ভিউ চালু করুন অথবা রোল ও বৃত্ত ভরাটকৃত OMR খাতার ছবি ড্র্যাগ করে আপলোড করুন।
                      </p>
                      <button 
                        onClick={handleSimulatedScan}
                        className="py-1.5 px-3 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        ক্যামেরা সিমুলেশন স্ক্যান 📸
                      </button>
                    </div>
                  )}

                  {/* Laser Scanning Bar Effect on scanning */}
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-[2.5px] bg-[#00be90] opacity-80 shadow-lg shadow-emerald-500 animate-scanLine" />
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850/60 leading-relaxed text-[11px] text-slate-500 font-semibold font-mono">
                  💡 <span className="font-extrabold text-slate-700 dark:text-slate-350">ব্যবহার পদ্ধতি:</span> শিক্ষকরা পরীক্ষা শেষে শিক্ষার্থীদের ১০০ বৃত্তের OMR পাতা ক্যামেরা ভিউয়ের সামনে রাখলেই আমাদের ইমেজিং লাইব্রেরি স্বয়ংক্রিয়ভাবে বৃত্তগুলো পার্স করে মার্কস সংরক্ষণ করবে।
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSimulatedScan}
                    disabled={isScanning}
                    className="flex-1 py-3 bg-[#059669] hover:bg-emerald-600 disabled:bg-emerald-600/40 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ক্যামেরা লাইভ স্ক্যান 🚀</span>
                  </button>

                  {scannedImage && (
                    <button 
                      onClick={() => {
                        setScannedImage(null);
                      }}
                      className="px-3.5 bg-slate-100 hover:bg-slate-205 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs cursor-pointer border border-slate-200/40"
                    >
                      রিসেট
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-155 dark:border-slate-800 select-none">
                  <h3 className="text-xs font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#00be90]" />
                    <span>OMR স্ক্যান ফলাফল ডাটাবেজ</span>
                  </h3>
                  
                  {scannedImage && (
                    <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      স্ক্যানড ওকে ✔️
                    </span>
                  )}
                </div>

                {/* Scanned student details */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850/60 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">শিক্ষার্থীর নাম</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">{omrStudentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">রোল নাম্বার (HSC Board)</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold font-mono">{omrRollNo}</span>
                  </div>
                </div>

                {/* Score analytics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                  <div className="p-2 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-xl">
                    <span className="text-[9px] font-bold block mb-0.5 opacity-80">সঠিক উত্তর</span>
                    <span className="text-base font-black font-mono">
                      {omrAnswers.filter(a => a.status === "correct").length} / {omrAnswers.length}
                    </span>
                  </div>
                  <div className="p-2 bg-red-500/5 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 rounded-xl">
                    <span className="text-[9px] font-bold block mb-0.5 opacity-80">ভুল উত্তর</span>
                    <span className="text-base font-black font-mono">
                      {omrAnswers.filter(a => a.status === "incorrect").length}
                    </span>
                  </div>
                  <div className="p-2 bg-[#00be90]/10 text-[#00be90] rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] font-black block mb-0.5 opacity-80">সাফল্য হার</span>
                    <span className="text-xs font-black font-mono">
                      {Math.round((omrAnswers.filter(a => a.status === "correct").length / omrAnswers.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Checked circles list */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {omrAnswers.map((ans) => (
                    <div 
                      key={ans.q} 
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-semibold ${
                        ans.status === "correct" 
                          ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                          : "bg-red-500/5 border-red-500/10 text-red-700 dark:text-red-400"
                      }`}
                    >
                      <span className="font-extrabold">Q {ans.q}:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[9px] text-[#475569] dark:text-slate-400">({ans.student})</span>
                        {ans.status === "correct" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                <span>সার্ভার আইডি: OMR_EDGE_NODE_3</span>
                <span>স্ট্যাটাস: সক্রিয় ক্লাউড ভেরিফাইড</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
