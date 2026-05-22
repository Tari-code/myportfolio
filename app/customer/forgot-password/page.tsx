"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.devResetUrl) setDevUrl(data.devResetUrl);
        gsap.to(formRef.current, {
          opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in",
          onComplete: () => {
            setSubmitted(true);
            setTimeout(() => {
              gsap.fromTo(formRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
              );
            }, 50);
          }
        });
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-40 relative flex items-center justify-center p-6 py-16 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div
        ref={formRef}
        className="w-full max-w-lg glass-panel p-8 md:p-12 rounded-[2.5rem] relative z-10 shadow-xl border border-card-border"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                <Mail size={26} />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">Forgot Password</h1>
              <p className="text-foreground/60 font-medium">Enter your email and we&apos;ll send you a reset link</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70"
              >
                {loading
                  ? <Loader2 className="animate-spin" size={20} />
                  : <><Send size={18} /> Send Reset Link</>
                }
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/customer/login" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors font-medium">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-3 tracking-tight">Check your inbox</h2>
              <p className="text-foreground/60 font-medium mb-2">
                If an account exists for <span className="text-foreground font-bold">{email}</span>, we&apos;ve sent a reset link.
              </p>
              <p className="text-foreground/40 text-sm">The link expires in 1 hour. Check your spam folder if you don&apos;t see it.</p>

              {devUrl && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left">
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">Dev Mode — No email configured</p>
                  <p className="text-xs text-foreground/50 mb-2">Use this link to reset the password:</p>
                  <Link href={devUrl} className="text-xs text-brand-500 break-all hover:underline">{devUrl}</Link>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => { setSubmitted(false); setEmail(""); setDevUrl(""); }}
                  className="w-full py-4 rounded-2xl border border-card-border text-foreground/60 hover:text-foreground hover:border-foreground/20 font-bold transition-all text-sm"
                >
                  Try a different email
                </button>
                <Link
                  href="/customer/login"
                  className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
