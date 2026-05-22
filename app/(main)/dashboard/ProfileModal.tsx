"use client";

import React from "react";
import {
  X,
  UserCheck,
  UserPlus,
  MessageSquare,
  Globe,
  ExternalLink,
  AtSign,
} from "lucide-react";

interface ProfileModalProps {
  member: any;
  currentUserId?: string;
  onClose: () => void;
  onFollow: (userId: string) => void;
  onMessage: (member: any) => void;
}

export default function ProfileModal({
  member,
  currentUserId,
  onClose,
  onFollow,
  onMessage,
}: ProfileModalProps) {
  const isFollowing = (member.followers || []).includes(currentUserId);
  const initial = member.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="glass-panel w-full max-w-lg rounded-[2.5rem] border border-card-border p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-6 relative z-10">
          <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-brand-500/20 overflow-hidden shrink-0">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">{member.name}</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mt-0.5">
              {member.role || "Community Member"}
            </p>
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

        {/* Bio */}
        {member.bio && (
          <div className="mb-5 p-4 rounded-2xl bg-foreground/[0.02] border border-card-border relative z-10">
            <p className="text-xs text-foreground/60 font-medium leading-relaxed">{member.bio}</p>
          </div>
        )}

        {/* Skills */}
        {(member.skills || []).length > 0 && (
          <div className="mb-5 relative z-10">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
              Skills
            </span>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="text-[10px] font-bold px-3 py-1 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        {(member.website || member.github || member.twitter) && (
          <div className="flex gap-3 mb-6 relative z-10">
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 hover:text-brand-500 transition-colors"
              >
                <Globe size={12} /> Website
              </a>
            )}
            {member.github && (
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 hover:text-foreground transition-colors"
              >
                <ExternalLink size={12} /> GitHub
              </a>
            )}
            {member.twitter && (
              <a
                href={`https://twitter.com/${member.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 hover:text-sky-400 transition-colors"
              >
                <AtSign size={12} /> Twitter
              </a>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => onFollow(member._id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold transition-all border active:scale-95 ${isFollowing
                ? "bg-foreground/5 text-foreground/50 border-card-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                : "bg-brand-500 text-white border-brand-400 hover:bg-brand-400 shadow-lg shadow-brand-500/20"
              }`}
          >
            {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <button
            onClick={() => {
              onMessage(member);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold bg-foreground/5 text-foreground/70 border border-card-border hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/20 transition-all active:scale-95"
          >
            <MessageSquare size={14} />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
