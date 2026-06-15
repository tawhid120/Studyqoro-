/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Question, LeaderboardUser } from "./types";

export const QUESTION_BANK: Question[] = [
  // Physics Questions
  {
    id: "phy-01",
    subject: Subject.PHYSICS,
    chapter: "ভৌত জগৎ ও পরিমাপ",
    questionText: "কোনটি সিস্টেমেটিক ট্রুটির অন্তর্ভুক্ত নয়?",
    options: [
      "যন্ত্রের ব্যক্তিগত ত্রুটি",
      "যান্ত্রিক ত্রুটি",
      "পদ্ধতিগত ত্রুটি",
      "ব্যক্তিগত পর্যবেক্ষণ বা অনিয়মিত ত্রুটি"
    ],
    correctIndex: 3,
    explanation: "অনিয়মিত বা দৈব ত্রুটি (Random errors) গুলো সিস্টেমেটিক বা পদ্ধতিগত ত্রুটির অন্তর্ভুক্ত নয়। এগুলো সাধারণত পর্যবেক্ষকের অসাবধানতা বা পরিবেশের আকস্মিক পরিবর্তনের কারণে ঘটে।"
  },
  {
    id: "phy-02",
    subject: Subject.PHYSICS,
    chapter: "ভেক্টর",
    questionText: "দুটি সমমানের ভেক্টরের লব্ধির মান তাদের যেকোনো একটির মানের সমান হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?",
    options: ["60°", "90°", "120°", "180°"],
    correctIndex: 2,
    explanation: "লব্ধির সূত্রানুসারী: R^2 = P^2 + Q^2 + 2PQ cosθ। এখানে R = P = Q হলে, P^2 = 2P^2(1 + cosθ) => 1/2 = 1 + cosθ => cosθ = -1/2 => θ = 120°।"
  },
  {
    id: "phy-03",
    subject: Subject.PHYSICS,
    chapter: "নিউটনিয়ান বলবিদ্যা",
    questionText: "রকেটের গতি কোন নীতির ওপর ভিত্তি করে কাজ করে?",
    options: [
      "ভরের নিত্যতা সূত্র",
      "শক্তির নিত্যতা সূত্র",
      "রৈখিক ভরবেগের সংরক্ষণ সূত্র",
      "কৌণিক ভরবেগের সংরক্ষণ সূত্র"
    ],
    correctIndex: 2,
    explanation: "রকেটের জ্বেলে নির্গমনের সময় পেছনের দিকে অতিরিক্ত ভরবেগ তৈরি হওয়ায় রকেট সামনের দিকে তীব্র রৈখিক গতি লাভ করে যা ভরবেগের সংরক্ষণ নীতি প্রমাণ করে।"
  },

  // Chemistry
  {
    id: "chem-01",
    subject: Subject.CHEMISTRY,
    chapter: "গুণগত রসায়ন",
    questionText: "কোন অরবিটালের শক্তি সবচেয়ে কম?",
    options: ["3d", "4s", "4p", "4f"],
    correctIndex: 1,
    explanation: "আউফবাউ নীতি অনুযায়ী (n+l) নিয়মে: 3d এর মান (3+2)=5; 4s এর মান (4+0)=4; 4p এর মান (4+1)=5। যেহেতু 4s এর অবিরটাল মান সবচেয়ে কম, তাই এর শক্তিও কম।"
  },
  {
    id: "chem-02",
    subject: Subject.CHEMISTRY,
    chapter: "গুণগত রসায়ন",
    questionText: "সাধারণ রক্তরসে pH-এর মান কত থাকে?",
    options: ["7.00 - 7.20", "7.35 - 7.45", "6.50 - 7.00", "7.80 - 8.00"],
    correctIndex: 1,
    explanation: "মানুষের রক্তের স্বাভাবিক pH পরিসীমা হলো ৭.৩৫ থেকে ৭.৪৫। এটি সামান্য ক্ষারীয়।"
  },

  // Bangla
  {
    id: "bng-01",
    subject: Subject.BANGLA,
    chapter: "বাংলা প্রথম পত্র - অপরিচিতা",
    questionText: "'অপরিচিতা' গল্পে অনুপমের আসল অভিভাবক কে ছিলেন?",
    options: ["অনুপমের মা", "অনুপম নিজে", "অনুপমের মামা", "অনুপমের পিসা"],
    correctIndex: 2,
    explanation: "রবীন্দ্রনাথ ঠাকুরের রচিত 'অপরিচিতা' গল্পে অনুপমের মামা অনুপমের সমস্ত সাংসারিক দায়িত্বের প্রধান কর্ণধার এবং আসল অভিভাবক রূপে চিত্রিত হয়েছেন।"
  },

  // English
  {
    id: "eng-01",
    subject: Subject.ENGLISH,
    chapter: "Right Forms of Verbs",
    questionText: "Choose the correct sentence:",
    options: [
      "He speaks as if he knew everything.",
      "He speaks as if he knows everything.",
      "He speaks as if he has known everything.",
      "He speaks as if he would know everything."
    ],
    correctIndex: 0,
    explanation: "After 'as if' or 'as though', if the preceding clause is in simple present tense, the subjunctive past is used (the verb becomes past simple, e.g., 'knew')."
  },

  // ICT
  {
    id: "ict-01",
    subject: Subject.ICT,
    chapter: "সংখ্যা পদ্ধতি",
    questionText: "হেক্সাডেসিমেল সংখ্যা পদ্ধতির বেস বা ভিত্তি কত?",
    options: ["2", "8", "10", "16"],
    correctIndex: 3,
    explanation: "Hexadecimal সংখ্যা পদ্ধতিতে ০-৯ এবং A-F (মোট ১৬টি প্রতিক) ব্যবহৃত হয় বিধায় এর ভিত্তি হচ্ছে ১৬।"
  },
  {
    id: "ict-02",
    subject: Subject.ICT,
    chapter: "এইচটিএমএল (HTML)",
    questionText: "এইচটিএমএল-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?",
    options: ["<h6>", "<h1>", "<head>", "<header>"],
    correctIndex: 1,
    explanation: "HTML ফাইলে হেডিং প্রকাশের জন্য ১ থেকে ৬ পর্যন্ত ট্যাগ রয়েছে যার মধ্যে <h1> সবচেয়ে বড় আকারের হেডিং প্রদর্শন করে।"
  },

  // General Knowledge
  {
    id: "gk-01",
    subject: Subject.GENERAL_KNOWLEDGE,
    chapter: "বাংলাদেশ বিষয়াবলী",
    questionText: "বাংলাদেশের সংবিধানের মূল ভিত্তি বা মূলনীতি কয়টি?",
    options: ["৩টি", "৪টি", "৫টি", "৬টি"],
    correctIndex: 1,
    explanation: "বাংলাদেশের সংবিধানের প্রধান মূলনীতি বা স্তম্ভ ৪টি: জাতীয়তাবাদ, সমাজতন্ত্র ও সামাজিক সুবিচার, গণতন্ত্র এবং ধর্মনিরপেক্ষতা।"
  },
  {
    id: "gk-02",
    subject: Subject.GENERAL_KNOWLEDGE,
    chapter: "মুক্তিযুদ্ধ",
    questionText: "মুজিবনগর সরকার কবে গঠিত হয়েছিল?",
    options: [
      "১০ এপ্রিল ১৯৭১",
      "১৭ এপ্রিল ১৯৭১",
      "৭ মার্চ ১৯৭১",
      "২৫ মার্চ ১৯৭১"
    ],
    correctIndex: 0,
    explanation: "মুজিবনগর ১৯৭১ সালের ১০ এপ্রিল তারিখে আনুষ্ঠানিকভাবে গঠিত হয়েছিল এবং শপথ গ্রহণ অনুষ্ঠান সম্পন্ন হয়েছিল ১৭ এপ্রিল ১৯৭১ মেহেরপুরের বৈদ্যনাথতলার আম্রকাননে।"
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [];

export const ACHIEVEMENTS = [
  {
    id: "badge-1",
    name: "নিয়মতান্ত্রিক শিক্ষার্থী (Disciplined Mind)",
    description: "সাফল্যের মূল ভিত্তি অধ্যাবসায়। পড়াশোনা ও দৈনিক কার্যক্রমে সময়ানুবর্তিতা বজায় রাখার সম্মাননা badge!",
    icon: "🌟",
    pointsRequired: 50
  },
  {
    id: "badge-2",
    name: "নিয়মিত যোদ্ধা (Daily Warrior)",
    description: "টানা ৫ দিন পড়াশোনার ধারাবাহিকতা বজায় রেখেছ!",
    icon: "🔥",
    pointsRequired: 100
  },
  {
    id: "badge-3",
    name: "মেধাবী মস্তিষ্ক (Mastermind)",
    description: "মক টেস্টে ৯০% এর বেশি নম্বর পেয়েছ!",
    icon: "🧠",
    pointsRequired: 150
  },
  {
    id: "badge-4",
    name: "র‍্যাংকিং হিরো (Top Ranger)",
    description: "লিডারবোর্ডে টপ ৫ এর মধ্যে অবস্থান করেছ!",
    icon: "🏆",
    pointsRequired: 200
  }
];

export const SAMPLE_AI_SUGGESTIONS = [
  "ভেক্টরের ডট গুণন ও ক্রস গুণনের মধ্যে পার্থক্য বুঝিয়ে দাও",
  "মুজিবনগর সরকারের ৫ জন প্রধান মন্ত্রিপরিষদ সদস্যের নাম বলো",
  "HTML এ <iframe> ব্যবহার করার নিয়ম কি?",
  "pH এর গাণিতিক ব্যাখ্যা এবং বাফার দ্রবণের গুরুত্ব সহজ ভাষায় বোঝাও"
];
