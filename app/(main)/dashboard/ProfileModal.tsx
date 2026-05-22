"use client";

import React, { useState, useEffect } from "react";
import {
  X, UserCheck, UserPlus, MessageSquare, Globe, ExternalLink, AtSign,
  Heart, Clock, Briefcase, User, FileText, Loader2, Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProfileModalProps {
  member: any;
  currentUser?: any;
  currentUserId?: string;
  onClose: () => void;
  onFollow: (userId: string) => void;
  onMessage: (member: any) => void;
}

export default function ProfileModal({
  member,
  currentUser,
  currentUserId,
  onClose,
  onFollow,
  onMessage,
}: ProfileModalProps) {
  const resolvedCurrentUserId = currentUserId || currentUser?._id;
  const isFollowing = (member.followers || []).some((f: any) =>
    f === resolvedCurrentUserId || f?._id === resolvedCurrentUserId || f?.toString() === resolvedCurrentUserId
  );
  const initial = member.name?.charAt(0)?.toUpperCase() || "?";

  const [activeTab, setActiveTab] = useState<"about" | "posts" | "work">("about");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);

  useEffect(() => {
    if (activeTab === "posts" && !postsFetched && member._id) {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/news?author=${member._id}`);
      if (res.ok) {
        const data = await res.json();
        const authorPosts = Array.isArray(data)
          ? data.filter((p: any) => p.submittedBy === member._id || p.submittedBy?.toString() === member._id)
          : [];
        setPosts(authorPosts);
      }
    } catch {}
    setLoadingPosts(false);
    setPostsFetched(true);
  };

  const gradients: Record<string, string> = {
    A: "from-rose-500 to-pink-600", B: "from-orange-500 to-amber-600",
    C: "from-yellow-500 to-lime-600", D: "from-green-500 to-emerald-600",
    E: "from-teal-500 to-cyan-600", F: "from-sky-500 to-blue-600",
    G: "from-indigo-500 to-violet-600", H: "from-purple-500 to-fuchsia-600",
    I: "from-red-500 to-rose-600", J: "from-pink-500 to-red-600",
    K: "from-amber-500 to-yellow-600", L: "from-lime-500 to-green-600",
    M: "from-emerald-500 to-teal-600", N: "from-cyan-500 to-sky-600",
    O: "from-blue-500 to-indigo-600", P: "from-indigo-500 to-purple-600",
    Q: "from-purple-500 to-fuchsia-600", R: "from-fuchsia-500 to-pink-600",
    S: "from-rose-500 to-red-600", T: "from-red-500 to-orange-600",
    U: "from-orange-500 to-yellow-600", V: "from-yellow-500 to-green-600",
    W: "from-green-500 to-blue-600", X: "from-blue-500 to-purple-600",
    Y: "from-purple-500 to-red-600", Z: "from-red-500 to-pink-600",
  };
  const gradient = gradients[initial] || "from-brand-500 to-brand-700";

  const workExperience = member.workExperience || member.experience || [];
  const education = member.education || [];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />

      <div className="glass-panel w-full max-w-xl rounded-[2.5rem] border border-card-border relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Decorative glows */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-7 pb-0 relative z-10">
          <div className="flex items-center gap-5 mb-5">
            <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden shrink-0`}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              ) : initial}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground leading-tight truncate">{member.name}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mt-0.5">{member.role || "Community Member"}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-foreground/40 font-bold">
                  <span className="text-foreground">{(member.followers || []).length}</span> followers
                </span>
                <span className="text-xs text-foreground/40 font-bold">
                  <span className="text-foreground">{(member.following || []).length}</span> following
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => onFollow(member._id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border active:scale-95 ${
                isFollowing
                  ? "bg-foreground/5 text-foreground/50 border-card-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                  : "bg-brand-500 text-white border-brand-400 hover:bg-brand-400 shadow-lg shadow-brand-500/20"
              }`}
            >
              {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={() => { onMessage(member); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold bg-foreground/5 text-foreground/70 border border-card-border hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/20 transition-all active:scale-95"
            >
              <MessageSquare size={14} /> Message
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-card-border pb-0 -mx-7 px-7">
            {[
              { id: "about", label: "About", icon: User },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "work", label: "Work & Education", icon: Briefcase },
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

        {/* Tab Content — scrollable */}
        <div className="overflow-y-auto flex-1 custom-scrollbar p-7 pt-5 space-y-4">

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {member.bio ? (
                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{member.bio}</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                  <p className="text-xs text-foreground/30 italic">No bio added yet.</p>
                </div>
              )}

              {(member.skills || []).length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill: string) => (
                      <span key={skill} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(member.website || member.github || member.twitter) && (
                <div>
                  <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2">Links</p>
                  <div className="flex flex-wrap gap-3">
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-brand-500 transition-colors px-3 py-2 rounded-xl bg-foreground/[0.03] border border-card-border hover:border-brand-500/20">
                        <Globe size={13} /> Website
                      </a>
                    )}
                    {member.github && (
                      <a href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors px-3 py-2 rounded-xl bg-foreground/[0.03] border border-card-border hover:border-foreground/20">
                        <ExternalLink size={13} /> GitHub
                      </a>
                    )}
                    {member.twitter && (
                      <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-sky-400 transition-colors px-3 py-2 rounded-xl bg-foreground/[0.03] border border-card-border hover:border-sky-400/20">
                        <AtSign size={13} /> Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Posts", value: posts.length || "–" },
                  { label: "Followers", value: (member.followers || []).length },
                  { label: "Following", value: (member.following || []).length },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-2xl bg-foreground/[0.02] border border-card-border text-center">
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {loadingPosts ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-brand-500" />
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="py-12 text-center">
                  <Activity size={32} className="mx-auto mb-3 text-foreground/10" />
                  <p className="text-sm text-foreground/30 font-semibold">No public posts yet</p>
                  <p className="text-xs text-foreground/20 mt-1">Posts {member.name} publishes will appear here.</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post._id} className="p-4 rounded-2xl border border-card-border hover:border-brand-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-brand-500/70 bg-brand-500/10 border border-brand-500/15 px-2 py-1 rounded-lg uppercase tracking-widest">{post.category}</span>
                      <span className="text-[9px] text-foreground/25 font-bold">
                        {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-brand-500 transition-colors mb-1 leading-tight">{post.title}</h4>
                    {post.summary && <p className="text-xs text-foreground/45 italic">"{post.summary}"</p>}
                    {post.content && <p className="text-xs text-foreground/35 mt-2 line-clamp-2">{post.content}</p>}
                    {(post.likes?.length || 0) > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 text-[9px] font-bold text-brand-500">
                        <Heart size={11} className="fill-brand-500" /> {post.likes.length} Neural Pulses
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Work & Education Tab */}
          {activeTab === "work" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Work Experience */}
              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Briefcase size={11} /> Work Experience
                </p>
                {workExperience.length > 0 ? (
                  <div className="space-y-3">
                    {workExperience.map((exp: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                        <p className="font-bold text-sm text-foreground">{exp.title || exp.position}</p>
                        <p className="text-xs text-brand-500 font-semibold mt-0.5">{exp.company}</p>
                        {(exp.from || exp.startDate) && (
                          <p className="text-[9px] text-foreground/30 font-bold mt-1 uppercase tracking-wider">
                            {exp.from || exp.startDate} — {exp.to || exp.endDate || "Present"}
                          </p>
                        )}
                        {exp.description && <p className="text-xs text-foreground/45 mt-2 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                    <p className="text-xs text-foreground/30 italic">No work experience listed yet.</p>
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={11} /> Education
                </p>
                {education.length > 0 ? (
                  <div className="space-y-3">
                    {education.map((edu: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                        <p className="font-bold text-sm text-foreground">{edu.degree || edu.field}</p>
                        <p className="text-xs text-brand-500 font-semibold mt-0.5">{edu.school || edu.institution}</p>
                        {(edu.from || edu.startYear) && (
                          <p className="text-[9px] text-foreground/30 font-bold mt-1 uppercase tracking-wider">
                            {edu.from || edu.startYear} — {edu.to || edu.endYear || "Present"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                    <p className="text-xs text-foreground/30 italic">No education listed yet.</p>
                  </div>
                )}
              </div>

              {/* Tier badge */}
              {member.tier && (
                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-card-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Briefcase size={16} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">Membership Tier</p>
                    <p className="font-bold text-sm text-foreground capitalize mt-0.5">{member.tier}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
