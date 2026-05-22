"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Users, Activity, MessageSquare, Heart, Share2, Clock, Pencil,
  Trash2, X, Loader2, CheckCircle2, ShieldCheck, PlusCircle, Send, ChevronDown,
  UserPlus, Zap, ArrowLeft, Globe, Link2, Check
} from "lucide-react";
import CommunityCard from "./CommunityCard";
import ProfileModal from "./ProfileModal";
import { formatDistanceToNow } from "date-fns";

interface CommunityContentProps {
  members: any[];
  currentUser: any;
  onFollow: (userId: string) => void;
  onMessage: (member: any) => void;
}

const CATEGORIES = ["Technology", "AI", "Web Dev", "Design", "Business", "Open Source"];

interface Comment {
  _id?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt?: string;
}

export default function CommunityContent({
  members,
  currentUser,
  onFollow,
  onMessage,
}: CommunityContentProps) {
  const [activeSubTab, setActiveSubTab] = useState<"feed" | "members" | "my-posts">("feed");
  const [search, setSearch] = useState("");
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);

  // Post detail modal
  const [openPost, setOpenPost] = useState<any | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compose new post
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ title: "", summary: "", content: "", category: "Technology" });
  const [composing, setComposing] = useState(false);
  const [composeStatus, setComposeStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit modal
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ title: "", summary: "", content: "", category: "Technology" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [hoveringFollow, setHoveringFollow] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => { fetchFeed(); }, []);
  useEffect(() => { if (activeSubTab === "my-posts") fetchMyPosts(); }, [activeSubTab]);

  useEffect(() => {
    if (feedPosts.length > 0) {
      const map: Record<string, { count: number; liked: boolean }> = {};
      feedPosts.forEach(p => {
        map[p._id] = {
          count: (p.likes || []).length,
          liked: (p.likes || []).some((id: any) => id === currentUser?._id || id?.toString() === currentUser?._id),
        };
      });
      setLikes(map);
    }
  }, [feedPosts, currentUser?._id]);

  const fetchFeed = async () => {
    setLoadingFeed(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) setFeedPosts(await res.json());
    } catch (err) { console.error("Failed to fetch feed:", err); }
    finally { setLoadingFeed(false); }
  };

  const fetchMyPosts = async () => {
    setLoadingMyPosts(true);
    try {
      const res = await fetch("/api/news/submit");
      if (res.ok) { const data = await res.json(); setMyPosts(data.news || []); }
    } catch (err) { console.error("Failed to fetch my posts:", err); }
    finally { setLoadingMyPosts(false); }
  };

  const openPostDetail = async (post: any) => {
    setOpenPost(post);
    setLoadingComments(true);
    setPostComments(post.comments || []);
    try {
      const res = await fetch(`/api/news/comment?postId=${post._id}`);
      if (res.ok) { const data = await res.json(); setPostComments(data.comments || []); }
    } catch { } finally { setLoadingComments(false); }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !openPost) return;
    setSubmittingComment(true);
    try {
      const res = await fetch("/api/news/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: openPost._id, text: commentInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setPostComments(prev => [...prev, data.comment]);
        setCommentInput("");
        setFeedPosts(prev => prev.map(p => p._id === openPost._id ? { ...p, comments: [...(p.comments || []), data.comment] } : p));
      }
    } catch { } finally { setSubmittingComment(false); }
  };

  const handleShare = async (post: any) => {
    const url = `${window.location.origin}/dashboard?post=${post._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, text: post.summary, url }); } catch { }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNeuralPulse = async (postId: string) => {
    if (likingId) return;
    setLikingId(postId);
    setLikes(prev => ({
      ...prev,
      [postId]: { count: (prev[postId]?.count || 0) + (prev[postId]?.liked ? -1 : 1), liked: !prev[postId]?.liked },
    }));
    try {
      const res = await fetch("/api/news/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(prev => ({ ...prev, [postId]: { count: data.likes, liked: data.liked } }));
        if (openPost?._id === postId) setOpenPost((prev: any) => prev ? { ...prev, _likesCount: data.likes } : prev);
      }
    } catch {
      setLikes(prev => ({
        ...prev,
        [postId]: { count: (prev[postId]?.count || 0) + (prev[postId]?.liked ? -1 : 1), liked: !prev[postId]?.liked },
      }));
    } finally { setLikingId(null); }
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.title || !composeForm.content) return;
    setComposing(true);
    setComposeStatus(null);
    try {
      const res = await fetch("/api/news/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composeForm),
      });
      const data = await res.json();
      if (res.ok) {
        setComposeStatus({ type: "success", message: "✓ Post published to the community feed!" });
        setMyPosts(prev => [data.news, ...prev]);
        setFeedPosts(prev => [data.news, ...prev]);
        setTimeout(() => { setShowCompose(false); setComposeForm({ title: "", summary: "", content: "", category: "Technology" }); setComposeStatus(null); }, 1500);
      } else {
        setComposeStatus({ type: "error", message: data.error || "Failed to publish." });
      }
    } catch { setComposeStatus({ type: "error", message: "Network error." }); }
    finally { setComposing(false); }
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setEditForm({ title: post.title || "", summary: post.summary || "", content: post.content || "", category: post.category || "Technology" });
    setEditStatus(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setSavingEdit(true);
    setEditStatus(null);
    try {
      const res = await fetch("/api/news/submit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPost._id, ...editForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditStatus({ type: "success", message: "✓ Post updated." });
        setMyPosts(prev => prev.map(p => p._id === editingPost._id ? { ...p, ...editForm } : p));
        setTimeout(() => { setEditingPost(null); setEditStatus(null); }, 1500);
      } else {
        setEditStatus({ type: "error", message: data.error || "Failed to update." });
      }
    } catch { setEditStatus({ type: "error", message: "Network error." }); }
    finally { setSavingEdit(false); }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/news/submit?id=${postId}`, { method: "DELETE" });
      if (res.ok) { setMyPosts(prev => prev.filter(p => p._id !== postId)); setFeedPosts(prev => prev.filter(p => p._id !== postId)); }
    } catch { alert("Network error."); }
    finally { setDeletingId(null); }
  };

  const nonAdminMembers = members.filter((m) => m.role !== "admin");
  const filteredMembers = nonAdminMembers.filter((m) => {
    if (m._id === currentUser?._id) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name?.toLowerCase().includes(q) || m.role?.toLowerCase().includes(q) || (m.skills || []).some((s: string) => s.toLowerCase().includes(q));
  });

  const suggestedUsers = nonAdminMembers.filter(m => {
    if (m._id === currentUser?._id) return false;
    const following = currentUser?.following || [];
    return !following.some((f: any) => f === m._id || f?._id === m._id || f?.toString() === m._id);
  }).slice(0, 5);

  return (
    <section className="glass-panel p-4 md:p-6 lg:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-card-border mb-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 mb-6 md:mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shadow-lg shadow-brand-500/5 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Community Ecosystem</h2>
            </div>
          </div>
          <button
            onClick={() => { setActiveSubTab("my-posts"); setShowCompose(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-500/20 self-start sm:self-auto"
          >
            <PlusCircle size={14} /> New Post
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 bg-foreground/[0.03] rounded-2xl p-1 border border-card-border w-full overflow-x-auto">
          {[
            { id: "feed", label: "Neural Feed" },
            { id: "members", label: `Members (${nonAdminMembers.length})` },
            { id: "my-posts", label: "My Posts" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-max py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "text-foreground/40 hover:text-foreground/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">

        {/* Feed Tab */}
        {activeSubTab === "feed" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
              {/* Main Feed */}
              <div className="flex-1 min-w-0 space-y-4 md:space-y-6">
                {loadingFeed ? (
                  <div className="py-20 flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Synchronizing Feed…</p>
                  </div>
                ) : feedPosts.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <Activity size={48} className="mx-auto mb-4" />
                    <h3 className="font-bold">Neural Feed Empty</h3>
                    <p className="text-xs mt-1">Be the first to post something!</p>
                  </div>
                ) : (
                  feedPosts.map((post) => {
                    const author = nonAdminMembers.find(m => m._id === post.submittedBy?.toString?.() || m._id === post.submittedBy) || { name: post.author || "Anonymous", _id: null };
                    const isFollowing = post.submittedBy && (currentUser?.following || []).some((id: any) =>
                      id === post.submittedBy || id?._id === post.submittedBy || id?.toString() === post.submittedBy
                    );
                    const isHovering = hoveringFollow === post.submittedBy;
                    const postLikes = likes[post._id] || { count: (post.likes || []).length, liked: false };
                    const commentCount = (post.comments || []).length;

                    return (
                      <div key={post._id} className="glass-panel rounded-[1.5rem] md:rounded-[2.5rem] border border-card-border hover:border-brand-500/20 transition-all group overflow-hidden">
                        {/* Post header */}
                        <div className="flex items-start justify-between p-4 md:p-6 pb-0">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => author._id && setViewingProfile(author)}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-500 hover:scale-105 transition-transform shrink-0"
                            >
                              {author.name?.[0]?.toUpperCase() || "A"}
                            </button>
                            <div>
                              <h4 className="font-bold text-sm flex items-center gap-1.5">
                                <button onClick={() => author._id && setViewingProfile(author)} className="hover:text-brand-500 transition-colors">
                                  {author.name}
                                </button>
                                {post.submittedBy && <ShieldCheck size={12} className="text-brand-500 shrink-0" />}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                                <span className="flex items-center gap-1"><Clock size={9} /> {formatDistanceToNow(new Date(post.createdAt || post.date))} ago</span>
                                <span className="text-brand-500/70">{post.category}</span>
                              </div>
                            </div>
                          </div>
                          {post.submittedBy && post.submittedBy !== currentUser?._id && (
                            <button
                              onClick={() => onFollow(post.submittedBy)}
                              onMouseEnter={() => setHoveringFollow(post.submittedBy)}
                              onMouseLeave={() => setHoveringFollow(null)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                                isFollowing
                                  ? isHovering ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-foreground/5 text-foreground/50 border border-card-border"
                                  : "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95"
                              }`}
                            >
                              {isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow"}
                            </button>
                          )}
                        </div>

                        {/* Post content */}
                        <div className="px-4 md:px-6 py-4 space-y-2">
                          <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight">{post.title}</h3>
                          {post.summary && <p className="text-sm text-foreground/60 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-3">"{post.summary}"</p>}
                          {post.content && (
                            <p className="text-xs text-foreground/45 font-medium line-clamp-3 leading-relaxed">{post.content}</p>
                          )}
                          {post.content && post.content.length > 200 && (
                            <button
                              onClick={() => openPostDetail(post)}
                              className="text-brand-500 text-xs font-bold hover:underline mt-1"
                            >
                              Read more…
                            </button>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-card-border">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleNeuralPulse(post._id)}
                              disabled={likingId === post._id}
                              className={`flex items-center gap-1.5 transition-all group/pulse active:scale-95 ${postLikes.liked ? "text-pink-500" : "text-foreground/30 hover:text-pink-500"}`}
                            >
                              <Heart size={17} className={`transition-transform group-hover/pulse:scale-125 ${postLikes.liked ? "fill-pink-500" : ""}`} />
                              <span className="text-xs font-bold">{postLikes.count > 0 ? postLikes.count : ""}</span>
                            </button>
                            <button
                              onClick={() => openPostDetail(post)}
                              className="flex items-center gap-1.5 text-foreground/30 hover:text-brand-500 transition-colors"
                            >
                              <MessageSquare size={17} />
                              <span className="text-xs font-bold">{commentCount > 0 ? commentCount : ""}</span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShare(post)}
                              className="flex items-center gap-1.5 text-foreground/30 hover:text-foreground transition-colors"
                            >
                              {copied ? <Check size={17} className="text-green-500" /> : <Share2 size={17} />}
                              <span className="text-xs font-bold hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
                            </button>
                            <button
                              onClick={() => openPostDetail(post)}
                              className="text-[10px] font-bold text-brand-500 hover:text-brand-400 transition-colors px-3 py-1.5 rounded-xl bg-brand-500/5 hover:bg-brand-500/10 border border-brand-500/15"
                            >
                              View Post
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Suggested People Sidebar - hidden on small mobile, shown below on md */}
              {suggestedUsers.length > 0 && (
                <aside className="xl:w-64 shrink-0">
                  <div className="glass-panel p-5 rounded-[2rem] border border-card-border xl:sticky xl:top-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-4 flex items-center gap-2">
                      <Zap size={12} className="text-brand-500" /> Suggested
                    </h4>
                    <div className="space-y-3">
                      {suggestedUsers.map(m => (
                        <div key={m._id} className="flex items-center gap-3 group">
                          <button onClick={() => setViewingProfile(m)} className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-brand-500 shrink-0 hover:scale-105 transition-transform">
                            {m.name?.[0]?.toUpperCase() || "?"}
                          </button>
                          <div className="flex-1 min-w-0">
                            <button onClick={() => setViewingProfile(m)} className="font-bold text-xs text-foreground hover:text-brand-500 transition-colors truncate block w-full text-left">
                              {m.name}
                            </button>
                            <p className="text-[9px] text-foreground/30 font-bold truncate">{m.role || "Member"}</p>
                          </div>
                          <button
                            onClick={() => onFollow(m._id)}
                            className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-xl text-[9px] font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all"
                          >
                            <UserPlus size={10} /> Follow
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveSubTab("members")}
                      className="w-full mt-4 py-2 rounded-xl text-[10px] font-bold text-foreground/40 hover:text-brand-500 border border-card-border hover:border-brand-500/20 transition-all"
                    >
                      View All →
                    </button>
                  </div>
                </aside>
              )}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeSubTab === "members" && (
          <>
            <div className="mb-4">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, role or skill…"
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/40 transition-all"
                />
              </div>
            </div>
            {filteredMembers.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                <Users size={40} className="mb-4" />
                <h3 className="font-bold text-lg">No connections found</h3>
                <p className="text-xs mt-1">{search ? `No results for "${search}"` : "Community is initializing."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
                {filteredMembers.map((member) => (
                  <CommunityCard
                    key={member._id}
                    member={member}
                    currentUserId={currentUser?._id}
                    onViewProfile={setViewingProfile}
                    onFollow={onFollow}
                    onMessage={onMessage}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* My Posts Tab */}
        {activeSubTab === "my-posts" && (
          <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-500">
            {showCompose && (
              <div className="glass-panel p-5 md:p-6 rounded-[2rem] border border-brand-500/30 bg-brand-500/[0.02] animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2"><PlusCircle size={16} className="text-brand-500" /> New Post</h3>
                  <button onClick={() => setShowCompose(false)} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-all"><X size={16} /></button>
                </div>
                <form onSubmit={handleCompose} className="space-y-3">
                  <input required value={composeForm.title} onChange={e => setComposeForm({ ...composeForm, title: e.target.value })} placeholder="Post title…" className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all" />
                  <input value={composeForm.summary} onChange={e => setComposeForm({ ...composeForm, summary: e.target.value })} placeholder="Short summary…" className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all" />
                  <select value={composeForm.category} onChange={e => setComposeForm({ ...composeForm, category: e.target.value })} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <textarea required value={composeForm.content} onChange={e => setComposeForm({ ...composeForm, content: e.target.value })} placeholder="Write your post content…" rows={5} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all resize-none" />
                  {composeStatus && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${composeStatus.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                      {composeStatus.type === "success" ? <CheckCircle2 size={14} /> : <X size={14} />}
                      {composeStatus.message}
                    </div>
                  )}
                  <button type="submit" disabled={composing} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {composing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {composing ? "Publishing…" : "Publish Post"}
                  </button>
                </form>
              </div>
            )}

            {loadingMyPosts ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" /></div>
            ) : myPosts.length === 0 ? (
              <div className="py-16 text-center opacity-40">
                <Activity size={36} className="mx-auto mb-3" />
                <h3 className="font-bold">No posts yet</h3>
                <p className="text-xs mt-1">Write your first post!</p>
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post._id} className="glass-panel p-5 rounded-[2rem] border border-card-border hover:border-brand-500/20 transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-brand-500 transition-colors truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${post.isApproved ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-400"}`}>
                          {post.isApproved ? "Approved" : "Pending"}
                        </span>
                        <span className="text-[10px] text-foreground/30 font-semibold">{post.category}</span>
                        <span className="text-[10px] text-foreground/30">{formatDistanceToNow(new Date(post.createdAt || post.date))} ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openEditModal(post)} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-brand-500 transition-all"><Pencil size={14} /></button>
                      <button onClick={() => handleDeletePost(post._id)} disabled={deletingId === post._id} className="p-2 rounded-xl bg-foreground/5 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-all">
                        {deletingId === post._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                  {post.summary && <p className="text-xs text-foreground/50 font-medium italic">{post.summary}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Post Detail Modal (Facebook-style) */}
      {openPost && (
        <div className="fixed inset-0 z-[200] flex items-stretch md:items-center justify-center" onClick={(e) => e.target === e.currentTarget && setOpenPost(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpenPost(null)} />
          <div className="relative z-10 w-full md:max-w-2xl md:mx-4 bg-background border border-card-border md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "100dvh", height: "100dvh", maxHeight: "100dvh" }}>
            {/* Modal header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-card-border shrink-0 bg-background/95 backdrop-blur-md">
              <button onClick={() => setOpenPost(null)} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1">
                <ArrowLeft size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground truncate">{openPost.title}</h3>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">{openPost.category}</p>
              </div>
              <button onClick={() => handleShare(openPost)} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all">
                {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Post body */}
              <div className="p-5 md:p-6 border-b border-card-border">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const postAuthor = nonAdminMembers.find(m =>
                      m._id === openPost.submittedBy?.toString?.() || m._id === openPost.submittedBy
                    );
                    return (
                      <button
                        onClick={() => { if (postAuthor) setViewingProfile(postAuthor); }}
                        className={`flex items-center gap-3 group ${postAuthor ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-500 shrink-0 group-hover:ring-2 group-hover:ring-brand-500/30 transition-all">
                          {(openPost.author || "A")[0].toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className={`font-bold text-sm ${postAuthor ? "group-hover:text-brand-500 transition-colors" : ""}`}>{openPost.author || "Anonymous"}</p>
                          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                            {formatDistanceToNow(new Date(openPost.createdAt || openPost.date))} ago
                          </p>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                {openPost.summary && (
                  <p className="text-sm text-foreground/70 font-medium leading-relaxed italic border-l-2 border-brand-500/30 pl-3 mb-4">"{openPost.summary}"</p>
                )}
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{openPost.content}</p>

                {/* Like & share row */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-card-border">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleNeuralPulse(openPost._id)}
                      disabled={likingId === openPost._id}
                      className={`flex items-center gap-2 text-sm font-bold transition-all active:scale-95 ${(likes[openPost._id]?.liked) ? "text-pink-500" : "text-foreground/40 hover:text-pink-500"}`}
                    >
                      <Heart size={20} className={likes[openPost._id]?.liked ? "fill-pink-500" : ""} />
                      {(likes[openPost._id]?.count || 0) > 0 && <span>{likes[openPost._id]?.count}</span>}
                      <span>Like</span>
                    </button>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/40">
                      <MessageSquare size={20} />
                      <span>{postComments.length} {postComments.length === 1 ? "Comment" : "Comments"}</span>
                    </div>
                  </div>
                  <button onClick={() => handleShare(openPost)} className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-foreground transition-colors">
                    {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                    <span>{copied ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              </div>

              {/* Comments section */}
              <div className="p-5 md:p-6 space-y-4">
                <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Comments</h4>

                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                  </div>
                ) : postComments.length === 0 ? (
                  <div className="text-center py-8 opacity-40">
                    <MessageSquare size={28} className="mx-auto mb-2" />
                    <p className="text-xs font-bold">No comments yet — be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postComments.map((comment, idx) => (
                      <div key={comment._id || idx} className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-brand-500 shrink-0">
                          {(comment.userName || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-foreground/[0.05] border border-card-border rounded-2xl rounded-tl-md px-4 py-3">
                            <p className="text-xs font-bold text-foreground mb-1">{comment.userName}</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                          </div>
                          <p className="text-[10px] text-foreground/30 font-semibold mt-1 px-1">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + " ago" : "just now"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment input */}
            <div className="p-4 border-t border-card-border bg-background/95 backdrop-blur-md shrink-0">
              <form onSubmit={handleSubmitComment} className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-brand-500 shrink-0">
                  {(currentUser?.name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-foreground/[0.05] border border-card-border rounded-[2rem] px-4 py-2.5 focus-within:border-brand-500/50 transition-all">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment…"
                    disabled={submittingComment}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!commentInput.trim() || submittingComment}
                  className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-95 shrink-0"
                >
                  {submittingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingPost(null)} />
          <div className="relative z-10 w-full md:max-w-xl bg-background border border-card-border md:rounded-[2.5rem] rounded-t-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base flex items-center gap-2"><Pencil size={16} className="text-brand-500" /> Edit Post</h3>
              <button onClick={() => setEditingPost(null)} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-all"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title…" className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all" />
              <input value={editForm.summary} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} placeholder="Summary…" className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all" />
              <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea required value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} rows={5} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-sm font-semibold focus:outline-none focus:border-brand-500/50 transition-all resize-none" />
              {editStatus && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${editStatus.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                  {editStatus.type === "success" ? <CheckCircle2 size={14} /> : <X size={14} />}
                  {editStatus.message}
                </div>
              )}
              <button type="submit" disabled={savingEdit} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {savingEdit ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {viewingProfile && (
        <ProfileModal
          member={viewingProfile}
          currentUserId={currentUser?._id}
          currentUserFollowing={currentUser?.following || []}
          onClose={() => setViewingProfile(null)}
          onFollow={onFollow}
          onMessage={onMessage}
        />
      )}
    </section>
  );
}
