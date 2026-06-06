/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, Dispatch, SetStateAction, ChangeEvent, DragEvent } from "react";
import { MessageSquareCode, Send, Sparkles, AlertCircle, ArrowUp, Plus, ChevronDown, ArrowRight, History, Trash2, MessageSquare, Paperclip, FileText, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ChatMessage, StudentStats } from "../types";
import { SAMPLE_AI_SUGGESTIONS } from "../data";

interface ChorchaAIProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  onUpgrade?: () => void;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}

// Conceptual Grayscale / Line-Art Vector Illustration representing Academic Knowledge & Mind Synthesis
// Uses geometric grids, solar orbits, platonic solids, and the light of inquiry.
// This abstract representation prompts users to use their minds to explore and grasp concepts.
function ConceptualStudyIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center select-none">
      <svg className="w-24 h-24 sm:w-32 sm:h-32 select-none pointer-events-none opacity-85 text-slate-800 dark:text-slate-100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Subtle background radar/grid coordinate system */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        
        {/* Fine orbital concentric rings representing structure & logic */}
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.5" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" className="stroke-slate-300 dark:stroke-slate-700" />
        <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="0.75" className="stroke-slate-400 dark:stroke-slate-600" />

        {/* Abstract Greek Architectural Pediment - Education core foundation */}
        <path d="M60,135 L140,135 L100,115 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="stroke-slate-800 dark:stroke-slate-200" />
        
        {/* Standard foundation blocks with clean spacing lines */}
        <rect x="65" y="135" width="70" height="25" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" className="stroke-slate-800 dark:stroke-slate-200" />
        <line x1="88" y1="135" x2="88" y2="160" stroke="currentColor" strokeWidth="0.75" className="stroke-slate-400 dark:stroke-slate-600" />
        <line x1="112" y1="135" x2="112" y2="160" stroke="currentColor" strokeWidth="0.75" className="stroke-slate-400 dark:stroke-slate-600" />

        {/* Dynamic inquiry constellation with sparkling nodes */}
        <g className="animate-pulse">
          <circle cx="130" cy="65" r="4.5" fill="currentColor" className="text-slate-800 dark:text-slate-200" />
          <line x1="100" y1="115" x2="130" y2="65" stroke="currentColor" strokeWidth="1" className="stroke-slate-350 dark:stroke-slate-600" />
          
          <circle cx="65" cy="55" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" className="stroke-slate-800 dark:stroke-slate-200" />
          <line x1="100" y1="115" x2="65" y2="55" stroke="currentColor" strokeWidth="0.75" className="stroke-slate-350 dark:stroke-slate-600" />
        </g>

        {/* Platonic solid - Octahedron - representing math, chemistry molecular symmetries */}
        <g transform="translate(100, 48)">
          <path d="M0,-18 L15,0 L0,18 L-15,0 Z" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" className="stroke-slate-800 dark:stroke-slate-250" />
          <line x1="-15" y1="0" x2="15" y2="0" stroke="currentColor" strokeWidth="0.75" className="stroke-slate-400 dark:stroke-slate-600" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" className="stroke-slate-400 dark:stroke-slate-600" />
        </g>

        {/* Spark of intelligence glyph */}
        <path d="M35,115 C45,115 45,125 45,125 C45,125 45,115 55,115 C45,115 45,105 45,105 C45,105 45,115 35,115 Z" fill="currentColor" className="text-slate-700 dark:text-slate-300" />
        <path d="M150,118 C155,118 155,123 155,123 C155,123 155,118 160,118 C155,118 155,113 155,113 C155,113 155,118 150,118 Z" fill="currentColor" className="text-slate-500 dark:text-slate-400" />

        {/* Floating pendulum weight marking time rhythm / bouncing ball */}
        <line x1="100" y1="100" x2="148" y2="114" stroke="currentColor" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-600" />
        {/* Glowing aura ring behind bouncing ball */}
        <circle cx="148" cy="114" r="14" fill="currentColor" className="text-emerald-500/10 dark:text-emerald-400/10 animate-ping" />
        {/* Upgraded larger bouncing ball for high visibility */}
        <circle cx="148" cy="114" r="10.5" fill="currentColor" className="text-emerald-500 dark:text-emerald-400 animate-bounce shadow-lg ring-4 ring-emerald-500/20" />

      </svg>
    </div>
  );
}

