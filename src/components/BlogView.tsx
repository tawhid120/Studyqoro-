import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Share2 } from "lucide-react";

export default function BlogView({ slug, onBack }: { slug: string, onBack: () => void }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have injected SSR data, use it!
    const win = window as any;
    if (win.__INITIAL_BLOG_DATA__ && win.__INITIAL_BLOG_DATA__.slug === slug) {
      setPost(win.__INITIAL_BLOG_DATA__);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">লোড হচ্ছে...</div>;
  }

  if (!post) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">আর্টিকেল পাওয়া যায়নি</h2>
        <button onClick={onBack} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold">
          ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">ফিরে যান</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex gap-2 items-center mb-6">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">
            {post.category || "Study Content"}
          </span>
          <span className="text-slate-400 text-sm font-medium">{post.date}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          {post.content.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <button className="flex items-center gap-2 text-indigo-500 hover:text-indigo-600 font-bold text-sm bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl transition-colors">
            <Share2 className="w-4 h-4" />
            শেয়ার করুন
          </button>
        </div>
      </div>
    </div>
  );
}
