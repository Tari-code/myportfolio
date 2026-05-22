"use client";

import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, Zap, Sparkles, Clock, CheckCircle2, Check, ArrowLeft } from "lucide-react";
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
}: DirectDMsProps) {
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

  const initials = (name?: string) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  const showList = !isMobile || (isMobile && !activeUser);
  const showChat = !isMobile || (isMobile && !!activeUser);

  return (
    <div
      className="flex rounded-[2.5rem] overflow-hidden border border-card-border bg-foreground/[0.01] shadow-2xl relative"
      style={{ minHeight: isMobile ? "calc(100dvh - 220px)" : "560px", maxHeight: isMobile ? "calc(100dvh - 220px)" : "680px" }}
    >
      {/* Conversation list */}
      {showList && (
        <div className={`${isMobile ? "w-full absolute inset-0 z-10" : "w-80 shrink-0"} flex flex-col border-r border-card-border bg-foreground/[0.02]`}>
          <div className="px-5 py-4 border-b border-card-border bg-foreground/[0.03] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-0.5">Neural Channels</span>
              <span className="text-sm font-bold text-foreground/80">{conversations.length} Active Threads</span>
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
                <p className="text-xs font-bold uppercase tracking-wider">No transmissions detected</p>
              </div>
            ) : (
              conversations.map((conv, i) => {
                const other = conv.user;
                const isActive = activeUser?._id === other?._id;
                return (
                  <button
                    key={conv._id ?? i}
                    onClick={() => setActiveUser(other)}
                    className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center gap-3 relative group active:scale-[0.98] ${
                      isActive
                        ? "bg-brand-500/10 border border-brand-500/20 shadow-lg shadow-brand-500/5"
                        : "hover:bg-foreground/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-400 ${isActive ? "ring-2 ring-brand-500/50 ring-offset-2 ring-offset-background" : ""}`}>
                        {initials(other?.name)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-sm font-bold truncate ${isActive ? "text-brand-400" : "text-foreground/80"}`}>{other?.name ?? "User"}</p>
                        {conv.lastTime && (
                          <span className="text-[9px] font-bold text-foreground/30 uppercase shrink-0 ml-1">
                            {formatDistanceToNow(new Date(conv.lastTime), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/40 font-medium truncate">{conv.lastMessage ?? "Start a conversation…"}</p>
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

      {/* Chat pane */}
      {showChat && (
        <div className={`${isMobile ? "absolute inset-0 z-20" : "flex-1"} flex flex-col overflow-hidden bg-background/80 backdrop-blur-sm`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_70%)] pointer-events-none" />

          {activeUser ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-card-border bg-foreground/[0.03] flex items-center gap-3 shrink-0 relative z-10">
                {isMobile && (
                  <button
                    onClick={() => setActiveUser(null)}
                    className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1 shrink-0"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-xl shadow-brand-500/20">
                    {initials(activeUser?.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1.5 truncate">
                    {activeUser.name}
                    <Sparkles size={11} className="text-brand-500 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
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
                  messages.map((msg, idx) => {
                    const isMe = msg.sender === "me" || msg.senderId === "me";
                    const isLast = idx === messages.length - 1;
                    return (
                      <div key={msg._id ?? idx} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-[9px] font-bold text-brand-400 shrink-0 shadow-sm mb-1">
                            {initials(activeUser?.name)}
                          </div>
                        )}
                        <div className={`max-w-[78%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed font-medium ${
                              isMe
                                ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-[1.4rem] rounded-br-md shadow-lg shadow-brand-500/10"
                                : "bg-foreground/[0.07] border border-card-border text-foreground/90 rounded-[1.4rem] rounded-bl-md"
                            }`}
                          >
                            {msg.text}
                          </div>
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
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              {/* Quick chips - hidden on mobile to save space */}
              {!isMobile && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 relative z-10">
                  {["How's the project?", "Can we schedule a call?", "Specs look great!", "Let's sync up."].map(chip => (
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
                  <div className="flex-1 bg-foreground/[0.04] border border-card-border rounded-[2rem] px-4 py-3 focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all flex items-center">
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
                    className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-lg shadow-brand-500/30"
                  >
                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="ml-0.5" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
              <div className="w-24 h-24 rounded-[3rem] bg-gradient-to-br from-brand-500/5 to-purple-500/5 flex items-center justify-center mb-6 border border-brand-500/10">
                <Zap size={40} className="text-brand-500/20 animate-pulse" />
              </div>
              <h5 className="font-bold text-xl text-foreground mb-2">Select a conversation</h5>
              <p className="text-sm font-medium text-foreground/40 max-w-[260px] leading-relaxed">
                Choose a contact from the list to start messaging.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
