/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Swords, User, Zap, Trophy, ShieldAlert, Play, Hourglass, HelpCircle, Check, ArrowRight, RefreshCw, Sparkles, Award, X, Sparkle, Target, Crown, ChevronLeft, Copy, Plus, Link } from "lucide-react";
import { StudentStats, Question } from "../types";

const SUBJECT_CHAPTERS: { [sub: string]: string[] } = {
  "উচ্চতর গণিত ২য় পত্র": ["সব", "স্থিতিবিদ্যা", "বিস্তার পরিমাপ ও সম্ভাবনা", "বহুপদী ও বহুপদী সমীকরণ", "বাস্তব সংখ্যা ও অসমতা", "সমতলে বস্তুকণার গতি", "যোগাশ্রয়ী প্রোগ্রাম", "কনিক", "জটিল সংখ্যা", "বিপরীত ত্রিকোণমিতিক ফাংশন ও ত্রিকোণমিতিক সমীকরণ", "দ্বিপদী বিস্তৃতি"],
  "রসায়ন ১ম পত্র": ["সব", "ল্যাবরেটরীর নিরাপদ ব্যবহার", "গুণগত রসায়ন", "পর্যায়বৃত্ত ধর্ম", "রাসায়নিক পরিবর্তন", "কর্মমুখী রসায়ন"],
  "জীববিজ্ঞান ১ম পত্র": ["সব", "কোষ ও এর গঠন", "কোষ বিভাজন", "অণুজীব", "শৈবাল ও ছত্রাক", "ব্রায়োফাইটা ও টেরিডোফাইটা", "নগ্নজীবী ও আবৃতজীবী উদ্ভিদ", "টিস্যু ও টিস্যুতন্ত্র"],
  "ICT": ["সব", "তথ্য ও যোগাযোগ প্রযুক্তি", "যোগাযোগ সিস্টেমস ও নেটওয়ার্কিং", "সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস", "ওয়েব ডিজাইন পরিচিতি এবং HTML", "প্রোগ্রামিং ভাষা", "ডাটাবেজ ম্যানেজমেন্ট সিস্টেম"],
  "উচ্চতর গণিত ১ম পত্র": ["সব", "যুগ্ম সরলরেখা", "বৃত্ত", "ত্রিকোণমিতিক অনুপাত", "সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত", "সরলরেখা", "অন্টারকরণ", "যোজিত ফল"],
  "জীববিজ্ঞান ২য় পত্র": ["সব", "প্রাণীর পরিচিতি", "প্রাণীর আচরণ", "সমন্বয় ও নিয়ন্ত্রণ", "রক্ত ও সংবহন", "শ্বাসক্রিয়া ও শ্বসন"],
  "পদার্থবিজ্ঞান ২য় পত্র": ["সব", "তাপগতিবিদ্যা", "স্থির তড়িৎ", "চল তড়িৎ", "তড়িৎ প্রবাহের চৌম্বক ক্রিয়া", "চৌম্বক পদার্থ ও ভূ-চৌম্বকত্ব", "তাড়িৎচৌম্বকীয় আবেশ", "জ্যামিতিক আলোকবিজ্ঞান", "আধুনিক পদার্থবিজ্ঞান"],
  "পদার্থবিজ্ঞান ১ম পত্র": ["সব", "ভেক্টর", "গতিবিদ্যা", "নিউটনীয় বলবিদ্যা", "কাজ, শক্তি ও ক্ষমতা", "মহাকর্ষ ও অভিকর্ষ", "পর্যাবৃত্ত গতি", "আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব"],
  "রসায়ন ২য় পত্র": ["সব", "পরিবেশ রসায়ন", "জৈব রসায়ন", "পরিমাণগত রসায়ন", "তড়িৎ রসায়ন"],
  "উচ্চতর অনুকূল": ["সব", "যেকোনো অধ্যায়"]
};

interface BattleExamProps {
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  questions?: Question[];
}

interface BattleRoom {
  id: string;
  subject: string;
  chapter: string;
  totalQuestions: number;
  secondsPerQuestion: number;
  status: "open" | "active" | "completed";
  maxPlayers: number;
  players: {
    id: string;
    name: string;
    score: number;
    avatarInitials: string;
    isReady: boolean;
    shout?: string;
    finished?: boolean;
    finishedAt?: number;
    currentQIdx?: number;
    answers: { [qIdx: number]: { choice: number; timeTaken: number; isCorrect: boolean } };
  }[];
  questions: any[];
  createdAt: number;
}

