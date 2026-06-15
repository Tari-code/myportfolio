"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, Crown, Star, Globe, Shield, TrendingUp, Clock, MessageSquare,
  Newspaper, Users, Bell, CheckCircle2, AlertTriangle, ArrowRight,
  Activity, Award, Sparkles, Calendar, Hash, ChevronRight, Loader2, X,
  Rocket
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Props {
  user: any;
  tickets: any[];
  userNews: any[];
  onSwitchTab: (tab: string) => void;
}

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any; glow: string }> = {
  free:     { label: "Free",     color: "text-foreground/50", bg: "bg-foreground/5",    border: "border-card-border",      icon: Globe,  glow: "shadow-foreground/5" },
  pro:      { label: "Pro",      color: "text-blue-400",      bg: "bg-blue-500/10",     border: "border-blue-500/20",      icon: Zap,    glow: "shadow-blue-500/20" },
  elite:    { label: "Elite",    color: "text-purple-400",    bg: "bg-purple-500/10",   border: "border-purple-500/20",    icon: Star,   glow: "shadow-purple-500/20" },
  business: { label: "Business", color: "text-amber-400",     bg: "bg-amber-500/10",    border: "border-amber-500/20",     icon: Crown,  glow: "shadow-amber-500/20" },
};

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const NOTIF_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  ticket_reply:  { icon: MessageSquare, color: "text-blue-400",   bg: "bg-blue-500/10" },
  tier_upgrade:  { icon: Crown,         color: "text-amber-400",  bg: "bg-amber-500/10" },
  welcome:       { icon: Sparkles,      color: "text-brand-500",  bg: "bg-brand-500/10" },
  system:        { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
  news_approved: { icon: CheckCircle2,  color: "text-green-400",  bg: "bg-green-500/10" },
  news_rejected: { icon: X,            color: "text-red-400",    bg: "bg-red-500/10" },
  new_follower:  { icon: Users,         color: "text-purple-400", bg: "bg-purple-500/10" },
};

