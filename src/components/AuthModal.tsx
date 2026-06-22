/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Lock, 
  ArrowRight, 
  Info, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  User,
  LogOut,
  HelpCircle
} from "lucide-react";
import { StudentStats } from "../types";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
  setStats: Dispatch<SetStateAction<StudentStats>>;
  isForceLogin?: boolean;
}

export default function AuthModal({ isOpen, onClose, stats, setStats, isForceLogin }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(stats.isGuest ? "" : stats.name);
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [batch, setBatch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | "name" | "institution" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- Blinking / Winking Animation Logic ---
  const [isBlinking, setIsBlinking] = useState(false);
  const [winkedCharacter, setWinkedCharacter] = useState<string | null>(null);

  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        // Schedule next blink in 3 - 6 seconds
        const nextBlinkTime = 3000 + Math.random() * 3000;
        blinkTimeout = setTimeout(triggerBlink, nextBlinkTime);
      }, 150); // Blink duration of 150ms
    };

    // Initial delay before first blink
    blinkTimeout = setTimeout(triggerBlink, 3000);

    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    if (winkedCharacter) {
      const timer = setTimeout(() => {
        setWinkedCharacter(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [winkedCharacter]);

  // --- Animation & Interactive Tracking States ---
  const [mousePos, setMousePos] = useState({ x: 160, y: 150 });
  const [isMouseOverCharacter, setIsMouseOverCharacter] = useState(false);
  const characterCardRef = useRef<HTMLDivElement>(null);

  // --- Check Dark Mode Status for Tailwind styles ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  if (!isOpen) return null;

  // --- Mouse Movement Tracking with Viewbox Scaling ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!characterCardRef.current) return;
    const rect = characterCardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    setMousePos({ x, y });
  };

  // --- Eye Tracking Offset Math ---
  const getEyePupilOffset = (
    eyeCenterX: number, 
    eyeCenterY: number, 
    maxDistance: number = 8
  ) => {
    let targetX = 160;
    let targetY = 150;

    // Define target based on dynamic interaction focus states
    if (focusedInput === "email") {
      const textCursorOffset = Math.min(email.length * 3.5, 95);
      targetX = 260 + textCursorOffset;
      targetY = 140;
    } else if (focusedInput === "password") {
      if (showPassword) {
        const textCursorOffset = Math.min(password.length * 4.5, 95);
        targetX = 240 + textCursorOffset;
        targetY = 190;
      } else {
        // Head shrunken downward
        targetX = 160;
        targetY = 280;
      }
    } else if (focusedInput === "name") {
      const textCursorOffset = Math.min(name.length * 3.5, 95);
      targetX = 250 + textCursorOffset;
      targetY = 100;
    } else if (focusedInput === "institution") {
      const textCursorOffset = Math.min(institution.length * 3.5, 95);
      targetX = 250 + textCursorOffset;
      targetY = 220;
    } else if (isMouseOverCharacter) {
      targetX = mousePos.x;
      targetY = mousePos.y;
    } else {
      // Idle drift movement
      const time = Date.now() * 0.001;
      targetX = 160 + Math.sin(time) * 20;
      targetY = 120 + Math.cos(time) * 10;
    }

    const dx = targetX - eyeCenterX;
    const dy = targetY - eyeCenterY;
    const distance = Math.hypot(dx, dy);

    if (distance === 0) return { x: 0, y: 0 };
    const travel = Math.min(distance * 0.075, maxDistance);
    return {
      x: (dx / distance) * travel,
      y: (dy / distance) * travel
    };
  };

  const getCharacterState = () => {
    if (focusedInput === "email" || focusedInput === "name" || focusedInput === "institution") return "typing";
    if (focusedInput === "password") {
      return showPassword ? "revealed" : "hidden";
    }
    return "neutral";
  };

  const charState = getCharacterState();

  // Purple Hero Pupil positions (centerX=75, centerY=132)
  const pupilPurpleL = getEyePupilOffset(72, 132, 7);
  const pupilPurpleR = getEyePupilOffset(102, 132, 7);

  // Black Character Pupil positions (centerX=153, centerY=120)
  const pupilBlackL = getEyePupilOffset(138, 120, 8);
  const pupilBlackR = getEyePupilOffset(168, 120, 8);

  // Orange Character Pupil positions (centerX=85, centerY=210)
  const pupilOrangeL = getEyePupilOffset(85, 210, 4);
  const pupilOrangeR = getEyePupilOffset(125, 210, 4);

  // Yellow Character Pupil positions (centerX=240, centerY=195)
  const pupilYellow = getEyePupilOffset(240, 195, 4.5);

  // --- Form Handlers ---
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        
        // Store user initial data
        const userData: StudentStats = {
          name: name.trim() || "New Student",
          points: 0, 
          streak: 0,   
          level: 1,
          rank: 0,    
          examsGiven: 0,
          totalQuestionsSolved: 0,
          plan: "Free", 
          completedMilestones: [],
          isGuest: false,
          collegeName: institution.trim() || null,
          educationLevel: educationLevel || undefined,
          batch: batch || undefined,
          classCode: educationLevel || undefined,
        };
        try {
            await setDoc(doc(db, "students", userCredential.user.uid), userData);
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, "students/" + userCredential.user.uid);
        }
        setSuccessMessage("নিবন্ধন সম্পন্ন! ইমেইল ভেরিফিকেশনের জন্য আপনার ইনবক্স চেক করুন।");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 1500);
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
             setSuccessMessage("অনুগ্রহ করে আপনার ইমেইল ভেরিফাই করুন।");
             setIsSubmitting(false);
             return;
        }

        let userDoc;
        try {
            userDoc = await getDoc(doc(db, "students", userCredential.user.uid));
        } catch (error) {
            handleFirestoreError(error, OperationType.GET, "students/" + userCredential.user.uid);
        }
        
        if (userDoc?.exists()) {
           setStats({ ...(userDoc.data() as StudentStats), uid: userCredential.user.uid });
        }
        
        setSuccessMessage("");
        onClose();
      }

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setSuccessMessage("এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে, দয়া করে লগইন করুন।");
      } else {
        setSuccessMessage("ত্রুটি: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestRestore = () => {
    setStats({
      name: "গেস্ট পরীক্ষার্থী (Guest Student)",
      points: 15,
      streak: 0,
      level: 1,
      rank: 99912,
      examsGiven: 0,
      totalQuestionsSolved: 0,
      plan: "Free",
      completedMilestones: [],
      isGuest: true
    });
    onClose();
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setSuccessMessage(`পাসওয়ার্ড রিসেট টোকেন ${forgotEmail} ইমেইলে পাঠানো হয়েছে!`);
    setTimeout(() => {
      setSuccessMessage("");
      setIsForgotPassword(false);
    }, 3000);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      let userDoc;
      try {
          userDoc = await getDoc(doc(db, "students", result.user.uid));
      } catch (error) {
          handleFirestoreError(error, OperationType.GET, "students/" + result.user.uid);
      }
      
      if (!userDoc?.exists()) {
        const userData: StudentStats = {
          name: result.user.displayName || "New Student",
          points: 0, 
          streak: 0,   
          level: 1,
          rank: 0,    
          examsGiven: 0,
          totalQuestionsSolved: 0,
          plan: "Free", 
          completedMilestones: [],
          isGuest: false,
          avatar: result.user.photoURL || undefined
        };
        try {
            await setDoc(doc(db, "students", result.user.uid), userData);
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, "students/" + result.user.uid);
        }
        setStats({ ...userData, uid: result.user.uid });
      } else {
        setStats({ ...(userDoc.data() as StudentStats), uid: result.user.uid });
      }
      
      setSuccessMessage("লগইন সম্পন্ন হয়েছে!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setSuccessMessage("Google লগইন ব্যর্থ হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="auth-modal-main" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border transition-all duration-500 relative
          ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"}`}
      >
        
        {/* Floating Close button */}
        {!isForceLogin && (
          <button 
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 transition-all p-2 rounded-full border
              ${isDarkMode 
                ? "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white" 
                : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm"}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* --- LEFT PANEL: Interactive SVG Mascot Stage --- */}
        <div 
          ref={characterCardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsMouseOverCharacter(true)}
          onMouseLeave={() => {
            setIsMouseOverCharacter(false);
            setMousePos({ x: 160, y: 150 });
          }}
          className={`hidden md:flex md:w-1/2 p-8 flex-col justify-between relative select-none cursor-crosshair overflow-hidden border-r transition-colors duration-500
            ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50/80 border-slate-100"}`}
        >
          {/* Header area empty for absolute cleanliness */}


          {/* Interactive Mascot SVG Canvas */}
          <div className="w-full max-w-[325px] h-[310px] mx-auto mt-4 relative">
            <svg 
              viewBox="0 0 320 300" 
              className="w-full h-full drop-shadow-lg overflow-visible"
            >
              {/* Background Grid Accent Lines */}
              <g className="opacity-15" stroke={isDarkMode ? "#ffffff" : "#111111"} strokeWidth="0.5" strokeDasharray="2 3">
                <line x1="0" y1="50" x2="320" y2="50" />
                <line x1="0" y1="100" x2="320" y2="100" />
                <line x1="0" y1="150" x2="320" y2="150" />
                <line x1="0" y1="200" x2="320" y2="200" />
                <line x1="0" y1="250" x2="320" y2="250" />
                <line x1="80" y1="0" x2="80" y2="300" />
                <line x1="160" y1="0" x2="160" y2="300" />
                <line x1="240" y1="0" x2="240" y2="300" />
              </g>

              {/* --- Character 3: Black Column (peeps from behind orange dome & yellow bird) --- */}
              <motion.g
                initial={{ y: 20 }}
                animate={
                  charState === "hidden" 
                    ? { y: 175, scaleY: 0.35, transformOrigin: "150px 280px" } 
                    : charState === "revealed"
                    ? { y: -55, scaleY: 1.08, skewX: -2, transformOrigin: "150px 280px" }
                    : charState === "typing"
                    ? { y: -38, scaleY: 1.04, skewX: 6, transformOrigin: "150px 280px" }
                    : { y: -10, scaleY: 1.0, skewX: 0, transformOrigin: "150px 280px" }
                }
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                id="black-character-g"
                onClick={() => setWinkedCharacter("black")}
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.02 }}
              >
                <rect 
                  x="115" 
                  y="85" 
                  width="70" 
                  height="200" 
                  rx="35" 
                  fill={isDarkMode ? "#090d16" : "#1e293b"} 
                  stroke={isDarkMode ? "#334155" : "#0f172a"}
                  strokeWidth="2.5"
                />
                
                <AnimatePresence>
                  {charState !== "hidden" && (
                    <motion.g 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isBlinking ? (
                        <g>
                          {/* Both eyes closed */}
                          <path d="M 128 121 Q 138 126 148 121" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                          <path d="M 158 121 Q 168 126 178 121" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                        </g>
                      ) : winkedCharacter === "black" ? (
                        <g>
                          {/* Wink Left Eye */}
                          <path d="M 128 121 Q 138 126 148 121" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                          {/* Open Right Eye */}
                          <circle cx="168" cy="120" r="13" fill="white" />
                          <circle cx={168 + pupilBlackR.x} cy={120 + pupilBlackR.y} r="5.5" fill="#111" />
                          <circle cx={168 + pupilBlackR.x - 1.5} cy={120 + pupilBlackR.y - 1.5} r="2" fill="white" />
                        </g>
                      ) : (
                        <g>
                          {/* Normal Eyes with dynamic pupil gaze tracking */}
                          <circle cx="138" cy="120" r="13" fill="white" />
                          <circle cx="168" cy="120" r="13" fill="white" />
                          
                          <circle 
                            cx={138 + pupilBlackL.x} 
                            cy={120 + pupilBlackL.y} 
                            r="5.5" 
                            fill="#111" 
                          />
                          <circle 
                            cx={138 + pupilBlackL.x - 1.5} 
                            cy={120 + pupilBlackL.y - 1.5} 
                            r="2" 
                            fill="white" 
                          />

                          <circle 
                            cx={168 + pupilBlackR.x} 
                            cy={120 + pupilBlackR.y} 
                            r="5.5" 
                            fill="#111" 
                          />
                          <circle 
                            cx={168 + pupilBlackR.x - 1.5} 
                            cy={120 + pupilBlackR.y - 1.5} 
                            r="2" 
                            fill="white" 
                          />
                        </g>
                      )}
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>

              {/* --- Character 2: Purple Rounded Column (left-center back) --- */}
              <motion.g
                initial={{ y: 0 }}
                animate={
                  charState === "hidden"
                    ? { scaleY: 0.72, rotate: -12, y: 35, transformOrigin: "85px 280px" }
                    : charState === "revealed"
                    ? { scaleY: 1.05, rotate: 6, y: -5, transformOrigin: "85px 280px" }
                    : charState === "typing"
                    ? { scaleY: 1.02, rotate: 18, x: 12, transformOrigin: "85px 280px" }
                    : { scaleY: 1.0, rotate: 0, x: 0, y: 0, transformOrigin: "85px 280px" }
                }
                transition={{ type: "spring", stiffness: 155, damping: 13 }}
                id="purple-character-g"
                onClick={() => setWinkedCharacter("purple")}
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.02 }}
              >
                <rect 
                  x="50" 
                  y="105" 
                  width="70" 
                  height="180" 
                  rx="35" 
                  fill="#6366f1" 
                  stroke={isDarkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="2.5"
                />
                
                <rect x="82" y="146" width="6" height="20" rx="3" fill="#111" />

                {charState === "hidden" ? (
                  <g>
                    {/* Shy closed eyes */}
                    <path d="M 62 133 Q 72 138 82 133" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 92 133 Q 102 138 112 133" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                  </g>
                ) : charState === "revealed" ? (
                  <g>
                    {/* Wide excited eyes */}
                    <circle cx="72" cy="132" r="11" fill="white" />
                    <circle cx="102" cy="132" r="11" fill="white" />
                    <circle cx={72 + pupilPurpleL.x} cy={132 + pupilPurpleL.y} r="6.5" fill="#111" />
                    <circle cx={102 + pupilPurpleR.x} cy={132 + pupilPurpleR.y} r="6.5" fill="#111" />
                  </g>
                ) : isBlinking ? (
                  <g>
                    {/* Eyes blink closed */}
                    <path d="M 62 133 Q 72 138 82 133" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M 92 133 Q 102 138 112 133" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3.2" strokeLinecap="round" />
                  </g>
                ) : winkedCharacter === "purple" ? (
                  <g>
                    {/* Left eye winks closed */}
                    <path d="M 62 133 Q 72 138 82 133" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3.2" strokeLinecap="round" />
                    {/* Right Eye stays open/gazing */}
                    <circle cx="102" cy="132" r="10" fill="white" />
                    <circle cx={102 + pupilPurpleR.x} cy={132 + pupilPurpleR.y} r="5" fill="#111" />
                    <circle cx={102 + pupilPurpleR.x - 1} cy={132 + pupilPurpleR.y - 1} r="1.5" fill="white" />
                  </g>
                ) : (
                  <g>
                    {/* Normal gaze eyes */}
                    <circle cx="72" cy="132" r="10" fill="white" />
                    <circle cx="102" cy="132" r="10" fill="white" />
                    
                    <circle cx={72 + pupilPurpleL.x} cy={132 + pupilPurpleL.y} r="5" fill="#111" />
                    <circle cx={72 + pupilPurpleL.x - 1} cy={132 + pupilPurpleL.y - 1} r="1.5" fill="white" />

                    <circle cx={102 + pupilPurpleR.x} cy={132 + pupilPurpleR.y} r="5" fill="#111" />
                    <circle cx={102 + pupilPurpleR.x - 1} cy={132 + pupilPurpleR.y - 1} r="1.5" fill="white" />
                  </g>
                )}
              </motion.g>

              {/* --- Character 4: Yellow Bird / Pill head block (Right-center) --- */}
              <motion.g
                initial={{ y: 0 }}
                animate={
                  charState === "hidden"
                    ? { scaleY: 0.65, y: 38, rotate: 18, transformOrigin: "235px 280px" }
                    : charState === "revealed"
                    ? { scaleY: 1.05, y: -5, rotate: -6, transformOrigin: "235px 280px" }
                    : charState === "typing"
                    ? { scaleY: 1.02, rotate: -12, x: -8, transformOrigin: "235px 280px" }
                    : { scaleY: 1.0, rotate: 0, x: 0, y: 0, transformOrigin: "235px 280px" }
                }
                transition={{ type: "spring", stiffness: 160, damping: 15 }}
                id="yellow-character-g"
                onClick={() => setWinkedCharacter("yellow")}
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.02 }}
              >
                <rect 
                  x="200" 
                  y="155" 
                  width="65" 
                  height="130" 
                  rx="32.5" 
                  fill="#eab308" 
                  stroke={isDarkMode ? "#f59e0b" : "#ca8a04"}
                  strokeWidth="2.5"
                />
                
                {/* Yellow beak pointing right (towards the form) */}
                <path d="M 265 195 L 283 205 L 265 215 Z" fill="#eab308" stroke={isDarkMode ? "#f59e0b" : "#ca8a04"} strokeWidth="1" />
                
                {charState === "hidden" ? (
                  // Closed sleeping eye shifted right
                  <path 
                    d="M 230 195 Q 240 204 250 195" 
                    fill="none" 
                    stroke="#111" 
                    strokeWidth="3.2" 
                    strokeLinecap="round" 
                  />
                ) : isBlinking || winkedCharacter === "yellow" ? (
                  // Blink or wink closed eye
                  <path 
                    d="M 230 195 Q 240 204 250 195" 
                    fill="none" 
                    stroke={isDarkMode ? "#cbd5e1" : "#111"} 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                ) : (
                  // Gaze-tracked single beautiful profile eye with highlight!
                  <g>
                    <circle cx="240" cy="195" r="9.5" fill="#111111" />
                    <circle cx={240 + pupilYellow.x} cy={195 + pupilYellow.y} r="8.2" fill="#111111" />
                    <circle cx={240 + pupilYellow.x + 2} cy={195 + pupilYellow.y - 2} r="2.8" fill="white" />
                  </g>
                )}
              </motion.g>

              {/* --- Character 1: Orange Ground Dome (bottom-left foreground) --- */}
              <motion.g
                whileHover={{ scale: 1.03 }}
                animate={
                  charState === "hidden"
                    ? { scaleY: 0.95, transformOrigin: "110px 280px" }
                    : { scaleY: 1.0, transformOrigin: "110px 280px" }
                }
                id="orange-character-g"
                onClick={() => setWinkedCharacter("orange")}
                style={{ cursor: "pointer" }}
              >
                <path 
                  d="M 20 280 C 20 150, 190 150, 190 280 Z" 
                  fill="#f97316" 
                  stroke={isDarkMode ? "#ea580c" : "#c2410c"}
                  strokeWidth="2.5"
                />
                
                {charState === "hidden" ? (
                  // Shy curved sleeping eyes
                  <g>
                    <path d="M 75 212 Q 85 204 95 212" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 115 212 Q 125 204 135 212" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                ) : isBlinking ? (
                  <g>
                    {/* Blinking eyes */}
                    <path d="M 75 212 Q 85 204 95 212" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 115 212 Q 125 204 135 212" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                  </g>
                ) : winkedCharacter === "orange" ? (
                  <g>
                    {/* Left Eye closed to wink */}
                    <path d="M 75 212 Q 85 204 95 212" fill="none" stroke={isDarkMode ? "#cbd5e1" : "#111"} strokeWidth="3" strokeLinecap="round" />
                    {/* Right Eye open and gaze-tracking */}
                    <circle cx={125 + pupilOrangeR.x} cy={210 + pupilOrangeR.y} r="5.5" fill="#111" />
                    <circle cx={125 + pupilOrangeR.x - 1} cy={210 + pupilOrangeR.y - 1} r="1.5" fill="white" />
                  </g>
                ) : (
                  <g>
                    {/* Normal dynamic gaze-tracked eyes */}
                    <circle cx={85 + pupilOrangeL.x} cy={210 + pupilOrangeL.y} r="5.5" fill="#111" />
                    <circle cx={85 + pupilOrangeL.x - 1} cy={210 + pupilOrangeL.y - 1} r="1.5" fill="white" />
                    
                    <circle cx={125 + pupilOrangeR.x} cy={210 + pupilOrangeR.y} r="5.5" fill="#111" />
                    <circle cx={125 + pupilOrangeR.x - 1} cy={210 + pupilOrangeR.y - 1} r="1.5" fill="white" />
                  </g>
                )}

                {charState === "hidden" ? (
                  // Shy curved lip
                  <path 
                    d="M 100 240 Q 105 233 110 240" 
                    fill="none" 
                    stroke="#111" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                ) : charState === "typing" ? (
                  // Talking/Focus mouth
                  <circle cx="105" cy="238" r="4.5" fill="#111" />
                ) : (
                  // Cute smiley mouth
                  <path 
                    d="M 98 234 Q 105 244 112 234" 
                    fill="none" 
                    stroke="#111" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                )}
              </motion.g>

              {/* Foreground Horizon Line */}
              <line 
                x1="10" 
                y1="280" 
                x2="310" 
                y2="280" 
                stroke={isDarkMode ? "#475569" : "#cbd5e1"} 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* Interactive hints info text */}
          <div 
            className={`mt-4 p-3.5 rounded-2xl border text-[11px] leading-relaxed text-center transition-all duration-300
              ${isDarkMode 
                ? "bg-slate-900/60 border-slate-800 text-slate-400" 
                : "bg-white border-slate-200 text-slate-500 shadow-sm"}`}
          >
            <Info size={12} className="inline mr-1.5 text-indigo-500 -mt-0.5" />
            <span>শিক্ষার্থী বন্ধুরা, ক্যারেক্টারগুলো তোমার ইনপুট ফিল্ড ফোকাস, মাউস কার্সার ও পাসওয়ার্ড হাইড/শোর উপর জীবন্ত প্রতিক্রিয়া দেখাবে।</span>
          </div>

        </div>

        {/* --- RIGHT PANEL: Ultra Polished Form Panel --- */}
        <div 
          className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between relative
            ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
        >
          {/* Upper Right Cross Grid Design Accent */}
          <div className="absolute top-8 right-8 pointer-events-none select-none text-slate-200 dark:text-slate-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="opacity-40">
              <path d="M12 0h2v10h10v2h-10v10h-2v-10h-10v-2h10z" />
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              
              // --- Sign In / Sign Up Form Block ---
              <motion.div
                key="auth-panel-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Sparkles size={16} className="animate-pulse" />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Study Qoro Portal</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mb-1">
                      {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করো" : "পোর্টাল অ্যাকাউন্টে প্রবেশ"}
                    </h1>
                    <p className={`text-xs transition-colors duration-200 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {isSignUp 
                        ? "আজই নিবন্ধন করে তোমার এইচএসসি ও ভর্তি পরীক্ষার স্মার্ট প্রস্তুতি শুরু করো।" 
                        : "অগ্রযাত্রা এবং পড়ালেখার ধারাবাহিকতা বজায় রেখে তোমার লক্ষ্য অর্জন করো।"}
                    </p>
                  </div>

                  {successMessage && (
                    <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span className="font-semibold">{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    
                    {/* Full Name input (Sign Up mode only) */}
                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          শিক্ষার্থীর পূর্ণ নাম
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <User size={15} />
                          </span>
                          <input 
                            type="text"
                            required
                            placeholder="যেমন: Tawhid Islam"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocusedInput("name")}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium
                              ${isDarkMode 
                                ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Education Level and Batch inputs (Sign Up only) */}
                    {isSignUp && (
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                            শিক্ষাস্তর
                          </label>
                          <select 
                            required
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            className={`w-full px-3 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium
                              ${isDarkMode 
                                ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                          >
                            <option value="" disabled>স্তন নির্বাচন...</option>
                            <option value="HSC">HSC (Higher Secondary)</option>
                            <option value="SSC">SSC (Secondary)</option>
                            <option value="Class 10">Class 10</option>
                            <option value="Class 9">Class 9</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                            ব্যাচ
                          </label>
                          <select 
                            required
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            className={`w-full px-3 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium
                              ${isDarkMode 
                                ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                          >
                            <option value="" disabled>বর্ষ...</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Email address input */}
                    <div className="space-y-1.5 text-left">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        ইমেইল এড্রেস
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                          <Mail size={15} />
                        </span>
                        <input 
                          type="email"
                          required
                          placeholder="e.g. name@student.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium
                            ${isDarkMode 
                              ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                        />
                      </div>
                    </div>

                    {/* Password input */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          পাসওয়ার্ড
                        </label>
                        {!isSignUp && (
                          <button 
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-400 transition"
                          >
                            পাসওয়ার্ড ভুলে গেছ?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                          <Lock size={15} />
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput("password")}
                          onBlur={() => setFocusedInput(null)}
                          className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-xs transition-all duration-300 font-mono
                            ${isDarkMode 
                              ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors text-slate-400 hover:text-indigo-500"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* College / Institution input (Sign Up mode only) */}
                    {isSignUp && (
                      <div className="space-y-1.5 text-left">
                        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          কলেজ / শিক্ষাপ্রতিষ্ঠান (ঐচ্ছিক)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <Building2 size={15} />
                          </span>
                          <input 
                            type="text"
                            placeholder="যেমন: Dhaka College, Dhaka"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            onFocus={() => setFocusedInput("institution")}
                            onBlur={() => setFocusedInput(null)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium
                              ${isDarkMode 
                                ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 shadow-inner"}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Keep Logged In Checkbox */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold select-none">
                        <input 
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
                          পরবর্তী ৩০দিন লগইন রেখো
                        </span>
                      </label>
                    </div>

                    {/* Dynamic Action Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide text-white transition-all duration-300 shadow-md flex items-center justify-center gap-2
                        ${isSubmitting 
                          ? "bg-indigo-700 cursor-not-allowed opacity-90" 
                          : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 shadow-indigo-600/15"}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>অ্যাকাউন্ট ভেরিফাই করা হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <span>{isSignUp ? "অ্যাকাউন্ট তৈরি নিশ্চিত করো" : "অ্যাকাউন্টে প্রবেশ করো (LOG IN)"}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Custom SSO Option with predefined demo accounts */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDarkMode ? "border-slate-800" : "border-slate-100"}`} />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                      <span className={`px-3 ${isDarkMode ? "bg-slate-900 text-slate-500" : "bg-white text-slate-400"}`}>
                        অথবা গুগল দিয়ে সরাসরি লগইন করো
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleGoogleSignIn}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border
                      ${isDarkMode 
                        ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#ea4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.83 14.97 1 12 1 7.35 1 3.39 3.67 1.41 7.56l3.86 3C6.18 7.56 8.84 5.04 12 5.04z" />
                      <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.6z" />
                      <path fill="#fbbc05" d="M5.27 14.72c-.25-.76-.39-1.57-.39-2.42 0-.85.14-1.66.39-2.42l-3.86-3C.56 8.52 0 10.2 0 12c0 1.8.56 3.48 1.41 5.12l3.86-3z" />
                      <path fill="#34a853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.7-2.87c-1.1.74-2.5 1.18-4.26 1.18-3.16 0-5.82-2.52-6.78-5.52l-3.86 3C3.39 20.33 7.35 23 12 23z" />
                    </svg>
                    <span>গুগল দিয়ে প্রবেশ করুন</span>
                  </button>
                </div>

                {/* Footer switch layout */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex flex-col gap-2.5 text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setSuccessMessage("");
                    }}
                    className="text-[11px] text-indigo-500 hover:underline font-bold"
                  >
                    {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে? সরাসরি প্রবেশ করো →" : "নতুন অ্যাকাউন্ট তৈরি করতে চাও? এখানে ক্লিক করো →"}
                  </button>

                  {!isForceLogin && (!stats.isGuest ? (
                    <button
                      type="button"
                      onClick={handleGuestRestore}
                      className="text-[11px] text-rose-500 hover:underline hover:text-rose-450 font-bold flex items-center justify-center gap-1.5"
                    >
                      <LogOut size={12} />
                      <span>গেস্ট মোডে ফিরে যাও (LOG OUT)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-[11px] text-slate-400 dark:text-slate-500 hover:underline hover:text-slate-600"
                    >
                      অ্যাকাউন্ট ছাড়া ফ্রি এক্সপ্লোর করতে থাকো
                    </button>
                  ))}
                </div>

              </motion.div>
            ) : (
              
              // --- Forgot Password Screen Block ---
              <motion.div
                key="auth-panel-forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-left">
                  <h1 className="text-2xl font-black tracking-tight mb-2">পাসওয়ার্ড পুনরুদ্ধার</h1>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    তোমার পোর্টালে নিবন্ধিত ইমেইল এড্রেস প্রদান করো। আমরা তোমাকে একটি ভেরিফিকেশন লিঙ্ক সহ কোড পাঠাবো।
                  </p>
                </div>

                {successMessage && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      রিসেট ইমেইল এড্রেস
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <Mail size={15} />
                      </span>
                      <input 
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. your-email@domain.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all duration-300
                          ${isDarkMode 
                            ? "bg-slate-950 border-slate-850 text-white focus:border-indigo-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-1"}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    রিসেট কোড পাঠাও
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setSuccessMessage("");
                    }}
                    className={`w-full py-2.5 text-xs font-bold transition rounded-xl ${isDarkMode ? "hover:bg-slate-850 text-slate-300" : "hover:bg-slate-50 text-slate-600"}`}
                  >
                    লগইন স্ক্রিনে ফিরে যাও
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
