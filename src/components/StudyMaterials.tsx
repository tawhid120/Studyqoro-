/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Subject, StudentStats } from "../types";
import { 
  Book, 
  FileText, 
  Search, 
  Download, 
  BookOpen, 
  Plus, 
  X, 
  BookmarkCheck, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  PenTool,
  CheckCircle2,
  Trash2,
  AlertCircle
} from "lucide-react";

interface StudyMaterialsProps {
  stats: StudentStats;
  setStats: React.Dispatch<React.SetStateAction<StudentStats>>;
}

interface Material {
  id: string;
  title: string;
  banglaTitle: string;
  subject: Subject;
  type: "note" | "book" | "guide";
  author: string;
  pages: number;
  fileSize: string;
  description: string;
  contentMarkdown: string; // Simulated content when they click Read
  isPremium?: boolean;
}

const PRESET_MATERIALS: Material[] = [
  {
    id: "mat-1",
    title: "Vector Complete Hand Note",
    banglaTitle: "পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর শর্টকাট ও হ্যান্ড নোট",
    subject: Subject.PHYSICS,
    type: "note",
    author: "BUET Mentor Team",
    pages: 18,
    fileSize: "4.2 MB",
    description: "ডট গুণন, ক্রস গুণন, সামান্তরিক সূত্র এবং লব্ধির যাবতীয় কঠিন গাণিতিক সমস্যার শর্টকাট সমাধান টেকনিক নিয়ে সাজানো স্পেশাল নোট।",
    contentMarkdown: `## ভেক্টর অধ্যায়ের স্পেশাল এক্সাম হ্যান্ডনোট

### ১. লব্ধির সর্বোচ্চ ও সর্বনিম্ন মান
* **সর্বোচ্চ লব্ধি ($R_{max}$):** দুটি ভেক্টর একই অভিমুখে ($θ = 0^\\circ$) ক্রিয়াশীল হলে লব্ধি সর্বোচ্চ হয়।
  $$R_{max} = P + Q$$
* **সর্বনিম্ন লব্ধি ($R_{min}$):** দুটি ভেক্টর বিপরীত অভিমুখে ($θ = 180^\\circ$) ক্রিয়াশীল হলে লব্ধি সর্বনিম্ন হয়।
  $$R_{min} = |P - Q|$$

### ২. সামান্তরিক সূত্র ও দিক নির্ণয়
যদি $P$ এবং $Q$ ভেক্টরের মধ্যবর্তী কোণ $α$ হয়, তবে লব্ধি $R$-এর মান:
$$R = \\sqrt{P^2 + Q^2 + 2PQ \\cos α}$$

$P$ ভেক্টরের সাথে লব্ধি $R$ যদি $θ$ কোণ উৎপন্ন করে:
$$\\tan θ = \\frac{Q \\sin α}{P + Q \\cos α}$$

### ৩. নদী-নৌকা সংক্রান্ত অতি গুরুত্বপূর্ণ শর্টকাট (HSC & Admission)
* **ন্যূনতম সময়ে নদী পারাপার:** নৌকাকে তীরের সাথে ঠিক ৯০° কোণে চালাতে হবে।
  $$\\text{সময় } t_{min} = \\frac{d}{v}$$
* **ন্যূনতম দূরত্বে বা সোজাসুজি নদী পারাপার:** নৌকাকে স্রোতের বিপরীতে স্থূলকোণে চালাতে হবে।
  $$\\cos α = -\\frac{u}{v} \\quad (v > u)$$
  $$\\text{লব্ধি বেগ } w = \\sqrt{v^2 - u^2}$$
  $$\\text{প্রয়োজনীয় সময় } t = \\frac{d}{\\sqrt{v^2 - u^2}}$$

### ৪. ভেক্টর অন্তরীকরণ ও অপারেটর
* **ডাইভারজেন্স (Divergence):** $\\nabla \\cdot \\vec{A}$। এটি একটি স্কেলার রাশি। ডাইভারজেন্স শূন্য হলে তাকে **সোলেনয়ডাল (Solenoidal)** বলে।
* **কার্ল (Curl):** $\\nabla \\times \\vec{A}$। এটি একটি ভেক্টর রাশি। কার্ল শূন্য হলে ভেক্টরটি **অঘূর্ণনশীল (Irrotational)** এবং **সংরক্ষণশীল** হয়।`,
    isPremium: false
  },
  {
    id: "mat-2",
    title: "Organic Chemistry Reaction Cheat Sheet",
    banglaTitle: "রসায়ন ২য় পত্র: জৈব রসায়ন বিক্রিয়ার সহজ রোডম্যাপ",
    subject: Subject.CHEMISTRY,
    type: "note",
    author: "Adnan Sir (Dhaka Varsity)",
    pages: 24,
    fileSize: "6.8 MB",
    description: "HSC এর সবচেয়ে ভীতিকর অংশ অর্গানিক কেমিস্ট্রির সকল গুরুত্বপূর্ণ নামধারী বিক্রিয়া এবং রূপান্তর এক ছকে সহজে মনে রাখার টেকনিক।",
    contentMarkdown: `## জৈব রসায়নের ১০০% কমন নামধারী বিক্রিয়া সংক্ষেপ

### ১. উরটজ বিক্রিয়া (Wurtz Reaction)
শুষ্ক ইথারে দ্রবীভূত অ্যালকাইল হ্যালাইডকে সোডিয়াম ধাতুর সাথে উত্তপ্ত করলে দ্বিগুণ কার্বন বিশিষ্ট অ্যালকেন উৎপন্ন হয়।
$$\\text{R-X} + 2\\text{Na} + \\text{X-R} \\xrightarrow{\\text{Dry Ether}} \\text{R-R} + 2\\text{NaX}$$
* **গুরুত্ব:** এটি কার্বন শিকল বৃদ্ধিকরণ বিক্রিয়া। তবে এর সাহায্যে মিথেন প্রস্তুত করা যায় না।

### ২. অ্যালডল ঘনীভবন বনাম ক্যানিজারো বিক্রিয়া
* **অ্যালডল ঘনীভবন:** α-হাইড্রোজেন যুক্ত অ্যালডিহাইড ক্ষারের উপস্থিতিতে যুক্ত হয়ে β-হাইড্রক্সি অ্যালডিহাইড গঠন করে।
  $$\\text{CH}_3\\text{CHO} + \\text{CH}_3\\text{CHO} \\xrightarrow{\\text{dil. NaOH}} \\text{CH}_3-\\text{CH(OH)}-\\text{CH}_2-\\text{CHO}$$
* **ক্যানিজারো বিক্রিয়া:** α-হাইড্রোজেনবিহীন অ্যালডিহাইড তীব্র ক্ষারের সাথে স্বতঃজারণ-বিজারণ করে অ্যালকোহল ও জৈব অ্যাসিডের লবণ তৈরি করে।
  $$2\\text{HCHO} + \\text{NaOH (50%)} \\rightarrow \\text{CH}_3\\text{OH} + \\text{HCOONa}$$

### ৩. গ্রিগনার্ড বিকারক (Grignard Reagent)
অ্যালকাইল বা অ্যারাইল ম্যাগনেসিয়াম হ্যালাইডকে ($\\text{R-Mg-X}$) গ্রিগনার্ড বিকারক বলে।
* **১° অ্যালকোহল প্রস্তুতি:** ফরমালডিহাইডের সাথে বিক্রিয়া।
* **২° অ্যালকোহল প্রস্তুতি:** ফরমালডিহাইড ব্যতীত অন্য যেকোনো অ্যালডিহাইডের সাথে বিক্রিয়া।
* **৩° অ্যালকোহল প্রস্তুতি:** কিটোনের সাথে বিক্রিয়া।`,
    isPremium: false
  },
  {
    id: "mat-3",
    title: "Calculus Limits & Derivatives Master Guide",
    banglaTitle: "উচ্চতর গণিত ১ম পত্র: ক্যালকুলাস জটিল সূত্রাবলী ও ট্রিকস",
    subject: Subject.MATHEMATICS,
    type: "guide",
    author: "Dr. Rafiqul Alam (RUET)",
    pages: 35,
    fileSize: "8.1 MB",
    description: "অন্তরীকরণ (Limit, Differentiation) এবং যোগজীকরণ (Integration) এর সকল আদর্শ সূত্র ও এল-হসপিটাল (L'Hospital) রুলের নিখুঁত প্রয়োগ।",
    contentMarkdown: `## ক্যালকুলাস: সুপার ট্রিকস ও সূত্রাবলী

### ১. এল'হসপিটাল রুল (L'Hospital's Rule)
যদি কোনো লিমিট $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$ বসানোর পর $\\frac{0}{0}$ বা $\\frac{\\infty}{\\infty}$ আকার ধারণ করে, তবে লব ও হরকে আলাদাভাবে ডিফারেনশিয়েট করে লিমিট বসানো যায়।
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$

*উদাহরণ:*
$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\lim_{x \\to 0} \\frac{\\cos x}{1} = \\cos 0 = 1$$

### ২. গুরুত্বপূর্ণ অন্তরীকরণ রূপভেদসমূহ
* $\\frac{d}{dx}(\\sin^n x) = n \\sin^{n-1} x \\cos x$
* $\\frac{d}{dx}(\\ln(\\sec x + \\tan x)) = \\sec x$
* $\\frac{d}{dx}(x^x) = x^x (1 + \\ln x)$

### ৩. যোগজীকরণ বিশেষ শর্টকাট সূত্রাবলী
* **অ্যান্টি-ডেরিভেটিভ শর্টকাট:**
  $$\\int \\frac{f'(x)}{f(x)} \\, dx = \\ln |f(x)| + C$$
* **সংযোজিত ফাংশন ট্রিক:**
  $$\\int e^x [f(x) + f'(x)] \\, dx = e^x f(x) + C$$`,
    isPremium: true
  },
  {
    id: "mat-4",
    title: "Cell Structure and Division Summary",
    banglaTitle: "জীববিজ্ঞান ১ম পত্র: কোষের গঠন ও কোষ বিভাজন সামারি শীট",
    subject: Subject.CHEMISTRY, // Simulated Biology (we mapped it conditionally or fallback)
    type: "note",
    author: "Mugdha Sen (Biology Expert)",
    pages: 15,
    fileSize: "3.5 MB",
    description: "ডিএনএ রেপ্লিকেশন, ট্রান্সক্রিপশন, ট্রান্সলেশন এবং মিওসিস বিভাজনের দশাসমূহের চিত্রসহ সাজানো হাই-ফ্রিকোয়েন্সি নোটবুক।",
    contentMarkdown: `## কোষ রসায়ন ও জিনতত্ত্ব অতি গুরুত্বপূর্ণ টপিকস

### ১. DNA ডাবল হেলিক্স মডেল (Watson & Crick, 1953)
* এটি দ্বিসূত্রক, ডানমুখী ঘূর্ণায়মান সিঁড়ির মতো।
* সিঁড়ির দুই পাশের রেলিং তৈরি হয় **ডি-অক্সিরাইবোজ শর্করা** এবং **ফসফেট** দ্বারা।
* মাঝখানের ধাপসমূহ গঠিত হয় **নাইট্রোজেন বেস** (Adenine, Thymine, Guanine, Cytosine) দ্বারা।
* $A$ এবং $T$ এর মাঝে ২টি হাইড্রোজেন বন্ধন ($A = T$), এবং $G$ ও $C$ এর মাঝে ৩টি বন্ধন ($G \\equiv C$) থাকে।

### ২. প্রোটিন সংশ্লেষণ ধাপসমূহ
* **ট্রান্সক্রিপশন (Transcription):** DNA থেকে mRNA তৈরির প্রক্রিয়া যা নিউক্লিয়াসের ভেতরে সম্পন্ন হয়।
* **ট্রান্সলেশন (Translation):** mRNA থেকে রাইবোজোমের সাহায্যে প্রোটিন উৎপন্ন হওয়ার জটিল প্রক্রিয়া।

### ৩. মিওসিস-১ প্রোফেজ-১ এর উপদশাসমূহ
কোষ বিভাজনের সবচেয়ে দীর্ঘ ও জটিল দশা প্রোফেজ-১। এর ৫টি উপদশা সিকোয়েন্স অনুযায়ী মুখস্থ রাখা জরুরি:
1. **লেপটোটিন (Leptotene):** ক্রোমোজোম ঘনীভূত হতে শুরু করে, বুকেট (Bouquet) তৈরি হয়।
2. **জাইগোটিন (Zygotene):** সমসংস্থ ক্রোমোজোম জোড় বাঁধে। এই জোড় বাঁধার প্রক্রিয়াকে **সিন্যাপসিস (Synapsis)** এবং জোড়কে **বাই ভ্যালেন্ট** বলে।
3. **প্যাকাইটিন (Pachytene):** সিস্টার ক্রোম্যাটিড বিভক্ত হয়ে টেট্রাড গঠন করে। নন-সিস্টার ক্রোম্যাটিডদ্বয় ছকের মতো ক্রস চিহ্ন তৈরি করে যা **কায়াজমা (Chiasma)** নামে পরিচিত। এখানে **ক্রসিং ওভার** ঘটে।
4. **ডিপ্লোটিন (Diplotene):** ক্রোমোজোমদ্বয় পরস্পরকে বিকর্ষণ করে এবং প্রান্তীয়করণ ঘটে।
5. **ডায়াকাইনেসিস (Diakinesis):** নিউক্লিওলাস এবং নিউক্লিয়ার মেমব্রেন বিলুপ্ত হয়ে যায়।`,
    isPremium: false
  },
  {
    id: "mat-5",
    title: "ICT Network Topologies and HTML Guide",
    banglaTitle: "আইসিটি: অধ্যায়-৪ ওয়েব ডিজাইন ও এইচটিএমএল বুকলেট",
    subject: Subject.ICT,
    type: "book",
    author: "HSC ICT Mentors",
    pages: 32,
    fileSize: "5.1 MB",
    description: "HTML এর সকল প্রয়োজনীয় ট্যাগ, টেবিল ডিজাইন, হাইপারলিংক, ইমেজ সংযুক্তিকরণ এবং সিএসএস সম্পর্কিত স্পষ্ট ধারণা নিয়ে সংকলিত বুকলেট।",
    contentMarkdown: `## এইচটিএমএল এবং ওয়েব ডিজাইন সহায়িকা

### ১. HTML সাধারণ কাঠামোর রূপরেখা
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>আমার প্রথম ওয়েবপেজ</title>
</head>
<body>
  <h1>স্বাগতম Study Qoro পোর্টালে!</h1>
  <p>এইচএসসি আইসিটি পরীক্ষার সহজ প্রস্তুতি।</p>
</body>
</html>
\`\`\`

### ২. HTML গুরুত্বপূর্ণ ট্যাগ তালিকা
* **হেডিং ট্যাগ:** \`<h1>\` থেকে \`<h6>\` পর্যন্ত।
* **অনুচ্ছেদ ও লাইন ব্রেক:** \`<p>\` এবং \`<br>\` (Empty tag)।
* **হাইপারলিংক:** \`<a href="url">লিংক টেক্সট</a>\`
* **ইমেজ যুক্তকরন:** \`<img src="image_url" alt="text" />\` (Empty tag)
* **লিস্ট ট্যাগ:**
  * অর্ডারড লিস্ট: \`<ol>\` এবং \`<li>\`
  * আনঅর্ডারড লিস্ট: \`<ul>\` এবং \`<li>\`

### ৩. টেবিল ডিজাইনের জটিল কোডিং
এইচটিএমএলে টেবিল তৈরির জন্য \`<table>, <tr> (Table Row), <th> (Table Header), <td> (Table Data)\` ট্যাগসমূহ ব্যবহৃত হয়।
* **Colspan:** একাধিক কলামকে একত্রিত করার জন্য।
* **Rowspan:** একাধিক রো বা সারি একত্রিত করার জন্য।`,
    isPremium: false
  },
  {
    id: "mat-6",
    title: "HSC Bangla 1st Paper Literature Summary",
    banglaTitle: "বাংলা ১ম পত্র: 'অপরিচিতা', 'সোনার তরী' ও 'বিদ্রোহী' বিশ্লেষণ",
    subject: Subject.BANGLA,
    type: "note",
    author: "Pratibha Mitra (Suhrawardy College)",
    pages: 20,
    fileSize: "3.1 MB",
    description: "বাংলা প্রথম পত্রের জটিল প্রবন্ধ ও কবিতার মূল ভাবার্থ, উক্তি বিশ্লেষণ ও সৃজনশীল ক-খ প্রশ্নের শতভাগ উত্তরের চূড়ান্ত রিভিশন শিট।",
    contentMarkdown: `## বাংলা ১ম পত্র সাহিত্য ও কবিতা কুইক রিভিশন

### ১. প্রবন্ধ বিশ্লেষণ: 'অপরিচিতা' (রবীন্দ্রনাথ ঠাকুর)
* **মূল চরিত্র:** অনুপম (গল্পের কথক), কল্যাণী (নায়িকা), শম্ভুনাথ সেন (কল্যাণীর পিতা), মামা (অনুপমের মামা)।
* **মূল বার্তা:** যৌতুক প্রথার যৌক্তিক প্রতিবাদ ও কল্যাণীর মাধ্যমে সামাজিক নারী স্বাধীনতার জয়গান। অনুপমের অকর্মণ্য ব্যক্তিত্ব ও তার মানসিক রূপান্তর এ গল্পের অনন্য উপজীব্য।
* **কমন সৃজনশীল অনুধাবন:** কল্যাণী কেন বিয়ে প্রত্যাখ্যান করেছিল? "মেয়েটির মুখ তখন রাগে লাল হইয়া গিয়াছিল" - উক্তিটির অন্তর্নিহিত অর্থ ব্যাখ্যা করো।

### ২. কবিতা বিশ্লেষণ: 'সোনার তরী' (রবীন্দ্রনাথ ঠাকুর)
* **মূল রূপক:**
  * **কৃষক:** মানবাত্মার প্রতিনিধি বা শিল্পস্রষ্টা।
  * **সোনার ধান:** মানুষের আজীবন লালিত সৎকর্ম বা শিল্পীর সৃষ্টিসম্ভার।
  * **নদী:** খরস্রোতা মহাকাল।
  * **তরী:** মহাকালের সীমিত রূপ ধারণক্ষমতা বহনকারী ছোট নৌকা।
* **মূল ভাবার্থ:** মহাকাল মানুষের মহৎ সৃষ্টিকে সযত্নে আঁকড়ে ধরে এবং গ্রহণ করে, কিন্তু স্বয়ং স্রষ্টাকে বা ব্যক্তিকে গ্রহণ করে না। সৃষ্টির মাঝে স্রষ্টা বেঁচে থাকেন, কিন্তু ব্যক্তি অবধারিতভাবে বিলীন হয়ে যায়।`,
    isPremium: false
  }
];

