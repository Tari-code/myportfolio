"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      return;
    }
    fetch(`/api/auth/reset-password?token=${token}`)
      .then(r => r.json())
      .then(data => {
        setTokenValid(data.valid);
        setValidating(false);
        if (data.valid) {
          setTimeout(() => {
            gsap.fromTo(formRef.current,
              { opacity: 0, y: 30, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
            );
          }, 50);
        }
      })
      .catch(() => { setTokenValid(false); setValidating(false); });
  }, [token]);

  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        gsap.to(formRef.current, {
          opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in",
          onComplete: () => {
            setSuccess(true);
            setTimeout(() => {
              gsap.fromTo(formRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
              );
            }, 50);
          }
        });
        setTimeout(() => router.push("/customer/login"), 4000);
      } else {
        setError(data.error || "Failed to reset password");
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
        style={{ opacity: validating ? 1 : undefined }}
      >
        {validating ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto mb-4 text-brand-500" size={32} />
            <p className="text-foreground/50 font-medium">Validating your reset link…</p>
          </div>
        ) : !tokenValid ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
              <ShieldAlert size={26} />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3 tracking-tight">Link Expired</h2>
            <p className="text-foreground/60 mb-8">This reset link is invalid or has expired. Please request a new one.</p>
            <Link
              href="/customer/forgot-password"
              className="inline-flex items-center gap-2 w-full justify-center py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all"
            >
              <ArrowRight size={18} /> Request New Link
            </Link>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
              <CheckCircle2 size={30} />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3 tracking-tight">Password Reset!</h2>
            <p className="text-foreground/60 mb-2">Your password has been updated successfully.</p>
            <p className="text-foreground/40 text-sm mb-8">Redirecting you to sign in…</p>
            <Link
              href="/customer/login"
              className="inline-flex items-center gap-2 w-full justify-center py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all"
            >
              <ArrowRight size={18} /> Sign In Now
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                <Lock size={26} />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">New Password</h1>
              <p className="text-foreground/60 font-medium">Choose a strong password for your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center gap-2">
                <XCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-foreground/10"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-foreground/40 ml-1">{strengthLabel}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/60 ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    required
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    autoComplete="new-password"
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-foreground/[0.03] border rounded-2xl py-4 pl-12 pr-12 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-4 transition-all ${
                      confirm.length > 0
                        ? confirm === password
                          ? "border-green-500/40 focus:border-green-500/50 focus:ring-green-500/10"
                          : "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/10"
                        : "border-card-border focus:border-brand-500/50 focus:ring-brand-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {confirm.length > 0 && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      {confirm === password
                        ? <CheckCircle2 size={16} className="text-green-500" />
                        : <XCircle size={16} className="text-red-500" />
                      }
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || password !== confirm || password.length < 8}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Reset Password</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
