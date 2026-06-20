import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { StudentStats } from "../types";
import { Check, X, ShieldAlert, BookOpen, ExternalLink, Globe, Lock } from "lucide-react";

export default function AdminPanel({ stats }: { stats: StudentStats }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("ভুল পাসওয়ার্ড");
    }
  };

  if (!isAuthenticated && stats.email !== "lorddanju@gmail.com") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Admin Access Required</h2>
        <p className="text-sm text-slate-500 mb-6">দয়া করে অ্যাডমিন পাসওয়ার্ড দিন</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-center"
          />
          {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold px-4 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            প্রবেশ করুন
          </button>
        </form>
      </div>
    );
  }

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "pending_colleges"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApplications(list);
    } catch (e) {
      console.error("Error fetching pending colleges", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [isAuthenticated, stats.email]);

  const handleApprove = async (app: any) => {
    try {
      // Add to main 'colleges' collection
      await addDoc(collection(db, "colleges"), {
        name: app.name,
        division: app.division,
        district: app.district,
        eiin: app.eiin || "",
        website: app.website || "",
        createdBy: app.createdBy,
        approved: true,
        createdAt: new Date().toISOString()
      });
      
      // Delete from pending
      await deleteDoc(doc(db, "pending_colleges", app.id));
      
      setApplications(prev => prev.filter(a => a.id !== app.id));
      alert("College approved and moved to main collection successfully!");
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, "colleges");
    }
  };

  const handleDecline = async (id: string) => {
    if (!window.confirm("Are you sure you want to decline and delete this college request?")) return;
    try {
      await deleteDoc(doc(db, "pending_colleges", id));
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, "pending_colleges/" + id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <p className="text-xs text-slate-500">Manage pending college applications.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6 font-medium text-sm">
        <button className="pb-3 border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400">
          Pending College Requests
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-500">No pending requests right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{app.name}</h3>
                <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                  <span><strong className="text-slate-700 dark:text-slate-300">Division:</strong> {app.division}</span>
                  <span><strong className="text-slate-700 dark:text-slate-300">District:</strong> {app.district}</span>
                  {app.eiin && <span><strong className="text-slate-700 dark:text-slate-300">EIIN:</strong> {app.eiin}</span>}
                </div>
                {app.website && (
                  <a href={app.website} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-500 font-bold flex items-center gap-1 hover:underline mt-1 w-fit">
                    <Globe className="w-3 h-3" /> View Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <div className="text-[9px] text-slate-400 font-mono mt-2">Requested by: {app.createdBy}</div>
              </div>
              <div className="flex gap-2 shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => handleApprove(app)}
                  className="flex-1 md:flex-none border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleDecline(app.id)}
                  className="flex-1 md:flex-none border border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
