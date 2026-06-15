"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, Loader2, Zap, Sparkles, Check, ArrowLeft, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  _id?: string;
  user?: any;
  lastMessage?: string;
  lastTime?: string;
  unread?: boolean;
}

interface DMessage {
  _id?: string;
  sender?: string;
  text?: string;
  createdAt?: string;
  senderId?: string;
  read?: boolean;
}

interface DirectDMsProps {
  conversations: Conversation[];
  activeUser: any | null;
  setActiveUser: (user: any | null) => void;
  messages: DMessage[];
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  sending: boolean;
  onSend: (e: React.FormEvent) => void;
  currentUser?: any;
}

const AVATAR_PALETTES = [
  "from-rose-500 to-pink-600",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-500",
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-sky-600",
  "from-lime-500 to-green-600",
  "from-red-500 to-rose-600",
];

function getAvatarGradient(name?: string): string {
  if (!name) return AVATAR_PALETTES[0];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function getOnlineStatus(lastSeen?: string | Date | null): { label: string; dot: string } {
  if (!lastSeen) return { label: "Offline", dot: "bg-gray-400" };
  const diff = Date.now() - new Date(lastSeen).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 3) return { label: "Online now", dot: "bg-green-500" };
  if (min < 60) return { label: `Active ${min}m ago`, dot: "bg-yellow-400" };
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return { label: `Active ${hrs}h ago`, dot: "bg-yellow-400" };
  const days = Math.floor(hrs / 24);
  if (days === 1) return { label: "Active yesterday", dot: "bg-gray-400" };
  return { label: `Active ${days}d ago`, dot: "bg-gray-400" };
}

