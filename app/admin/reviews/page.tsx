"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, X, Star, MessageSquare, Loader2 } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews/admin"); // I'll need a new admin API route for this
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'delete') => {
    try {
      await fetch("/api/reviews/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });
      fetchReviews();
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Review Management</h1>
          <p className="text-foreground/60 font-medium">Approve or remove user-submitted testimonials.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.length === 0 ? (
            <div className="glass-panel p-12 text-center text-foreground/30 font-medium rounded-[2rem]">
              No pending or approved reviews found.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className={`glass-panel p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${rev.isApproved ? 'border-card-border' : 'border-brand-500/30 bg-brand-500/[0.02]'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-foreground">{rev.name}</span>
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{rev.role || 'User'}</span>
                    {!rev.isApproved && (
                       <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                    )}
                  </div>
                  <p className="text-foreground/70 font-medium italic">&quot;{rev.content}&quot;</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? 'text-yellow-500' : 'text-foreground/10'} fill={i < rev.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!rev.isApproved && (
                    <button 
                      onClick={() => handleAction(rev._id, 'approve')}
                      className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleAction(rev._id, 'delete')}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
