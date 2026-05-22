"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Activity, MessageSquare, Heart, Share2, Sparkles, Clock, UserPlus, UserMinus, ShieldCheck } from "lucide-react";
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
    if (!currentUser?._id) return;
    setLoadingMyPosts(true);
    try {
      const res = await fetch(`/api/news?submittedBy=${currentUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setMyPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch my posts:", err);
    } finally {
      setLoadingMyPosts(false);
    }
  };

  // Filter out admin users from community view
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
      {/* Decorative glow */}
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

        {/* Search */}
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
          /* Neural Feed */
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
                  <div key={post._id} className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-card-hover:border-brand-500/20 transition-all group">
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
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/60 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-4">
                        "{post.summary}"
                      </p>
                      {post.content && (
                        <p className="text-xs text-foreground/45 font-medium line-clamp-3">
                          {post.content}
                        </p>
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
                <p className="text-xs mt-1">You haven't submitted any posts yet. Share your first transmission!</p>
              </div>
            ) : (
              myPosts.map((post) => {
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
                      
                      {/* Edit/Delete buttons for own posts */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            // TODO: Implement edit post functionality
                            alert('Edit post functionality coming soon!');
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8a.75.75 0 01-.75-.75l.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zM7.5 8.25l9 9" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Implement delete post functionality
                            if (window.confirm('Are you sure you want to delete this post?')) {
                              alert('Delete post functionality coming soon!');
                            }
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/60 font-medium leading-relaxed italic border-l-2 border-brand-500/20 pl-4">
                        "{post.summary}"
                      </p>
                      {post.content && (
                        <p className="text-xs text-foreground/45 font-medium line-clamp-3">
                          {post.content}
                        </p>
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
    </section>
  );
}