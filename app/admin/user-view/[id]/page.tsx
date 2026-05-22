"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, User, Mail, Phone, Globe, Zap, Star, Crown, Shield,
  MessageSquare, Newspaper, Key, Calendar, CheckCircle2, XCircle,
  Trash2, ChevronDown, Activity, Clock, TrendingUp, Users, Bell,
  Building2, Loader2, AlertTriangle, Send, Lock, Unlock, Edit3,
  ExternalLink, Hash, BarChart3, RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const TIERS = [
  { id: "free",     label: "Free",     color: "text-foreground/50", bg: "bg-foreground/5",    border: "border-card-border",      icon: Globe },
  { id: "pro",      label: "Pro",      color: "text-blue-400",      bg: "bg-blue-500/10",     border: "border-blue-500/20",      icon: Zap },
  { id: "elite",    label: "Elite",    color: "text-purple-400",    bg: "bg-purple-500/10",   border: "border-purple-500/20",    icon: Star },
  { id: "business", label: "Business", color: "text-amber-400",     bg: "bg-amber-500/10",    border: "border-amber-500/20",     icon: Crown },
];

function TierBadge({ tier }: { tier: string }) {
  const t = TIERS.find(x => x.id === tier) || TIERS[0];
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${t.bg} ${t.color} border ${t.border}`}>
      <Icon size={11} /> {t.label}
    </span>
  );
}

export default function AdminUserView() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const [updatingTier, setUpdatingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [tierStatus, setTierStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifForm, setNotifForm] = useState({ type: "system", title: "", message: "" });
  const [notifStatus, setNotifStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [userId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const data = await usersRes.json();
        const found = data.users?.find((u: any) => u._id === userId);
        if (found) {
          setUser(found);
          setSelectedTier(found.tier || "free");
          const [ticketsRes, postsRes] = await Promise.all([
            fetch(`/api/tickets?user=${encodeURIComponent(found.email)}`),
            fetch(`/api/admin/user-posts?userId=${userId}`),
          ]);
          if (ticketsRes.ok) setTickets(await ticketsRes.json());
          if (postsRes.ok) { const pd = await postsRes.json(); setPosts(pd.posts || []); }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = async () => {
    if (!selectedTier || selectedTier === user?.tier) return;
    setUpdatingTier(true);
    setTierStatus(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, tier: selectedTier }),
      });
      if (res.ok) {
        setUser((prev: any) => ({ ...prev, tier: selectedTier }));
        setTierStatus({ type: "success", message: `✓ Tier updated to ${selectedTier.toUpperCase()}. User notified via email.` });
      } else {
        setTierStatus({ type: "error", message: "Failed to update tier." });
      }
    } catch {
      setTierStatus({ type: "error", message: "Network error." });
    } finally {
      setUpdatingTier(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.message) return;
    setSendingNotif(true);
    setNotifStatus(null);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...notifForm }),
      });
      if (res.ok) {
        setNotifStatus({ type: "success", message: "✓ Notification sent to user." });
        setNotifForm({ type: "system", title: "", message: "" });
      } else {
        setNotifStatus({ type: "error", message: "Failed to send notification." });
      }
    } catch {
      setNotifStatus({ type: "error", message: "Network error." });
    } finally {
      setSendingNotif(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete ${user?.name}? This cannot be undone.`)) return;
    setDeletingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      if (res.ok) {
        router.push("/admin/users");
      }
    } catch {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <AlertTriangle size={40} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">User not found</h2>
          <Link href="/admin/users" className="text-brand-500 text-sm font-bold hover:underline">← Back to Users</Link>
        </div>
      </div>
    );
  }

  const openTickets = tickets.filter(t => t.status === "open").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const sections = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "posts", label: `Posts (${posts.length})`, icon: Newspaper },
    { id: "tickets", label: `Tickets (${tickets.length})`, icon: MessageSquare },
    { id: "actions", label: "Admin Actions", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Back + Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/users" className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors text-sm font-bold">
              <ArrowLeft size={16} />
              Back to Users
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border text-foreground/50 hover:text-foreground text-xs font-bold transition-all"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            <button
              onClick={handleDelete}
              disabled={deletingUser}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
            >
              {deletingUser ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Delete User
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-8 md:p-10 rounded-[3rem] border border-card-border mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/3 blur-3xl rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-brand-500/30 overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-black text-foreground">{user.name}</h1>
                <TierBadge tier={user.tier || "free"} />
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    <AlertTriangle size={10} /> Unverified
                  </span>
                )}
              </div>
              <p className="text-foreground/50 font-semibold mb-4">{user.email}</p>
              {user.bio && <p className="text-foreground/60 text-sm leading-relaxed mb-4 max-w-xl">{user.bio}</p>}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {[
                  { icon: Calendar, label: "Joined", value: memberSince },
                  { icon: Users, label: "Followers", value: user.followers?.length ?? 0 },
                  { icon: Hash, label: "Following", value: user.following?.length ?? 0 },
                  { icon: Shield, label: "Role", value: user.role?.toUpperCase() },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <Icon size={13} className="text-foreground/30" />
                      <span className="text-foreground/40 font-semibold">{item.label}:</span>
                      <span className="text-foreground/70 font-bold">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tickets", value: tickets.length, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15" },
            { label: "Open Tickets", value: openTickets, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15" },
            { label: "Published Posts", value: posts.length, icon: Newspaper, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15" },
            { label: "Skills", value: user.skills?.length ?? 0, icon: Zap, color: "text-brand-500", bg: "bg-brand-500/10", border: "border-brand-500/15" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`glass-panel p-5 rounded-[2rem] border ${stat.border}`}>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                  <Icon size={16} />
                </div>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-bold text-foreground/50 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Section Nav */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeSection === s.id ? "bg-brand-500 text-white border-brand-400" : "border-card-border text-foreground/50 hover:text-foreground hover:border-foreground/10"}`}
              >
                <Icon size={14} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Section: Overview */}
        {activeSection === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Profile Details */}
            <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
              <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                Profile Details
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Full Name", value: user.name, icon: User },
                  { label: "Email", value: user.email, icon: Mail },
                  { label: "Phone", value: user.phone || "—", icon: Phone },
                  { label: "Company", value: user.company || "—", icon: Building2 },
                  { label: "Website", value: user.website || "—", icon: ExternalLink },
                  { label: "Industry", value: user.industry || "—", icon: BarChart3 },
                  { label: "API Key", value: user.apiKey ? "••••••••" + user.apiKey.slice(-6) : "Not generated", icon: Key },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-card-border last:border-0">
                      <div className="flex items-center gap-2 text-foreground/40">
                        <Icon size={12} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground/70 max-w-[200px] truncate text-right">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
              <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                Skills & Tags
              </h3>
              {user.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/30 font-semibold">No skills added yet.</p>
              )}
              {user.bio && (
                <>
                  <div className="mt-6 mb-3 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Bio</div>
                  <p className="text-sm text-foreground/60 leading-relaxed">{user.bio}</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Section: Posts */}
        {activeSection === "posts" && (
          <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border animate-in fade-in duration-300">
            <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
              <Newspaper size={16} className="text-purple-400" />
              Published Posts ({posts.length})
            </h3>
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <Newspaper size={32} className="text-foreground/10 mx-auto mb-3" />
                <p className="text-sm text-foreground/30 font-semibold">No posts published yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post._id} className="p-5 rounded-2xl border border-card-border hover:border-foreground/10 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${post.isApproved ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                          {post.isApproved ? "✓ Live" : "Pending"}
                        </span>
                        <span className="text-[9px] font-bold text-brand-500/60 bg-brand-500/10 border border-brand-500/15 px-2 py-1 rounded-full">{post.category}</span>
                      </div>
                      <span className="text-[10px] text-foreground/30 font-semibold">
                        {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-brand-500 transition-colors mb-1">{post.title}</h4>
                    {post.summary && <p className="text-xs text-foreground/50 font-medium italic mb-2">"{post.summary}"</p>}
                    {post.content && <p className="text-xs text-foreground/35 line-clamp-2">{post.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section: Tickets */}
        {activeSection === "tickets" && (
          <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border animate-in fade-in duration-300">
            <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Support Tickets ({tickets.length})
            </h3>
            {tickets.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare size={32} className="text-foreground/10 mx-auto mb-3" />
                <p className="text-sm text-foreground/30 font-semibold">No tickets submitted</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="p-5 rounded-2xl border border-card-border hover:border-foreground/10 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ticket.status === "open" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                        {ticket.status}
                      </span>
                      <span className="text-[10px] text-foreground/30 font-semibold">
                        {ticket.createdAt ? formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true }) : ""}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70 font-medium leading-relaxed mb-2">{ticket.message}</p>
                    {ticket.replies?.length > 0 && (
                      <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-wider">
                        {ticket.replies.length} {ticket.replies.length === 1 ? "reply" : "replies"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section: Admin Actions */}
        {activeSection === "actions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">

            {/* Tier Management */}
            <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                Change User Tier
              </h3>
              <p className="text-xs text-foreground/40 font-semibold mb-5">User will be notified via email when tier changes.</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {TIERS.map(t => {
                    const Icon = t.icon;
                    const isSelected = selectedTier === t.id;
                    const isCurrent = user.tier === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTier(t.id)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${isSelected ? `${t.bg} ${t.border} ${t.color}` : "border-card-border text-foreground/40 hover:border-foreground/10"}`}
                      >
                        <Icon size={14} />
                        <div>
                          <div className="text-xs font-black">{t.label}</div>
                          {isCurrent && <div className="text-[9px] opacity-60">Current</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleTierChange}
                  disabled={updatingTier || selectedTier === user.tier}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-2xl hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {updatingTier ? <Loader2 size={13} className="animate-spin" /> : <Crown size={13} />}
                  Apply Tier Change
                </button>
                {tierStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${tierStatus.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {tierStatus.type === "success" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {tierStatus.message}
                  </div>
                )}
              </div>
            </div>

            {/* Send Notification */}
            <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Bell size={16} className="text-brand-500" />
                Send Notification
              </h3>
              <p className="text-xs text-foreground/40 font-semibold mb-5">Send a direct in-app notification to this user.</p>
              <form onSubmit={handleSendNotification} className="space-y-3">
                <select
                  value={notifForm.type}
                  onChange={e => setNotifForm({ ...notifForm, type: e.target.value })}
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-500/40 transition-all"
                >
                  <option value="system">System Alert</option>
                  <option value="tier_upgrade">Tier Upgrade</option>
                  <option value="news_approved">News Approved</option>
                  <option value="news_rejected">News Rejected</option>
                </select>
                <input
                  required
                  value={notifForm.title}
                  onChange={e => setNotifForm({ ...notifForm, title: e.target.value })}
                  placeholder="Notification title..."
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-500/40 transition-all"
                />
                <textarea
                  required
                  rows={3}
                  value={notifForm.message}
                  onChange={e => setNotifForm({ ...notifForm, message: e.target.value })}
                  placeholder="Notification message..."
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-brand-500/40 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="w-full py-3 bg-brand-600 text-white font-bold text-xs rounded-2xl hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  {sendingNotif ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Send Notification
                </button>
                {notifStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${notifStatus.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {notifStatus.type === "success" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {notifStatus.message}
                  </div>
                )}
              </form>
            </div>

            {/* Quick Links */}
            <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border md:col-span-2">
              <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                <Activity size={16} className="text-purple-400" />
                Admin Quick Links
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "All Users", href: "/admin/users", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "All Tickets", href: "/admin/messages", icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10" },
                  { label: "News Queue", href: "/admin/news", icon: Newspaper, color: "text-orange-400", bg: "bg-orange-500/10" },
                  { label: "Command Center", href: "/admin", icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map(link => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-card-border hover:border-foreground/10 hover:bg-foreground/[0.02] transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center ${link.color}`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-foreground/50 group-hover:text-foreground/80 transition-colors">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