export default function StudyMaterials({ stats, setStats }: StudyMaterialsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject ] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  
  // Custom user notes list loaded/saved in local storage to keep items durable
  const [userCreatedNotes, setUserCreatedNotes] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user-study-materials");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // State for adding a custom note
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState<Subject>(Subject.PHYSICS);
  const [newNoteType, setNewNoteType] = useState<"note" | "book" | "guide">("note");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [addError, setAddError] = useState("");

  // Reader Modal states
  const [readerMaterial, setReaderMaterial] = useState<Material | null>(null);

  // Sync custom notes to localstorage on change
  useEffect(() => {
    localStorage.setItem("user-study-materials", JSON.stringify(userCreatedNotes));
  }, [userCreatedNotes]);

  const handleAddNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      setAddError("অনুগ্রহ করে নোটের শিরোনাম প্রদান করুন।");
      return;
    }
    if (!newNoteContent.trim() || newNoteContent.trim().length < 15) {
      setAddError("নোটের বিষয়বস্তু কমপক্ষে ১৫ অক্ষরের হতে হবে।");
      return;
    }

    const newMaterial: Material = {
      id: `custom-note-${Date.now()}`,
      title: newNoteTitle.trim(),
      banglaTitle: newNoteTitle.trim(),
      subject: newNoteSubject,
      type: newNoteType,
      author: stats.name || "শিক্ষার্থী",
      pages: Math.ceil(newNoteContent.length / 320) || 1,
      fileSize: `${(newNoteContent.length / 1024).toFixed(1)} KB`,
      description: newNoteContent.substring(0, 65) + (newNoteContent.length > 65 ? "..." : ""),
      contentMarkdown: newNoteContent,
      isPremium: false
    };

    setUserCreatedNotes(prev => [newMaterial, ...prev]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setAddError("");
    setShowAddForm(false);
    
    // Add 10 points to student for saving a self-made notes
    setStats(prev => ({
      ...prev,
      points: prev.points + 10
    }));

    // Simple feedback animation
    const audioFeed = document.createElement("div");
    audioFeed.className = "fixed bottom-5 right-5 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl z-50 shadow-xl transition-all animate-bounce text-xs";
    audioFeed.innerHTML = "📝 নতুন হ্যান্ডনোট যুক্ত হয়েছে! +১০ পয়েন্ট লাভ করেছ।";
    document.body.appendChild(audioFeed);
    setTimeout(() => audioFeed.remove(), 3500);
  };

  const handleDeleteCustomNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("আপনি কি নিশ্চিতভাবে এই কাস্টম নোটটি মুছে ফেলতে চান?")) {
      setUserCreatedNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  // Combine Preset materials with User created notes
  const allMaterials = [...userCreatedNotes, ...PRESET_MATERIALS];

  // Filters output
  const filteredMaterials = allMaterials.filter(m => {
    const matchesSearch = 
      (m.banglaTitle || "").toLowerCase().includes((searchTerm || "").toLowerCase()) || 
      (m.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()) || 
      (m.description || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (m.author || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    
    const matchesSubject = selectedSubject === "ALL" || m.subject === selectedSubject;
    const matchesType = selectedType === "ALL" || m.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div id="study-materials-portal" className="space-y-6">
      
      {/* Dynamic Header Frame */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm transition-all duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#ecf6f3] dark:bg-emerald-950/30 text-[#059669]">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-extrabold tracking-widest text-[#059669] dark:text-emerald-400 uppercase">HSC & Admission Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">স্টাডি ম্যাটেরিয়ালস (Hand Notes, Books)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">বাংলাদেশ সেরা বুয়েটিয়ান, মেডিকেল ও ঢাবিয়ান ভাইদের ও কাস্টম সেলফ-মেড লেকচার নোটস কালেকশন।</p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg dark:shadow-emerald-950/30 active:scale-95 transition-all text-center self-start md:self-auto"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "বন্ধ করুন" : "নিজে নোট যোগ করুন (+১০ পয়েন্ট)"}
        </button>
      </div>

      {/* Note Creator Form Slide in layout */}
      {showAddForm && (
        <form onSubmit={handleAddNewNote} className="p-5 sm:p-6 bg-[#fcfdfd] dark:bg-slate-900 border-2 border-dashed border-emerald-300/60 dark:border-emerald-900/30 rounded-3xl shadow-md transition-all space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <div className="flex items-center gap-1.5">
              <PenTool className="w-4.5 h-4.5 text-emerald-500" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">নতুন সেলফ রিভিশন নোট এড করুন</h4>
            </div>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">Local Storage Saved</span>
          </div>

          {addError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">বিষয় নির্বাচন করুন</label>
              <select 
                value={newNoteSubject} 
                onChange={(e) => setNewNoteSubject(e.target.value as Subject)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {Object.values(Subject).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">ম্যাটেরিয়াল ক্যাটাগরি</label>
              <select 
                value={newNoteType} 
                onChange={(e) => setNewNoteType(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="note">হ্যান্ড নোট / লেকচার শীট</option>
                <option value="book">রেফারেন্স বইপত্র</option>
                <option value="guide">ফর্মুলা ও সাজেশন গাইড</option>
              </select>
            </div>

            <div className="sm:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">নোটের টাইটেল (শিরোনাম)</label>
              <input 
                type="text" 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="যেমন: গণিত ১ম পত্র - ত্রিকোণমিতি শর্ট হ্যান্ড নোট"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                maxLength={70}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">নোটের বডি বা পড়ার বিষয়বস্তু (Markdown বা নরমাল টেক্সট)</label>
              <span className="text-[10px] text-slate-400">{newNoteContent.length} অক্ষর</span>
            </div>
            <textarea 
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="এখানে আপনার সাজানো ট্রিকস বা পড়ার সূত্রগুলো লিখে রাখুন। এটি আপনার পার্সোনাল সেকশনে লাইফ-টাইম সেভ থাকবে..."
              rows={5}
              className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button 
              type="button" 
              onClick={() => {
                setShowAddForm(false);
                setAddError("");
              }}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-500 font-bold text-xs rounded-xl transition-all"
            >
              বাতিল
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              সংরক্ষণ করুন ও ১০পয়েন্ট নিন
            </button>
          </div>
        </form>
      )}

      {/* FILTER CONTROLLER BOARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 sm:p-5 rounded-3xl shadow-sm space-y-4">
        
        {/* Row 1: Search & Type category split */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search bar */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="বিষয় শিরোনাম বা শিক্ষকের নামে সার্চ করুন..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all"
            />
          </div>

          {/* Type filter tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap w-full max-w-full pb-1">
            {[
              { id: "ALL", label: "সকল প্রকার" },
              { id: "note", label: "হ্যান্ড নোটস" },
              { id: "book", label: "বইপত্র কালেকশন" },
              { id: "guide", label: "ভর্তি গাইডলাইন" }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex-shrink-0 whitespace-nowrap ${
                  selectedType === type.id
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-705"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Subject horizontal slide tags */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 max-w-full">
          <div className="text-[9px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">বিষয় অনুযায়ী ফিল্টার করুন:</div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 w-full max-w-full">
            <button
              onClick={() => setSelectedSubject("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
                selectedSubject === "ALL"
                  ? "bg-[#ecf6f3] dark:bg-emerald-950/40 text-[#059669] border border-[#059669]/20"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 border border-slate-150 dark:border-slate-850"
              }`}
            >
              সব বিষয়
            </button>

            {Object.values(Subject).map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === sub
                    ? "bg-[#ecf6f3] dark:bg-emerald-950/40 text-[#059669] border border-[#059669]/20"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 border border-slate-150 dark:border-slate-850"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* MATERIALS LIBRARIES GRID */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h5 className="font-extrabold text-slate-800 dark:text-slate-250 text-sm">কোনো স্টাডি মেটেরিয়াল পাওয়া যায়নি!</h5>
            <p className="text-xs text-slate-400 dark:text-slate-500">অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা নিজেই কাস্টম নোট তৈরি করুন।</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => {
            const isUserNote = item.id.startsWith("custom-note-");
            
            return (
              <div 
                key={item.id} 
                onClick={() => setReaderMaterial(item)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850/80 rounded-2.5xl p-5 hover:border-emerald-300 dark:hover:border-emerald-800/50 hover:shadow-lg dark:hover:shadow-emerald-950/10 cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                {/* Upper row header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      item.type === "note" 
                        ? "bg-[#ecf6f3] dark:bg-emerald-950/30 text-[#059669] dark:text-emerald-400" 
                        : item.type === "book"
                          ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                    }`}>
                      {item.type === "note" ? "হ্যান্ড নোটস" : item.type === "book" ? "বইপত্র কালেকশন" : "ভর্তি গাইড" }
                    </span>

                    {/* Delete button for user created notes */}
                    {isUserNote ? (
                      <button
                        onClick={(e) => handleDeleteCustomNote(item.id, e)}
                        className="p-1.5 text-slate-350 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="নোটটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : item.isPremium ? (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black tracking-normal rounded-md">
                        <Sparkles className="w-2.5 h-2.5 fill-current text-amber-500" />
                        PRO MEMBER
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">HSC সিলেবাস</span>
                    )}
                  </div>

                  {/* Main titles info */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-855 dark:text-slate-100 group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.banglaTitle}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <span>বিষয়: {item.subject}</span>
                      <span>•</span>
                      <span>লিখেছেন: {item.author}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer specs of card */}
                <div className="border-t border-slate-100 dark:border-slate-800/70 pt-3.5 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-350" />
                      <span>{item.pages} পৃষ্ঠা</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-350" />
                      <span>{item.fileSize}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#059669] dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform text-xs">
                    <span>পড়ুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* STUDY NOTES READING MODAL COMPONENT */}
      {readerMaterial && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-slate-800 dark:text-slate-100">
            
            {/* Modal Top Action Toolbar */}
            <div className="p-5 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-[#059669] dark:text-emerald-400">
                  <Book className="w-3.5 h-3.5" />
                  <span>{readerMaterial.subject} • {readerMaterial.type === "note" ? "লেকচার হ্যান্ডনোট" : "হ্যান্ডবুক পিডিএফ"}</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {readerMaterial.banglaTitle}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Download note simulated trigger button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const audioFeed = document.createElement("div");
                    audioFeed.className = "fixed bottom-5 right-5 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl z-50 shadow-xl transition-all animate-bounce text-xs";
                    audioFeed.innerHTML = "📥 " + readerMaterial.title + " এর অফলাইন সংস্করণ ডাউনলোড বাফার সফলভাবে প্রস্তুত হয়েছে!";
                    document.body.appendChild(audioFeed);
                    setTimeout(() => audioFeed.remove(), 4000);
                  }}
                  className="p-2 sm:px-3 sm:py-1.5 bg-emerald-500/10 hover:bg-[#059669]/20 text-[#059669] dark:text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  title="ডাউনলোড রিকোয়েস্ট করুন"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">ডাউনলোড ({readerMaterial.fileSize})</span>
                </button>

                <button 
                  onClick={() => setReaderMaterial(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document body viewport */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin space-y-6 select-text max-h-[60vh] bg-slate-50/20 dark:bg-slate-950/10">
              
              {/* Document Disclaimer Alert */}
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/10 text-[11px] leading-relaxed select-none">
                <BookmarkCheck className="w-4 h-4 shrink-0 text-amber-500" />
                <span>মেম্বারদের স্বাচ্ছন্দ্যে পড়ার সুবিধার্থে, এই স্টাডি পোর্টালে ডার্ক-মোড সমৃদ্ধ টেক্সট রিডার ইন্টিগ্রেট করা হয়েছে। নোটের বিষয়বস্তু নিচে প্রদর্শিত হলো:</span>
              </div>

              {/* Simulated Render Content formatting nicely */}
              <div id="material-reader-content" className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-5 font-sans whitespace-pre-wrap">
                
                {/* Author card attribution banner */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-3.5 select-none text-xs text-slate-400 font-medium">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-[#059669] flex items-center justify-center font-black">
                    {readerMaterial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-[#059669] dark:text-emerald-400">{readerMaterial.author}</p>
                    <p className="text-[10px] text-slate-400">সংকলক ও এইচএসসি টিউটর</p>
                  </div>
                  <div className="ml-auto text-right text-[10px] text-slate-400">
                    <p>পৃষ্ঠা সংখ্যা: {readerMaterial.pages}</p>
                    <p>সাইজ: {readerMaterial.fileSize}</p>
                  </div>
                </div>

                {/* Main Content text body */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-emerald-500/20">
                  {readerMaterial.contentMarkdown}
                </div>

              </div>
            </div>

            {/* Modal Bottom toolbar */}
            <div className="p-4 border-t border-slate-150 dark:border-slate-850/85 bg-white dark:bg-slate-900 flex justify-end gap-2.5 select-none shrink-0">
              <span className="text-[10px] text-slate-400 py-1.5 mr-auto">পড়ার সমায়সীমা ট্র্যাক হচ্ছে...</span>
              <button 
                onClick={() => {
                  const audioFeed = document.createElement("div");
                  audioFeed.className = "fixed bottom-5 right-5 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl z-50 shadow-xl transition-all animate-bounce text-xs";
                  audioFeed.innerHTML = "⭐️ টপিকটি বুকমার্ক বা রিভিশন তালিকায় যুক্ত হয়েছে!";
                  document.body.appendChild(audioFeed);
                  setTimeout(() => audioFeed.remove(), 3500);
                }}
                className="px-4 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-500 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1"
              >
                <span>বুকমার্ক লিস্টে রাখুন</span>
              </button>
              <button 
                onClick={() => setReaderMaterial(null)}
                className="px-5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                পড়া শেষ
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* NEW: SEO Friendly internal links section for article marketing */}
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          সাজেশন ও আর্টিকেল (Study Blog)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/blog/hsc-chemistry-1st-paper-suggestion-2025" className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-indigo-400 transition-colors block group">
            <span className="text-[10px] text-indigo-500 font-bold uppercase mb-1 block">Suggestion</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">এইচএসসি রসায়ন ১ম পত্র সাজেশন ২০২৫: শেষ মুহূর্তের প্রস্তুতি</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">এইচএসসি রসায়ন ১ম পত্রের গুরুত্বপূর্ণ অধ্যায় ও টপিকের সাজেশন। বিশেষ করে গুণগত রসায়ন এবং পর্যায়বৃত্ত ধর্ম থেকে...</p>
          </a>
          <a href="/blog/dhaka-university-admission-marks-distribution" className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-indigo-400 transition-colors block group">
            <span className="text-[10px] text-indigo-500 font-bold uppercase mb-1 block">Admission</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">ঢাবি ভর্তি পরীক্ষার মানবন্টন ও চান্স পাওয়ার কৌশল</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">ঢাকা বিশ্ববিদ্যালয়ের ক, খ ও গ ইউনিটের নতুন মানবন্টন ও প্রস্তুতি নেওয়ার সেরা কৌশল। ঢাবি (DU) ভর্তি পরীক্ষায়...</p>
          </a>
        </div>
      </div>

    </div>
  );
}
