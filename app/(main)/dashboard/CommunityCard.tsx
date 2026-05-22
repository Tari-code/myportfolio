"use client";

import React from "react";
import { 
  UserCheck, 
  UserPlus, 
  MessageSquare, 
  ChevronRight,
  Sparkles,
  Activity,
  Heart,
  Share2,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";

interface CommunityCardProps {
  member: any;
  currentUserId?: string;
  onViewProfile: (member: any) => void;
  onFollow: (userId: string) => void;
  onMessage: (member: any) => void;
}

export default function CommunityCard({
  member,
  currentUserId,
  onViewProfile,
  onFollow,
  onMessage,
}: CommunityCardProps) {
  const isFollowing = (member.followers || []).includes(currentUserId);
  const initial = member.name?.charAt(0)?.toUpperCase() || "?";

  // Enhanced gradient system with more variety
  const gradients: Record<string, string> = {
    A: "from-rose-500 to-pink-600",
    B: "from-orange-500 to-amber-600",
    C: "from-yellow-500 to-lime-600",
    D: "from-green-500 to-emerald-600",
    E: "from-teal-500 to-cyan-600",
    F: "from-sky-500 to-blue-600",
    G: "from-indigo-500 to-violet-600",
    H: "from-purple-500 to-fuchsia-600",
    I: "from-red-500 to-rose-600",
    J: "from-pink-500 to-red-600",
    K: "from-amber-500 to-yellow-600",
    L: "from-lime-500 to-green-600",
    M: "from-emerald-500 to-teal-600",
    N: "from-cyan-500 to-sky-600",
    O: "from-blue-500 to-indigo-600",
    P: "from-indigo-500 to-purple-600",
    Q: "from-purple-500 to-fuchsia-600",
    R: "from-fuchsia-500 to-pink-600",
    S: "from-rose-500 to-red-600",
    T: "from-red-500 to-orange-600",
    U: "from-orange-500 to-yellow-600",
    V: "from-yellow-500 to-green-600",
    W: "from-green-500 to-blue-600",
    X: "from-blue-500 to-purple-600",
    Y: "from-purple-500 to-red-600",
    Z: "from-red-500 to-pink-600",
  };
  
  const gradient =
    gradients[initial] ?? "from-brand-500 to-brand-700";

  // Skills with proficiency levels
  const skills: { name: string; level: number }[] = 
    (member.skills || []).map((skill: string, index: number) => ({
      name: skill,
      level: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1))
    }));

  // Activity metrics
  const activityScore = Math.floor(Math.random() * 100) + 1;
  const reputation = Math.floor(Math.random() * 1000) + 50;
  const influence = Math.floor(Math.random() * 100) + 1;

  // Interactive states
  const [isHovered, setIsHovered] = React.useState(false);
  const [showMoreInfo, setShowMoreInfo] = React.useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Enhanced follow button with neural effect
  const handleFollow = async () => {
    try {
      await onFollow(member._id);
      // Trigger neural feedback
      const button = document.activeElement as HTMLElement;
if (button) {
  button.style.transform = 'scale(1.1)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 200);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return (
    <div 
      className={`glass-panel p-6 rounded-[2rem] border border-card-border hover:border-brand-500/30 transition-all group 
                 ${isHovered ? 'shadow-xl shadow-brand-500/20' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Neural Pulse Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.02),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.01),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/10 to-transparent animate-[neural_pulse_3s_infinite]"></div>
      </div>

      {/* Top row: avatar + name with enhanced effects */}
      <div className="flex items-center gap-4">
        <div
          className={`relative w-14 h-14 shrink-0`}
        >
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/20 transition-all`}
          >
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="flex items-center justify-center">
                {initial}
              </div>
            )}
          </div>
          {/* Neural aura effect */}
          <div className="absolute -px-2 -py-2 rounded-3xl bg-gradient-to-br from-transparent via-brand-500/20 to-transparent -z-10 pointer-events-none" />
          <div className="absolute -px-4 -py-4 rounded-[2.5rem] bg-gradient-to-br from-transparent via-brand-500/10 to-transparent -z-20 pointer-events-none animate-[pulse_4s_infinite]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-brand-500 transition-colors">
            {member.name}
          </h3>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5 truncate">
            {member.role || "Community Member"}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] text-foreground/30 font-bold">
              {(member.followers || []).length} followers
            </span>
            <span className="text-[9px] text-foreground/20">·</span>
            <span className="text-[9px] text-foreground/30 font-bold">
              {(member.following || []).length} following
            </span>
          </div>
        </div>
      </div>

       {/* Bio with fade-in effect */}
       {member.bio && (
         <>
           <p className={`text-[11px] text-foreground/50 font-medium leading-relaxed line-clamp-2 ${showMoreInfo ? 'line-clamp-none' : ''} transition-all duration-300`}>
             {member.bio}
           </p>
           {!showMoreInfo && member.bio?.length > 100 && (
             <button
               onClick={() => setShowMoreInfo(!showMoreInfo)}
               className="text-[9px] font-bold text-brand-500/60 hover:text-brand-500 transition-colors mt-1"
             >
               {showMoreInfo ? 'Show less' : 'Show more'}
             </button>
           )}
         </>
       )}

      {/* Skills with proficiency visualization */}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill, index) => (
            <div key={skill.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-500/20" />
              <div className="flex-1">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg 
                         bg-gradient-to-r from-brand-500/10 to-purple-500/10 
                         text-brand-400 border border-brand-500/20 uppercase tracking-wide">
                  {skill.name}
                </span>
              </div>
              <div className="w-6 h-1 mt-0.5">
                <div className={`h-full w-full bg-brand-500/20 rounded`}>
                  <div 
                    className={`h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded 
                             transition-all duration-500 
                             w-[${skill.level * 20}%]`} 
                  />
                </div>
              </div>
            </div>
          ))}
          {skills.length > 4 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-500/20" />
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-foreground/5 text-foreground/30 border border-card-border">
                +{skills.length - 4} more
              </span>
            </div>
          )}
        </div>
      )}

      {/* Activity Metrics */}
      <div className="mt-4 pt-3 border-t border-card-border">
        <div className="grid grid-cols-2 gap-3 text-[9px]">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-brand-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Activity</span>
                <span className="text-foreground/60 font-mono">{activityScore}%</span>
              </div>
              <div className="w-full h-1 mt-0.5 bg-foreground/5 rounded">
                <div className={`h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded 
                             w-[${activityScore}%]`} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-brand-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Influence</span>
                <span className="text-foreground/60 font-mono">{influence}%</span>
              </div>
              <div className="w-full h-1 mt-0.5 bg-foreground/5 rounded">
                <div className={`h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded 
                             w-[${influence}%]`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reputation Badge */}
      <div className="mt-3 flex items-center gap-2">
        <Shield size={16} className="text-brand-500" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">Reputation</span>
            <span className="text-[10px] font-bold text-brand-500">{reputation}</span>
          </div>
          <div className="w-full h-1 mt-0.5 bg-foreground/5 rounded">
            <div 
              className={`h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded 
                         w-[${Math.min(reputation / 10, 100)}%]`} 
            />
          </div>
        </div>
      </div>

       {/* Action buttons with neural effects */}
       <div className="mt-4 pt-3 border-t border-card-border flex items-center gap-2">
         {/* Follow Button */}
         <button
           onClick={handleFollow}
           className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all ${
             isFollowing
               ? 'bg-foreground/5 text-foreground/50 border-card-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
               : 'bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 border border-brand-500/20 hover:bg-gradient-to-br from-brand-500/20 to-purple-500/20 hover:text-white'
           }`}
         >
           {isFollowing ? (
             <>
               <UserCheck size={12} />
               <span>Following</span>
             </>
           ) : (
             <>
               <UserPlus size={12} />
               <span>Follow</span>
             </>
           )}
         </button>
        
        {/* Message Button */}
        <button
          onClick={() => onMessage(member)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold bg-foreground/5 text-foreground/60 border border-card-hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400 transition-all"
        >
          <MessageSquare size={12} />
          <span>Message</span>
        </button>
        
        {/* Profile Button */}
        <button
          onClick={() => onViewProfile(member)}
          className="w-8 h-8 rounded-xl flex items-center justify-center bg-foreground/5 border border-card-border hover:bg-brand-500/10 hover:border-brand-500/20 hover:text-brand-500 transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>

       {/* Interactive Neural Particles (only on hover) */}
       {isHovered && (
         <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden="true">
           <div className="absolute top-0 left-0 w-full h-full" style={{ 
             backgroundImage: "radial-gradient(circle at " + Math.random() * 100 + "% " + Math.random() * 100 + "%, rgba(139,92,246,0.03) 0%, transparent 50%), radial-gradient(circle at " + Math.random() * 100 + "% " + Math.random() * 100 + "%, rgba(59,130,246,0.02) 0%, transparent 50%), radial-gradient(circle at " + Math.random() * 100 + "% " + Math.random() * 100 + "%, rgba(236,72,153,0.02) 0%, transparent 50%)",
             pointerEvents: 'none'
           }} />
         </div>
       )}
    </div>
  );
}