export default function ChorchaAI({ stats, setStats, onUpgrade }: ChorchaAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("Select Subject");

  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachments, setAttachments] = useState<{
    id: string;
    name: string;
    size: number;
    mimeType: string;
    data: string;
    previewUrl?: string;
  }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("ফাইলের সাইজ ১০ এমবি (10MB) এর কম হতে হবে।");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      const isImage = file.type.startsWith("image/");
      
      const newAttachment = {
        id: "att-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5),
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        data: base64Data,
        previewUrl: isImage ? base64Data : undefined,
      };

      setAttachments(prev => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(addFile);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(addFile);
    }
  };

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showHistorySidebar, setShowHistorySidebar] = useState(true);

  // Safeguard ref to disable re-saving/triggering loops during initial select selection load
  const isSelectingThreadRef = useRef(false);

  const subjects = [
    "Select Subject",
    "পদার্থবিজ্ঞান (Physics)",
    "রসায়ন (Chemistry)",
    "উচ্চতর গণিত (Math)",
    "জীববিজ্ঞান (Biology)",
    "আইসিটি (ICT)",
    "ইংরেজি ব্যাকরণ (English)"
  ];

  // Load threads on initial mount
  useEffect(() => {
    const saved = localStorage.getItem("qoro_chat_threads");
    if (saved) {
      try {
        setThreads(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing chat threads:", e);
      }
    }
  }, []);

  // Synchronize dynamic updates back into active thread index & save
  useEffect(() => {
    if (messages.length === 0) return;

    if (isSelectingThreadRef.current) {
      isSelectingThreadRef.current = false;
      return;
    }

    const saved = localStorage.getItem("qoro_chat_threads");
    let currentThreads: ChatThread[] = [];
    if (saved) {
      try {
        currentThreads = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (activeThreadId) {
      const idx = currentThreads.findIndex(t => t.id === activeThreadId);
      if (idx !== -1) {
        currentThreads[idx].messages = messages;
      } else {
        const firstUserMsg = messages.find(m => m.role === "user");
        let rawTitle = firstUserMsg ? firstUserMsg.text : "নতুন আলাপ";
        rawTitle = rawTitle.replace(/^\[.*?\]\s*/, "");
        const title = rawTitle.slice(0, 30) + (rawTitle.length > 30 ? "..." : "");
        currentThreads.unshift({
          id: activeThreadId,
          title,
          messages,
          timestamp: new Date().toLocaleDateString("bn-BD")
        });
      }
    } else {
      const firstUserMsg = messages.find(m => m.role === "user");
      let rawTitle = firstUserMsg ? firstUserMsg.text : "নতুন আলাপ";
      rawTitle = rawTitle.replace(/^\[.*?\]\s*/, "");
      const title = rawTitle.slice(0, 30) + (rawTitle.length > 30 ? "..." : "");
      
      const newId = "thread-" + Date.now();
      const newThread: ChatThread = {
        id: newId,
        title,
        messages,
        timestamp: new Date().toLocaleDateString("bn-BD")
      };
      currentThreads.unshift(newThread);
      setActiveThreadId(newId);
    }

    localStorage.setItem("qoro_chat_threads", JSON.stringify(currentThreads));
    setThreads(currentThreads);
  }, [messages, activeThreadId]);

  const handleDeleteThread = (threadId: string) => {
    const saved = localStorage.getItem("qoro_chat_threads");
    if (saved) {
      try {
        const currentThreads = JSON.parse(saved).filter((t: any) => t.id !== threadId);
        localStorage.setItem("qoro_chat_threads", JSON.stringify(currentThreads));
        setThreads(currentThreads);
        if (activeThreadId === threadId) {
          handleNewChat();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveThreadId(null);
    setUserInput("");
    setErrorMessage(null);
  };

  // Close subject selection dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSubjectDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    let finalPrompt = (customText || userInput).trim();
    if (!finalPrompt && attachments.length === 0) return;
    if (loading) return;

    // Reset error
    setErrorMessage(null);

    // If subject selected and not present, prepend academic context silently/non-verbosely
    if (selectedSubject !== "Select Subject" && !customText && finalPrompt && !finalPrompt.includes(selectedSubject.split(" ")[0])) {
      finalPrompt = `[${selectedSubject.split(" ")[0]}] ${finalPrompt}`;
    }

    const currentAttachments = [...attachments];

    // Create user message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: finalPrompt || "সংযুক্ত ফাইল বা ইমেজের বিস্তারিত বিশ্লেষণ ও সমাধান প্রদান করো।",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments.map(att => ({
        name: att.name,
        mimeType: att.mimeType,
        previewUrl: att.previewUrl
      }))
    };

    const newMessagesList = [...messages, userMsg];
    setMessages(newMessagesList);
    if (!customText) {
      setUserInput("");
    }
    setAttachments([]);
    setLoading(true);

    try {
      // Gather conversational history context with attachments data passed for the last message
      const chatHistory = newMessagesList.map((m, idx) => {
        const isLastMsg = idx === newMessagesList.length - 1;
        return {
          role: m.role,
          text: m.text,
          attachments: isLastMsg ? currentAttachments : (m.attachments || [])
        };
      });

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("এআই সার্ভার সাড়া দিতে পারেনি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
      }

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "model",
        text: data.text || "আমি দুঃখিত, আমি এই মুহূর্তে উত্তরটি প্রসেস করতে পারছি না। দয়াকরে আরেকবার লিখুন।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // Give 5 XP for inquiring AI (student motivation counter)
      setStats(prev => {
        const newPoints = prev.points + 5;
        return {
          ...prev,
          points: newPoints,
          level: Math.floor(newPoints / 100) + 1
        };
      });

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  // Check if there are no user conversation messages yet
  const isThreadEmpty = messages.length === 0;

  // Extract first word of student name to personalize greeting exactly like the screenshot
  const studentFirstName = stats.name ? stats.name.split(" ")[0].replace(/[^a-zA-Z]/g, "") || stats.name.split(" ")[0] : "Tawhid";

  const renderInputForm = () => (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`animate-fade-in [animation-duration:500ms] bg-white dark:bg-slate-950 border rounded-3xl flex flex-col shadow-sm focus-within:shadow-md transition-all group w-full relative ${
        isThreadEmpty ? "p-2.5" : "p-1.5 sm:p-2 px-2.5"
      } ${
        isDragOver 
          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50/10 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20" 
          : "border-slate-205 dark:border-slate-800 focus-within:border-slate-300 dark:focus-within:border-slate-750"
      }`}
    >
      {/* Hidden native input for multi-type selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,application/pdf,text/*"
      />

      {isDragOver && (
        <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/5 backdrop-blur-xs flex items-center justify-center rounded-3xl z-35 pointer-events-none border-2 border-dashed border-emerald-500">
          <p className="text-xs font-black text-[#059669] dark:text-emerald-400 tracking-tight flex items-center gap-2 animate-bounce">
            📥 ফাইল বা ছবি এখানে ছেড়ে দাও (Drop to Attach)
          </p>
        </div>
      )}

      {/* Main textarea content core */}
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder={isThreadEmpty ? "সবচেয়ে কঠিন অ্যাকাডেমিক প্রশ্ন, পড়ার রুটিন বা কোনো চিত্র/ফাইল আপলোড করে বিশ্লেষণ করতে বলো..." : "পরবর্তী প্রশ্ন লিখুন..."}
        className={`flex-1 w-full bg-transparent py-1 px-2.5 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm select-text focus:outline-none resize-none font-semibold leading-relaxed transition-all ${
          isThreadEmpty ? "min-h-[38px] md:min-h-[44px]" : "min-h-[32px] md:min-h-[36px]"
        }`}
        disabled={loading}
      />

      {/* Render currently pending attachments */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pb-2.5 pt-1 border-t border-slate-50 dark:border-slate-900/10 animate-fade-in">
          {attachments.map((att) => (
            <div 
              key={att.id} 
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 pr-2.5 text-[10.5px] font-sans font-bold text-slate-700 dark:text-slate-300 relative group max-w-[180px]"
            >
              {att.previewUrl ? (
                <img 
                  src={att.previewUrl} 
                  alt={att.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-750" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/30 dark:border-emerald-900/10">
                  {att.mimeType === "application/pdf" ? (
                    <span className="text-[9px] font-sans font-black leading-none text-emerald-600 dark:text-emerald-400">PDF</span>
                  ) : (
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              )}
              
              <div className="min-w-0 flex-1 leading-tight text-left">
                <p className="truncate text-slate-800 dark:text-slate-200 text-[10px]">{att.name}</p>
                <span className="text-[8px] text-slate-400 font-mono">{(att.size / 1024).toFixed(1)} KB</span>
              </div>

              <button
                type="button"
                onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                className="w-4 h-4 rounded-full bg-slate-200/60 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-2.5 h-2.5 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Tray inside input box exactly like the screen mockup */}
      <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-900/40 pt-2.5 mt-1">
        
        {/* Bottom Left Toolbar: Plus button, Attachment trigger, & Subject selector */}
        <div className="flex items-center gap-2">
          
          {/* Reset/Plus action pill */}
          <button
            type="button"
            onClick={() => {
              setUserInput("");
              setErrorMessage(null);
              setAttachments([]);
            }}
            className="w-8 h-8 rounded-full border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 flex items-center justify-center transition-all bg-slate-50/50 dark:bg-slate-900/30 active:scale-95 cursor-pointer"
            title="ক্লিয়ার ইনপুট"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* New file upload trigger action button */}
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-8 h-8 rounded-full border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-[#059669] dark:hover:text-emerald-400 flex items-center justify-center transition-all bg-slate-50/50 dark:bg-slate-900/30 active:scale-95 cursor-pointer"
            title="ফাইল বা ছবি সংযুক্ত করুন"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Subject Dropdown Core */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-full flex items-center gap-1.5 text-[11px] font-black text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
            >
              <span>{selectedSubject === "Select Subject" ? "বিষয় নির্বাচন" : selectedSubject.split(" ")[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showSubjectDropdown && (
              <div className="absolute left-0 bottom-full mb-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl shadow-xl py-1.5 z-40 animate-fade-in text-left">
                {subjects.map((sub, i) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub);
                      setShowSubjectDropdown(false);
                    }}
                    className={`w-full text-[11px] font-bold px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 block text-left ${
                      selectedSubject === sub 
                        ? "text-[#059669] dark:text-emerald-450 bg-emerald-50/30 dark:bg-emerald-950/20" 
                        : "text-slate-650 dark:text-slate-355"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Right: Clean dark custom arrow button matching screenshot */}
        <button
          type="submit"
          disabled={loading || (!userInput.trim() && attachments.length === 0)}
          className="w-10 h-10 rounded-full bg-[#059669] hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-30 disabled:scale-100 shrink-0 cursor-pointer"
          title="এআই প্রশ্ন করুন"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>

      </div>
    </form>
  );

  const renderQuickPrompts = () => (
    <div className="max-w-xl mx-auto w-full">
      <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-black tracking-widest mb-2.5 text-center">
        এই কুইক প্রম্পটসমূহ ট্রাই করুন (Quick Starter Prompts)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
        {SAMPLE_AI_SUGGESTIONS.slice(0, 4).map((sug, i) => (
          <button
            key={i}
            onClick={() => handleQuickPromptClick(sug)}
            className="text-[11px] text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-2 font-semibold cursor-pointer group"
          >
            <span className="truncate">{sug}</span> 
            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-205 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-[32px] shadow-sm tracking-tight relative overflow-hidden transition-all flex flex-col md:flex-row h-[485px] md:h-[520px] max-w-6xl mx-auto w-full">
      
      {/* Left Column: Collapsible Chat History List Panel */}
      {showHistorySidebar && (
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/85 flex flex-col shrink-0 bg-slate-50/30 dark:bg-slate-955/40 transition-all duration-300">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <History className="w-3.5 h-3.5 text-[#059669]" />
              পূর্ববর্তী আলাপসমূহ
            </span>
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg border border-slate-150 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:text-[#059669] text-slate-550 dark:text-slate-400 transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer active:scale-95 bg-slate-50 dark:bg-slate-900"
              title="নতুন আলাপ শুরু করুন"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>নতুন চ্যাট</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[170px] md:max-h-[600px] scrollbar-none md:scrollbar-thin">
            {threads.length === 0 ? (
              <div className="py-6 px-3 text-center space-y-1">
                <p className="text-slate-400 text-[11px] font-semibold">কোনো পূর্ববর্তী আলাপ নেই</p>
                <p className="text-slate-400/80 text-[10px]">পড়ালেখা সংক্রান্ত প্রথম চ্যাটটি শুরু করো!</p>
              </div>
            ) : (
              threads.map((t) => {
                const isActive = t.id === activeThreadId;
                return (
                  <div 
                    key={t.id}
                    className={`group w-full flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all text-xs cursor-pointer ${
                      isActive 
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-950 dark:text-white shadow-sm ring-1 ring-[#059669]/10"
                        : "bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-850/40 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                    onClick={() => {
                      isSelectingThreadRef.current = true;
                      setActiveThreadId(t.id);
                      setMessages(t.messages);
                      setErrorMessage(null);
                    }}
                  >
                    <div className="flex items-center gap-2 max-w-[80%] min-w-0">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#059669]" : "text-slate-400"}`} />
                      <div className="min-w-0">
                        <p className="font-bold truncate text-[11px] leading-snug">{t.title}</p>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{t.timestamp}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThread(t.id);
                      }}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                      title="আলাপটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Right Column: Main Study Chat Interface Area */}
      <div className="flex-grow flex flex-col p-5 sm:p-7 min-w-0 h-full overflow-hidden">
        
        {/* Header Toolbar matches the high-level premium layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6 gap-3 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Toggle History Side-panel icon button representation */}
            <button
              onClick={() => setShowHistorySidebar(!showHistorySidebar)}
              className="p-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-550 dark:text-slate-355 transition-all mr-0.5 cursor-pointer active:scale-95 flex items-center justify-center shrink-0 bg-white/50 dark:bg-slate-900/50"
              title={showHistorySidebar ? "ইতিহাস প্যানেল বন্ধ করুন" : "ইতিহাস প্যানেল প্রদর্শন করুন"}
            >
              <History className={`w-4 h-4 ${showHistorySidebar ? "text-[#059669]" : "text-slate-400"}`} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-100 shrink-0">
              <MessageSquareCode className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Study Qoro AI
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Continuous Study Companion</p>
            </div>
          </div>
          
          {/* Cleansing and Level markers */}
          <div className="flex items-center gap-2.5 justify-between w-full sm:w-auto sm:justify-end shrink-0">
            <div className="flex items-center gap-2">
              {!isThreadEmpty && (
                <button 
                  onClick={handleClearHistory}
                  className="text-[10.5px] font-bold text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  title="চ্যাট হিস্ট্রি রিসেট করুন"
                >
                  ক্লিয়ার চ্যাট
                </button>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-lg">
              LVL {stats.level} 
            </span>
          </div>
        </div>

        {/* 2. CHAT SCALING HUB: Welcoming sketch or active message loops */}
        {isThreadEmpty ? (
          <div className="flex-grow flex flex-col justify-start md:justify-center items-center py-1 space-y-4 max-w-xl mx-auto w-full animate-fade-in overflow-y-auto scrollbar-none pr-1">
            
            {/* Unique personalized greeting with premium orbiting/floating orb animation backdrop */}
            <div className="relative text-center py-4 px-8 rounded-3xl w-full max-w-md mx-auto shrink-0 overflow-hidden bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100/40 dark:border-emerald-900/10 shadow-xs">
              {/* Backing Unique active floating/bouncing gradient orbs surrounding Hello */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                {/* Pulsating glowing emerald backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-100/40 dark:bg-emerald-950/20 rounded-full blur-3xl animate-pulse" />
                
                {/* Orbiting Bouncy Ball left-side */}
                <div className="absolute top-2 left-6 w-5 h-5 bg-gradient-to-tr from-[#059669] to-teal-400 rounded-full blur-[0.5px] opacity-75 shadow-md animate-bounce duration-[1400ms]" />
                
                {/* Secondary Pulsing Ball right-side */}
                <div className="absolute bottom-2 right-6 w-4.5 h-4.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur-[0.5px] opacity-60 shadow-md animate-ping duration-[2600ms]" />

                {/* Concentric rotating glow line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-emerald-500/10 rounded-full animate-pulse duration-1500" />
              </div>

              {/* Real-time personal greeting layout sitting above original animation layers */}
              <div className="relative z-10 space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5 leading-normal">
                  <span className="relative inline-block">
                    Hello, 
                    <span className="absolute -top-0.5 -right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </span>
                  <span className="text-[#059669] dark:text-emerald-400 relative inline-block px-1.5">
                    {studentFirstName}
                    {/* Glowing highlight anchor */}
                    <span className="absolute bottom-[2px] left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse" />
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] leading-normal">
                  How can I assist you today?
                </p>
              </div>
            </div>

            {/* The Prominent Typing Box center-aligned right in front of the user's eyes */}
            <div className="w-full shrink-0">
              {renderInputForm()}
            </div>

            {/* The Quick Prompts block */}
            <div className="w-full shrink-0">
              {renderQuickPrompts()}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full min-h-0 overflow-hidden">
            
            {/* Scrollable messages thread */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin max-w-3xl mx-auto w-full">
              <div className="space-y-4">
                {messages.map((m) => {
                  const isAI = m.role === "model";
                  return (
                    <div key={m.id} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-in w-full`}>
                      <div className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-xs sm:text-sm leading-relaxed ${
                        isAI 
                          ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap" 
                          : "bg-emerald-600 dark:bg-emerald-750 text-white rounded-tr-none shadow-sm font-semibold"
                      }`}>
                        {/* Rendering attached file in message log */}
                        {!isAI && m.attachments && m.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 pb-1 bg-black/5 dark:bg-black/10 p-1.5 rounded-xl border border-white/10">
                            {m.attachments.map((att, index) => (
                              <div 
                                key={index} 
                                className="flex items-center gap-1.5 bg-black/25 hover:bg-black/35 border border-white/10 rounded-lg p-1 pr-2 text-[10.5px] font-sans font-bold text-white relative max-w-[190px]"
                              >
                                {att.previewUrl ? (
                                  <img 
                                    src={att.previewUrl} 
                                    alt={att.name} 
                                    className="w-7 h-7 rounded object-cover border border-white/20" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded bg-white/15 text-emerald-100 flex items-center justify-center shrink-0 border border-white/10">
                                    {att.mimeType === "application/pdf" ? (
                                      <span className="text-[8px] font-black font-sans leading-none text-white">PDF</span>
                                    ) : (
                                      <FileText className="w-3.5 h-3.5 text-white" />
                                    )}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1 leading-none text-left">
                                  <p className="truncate text-white text-[10px] pr-1">{att.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {isAI ? (
                          <div className="markdown-body font-normal leading-relaxed text-left text-inherit">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-800 dark:text-slate-100">{children}</p>,
                                strong: ({ children }) => <strong className="font-extrabold text-[#059669] dark:text-emerald-400">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc pl-5 mb-2.5 space-y-1 text-left text-slate-800 dark:text-slate-100">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-left text-slate-800 dark:text-slate-100">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                h1: ({ children }) => <h1 className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1.5">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xs font-black text-slate-900 dark:text-white mt-2.5 mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2 mb-1">{children}</h3>,
                                code: ({ children }) => <code className="bg-slate-200/50 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-mono font-bold text-[#059669] dark:text-emerald-400">{children}</code>,
                                pre: ({ children }) => <pre className="bg-slate-100 dark:bg-slate-950/85 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/60 text-[11px] font-mono overflow-x-auto my-2 text-slate-800 dark:text-slate-200 border-l-3 border-l-emerald-650 text-left whitespace-pre-wrap">{children}</pre>
                              }}
                            >
                              {m.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="markdown-body font-normal leading-relaxed text-left text-inherit">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed text-white">{children}</p>,
                                strong: ({ children }) => <strong className="font-black text-white underline decoration-dashed decoration-white/50 underline-offset-2">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-0.5 text-left text-white">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5 text-left text-white">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                code: ({ children }) => <code className="bg-emerald-800/60 px-1 py-0.5 rounded text-[11px] font-mono font-bold text-white">{children}</code>
                              }}
                            >
                              {m.text}
                            </ReactMarkdown>
                          </div>
                        )}
                        <div className={`mt-2.5 flex justify-between items-center text-[9px] border-t pt-1.5 whitespace-nowrap ${
                          isAI 
                            ? "text-slate-400 border-slate-200/40 dark:border-slate-800/40" 
                            : "text-emerald-100 border-white/20"
                        }`}>
                          <span className="font-semibold">{isAI ? "🤖 Study Qoro AI" : `👤 তুমি (${studentFirstName})`}</span>
                          <span>{m.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading status indicator styled precisely */}
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-slate-550 dark:text-slate-400 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-100 animate-ping" />
                    <span className="font-extrabold tracking-tight font-mono">Study Qoro AI is formulating answer...</span>
                  </div>
                </div>
              )}

              {/* Error message card */}
              {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Typing box anchored at bottom of active conversation */}
            <div className={`w-full mx-auto shrink-0 transition-all duration-300 ${isThreadEmpty ? "max-w-xl" : "max-w-xs sm:max-w-sm md:max-w-lg"}`}>
              {renderInputForm()}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
