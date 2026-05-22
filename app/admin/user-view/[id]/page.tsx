"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, User, Mail, Phone, Globe, Zap, Star, Crown, Shield,
  MessageSquare, Newspaper, Key, Calendar, CheckCircle2, XCircle,
  Trash2, Activity, Clock, Users, Bell, Building2, Loader2,
  AlertTriangle, Send, Edit3, ExternalLink, Hash, RefreshCw,
  MapPin, Link2, AtSign, Heart, FileText, Briefcase, ChevronDown,
  ChevronUp, X, BarChart3
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

const gradients: Record<string, { cover: string; avatar: string }> = {
  A: { cover: "from-rose-900/80 via-pink-800/50 to-transparent",    avatar: "from-rose-500 to-pink-600" },
  B: { cover: "from-orange-900/80 via-amber-800/50 to-transparent",  avatar: "from-orange-500 to-amber-600" },
  C: { cover: "from-yellow-900/80 via-lime-800/50 to-transparent",   avatar: "from-yellow-500 to-lime-600" },
  D: { cover: "from-green-900/80 via-emerald-800/50 to-transparent", avatar: "from-green-500 to-emerald-600" },
  E: { cover: "from-teal-900/80 via-cyan-800/50 to-transparent",     avatar: "from-teal-500 to-cyan-600" },
  F: { cover: "from-sky-900/80 via-blue-800/50 to-transparent",      avatar: "from-sky-500 to-blue-600" },
  G: { cover: "from-indigo-900/80 via-violet-800/50 to-transparent", avatar: "from-indigo-500 to-violet-600" },
  H: { cover: "from-purple-900/80 via-fuchsia-800/50 to-transparent",avatar: "from-purple-500 to-fuchsia-600" },
  J: { cover: "from-pink-900/80 via-red-800/50 to-transparent",      avatar: "from-pink-500 to-red-600" },
  M: { cover: "from-emerald-900/80 via-teal-800/50 to-transparent",  avatar: "from-emerald-500 to-teal-600" },
  N: { cover: "from-cyan-900/80 via-sky-800/50 to-transparent",      avatar: "from-cyan-500 to-sky-600" },
  R: { cover: "from-fuchsia-900/80 via-pink-800/50 to-transparent",  avatar: "from-fuchsia-500 to-pink-600" },
  S: { cover: "from-rose-900/80 via-red-800/50 to-transparent",      avatar: "from-rose-500 to-red-600" },
  T: { cover: "from-red-900/80 via-orange-800/50 to-transparent",    avatar: "from-red-500 to-orange-600" },
};

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
  const [activeTab, setActiveTab] = useState<"about" | "feed" | "tickets" | "admin">("about");
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const [updatingTier, setUpdatingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [tierStatus, setTierStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifForm, setNotifForm] = useState({ type: "system", title: "", message: "" });
  const [notifStatus, setNotifStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => { fetchAll(); }, [userId]);

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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
        setTierStatus({ type: "success", message: `✓ Tier updated to ${selectedTier.toUpperCase()}.` });
      } else {
        setTierStatus({ type: "error", message: "Failed to update tier." });
      }
    } catch {
      setTierStatus({ type: "error", message: "Network error." });
    } finally { setUpdatingTier(false); }
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
        setNotifStatus({ type: "success", message: "✓ Notification sent." });
        setNotifForm({ type: "system", title: "", message: "" });
      } else {
        setNotifStatus({ type: "error", message: "Failed to send." });
      }
    } catch {
      setNotifStatus({ type: "error", message: "Network error." });
    } finally { setSendingNotif(false); }
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
      if (res.ok) router.push("/admin/users");
    } catch { setDeletingUser(false); }
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
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

  const initial = user.name?.charAt(0)?.toUpperCase() || "?";
  const g = gradients[initial] || { cover: "from-brand-900/80 via-brand-800/50 to-transparent", avatar: "from-brand-500 to-brand-700" };
  const joinedDate = user.createdAt ? new Date(user.createdAt) : null;
  const openTickets = tickets.filter(t => t.status === "open").length;

  const tabs = [
    { id: "about",   label: "About",            icon: User },
    { id: "feed",    label: `Feed (${posts.length})`,    icon: Newspaper },
    { id: "tickets", label: `Tickets (${tickets.length})`, icon: MessageSquare },
    { id: "admin",   label: "Admin Actions",    icon: Shield },
  ];

  return (
    <div className="min-h-screen">

      {/* Topbar with navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <Link href="/admin/users" className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm font-bold">
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-card-border text-foreground/40 hover:text-foreground text-xs font-bold transition-all"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => router.push(`/admin/user-edit/${userId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 text-xs font-bold transition-all"
          >
            <Edit3 size={13} /> Edit Profile
          </button>
          <button
            onClick={handleDelete}
            disabled={deletingUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all disabled:opacity-50"
          >
            {deletingUser ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete
          </button>
        </div>
      </div>

      {/* Cover photo */}
      <div className="h-52 relative overflow-hidden">
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${g.cover} bg-background`}>
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Admin ribbon */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
          <Shield size={12} className="text-brand-400" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Admin View</span>
        </div>
      </div>

      {/* Profile header */}
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="flex items-end justify-between -mt-16 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${g.avatar} flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-background overflow-hidden`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : initial}
            </div>
            {/* Online indicator */}
            {user.lastSeen && (() => {
              const diff = Date.now() - new Date(user.lastSeen).getTime();
              const online = diff < 3 * 60 * 1000;
              return <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-background ${online ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />;
            })()}
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 border border-card-border text-xs font-bold text-foreground/60">
              <MessageSquare size={12} className="text-blue-400" /> {tickets.length} tickets
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 border border-card-border text-xs font-bold text-foreground/60">
              <Newspaper size={12} className="text-purple-400" /> {posts.length} posts
            </div>
          </div>
        </div>

        {/* Name & identity */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
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
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${user.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-brand-500/10 text-brand-400 border-brand-500/20"}`}>
              <Shield size={10} /> {user.role}
            </span>
          </div>

          <p className="text-sm text-foreground/50 font-medium mb-2">{user.email}</p>
          {user.bio && <p className="text-sm text-foreground/60 leading-relaxed mb-3 max-w-xl">{user.bio}</p>}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {user.location && (
              <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium"><MapPin size={11} /> {user.location}</span>
            )}
            {joinedDate && (
              <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium"><Calendar size={11} /> Joined {format(joinedDate, "MMM yyyy")}</span>
            )}
            {user.website && (
              <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:underline">
                <Link2 size={11} /> {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex border-t border-b border-card-border mb-5">
          {[
            { label: "Followers", value: (user.followers || []).length },
            { label: "Following", value: (user.following || []).length },
            { label: "Open Tickets", value: openTickets },
            { label: "Skills", value: (user.skills || []).length },
          ].map((s, i) => (
            <div key={s.label} className={`flex-1 py-3 text-center ${i > 0 ? "border-l border-card-border" : ""}`}>
              <p className="text-lg font-black text-foreground">{s.value}</p>
              <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 border-b border-card-border -mx-6 md:-mx-8 px-6 md:px-8 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all -mb-px ${
                  activeTab === tab.id
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent text-foreground/30 hover:text-foreground/60"
                }`}
              >
                <Icon size={11} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ABOUT tab */}
        {activeTab === "about" && (
          <div className="space-y-5 pb-12 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profile details */}
              <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <User size={15} className="text-brand-500" /> Profile Details
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Email",    value: user.email,            icon: Mail },
                    { label: "Phone",    value: user.phone || "—",     icon: Phone },
                    { label: "Company",  value: user.company || "—",   icon: Building2 },
                    { label: "Website",  value: user.website || "—",   icon: ExternalLink },
                    { label: "Industry", value: user.industry || "—",  icon: BarChart3 },
                    { label: "API Key",  value: user.apiKey ? "••••••••" + user.apiKey.slice(-6) : "Not generated", icon: Key },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                        <div className="flex items-center gap-2 text-foreground/40">
                          <Icon size={11} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-foreground/70 max-w-[180px] truncate text-right">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Zap size={15} className="text-purple-400" /> Skills & Tags
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
              </div>
            </div>
          </div>
        )}

        {/* FEED tab */}
        {activeTab === "feed" && (
          <div className="space-y-4 pb-12 animate-in fade-in duration-300">
            {posts.length === 0 ? (
              <div className="py-16 text-center opacity-30">
                <Newspaper size={32} className="mx-auto mb-3" />
                <p className="text-sm font-bold">No posts published yet</p>
              </div>
            ) : (
              posts.map(post => {
                const isExpanded = expandedPosts.has(post._id);
                const hasFullContent = post.content && post.content.length > 0;
                return (
                  <div key={post._id} className="rounded-[1.5rem] border border-card-border hover:border-brand-500/20 transition-all overflow-hidden bg-foreground/[0.01]">
                    <div className="flex items-center gap-3 p-4">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${g.avatar} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" /> : initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground">{user.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/35 uppercase tracking-wider">
                          <Clock size={9} /> {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + " ago" : ""}
                          <span className="text-brand-500/70">{post.category}</span>
                          <span className={`px-1.5 py-0.5 rounded-full ${post.isApproved ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                            {post.isApproved ? "Live" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="px-4 pb-2 space-y-2">
                      <h4 className="font-bold text-sm text-foreground leading-tight">{post.title}</h4>
                      {post.summary && (
                        <p className="text-xs text-foreground/55 italic border-l-2 border-brand-500/20 pl-3 leading-relaxed">&ldquo;{post.summary}&rdquo;</p>
                      )}
                      {hasFullContent && (
                        <div className={`text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-4"}`}>
                          {post.content}
                        </div>
                      )}
                      {hasFullContent && (
                        <button
                          onClick={() => toggleExpand(post._id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-brand-500 hover:text-brand-400 transition-colors mt-1"
                        >
                          {isExpanded ? <><ChevronUp size={11} /> Show less</> : <><ChevronDown size={11} /> Read more</>}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-5 px-4 py-3 border-t border-card-border">
                      <div className="flex items-center gap-1.5 text-foreground/30">
                        <Heart size={14} />
                        <span className="text-[11px] font-bold">{post.likes?.length || 0} Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-foreground/30">
                        <MessageSquare size={14} />
                        <span className="text-[11px] font-bold">{post.comments?.length || 0} Comments</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TICKETS tab */}
        {activeTab === "tickets" && (
          <div className="space-y-3 pb-12 animate-in fade-in duration-300">
            {tickets.length === 0 ? (
              <div className="py-16 text-center opacity-30">
                <MessageSquare size={32} className="mx-auto mb-3" />
                <p className="text-sm font-bold">No tickets submitted</p>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket._id} className="glass-panel p-5 rounded-[1.5rem] border border-card-border hover:border-foreground/10 transition-all">
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
              ))
            )}
          </div>
        )}

        {/* ADMIN tab */}
        {activeTab === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 animate-in fade-in duration-300">

            {/* Tier Management */}
            <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
              <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                <Crown size={15} className="text-amber-400" /> Change User Tier
              </h3>
              <p className="text-xs text-foreground/40 font-semibold mb-4">User will be notified via email when tier changes.</p>
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
            <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
              <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                <Bell size={15} className="text-brand-500" /> Send Notification
              </h3>
              <p className="text-xs text-foreground/40 font-semibold mb-4">Push a notification directly to this user's dashboard.</p>
              <form onSubmit={handleSendNotification} className="space-y-3">
                <select
                  value={notifForm.type}
                  onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all"
                >
                  <option value="system">System Alert</option>
                  <option value="admin_update">Admin Update</option>
                  <option value="tier_upgrade">Tier Upgrade</option>
                  <option value="welcome">Welcome</option>
                </select>
                <input
                  value={notifForm.title}
                  onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Notification title"
                  required
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all"
                />
                <textarea
                  value={notifForm.message}
                  onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Notification message..."
                  required
                  rows={3}
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="w-full py-3 bg-brand-600 text-white font-bold text-xs rounded-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
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

            {/* Danger Zone */}
            <div className="md:col-span-2 glass-panel p-6 rounded-[2rem] border border-red-500/20 bg-red-500/[0.02]">
              <h3 className="font-bold text-sm mb-1 flex items-center gap-2 text-red-400">
                <AlertTriangle size={15} /> Danger Zone
              </h3>
              <p className="text-xs text-foreground/40 font-semibold mb-4">These actions are permanent and cannot be undone.</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletingUser}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  {deletingUser ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Permanently Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
