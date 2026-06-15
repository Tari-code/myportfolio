"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Target, Zap, Globe, Shield, Star, MessageSquare, Send, Quote, User, Briefcase, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import ThreeDreamscape from "@/components/ThreeDreamscape";

export default function AboutPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", content: "", role: "", rating: 5 });
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setToast(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: 'success', text: "✓ Thank you! Your review has been submitted for approval." });
        setFormData({ name: "", content: "", role: "", rating: 5 });
      } else {
        setToast({ type: 'error', text: data?.error || "Failed to submit review. Please try again." });
      }
    } catch (err) {
      console.error("Review submit error:", err);
      setToast({ type: 'error', text: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative overflow-hidden">
      <ThreeDreamscape />
      {/* Fixed Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border font-bold text-sm transition-all ${toast.type === 'success'
            ? 'bg-green-500/95 text-white border-green-400'
            : 'bg-red-500/95 text-white border-red-400'
            }`}
          style={{ backdropFilter: 'blur(12px)', minWidth: '320px', maxWidth: '90vw', textAlign: 'center', justifyContent: 'center' }}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.text}
        </div>
      )}

      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Explore the <span className="text-gradient">Living World</span> of Tari Tech
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-medium">
          A layered digital ecosystem built for wonder, clarity, and momentum. We turn ambitious ideas into immersive experiences that feel cinematic, intelligent, and alive.
        </p>
      </div>

      {/* Vision & Values Section (Re-used from Home but themed for About) */}
      <section className="mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: <Target className="text-brand-500" />, title: "Our Mission", desc: "To empower global businesses through radical innovation and precision software engineering.", color: "brand" },
            { icon: <Zap className="text-purple-500" />, title: "Radical Innovation", desc: "Pushing the boundaries of what's possible with AI, cloud computing, and advanced web architectures.", color: "purple" },
            { icon: <Globe className="text-yellow-500" />, title: "Global Impact", desc: "Built with local passion, engineered for world-class scale and international infrastructure.", color: "yellow" },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-card-border hover:border-brand-500/30 hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/80 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] border border-card-border relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full" />
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-20 h-20 shrink-0 rounded-[2rem] bg-brand-500/10 flex items-center justify-center">
              <Shield size={40} className="text-brand-500" />
            </div>
            <div>
              <h4 className="text-3xl font-display font-bold text-foreground mb-4">Uncompromising Integrity</h4>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium max-w-3xl">
                Trust is our primary currency. We maintain the highest standards of security, privacy, and ethical engineering in every line of code we write, ensuring that our solutions are as reliable as they are revolutionary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">Meet the <span className="text-gradient">Team</span></h2>
          <p className="text-foreground/80 font-medium">The visionary minds behind the technology.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[4rem] border border-card-border text-center group hover:border-brand-500/30 transition-all">
            <div className="w-40 h-40 mx-auto rounded-[3rem] bg-gradient-to-br from-brand-500/20 to-purple-500/20 mb-8 border border-card-border relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/image.png" alt="Paul Gambo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-2">Paul Gambo</h3>
            <p className="text-brand-500 font-bold uppercase tracking-[0.2em] mb-6">Founder & CEO</p>
            <p className="text-foreground/80 leading-relaxed font-medium mb-10 max-w-md mx-auto">
              A computer scientist and full-stack engineer dedicated to pushing the boundaries of technology.
            </p>
            <Link href="/about/ceo" className="inline-flex px-8 py-4 rounded-2xl bg-foreground text-background font-bold items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-foreground/10">
              View My Portfolio <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">Live <span className="text-gradient">Testimonials</span></h2>
            <p className="text-foreground/80 font-medium text-lg">Real feedback from users and partners across the globe.</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? reviews.map((rev, i) => (
            <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-card-border hover:border-brand-500/20 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 transition-all flex flex-col group testimonial-card">
              <Quote className="text-brand-500/20 group-hover:text-brand-500/40 transition-colors mb-4" size={40} />
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14}
                    className={s <= (rev.rating ?? 5) ? 'text-yellow-400' : 'text-foreground/10'}
                    fill={s <= (rev.rating ?? 5) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-foreground/80 font-medium text-lg italic mb-8 flex-1 leading-relaxed">&quot;{rev.content}&quot;</p>
              <div className="flex items-center gap-4 pt-6 border-t border-card-border">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-lg">
                  {rev.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{rev.name}</h4>
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{rev.role || 'Partner'}</p>
                </div>
              </div>
            </div>
          )) : (
            [
              { name: "Sarah Chen", role: "Product Manager", rating: 5, content: "Tari Tech transformed our digital infrastructure with unmatched speed and precision. Their AI integration is next-level." },
              { name: "Marcus Thorne", role: "CEO, Thorne Labs", rating: 5, content: "Working with Paul and his team was a revelation. They don't just deliver code; they deliver strategic innovation." },
              { name: "Elena Rodriguez", role: "Tech Lead", rating: 5, content: "The level of engineering excellence at Tari Tech is rare. Their vision for the next digital era is truly inspiring." },
            ].map((rev, i) => (
              <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-card-border opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 transition-all flex flex-col testimonial-card">
                <Quote className="text-brand-500/20 mb-4" size={40} />
                {/* Star Rating */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14}
                      className={s <= rev.rating ? 'text-yellow-400' : 'text-foreground/10'}
                      fill={s <= rev.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-foreground/80 font-medium text-lg italic mb-8 flex-1 leading-relaxed">&quot;{rev.content}&quot;</p>
                <div className="flex items-center gap-4 pt-6 border-t border-card-border">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-lg">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{rev.name}</h4>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Review Section */}
      <section className="relative z-10">
        <div className="glass-panel p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[4rem] border border-card-border relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-500/5 blur-[120px] rounded-full" />

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
                <MessageSquare className="text-brand-500" />
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">Leave a <span className="text-gradient">Review</span></h2>
              <p className="text-foreground/80 font-medium">Your feedback helps us innovate and grow.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-[0.2em] mb-2 ml-4">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-foreground focus:outline-none focus:border-brand-500 transition-all font-bold"
                    placeholder="Paul Tari"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-[0.2em] mb-2 ml-4">Your Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-foreground focus:outline-none focus:border-brand-500 transition-all font-bold"
                    placeholder="CEO, Engineer, etc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-2 ml-4">Your Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-[2rem] px-6 py-5 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium"
                  placeholder="Share your experience with Tari Tech..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 bg-foreground/[0.03] px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border border-card-border">
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`transition-all ${formData.rating >= star ? 'text-yellow-500 scale-110' : 'text-foreground/10 hover:text-yellow-500/40'}`}
                      >
                        <Star size={20} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : <><Send size={18} /> Submit Review</>}
                </button>
              </div>



            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
