/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { 
  Trophy, Star, Search, Flame, MapPin, HelpCircle, 
  ChevronLeft, ChevronRight, Clock, Shield, Sparkles, 
  User, Zap, Check, X, Crown, Medal
} from "lucide-react";
import { INITIAL_LEADERBOARD } from "../data";
import { StudentStats } from "../types";

interface LeaderboardProps {
  stats: StudentStats;
}

// 8 Leagues definitions with customized descriptions, criteria, and colors
interface LeagueInfo {
  id: number;
  nameBn: string;
  nameEn: string;
  tagline: string;
  promotionText: string;
  countdown: string;
  primaryColor: string;
  badgeBg: string;
  cardBgGradient: string;
  radialCore: string;
  accentText: string;
  badgeGlow: string;
  seedPlayers: typeof INITIAL_LEADERBOARD;
}

export default function Leaderboard({ stats }: LeaderboardProps) {
  const [activeTab, setActiveTab ] = useState<"leagues" | "national" | "fame">("leagues");
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(3); // Default to Gold League (idx 3)
  const [searchTerm, setSearchTerm] = useState("");
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Custom simulation: Allow student to earn simulated points to rank up in the leaderboard!
  const [userPointsOverride, setUserPointsOverride] = useState<number>(0);

  const statsWithOverride = {
    ...stats,
    points: (stats.points || 15) + userPointsOverride,
  };

  // Sound effects simulator
  const playClickFeedback = () => {
    if (typeof window !== "undefined") {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(320, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
        oscillator.stop(audioCtx.currentTime + 0.12);
      } catch (e) {
        // AudioContext browser security blocks are expected/benign
      }
    }
  };

  // Seed competitive, human-like student lists for ALL 8 Leagues!
  // This provides a bustling community atmosphere, making study qoro amazing.
  const LEAGUE_DATA: LeagueInfo[] = [
    {
      id: 1,
      nameBn: "ব্রোঞ্জ লীগ",
      nameEn: "Bronze League",
      tagline: "আপনার শিক্ষাসফর শুরু করুন! প্রথম পদার্পণকারী শিক্ষার্থীদের লীগ।",
      promotionText: "শীর্ষ ২০% পরবর্তী সিলভার লীগ এ উন্নীত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-amber-700 to-amber-900 border-amber-600",
      badgeBg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600",
      cardBgGradient: "from-amber-950 via-amber-900 to-amber-950 text-amber-100",
      radialCore: "rgba(180, 83, 9, 0.15)",
      accentText: "text-amber-400",
      badgeGlow: "shadow-amber-500/10",
      seedPlayers: [
        { id: "p1-1", rank: 1, name: "Siam Ahmed", district: "ঢাকা", points: 85, avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", streak: 3 },
        { id: "p1-self", rank: 2, name: `${statsWithOverride.name} (আপনি)`, district: "ঢাকা (guest)", points: statsWithOverride.points, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", streak: statsWithOverride.streak || 1 },
        { id: "p1-2", rank: 3, name: "Tanzila Akter", district: "বরিশাল", points: 15, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", streak: 1 },
        { id: "p1-3", rank: 4, name: "Fahim Faisal", district: "কুমিল্লা", points: 12, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", streak: 0 },
        { id: "p1-4", rank: 5, name: "Prashanta Paul", district: "ময়মনসিংহ", points: 0, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", streak: 0 }
      ]
    },
    {
      id: 2,
      nameBn: "সিলভার লীগ",
      nameEn: "Silver League",
      tagline: "আপনি ধাপে ধাপে এগিয়ে যাচ্ছেন! আপনার প্র্যাক্টিসের ধারাবাহিকতা সফল হচ্ছে।",
      promotionText: "শীর্ষ ২০% পরবর্তী গোল্ড লীগ এ উন্নীত হবে। নীচে ১০% ব্রোঞ্জ লীগে অবনমিত হতে পারে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-slate-400 to-zinc-650 border-slate-350",
      badgeBg: "bg-slate-100 dark:bg-slate-800/40 text-slate-400",
      cardBgGradient: "from-slate-900 via-zinc-800 to-slate-900 text-slate-100",
      radialCore: "rgba(148, 163, 184, 0.15)",
      accentText: "text-slate-300",
      badgeGlow: "shadow-slate-500/10",
      seedPlayers: [
        { id: "p2-1", rank: 1, name: "Alamin Khan", district: "খুলনা", points: 195, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", streak: 7 },
        { id: "p2-2", rank: 2, name: "Farhana Yesmin", district: "দিনাজপুর", points: 180, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", streak: 6 },
        { id: "p2-3", rank: 3, name: "Mehrazul Islam", district: "রংপুর", points: 145, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", streak: 4 },
        { id: "p2-4", rank: 4, name: "Sadia Chowdhury", district: "সিলেট", points: 112, avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", streak: 2 },
        { id: "p2-5", rank: 5, name: "MD Samrat", district: "যশোর", points: 95, avatarUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150", streak: 3 }
      ]
    },
    {
      id: 3,
      nameBn: "গোল্ড লীগ",
      nameEn: "Gold League",
      tagline: "স্বর্ণালী অর্জন! এখানে সাধারণ প্রতিযোগীদের ভিড় ভেঙে সেরারা উঠে আসে।",
      promotionText: "শীর্ষ ২০% পরবর্তী প্লাটিনাম লীগ এ উন্নীত হবে। নীচে ১০% সিলভার লীগে অবমনিত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-yellow-500 to-amber-650 border-yellow-400",
      badgeBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      cardBgGradient: "from-yellow-950 via-amber-900 to-amber-950 text-yellow-105",
      radialCore: "rgba(245, 158, 11, 0.15)",
      accentText: "text-amber-300",
      badgeGlow: "shadow-amber-500/20",
      seedPlayers: [
        { id: "p3-1", rank: 1, name: "Adiya Tabassum", district: "গাজীপুর", points: 345, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", streak: 12 },
        { id: "p3-2", rank: 2, name: "Sayed Hossain", district: "সিলেট", points: 290, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", streak: 8 },
        { id: "p3-3", rank: 3, name: "Nusrat Jahan", district: "বগুড়া", points: 265, avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", streak: 10 },
        { id: "p3-4", rank: 4, name: "Mahmudul Hasan", district: "ফেনী", points: 210, avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", streak: 4 },
        { id: "p3-5", rank: 5, name: "Sanjida Sultana", district: "খুলনা", points: 180, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", streak: 5 }
      ]
    },
    {
      id: 4,
      nameBn: "প্লাটিনাম লীগ",
      nameEn: "Platinum League",
      tagline: "ধীরস্থির ও অকুতোভয়! আপনার এইচএসসি প্র্যাক্টিস চূড়ান্ত লেভেলে এগিয়ে যাচ্ছে।",
      promotionText: "শীর্ষ ২০% পরবর্তী ডায়মন্ড লীগ এ উন্নীত হবে। নীচে ১০% গোল্ড লীগে অবমনিত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-teal-400 to-sky-650 border-teal-350",
      badgeBg: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
      cardBgGradient: "from-slate-900 via-teal-900 to-slate-950 text-teal-100",
      radialCore: "rgba(20, 184, 166, 0.15)",
      accentText: "text-teal-300",
      badgeGlow: "shadow-teal-500/20",
      seedPlayers: [
        { id: "p4-1", rank: 1, name: "Sadia Afrin", district: "টাঙ্গাইল", points: 490, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", streak: 18 },
        { id: "p4-2", rank: 2, name: "Sudipto Sen", district: "চট্টগ্রাম", points: 450, avatarUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150", streak: 14 },
        { id: "p4-3", rank: 3, name: "MD Rafiqul Islam", district: "নারায়ণগঞ্জ", points: 410, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", streak: 9 },
        { id: "p4-4", rank: 4, name: "Tasnim Ahmed", district: "ভোলা", points: 380, avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150", streak: 11 },
        { id: "p4-5", rank: 5, name: "Rakibul Hasan", district: "ঝিনাইদহ", points: 350, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", streak: 12 }
      ]
    },
    {
      id: 5,
      nameBn: "ডায়মন্ড লীগ",
      nameEn: "Diamond League",
      tagline: "হীরক রাজত্ব! প্রগাঢ় আত্মবিশ্বাস আর অদম্য জেদ নিয়ে শিক্ষার্থীরা খেলছে এখানে।",
      promotionText: "শীর্ষ ২০% পরবর্তী এলিট লীগ এ উন্নীত হবে। নীচে ১০% প্লাটিনাম লীগে অবমনিত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-blue-500 to-indigo-650 border-blue-400",
      badgeBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      cardBgGradient: "from-blue-950 via-indigo-950 to-slate-950 text-blue-100",
      radialCore: "rgba(59, 130, 246, 0.15)",
      accentText: "text-blue-300",
      badgeGlow: "shadow-blue-500/25",
      seedPlayers: [
        { id: "p5-1", rank: 1, name: "Fahmida Sultana", district: "পাবনা", points: 680, avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150", streak: 21 },
        { id: "p5-2", rank: 2, name: "Shishir Ahmed", district: "কক্সবাজার", points: 610, avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150", streak: 17 },
        { id: "p5-3", rank: 3, name: "Joy Dutta", district: "হবিগঞ্জ", points: 570, avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150", streak: 15 },
        { id: "p5-4", rank: 4, name: "Rashedul Bari", district: "কুষ্টিয়া", points: 540, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", streak: 12 },
        { id: "p5-5", rank: 5, name: "Moumita Roy", district: "রংপুর", points: 510, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", streak: 10 }
      ]
    },
    {
      id: 6,
      nameBn: "এলিট লীগ",
      nameEn: "Elite League",
      tagline: "অভিজাতদের সেরা সমাবেশ! প্রতিটি প্রশ্নের সঠিক উত্তর দেওয়ার রেসে তীব্র প্রতিযোগিতা।",
      promotionText: "শীর্ষ ২০% পরবর্তী টাইটান লীগ এ উন্নীত হবে। নীচে ১০% ডায়মন্ড লীগে অবমনিত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-emerald-500 to-teal-650 border-emerald-400",
      badgeBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      cardBgGradient: "from-emerald-950 via-teal-950 to-slate-950 text-emerald-100",
      radialCore: "rgba(16, 185, 129, 0.15)",
      accentText: "text-emerald-300",
      badgeGlow: "shadow-emerald-500/25",
      seedPlayers: [
        { id: "p6-1", rank: 1, name: "Prachi Barua", district: "বান্দরবান", points: 890, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", streak: 25 },
        { id: "p6-2", rank: 2, name: "Badol Minji", district: "নওগাঁ", points: 840, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", streak: 22 },
        { id: "p6-3", rank: 3, name: "Ruzana Khan", district: "নাটোর", points: 810, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", streak: 19 },
        { id: "p6-4", rank: 4, name: "OC Gaming (512)", district: "ঢাকা", points: 790, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", streak: 16 },
        { id: "p6-5", rank: 5, name: "Zahid Hasan", district: "চুয়াডাঙ্গা", points: 765, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", streak: 15 }
      ]
    },
    {
      id: 7,
      nameBn: "টাইটান লীগ",
      nameEn: "Titan League",
      tagline: "টাইটানদের সিংহদ্বার! আকাশচুম্বী বুদ্ধিমত্তা ও অসাধারণ প্র্যাক্টিসের যুদ্ধক্ষেত্র।",
      promotionText: "শীর্ষ ২০% অবিনশ্বর সুপ্রিম লীগ এ উন্নীত হবে। নীচে ১০% এলিট লীগে অবমনিত হবে।",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-purple-500 to-indigo-750 border-purple-400",
      badgeBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
      cardBgGradient: "from-purple-950 via-slate-900 to-indigo-950 text-purple-100",
      radialCore: "rgba(139, 92, 246, 0.15)",
      accentText: "text-purple-300",
      badgeGlow: "shadow-purple-500/25",
      seedPlayers: [
        { id: "p7-1", rank: 1, name: "Siam Hussain", district: "সিলেট", points: 1250, avatarUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150", streak: 35 },
        { id: "p7-2", rank: 2, name: "Niaz Morshed", district: "নোয়াখালী", points: 1190, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", streak: 28 },
        { id: "p7-3", rank: 3, name: "Israt Binte UI", district: "কুমিল্লা", points: 1120, avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", streak: 30 },
        { id: "p7-4", rank: 4, name: "Mashrafe Norko", district: "নড়াইল", points: 1050, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", streak: 24 },
        { id: "p7-5", rank: 5, name: "Rifat Chowdhury", district: "চট্টগ্রাম", points: 980, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", streak: 21 }
      ]
    },
    {
      id: 8,
      nameBn: "সুপ্রিম লীগ",
      nameEn: "Supreme League",
      tagline: "চূড়ান্ত সিংহাসন! সর্বকালের সেরা পরীক্ষার্থীদের জন্য বরাদ্দ করা স্বর্গরাজ্য।",
      promotionText: "এইটি হচ্ছে সর্বোচ্চ লীগ। টিকে থাকুন ও 'হল অব ফেম' এ নিজের নাম অমর করুন!",
      countdown: "৫ দিন বাকি",
      primaryColor: "from-amber-400 via-rose-500 to-purple-800 border-amber-400",
      badgeBg: "bg-orange-100 text-orange-600 dark:bg-amber-950/40 dark:text-amber-400",
      cardBgGradient: "from-zinc-950 via-slate-900 to-indigo-950 text-slate-100",
      radialCore: "rgba(245, 158, 11, 0.2)",
      accentText: "text-amber-400 font-extrabold animate-pulse",
      badgeGlow: "shadow-amber-500/30",
      seedPlayers: [
        { id: "p8-1", rank: 1, name: "Anisur Rahman", district: "সাতক্ষীরা", points: 1950, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", streak: 53 },
        { id: "p8-2", rank: 2, name: "Shahriar Shakil", district: "পিরোজপুর", points: 1820, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150", streak: 48 },
        { id: "p8-3", rank: 3, name: "Zarin Subah", district: "ঢাকা", points: 1780, avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", streak: 42 },
        { id: "p8-4", rank: 4, name: "Kamrul Hasan Chowdhury", district: "ফরিদপুর", points: 1650, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", streak: 39 },
        { id: "p8-5", rank: 5, name: "Fatema Tuz Zohra", district: "কুড়িগ্রাম", points: 1590, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", streak: 35 }
      ]
    }
  ];

  const currentLeague = LEAGUE_DATA.find(l => l.id === selectedLeagueId) || LEAGUE_DATA[0];

  // Helper to scroll the carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLeagueSelect = (id: number) => {
    playClickFeedback();
    setSelectedLeagueId(id);
  };

  // Filter criteria for active search term
  const activePlayersList = currentLeague.seedPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNationalList = INITIAL_LEADERBOARD.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto scroll the selected league badge into center on change
  useEffect(() => {
    if (carouselRef.current) {
      const activeElement = carouselRef.current.querySelector(`[data-league-id="${selectedLeagueId}"]`);
      if (activeElement) {
        (activeElement as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedLeagueId]);

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. Header Navigation Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-505 animate-bounce" />
            সাপ্তাহিক স্প্রিন্ট লিডারবোর্ড
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            এইচএসসি ও এডমিশন ওরিয়েন্টেড সহপাঠীদের সাথে প্রতি সপ্তাহে নতুন লীগ লড়াই-এ মেতে উঠুন।
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 self-start md:self-center">
          <button 
            id="tab-leagues"
            onClick={() => { playClickFeedback(); setActiveTab("leagues"); }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === "leagues" 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            লীগ এরিনা (Leagues)
          </button>
          
          <button 
            id="tab-national"
            onClick={() => { playClickFeedback(); setActiveTab("national"); }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === "national" 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            জাতীয় র‍্যাংক (National)
          </button>

          <button 
            id="tab-fame"
            onClick={() => { playClickFeedback(); setActiveTab("fame"); }}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === "fame" 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 font-bold" />
            হল অব ফেম (Season Champions)
          </button>
        </div>
      </div>

      {/* 2. LEAGUE ARENA TAB: Custom League visualizer requested by the user */}
      {activeTab === "leagues" && (
        <div className="space-y-6">
          
          {/* League Interactive Swiper Carousel */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-850 shadow-sm relative overflow-hidden group">
            {/* Background Ambient Aura */}
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 px-1 select-none">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-500" />
                আপনার লীগ নির্বাচন করুন
              </span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="cursor-pointer p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="cursor-pointer p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex items-center gap-6 overflow-x-auto pb-3 pt-2 px-1 scrollbar-none snap-x"
              style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {LEAGUE_DATA.map((league) => {
                const isSelected = selectedLeagueId === league.id;
                return (
                  <button
                    key={league.id}
                    data-league-id={league.id}
                    onClick={() => handleLeagueSelect(league.id)}
                    className={`cursor-pointer flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 min-w-[105px] snap-center shrink-0 ${
                      isSelected 
                        ? `border-slate-850 dark:border-white bg-slate-50 dark:bg-slate-900/60 scale-108 ring-2 ring-emerald-500/30 ${league.badgeGlow}` 
                        : "border-slate-105 dark:border-slate-850 bg-white dark:bg-slate-950 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="relative">
                      {/* Badge Custom vector */}
                      <LeagueBadge leagueId={league.id} className="w-11 h-11" />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black tracking-tight">{league.nameBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Majestic Active League Details Banner */}
          <div className={`relative rounded-3xl p-6 md:p-8 bg-gradient-to-r ${currentLeague.cardBgGradient} border border-slate-250/10 dark:border-slate-800/80 shadow-lg overflow-hidden`}>
            {/* Ambient glossy shine overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" 
                 style={{ backgroundColor: currentLeague.radialCore }} />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Badge & Info Block */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                <div className="p-4 bg-white/10 dark:bg-black/20 rounded-3xl backdrop-blur-md border border-white/15 shadow-xl shrink-0 inline-flex items-center justify-center">
                  <LeagueBadge leagueId={currentLeague.id} className="w-18 h-18 drop-shadow-xl" />
                </div>

                <div className="space-y-2 max-w-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] bg-white/15 dark:bg-black/35 px-2.5 py-1 rounded-full uppercase font-black tracking-widest text-white leading-none">
                      Rank {currentLeague.id}/8
                    </span>
                    <span className="text-xs text-white/80 font-black tracking-tight">
                      {currentLeague.nameEn}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
                    {currentLeague.nameBn}
                  </h2>
                  <p className="text-xs text-white/85 leading-relaxed font-semibold">
                    {currentLeague.tagline}
                  </p>
                </div>
              </div>

              {/* Action and stats columns inside card */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end justify-center md:justify-start gap-4 shrink-0 bg-white/5 dark:bg-black/25 md:bg-transparent p-4 rounded-2xl">
                
                {/* Promo check info */}
                <div className="text-center md:text-right space-y-1">
                  <span className="text-[9px] text-white/50 dark:text-slate-400 font-bold uppercase block tracking-wider">রুলস বা শর্তাবলী</span>
                  <p className="text-[11px] font-extrabold text-white flex items-center justify-center md:justify-end gap-1 select-none">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {currentLeague.promotionText}
                  </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 bg-white/10 dark:bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="font-mono font-black text-amber-300 whitespace-nowrap">{currentLeague.countdown}</span>
                  </div>
                  
                  {/* Help Rules button trigger */}
                  <button 
                    onClick={() => { playClickFeedback(); setShowRulesModal(true); }}
                    className="cursor-pointer inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-900 border border-transparent px-3 py-1.5 rounded-xl text-[11px] font-black shadow transition-all duration-200"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    রুলস দেখুন
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Active League Standings list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            
            {/* List title & district search box */}
            <div className="p-5 border-b border-indigo-50/50 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest select-none block">
                  লীগ টেবিল • LIVE
                </span>
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                  সদস্যদের বর্তমান ক্রমানুসার (মোট {activePlayersList.length} জন)
                </h3>
              </div>
              
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="জেলা বা সহপাঠী খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2.5 text-xs rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-medium"
                />
              </div>
            </div>

            {/* Table or Responsive list containing mock competitive profiles */}
            <div className="overflow-x-auto">
              {activePlayersList.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850 select-none">
                      <th className="py-4 px-6 text-center w-16">স্থান</th>
                      <th className="py-4 px-6">সহপাঠী নাম (District)</th>
                      <th className="py-4 px-6 text-center">স্ট্রিক</th>
                      <th className="py-4 px-6 text-right">XP পয়েন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850/40 font-semibold">
                    {activePlayersList.map((player, index) => {
                      const isSelf = player.id === "p1-self" || player.isSelf;
                      const displayRank = index + 1;
                      
                      return (
                        <tr 
                          key={player.id} 
                          className={`hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-all duration-150 ${
                            isSelf ? "bg-emerald-500/5 border-l-4 border-l-emerald-500" : ""
                          }`}
                        >
                          {/* Rank column */}
                          <td className="py-4 px-6 text-center select-none">
                            <div className="flex items-center justify-center">
                              {displayRank === 1 ? (
                                <div className="relative inline-flex items-center justify-center">
                                  <Crown className="w-5 h-5 text-amber-500 animate-pulse fill-current" />
                                  <span className="absolute -bottom-1.5 text-[8.5px] font-black text-amber-700 px-1 rounded-full bg-amber-100 dark:bg-amber-950 dark:text-amber-400">১ম</span>
                                </div>
                              ) : displayRank === 2 ? (
                                <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-black">২য়</span>
                              ) : displayRank === 3 ? (
                                <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30 text-amber-800 dark:text-amber-400 text-[11px] font-black">৩য়</span>
                              ) : (
                                <span className="font-mono text-xs text-slate-400 block font-bold">#{displayRank}</span>
                              )}
                            </div>
                          </td>

                          {/* Profile details */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img 
                                  src={player.avatarUrl} 
                                  className={`w-9 h-9 rounded-full object-cover border-2 ${
                                    isSelf ? "border-emerald-500" : "border-slate-150 dark:border-slate-805"
                                  }`} 
                                  alt={player.name}
                                  referrerPolicy="no-referrer"
                                />
                                {/* Simulated green online dot */}
                                {displayRank % 3 !== 0 && (
                                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <h4 className={`text-xs font-black flex items-center gap-1.5 ${
                                  isSelf ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-850 dark:text-slate-100"
                                }`}>
                                  {player.name}
                                  {isSelf && (
                                    <span className="text-[8.5px] bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase font-black tracking-wider leading-none">
                                      YOU
                                    </span>
                                  )}
                                  {player.points > 1000 && (
                                    <Sparkles className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                                  )}
                                </h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 leading-none select-none">
                                  <MapPin className="w-3 h-3 text-slate-300 dark:text-slate-650 shrink-0" />
                                  {player.district}
                                  {displayRank <= 2 && (
                                    <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-extrabold uppercase">
                                      League Leader
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Streak */}
                          <td className="py-4 px-6 text-center select-none font-mono">
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-xl text-[11px] font-bold">
                              <Flame className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse" />
                              {player.streak}
                            </span>
                          </td>

                          {/* XP points */}
                          <td className="py-4 px-6 text-right font-mono font-extrabold">
                            <span className={`text-xs ${
                              displayRank <= 3 
                                ? "text-emerald-600 dark:text-emerald-400 font-black" 
                                : "text-slate-700 dark:text-slate-350"
                            }`}>
                              {player.points} XP
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 px-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400">
                    <HistoryLogIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">কোনো প্রতিযোগী পাওয়া যায়নি</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                      দুঃখিত, সম্ভবত অনুসন্ধানী শব্দ জেলা বা নামের বানানের সাথে মেলেনি। দয়া করে সঠিক বানান দিয়ে সার্চ করুন।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Custom Gamified Simulator Component: Practice to Gain Points! */}
          <div className="bg-linear-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[9.5px] bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase font-black tracking-wider inline-block">
                🚀 লাইভ গ্যামিফিকেশন হ্যাক
              </span>
              <h3 className="text-sm font-black text-slate-905 dark:text-slate-100">
                আপনি কি ব্রোঞ্জ লীগে ১ নম্বর স্থানে উন্নীত হতে চান?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                সাধারণত স্টাডি কুইজ সমাপ্ত করলে অথবা প্রশ্নের সঠিক উত্তর দিলে আপনি XP লাভ করেন। আমাদের ইন্টারেক্টিভ সিমুলেশনে, নিচের "স্টাডি করুন" বাটনটি ক্লিক করলেই আপনি ১২ XP লাভ করবেন এবং লাইভ র‍্যাংক বোর্ডে তাৎক্ষণিক পরিবর্তন দেখতে পাবেন!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0 select-none">
              <button
                onClick={() => {
                  playClickFeedback();
                  setUserPointsOverride(prev => prev + 12);
                  if (selectedLeagueId !== 1) {
                    setSelectedLeagueId(1); // Auto-navigate to Bronze League to show the user's live rank change!
                  }
                }}
                className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-emerald-600/20 text-xs px-5 py-3 rounded-2xl font-black flex items-center gap-1.5 hover:scale-[1.03] transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-current text-yellow-300 shrink-0" />
                ১২ XP ক্লেইম করুন (+১ কুইজ)
              </button>

              <button
                onClick={() => {
                  playClickFeedback();
                  setShowRulesModal(true);
                }}
                className="cursor-pointer bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 text-xs px-5 py-3 rounded-2xl font-bold flex items-center gap-1.5"
              >
                লীগে টিকে থাকার নিয়মাবলী
              </button>
            </div>
          </div>

        </div>
      )}

      {/* NATIONAL RANKING TAB: Maintaining and polishing the original global ranking structure */}
      {activeTab === "national" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg select-none">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="max-w-xl space-y-2 relative">
              <span className="text-[10px] bg-white/20 border border-white/10 px-3.5 py-1.5 rounded-full font-black tracking-wider uppercase tracking-widest inline-block leading-none">
                🏆 সমগ্র বাংলাদেশ র‍্যাংক
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight pt-1">National Study Rank board</h2>
              <p className="text-xs text-teal-50 shadow-xs leading-relaxed font-semibold">
                সারাদেশের হাজার হাজার এইচএসসি ও এডমিশন যোদ্ধাদের সাথে সরাসরি প্রতিযোগিতায় নিজের সেরা মূল্যায়ন করুন।
              </p>
            </div>
          </div>

          {/* Beautiful 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-4xl mx-auto">
            
            {/* National Rank #2 Podium */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-sm order-2 md:order-1 transition hover:shadow-md">
              <div className="relative inline-block">
                <img 
                  src={INITIAL_LEADERBOARD[1]?.avatarUrl} 
                  alt="Rank 2"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-slate-200/80 shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[9.5px] font-black px-3 py-1 rounded-full border border-white dark:border-slate-850">
                  #২য় স্থান
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{INITIAL_LEADERBOARD[1]?.name}</h3>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold">
                  <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                  {INITIAL_LEADERBOARD[1]?.district}
                </p>
              </div>

              <div className="flex justify-around items-center pt-3 border-t border-slate-50 dark:border-slate-850/60 text-[11px] select-none font-semibold">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">জড়িত স্কোর</span>
                  <strong className="text-slate-700 dark:text-slate-250 font-extrabold">{INITIAL_LEADERBOARD[1]?.points || 277} XP</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">স্ট্রিক</span>
                  <strong className="text-amber-500 font-black flex items-center justify-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                    {INITIAL_LEADERBOARD[1]?.streak || 15}
                  </strong>
                </div>
              </div>
            </div>

            {/* National Rank #1 Podium (Champ) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/80 p-6 md:py-10 rounded-3xl text-center space-y-4 shadow-lg order-1 md:order-2 relative transition hover:shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-550 text-slate-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 select-none leading-none">
                <Star className="w-3 h-3 fill-current animate-spin" />
                CHAMPION
              </div>

              <div className="relative inline-block">
                <img 
                  src={INITIAL_LEADERBOARD[0]?.avatarUrl} 
                  alt="Rank 1"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full">
                  #১ম স্থান
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-850 dark:text-slate-100">{INITIAL_LEADERBOARD[0]?.name}</h3>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                  {INITIAL_LEADERBOARD[0]?.district}
                </p>
              </div>

              <div className="flex justify-around items-center pt-3 border-t border-slate-50 dark:border-slate-850/60 text-[11px] select-none font-semibold">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">জড়িত স্কোর</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{INITIAL_LEADERBOARD[0]?.points || 319} XP</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">স্ট্রিক</span>
                  <strong className="text-amber-500 font-black flex items-center justify-center gap-0.5 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                    {INITIAL_LEADERBOARD[0]?.streak || 8}
                  </strong>
                </div>
              </div>
            </div>

            {/* National Rank #3 Podium */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-sm order-3 transition hover:shadow-md">
              <div className="relative inline-block">
                <img 
                  src={INITIAL_LEADERBOARD[2]?.avatarUrl} 
                  alt="Rank 3"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-amber-600/80 shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9.5px] font-black px-3 py-1 rounded-full border border-white dark:border-slate-850">
                  #৩য় স্থান
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{INITIAL_LEADERBOARD[2]?.name}</h3>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                  {INITIAL_LEADERBOARD[2]?.district}
                </p>
              </div>

              <div className="flex justify-around items-center pt-3 border-t border-slate-50 dark:border-slate-850/60 text-[11px] select-none font-semibold">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">জড়িত স্কোর</span>
                  <strong className="text-slate-700 dark:text-slate-250 font-extrabold">{INITIAL_LEADERBOARD[2]?.points || 267} XP</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-bold text-[9px] uppercase tracking-wide">স্ট্রিক</span>
                  <strong className="text-amber-500 font-black flex items-center justify-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                    {INITIAL_LEADERBOARD[2]?.streak || 4}
                  </strong>
                </div>
              </div>
            </div>

          </div>

          {/* Ranking list table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest select-none">র‍্যাংক সমূহের তালিকা</h3>
              
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="জেলা বা প্রতিযোগী খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-850">
                    <th className="py-4 px-6 w-16 text-center">স্থান</th>
                    <th className="py-4 px-6">নাম (জেলা)</th>
                    <th className="py-4 px-6 text-center">স্ট্রিক</th>
                    <th className="py-4 px-6 text-right">XP পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850/40 font-semibold text-slate-700 dark:text-slate-250">
                  {filteredNationalList.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/20 transition-all font-medium">
                      <td className="py-4 px-6 text-center font-mono font-black text-slate-500 select-none">
                        #{idx + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatarUrl} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-150" 
                            alt={user.name}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                              {user.name}
                              {idx === 0 && <Crown className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                              {user.district}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center select-none font-mono text-amber-505">
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg text-[10px]">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {user.streak}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        {user.points} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HALL OF FAME TAB */}
      {activeTab === "fame" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-slate-950 text-white p-8 rounded-3xl relative overflow-hidden border border-slate-850 shadow-2xl select-none text-center sm:text-left">
            <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[9.5px] bg-amber-500/15 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full inline-block font-black uppercase tracking-wider leading-none">
                  🌟 বিশেষ অর্জন হল অব ফেম
                </span>
                <h2 className="text-2xl font-black font-display text-white tracking-tight pt-1">Study Qoro Hall of Fame</h2>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed font-semibold">
                  স্টাডি কুইজে প্রতিটি সিজনে (মাসিক) শীর্ষ ৩ জন সুপ্রিম লীগ বিজেতাকে এখানে স্বর্ণাক্ষরে সংবর্ধনা দেয়া হয়।
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { playClickFeedback(); setShowShareSuccess(true); setTimeout(() => setShowShareSuccess(false), 3050); }}
                  className="cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:scale-[1.02] text-xs font-black px-5 py-3 rounded-2xl shadow transition"
                >
                  ফেমবোর্ড শেয়ার করুন
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Champion of May */}
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/30 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition">
              <div className="absolute -right-3 -top-3 w-12 h-12 bg-amber-500/5 rotate-12" />
              <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-black uppercase">মে ২০২৬ চ্যাম্পিয়ন</span>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" 
                  alt="Gold Title" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-amber-400"
                  referrerPolicy="no-referrer"
                />
                <Crown className="w-5 h-5 text-amber-500 absolute -top-3 left-1/2 -translate-x-1/2 fill-current animate-pulse" />
              </div>

              <div className="span-y-0.5">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Asha Khatun</h4>
                <p className="text-[10px] text-slate-400 font-bold">সিরাজগঞ্জ জেলা • ৫,১৯০ XP</p>
              </div>

              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                &quot;প্রতিটি কুইজের চমৎকার ব্যাখ্যা ও গেমিফাইড চ্যালেঞ্জ আমার প্রস্তুতির গতি দ্বিগুণ করে দিয়েছিল।&quot;
              </p>
            </div>

            {/* Champion of April */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition">
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-black uppercase">এপ্রিল ২০২৬ চ্যাম্পিয়ন</span>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" 
                  alt="Gold Title" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-slate-350"
                  referrerPolicy="no-referrer"
                />
                <Shield className="w-5 h-5 text-slate-300 absolute -top-3 left-1/2 -translate-x-1/2 fill-current" />
              </div>

              <div className="span-y-0.5">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Rafsanul Islam Rafin</h4>
                <p className="text-[10px] text-slate-400 font-bold">চট্টগ্রাম জেলা • ৪,৯৮২ XP</p>
              </div>

              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                &quot;স্টাডি টাইমার ও লাইভ এক্সাম ওয়ারে লড়াই করার মজাটাই আলাদা। এটি সত্যিই আমাকে অনুপ্রাণিত করেছে।&quot;
              </p>
            </div>

            {/* Champion of March */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition">
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-black uppercase">মার্চ ২০২৬ চ্যাম্পিয়ন</span>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
                  alt="Gold Title" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-orange-400"
                  referrerPolicy="no-referrer"
                />
                <Medal className="w-5 h-5 text-orange-450 absolute -top-3 left-1/2 -translate-x-1/2 fill-current" />
              </div>

              <div className="span-y-0.5">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Arman Hossen</h4>
                <p className="text-[10px] text-slate-400 font-bold">কুমিল্লা জেলা • ৪,৩২০ XP</p>
              </div>

              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                &quot;এইচএসসি পরীক্ষার আগে নিজেকে যাচাই করার জন্য এর চেয়ে দারুণ প্ল্যাটফর্ম আমি আর কোথাও দেখিনি।&quot;
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 6. Active stats highlight summary footer (Retained for accessibility & user contextual info) */}
      <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans select-none relative overflow-hidden">
        {/* Absolute glowing line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold select-none shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-sm font-black uppercase tracking-wider block w-contain mb-1">YOUR ACCOUNT</span>
            <h4 className="text-xs font-black text-slate-100 leading-none">{statsWithOverride.name}</h4>
          </div>
        </div>

        <div className="flex items-center gap-6 justify-between sm:justify-start">
          <div className="text-left sm:text-right">
            <span className="text-[9px] text-slate-400 uppercase block font-bold tracking-wider leading-none mb-1">আপনার লীগ</span>
            <strong className="text-amber-400 font-mono text-sm leading-none font-black">সিলভার লীগ</strong>
          </div>
          <div className="border-l border-slate-800 h-8 font-light" />
          <div className="text-left sm:text-right">
            <span className="text-[9px] text-slate-400 uppercase block font-bold tracking-wider leading-none mb-1">মোট স্কোর</span>
            <strong className="text-emerald-400 font-mono text-sm leading-none font-black">{statsWithOverride.points} XP</strong>
          </div>
          <div className="border-l border-slate-800 h-8 font-light" />
          <div className="text-left sm:text-right">
            <span className="text-[9px] text-slate-400 uppercase block font-bold tracking-wider leading-none mb-1">স্টাডি স্ট্রিক</span>
            <strong className="text-amber-500 font-mono text-sm leading-none font-black flex items-center justify-end gap-1">
              <Flame className="w-4 h-4 fill-current animate-pulse text-amber-500" />
              {statsWithOverride.streak || 0} দিন
            </strong>
          </div>
        </div>
      </div>

      {/* 7. Share success notification */}
      {showShareSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-xl border border-emerald-500 flex items-center gap-2 shadow-2xl animate-fade-in select-none">
          <Check className="w-4 h-4" />
          আপনার হল অব ফেম বোর্ড লিংক সফলভাবে কপি করা হয়েছে!
        </div>
      )}

      {/* 8. RULES & PROMOTION INFO POPUP DIALOG */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs select-none">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-slate-800 dark:text-slate-100">
            
            {/* Modal header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <h3 className="text-sm font-extrabold">লীগ প্রমোশন রুলস ও গাইডলাইন</h3>
              </div>
              <button 
                onClick={() => { playClickFeedback(); setShowRulesModal(false); }}
                className="cursor-pointer p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
                id="close-rules"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs leading-relaxed">
              
              <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">১. প্রতি সপ্তাহে নতুন স্প্রিন্ট</span>
                <p className="text-slate-500 dark:text-slate-400">
                  প্রতি রবিবার রাত ১২ টায় সাপ্তাহিক লীগ যুদ্ধ শেষ হয়। সপ্তাহজুড়ে কুইজ খেলে সঠিক উত্তরের মাধ্যমে আপনি যত XP পয়েন্ট অর্জন করবেন, আপনি র‍্যাংকিং টেবিলে তত উপরে উঠে আসবেন।
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">২. লীগ প্রমোশন মেকানিজম (শীর্ষ ২০%)</span>
                <p className="text-slate-500 dark:text-slate-400">
                  সাপ্তাহিক স্প্রিন্ট শেষ হওয়ার সময়ে আপনি যদি আপনার বর্তমান লীগের <strong className="text-emerald-600 dark:text-emerald-400">শীর্ষ ২০%</strong> শিক্ষার্থীর তালিকায় থাকেন, তবেই আপনি পরবর্তী উচ্চতর লীগে উন্নীত হবেন।
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">৩. ডিমোশন রিস্ক (নীচের ১০%)</span>
                <p className="text-slate-500 dark:text-slate-400">
                  সিলভার লীগ বা তার উপরের লীগ গুলোতে সপ্তাহ শেষে আপনি যদি একেবারে নিষ্ক্রিয় থাকেন অথবা পারফরম্যান্সের ভিত্তিতে <strong className="text-red-500 dark:text-red-400">সর্বনিম্ন ১০%</strong> শিক্ষার্থীর ভেতর থাকেন, তবে আপনি পুনরায় পূর্ববর্তী লীগে অবমনিত হবেন।
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">৪. কীভাবে দ্রুত XP অর্জন করবেন?</span>
                <p className="text-slate-500 dark:text-slate-400">
                  • লাইভ কুইজ খেলে প্রতিটি সঠিক উত্তরে <strong className="text-emerald-500">+৫ XP</strong><br />
                  • লাইভ এক্সাম ওয়ারে অংশ নিয়ে ব্যাটেলে জিতলে <strong className="text-emerald-500">+২৫ XP</strong><br />
                  • দৈনিক পড়াশোনার ধারাবাহিকতা বা স্ট্রিক বজায় রাখলে প্রতিদিন এক্সট্রা বোনাস XP গুড়ক যুক্ত হবে!
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <button 
                onClick={() => { playClickFeedback(); setShowRulesModal(false); }}
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-5 py-2.5 rounded-xl transition"
              >
                ঠিক আছে, বুঝেছি!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// LEAGUE BADGE VECTORS: Fully custom 3D glowing vector renderer
// -------------------------------------------------------------
function LeagueBadge({ leagueId, className = "w-12 h-12" }: { leagueId: number; className?: string }) {
  if (leagueId === 1) {
    // BRONZE LEAGUE BADGE
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bronzeRadial" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffd4b8" />
            <stop offset="60%" stopColor="#b25e39" />
            <stop offset="100%" stopColor="#5c2c16" />
          </radialGradient>
          <linearGradient id="bronzeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd4b8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#b25e39" />
            <stop offset="100%" stopColor="#5c2c16" />
          </linearGradient>
          <filter id="bronzeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="42" fill="url(#bronzeRadial)" stroke="url(#bronzeBorder)" strokeWidth="4" filter="url(#bronzeGlow)" />
        <circle cx="50" cy="50" r="34" stroke="#ffebde" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        {/* Inner star and wing silhouette */}
        <path d="M50 25 L55 35 L67 36 L58 44 L60 55 L50 49 L40 55 L42 44 L33 36 L45 35 Z" fill="#ffffff" fillOpacity="0.9" />
        <path d="M22 45 C28 58 42 58 42 58 M78 45 C72 58 58 58 58 58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </svg>
    );
  }
  
  if (leagueId === 2) {
    // SILVER LEAGUE BADGE
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="silverRadial" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>
          <linearGradient id="silverBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id="silverShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.30" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="42" fill="url(#silverRadial)" stroke="url(#silverBorder)" strokeWidth="4.5" filter="url(#silverShadow)" />
        <circle cx="50" cy="50" r="32" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 2" opacity="0.5" />
        {/* Lightning Bolt */}
        <path d="M52 22 L36 47 L49 47 L44 72 L62 43 L49 43 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      </svg>
    );
  }

  if (leagueId === 3) {
    // GOLD LEAGUE BADGE
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="goldRadial" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="43" fill="url(#goldRadial)" stroke="url(#goldBorder)" strokeWidth="4" />
        {/* Wreath outline */}
        <path d="M22 35 C18 55 30 75 50 75 C70 75 82 55 78 35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {/* Flame of gold */}
        <path d="M50 22 C42 32 40 45 50 56 C60 45 58 32 50 22 Z" fill="#ffffff" />
        <circle cx="50" cy="46" r="3.5" fill="#f59e0b" />
      </svg>
    );
  }

  if (leagueId === 4) {
    // PLATINUM LEAGUE BADGE (CYAN NEON SHIELD)
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="platBorder" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        {/* Shield shape */}
        <path d="M50 12 L82 22 L82 52 C82 72 68 85 50 89 C32 85 18 72 18 52 L18 22 Z" fill="url(#platGrad)" stroke="url(#platBorder)" strokeWidth="4.5" />
        <path d="M50 25 L60 40 L75 40 L64 50 L68 65 L50 55 L32 65 L36 50 L25 40 L40 40 Z" fill="#ffffff" fillOpacity="0.9" />
      </svg>
    );
  }

  if (leagueId === 5) {
    // DIAMOND LEAGUE BADGE (CRYSTALLINE SAPPHIRE HOVER)
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="diamondSpecular" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Crystalline hexagon outer */}
        <path d="M50 10 L84 30 L84 70 L50 90 L16 70 L16 30 Z" fill="url(#diamondGrad)" stroke="url(#diamondSpecular)" strokeWidth="5" />
        {/* Inner Diamond facets */}
        <path d="M50 20 L72 38 L50 56 L28 38 Z" fill="#ffffff" fillOpacity="0.4" />
        <path d="M50 56 L72 38 L72 64 L50 80 L28 64 L28 38 Z" fill="#ffffff" fillOpacity="0.1" />
        <circle cx="50" cy="38" r="4.5" fill="#ffffff" />
      </svg>
    );
  }

  if (leagueId === 6) {
    // ELITE LEAGUE BADGE (EMERALD CYBER WINGS)
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eliteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </defs>
        {/* Cyber styled circular shield with vertical wings */}
        <path d="M12 25 L28 42 L28 58 L12 75 Z" fill="#059669" opacity="0.4" />
        <path d="M88 25 L72 42 L72 58 L88 75 Z" fill="#059669" opacity="0.4" />
        <circle cx="50" cy="50" r="36" fill="url(#eliteGrad)" stroke="#10b981" strokeWidth="4.5" />
        {/* Prominent stylized crest */}
        <path d="M50 28 L62 46 L38 46 Z M50 72 L62 54 L38 54 Z" fill="#ffffff" />
        <circle cx="50" cy="50" r="5" fill="#ffffff" />
      </svg>
    );
  }

  if (leagueId === 7) {
    // TITAN LEAGUE BADGE (AMETHYST TITAN SHIELD)
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="titanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d0fe" />
            <stop offset="45%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <filter id="titanNeon" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.80" />
          </filter>
        </defs>
        {/* Spiky gear-like heavy metal wheel */}
        <circle cx="50" cy="50" r="41" fill="url(#titanGrad)" stroke="#ffffff" strokeWidth="2.5" filter="url(#titanNeon)" />
        <circle cx="50" cy="50" r="30" fill="#3b0764" />
        {/* Glowing central core */}
        <polygon points="50,23 57,38 72,41 61,51 65,66 50,58 35,66 39,51 28,41 43,38" fill="#ffffff" />
        <circle cx="50" cy="48" r="4" fill="#8b5cf6" />
      </svg>
    );
  }

  // leagueId === 8
  // SUPREME LEAGUE BADGE (MAJESTIC OBSIDIAN GOLD CROWN)
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="supremeCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="goldSkein" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <filter id="divineGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#supremeCore)" stroke="url(#goldSkein)" strokeWidth="4" filter="url(#divineGlow)" />
      {/* 3 point gold crown */}
      <path d="M30 62 L32 35 L44 47 L50 30 L56 47 L68 35 L70 62 Z" fill="url(#goldSkein)" />
      {/* Golden ruby embedded */}
      <circle cx="50" cy="53" r="3.5" fill="#f43f5e" />
      <circle cx="38" cy="53" r="2.5" fill="#ef4444" />
      <circle cx="62" cy="53" r="2.5" fill="#ef4444" />
      {/* Stars sparkles */}
      <path d="M22 28 L24 32 L28 34 L24 36 L22 40 L20 36 L16 34 L20 32 Z" fill="#ffffff" opacity="0.9" />
      <path d="M78 28 L80 32 L84 34 L80 36 L78 40 L76 36 L72 34 L76 32 Z" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

// Inline fallback icon renderers
function HistoryLogIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className={className} 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
