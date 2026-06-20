import React from 'react';
import { ExternalLink, HelpCircle, BookOpen, Calculator } from 'lucide-react';

const topics = [
  {
    id: "section-1",
    titleBn: "১. ভেক্টরের মৌলিক ধারণা ও যোগ-বিয়োগ",
    titleEn: "(Basic Concepts, Vector Addition & Subtraction)",
    formula: "R = √(P² + Q² + 2PQcosα)",
    url: "https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_en.html",
    simTitle: "Vector Addition (PhET Interactive)",
    questions: [
      "১. দুটি ভেক্টরের মধ্যবর্তী কোণ ০°, ৯০° এবং ১৮০° হলে তাদের লব্ধি (Sum) কেমন হয়?",
      "২. সামান্তরিক সূত্র কীভাবে কাজ করে তা সিমুলেশন ব্যবহার করে দেখাও।",
      "৩. ভেক্টর বিয়োগের ক্ষেত্রে লব্ধি ভেক্টরের দিক কোন দিকে হয়?"
    ]
  },
  {
    id: "section-2",
    titleBn: "২. ভেক্টরের বিভাজন ও উপাংশ",
    titleEn: "(Vector Resolution & Components)",
    formula: "A = Axî + Ayĵ",
    url: "https://phet.colorado.edu/sims/html/vector-addition-equations/latest/vector-addition-equations_en.html",
    simTitle: "Vector Addition: Equations (PhET)",
    questions: [
      "১. x এবং y অক্ষ বরাবর ভেক্টরের উপাংশ পরিবর্তন করলে মূল ভেক্টরের মানের কী পরিবর্তন ঘটে?",
      "২. a·A এবং b·B এর মান পরিবর্তন করে কীভাবে গাণিতিক হিসাব করা যায়?",
      "৩. ঋণাত্মক স্কেলার দিয়ে গুণ করলে ভেক্টরের দিক কীভাবে পরিবর্তিত হয়?"
    ]
  },
  {
    id: "section-3",
    titleBn: "৩. ভেক্টরের গুণন (ডট ও ক্রস গুণন)",
    titleEn: "(Vector Multiplication: Dot & Cross Product)",
    formula: "A·B = ABcosθ, |A×B| = ABsinθ",
    url: "https://www.geogebra.org/material/iframe/id/N2aK2xWq",
    simTitle: "3D Vector Product (GeoGebra)",
    questions: [
      "১. দুটি ভেক্টর পরস্পর লম্ব হলে তাদের ডট গুণনের মান কত হয় তা পরীক্ষা করে দেখাও।",
      "২. ডানহাতি স্ক্রু নিয়ম ব্যবহার করে ক্রস গুণনের (A×B) দিক কীভাবে নির্ণয় করা যায়?",
      "৩. দুটি ভেক্টর সমান্তরাল হলে তাদের ক্রস গুণনের মান কত হয়?"
    ]
  },
  {
    id: "section-4",
    titleBn: "৪. নদী-নৌকা ও গাণিতিক প্রয়োগ",
    titleEn: "(River-Boat Problems)",
    formula: "v = v_boat + v_river",
    url: "https://ophysics.com/k11.html",
    simTitle: "River Crossing Simulation (oPhysics)",
    questions: [
      "১. স্রোতের বেগ বাড়লে সোজাসুজি নদী পার হওয়ার জন্য নৌকার কোণ কীভাবে পরিবর্তন করতে হয়?",
      "২. সর্বনিম্ন সময়ে এবং সর্বনিম্ন দূরত্বে নদী পার হওয়ার মধ্যে পার্থক্য কী?",
      "৩. নৌকার লব্ধি বেগ কীভাবে নির্ণয় করা যায় এবং তা স্রোতের বেগের ওপর কীভাবে নির্ভরশীল?"
    ]
  },
  {
    id: "section-5",
    titleBn: "৫. আপেক্ষিক বেগ (বৃষ্টি ও ছাতা)",
    titleEn: "(Relative Velocity: Rain & Umbrella)",
    formula: "V_rel = Va - Vb",
    url: "https://ophysics.com/k10.html",
    simTitle: "Relative Velocity Simulation (oPhysics)",
    questions: [
      "১. চলন্ত গাড়িতে বৃষ্টির ফোঁটা কত কোণে পড়ে এবং গাড়ির বেগের সাথে এর সম্পর্ক কী?",
      "২. দুই বা ততোধিক গতিশীল বস্তুর আপেক্ষিক বেগ কীভাবে হিসাব করতে হয়?",
      "৩. ছাতা ধরার কোণ নির্ণয়ের ক্ষেত্রে লম্ব উপাংশ এবং ভূমি উপাংশের ভূমিকা কী?"
    ]
  }
];

