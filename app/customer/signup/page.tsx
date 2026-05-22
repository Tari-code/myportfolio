"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    if (step === "form") {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 30, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power4.out" }
      );
    } else {
      gsap.fromTo(formRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role: "customer" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.error || "Signup failed");
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
        router.push("/");
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
    <div className="min-h-[calc(100vh-80px)] pt-40 relative flex items-center justify-center p-6 py-16 overflow-hidden bg-background">
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div
        ref={formRef}
        className="w-full max-w-lg glass-panel p-8 md:p-12 rounded-[2.5rem] relative z-10 shadow-xl border border-card-border"
      >
        {step === "form" ? (
          <>
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                <User size={26} />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">Join Tari</h1>
              <p className="text-foreground/60 font-medium">Create your account to get started</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Paul Gambo"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Create Account</>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-foreground/60 text-sm font-medium">
                Already have an account?{" "}
                <Link href="/customer/login" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Sign In</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shadow-xl mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">Verify Your Email</h1>
              <p className="text-foreground/60 font-medium px-4">
                We've sent a 6-digit code to <span className="text-foreground font-bold">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] block mb-4">Enter Verification Code</label>
                <div className="flex justify-center gap-3">
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full max-w-[200px] text-center text-3xl font-bold tracking-[0.5em] bg-foreground/[0.03] border border-card-border rounded-2xl py-4 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-foreground/10"
                  />
                </div>
              </div>

              <div className="bg-brand-500/5 border border-brand-500/10 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="text-brand-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Verification ensures your account is secure and allows you to receive important project updates.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Activate Account"}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-sm font-bold text-foreground/40 hover:text-brand-500 transition-colors"
                >
                  Change Email Address
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