export default function OverviewContent({ user, tickets, userNews, onSwitchTab }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch { } finally {
      setLoadingNotifs(false);
    }
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleOpenNotification = async (notif: Notification) => {
    if (!notif.read) await markOneRead(notif._id);
    if (!notif.link) return;

    if (notif.link.startsWith("/dashboard?tab=")) {
      const tab = notif.link.split("tab=")[1]?.split("&")[0];
      if (tab) onSwitchTab(tab);
      return;
    }

    if (notif.link.startsWith("/")) {
      router.push(notif.link);
      return;
    }

    window.open(notif.link, "_blank", "noopener,noreferrer");
  };

  const tier = user?.tier || "free";
  const tc = TIER_CONFIG[tier] || TIER_CONFIG.free;
  const TierIcon = tc.icon;

  const openTickets = tickets.filter(t => t.status === "open").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const approvedNews = userNews.filter(n => n.isApproved).length;
  const pendingNews = userNews.filter(n => !n.isApproved).length;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "Recently";

  const accountScore = Math.min(100,
    (user?.emailVerified ? 25 : 0) +
    (user?.avatar ? 15 : 0) +
    (user?.bio ? 15 : 0) +
    (user?.skills?.length > 0 ? 15 : 0) +
    (tickets.length > 0 ? 10 : 0) +
    (userNews.length > 0 ? 10 : 0) +
    (user?.company ? 10 : 0)
  );

  const recentActivity = [
    ...tickets.slice(0, 3).map(t => ({
      type: "ticket",
      label: `Support ticket — ${t.status}`,
      sub: t.message?.slice(0, 50) + (t.message?.length > 50 ? "..." : ""),
      time: t.createdAt,
      color: t.status === "open" ? "text-blue-400" : "text-green-400",
      icon: MessageSquare,
    })),
    ...userNews.slice(0, 2).map(n => ({
      type: "news",
      label: `News: ${n.title?.slice(0, 40)}`,
      sub: n.isApproved ? "Approved" : "Pending review",
      time: n.createdAt,
      color: n.isApproved ? "text-green-400" : "text-orange-400",
      icon: Newspaper,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Support Tickets", value: tickets.length, sub: `${openTickets} open`, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15" },
          { label: "News Submissions", value: userNews.length, sub: `${approvedNews} approved`, icon: Newspaper, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/15" },
          { label: "Following", value: user?.following?.length ?? 0, sub: `${user?.followers?.length ?? 0} followers`, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15" },
          { label: "Account Score", value: `${accountScore}%`, sub: accountScore >= 80 ? "Excellent" : accountScore >= 50 ? "Good" : "Needs setup", icon: Award, color: "text-brand-500", bg: "bg-brand-500/10", border: "border-brand-500/15" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`glass-panel p-5 rounded-[2rem] border ${stat.border} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
              <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                <Icon size={18} />
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-bold text-foreground/80 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-foreground/40 font-semibold uppercase tracking-wider mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <section className="glass-panel p-6 rounded-[2.5rem] border border-card-border relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40">New platform features</p>
            <h3 className="text-xl font-black text-foreground mt-1">Fresh tools to move faster</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "AI Copilot", desc: "Generate launch copy, summaries, and smart replies in seconds.", icon: Sparkles, tint: "text-brand-500" },
            { title: "Automation Studio", desc: "Set up repeatable flows for DMs, tickets, and community updates.", icon: Activity, tint: "text-green-400" },
            { title: "Insight Pulse", desc: "Track growth, engagement, and account health from one dashboard.", icon: TrendingUp, tint: "text-purple-400" },
            { title: "Smart Briefs", desc: "Turn updates into polished weekly briefs for your team and clients.", icon: Newspaper, tint: "text-amber-400" },
            { title: "Secure Sync", desc: "Keep your profile, tickets, and messages in perfect harmony.", icon: Shield, tint: "text-blue-400" },
            { title: "Launch Ready", desc: "Deploy fast with premium templates, analytics, and quick action paths.", icon: Rocket, tint: "text-pink-400" },
          ].map(({ title, desc, icon: Icon, tint }) => (
            <article key={title} className="rounded-[1.8rem] border border-card-border bg-foreground/[0.02] p-5 hover:border-brand-500/20 hover:bg-brand-500/[0.03] transition-all">
              <div className={`w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center ${tint} mb-4`}>
                <Icon size={18} />
              </div>
              <h4 className="text-sm font-black text-foreground">{title}</h4>
              <p className="text-xs text-foreground/55 mt-1 leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Account Health */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-card-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/3 blur-2xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Account Health</h3>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Profile completion score</p>
              </div>
              <div className="ml-auto text-2xl font-black text-brand-500">{accountScore}%</div>
            </div>
            <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-1000"
                style={{ width: `${accountScore}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Email Verified", done: user?.emailVerified },
                { label: "Avatar Set", done: !!user?.avatar },
                { label: "Bio Written", done: !!user?.bio },
                { label: "Skills Added", done: user?.skills?.length > 0 },
              ].map(item => (
                <div key={item.label} className={`flex items-center gap-2 p-3 rounded-xl border ${item.done ? "border-green-500/20 bg-green-500/5" : "border-card-border bg-foreground/[0.02]"}`}>
                  {item.done
                    ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                    : <div className="w-3 h-3 rounded-full border border-foreground/20 shrink-0" />
                  }
                  <span className={`text-[10px] font-bold ${item.done ? "text-green-400" : "text-foreground/40"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-card-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Recent Activity</h3>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Your latest interactions</p>
                </div>
              </div>
            </div>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-3">
                  <Activity size={20} className="text-foreground/20" />
                </div>
                <p className="text-sm text-foreground/30 font-semibold">No activity yet</p>
                <p className="text-xs text-foreground/20 mt-1">Submit a ticket or news article to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => onSwitchTab(item.type === "ticket" ? "comms" : "news")}
                      className="w-full text-left flex items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border hover:border-brand-500/20 hover:bg-brand-500/[0.02] transition-all group cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-brand-500 transition-colors">{item.label}</p>
                          <span className="text-[9px] text-foreground/30 font-semibold shrink-0">
                            {item.time ? formatDistanceToNow(new Date(item.time), { addSuffix: true }) : ""}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground/40 font-semibold mt-0.5 truncate">{item.sub}</p>
                      </div>
                      <ChevronRight size={12} className="text-foreground/20 group-hover:text-brand-500/50 shrink-0 mt-1 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Current Plan */}
          <div className={`glass-panel p-6 rounded-[2.5rem] border ${tc.border} relative overflow-hidden`}>
            <div className={`absolute -top-8 -right-8 w-24 h-24 ${tc.bg} blur-2xl rounded-full pointer-events-none opacity-60`} />
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${tc.bg} border ${tc.border} flex items-center justify-center ${tc.color}`}>
                <TierIcon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Current Plan</p>
                <p className={`text-lg font-black ${tc.color}`}>{tc.label}</p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/40 font-semibold">Member since</span>
                <span className="text-foreground/70 font-bold">{memberSince}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/40 font-semibold">Email</span>
                <span className="text-foreground/70 font-bold truncate max-w-[140px]">{user?.email}</span>
              </div>
              {user?.company && (
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/40 font-semibold">Company</span>
                  <span className="text-foreground/70 font-bold">{user.company}</span>
                </div>
              )}
            </div>
            {tier === "free" && (
              <button
                onClick={() => onSwitchTab("billing")}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-400 text-white font-bold text-xs rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-brand-500/20"
              >
                Upgrade Plan →
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="glass-panel p-6 rounded-[2.5rem] border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <Bell size={18} />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold">Notifications</p>
                  <p className="text-[9px] text-foreground/40 font-semibold uppercase tracking-wider">{unreadCount} unread</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[9px] font-bold text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-wider">
                  Mark all read
                </button>
              )}
            </div>
            {loadingNotifs ? (
              <div className="flex justify-center py-4">
                <Loader2 size={18} className="animate-spin text-foreground/20" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-foreground/30 font-semibold">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map(notif => {
                  const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={notif._id}
                      type="button"
                      onClick={() => handleOpenNotification(notif)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${notif.read ? "border-card-border bg-foreground/[0.02] hover:bg-foreground/[0.04]" : "border-brand-500/15 bg-brand-500/[0.03] hover:bg-brand-500/5"}`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0`}>
                        <Icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-foreground leading-tight">{notif.title}</p>
                        <p className="text-[9px] text-foreground/40 font-semibold mt-0.5 leading-tight line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-panel p-6 rounded-[2.5rem] border border-card-border">
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-4">Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: "View Support Tickets", icon: MessageSquare, tab: "comms", color: "text-blue-400" },
                { label: "Browse Community", icon: Users, tab: "community", color: "text-purple-400" },
                { label: "Submit News", icon: Newspaper, tab: "news", color: "text-green-400" },
                { label: "Security & API Keys", icon: Shield, tab: "security", color: "text-orange-400" },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.tab}
                    onClick={() => onSwitchTab(action.tab)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-card-border hover:border-foreground/10 hover:bg-foreground/[0.02] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={14} className={action.color} />
                      <span className="text-xs font-semibold text-foreground/70">{action.label}</span>
                    </div>
                    <ChevronRight size={12} className="text-foreground/20 group-hover:text-foreground/40 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
