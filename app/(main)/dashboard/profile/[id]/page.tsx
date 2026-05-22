"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, UserCheck, UserPlus, MessageSquare, Globe, ExternalLink, AtSign,
  Heart, Clock, Briefcase, User, FileText, Loader2, Activity,
  MapPin, Calendar, Link2, Check
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

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

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [member, setMember] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeTab, setActiveTab] = useState<"about" | "posts" | "work">("about");
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followHover, setFollowHover] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchMember();
  }, [id]);

  useEffect(() => {
    if (activeTab === "posts" && !postsFetched) fetchPosts();
  }, [activeTab]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) setCurrentUser(data.user);
      }
    } catch {}
  };

  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        const authorPosts = Array.isArray(data)
          ? data.filter((p: any) => p.submittedBy === id || p.submittedBy?.toString() === id)
          : [];
        setPosts(authorPosts);
      }
    } catch {}
    setLoadingPosts(false);
    setPostsFetched(true);
  };

  useEffect(() => {
    if (member && currentUser) {
      const isF = (member.followers || []).some((f: any) =>
        f === currentUser._id || f?._id === currentUser._id || f?.toString() === currentUser._id
      );
      setIsFollowing(isF);
    }
  }, [member, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || following) return;
    setFollowing(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "follow", targetId: id }),
      });
    } catch {
      setIsFollowing(wasFollowing);
    }
    setFollowing(false);
  };

  const handleMessage = () => {
    router.push(`/dashboard?dm=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (notFound || !member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
        <p className="text-4xl font-black text-foreground/10">404</p>
        <p className="font-bold text-foreground/40">Profile not found</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-500 font-bold text-sm">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }

  const initial = member.name?.charAt(0)?.toUpperCase() || "?";
  const g = gradients[initial] || { cover: "from-brand-900/80 via-brand-800/50 to-background", avatar: "from-brand-500 to-brand-700" };
  const workExperience = member.workExperience || member.experience || [];
  const education = member.education || [];
  const joinedDate = member.createdAt ? new Date(member.createdAt) : null;
  const isSelf = currentUser?._id === id || currentUser?.id === id;

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20">
      {/* Sticky back button */}
      <div className="sticky top-16 md:top-24 z-40 bg-background/80 backdrop-blur-xl border-b border-card-border px-4 md:px-6 py-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Cover */}
        <div className={`h-40 bg-gradient-to-b ${g.cover} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
        </div>

        {/* Profile section */}
        <div className="px-5 md:px-6 bg-background">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${g.avatar} flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-background overflow-hidden`}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : initial}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            </div>

            {!isSelf && currentUser && (
              <div className="flex gap-2 mb-1">
                <button
                  onClick={handleFollow}
                  onMouseEnter={() => setFollowHover(true)}
                  onMouseLeave={() => setFollowHover(false)}
                  disabled={following}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                    isFollowing
                      ? followHover
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-foreground/5 text-foreground/60 border border-card-border"
                      : "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400"
                  }`}
                >
                  {isFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />}
                  {isFollowing ? (followHover ? "Unfollow" : "Following") : "Follow"}
                </button>
                <button
                  onClick={handleMessage}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-foreground/5 text-foreground/70 border border-card-border hover:bg-foreground/10 transition-all active:scale-95"
                >
                  <MessageSquare size={13} /> Message
                </button>
              </div>
            )}
          </div>

          {/* Name & role */}
          <div className="mb-3">
            <h1 className="text-xl font-bold text-foreground leading-tight">{member.name}</h1>
            <p className="text-xs font-bold text-brand-500 mt-0.5 uppercase tracking-widest">{member.role || "Community Member"}</p>
            {member.bio && (
              <p className="text-sm text-foreground/60 font-medium mt-2 leading-relaxed">{member.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {member.location && (
                <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium">
                  <MapPin size={11} /> {member.location}
                </span>
              )}
              {joinedDate && (
                <span className="flex items-center gap-1 text-xs text-foreground/40 font-medium">
                  <Calendar size={11} /> Joined {format(joinedDate, "MMM yyyy")}
                </span>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:underline">
                  <Link2 size={11} /> {member.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex border-t border-b border-card-border">
            {[
              { label: "Posts", value: postsFetched ? posts.length : "–" },
              { label: "Followers", value: (member.followers || []).length },
              { label: "Following", value: (member.following || []).length },
            ].map((s, i) => (
              <div key={s.label} className={`flex-1 py-3 text-center ${i > 0 ? "border-l border-card-border" : ""}`}>
                <p className="text-lg font-black text-foreground">{s.value}</p>
                <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-card-border -mx-5 md:-mx-6 px-5 md:px-6">
            {[
              { id: "about", label: "About", icon: User },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "work", label: "Work", icon: Briefcase },
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
        <div className="px-5 md:px-6 py-5 space-y-4 bg-background min-h-[300px]">

          {/* ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-4">
              {(member.skills || []).length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-brand-500 rounded" /> Skills
                  </p>
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
                  <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-brand-500 rounded" /> Links
                  </p>
                  <div className="space-y-2">
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-brand-500/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0"><Globe size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 group-hover:text-brand-500 transition-colors truncate">{member.website.replace(/^https?:\/\//, "")}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">Website</p>
                        </div>
                        <ExternalLink size={12} className="text-foreground/20 group-hover:text-brand-500 transition-colors shrink-0" />
                      </a>
                    )}
                    {member.github && (
                      <a href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-foreground/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0"><ExternalLink size={14} className="text-foreground/60" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 truncate">@{member.github}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">GitHub</p>
                        </div>
                      </a>
                    )}
                    {member.twitter && (
                      <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/[0.03] border border-card-border hover:border-sky-400/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0"><AtSign size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground/70 truncate">@{member.twitter}</p>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-wider">Twitter / X</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {member.tier && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-500/5 to-purple-500/5 border border-brand-500/15">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                    <Check size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">Membership</p>
                    <p className="font-bold text-sm text-foreground capitalize mt-0.5">{member.tier} Tier</p>
                  </div>
                </div>
              )}

              {!member.bio && !member.skills?.length && !member.website && !member.github && !member.twitter && (
                <div className="py-12 text-center opacity-30">
                  <User size={32} className="mx-auto mb-3" />
                  <p className="text-sm font-bold">No profile info yet</p>
                </div>
              )}
            </div>
          )}

          {/* POSTS */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              {loadingPosts ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-brand-500" />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <Activity size={32} className="mx-auto mb-3" />
                  <p className="text-sm font-bold">No posts yet</p>
                </div>
              ) : (
                posts.map(post => (
                  <button
                    key={post._id}
                    onClick={() => router.push(`/dashboard/post/${post._id}`)}
                    className="w-full text-left rounded-[1.5rem] border border-card-border hover:border-brand-500/20 transition-all group overflow-hidden bg-foreground/[0.01]"
                  >
                    <div className="flex items-center gap-3 p-4 pb-0">
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${g.avatar} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-2xl" /> : initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground">{member.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/35 uppercase tracking-wider">
                          <Clock size={9} /> {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + " ago" : ""}
                          <span className="text-brand-500/70">{post.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      <h4 className="font-bold text-sm text-foreground group-hover:text-brand-500 transition-colors leading-tight">{post.title}</h4>
                      {post.summary && (
                        <p className="text-xs text-foreground/55 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-3">&ldquo;{post.summary}&rdquo;</p>
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
                  </button>
                ))
              )}
            </div>
          )}

          {/* WORK */}
          {activeTab === "work" && (
            <div className="space-y-5">
              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-brand-500 rounded" /> Work Experience
                </p>
                {workExperience.length > 0 ? (
                  <div className="space-y-3">
                    {workExperience.map((exp: any, i: number) => (
                      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                        <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">
                          <Briefcase size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground">{exp.title || exp.position}</p>
                          <p className="text-xs text-brand-500 font-semibold mt-0.5">{exp.company}</p>
                          {(exp.from || exp.startDate) && (
                            <p className="text-[9px] text-foreground/30 font-bold mt-1 uppercase tracking-wider">
                              {exp.from || exp.startDate} — {exp.to || exp.endDate || "Present"}
                            </p>
                          )}
                          {exp.description && <p className="text-xs text-foreground/45 mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/30 italic p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">No work experience listed yet.</p>
                )}
              </div>

              <div>
                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-purple-500 rounded" /> Education
                </p>
                {education.length > 0 ? (
                  <div className="space-y-3">
                    {education.map((edu: any, i: number) => (
                      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{edu.degree || edu.field}</p>
                          <p className="text-xs text-purple-500 font-semibold mt-0.5">{edu.school || edu.institution}</p>
                          {(edu.from || edu.startYear) && (
                            <p className="text-[9px] text-foreground/30 font-bold mt-1 uppercase tracking-wider">
                              {edu.from || edu.startYear} — {edu.to || edu.endYear || "Present"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/30 italic p-4 rounded-2xl bg-foreground/[0.02] border border-card-border">No education listed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
