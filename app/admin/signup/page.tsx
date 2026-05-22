"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Shield, User, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Key } from "lucide-react";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [systemKey, setSystemKey] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    if (step === "form") {
      gsap.fromTo(formRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }
      );
    } else {
      gsap.fromTo(formRef.current,
        { opacity: 0, rotateX: 90 },
        { opacity: 1, rotateX: 0, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock system key check for "privacy"
    if (systemKey !== "TARI-ADMIN-2026") {
      setError("Invalid System Access Key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "admin", phone: "SYSTEM-ADMIN" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>
      
      <div 
        ref={formRef}
        className="w-full max-w-lg glass-panel p-10 md:p-12 rounded-[2rem] border border-white/5 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/60 backdrop-blur-3xl"
      >
        {step === "form" ? (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-black shadow-xl transform -rotate-6">
                <Shield size={32} />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">System Registry</h1>
              <p className="text-brand-100/40 text-sm font-bold uppercase tracking-[0.2em]">Private Administrative Access</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin Email"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Secure Password"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-500 transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    required
                    type="password"
                    value={systemKey}
                    onChange={(e) => setSystemKey(e.target.value)}
                    placeholder="System Access Key"
                    className="w-full bg-brand-500/5 border border-brand-500/20 rounded-xl py-4 pl-12 pr-4 text-brand-400 focus:outline-none focus:border-brand-500 transition-all font-mono text-sm placeholder:text-brand-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Register Admin</>}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-white/20 text-[10px] tracking-widest uppercase font-bold">
                Already registered?{" "}
                <Link href="/admin/login" className="text-brand-400 hover:text-brand-300 transition-colors">Admin Sign In</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shadow-xl mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest">Verify Access</h1>
              <p className="text-brand-100/40 text-sm font-bold uppercase tracking-[0.1em]">
                Code sent to <span className="text-white">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2 text-center">
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full text-center text-4xl font-mono font-bold tracking-[0.5em] bg-white/5 border border-white/10 rounded-xl py-5 text-white focus:outline-none focus:border-brand-500 transition-all placeholder:text-white/5"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Authorization"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
