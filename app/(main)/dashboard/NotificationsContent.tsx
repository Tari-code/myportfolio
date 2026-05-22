"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, MessageSquare, Crown, Sparkles, AlertTriangle, CheckCircle2,
  Users, Heart, Share2, Loader2, Check, X, RefreshCw, BellOff, ArrowRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  ticket_reply:  { icon: MessageSquare, color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/15" },
  tier_upgrade:  { icon: Crown,         color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/15" },
  welcome:       { icon: Sparkles,      color: "text-brand-500",  bg: "bg-brand-500/10",  border: "border-brand-500/15" },
  system:        { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15" },
  admin_update:  { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15" },
  news_approved: { icon: CheckCircle2,  color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/15" },
  news_rejected: { icon: X,            color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/15" },
  new_follower:  { icon: Users,         color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15" },
  new_like:      { icon: Heart,         color: "text-pink-400",   bg: "bg-pink-500/10",   border: "border-pink-500/15" },
  new_comment:   { icon: MessageSquare, color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/15" },
  new_share:     { icon: Share2,        color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/15" },
};

const TYPE_LABELS: Record<string, string> = {
  all: "All",
  ticket_reply: "Support",
  new_follower: "Follows",
  new_like: "Likes",
  new_comment: "Comments",
  new_share: "Shares",
  admin_update: "Admin",
  system: "System",
};

interface Props {
  onNavigate?: (tab: string) => void;
}

export default function NotificationsContent({ onNavigate }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markOneRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    setMarkingAll(false);
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.read) await markOneRead(notif._id);
    if (!notif.link) return;

    if (notif.link.startsWith("/dashboard?tab=")) {
      const tab = notif.link.split("tab=")[1];
      if (onNavigate) onNavigate(tab);
    } else if (notif.link.startsWith("/")) {
      router.push(notif.link);
    } else {
      window.open(notif.link, "_blank");
    }
  };

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);
  const filterKeys = ["all", ...Array.from(new Set(notifications.map(n => n.type)))];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-card-border relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                <Bell size={22} />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              className="p-2.5 rounded-xl bg-foreground/5 border border-card-border hover:bg-foreground/10 transition-all text-foreground/40 hover:text-foreground"
            >
              <RefreshCw size={16} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 font-bold text-xs hover:bg-brand-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {markingAll ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap mt-6 relative z-10">
          {filterKeys.map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                filter === key
                  ? "bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/20"
                  : "bg-foreground/5 text-foreground/40 border-card-border hover:bg-foreground/10"
              }`}
            >
              {TYPE_LABELS[key] || key}
              {key === "all" && unreadCount > 0 && (
                <span className="ml-1.5 text-[8px] bg-white/20 rounded-full px-1">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Loading notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel py-20 rounded-[2.5rem] border border-card-border flex flex-col items-center justify-center text-center opacity-40">
            <BellOff size={40} className="mb-4" />
            <h3 className="font-bold text-sm">No notifications</h3>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          filtered.map(notif => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            const isClickable = !notif.read || !!notif.link;
            return (
              <button
                key={notif._id}
                onClick={() => handleNotifClick(notif)}
                className={`w-full text-left glass-panel flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all group hover:scale-[1.005] active:scale-[0.998] ${
                  notif.read
                    ? "border-card-border opacity-60 hover:opacity-80"
                    : `${cfg.border} bg-gradient-to-r from-background to-transparent`
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0 mt-0.5`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold leading-tight ${notif.read ? "text-foreground/60" : "text-foreground"}`}>
                      {notif.title}
                    </p>
                    <span className="text-[9px] font-bold text-foreground/30 shrink-0 uppercase tracking-wider whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-xs text-foreground/50 font-medium mt-1 leading-relaxed">{notif.message}</p>
                  {notif.link && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-500 group-hover:text-brand-400 transition-colors">
                      View <ArrowRight size={10} />
                    </span>
                  )}
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0 mt-2 animate-pulse" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