export default function BattleExam({ stats, setStats, questions }: BattleExamProps) {
  const [myUserId] = useState<string>(() => {
    let savedId = localStorage.getItem("study_qoro_user_id");
    if (!savedId) {
      savedId = "u-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("study_qoro_user_id", savedId);
    }
    return savedId;
  });

  // Navigation tabs of battle page: "Live Feed" vs "My Battles"
  const [activeSubTab, setActiveSubTab] = useState<"feed" | "my">("feed");
  
  // Game states: "lobby" (screen feed) | "inside-room" (waiting/ready) | "playing" (active MCQ) | "waiting-results" (for opponents) | "results" (victory/defeat)
  const [gameState, setGameState] = useState<"lobby" | "inside-room" | "playing" | "waiting-results" | "results">("lobby");
  
  // Active selected or joined battle room details
  const [joinedRoom, setJoinedRoom] = useState<BattleRoom | null>(null);
  const [rooms, setRooms] = useState<BattleRoom[]>([]);
  const [loading, setLoading] = useState(false);

  // Active playing states
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [timer, setTimer] = useState(20);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentsProgress, setOpponentsProgress] = useState<{ [id: string]: number }>({});
  
  // Custom dialogs (Create/Join)
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [customJoinCode, setCustomJoinCode] = useState("");

  // Create room states
  const [createSubject, setCreateSubject] = useState("উচ্চতর গণিত ২য় পত্র");
  const [createChapter, setCreateChapter] = useState("সব");
  const [createNumQs, setCreateNumQs] = useState(10);
  const [createSecs, setCreateSecs] = useState(30);

  // Advanced dynamic settings
  const [createMode, setCreateMode] = useState<"1v1" | "Group" | "Global">("1v1");
  const [createMaxPlayers, setCreateMaxPlayers] = useState<number>(2);
  const [customMaxPlayers, setCustomMaxPlayers] = useState("");
  const [createRoomType, setCreateRoomType] = useState<"Public" | "Private">("Public");
  const [createStakes, setCreateStakes] = useState<"Friendly" | "Ranked" | "High Stakes">("Friendly");
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    if (!joinedRoom) return;
    try {
      await navigator.clipboard.writeText(`BTL-${joinedRoom.id.toUpperCase()}`);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const handleCopyLink = async () => {
    if (!joinedRoom) return;
    try {
      const shareUrl = `${window.location.origin}/battle?room=${joinedRoom.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulatedOppAnswersRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to top when screen/state moves, avoiding "black screen down navigation" bugs
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const mainWrap = document.querySelector("main")?.parentElement;
    if (mainWrap) {
      mainWrap.scrollTop = 0;
    }
  }, [gameState, showCreateDialog, showJoinDialog]);

  // Fetch battle rooms on mount and periodically
  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/db/battles");
      if (!res.ok) throw new Error("সংযোগে ব্যর্থতা!");
      const data = await res.json();
      if (data.battles) {
        setRooms(data.battles);
        // Sync active joined room details if still playing
        if (joinedRoom) {
          const fresh = data.battles.find((b: BattleRoom) => b.id === joinedRoom.id);
          if (fresh) {
            setJoinedRoom(fresh);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    const speed = (gameState === "inside-room" || gameState === "playing" || gameState === "waiting-results") ? 1500 : 4000;
    const interval = setInterval(fetchRooms, speed);
    return () => clearInterval(interval);
  }, [joinedRoom, gameState]);

  // Handle automatic deep-link URL rooms joining on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get("room") || urlParams.get("battle");
    if (roomFromUrl) {
      handleJoinRoom(roomFromUrl);
      // cleaner URL rewrite helper
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }, 1000);
    }
  }, []);

  // Lock body scroll when create or join modal dialog is active
  useEffect(() => {
    if (showCreateDialog || showJoinDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreateDialog, showJoinDialog]);

  // Create battle helper
  const handleCreateRoom = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const finalMaxPlayers = createMode === "1v1" 
        ? 2 
        : (customMaxPlayers ? parseInt(customMaxPlayers) || createMaxPlayers : createMaxPlayers);

      const payload = {
        subject: createSubject,
        chapter: createChapter,
        totalQuestions: createNumQs,
        secondsPerQuestion: createSecs,
        maxPlayers: finalMaxPlayers,
        players: [
          {
            id: myUserId,
            name: stats.name.split(" ")[0],
            score: 0,
            avatarInitials: stats.name[0] || "S",
            isReady: true,
            shout: "",
            answers: {}
          }
        ]
      };

      const res = await fetch("/api/db/battles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("রুম তৈরি করতে ব্যর্থ হয়েছে।");
      const data = await res.json();
      if (data.success) {
        setJoinedRoom(data.battle);
        setGameState("inside-room");
        setShowCreateDialog(false);
        fetchRooms();
      }
    } catch (err) {
      alert("ব্যাটেল তৈরি সম্পন্ন করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  // Join battle helper
  const handleJoinRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const playerPayload = {
        id: myUserId,
        name: stats.name.split(" ")[0],
        avatarInitials: stats.name[0] || "P"
      };

      const res = await fetch(`/api/db/battles/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: playerPayload })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "লড়াইতে যোগ দিতে ব্যর্থ হয়েছে।");
      }
      
      const data = await res.json();
      if (data.success) {
        setJoinedRoom(data.battle);
        setGameState("inside-room");
        setShowJoinDialog(false);
        fetchRooms();
      }
    } catch (err: any) {
      alert(err.message || "রুমটি পাওয়া যায়নি বা ম্যাচ ফুল হয়ে গিয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Resume or join battle room helper
  const handleResumeOrJoinRoom = async (room: BattleRoom) => {
    // Check if current user is already a participant
    const me = (room.players || []).find(p => p && p.id === myUserId);
    if (me) {
      setJoinedRoom(room);
      if (room.status === "completed") {
        setGameState("results");
      } else if (room.status === "active") {
        if (me.finished) {
          setGameState("waiting-results");
        } else {
          setGameState("playing");
          setCurrentQIdx(me.currentQIdx || 0);
          setPlayerScore(me.score || 0);
          setSelectedOpt(null);
          setTimer(room.secondsPerQuestion || 20);
        }
      } else {
        // open status
        setGameState("inside-room");
      }
    } else {
      if (room.status === "completed") {
        setJoinedRoom(room);
        setGameState("results");
      } else {
        await handleJoinRoom(room.id);
      }
    }
  };

  // Pre-start battle match
  const handleStartPreMatch = (room: BattleRoom) => {
    setGameState("playing");
    setCurrentQIdx(0);
    setPlayerScore(0);
    setSelectedOpt(null);
    setTimer(room.secondsPerQuestion || 20);
    setOpponentsProgress({});
  };

  // Sync automatic match starting inside room when status becomes active on the server
  useEffect(() => {
    if (gameState === "inside-room" && joinedRoom && joinedRoom.status === "active") {
      handleStartPreMatch(joinedRoom);
    }
  }, [joinedRoom, gameState]);

  // Listen for battle room completion while player is in WAITING-RESULTS state
  const statsAppliedRef = useRef<string | null>(null);

  useEffect(() => {
    if (gameState === "waiting-results" && joinedRoom && joinedRoom.status === "completed") {
      // Avoid awarding points multiple times for the same battle room
      if (statsAppliedRef.current !== joinedRoom.id) {
        statsAppliedRef.current = joinedRoom.id;

        // Compute final win/loss based on finished real score comparison
        const otherPlayers = joinedRoom.players.filter(p => p.id !== myUserId);
        const maxOpponentScore = otherPlayers.length > 0
          ? Math.max(...otherPlayers.map(p => p.score || 0))
          : 0;
        const hasWon = playerScore >= maxOpponentScore;
        const rewardXP = hasWon ? 40 : 15;

        setStats(prev => {
          const milestones = [...prev.completedMilestones];
          if (hasWon && !milestones.includes("badge-4")) {
            milestones.push("badge-4");
          }
          const earnedTotal = prev.points + rewardXP;
          return {
            ...prev,
            points: earnedTotal,
            level: Math.floor(earnedTotal / 100) + 1,
            examsGiven: prev.examsGiven + 1,
            totalQuestionsSolved: prev.totalQuestionsSolved + (joinedRoom.questions.length || 3)
          };
        });
      }

      setGameState("results");
    }
  }, [joinedRoom, gameState, playerScore, myUserId, setStats]);

  // Command-host trigger to start the battle room manually
  const handleStartMatchServer = async () => {
    if (!joinedRoom) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/db/battles/${joinedRoom.id}/start`, {
        method: "POST"
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "ম্যাচ শুরু করতে ব্যর্থ হয়েছ!");
      }
      const data = await res.json();
      if (data.success) {
        setJoinedRoom(data.battle);
        handleStartPreMatch(data.battle);
      }
    } catch (e: any) {
      alert(e.message || "সব বন্ধুরা এখনও যুক্ত হয়নি!");
    } finally {
      setLoading(false);
    }
  };

  // Active playing logic with Timer hooks
  useEffect(() => {
    if (gameState === "playing" && joinedRoom) {
      const defaultSecs = joinedRoom.secondsPerQuestion || 20;
      // Countdown ticking
      gameIntervalRef.current = setInterval(() => {
        setTimer(p => {
          if (p <= 1) {
            handleNextTurn(null); // Time out
            return defaultSecs;
          }
          return p - 1;
        });
      }, 1000);

      return () => {
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      };
    }
  }, [gameState, currentQIdx]);

  // Record user answers and move to next question index
  const handleNextTurn = async (choiceIndex: number | null) => {
    if (!joinedRoom) return;

    const currentQ = joinedRoom.questions[currentQIdx];
    let nextScore = playerScore;
    if (currentQ && choiceIndex !== null) {
      if (choiceIndex === currentQ.correctIndex) {
        // Correct response earns points + dynamic speed bonus!
        const speedBonus = Math.floor(timer * 1.5);
        nextScore = playerScore + 20 + speedBonus;
        setPlayerScore(nextScore);
      }
    }

    setSelectedOpt(null);
    setTimer(joinedRoom.secondsPerQuestion || 20);

    // Sync live score immediately to server database
    try {
      await fetch(`/api/db/battles/${joinedRoom.id}/update-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: myUserId,
          score: nextScore,
          currentQIdx: currentQIdx + 1
        })
      });
    } catch (err) {
      console.error("Score sync failed", err);
    }

    // Continue to next question or complete exam session
    if (currentQIdx < joinedRoom.questions.length - 1) {
      setCurrentQIdx(p => p + 1);
    } else {
      handleCompleteGame(nextScore);
    }
  };

  // Submit results to Express backend database and wrap up match status
  const handleCompleteGame = async (finalScore: number) => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    
    setGameState("waiting-results");

    if (joinedRoom) {
      try {
        // submit score
        const res = await fetch(`/api/db/battles/${joinedRoom.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: myUserId,
            score: finalScore
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.battle) {
            setJoinedRoom(data.battle);
            if (data.battles) {
              setRooms(data.battles);
            }
            if (data.battle.status === "completed") {
              setGameState("results");
            }
          }
        }
      } catch (err) {
        console.error("Failed submitting final score", err);
      }
    }
  };

  // Close room and return to normal feed
  const handleReturnToLobby = () => {
    setGameState("lobby");
    setJoinedRoom(null);
    fetchRooms();
  };

  // Quick reset database rooms mock trigger
  const handleRestartDatabaseRooms = async () => {
    setLoading(true);
    try {
      await fetch("/api/db/battles/reset", { method: "POST" });
      fetchRooms();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* 1. MAIN ROOM LOBBY / DISCOVERY FEED */}
      {gameState === "lobby" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Left Discovery Feed - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Banner section matching screenshot */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Pink icon frame with Swords */}
                    <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center border border-pink-100 dark:border-pink-900/60 shadow-sm">
                      <Swords className="w-5.5 h-5.5 text-pink-500 shrink-0" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Battle Exam</h2>
                  </div>
                  <p className="text-slate-500 text-xs font-semibold">বন্ধুদের সাথে MCQ battle করো!</p>
                </div>
                
                {/* Simulated Red Live Pulse Badge */}
                <span className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0" />
                  LIVE
                </span>
              </div>

              {/* Action columns row - Pink (Create) vs Blue (Join) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                
                {/* Create/New battle box (pink theme) */}
                <div 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-pink-50/40 dark:bg-pink-950/10 hover:bg-pink-50 dark:hover:bg-pink-950/20 border border-pink-100/60 dark:border-pink-900/30 p-5 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-[0.98] group hover:border-pink-400/40"
                >
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 group-hover:text-pink-600 transition-colors">নতুন Battle</h3>
                  <p className="text-[10px] text-slate-400 mt-1">battle তৈরি করো</p>
                </div>

                {/* Join code box (blue theme) */}
                <div 
                  onClick={() => setShowJoinDialog(true)}
                  className="bg-sky-50/40 dark:bg-sky-950/10 hover:bg-sky-50 dark:hover:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/30 p-5 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-[0.98] group hover:border-sky-400/40"
                >
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 group-hover:text-sky-600 transition-colors">Join করো</h3>
                  <p className="text-[10px] text-slate-400 mt-1">code দিয়ে join করো</p>
                </div>

              </div>
            </div>

            {/* Sub-tab selection bar pill layout */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-full items-center max-w-sm border border-slate-200/40 dark:border-slate-800/60 shadow-sm">
              <button
                onClick={() => setActiveSubTab("feed")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 select-none ${
                  activeSubTab === "feed"
                    ? "bg-slate-950 dark:bg-slate-800 text-slate-100 font-extrabold shadow"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeSubTab === "feed" ? "bg-red-400" : "bg-transparent"} shrink-0`} />
                Live Feed
              </button>
              <button
                onClick={() => setActiveSubTab("my")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 select-none ${
                  activeSubTab === "my"
                    ? "bg-slate-950 dark:bg-slate-800 text-slate-100 font-extrabold shadow"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
                }`}
              >
                My Battles
              </button>
            </div>

            {/* Render sub-tab views */}
            {activeSubTab === "feed" ? (
              <div className="space-y-4">
                {rooms.filter(r => r && r.status !== "completed").length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো সক্রিয় কুইজ লড়াই খালি নেই</h3>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">বর্তমানে কোনো স্টুডেন্ট পরীক্ষা শুরু করেনি। আপনি চাইলে উপরের "নতুন Battle" বক্সে ক্লিক করে প্রথম লড়াই সেশন শুরু করতে পারেন!</p>
                  </div>
                ) : (
                  rooms.filter(r => r && r.status !== "completed").map((room) => {
                    const isClosed = room.status !== "open";
                    return (
                      <div 
                        key={room.id}
                        className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        {/* Upper Details container element */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                              {room.subject}
                            </h3>
                            <div className="text-right">
                              <span className="text-[9px] bg-emerald-50 text-[#059669] font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-100">
                                {room.status === "open" ? "Open" : room.status === "active" ? "Running" : "Finished"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-1">Ranked</span>
                            </div>
                          </div>

                          <p className="text-slate-500 font-medium text-xs">
                            {room.totalQuestions} প্রশ্ন • {room.secondsPerQuestion}s/প্রশ্ন • {room.players.length}/{room.maxPlayers} জন
                          </p>

                          {/* Joined participants row details matching user's image layout */}
                          <div className="space-y-2">
                            {room.players.map((plr, iIdx) => (
                              <div 
                                key={plr.id || iIdx}
                                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 px-4 py-2.5 rounded-xl text-xs"
                              >
                                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 text-[#059669] font-bold flex items-center justify-center text-xs">
                                  {plr.avatarInitials}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 font-medium font-bengali">
                                  <strong className="text-slate-800 dark:text-slate-150 font-bold">{plr.name}</strong> battle দিচ্ছে
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Wide Join Battle Footer button precisely matches screenshot */}
                        <button
                          onClick={() => handleResumeOrJoinRoom(room)}
                          disabled={isClosed}
                          className={`w-full py-3.5 ${
                            isClosed 
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed font-medium" 
                              : "bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 text-white font-extrabold active:scale-[0.99]"
                          } text-xs tracking-wide transition-all border-t border-slate-100 dark:border-slate-855 flex items-center justify-center gap-2`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                          Join Battle
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.filter(r => r && r.players && r.players.some(p => p && p.id === myUserId)).length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-10 text-center text-xs text-slate-400">
                    <p className="font-bengali">আপনি এখনো কুইজ ব্যাটেলে অংশ নেননি।</p>
                    <button
                      onClick={() => setActiveSubTab("feed")}
                      className="mt-4 px-4 py-2 bg-[#ecf6f3] text-[#059669] hover:bg-emerald-100 transition-all rounded-xl font-bold font-bengali"
                    >
                      অন্যদের লাইভ চেক করুন
                    </button>
                  </div>
                ) : (
                  rooms.filter(r => r && r.players && r.players.some(p => p && p.id === myUserId)).map((room) => {
                    const isCompleted = room.status === "completed";
                    const isRunning = room.status === "active";
                    return (
                      <div 
                        key={room.id}
                        className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        {/* Upper Details container element */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                              {room.subject}
                            </h3>
                            <div className="text-right">
                              <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                                isCompleted 
                                  ? "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" 
                                  : isRunning 
                                    ? "bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40" 
                                    : "bg-emerald-50 text-[#059669] border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                              }`}>
                                {room.status === "open" ? "Open" : room.status === "active" ? "Running" : "Finished"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-1">My Match</span>
                            </div>
                          </div>

                          <p className="text-slate-500 font-medium text-xs">
                            {room.totalQuestions} প্রশ্ন • {room.secondsPerQuestion}s/প্রশ্ন • {room.players.length}/{room.maxPlayers} জন
                          </p>

                          {/* Joined participants row details matching user's image layout */}
                          <div className="space-y-2">
                            {room.players.map((plr, iIdx) => (
                              <div 
                                key={plr.id || iIdx}
                                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 px-4 py-2.5 rounded-xl text-xs"
                              >
                                <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${
                                  plr.id === myUserId
                                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                                    : "bg-emerald-100 dark:bg-emerald-950/30 text-[#059669]"
                                }`}>
                                  {plr.avatarInitials}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 font-medium font-bengali">
                                  <strong className="text-slate-800 dark:text-slate-150 font-bold">{plr.name}</strong> {plr.id === myUserId ? " (আপনি)" : "battle দিচ্ছে"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resume / View button */}
                        <button
                          onClick={() => handleResumeOrJoinRoom(room)}
                          className="w-full py-3.5 bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs tracking-wide transition-all border-t border-slate-100 dark:border-slate-855 flex items-center justify-center gap-2 active:scale-[0.99] font-bengali"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          {isCompleted
                            ? "ফলাফল দেখুন (View Results)"
                            : isRunning
                              ? "লড়াইয়ে ফিরুন (Resume Battle)"
                              : "লবিতে প্রবেশ করুন (Enter Lobby)"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right Instruction and Status bar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Box 1: কীভাবে খেলবে? */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-850">
                <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-2 select-none">
                  ⚔️ কীভাবে খেলবে?
                </h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex gap-4.5 items-start">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-xs font-black flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Battle Create করো</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Subject, mode, questions বেছে নাও</p>
                  </div>
                </div>

                <div className="flex gap-4.5 items-start">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-xs font-black flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">বন্ধুকে Invite করো</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Code বা link শেয়ার করো</p>
                  </div>
                </div>

                <div className="flex gap-4.5 items-start">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-xs font-black flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Real-time লড়াই</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">MCQ answer করো দ্রুত</p>
                  </div>
                </div>

                <div className="flex gap-4.5 items-start">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-xs font-black flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">Winner হও!</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">বেশি score = winner 🏆</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Battle Types */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-850">
                <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-2 select-none">
                  🎯 BATTLE TYPES
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850">
                  <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300">Friendly</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-normal">No EXP change — just for fun</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-900/30">
                  <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">Ranked</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-normal">Win to gain EXP</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/30">
                  <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">High Stakes</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-normal">Double EXP — High risk!</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. MATCH INSIDE ROOM WAITING LOBBY */}
      {gameState === "inside-room" && joinedRoom && (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto px-4">
          
          {/* Top Header Row of Battle Lobby */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleReturnToLobby}
                className="w-10 h-10 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 font-bengali">
                  Battle Lobby
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Competitive Exam Room
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Dynamic Live pill */}
              <span className="flex items-center gap-1.5 bg-[#f0fdf4] dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-[#16a34a] dark:text-emerald-400 font-bold text-[10.5px] px-3.5 py-1.5 rounded-full uppercase tracking-wider select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
                LIVE
              </span>
              
              <button
                onClick={handleReturnToLobby}
                className="px-4.5 py-2.5 border border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20 text-red-500 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 font-bengali"
              >
                বাতিল
              </button>
            </div>
          </div>

          {/* Two-Column Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* Left Column: 8 space width */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Windows 11 style Dark Hero Battle Room Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 25 }}
                className="relative bg-slate-950 dark:bg-neutral-950 text-white p-8 rounded-[32px] overflow-hidden shadow-xl border border-slate-900 flex flex-col justify-between min-h-[240px]"
              >
                {/* Visual subtle reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-slate-500/10 blur-3xl pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    BATTLE ROOM
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-bengali mt-2">
                    {joinedRoom.subject}
                  </h1>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] font-bold bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md">
                      {joinedRoom.totalQuestions} প্রশ্ন
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md">
                      {joinedRoom.secondsPerQuestion}s/প্রশ্ন
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md">
                      Friendly Match
                    </span>
                  </div>
                </div>

                {/* Bottom Stats Container Grid */}
                <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10 mt-8 relative z-10 text-center sm:text-left">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white block">
                      {joinedRoom.totalQuestions}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold block mt-1 font-bengali">
                      প্রশ্ন
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white block">
                      {joinedRoom.secondsPerQuestion}s
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold block mt-1 font-bengali">
                      প্রতি প্রশ্ন
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white block">
                      {joinedRoom.players.length}/{joinedRoom.maxPlayers}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold block mt-1 font-bengali">
                      খেলোয়াড়
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 2. Detailed Match Info List */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-[28px] shadow-sm space-y-4"
              >
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
                  Match Info
                </h3>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-850">
                  <div className="flex justify-between items-center py-3.5 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-bold font-bengali">বিষয়</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold font-bengali">
                      {joinedRoom.subject}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3.5 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-bold font-bengali">অধ্যায়</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold font-bengali">
                      {joinedRoom.chapter === "সব" ? "সব অধ্যায়" : joinedRoom.chapter}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3.5 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-bold font-bengali">ধরণ</span>
                    <span className="text-slate-850 dark:text-slate-200 font-extrabold font-bengali flex items-center gap-1.5">
                      Friendly Match
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3.5 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-bold font-bengali">পুরস্কার</span>
                    <span className="text-[#059669] dark:text-emerald-400 font-extrabold font-bengali flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      XP + Badge
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: 4 space width */}
            <div className="lg:col-span-4 space-y-6">

              {/* 1. Battle Code Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.15 }}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-[28px] shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Battle Code
                  </h4>
                  {/* Share badge */}
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-2.5 py-1 rounded-lg">
                    শেয়ার করো
                  </span>
                </div>

                {/* Simulated Display Input Code */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 text-center relative overflow-hidden group">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest mb-1 select-none">
                    CODE
                  </span>
                  <span className="text-2xl font-black font-mono tracking-widest text-slate-850 dark:text-white block pt-1 select-all">
                    BTL-{joinedRoom.id.toUpperCase()}
                  </span>
                </div>

                {/* Copy Buttons Row */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={handleCopyCode}
                    className="py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-850 text-slate-705 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-150 dark:border-indigo-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    {copiedCode ? "Copied!" : "Code Copy"}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="py-3 bg-slate-950 hover:bg-slate-900 dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Link className="w-3.5 h-3.5 text-slate-300" />
                    {copiedLink ? "Copied!" : "Link Copy"}
                  </button>
                </div>
              </motion.div>

              {/* 2. Participants Card with Monogram Boxes */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 25, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-[28px] shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 font-bengali">
                      অংশগ্রহণকারী
                    </h4>
                    <span className="text-[10.5px] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-bold text-slate-500 font-mono">
                      {joinedRoom.players.length}/{joinedRoom.maxPlayers}
                    </span>
                  </div>
                  
                  {/* + Add Friend button */}
                  <button
                    onClick={handleCopyLink}
                    className="text-xs font-extrabold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 transition-colors relative cursor-pointer font-bengali"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    বন্ধু যোগ
                  </button>
                </div>

                {/* List of active room players */}
                <div className="space-y-3.5">
                  {(joinedRoom.players || []).filter(p => p && p.id).map((plyr, idx) => {
                    const isMe = plyr.name === (stats?.name || "User").split(" ")[0];
                    return (
                      <div
                        key={plyr.id || idx}
                        className="relative flex items-center justify-between bg-slate-50/70 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850/60"
                      >
                        {plyr.shout && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="absolute -top-7 left-6 bg-slate-900 dark:bg-zinc-800 border border-slate-850 dark:border-zinc-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md font-bengali z-10 select-none"
                          >
                            {plyr.shout}
                            <div className="absolute top-[100%] left-[15%] border-4 border-transparent border-t-slate-900 dark:border-t-zinc-800" />
                          </motion.div>
                        )}

                        <div className="flex items-center gap-3">
                          {/* Premium Windows 11 sleek avatar frame */}
                          <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center font-mono font-black text-xs shrink-0 shadow animate-fade-in">
                            {plyr.avatarInitials || (plyr.name ? plyr.name[0] : "?")}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-150">
                              {plyr.name} {isMe && <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal font-bengali">(তুমি)</span>}
                            </h5>
                            <span className="text-[10px] text-emerald-500 font-semibold block uppercase tracking-wider mt-0.5 font-bengali">
                              Ready
                            </span>
                          </div>
                        </div>

                        {/* Bullets State Indicator on Right side */}
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-100/40 text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          READY
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty state slots for multiplayer waiting */}
                  {Array.from({ length: Math.max(0, joinedRoom.maxPlayers - joinedRoom.players.length) }).map((_, slotIdx) => (
                    <div
                      key={slotIdx}
                      className="flex items-center justify-between border border-dashed border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-[11px] text-slate-400 dark:text-slate-500 bg-transparent animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs shrink-0 select-none">
                          ?
                        </div>
                        <span className="font-bengali font-semibold">সহপাঠী বন্ধুর প্রতীক্ষায়...</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-md">
                        WAITING
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Shout Chips Card for Direct Interaction */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 mt-4">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5 font-bengali">
                    তাৎক্ষণিক কথা বলুন (Quick Shout)
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "আসসালামু আলাইকুম! 👋",
                      "আমি প্রস্তুত! 🔥",
                      "শুভকামনা! 👍",
                      "এসো শুরু করি 🚀",
                      "জিতবো আমিই! 👑",
                      "দারুণ লড়াই হবে! ⚔️"
                    ].map((shoutText) => (
                      <button
                        key={shoutText}
                        onClick={async () => {
                          try {
                            setJoinedRoom(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                players: prev.players.map(p => p.id === myUserId ? { ...p, shout: shoutText } : p)
                              };
                            });
                            await fetch(`/api/db/battles/${joinedRoom.id}/shout`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ playerId: myUserId, shout: shoutText })
                            });
                          } catch (err) {
                            console.error("Shout message error", err);
                          }
                        }}
                        className="px-2 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold rounded-lg border border-slate-150 dark:border-slate-800 transition-all cursor-pointer active:scale-95 font-bengali"
                      >
                        {shoutText}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 3. Action Play Start Match Button with Strict Player Counts */}
              {joinedRoom.players.length >= joinedRoom.maxPlayers ? (
                <motion.button
                  onClick={handleStartMatchServer}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Swords className="w-4 h-4 animate-bounce" />
                  <span className="font-bengali">Battle শুরু করো →</span>
                </motion.button>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-extrabold text-xs tracking-wide rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
                  >
                    <Hourglass className="w-4 h-4 animate-spin" />
                    <span className="font-bengali">সহপাঠীর প্রতীক্ষায়... ({joinedRoom.players.length}/{joinedRoom.maxPlayers})</span>
                  </button>
                  <p className="text-[10.5px] text-center text-slate-400 dark:text-slate-500 font-semibold font-bengali leading-relaxed leading-[1.3] px-2">
                    ম্যাচ আরম্ভ করতে কমপক্ষে {joinedRoom.maxPlayers} জন প্রতিযোগী রুমে যুক্ত থাকতে হবে। সবাইকে এই লিংক বা কোড শেয়ার করে যোগ হতে বলো!
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* 3. ACTIVE FIGHT GAMEPLAY COMPONENT */}
      {gameState === "playing" && joinedRoom && joinedRoom.questions[currentQIdx] && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          
          {/* Fighters Scoreboards header */}
          <div className="grid grid-cols-3 gap-4 items-center bg-white dark:bg-slate-900 px-6 py-5 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-sm">
            
            {/* Player details */}
            <div className="text-left space-y-1 bg-transparent">
              <span className="text-xs font-bold text-[#059669] block truncate">{(stats?.name || "User").split(" ")[0]} (তুমি)</span>
              <div className="text-lg font-black text-slate-850 dark:text-slate-100">{playerScore} pts</div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-[#059669] h-full transition-all duration-300" style={{ width: `${Math.min(100, playerScore / 3)}%` }} />
              </div>
            </div>

            {/* Timer and Round Clock info */}
            <div className="text-center flex flex-col items-center justify-center">
              <span className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-500 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full block tracking-wider uppercase mb-2 animate-pulse">
                ROUND {currentQIdx + 1}
              </span>
              <div className="w-11 h-11 rounded-full bg-slate-950 text-white flex items-center justify-center text-sm font-black font-mono">
                {timer}s
              </div>
            </div>

            {/* Simulated competitor progress state */}
            <div className="text-right space-y-1 bg-transparent">
              {(joinedRoom.players || []).filter(p => p && p.name && p.name !== (stats?.name || "User").split(" ")[0]).slice(0, 1).map((plr) => {
                const competitorScore = opponentsProgress[plr.id] || 0;
                return (
                  <div key={plr.id} className="bg-transparent space-y-1">
                    <span className="text-xs font-bold text-indigo-500 block truncate">{plr.name} (প্রতিযোগী)</span>
                    <div className="text-lg font-black text-slate-850 dark:text-slate-100">{competitorScore} pts</div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, competitorScore / 3)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Active Question Panel display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-3 py-1.5 rounded-full uppercase tracking-wider">
                MCQ কুইজ {currentQIdx + 1} of {joinedRoom.questions.length}
              </span>
              <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-50 dark:bg-emerald-950 px-3.5 py-1.5 rounded-full">
                {joinedRoom.subject}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed pt-6 pb-8">
              {joinedRoom.questions[currentQIdx].questionText}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {joinedRoom.questions[currentQIdx].options.map((opt: string, oI: number) => {
                const isSelected = selectedOpt === oI;
                return (
                  <motion.button
                    key={oI}
                    whileHover={{ scale: 1.015, y: -0.5 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      if (selectedOpt !== null) return; // prevent double taps
                      setSelectedOpt(oI);
                      // proceed to record option immediately
                      setTimeout(() => {
                        handleNextTurn(oI);
                      }, 400);
                    }}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-3.5 shadow-sm relative overflow-hidden cursor-pointer duration-150 ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 dark:bg-indigo-600 dark:border-indigo-600 text-white font-black translate-x-1 shadow-lg shadow-indigo-500/15"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6.5 h-6.5 rounded-xl flex items-center justify-center text-[11px] font-mono font-black shrink-0 transition-colors ${
                        isSelected 
                          ? "bg-white text-indigo-600 animate-pulse" 
                          : "bg-slate-200/50 dark:bg-slate-800 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + oI)}
                      </span>
                      <span className="font-semibold leading-relaxed">{opt}</span>
                    </div>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="w-5 h-5 rounded-full bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 4. WAITING FOR Competitors DISPLAY */}
      {gameState === "waiting-results" && joinedRoom && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-8 md:p-12 rounded-3xl max-w-xl mx-auto text-center space-y-6 animate-fade-in shadow-sm">
          <div className="space-y-3">
            <div className="inline-flex w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border border-indigo-200/40 items-center justify-center">
              <Hourglass className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-bengali">সহপাঠীদের জন্য অপেক্ষা করা হচ্ছে...</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bengali leading-relaxed leading-[1.45]">
              আপনি সফলভাবে পরীক্ষা শেষ করেছেন! অন্যান্য প্রতিযোগীরা এখনও কুইজ সম্পন্ন করছেন। সবাই সাবমিট করলে চূড়ান্ত ফলাফল এখানে দেখা যাবে।
            </p>
          </div>

          {/* Real-time competitor tracking scoreboard */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider text-left font-bengali border-b border-slate-200/50 dark:border-slate-800/50 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              লাইভ প্রতিযোগী স্কোরবোর্ড (Live Standing)
            </h4>

            <div className="space-y-2.5">
              {(joinedRoom.players || []).filter(p => p && p.id).map((plyr, idx) => {
                const isMe = plyr.id === myUserId;
                const progressPercent = plyr.finished
                  ? 100
                  : Math.min(100, Math.floor(((plyr.currentQIdx || 0) / (joinedRoom.totalQuestions || 5)) * 100));

                return (
                  <div
                    key={plyr.id || idx}
                    className={`flex flex-col gap-2 p-3 rounded-xl border ${
                      isMe 
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center font-mono font-black text-[10px]">
                          {plyr.avatarInitials || (plyr.name ? plyr.name[0] : "?")}
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 font-bengali">
                          {plyr.name || "সহপাঠী"} {isMe && <span className="text-[10px] font-semibold text-indigo-500 font-bengali">(আপনি)</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">
                          {plyr.score || 0} pts
                        </span>
                        {plyr.finished ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full font-bengali flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> সম্পন্ন ✅
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full font-bengali">
                            পরীক্ষা দিচ্ছে... 📝
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-400 font-semibold font-bengali">
                        <span>প্রশ্ন ট্র্যাকিং</span>
                        <span>{plyr.finished ? "সম্পূর্ণ" : `${plyr.currentQIdx || 0}/${joinedRoom.totalQuestions} টি`}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${plyr.finished ? "bg-emerald-500" : "bg-indigo-500"}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Order - WHO finished when */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl text-left space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-bengali pb-1 flex items-center gap-1.5">
              🏆 পরীক্ষা সম্পন্ন করার সময়ক্রম (Finished Board)
            </h4>
            
            {(joinedRoom.players || []).some(p => p && (p.finished || p.finishedAt)) ? (
              <div className="space-y-2">
                {(joinedRoom.players || [])
                  .filter(p => p && (p.finished || p.finishedAt))
                  .sort((a, b) => (a.finishedAt || 0) - (b.finishedAt || 0))
                  .map((p, rankIdx) => {
                    const rankNames = ["১ম শেষ করেছেন:", "২য় শেষ করেছেন:", "৩য় শেষ করেছেন:", "৪র্থ শেষ করেছেন:", "৫ম শেষ করেছেন:"];
                    return (
                      <div key={p.id} className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-2.5 rounded-xl">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-bengali">
                          <span className="text-amber-500 font-black mr-1 text-[11px]">{rankIdx + 1}.</span> {rankNames[rankIdx] || `${rankIdx + 1} শেষ করেছেন:`} <strong className="text-slate-800 dark:text-white font-bengali">{p.name || "সহপাঠী"}</strong>
                        </span>
                        <span className="text-xs font-black font-mono text-[#059669] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-lg">
                          {p.score || 0} pts
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic font-bengali text-center py-2 h-10">
                এখনও কেউ পরীক্ষা সম্পন্ন করেননি...
              </p>
            )}
          </div>

          {/* Option to force completed state */}
          <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 p-4 rounded-xl text-center space-y-2">
            <p className="text-[11.5px] text-slate-400 dark:text-slate-500 font-semibold font-bengali leading-snug">
              পারস্পরিক সহপাঠী বন্ধু কি পরীক্ষা অসম্পূর্ণ রেখে চলে গেছেন? অথবা অনেক বিলম্ব হচ্ছে?
            </p>
            <button
              onClick={async () => {
                if (!window.confirm("আপনি কি নিশ্চিতভাবে এই ব্যাটেল ম্যাচটি এখানেই শেষ করতে চান? এতে বর্তমান স্কোরের ভিত্তিতে ফলাফল প্রকাশিত হবে।")) {
                  return;
                }
                try {
                  setLoading(true);
                  const res = await fetch(`/api/db/battles/${joinedRoom.id}/force-complete`, {
                    method: "POST"
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                      setJoinedRoom(data.battle);
                      setGameState("results");
                    }
                  }
                } catch (e) {
                  console.error(e);
                } finally {
                  setLoading(false);
                }
              }}
              className="py-1.5 px-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 font-bengali"
            >
              জোরপূর্বক ম্যাচ শেষ করুন এবং ফলাফল দেখুন ⚔️
            </button>
          </div>
        </div>
      )}

      {/* 4. RESULTS FINALS DISPLAY */}
      {gameState === "results" && joinedRoom && (() => {
        const otherPlayers = (joinedRoom.players || []).filter(p => p && p.id !== myUserId);
        const maxOpponentScore = otherPlayers.length > 0
          ? Math.max(...otherPlayers.map(p => p ? (p.score || 0) : 0))
          : 0;
        const isWinner = playerScore >= maxOpponentScore;

        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-8 md:p-12 rounded-3xl max-w-xl mx-auto text-center space-y-6 animate-fade-in shadow-sm">
            
            {isWinner ? (
              <div className="space-y-2">
                <div className="inline-flex w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/45 text-amber-500 border border-amber-200/40 items-center justify-center animate-bounce">
                  <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-[#059669] dark:text-emerald-400 font-bengali">মেগা বিজয়! (VICTORY)</h2>
                <p className="text-xs text-slate-400 font-bengali">অভিনন্দন! চমৎকার দক্ষতায় আপনি আজকের ব্যাটেলে বিজয়ী হয়েছেন!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-100 items-center justify-center">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-rose-500 font-bengali">পরাজয় (DEFEAT)</h2>
                <p className="text-xs text-slate-400 font-bengali">কঠিন প্রতিযোগিতা হয়েছে! পুনরায় চেষ্টা করুন।</p>
              </div>
            )}

            {/* Scores details list */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex justify-around items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-bengali">তোমার স্কোর</span>
                <span className="text-2.5xl font-black text-slate-800 dark:text-slate-100 mt-1 block font-mono">{playerScore} pts</span>
              </div>
              
              <div className="text-slate-350 text-xs font-bold font-mono">VS</div>
              
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block font-bengali">সর্বোচ্চ প্রতিপক্ষ স্কোর</span>
                <span className="text-2.5xl font-black text-slate-500 mt-1 block font-mono">
                  {maxOpponentScore} pts
                </span>
              </div>
            </div>

            {/* Reward badge card */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-150 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 font-bengali">
              <Award className="w-4 h-4 text-[#059669]" />
              <span>সফলতা বোনাস: {isWinner ? "+৪০ XP রিওয়ার্ড অর্জিত হয়েছে!" : "+১৫ XP সান্ত্বনা রিওয়ার্ড অর্জিত হয়েছে!"}</span>
            </div>

            <button
              onClick={handleReturnToLobby}
              className="w-full py-3.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl transition-all cursor-pointer active:scale-95 font-bengali"
            >
              লবিতে ফিরে যান
            </button>
          </div>
        );
      })()}

      {/* 5. POPUP DIALOG: CREATE QUICK BATTLE */}
      <AnimatePresence>
        {showCreateDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 330 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[32px] max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100"
            >
              
              {/* Frosted Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-500 flex items-center justify-center shadow-inner">
                    <Swords className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      নতুন কুইজ ব্যাটেল সেশন
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      CREATE MULTIPLAYER COMBAT ROOM
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateDialog(false)}
                  className="w-10 h-10 border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-all duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 style-scrollbar bg-slate-50/40 dark:bg-slate-950/20">
                
                {/* MODE Selector */}
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      🎮 BATTLE MODE
                    </label>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                      {createMode} mode
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 relative bg-slate-100/70 dark:bg-slate-950/60 p-1.5 rounded-xl">
                    {(["1v1", "Group", "Global"] as const).map((mode) => {
                      const isSelected = createMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setCreateMode(mode);
                            if (mode === "1v1") {
                              setCreateMaxPlayers(2);
                            } else {
                              setCreateMaxPlayers(5);
                            }
                            if (mode === "Global") {
                              setCreateRoomType("Public");
                            }
                          }}
                          className="relative py-2.5 px-2 rounded-lg text-xs font-bold transition-colors duration-150 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeModePill"
                              className="absolute inset-0 bg-white dark:bg-slate-850 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800/40"
                              transition={{ type: "spring", stiffness: 360, damping: 28 }}
                            />
                          )}
                          <span className={`relative z-10 flex items-center gap-1.5 ${
                            isSelected 
                              ? "text-slate-950 dark:text-white font-extrabold" 
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}>
                            {mode === "1v1" ? "⚔️ 1v1" : mode === "Group" ? "👥 Group" : "🌐 Global"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Show maximum players selectors only for Group/Global mode */}
                {createMode !== "1v1" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm animate-in fade-in duration-200"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                        👥 সর্বোচ্চ COMPETING PLAYERS
                      </label>
                      <div className="grid grid-cols-5 gap-2 bg-slate-100/70 dark:bg-slate-950/60 p-1.5 rounded-xl">
                        {([2, 5, 10, 20, 50] as const).map((num) => {
                          const isSelected = createMaxPlayers === num && !customMaxPlayers;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setCreateMaxPlayers(num);
                                setCustomMaxPlayers("");
                              }}
                              className="relative py-2 px-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="activeMaxPlayersPill"
                                  className="absolute inset-0 bg-white dark:bg-slate-850 rounded-md shadow-sm border border-slate-200/40 dark:border-slate-800/30"
                                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                                />
                              )}
                              <span className={`relative z-10 ${
                                isSelected 
                                  ? "text-slate-950 dark:text-white font-extrabold" 
                                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                              }`}>
                                {num}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={createMode === "Global" ? "grid grid-cols-1" : "grid grid-cols-2 gap-4"}>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-bengali">নিজে লিখো</label>
                        <input
                          type="number"
                          placeholder="যেমন- 15"
                          value={customMaxPlayers}
                          onChange={(e) => setCustomMaxPlayers(e.target.value)}
                          className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all dark:text-white"
                        />
                      </div>
                      {createMode !== "Global" && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">ROOM TYPE</label>
                          <div className="grid grid-cols-2 gap-1.5 bg-slate-100/70 dark:bg-slate-950/60 p-1 rounded-xl">
                            {(["Public", "Private"] as const).map((type) => {
                              const isSelected = createRoomType === type;
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setCreateRoomType(type)}
                                  className="relative py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                  {isSelected && (
                                    <motion.div
                                      layoutId="activeRoomTypePill"
                                      className="absolute inset-0 bg-white dark:bg-slate-850 rounded-md shadow-sm border border-slate-200/30 dark:border-slate-800/25"
                                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                                    />
                                  )}
                                  <span className={`relative z-10 flex items-center justify-center gap-1 ${
                                    isSelected 
                                      ? "text-slate-950 dark:text-white font-extrabold" 
                                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                  }`}>
                                    {type === "Public" ? "🌐 Public" : "🔒 Private"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* SUBJECT selection layout reimagined */}
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      📚 বিষয় নির্বাচন
                    </label>
                    <span className="text-[9px] font-extrabold text-pink-500 bg-pink-50 dark:bg-pink-950/30 px-2 py-0.5 rounded-full">
                      REQUIRED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 style-scrollbar border border-slate-100 dark:border-slate-850 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
                    {Object.keys(SUBJECT_CHAPTERS).map((sub) => {
                      const isSelected = createSubject === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setCreateSubject(sub);
                            const list = SUBJECT_CHAPTERS[sub];
                            if (list && list.length > 0) {
                              setCreateChapter(list[0]);
                            } else {
                              setCreateChapter("সব");
                            }
                          }}
                          className="relative p-3 rounded-lg text-xs font-bold text-left truncate transition-colors cursor-pointer"
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeSubjectPill"
                              className="absolute inset-0 bg-slate-900 dark:bg-slate-800 rounded-lg shadow border border-transparent"
                              transition={{ type: "spring", stiffness: 350, damping: 26 }}
                            />
                          )}
                          <span className={`relative z-10 flex items-center gap-1.5 ${
                            isSelected 
                              ? "text-white font-black" 
                              : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white"
                          }`}>
                            <Sparkle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-amber-400 animate-spin-slow" : "text-slate-400"}`} />
                            {sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CHAPTER selection chips container */}
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      📌 অধ্যায় বিবরণ (OPTIONAL)
                    </label>
                    <span className="text-[9px] text-[#059669] bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full font-bold">
                      {createChapter === "সব" ? "পূর্ণাঙ্গ সিলেবাস" : "স্পেসিফিক চ্যাপ্টার"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 style-scrollbar border border-slate-100 dark:border-slate-850 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
                    {(SUBJECT_CHAPTERS[createSubject] || ["সব"]).map((chap) => {
                      const isSelected = createChapter === chap;
                      return (
                        <button
                          key={chap}
                          type="button"
                          onClick={() => setCreateChapter(chap)}
                          className="relative p-3 rounded-lg text-xs font-bold text-left truncate transition-colors cursor-pointer"
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeChapterPill"
                              className="absolute inset-0 bg-slate-900 dark:bg-slate-800 rounded-lg shadow-sm"
                              transition={{ type: "spring", stiffness: 350, damping: 26 }}
                            />
                          )}
                          <span className={`relative z-10 flex items-center gap-1.5 ${
                            isSelected 
                              ? "text-white font-black" 
                              : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white"
                          }`}>
                            <Target className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                            {chap}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Configuration Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* QUESTIONS count horizontal selector */}
                  <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm flex flex-col justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      ❓ প্রশ্ন সংখ্যা
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-100/75 dark:bg-slate-950/60 p-1 rounded-xl">
                      {([10, 20, 30, 50] as const).map((num) => {
                        const isSelected = createNumQs === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCreateNumQs(num)}
                            className="relative py-2.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeNumQsPill"
                                className="absolute inset-0 bg-white dark:bg-slate-850 rounded-md shadow-sm border border-slate-200/30 dark:border-slate-800/25"
                                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                              />
                            )}
                            <span className={`relative z-10 block text-center ${
                              isSelected 
                                ? "text-slate-950 dark:text-white font-extrabold" 
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}>
                              {num}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TIME/QUESTION counts horizontal selector */}
                  <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm flex flex-col justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      ⏱️ সময় প্রতি প্রশ্ন
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 bg-slate-100/75 dark:bg-slate-950/60 p-1 rounded-xl">
                      {([20, 30, 45, 60] as const).map((sec) => {
                        const isSelected = createSecs === sec;
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => setCreateSecs(sec)}
                            className="relative py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeSecsPill"
                                className="absolute inset-0 bg-white dark:bg-slate-850 rounded-md shadow-sm border border-slate-200/30 dark:border-slate-800/25"
                                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                              />
                            )}
                            <span className={`relative z-10 block text-center ${
                              isSelected 
                                ? "text-slate-950 dark:text-white font-extrabold" 
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}>
                              {sec}s
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* STAKES cards */}
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 p-4.5 rounded-[22px] shadow-sm">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    ⚔️ STAKES EXP RATIO
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "Friendly", title: "Friendly Combat", desc: "EXP পরিবর্তনের ঝামেলা নেই — সাধারণ প্র্যাকটিস লড়াই", colorClass: "text-[#059669]", icon: Sparkle },
                      { id: "Ranked", title: "Ranked Battle", desc: "বিজয়ী পাবেন +৪০ EXP ও একটি কুইজ ট্রফি!", colorClass: "text-indigo-500", icon: Trophy },
                      { id: "High Stakes", title: "High Stakes Double EXP", desc: "ডাবল জয় নিশ্চিত করতে ২ গুন্ EXP রিওয়ার্ড!", colorClass: "text-rose-500", icon: Crown }
                    ].map((stake) => {
                      const isSelected = createStakes === stake.id;
                      const IconComp = stake.icon;
                      return (
                        <div
                          key={stake.id}
                          onClick={() => setCreateStakes(stake.id as any)}
                          className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between relative group overflow-hidden ${
                            isSelected
                              ? "bg-slate-950 dark:bg-slate-800 border-transparent shadow shadow-slate-950/20"
                              : "bg-slate-50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3 relative z-10">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                              isSelected 
                                ? "bg-white/10 text-white" 
                                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-350 shadow-sm group-hover:scale-105"
                            }`}>
                              <IconComp className={`w-4.5 h-4.5 ${isSelected ? "text-amber-300" : stake.colorClass}`} />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className={`text-xs font-black transition-colors ${
                                isSelected 
                                  ? "text-white" 
                                  : "text-slate-800 dark:text-slate-200"
                              }`}>
                                {stake.title}
                              </h4>
                              <p className={`text-[10px] font-medium transition-colors ${
                                isSelected 
                                  ? "text-slate-300" 
                                  : "text-slate-400"
                              }`}>
                                {stake.desc}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div 
                              layoutId="activeStakesCheck" 
                              className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg relative z-10"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Sticky Frosted Footer with Create Action Trigger */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-850 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shrink-0">
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="w-full py-4 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white text-white font-black text-xs tracking-widest rounded-2xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-current" />
                      ব্যাটেল রুম তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4 text-pink-500 fill-current animate-bounce" />
                      ব্যাটেল সেশন শুরু করুন
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. POPUP DIALOG: JOIN CODE BATTLE */}
      <AnimatePresence>
        {showJoinDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 330 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[32px] max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 flex items-center gap-2">
                  <Play className="w-5 h-5 text-sky-500 fill-current" />
                  কোড দিয়ে সরাসরি জয়েন করুন
                </h3>
                <button 
                  onClick={() => setShowJoinDialog(false)}
                  className="w-10 h-10 border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-all duration-150 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">রুম অথবা সেশন আইডি</label>
                  <input
                    type="text"
                    placeholder="যেমনঃ battle-gen-01"
                    value={customJoinCode}
                    onChange={(e) => setCustomJoinCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-mono tracking-widest font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <button
                  onClick={() => handleJoinRoom(customJoinCode)}
                  disabled={loading || !customJoinCode}
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 shadow-md active:scale-[0.98]"
                >
                  জয়েন ব্যাটেল কোড
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
