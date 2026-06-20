/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  GraduationCap, 
  ChevronDown, 
  MapPin, 
  AlertTriangle,
  Plus,
  CheckCircle,
  Users,
  Search,
  Building
} from "lucide-react";
import { BANGLADESH_DIVISIONS, DIVISION_DISTRICTS, PRESET_COLLEGES, PresetCollege } from "../collegesData";
import { StudentStats } from "../types";
import { doc, setDoc, updateDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface JoinCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
  isDismissible?: boolean;
}

export default function JoinCollegeModal({ isOpen, onClose, stats, setStats, isDismissible = true }: JoinCollegeModalProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<PresetCollege | null>(null);
  
  // Custom college application state
  const [isApplyingCustom, setIsApplyingCustom] = useState<boolean>(false);
  const [customCollegeName, setCustomCollegeName] = useState<string>("");
  const [customEIIN, setCustomEIIN] = useState<string>("");
  const [customWebsite, setCustomWebsite] = useState<string>("");
  const [customError, setCustomError] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [userCustomColleges, setUserCustomColleges] = useState<any[]>([]);
  const [collegeCounts, setCollegeCounts] = useState<Record<string, number>>({});

  // Fetch submitted and approved college applications to show on the list if any
  useEffect(() => {
    if (!isOpen || stats.isGuest || !selectedDivision || !selectedDistrict) return;
    const fetchCustomColleges = async () => {
      try {
        const customList: any[] = [];
        
        // Fetch approved colleges from 'colleges' collection
        const approvedQ = query(
          collection(db, "colleges"), 
          where("division", "==", selectedDivision),
          where("district", "==", selectedDistrict)
        );
        const approvedSnap = await getDocs(approvedQ);
        approvedSnap.docs.forEach(doc => customList.push({ id: doc.id, ...doc.data() }));

        // Fetch pending colleges ONLY for the current user
        const pendingQ = query(
          collection(db, "pending_colleges"), 
          where("division", "==", selectedDivision),
          where("district", "==", selectedDistrict),
          where("createdBy", "==", stats.uid)
        );
        const pendingSnap = await getDocs(pendingQ);
        pendingSnap.docs.forEach(doc => customList.push({ id: doc.id, ...doc.data() }));

        setUserCustomColleges(customList);
      } catch (e) {
        console.error("Failed to load custom applied colleges:", e);
      }
    };
    fetchCustomColleges();
  }, [isOpen, selectedDivision, selectedDistrict, successMsg]);

  // Fetch real-time student counts for colleges in selected district
  useEffect(() => {
    if (!isOpen) return;
    
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const colleges = [
          ...PRESET_COLLEGES.filter(c => c.division === selectedDivision && c.district === selectedDistrict),
          ...userCustomColleges
        ];
        
        if (colleges.length === 0) {
          if (isMounted) setCollegeCounts({});
          return;
        }

        const countsMap: Record<string, number> = {};
        
        // We query the entire students collection for the selected district to minimize read operations
        // and group them locally. This is very cheap for small/medium DBs. (For large, use getCountFromServer)
        const q = query(collection(db, "students"), where("district", "==", selectedDistrict));
        const snap = await getDocs(q);
        
        snap.docs.forEach(doc => {
          const id = doc.data().collegeId;
          if (id) {
            countsMap[id] = (countsMap[id] || 0) + 1;
          }
        });

        if (isMounted) setCollegeCounts(countsMap);
      } catch (error) {
        console.error("Error fetching college counts:", error);
      }
    };
    
    fetchCounts();
    return () => { isMounted = false; };
  }, [isOpen, selectedDivision, selectedDistrict, userCustomColleges]);

  // Handle cascading district update
  useEffect(() => {
    const districts = DIVISION_DISTRICTS[selectedDivision];
    if (districts && districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
    setSearchText("");
    setSelectedCollege(null);
    setIsApplyingCustom(false);
  }, [selectedDivision]);

  useEffect(() => {
    setSearchText("");
    setSelectedCollege(null);
    setIsApplyingCustom(false);
  }, [selectedDistrict]);

  if (!isOpen) return null;

  // Render combined list of preset and custom-applied colleges
  const allCollegesInDistrict: any[] = [
    ...PRESET_COLLEGES.filter(c => c.division === selectedDivision && c.district === selectedDistrict).map(c => ({
      ...c,
      studentCount: collegeCounts[c.id] || 0
    })),
    ...userCustomColleges.map(c => ({
      id: c.id,
      name: c.name,
      division: c.division,
      district: c.district,
      studentCount: collegeCounts[c.id] || 0,
      isCustom: true,
      approved: c.approved || false
    }))
  ];

  // Filter list by typed text (in English)
  const filteredColleges = allCollegesInDistrict.filter(c => 
    (c.name || "").toLowerCase().includes((searchText || "").toLowerCase())
  );

  // Validate custom college English name constraint
  const handleCustomNameChange = (val: string) => {
    setCustomCollegeName(val);
    const banglaPattern = /[\u0980-\u09FF]/;
    if (banglaPattern.test(val)) {
      setCustomError("⚠️ দয়া করে কলেজের নাম শুধুমাত্র ইংরেজিতে লিখুন (বাংলায় নয়)");
    } else {
      setCustomError("");
    }
  };

  const handleJoinCollege = async () => {
    if (stats.isGuest) {
      alert("গেস্ট মোডে তথ্য সংরক্ষণ করা যাবে না। দয়া করে অ্যাকাউন্টে লগইন করুন!");
      return;
    }

    let joinedCollegeId = "";
    let joinedCollegeName = "";

    if (!selectedDivision || !selectedDistrict) {
      alert("দয়া করে বিভাগ এবং জেলা নির্বাচন করুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isApplyingCustom) {
        // Enforce validations
        const trimName = customCollegeName.trim();
        if (!trimName) {
          setCustomError("কলজের নাম খালি হতে পারবে না!");
          setIsSubmitting(false);
          return;
        }
        if (/[\u0980-\u09FF]/.test(trimName)) {
          setCustomError("⚠️ কলেজের নাম অবশ্যই ইংরেজিতে লিখতে হবে!");
          setIsSubmitting(false);
          return;
        }

        // Check if already exists in local list or previous custom listing to avoid duplicate
        const exists = allCollegesInDistrict.find(c => (c.name || "").toLowerCase() === (trimName || "").toLowerCase());
        if (exists) {
          joinedCollegeId = exists.id;
          joinedCollegeName = exists.name;
        } else {
          // Submit application to Firestore
          const appRef = await addDoc(collection(db, "pending_colleges"), {
            name: trimName,
            eiin: customEIIN.trim(),
            website: customWebsite.trim(),
            division: selectedDivision,
            district: selectedDistrict,
            studentCount: 1,
            approved: false, // will require admin approval
            createdBy: stats.uid,
            createdAt: new Date().toISOString()
          });
          joinedCollegeId = appRef.id;
          joinedCollegeName = trimName;
        }
      } else {
        if (!selectedCollege) {
          alert("দয়া করে তালিকা থেকে একটি কলেজ নির্বাচন করুন!");
          setIsSubmitting(false);
          return;
        }
        joinedCollegeId = selectedCollege.id;
        joinedCollegeName = selectedCollege.name;
      }

      // Update student profile with the chosen college information
      const updatedStats = {
        ...stats,
        collegeId: joinedCollegeId,
        collegeName: joinedCollegeName,
        division: selectedDivision,
        district: selectedDistrict
      };

      if (stats.uid) {
        await updateDoc(doc(db, "students", stats.uid), {
          collegeId: joinedCollegeId,
          collegeName: joinedCollegeName,
          division: selectedDivision,
          district: selectedDistrict
        });
      }

      setStats(updatedStats);
      if (isApplyingCustom) {
        setSuccessMsg(`কলেজ আবেদন সফল হয়েছে! Admin approval এর পর এটি মূল তালিকায় যুক্ত হবে। আপনি আপাতত ${joinedCollegeName}-এ যুক্ত হয়েছেন।`);
      } else {
        setSuccessMsg(`অভিনন্দন! আপনি সফলভাবে ${joinedCollegeName}-এ যুক্ত হয়েছেন।`);
      }
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 2000);

    } catch (e) {
      console.error(e);
      handleFirestoreError(e, OperationType.UPDATE, "students/" + stats.uid);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-[460px] bg-gradient-to-br from-[#f2fdf7] to-[#e6fcf0] dark:from-slate-900 dark:to-slate-900 border border-emerald-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative p-6 text-left"
      >
        {/* Close Button */}
        {isDismissible && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Header Section */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm shadow-emerald-200/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <GraduationCap className="w-6 h-6 fill-emerald-500/10 text-emerald-600" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Join Your College</h2>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              বিভাগ ও জেলা বেছে নাও, তারপর College খোঁজো। তালিকায় না থাকলে নিজের College Apply করো — admin approve করলে যুক্ত হবে।
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        <div className="space-y-4">
          {/* Division Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">বিভাগ</label>
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict(""); // Reset district when division changes
                }}
                className="w-full bg-white/70 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-all shadow-inner shadow-emerald-50/50"
              >
                <option value="" disabled>বিভাগ নির্বাচন করুন</option>
                {BANGLADESH_DIVISIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* District Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">জেলা</label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedDivision}
                className="w-full bg-white/70 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-all disabled:opacity-50 shadow-inner shadow-emerald-50/50"
              >
                <option value="" disabled>জেলা নির্বাচন করুন</option>
                {(DIVISION_DISTRICTS[selectedDivision] || []).map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Content based on isApplyingCustom */}
          {isApplyingCustom ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">College / School এর নাম</label>
                
                {/* Warning Rule Note */}
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/40 rounded-xl text-[11px] text-red-500 dark:text-red-400 font-bold flex items-start gap-2.5 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>নিয়ম: College এর নাম অবশ্যই English এ লিখুন (বাংলায় নয়)। পুরো নাম সুন্দর করে নির্ভুলভাবে লিখুন। Admin যাচাই করে approve করবে।</span>
                </div>

                <input
                  type="text"
                  placeholder="e.g. Dhaka College, Dhaka"
                  value={customCollegeName}
                  onChange={(e) => handleCustomNameChange(e.target.value)}
                  className="w-full bg-white/70 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:font-sans placeholder:italic mt-2 shadow-inner shadow-emerald-50/50"
                />
                {customError && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">{customError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">EIIN Number (আবশ্যিক নয়, তবে দিলে ভালো)</label>
                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-start gap-2.5 leading-relaxed mb-2">
                  <Search className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                  <span>EIIN জানা না থাকলে Google এ আপনার College এর নাম লিখে সাথে "EIIN" লিখে সার্চ দিন। যেমন: "Dhaka College EIIN"</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 107977"
                  value={customEIIN}
                  onChange={(e) => setCustomEIIN(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder:font-sans placeholder:italic"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">College Website (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://dhakacollege.edu.bd"
                  value={customWebsite}
                  onChange={(e) => setCustomWebsite(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono placeholder:font-sans placeholder:italic"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsApplyingCustom(false);
                    setCustomCollegeName("");
                    setCustomEIIN("");
                    setCustomWebsite("");
                    setCustomError("");
                  }}
                  className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  ← তালিকা থেকে কলেজ বেছে নিন
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* College Name Search */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">College / School এর নাম</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={(!selectedDivision || !selectedDistrict) ? "আগে বিভাগ ও জেলা নির্বাচন করুন..." : "Search by Name or EIIN... e.g. Dhaka College or 107954"}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    disabled={!selectedDivision || !selectedDistrict}
                    className="w-full bg-white/70 dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono placeholder:font-sans placeholder:italic disabled:opacity-50 shadow-inner shadow-emerald-50/50"
                  />
                </div>
              </div>

              {/* College Selection List */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">কলেজ তালিকা</span>
                <div className="border border-emerald-100 dark:border-slate-800/80 rounded-2xl overflow-hidden max-h-48 overflow-y-auto bg-white/50 dark:bg-slate-950/20 shadow-sm">
                  {filteredColleges.length > 0 ? (
                    <div className="divide-y divide-emerald-50 dark:divide-slate-800/60">
                      {filteredColleges.map((college) => {
                        const isSelected = selectedCollege?.id === college.id;
                        return (
                          <button
                            key={college.id}
                            type="button"
                            onClick={() => setSelectedCollege(college)}
                            className={`w-full flex items-center justify-between p-3 text-left transition-all text-xs
                              ${isSelected 
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm ring-1 ring-emerald-200/50 py-3.5" 
                                : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50/40 dark:hover:bg-slate-900/60 font-medium"}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <GraduationCap className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                              <span className="truncate">{college.name}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-emerald-50 dark:border-slate-700">
                              <Users className="w-3 h-3 text-emerald-400" />
                              <span>{college.studentCount} জন</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-450 text-[11px] font-medium leading-relaxed">
                      {(!selectedDivision || !selectedDistrict) ? "দয়া করে উপরের তালিকা থেকে বিভাগ এবং জেলা নির্বাচন করুন।" : "কোনো কলেজ খুঁজে পাওয়া যায়নি।"}
                    </div>
                  )}
                  
                  {/* Applied College Link at list end with Dotted Border */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyingCustom(true);
                      setSelectedCollege(null);
                    }}
                    disabled={!selectedDivision || !selectedDistrict}
                    className="w-full flex items-center justify-center gap-2 p-3 font-extrabold text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-all border-t border-dashed border-emerald-200 dark:border-teal-800/60 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>আমার College তালিকায় নেই — Apply করো</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          {isDismissible && (
            <button
              onClick={onClose}
              type="button"
              className="flex-1 py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 font-bold text-xs rounded-2xl transition-all text-center border border-emerald-100 dark:border-slate-700 shadow-sm"
            >
              বাতিল
            </button>
          )}
          <button
            onClick={handleJoinCollege}
            disabled={isSubmitting || (!selectedCollege && !isApplyingCustom) || (isApplyingCustom && !!customError)}
            className={`flex-1 py-3 px-4 font-black text-xs rounded-2xl text-white transition-all text-center flex items-center justify-center gap-2
              ${(isSubmitting || (!selectedCollege && !isApplyingCustom) || (isApplyingCustom && !!customError))
                ? "bg-slate-300/80 dark:bg-slate-800 text-slate-400/80 dark:text-slate-500 cursor-not-allowed border border-slate-200"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20"}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : (
              <span>{isApplyingCustom ? "Apply ও Join করো" : "Join করো"}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
