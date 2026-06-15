"use client";

import React, { useState } from "react";
import {
  Globe, Zap, Star, Crown, Check, X, ChevronRight, Sparkles,
  MessageSquare, BarChart3, Key, Headphones, Rocket, Shield, Users,
  Lock, CheckCircle2, Loader2
} from "lucide-react";

interface Props {
  user: any;
  onUpgradeRequest: (tier: string) => void;
  onUserUpdate: (user: any) => void;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Get started with the basics",
    icon: Globe,
    color: "text-foreground/50",
    bg: "bg-foreground/5",
    border: "border-card-border",
    activeBorder: "border-foreground/20",
    glow: "",
    features: [
      { label: "1 support ticket/month", included: true },
      { label: "Community access", included: true },
      { label: "News submissions", included: true },
      { label: "Basic profile", included: true },
      { label: "AI starter prompts", included: true },
      { label: "Priority support", included: false },
      { label: "Advanced analytics", included: false },
      { label: "API access", included: false },
      { label: "Custom integrations", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    tagline: "For growing professionals",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    activeBorder: "border-blue-500/50",
    glow: "shadow-blue-500/20",
    features: [
      { label: "10 support tickets/month", included: true },
      { label: "Community access + smart DMs", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Enhanced profile + AI bio ideas", included: true },
      { label: "Priority support queue", included: true },
      { label: "Basic analytics + weekly pulse", included: true },
      { label: "API access (1000 req/day)", included: true },
      { label: "Automation templates", included: true },
      { label: "Custom integrations", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$79",
    period: "/month",
    tagline: "For high-performance teams",
    icon: Star,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    activeBorder: "border-purple-500/50",
    glow: "shadow-purple-500/20",
    badge: "Most Popular",
    features: [
      { label: "Unlimited support tickets", included: true },
      { label: "Community access + priority DMs", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Full profile customization", included: true },
      { label: "Dedicated support line", included: true },
      { label: "Full analytics suite", included: true },
      { label: "API access (10k req/day)", included: true },
      { label: "AI campaign builder", included: true },
      { label: "Custom integrations", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$199",
    period: "/month",
    tagline: "Enterprise-grade power",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    activeBorder: "border-amber-500/50",
    glow: "shadow-amber-500/20",
    badge: "Best Value",
    features: [
      { label: "Unlimited support tickets", included: true },
      { label: "Community access + premium DMs", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Full profile + company branding", included: true },
      { label: "White-glove support + SLA", included: true },
      { label: "Full analytics + exports", included: true },
      { label: "Unlimited API access", included: true },
      { label: "AI launch briefs + automation studio", included: true },
      { label: "Custom integrations + webhooks", included: true },
    ],
  },
];

const TIER_ORDER = ["free", "pro", "elite", "business"];

const PAYMENT_METHODS = [
  { name: "Card", detail: "Visa / Mastercard / Amex", accent: "bg-brand-500/10 text-brand-500 border-brand-500/20" },
  { name: "PayPal", detail: "Fast checkout with wallet", accent: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { name: "Bank Transfer", detail: "Invoice-based enterprise billing", accent: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
];

export default function BillingContent({ user, onUpgradeRequest, onUserUpdate }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<(typeof PLANS)[number] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const currentTier = user?.tier || "free";
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  const handleUpgradeRequest = async (planId: string) => {
    if (planId === currentTier) return;
    const targetPlan = PLANS.find((plan) => plan.id === planId);
    if (!targetPlan) return;

    setCheckoutPlan(targetPlan);
    setSubmitStatus(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan || checkoutPlan.id === currentTier) return;

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upgradeTier", tier: checkoutPlan.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upgrade failed");
      }

      setSubmitStatus({ type: "success", message: `✓ Payment approved — your account is now on the ${checkoutPlan.name.toUpperCase()} plan.` });
      onUserUpdate(data.user);
      onUpgradeRequest(checkoutPlan.id);
      setCheckoutPlan(null);
    } catch (error: any) {
      setSubmitStatus({ type: "error", message: error.message || "Payment could not be completed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-xl">
          <div className="w-full max-w-xl rounded-[2rem] border border-brand-500/20 bg-[linear-gradient(145deg,rgba(12,18,32,0.98),rgba(7,10,18,0.98))] p-6 shadow-2xl shadow-brand-500/10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-500">Secure Checkout</p>
                <h3 className="text-2xl font-display font-black text-foreground">Upgrade to {checkoutPlan.name}</h3>
                <p className="text-xs text-foreground/55 mt-1">Complete payment here and your tier updates instantly.</p>
              </div>
              <button type="button" onClick={() => setCheckoutPlan(null)} className="rounded-full border border-card-border bg-foreground/5 p-2 text-foreground/50 hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="rounded-[1.5rem] border border-brand-500/15 bg-brand-500/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Plan</span>
                  <strong className="text-foreground">{checkoutPlan.name} · {checkoutPlan.price}{checkoutPlan.period}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-foreground/50 mt-2">
                  <span>Payment method</span>
                  <span>{paymentMethod}</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-foreground/60">Cardholder name
                  <input className="mt-1 w-full rounded-2xl border border-card-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground" defaultValue={user?.name || ""} />
                </label>
                <label className="text-xs text-foreground/60">Email
                  <input className="mt-1 w-full rounded-2xl border border-card-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground" defaultValue={user?.email || ""} />
                </label>
                <label className="text-xs text-foreground/60 md:col-span-2">Card number
                  <input className="mt-1 w-full rounded-2xl border border-card-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground" placeholder="4242 4242 4242 4242" />
                </label>
                <label className="text-xs text-foreground/60">Expiry
                  <input className="mt-1 w-full rounded-2xl border border-card-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground" placeholder="09/29" />
                </label>
                <label className="text-xs text-foreground/60">CVV
                  <input className="mt-1 w-full rounded-2xl border border-card-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground" placeholder="123" />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button key={method.name} type="button" onClick={() => setPaymentMethod(method.name)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${paymentMethod === method.name ? "border-brand-500/40 bg-brand-500/10 text-brand-500" : "border-card-border bg-foreground/5 text-foreground/50"}`}>
                    {method.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button type="button" onClick={() => setCheckoutPlan(null)} className="rounded-2xl border border-card-border bg-foreground/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-500/20 disabled:opacity-70">{submitting ? "Processing…" : `Pay ${checkoutPlan.price}${checkoutPlan.period}`}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} />
          Subscription Plans
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3 tracking-tight text-gradient">
          Engineering the Right Tier for You
        </h2>
        <p className="text-foreground/50 text-sm font-medium leading-relaxed">
          Unlock advanced support, analytics, and API capabilities. Contact us to upgrade — changes take effect immediately.
        </p>
        {submitStatus && (
          <div className={`mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border ${submitStatus.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
            {submitStatus.type === "success" ? <CheckCircle2 size={14} /> : <X size={14} />}
            {submitStatus.message}
          </div>
        )}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === currentTier;
          const planIndex = TIER_ORDER.indexOf(plan.id);
          const isUpgrade = planIndex > currentTierIndex;
          const isDowngrade = planIndex < currentTierIndex;

          return (
            <div
              key={plan.id}
              className={`glass-panel rounded-[2.5rem] border relative overflow-hidden flex flex-col transition-all duration-300 ${isCurrent ? `${plan.activeBorder} shadow-2xl ${plan.glow}` : plan.border} ${isUpgrade ? "hover:scale-[1.02] hover:" + plan.activeBorder : ""}`}
            >
              {plan.badge && (
                <div className={`absolute top-0 inset-x-0 text-center py-1.5 text-[10px] font-black uppercase tracking-widest ${plan.bg} ${plan.color} border-b ${plan.border}`}>
                  {plan.badge}
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 inset-x-0 text-center py-1.5 text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border-b border-green-500/20">
                  Current Plan
                </div>
              )}

              <div className={`p-7 flex flex-col flex-1 ${plan.badge || isCurrent ? "pt-9" : ""}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-2xl ${plan.bg} border ${plan.border} flex items-center justify-center ${plan.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${plan.color}`}>{plan.name}</h3>
                    <p className="text-[10px] text-foreground/40 font-semibold">{plan.tagline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-black text-foreground">{plan.price}</span>
                  <span className="text-foreground/40 text-sm font-semibold">{plan.period}</span>
                </div>

                <div className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feat) => (
                    <div key={feat.label} className="flex items-center gap-2.5">
                      {feat.included
                        ? <Check size={12} className={`${plan.color} shrink-0`} />
                        : <X size={12} className="text-foreground/15 shrink-0" />
                      }
                      <span className={`text-xs font-semibold ${feat.included ? "text-foreground/70" : "text-foreground/25"}`}>
                        {feat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <div className="w-full py-3 rounded-2xl border border-green-500/20 bg-green-500/5 text-green-400 font-bold text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={13} />
                    Active Plan
                  </div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleUpgradeRequest(plan.id)}
                    disabled={submitting && checkoutPlan?.id === plan.id}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${plan.bg} ${plan.color} border ${plan.border} hover:${plan.activeBorder}`}
                  >
                    {submitting && checkoutPlan?.id === plan.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Rocket size={13} />
                    )}
                    Upgrade to {plan.name}
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-2xl border border-card-border text-foreground/25 font-bold text-xs text-center flex items-center justify-center gap-2">
                    <Lock size={13} />
                    Downgrade
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="glass-panel rounded-[2rem] border border-card-border p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40">Plan restrictions</p>
          <h3 className="text-lg font-black text-foreground mt-2">Unlock more as you scale</h3>
          <p className="text-xs text-foreground/50 mt-2">Free accounts keep the essentials open, while Pro, Elite, and Business unlock automation, analytics, and premium support.</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "Free", note: "Core access, 1 support ticket/month, community basics." },
              { label: "Pro", note: "Adds automation templates, smart DMs, and weekly analytics pulses." },
              { label: "Elite", note: "Adds AI campaign builder, priority support, and deeper integrations." },
              { label: "Business", note: "Adds white-glove support, enterprise automation, and webhooks." },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-card-border bg-foreground/[0.02] p-4">
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40">{item.label}</p>
                <p className="text-xs text-foreground/60 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] border border-card-border p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40">Payment methods</p>
          <h3 className="text-lg font-black text-foreground mt-2">Flexible billing options</h3>
          <div className="mt-4 space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.name} className={`rounded-2xl border p-4 ${method.accent}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{method.name}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">{method.detail}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: Headphones, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15", title: "Priority Support", desc: "Pro and above users get queue priority and faster response times from our engineering team." },
          { icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15", title: "Advanced Analytics", desc: "Full access to project metrics, engagement data, and performance dashboards for Elite+." },
          { icon: Key, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15", title: "API Access", desc: "Generate API keys and integrate Tari into your own systems with Business-tier unlimited access." },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={`glass-panel p-7 rounded-[2.5rem] border ${item.border} flex gap-5`}>
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-foreground/50 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
