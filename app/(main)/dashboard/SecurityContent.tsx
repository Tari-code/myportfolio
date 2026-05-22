"use client";

import React, { useState, useEffect } from "react";
import {
  Shield, Monitor, Smartphone, Globe, Trash2, RefreshCw, Copy, Check,
  Key, Zap, Crown, Building2, Star, Lock, ChevronRight, AlertTriangle,
  Laptop, ExternalLink, CheckCircle2, XCircle, Loader2, Sparkles, Award,
  TrendingUp, BarChart3, Users, Headphones, Database, Rocket
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SecurityContentProps {
  user: any;
}

function parseDevice(ua: string) {
  if (!ua) return { icon: Globe, label: "Unknown Device", browser: "Unknown" };
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let browser = "Browser";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  let os = "Desktop";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";

  return {
    icon: isMobile ? Smartphone : Laptop,
    label: `${browser} on ${os}`,
    browser,
    os,
  };
}

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any; perks: string[] }> = {
  free: {
    label: "Free", color: "text-foreground/50", bg: "bg-foreground/5", border: "border-card-border",
    icon: Globe,
    perks: ["Community access", "Basic support", "1 project quote"],
  },
  pro: {
    label: "Pro", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
    icon: Zap,
    perks: ["Everything in Free", "Priority support", "5 project quotes/mo", "Advanced analytics"],
  },
  elite: {
    label: "Elite", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20",
    icon: Star,
    perks: ["Everything in Pro", "Dedicated account manager", "Unlimited quotes", "Early feature access", "API access"],
  },
  business: {
    label: "Business", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20",
    icon: Crown,
    perks: ["Everything in Elite", "Team management", "Custom SLA", "White-label reports", "Direct dev hotline"],
  },
};

const UPGRADE_TIERS = [
  { id: "pro", price: "$29/mo", highlight: false },
  { id: "elite", price: "$79/mo", highlight: true },
  { id: "business", price: "$199/mo", highlight: false },
];

