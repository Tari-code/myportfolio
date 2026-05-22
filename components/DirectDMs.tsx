"use client";

import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, User, Zap, Sparkles, Clock, CheckCircle2 } from "lucide-react";
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
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, isTyping]);

  // Simulate typing indicator when active user changes or new messages arrive
  useEffect(() => {
    if (activeUser && messages.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeUser, messages.length]);

  const initials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  return (
    <div className="flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden border border-card-border bg-foreground/[0.01] shadow-2xl" style={{ minHeight: "560px" }}>
      {/* Conversation list */}
      <div className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-card-border flex flex-col bg-foreground/[0.02]">
        <div className="px-6 py-5 border-b border-card-border bg-foreground/[0.03] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-1">Neural Channels</span>
            <span className="text-sm font-bold text-foreground/80">{conversations.length} Active Threads</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Zap size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
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
                  className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center gap-4 relative group ${
                    isActive
                      ? "bg-brand-500/10 border border-brand-500/20 shadow-lg shadow-brand-500/5"
                      : "hover:bg-foreground/[0.03] border border-transparent"
                  }`}
                >
                  <div className={`relative shrink-0`}>
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-400 group-hover:scale-105 transition-transform ${isActive ? 'ring-2 ring-brand-500/50 ring-offset-2 ring-offset-background' : ''}`}>
                      {initials(other?.name)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background group-hover:animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-400' : 'text-foreground/80'}`}>{other?.name ?? "User"}</p>
                      {conv.lastTime && (
                         <span className="text-[8px] font-bold text-foreground/30 uppercase">{formatDistanceToNow(new Date(conv.lastTime), { addSuffix: false })}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-foreground/40 font-semibold truncate">
                      {conv.lastMessage ?? "Initiate neural link…"}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50 animate-pulse shrink-0" />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-500 rounded-full" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat pane */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background/50 backdrop-blur-sm relative">
        {/* Neural background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_70%)] pointer-events-none" />

        {activeUser ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-card-border bg-foreground/[0.02] flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-xl shadow-brand-500/20">
                    {initials(activeUser?.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground leading-tight flex items-center gap-2">
                    {activeUser.name}
                    <Sparkles size={12} className="text-brand-500" />
                  </h4>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Neural Link Active • Online
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-card-border transition-all text-foreground/40 hover:text-foreground">
                   <Clock size={16} />
                </button>
                <button className="p-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-all text-brand-500">
                   <Zap size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Syncing Encrypted Buffer...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                  <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center mb-4 border border-dashed border-card-border">
                    <MessageSquare size={32} className="text-brand-500" />
                  </div>
                  <h5 className="font-bold text-sm text-foreground uppercase tracking-widest">Channel Standby</h5>
                  <p className="text-[10px] font-semibold mt-1">Ready for neural transmission.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender === "me" || msg.senderId === "me";
                    return (
                      <div key={msg._id ?? idx} className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-400 shrink-0 shadow-sm">
                            {initials(activeUser?.name)}
                          </div>
                        )}
                        <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-5 py-3.5 rounded-[1.8rem] text-[13px] leading-relaxed font-medium transition-all hover:scale-[1.01] ${
                              isMe
                                ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-br-none shadow-xl shadow-brand-500/10"
                                : "bg-foreground/[0.06] border border-card-border text-foreground/90 rounded-bl-none backdrop-blur-md"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1.5 mt-2 px-1 text-[9px] font-bold uppercase tracking-wider text-foreground/25 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {msg.createdAt && (
                              <span>{formatDistanceToNow(new Date(msg.createdAt))} ago</span>
                            )}
                            <span>•</span>
                            <span>{isMe ? 'Sent' : 'Received'}</span>
                            {isMe && <CheckCircle2 size={10} className="text-brand-500/50" />}
                          </div>
                        </div>
                        {isMe && (
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0 shadow-sm">
                            ME
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="flex items-center gap-3 animate-in fade-in duration-300">
                      <div className="w-8 h-8 rounded-xl bg-brand-500/5 border border-card-border flex items-center justify-center text-brand-500 shrink-0">
                         <div className="flex gap-1">
                            <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-foreground/25 uppercase tracking-widest">Neural processing...</span>
                    </div>
                  )}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar shrink-0 relative z-10">
               {["Hey! How's the project going?", "Can we schedule a call?", "Specs look great!", "Let's sync up later."].map(chip => (
                 <button 
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-4 py-2 rounded-full bg-foreground/5 hover:bg-brand-500/10 border border-card-border hover:border-brand-500/30 text-[10px] font-bold text-foreground/40 hover:text-brand-500 transition-all whitespace-nowrap active:scale-95"
                 >
                   {chip}
                 </button>
               ))}
            </div>

            {/* Input */}
            <div className="p-4 md:p-6 border-t border-card-border bg-foreground/[0.02] shrink-0 relative z-10">
              <form onSubmit={onSend} className="flex gap-3 relative">
                <div className="flex-1 bg-foreground/[0.03] border border-card-border rounded-[2rem] px-6 py-4 focus-within:border-brand-500/50 focus-within:ring-4 focus-within:ring-brand-500/5 transition-all flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Transmit message to ${activeUser.name.split(' ')[0]}…`}
                    disabled={sending}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-semibold"
                  />
                  <div className="flex items-center gap-3 ml-2 shrink-0 border-l border-card-border pl-4">
                     <button type="button" className="text-foreground/20 hover:text-brand-500 transition-colors">
                        <Sparkles size={18} />
                     </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-xl shadow-brand-500/30"
                >
                  {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="ml-1" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
            <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-brand-500/5 to-purple-500/5 flex items-center justify-center mb-8 border border-brand-500/10 shadow-inner group">
               <Zap size={48} className="text-brand-500/20 group-hover:text-brand-500/40 group-hover:scale-110 transition-all duration-700 animate-pulse" />
            </div>
            <h5 className="font-display font-bold text-2xl text-foreground mb-3 tracking-tight">Encrypted Comms Hub</h5>
            <p className="text-sm font-medium text-foreground/40 max-w-[280px] mx-auto leading-relaxed mb-8">
              Select a secure channel from the interface on the left to initiate neural message synchronization.
            </p>
            <div className="flex gap-3">
               <div className="px-4 py-2 rounded-xl bg-foreground/5 border border-card-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">End-to-End Ready</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