function Avatar({
  name,
  size = "md",
  avatar,
  onClick,
}: {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  avatar?: string;
  onClick?: () => void;
}) {
  const gradient = getAvatarGradient(name);
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const sizeClasses = {
    xs: "w-6 h-6 text-[9px] rounded-lg",
    sm: "w-8 h-8 text-[10px] rounded-xl",
    md: "w-10 h-10 text-xs rounded-2xl",
    lg: "w-12 h-12 text-sm rounded-2xl",
  }[size];

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${sizeClasses} ${onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default function DirectDMs({
  conversations,
  activeUser,
  setActiveUser,
  messages,
  input,
  setInput,
  loading,
  sending,
  onSend,
  currentUser,
}: DirectDMsProps) {
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  useEffect(() => {
    if (activeUser && isMobile) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [activeUser, isMobile]);

  const showList = !isMobile || (isMobile && !activeUser);
  const showChat = !isMobile || (isMobile && !!activeUser);

  const activeStatus = getOnlineStatus(activeUser?.lastSeen);

  return (
    <div
      className="flex rounded-[2.5rem] overflow-hidden border border-card-border bg-foreground/[0.01] shadow-2xl relative backdrop-blur-xl"
      style={{ minHeight: isMobile ? "calc(100dvh - 220px)" : "560px", maxHeight: isMobile ? "calc(100dvh - 220px)" : "680px" }}
    >
      {/* ── Conversation list ── */}
      {showList && (
        <div className={`${isMobile ? "w-full absolute inset-0 z-10" : "w-80 shrink-0"} flex flex-col border-r border-card-border bg-foreground/[0.02]`}>
          <div className="px-5 py-4 border-b border-card-border bg-foreground/[0.03] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-0.5">Secure Messages</span>
              <span className="text-sm font-bold text-foreground/80">{conversations.length} Conversation{conversations.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Zap size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-40">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-3">
                  <MessageSquare size={24} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">No messages yet</p>
              </div>
            ) : (
              conversations.map((conv, i) => {
                const other = conv.user;
                const isActive = activeUser?._id === other?._id;
                const status = getOnlineStatus(other?.lastSeen);
                return (
                  <button
                    key={conv._id ?? i}
                    onClick={() => setActiveUser(other)}
                    className={`w-full text-left px-3 py-3 rounded-2xl transition-all flex items-center gap-3 relative group active:scale-[0.98] ${
                      isActive
                        ? "bg-brand-500/10 border border-brand-500/20 shadow-lg shadow-brand-500/5"
                        : "hover:bg-foreground/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar name={other?.name} avatar={other?.avatar} size="lg"
                        onClick={() => { if (other?._id) router.push(`/dashboard/profile/${other._id}`); }}
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${status.dot} rounded-full border-2 border-background`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-sm font-bold truncate ${isActive ? "text-brand-400" : "text-foreground/80"}`}>{other?.name ?? "User"}</p>
                        {conv.lastTime && (
                          <span className="text-[9px] font-bold text-foreground/30 shrink-0 ml-1">
                            {formatDistanceToNow(new Date(conv.lastTime), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-foreground/40 font-medium truncate flex-1">{conv.lastMessage ?? "Start a conversation…"}</p>
                      </div>
                    </div>
                    {conv.unread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Chat pane ── */}
      {showChat && (
        <div className={`${isMobile ? "absolute inset-0 z-20" : "flex-1"} flex flex-col overflow-hidden bg-background/50 backdrop-blur-sm relative`}
          style={{ background: "var(--background)" }}>

          {activeUser ? (
            <>
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />

              {/* Header */}
              <div className="px-4 py-3 border-b border-card-border bg-foreground/[0.02] flex items-center gap-3 shrink-0 relative z-10">
                {isMobile && (
                  <button onClick={() => setActiveUser(null)} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1 shrink-0">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="relative shrink-0">
                  <Avatar
                    name={activeUser?.name}
                    avatar={activeUser?.avatar}
                    size="md"
                    onClick={() => activeUser?._id && router.push(`/dashboard/profile/${activeUser._id}`)}
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${activeStatus.dot} rounded-full border-2 border-background`} />
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => activeUser?._id && router.push(`/dashboard/profile/${activeUser._id}`)}
                    className="font-bold text-sm text-foreground hover:text-brand-500 transition-colors leading-tight flex items-center gap-1.5"
                  >
                    {activeUser.name}
                    <Sparkles size={11} className="text-brand-500 shrink-0" />
                  </button>
                  <p className="text-[10px] text-foreground/40 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeStatus.dot} shrink-0 ${activeStatus.dot === "bg-green-500" ? "animate-pulse" : ""}`} />
                    {activeStatus.label}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-card-border to-transparent mb-3" />
                  <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] bg-background px-4 -mt-5">Conversation Started</span>
                </div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Loading…</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                    <div className="w-16 h-16 rounded-[2rem] bg-foreground/5 flex items-center justify-center mb-4 border border-dashed border-card-border">
                      <MessageSquare size={28} className="text-brand-500" />
                    </div>
                    <h5 className="font-bold text-sm">Say hello!</h5>
                    <p className="text-xs mt-1">Start the conversation.</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender === "me" || msg.senderId === "me";
                      const isLast = idx === messages.length - 1;

                      // Group consecutive same-sender messages together
                      const prevMsg = idx > 0 ? messages[idx - 1] : null;
                      const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
                      const prevIsMe = prevMsg ? (prevMsg.sender === "me" || prevMsg.senderId === "me") : null;
                      const nextIsMe = nextMsg ? (nextMsg.sender === "me" || nextMsg.senderId === "me") : null;

                      const isFirstInGroup = prevIsMe !== isMe;
                      const isLastInGroup = nextIsMe !== isMe;

                      return (
                        <div
                          key={msg._id ?? idx}
                          className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}
                        >
                          {/* Other user's avatar (left side) */}
                          {!isMe && (
                            <div className="shrink-0 mb-1">
                              {isLastInGroup ? (
                                <Avatar
                                  name={activeUser?.name}
                                  avatar={activeUser?.avatar}
                                  size="sm"
                                  onClick={() => activeUser?._id && router.push(`/dashboard/profile/${activeUser._id}`)}
                                />
                              ) : (
                                <div className="w-8" />
                              )}
                            </div>
                          )}

                          <div className={`max-w-[82%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {/* Bubble */}
                            <div
                              className={`px-4 py-3 text-sm leading-relaxed font-medium break-words ${
                                isMe
                                  ? `bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/15 ${
                                      isFirstInGroup ? "rounded-[1.4rem] rounded-br-md" : isLastInGroup ? "rounded-[1.4rem] rounded-tr-sm rounded-br-md" : "rounded-[1.4rem] rounded-r-md"
                                    }`
                                  : `bg-foreground/[0.07] border border-card-border text-foreground/90 ${
                                      isFirstInGroup ? "rounded-[1.4rem] rounded-bl-md" : isLastInGroup ? "rounded-[1.4rem] rounded-tl-sm rounded-bl-md" : "rounded-[1.4rem] rounded-l-md"
                                    }`
                              }`}
                            >
                              {msg.text}
                            </div>

                            {/* Timestamp + read receipt (only on last in group) */}
                            {isLastInGroup && (
                              <div className={`flex items-center gap-1 mt-1 px-1 text-[9px] font-semibold text-foreground/25 ${isMe ? "flex-row-reverse" : ""}`}>
                                {msg.createdAt && (
                                  <span>{formatDistanceToNow(new Date(msg.createdAt))} ago</span>
                                )}
                                {isMe && (
                                  <span className="flex items-center gap-0.5">
                                    {msg.read ? (
                                      <span className="flex text-brand-500/70">
                                        <Check size={10} className="-mr-1" />
                                        <Check size={10} />
                                      </span>
                                    ) : isLast ? (
                                      <Check size={10} className="text-foreground/30" />
                                    ) : (
                                      <span className="flex text-foreground/30">
                                        <Check size={10} className="-mr-1" />
                                        <Check size={10} />
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Current user's avatar (right side) */}
                          {isMe && (
                            <div className="shrink-0 mb-1">
                              {isLastInGroup ? (
                                <Avatar
                                  name={currentUser?.name}
                                  avatar={currentUser?.avatar}
                                  size="sm"
                                />
                              ) : (
                                <div className="w-8" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </>
                )}
              </div>

              {/* Quick chips */}
              {!isMobile && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-t border-card-border/50">
                  {["How's the project?", "Can we schedule a call?", "Looks great!", "Let's sync up."].map(chip => (
                    <button
                      key={chip}
                      onClick={() => setInput(chip)}
                      className="px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-brand-500/10 border border-card-border hover:border-brand-500/30 text-[10px] font-bold text-foreground/40 hover:text-brand-500 transition-all whitespace-nowrap active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 md:p-4 border-t border-card-border bg-foreground/[0.02] shrink-0 relative z-10">
                <form onSubmit={onSend} className="flex gap-2 items-center">
                  {currentUser && (
                    <Avatar name={currentUser?.name} avatar={currentUser?.avatar} size="sm" />
                  )}
                  <div className="flex-1 bg-foreground/[0.04] border border-card-border rounded-[2rem] px-4 py-2.5 focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${activeUser.name.split(" ")[0]}…`}
                      disabled={sending}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg shadow-brand-500/30"
                  >
                    {sending ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} className="ml-0.5" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-brand-500/5 to-purple-500/5 flex items-center justify-center mb-5 border border-brand-500/10">
                <Zap size={36} className="text-brand-500/20 animate-pulse" />
              </div>
              <h5 className="font-bold text-lg text-foreground mb-1.5">Select a conversation</h5>
              <p className="text-sm font-medium text-foreground/40 max-w-[220px] leading-relaxed">
                Choose a contact from the list to start chatting.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