export default function SecurityContent({ user }: SecurityContentProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(user?.apiKey || null);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [revokingKey, setRevokingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const currentTier = user?.tier || "free";
  const tierInfo = TIER_CONFIG[currentTier];
  const TierIcon = tierInfo.icon;

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) setSessions(await res.json());
    } catch {}
    setLoadingSessions(false);
  };

  const revokeSession = async (sessionId: string, isCurrent: boolean) => {
    setRevokingId(sessionId);
    try {
      const res = await fetch(`/api/sessions?sessionId=${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        if (data.loggedOut) {
          window.location.href = "/customer/login";
        } else {
          setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        }
      }
    } catch {}
    setRevokingId(null);
  };

  const generateApiKey = async () => {
    setGeneratingKey(true);
    try {
      const res = await fetch("/api/users/api-key", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setNewKey(data.apiKey);
        setApiKey(data.apiKey);
      }
    } catch {}
    setGeneratingKey(false);
  };

  const revokeApiKey = async () => {
    setRevokingKey(true);
    try {
      const res = await fetch("/api/users/api-key", { method: "DELETE" });
      if (res.ok) { setApiKey(null); setNewKey(null); }
    } catch {}
    setRevokingKey(false);
  };

  const copyKey = () => {
    if (newKey || apiKey) {
      navigator.clipboard.writeText(newKey || apiKey || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10">

      {/* — Account Tier Banner — */}
      <section className={`glass-panel rounded-[2.5rem] border ${tierInfo.border} overflow-hidden`}>
        <div className={`p-8 md:p-10 bg-gradient-to-br ${
          currentTier === "business" ? "from-amber-500/10 via-background to-background" :
          currentTier === "elite"    ? "from-purple-500/10 via-background to-background" :
          currentTier === "pro"      ? "from-blue-500/10 via-background to-background" :
                                       "from-foreground/3 via-background to-background"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${tierInfo.bg} border ${tierInfo.border} flex items-center justify-center`}>
                <TierIcon size={26} className={tierInfo.color} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-display font-bold text-foreground">Your Account</h2>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${tierInfo.bg} ${tierInfo.color} border ${tierInfo.border}`}>
                    {tierInfo.label} Tier
                  </span>
                </div>
                <p className="text-foreground/50 text-sm">Active perks on your current plan</p>
              </div>
            </div>
            {currentTier === "free" && (
              <a href="#upgrade" className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95">
                <Rocket size={16} /> Upgrade Plan
              </a>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tierInfo.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                <CheckCircle2 size={14} className={tierInfo.color} />
                {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — Upgrade Options — */}
      {currentTier === "free" && (
        <section id="upgrade" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Upgrade Your Plan</h3>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">Unlock elite business capabilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPGRADE_TIERS.map(({ id, price, highlight }) => {
              const tc = TIER_CONFIG[id];
              const Ic = tc.icon;
              return (
                <div
                  key={id}
                  className={`glass-panel rounded-[2rem] p-6 border flex flex-col gap-4 relative overflow-hidden transition-all hover:scale-[1.02] ${
                    highlight ? "border-purple-500/30 shadow-xl shadow-purple-500/10" : tc.border
                  }`}
                >
                  {highlight && (
                    <div className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Most Popular
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${tc.bg} border ${tc.border} flex items-center justify-center`}>
                    <Ic size={20} className={tc.color} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-display font-bold text-foreground">{price}</span>
                    </div>
                    <p className={`text-sm font-bold mt-0.5 ${tc.color}`}>{tc.label} Plan</p>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {tc.perks.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-foreground/60">
                        <Check size={12} className={tc.color} /> {p}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    highlight
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                      : `${tc.bg} ${tc.color} border ${tc.border} hover:opacity-80`
                  }`}>
                    Choose {tc.label}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* — Active Sessions — */}
      <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-card-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Monitor size={22} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Active Sessions</h3>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Devices signed into your account</p>
            </div>
          </div>
          <button
            onClick={fetchSessions}
            className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-card-border text-foreground/40 hover:text-foreground transition-all active:scale-95"
          >
            <RefreshCw size={15} className={loadingSessions ? "animate-spin" : ""} />
          </button>
        </div>

        {loadingSessions ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-brand-500" size={24} />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10 text-foreground/30 font-medium">No active sessions found. Log in again to see them here.</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const { icon: DevIcon, label } = parseDevice(s.userAgent);
              const location = [s.city, s.country].filter(Boolean).join(", ") || s.ip || "Unknown location";
              const isRevoking = revokingId === s.sessionId;
              return (
                <div
                  key={s.sessionId}
                  className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                    s.isCurrent
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-foreground/[0.02] border-card-border"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      s.isCurrent ? "bg-green-500/10" : "bg-foreground/5"
                    }`}>
                      <DevIcon size={18} className={s.isCurrent ? "text-green-500" : "text-foreground/40"} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground truncate">{label}</span>
                        {s.isCurrent && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/20">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/40 font-medium mt-0.5">
                        {location} · {s.lastActive ? formatDistanceToNow(new Date(s.lastActive), { addSuffix: true }) : "Just now"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => revokeSession(s.sessionId, s.isCurrent)}
                    disabled={isRevoking}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      s.isCurrent
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        : "bg-foreground/5 text-foreground/40 border border-card-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                    }`}
                  >
                    {isRevoking ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    {s.isCurrent ? "Sign Out" : "Revoke"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {sessions.length > 1 && (
          <button
            onClick={async () => {
              const others = sessions.filter(s => !s.isCurrent);
              for (const s of others) await revokeSession(s.sessionId, false);
            }}
            className="mt-4 w-full py-3 rounded-2xl border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all active:scale-95"
          >
            Sign out all other sessions
          </button>
        )}
      </section>

      {/* — API Key Management — */}
      <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-card-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Key size={22} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">API Access Key</h3>
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Authenticate programmatic requests</p>
          </div>
        </div>

        {newKey ? (
          <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 mb-4">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle2 size={12} /> Key generated — copy it now, it won&apos;t be shown again
            </p>
            <div className="flex items-center gap-3 mt-3">
              <code className="flex-1 text-xs font-mono text-foreground/70 bg-foreground/5 border border-card-border rounded-xl px-4 py-3 truncate">
                {newKey}
              </code>
              <button
                onClick={copyKey}
                className="shrink-0 w-10 h-10 rounded-xl bg-foreground/5 border border-card-border flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        ) : apiKey ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border mb-4">
            <code className="flex-1 text-sm font-mono text-foreground/40 truncate">
              {apiKey.slice(0, 12)}••••••••••••••••••••••••••••
            </code>
            <span className="text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">Active</span>
          </div>
        ) : (
          <p className="text-sm text-foreground/40 mb-4 font-medium">No API key generated. Create one to authenticate server-to-server requests.</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={generateApiKey}
            disabled={generatingKey}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {generatingKey ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {apiKey ? "Regenerate Key" : "Generate Key"}
          </button>
          {apiKey && (
            <button
              onClick={revokeApiKey}
              disabled={revokingKey}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {revokingKey ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Revoke
            </button>
          )}
        </div>
      </section>

      {/* — Business Profile — */}
      <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-card-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Building2 size={22} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Business Profile</h3>
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Your organisation details</p>
          </div>
        </div>

        <BusinessProfileForm user={user} />
      </section>

      {/* — Elite Perks Grid — */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Award size={20} className="text-amber-400" />
          <h3 className="text-lg font-bold text-foreground">Elite Business Features</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Headphones, title: "Priority Support", desc: "Skip the queue — direct access to a dedicated account manager.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { icon: BarChart3, title: "Advanced Analytics", desc: "Full project velocity metrics, team capacity reports, and ROI dashboards.", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
            { icon: Users, title: "Team Management", desc: "Invite team members, assign roles, and share project access.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { icon: Database, title: "Data Export", desc: "Download your full account data, project history, and invoices anytime.", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            { icon: Shield, title: "Custom SLA", desc: "Negotiated uptime guarantees and escalation protocols for enterprise clients.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { icon: Rocket, title: "Early Access", desc: "Be first to try new platform features, tools, and integrations in beta.", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
          ].map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div key={title} className={`glass-panel p-6 rounded-[2rem] border ${border} flex flex-col gap-3`}>
              <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{title}</h4>
                <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{desc}</p>
              </div>
              {currentTier === "free" && (
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full self-start">
                  Elite+
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function BusinessProfileForm({ user }: { user: any }) {
  const [form, setForm] = useState({
    company: user?.company || "",
    website: user?.website || "",
    industry: user?.industry || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const inputClass = "w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3.5 px-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm";

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider ml-1">Company Name</label>
          <input
            value={form.company}
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            placeholder="Tari Technologies Ltd"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider ml-1">Website</label>
          <input
            value={form.website}
            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://example.com"
            type="url"
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider ml-1">Industry</label>
        <select
          value={form.industry}
          onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
          className={inputClass}
        >
          <option value="">Select industry…</option>
          {["Technology", "Finance & Banking", "Healthcare", "E-commerce", "Education", "Real Estate", "Media & Entertainment", "Manufacturing", "Consulting", "Other"].map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-60"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saved ? "Saved!" : saving ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
