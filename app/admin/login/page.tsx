"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Shield, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role === "admin") {
          // Show the technical loading modal before redirecting
          setShowLoadingModal(true);
          setTimeout(() => {
            router.push("/admin");
            router.refresh();
          }, 1500);
        } else {
          setError("Access denied. Admin only.");
          setLoading(false);
        }
      } else {
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Loading Modal Overlay */}
      <LoadingScreen isVisible={showLoadingModal} fullScreen={true} />

      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-brand-500/5 to-transparent"></div>

      <div
        ref={formRef}
        className="w-full max-w-lg glass-panel p-10 md:p-12 rounded-[2rem] border border-white/5 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20 transform rotate-12">
            <Shield size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">Admin Access</h1>
          <p className="text-brand-100/40 text-sm">Secure authorization required</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <Mail size={18} />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <Lock size={18} />
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Key"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500/50 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Authenticate</>}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <div className="mt-4">
            <Link href="/admin/signup" className="text-[10px] text-white/10 hover:text-white/30 transition-colors uppercase tracking-[0.2em]">System Registration</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
