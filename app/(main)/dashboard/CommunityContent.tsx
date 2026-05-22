"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Activity, MessageSquare, Heart, Share2, Clock, Pencil, Trash2, X, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import CommunityCard from "./CommunityCard";
import ProfileModal from "./ProfileModal";
import { formatDistanceToNow } from "date-fns";

interface CommunityContentProps {
  members: any[];
  currentUser: any;
  onFollow: (userId: string) => void;
  onMessage: (member: any) => void;
}

export default function CommunityContent({
  members,
  currentUser,
  onFollow,
  onMessage,
}: CommunityContentProps) {
  const [activeSubTab, setActiveSubTab] = useState<"members" | "feed" | "my-posts">("members");
  const [search, setSearch] = useState("");
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);

  // Edit modal state
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ title: "", summary: "", content: "", category: "Technology" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubTab === "feed") {
      fetchFeed();
    } else if (activeSubTab === "my-posts") {
      fetchMyPosts();
    }
  }, [activeSubTab]);

  const fetchFeed = async () => {
    setLoadingFeed(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setFeedPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoadingFeed(false);
    }
  };

  const fetchMyPosts = async () => {
    setLoadingMyPosts(true);
    try {
      const res = await fetch("/api/news/submit");
      if (res.ok) {
        const data = await res.json();
        setMyPosts(data.news || []);
      }
    } catch (err) {
      console.error("Failed to fetch my posts:", err);
    } finally {
      setLoadingMyPosts(false);
    }
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setEditForm({
      title: post.title || "",
      summary: post.summary || "",
      content: post.content || "",
      category: post.category || "Technology"
    });
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
        body: JSON.stringify({ id: editingPost._id, ...editForm })
      });
      const data = await res.json();
      if (res.ok) {
        setEditStatus({ type: "success", message: "Post updated! It will be re-reviewed." });
        setMyPosts(prev => prev.map(p => p._id === editingPost._id ? { ...p, ...editForm, isApproved: false } : p));
        setTimeout(() => {
          setEditingPost(null);
          setEditStatus(null);
        }, 2000);
      } else {
        setEditStatus({ type: "error", message: data.error || "Failed to update post." });
      }
    } catch (err) {
      setEditStatus({ type: "error", message: "Network error." });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/news/submit?id=${postId}`, { method: "DELETE" });
      if (res.ok) {
        setMyPosts(prev => prev.filter(p => p._id !== postId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setDeletingId(null);
    }
  };

  const nonAdminMembers = members.filter((m) => m.role !== "admin");

  const filteredMembers = nonAdminMembers.filter((m) => {
    if (m._id === currentUser?._id) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      (m.skills || []).some((s: string) => s.toLowerCase().includes(q))
    );
  });

  return (
    <section className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-card-border mb-12 relative overflow-hidden bg-gradient-to-br from-background via-brand-500/[0.005] to-purple-500/[0.005]">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shadow-lg shadow-brand-500/5">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Community Ecosystem</h2>
            <div className="flex gap-4 mt-1.5">
              <button
                onClick={() => setActiveSubTab("members")}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${activeSubTab === 'members' ? 'text-brand-500 underline underline-offset-8 decoration-2' : 'text-foreground/30 hover:text-foreground/60'}`}
              >
                Members ({nonAdminMembers.length})
              </button>
              <button
                onClick={() => setActiveSubTab("feed")}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${activeSubTab === 'feed' ? 'text-brand-500 underline underline-offset-8 decoration-2' : 'text-foreground/30 hover:text-foreground/60'}`}
              >
                Neural Feed
              </button>
              <button
                onClick={() => setActiveSubTab("my-posts")}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${activeSubTab === 'my-posts' ? 'text-brand-500 underline underline-offset-8 decoration-2' : 'text-foreground/30 hover:text-foreground/60'}`}
              >
                My Posts
              </button>
            </div>
          </div>
        </div>

        {activeSubTab === "members" && (
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-brand-500 transition-colors pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role or skill…"
              className="w-full lg:w-80 bg-foreground/[0.03] border border-card-border rounded-2xl py-3.5 pl-10 pr-4 text-xs font-semibold text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/40 focus:ring-4 focus:ring-brand-500/5 transition-all shadow-inner"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-10">
        {activeSubTab === "members" ? (
          filteredMembers.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center opacity-40 animate-in fade-in">
              <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center mb-4 border border-dashed border-card-border">
                <Users size={40} className="text-foreground/40" />
              </div>
              <h3 className="font-bold text-lg">No connections found</h3>
              <p className="text-xs font-semibold mt-1 max-w-xs mx-auto">
                {search ? `Your search for "${search}" yielded no results in the current dataset.` : "The community is initializing. Be the first to reach out!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
          )
        ) : activeSubTab === "feed" ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {loadingFeed ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Synchronizing Feed...</p>
              </div>
            ) : feedPosts.length === 0 ? (
              <div className="py-24 text-center opacity-40">
                <Activity size={48} className="mx-auto mb-4" />
                <h3 className="font-bold">Neural Feed Empty</h3>
                <p className="text-xs mt-1">No community transmissions have been verified yet.</p>
              </div>
            ) : (
              feedPosts.map((post) => {
                const author = nonAdminMembers.find(m => m._id === post.submittedBy) || { name: post.author || "Anonymous" };
                const isFollowing = currentUser?.following?.includes(post.submittedBy);
                return (
                  <div key={post._id} className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-card-border hover:border-brand-500/20 transition-all group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-500">
                          {author.name?.[0].toUpperCase() || "A"}
                        </div>
                        <div>
                          <h4 className="font-bold text-base flex items-center gap-2">
                            {author.name}
                            {post.submittedBy && <ShieldCheck size={14} className="text-brand-500" />}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                            <span className="flex items-center gap-1.5"><Clock size={10} /> {formatDistanceToNow(new Date(post.createdAt || post.date))} ago</span>
                            <span>•</span>
                            <span className="text-brand-500/70">{post.category}</span>
                          </div>
                        </div>
                      </div>
                      {post.submittedBy && post.submittedBy !== currentUser?._id && (
                        <button
                          onClick={() => onFollow(post.submittedBy)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isFollowing ? 'bg-foreground/5 text-foreground/40 border border-card-border' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95'}`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight">{post.title}</h3>
                      <p className="text-sm text-foreground/60 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-4">"{post.summary}"</p>
                      {post.content && (
                        <p className="text-xs text-foreground/45 font-medium line-clamp-3">{post.content}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-card-border">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-foreground/30 hover:text-brand-500 transition-colors">
                          <Heart size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Neural Pulse</span>
                        </button>
                        <button className="flex items-center gap-2 text-foreground/30 hover:text-purple-500 transition-colors">
                          <MessageSquare size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Comment</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-2 text-foreground/30 hover:text-foreground transition-colors">
                        <Share2 size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Relay</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* My Posts */
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {loadingMyPosts ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Loading your posts...</p>
              </div>
            ) : myPosts.length === 0 ? (
              <div className="py-24 text-center opacity-40">
                <Activity size={48} className="mx-auto mb-4" />
                <h3 className="font-bold">Your Posts Empty</h3>
                <p className="text-xs mt-1">You haven&apos;t submitted any posts yet. Share your first transmission!</p>
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post._id} className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-card-border hover:border-brand-500/20 transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-500">
                        {currentUser?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{currentUser?.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5">
                          <span className="flex items-center gap-1.5"><Clock size={10} /> {formatDistanceToNow(new Date(post.createdAt || post.date))} ago</span>
                          <span>•</span>
                          <span className="text-brand-500/70">{post.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-blue-500 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        disabled={deletingId === post._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50"
                      >
                        {deletingId === post._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight">{post.title}</h3>
                      <span className={`shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full ${post.isApproved ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                        {post.isApproved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-4">"{post.summary}"</p>
                    {post.content && (
                      <p className="text-xs text-foreground/45 font-medium line-clamp-3">{post.content}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-card-border">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-foreground/30 hover:text-brand-500 transition-colors">
                        <Heart size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Neural Pulse</span>
                      </button>
                      <button className="flex items-center gap-2 text-foreground/30 hover:text-purple-500 transition-colors">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Comment</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-foreground/30 hover:text-foreground transition-colors">
                      <Share2 size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Relay</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {viewingProfile && (
        <ProfileModal
          member={viewingProfile}
          currentUserId={currentUser?._id}
          onClose={() => setViewingProfile(null)}
          onFollow={onFollow}
          onMessage={(m) => {
            setViewingProfile(null);
            onMessage(m);
          }}
        />
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => setEditingPost(null)} />
          <div className="glass-panel p-8 rounded-[2.5rem] border border-card-border max-w-lg w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Pencil size={18} className="text-brand-500" /> Edit Post
              </h3>
              <button onClick={() => setEditingPost(null)} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1.5">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1.5">Summary</label>
                <input
                  type="text"
                  value={editForm.summary}
                  onChange={e => setEditForm({ ...editForm, summary: e.target.value })}
                  required
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1.5">Category</label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                >
                  {["Technology", "AI", "Web Dev", "Design", "Business", "Open Source"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1.5">Content</label>
                <textarea
                  value={editForm.content}
                  onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                  rows={5}
                  required
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium resize-none"
                />
              </div>

              {editStatus && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${editStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {editStatus.type === 'success' ? <CheckCircle2 size={14} /> : <X size={14} />}
                  {editStatus.message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-foreground/5 border border-card-border text-foreground/60 font-bold hover:bg-foreground/10 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 px-4 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