export default function VectorSimulations({ topicId }: { topicId?: string }) {
  const displayTopics = topicId ? topics.filter(t => t.id === topicId) : topics;

  return (
    <div className={`w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans ${topicId ? 'rounded-2xl overflow-hidden' : 'min-h-screen'}`}>
      {/* Sticky Navbar for Jump Links - Only show if displaying all topics */}
      {!topicId && (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
            <ul className="flex items-center gap-6 whitespace-nowrap text-sm font-medium text-slate-600">
              <li className="text-slate-800 font-bold hidden md:block mr-4">দ্রুত নেভিগেশন:</li>
              <li><a href="#section-1" className="hover:text-blue-600 transition-colors">১. যোগ ও বিয়োগ</a></li>
              <li><a href="#section-2" className="hover:text-blue-600 transition-colors">২. উপাংশ বিভাজন</a></li>
              <li><a href="#section-3" className="hover:text-blue-600 transition-colors">৩. ডট ও ক্রস গুণন</a></li>
              <li><a href="#section-4" className="hover:text-blue-600 transition-colors">৪. নদী-নৌকা পারাপার</a></li>
              <li><a href="#section-5" className="hover:text-blue-600 transition-colors">৫. আপেক্ষিক বেগ</a></li>
            </ul>
          </div>
        </nav>
      )}

      <div className={`max-w-6xl mx-auto ${topicId ? 'p-0' : 'px-4 py-8'}`}>
        {/* Header Section - Only show if displaying all topics */}
        {!topicId && (
          <div className="bg-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-800/80 text-sm font-semibold mb-4 tracking-wider shadow-sm">
                PHET SIMULATION LAB
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                HSC পদার্থবিজ্ঞান ১ম পত্র<br />অধ্যায় ২: ভেক্টর
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                ইন্টারেক্টিভ সিমুলেশনের মাধ্যমে ভেক্টরের গাণিতিক সূত্র ও বাস্তব প্রয়োগের চাক্ষুষ অভিজ্ঞতা।
              </p>
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-12">
          {displayTopics.map((topic, index) => {
            const originalIndex = topics.findIndex(t => t.id === topic.id);
            return (
            <div 
              key={topic.id} 
              id={topic.id}
              className={`bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden ${topicId ? '' : 'border rounded-3xl shadow-sm hover:shadow-md transition-shadow scroll-mt-24'}`}
            >
              {/* Card Header */}
              <div className="bg-slate-100 dark:bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
                  {originalIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {topic.titleBn}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
                    {topic.titleEn}
                  </p>
                </div>
                
                {/* Formula Box */}
                <div className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 px-4 py-2.5 rounded-xl text-blue-800 dark:text-blue-300 font-mono font-bold text-sm md:text-base shadow-sm self-stretch md:self-auto min-w-[max-content]">
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{topic.formula}</span>
                </div>
              </div>

              {/* Simulation Iframe */}
              <div className="p-6 md:p-8">
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
                  <div className="w-full h-full">
                    <iframe
                      src={topic.url}
                      className="w-full border-0"
                      style={{ height: '500px' }}
                      allowFullScreen
                      title={topic.simTitle}
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2">
                       <BookOpen className="w-4 h-4" /> 
                       {topic.simTitle}
                    </span>
                    <a href={topic.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      ফুলস্ক্রিন <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Learning Questions */}
              <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-5">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  অনুশীলন প্রশ্নসমূহ:
                </h3>
                <ul className="space-y-4">
                  {topic.questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <span className="leading-snug">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
