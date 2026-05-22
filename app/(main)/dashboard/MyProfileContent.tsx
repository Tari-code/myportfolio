"use client";

import { useState, useEffect } from "react";
import {
  User, Globe, AtSign, ExternalLink, MapPin, Calendar, Link2, Check,
  Briefcase, FileText, Heart, MessageSquare, Clock, Edit3, Save, X,
  Plus, Trash2, Loader2, Camera, ChevronDown, ChevronUp, Image
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const gradients: Record<string, { cover: string; avatar: string }> = {
  A: { cover: "from-rose-900/80 via-pink-800/50 to-background",    avatar: "from-rose-500 to-pink-600" },
  B: { cover: "from-orange-900/80 via-amber-800/50 to-background",  avatar: "from-orange-500 to-amber-600" },
  C: { cover: "from-yellow-900/80 via-lime-800/50 to-background",   avatar: "from-yellow-500 to-lime-600" },
  D: { cover: "from-green-900/80 via-emerald-800/50 to-background", avatar: "from-green-500 to-emerald-600" },
  E: { cover: "from-teal-900/80 via-cyan-800/50 to-background",     avatar: "from-teal-500 to-cyan-600" },
  F: { cover: "from-sky-900/80 via-blue-800/50 to-background",      avatar: "from-sky-500 to-blue-600" },
  G: { cover: "from-indigo-900/80 via-violet-800/50 to-background", avatar: "from-indigo-500 to-violet-600" },
  H: { cover: "from-purple-900/80 via-fuchsia-800/50 to-background",avatar: "from-purple-500 to-fuchsia-600" },
  J: { cover: "from-pink-900/80 via-red-800/50 to-background",      avatar: "from-pink-500 to-red-600" },
  M: { cover: "from-emerald-900/80 via-teal-800/50 to-background",  avatar: "from-emerald-500 to-teal-600" },
  N: { cover: "from-cyan-900/80 via-sky-800/50 to-background",      avatar: "from-cyan-500 to-sky-600" },
  R: { cover: "from-fuchsia-900/80 via-pink-800/50 to-background",  avatar: "from-fuchsia-500 to-pink-600" },
  S: { cover: "from-rose-900/80 via-red-800/50 to-background",      avatar: "from-rose-500 to-red-600" },
  T: { cover: "from-red-900/80 via-orange-800/50 to-background",    avatar: "from-red-500 to-orange-600" },
};

interface Props {
  user: any;
  onUserUpdate?: (updated: any) => void;
}

export default function MyProfileContent({ user, onUserUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<"about" | "feed" | "work">("about");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [form, setForm] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    github: user?.github || "",
    twitter: user?.twitter || "",
    avatar: user?.avatar || "",
    coverPhoto: user?.coverPhoto || "",
    skillInput: "",
    skills: user?.skills || [] as string[],
  });

  useEffect(() => {
    if (activeTab === "feed" && !postsFetched) fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        const myPosts = Array.isArray(data)
          ? data.filter((p: any) => p.submittedBy === (user?._id || user?.id) || p.submittedBy?.toString() === (user?._id || user?.id))
          : [];
        setPosts(myPosts);
      }
    } catch {}
    setLoadingPosts(false);
    setPostsFetched(true);
  };

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm(f => ({ ...f, skills: [...f.skills, skill], skillInput: "" }));
    }
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter((s: string) => s !== skill) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          bio: form.bio,
          location: form.location,
          website: form.website,
          github: form.github,
          twitter: form.twitter,
          avatar: form.avatar,
          coverPhoto: form.coverPhoto,
          skills: form.skills,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaveStatus("Saved!");
        setEditing(false);
        if (onUserUpdate) onUserUpdate({ ...user, ...data.user, avatar: form.avatar, coverPhoto: form.coverPhoto });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("Failed to save.");
      }
    } catch {
      setSaveStatus("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const g = gradients[initial] || { cover: "from-brand-900/80 via-brand-800/50 to-background", avatar: "from-brand-500 to-brand-700" };
  const joinedDate = user?.createdAt ? new Date(user.createdAt) : null;
  const displayAvatar = editing ? form.avatar : (user?.avatar || "");
  const displayCover = editing ? form.coverPhoto : (user?.coverPhoto || "");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Full-screen Avatar Lightbox */}
      {lightboxOpen && displayAvatar && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
          >
            <X size={22} />
          </button>
          <img
            src={displayAvatar}
            alt={user?.name}
            className="max-w-[92vw] max-h-[92vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto">

        {/* Cover */}
        <div className="h-48 relative overflow-hidden rounded-t-[2rem]">
          {displayCover ? (
            <img src={displayCover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-b ${g.cover}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          {editing && (
            <label className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold cursor-pointer hover:bg-black/80 transition-all">
              <Image size={12} /> Change Cover
            </label>
          )}
        </div>

        {/* Profile header */}
        <div className="bg-background px-5 md:px-8">
          <div className="flex items-end justify-between -mt-14 mb-4">
            <div className="relative">
              <div
                onClick={() => !editing && displayAvatar && setLightboxOpen(true)}
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${g.avatar} flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-background overflow-hidden ${!editing && displayAvatar ? "cursor-pointer hover:ring-brand-500/50 transition-all" : ""}`}
              >
                {displayAvatar ? (
                  <img src={displayAvatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : initial}
              </div>
              {editing && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg">
                  <Camera size={14} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-1">
              {saveStatus && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${saveStatus === "Saved!" ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"}`}>
                  {saveStatus}
                </span>
              )}
              {editing ? (
                <>
                  <button
                    onClick={() => { setEditing(false); setForm({ bio: user?.bio || "", location: user?.location || "", website: user?.website || "", github: user?.github || "", twitter: user?.twitter || "", avatar: user?.avatar || "", coverPhoto: user?.coverPhoto || "", skillInput: "", skills: user?.skills || [] }); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-foreground/5 text-foreground/60 border border-card-border hover:bg-foreground/10 transition-all"
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-95 disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-foreground/5 text-foreground/70 border border-card-border hover:bg-foreground/10 transition-all active:scale-95"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Name & info */}
          <div className="mb-3">
            <h1 className="text-xl font-bold text-foreground leading-tight">{user?.name}</h1>
            <p className="text-xs font-bold text-brand-500 mt-0.5 uppercase tracking-widest">{user?.role || "Community Member"}</p>

            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Write your bio..."
                className="mt-2 w-full bg-foreground/[0.04] border border-brand-500/30 rounded-2xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-brand-500/60 transition-all font-medium resize-none"
              />
            ) : (
              user?.bio && <p className="text-sm text-foreground/60 font-medium mt-2 leading-relaxed">{user.bio}</p>
            )}

            {editing ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Location (e.g. London, UK)"
                  className="flex-1 min-w-[160px] bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                />
                <input
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="Website URL"
                  className="flex-1 min-w-[160px] bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                {user?.location && (
                  <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium">
                    <MapPin size={11} /> {user.location}
                  </span>
                )}
                {joinedDate && (
                  <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium">
                    <Calendar size={11} /> Joined {format(joinedDate, "MMM yyyy")}
                  </span>
                )}
                {user?.website && (
                  <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:underline">
                    <Link2 size={11} /> {user.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex border-t border-b border-card-border">
            {[
              { label: "Posts", value: postsFetched ? posts.length : "–" },
              { label: "Followers", value: (user?.followers || []).length },
              { label: "Following", value: (user?.following || []).length },
            ].map((s, i) => (
              <div key={s.label} className={`flex-1 py-3 text-center ${i > 0 ? "border-l border-card-border" : ""}`}>
                <p className="text-lg font-black text-foreground">{s.value}</p>
                <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-card-border -mx-5 md:-mx-8 px-5 md:px-8">
            {[
              { id: "about", label: "About", icon: User },
              { id: "feed",  label: "Feed",  icon: FileText },
              { id: "work",  label: "Work",  icon: Briefcase },
            ].map(tab => {
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
        </div>

        {/* Tab content */}
        <div className="bg-background px-5 md:px-8 py-5 space-y-4 min-h-[300px]">

          {/* ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-5">

              {/* Avatar & Cover URLs when editing */}
              {editing && (
                <div className="space-y-3 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Profile Pictures</p>
                  <input
                    value={form.avatar}
                    onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                    placeholder="Avatar image URL"
                    className="w-full bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                  />
                  <input
                    value={form.coverPhoto}
                    onChange={e => setForm(f => ({ ...f, coverPhoto: e.target.value }))}
                    placeholder="Cover photo image URL"
                    className="w-full bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                  />
                </div>
              )}

              {/* Skills */}
              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-brand-500 rounded" /> Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill: string) => (
                    <span key={skill} className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wide">
                      {skill}
                      {editing && (
                        <button onClick={() => removeSkill(skill)} className="text-brand-400/60 hover:text-red-400 transition-colors">
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))}
                  {editing && (
                    <div className="flex gap-2">
                      <input
                        value={form.skillInput}
                        onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        placeholder="Add skill..."
                        className="bg-foreground/[0.04] border border-brand-500/20 rounded-xl py-1.5 px-3 text-[10px] text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium w-28"
                      />
                      <button onClick={addSkill} className="px-2.5 py-1.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-bold hover:bg-brand-500/20 transition-all">
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                  {!editing && form.skills.length === 0 && (
                    <p className="text-xs text-foreground/30 font-medium italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Links */}
              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-brand-500 rounded" /> Links
                </p>
                {editing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0"><ExternalLink size={13} className="text-foreground/40" /></div>
                      <input
                        value={form.github}
                        onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                        placeholder="GitHub username"
                        className="flex-1 bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0"><AtSign size={13} className="text-sky-400" /></div>
                      <input
                        value={form.twitter}
                        onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
                        placeholder="Twitter/X username"
                        className="flex-1 bg-foreground/[0.04] border border-card-border rounded-xl py-2 px-3 text-xs text-foreground focus:outline-none focus:border-brand-500/40 transition-all font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {user?.website && (
                      <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-brand-500/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0"><Globe size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 group-hover:text-brand-500 transition-colors truncate">{user.website.replace(/^https?:\/\//, "")}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">Website</p>
                        </div>
                        <ExternalLink size={12} className="text-foreground/20 group-hover:text-brand-500 transition-colors shrink-0" />
                      </a>
                    )}
                    {user?.github && (
                      <a href={`https://github.com/${user.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-foreground/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0"><ExternalLink size={14} className="text-foreground/60" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 truncate">@{user.github}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">GitHub</p>
                        </div>
                      </a>
                    )}
                    {user?.twitter && (
                      <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-sky-400/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0"><AtSign size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 truncate">@{user.twitter}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">Twitter / X</p>
                        </div>
                      </a>
                    )}
                    {!user?.website && !user?.github && !user?.twitter && !editing && (
                      <p className="text-xs text-foreground/30 font-medium italic">No links added yet. Click Edit Profile to add them.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Membership */}
              {user?.tier && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-500/5 to-purple-500/5 border border-brand-500/15">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                    <Check size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">Membership</p>
                    <p className="font-bold text-sm text-foreground capitalize mt-0.5">{user.tier} Tier</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FEED */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              {loadingPosts ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-brand-500" />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <FileText size={32} className="mx-auto mb-3" />
                  <p className="text-sm font-bold">No posts yet</p>
                  <p className="text-xs mt-1">Your submitted news articles will appear here.</p>
                </div>
              ) : (
                posts.map(post => {
                  const isExpanded = expandedPosts.has(post._id);
                  const hasFullContent = post.content && post.content.length > 0;
                  return (
                    <div key={post._id} className="rounded-[1.5rem] border border-card-border hover:border-brand-500/20 transition-all overflow-hidden bg-foreground/[0.01]">
                      <div className="flex items-center gap-3 p-4">
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${g.avatar} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                          {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" /> : initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground">{user?.name}</p>
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
                          <p className="text-xs text-foreground/55 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-3">&ldquo;{post.summary}&rdquo;</p>
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
                          <Heart size={14} className={(post.likes?.length || 0) > 0 ? "fill-pink-500 text-pink-500" : ""} />
                          <span className="text-[11px] font-bold">{(post.likes?.length || 0) > 0 ? post.likes.length : ""} Like</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-foreground/30">
                          <MessageSquare size={14} />
                          <span className="text-[11px] font-bold">{(post.comments?.length || 0) > 0 ? `${post.comments.length} Comments` : "Comment"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* WORK */}
          {activeTab === "work" && (
            <div className="py-8 text-center opacity-30">
              <Briefcase size={32} className="mx-auto mb-3" />
              <p className="text-sm font-bold">Work experience</p>
              <p className="text-xs mt-1">Add work experience via Settings → Profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
