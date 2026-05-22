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
      { label: "Community access", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Enhanced profile", included: true },
      { label: "Priority support queue", included: true },
      { label: "Basic analytics", included: true },
      { label: "API access (1000 req/day)", included: true },
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
      { label: "Community access + DMs", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Full profile customization", included: true },
      { label: "Dedicated support line", included: true },
      { label: "Full analytics suite", included: true },
      { label: "API access (10k req/day)", included: true },
      { label: "Custom integrations", included: false },
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
      { label: "Community access + DMs", included: true },
      { label: "Unlimited news submissions", included: true },
      { label: "Full profile + company branding", included: true },
      { label: "White-glove support + SLA", included: true },
      { label: "Full analytics + exports", included: true },
      { label: "Unlimited API access", included: true },
      { label: "Custom integrations + webhooks", included: true },
    ],
  },
];

const TIER_ORDER = ["free", "pro", "elite", "business"];

export default function BillingContent({ user, onUpgradeRequest }: Props) {
  const [requestedTier, setRequestedTier] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const currentTier = user?.tier || "free";
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  const handleUpgradeRequest = async (planId: string) => {
    if (planId === currentTier) return;
    setRequestedTier(planId);
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          user: user.name,
          email: user.email,
          message: `[PLAN UPGRADE REQUEST]\nUser: ${user.name} (${user.email})\nCurrent Tier: ${currentTier.toUpperCase()}\nRequested Tier: ${planId.toUpperCase()}\n\nPlease process this plan upgrade at your earliest convenience.`,
        }),
      });
      if (res.ok) {
        setSubmitStatus({ type: "success", message: `✓ Upgrade request sent! Our team will process your ${planId.toUpperCase()} upgrade shortly.` });
        onUpgradeRequest(planId);
      } else {
        setSubmitStatus({ type: "error", message: "Failed to submit request. Please try again." });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
      setRequestedTier(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} />
          Subscription Plans
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3 tracking-tight">
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
                    disabled={submitting && requestedTier === plan.id}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${plan.bg} ${plan.color} border ${plan.border} hover:${plan.activeBorder}`}
                  >
                    {submitting && requestedTier === plan.id ? (
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
