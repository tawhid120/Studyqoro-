import { useState } from "react";
import { StudentStats } from "../types";
import { ChevronRight, ArrowLeft, PlayCircle, Book, Layers, ExternalLink } from "lucide-react";
import { 
  simulationsData, 
  SimulationSubject, 
  SimulationChapter, 
  SimulationTopic 
} from "../simulationsData";
import MagnetAndCompass from "./simulations/MagnetAndCompass";
import VectorSimulations from "./simulations/VectorSimulations";

interface SimulationsViewProps {
  stats: StudentStats;
}

export default function SimulationsView({ stats }: SimulationsViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<SimulationSubject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<SimulationChapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SimulationTopic | null>(null);

  // Drill-down breadcrumbs handling
  const resetAll = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
  };

  const handleSubjectClick = (subject: SimulationSubject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setSelectedTopic(null);
  };

  const handleChapterClick = (chapter: SimulationChapter) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
  };

  const handeTopicClick = (topic: SimulationTopic) => {
    setSelectedTopic(topic);
  };

  const goBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const goBackToChapters = () => {
    setSelectedChapter(null);
  };

  const goBackToTopics = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold mb-2">থ্রিডি ও সিমুলেশন</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">এনিমেটেড ও ইন্টারেক্টিভ সিমুলেশনের মাধ্যমে জটিল কনসেপ্টগুলো সহজে আয়ত্ত করো।</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

        {/* --- STEP 1: SUBJECTS --- */}
        {!selectedSubject && (
          <div className="space-y-6 relative z-10">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Book className="w-5 h-5 text-emerald-500" /> 
              বিষয় নির্বাচন করো
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {simulationsData.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-left transition-all hover:shadow-md group flex flex-col gap-3"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {subject.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{subject.chapters.length} টি অধ্যায়</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 2: CHAPTERS --- */}
        {selectedSubject && !selectedChapter && (
          <div className="space-y-6 relative z-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={goBackToSubjects}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-2 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <button onClick={goBackToSubjects} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">বিষয়</button>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedSubject.title}</span>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-4">অধ্যায় নির্বাচন করো</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubject.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                      <Book className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{chapter.title}</h3>
                      <p className="text-xs text-slate-500">{chapter.topics.length} টি সিমুলেশন</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 3: TOPICS LIST --- */}
        {selectedChapter && !selectedTopic && (
          <div className="space-y-6 relative z-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={goBackToChapters}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-2 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <button onClick={goBackToSubjects} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">বিষয়</button>
                  <ChevronRight className="w-4 h-4 mx-0.5" />
                  <button onClick={goBackToChapters} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">{selectedSubject?.title}</button>
                  <ChevronRight className="w-4 h-4 mx-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedChapter.title}</span>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-4">সিমুলেশন নির্বাচন করো</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChapter.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handeTopicClick(topic)}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-bl-[100px] pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-all">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors pr-2">{topic.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        ইন্টারেক্টিভ ল্যাব
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              {selectedChapter.topics.length === 0 && (
                 <div className="col-span-full py-10 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                    <p>এই অধ্যায়ে এখনও কোনো সিমুলেশন যুক্ত করা হয়নি।</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 4: EMBED VIEW --- */}
        {selectedTopic && (
          <div className="space-y-6 relative z-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={goBackToTopics}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-2 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[120px] sm:max-w-[150px]">{selectedChapter?.title}</span>
                  <ChevronRight className="w-4 h-4 mx-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[150px] sm:max-w-[200px]">{selectedTopic.title}</span>
                </div>
              </div>
            </div>

            {selectedTopic.type === 'internal' && selectedTopic.componentId === 'MagnetAndCompass' ? (
              <div className="mt-6 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                 <div className="bg-slate-100 dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 p-3 flex justify-between items-center rounded-t-2xl">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{selectedTopic.title}</h3>
                 </div>
                 <MagnetAndCompass />
              </div>
            ) : selectedTopic.type === 'internal' && selectedTopic.componentId === 'VectorSimulations' ? (
              <div className="mt-6 rounded-2xl flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <VectorSimulations topicId={selectedTopic.id} />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-950 flex flex-col">
                <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 dark:text-slate-100">{selectedTopic.title}</h3>
                   <a 
                     href={selectedTopic.embedUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg transition-colors"
                   >
                      ফুলস্ক্রিন <ExternalLink className="w-3.5 h-3.5" />
                   </a>
                </div>
                <div className="relative w-full" style={{ paddingBottom: '75%' /* 4:3 aspect ratio */, minHeight: '400px' }}>
                  <iframe
                    src={selectedTopic.embedUrl}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                    title={selectedTopic.title}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Show tips for iframe but maybe not for native */}
            {selectedTopic.type === 'iframe' && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
                 <strong>টিপস:</strong> মোবাইল ফোনে রোটেশন লক বন্ধ করে স্ক্রিন আড়াআড়ি (Landscape) করে নিলে সিমুলেশন ব্যবহার করতে সুবিধা হবে।
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
}
