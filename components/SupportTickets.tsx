"use client";

import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, CheckCircle2, Shield, Plus, Zap, Clock, ArrowLeft, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SupportTicket {
  _id: string;
  user: string;
  email: string;
  message: string;
  status: "open" | "resolved";
  time?: string;
  createdAt?: string;
  replies: any[];
  readBy?: string[];
}

interface SupportTicketsProps {
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  setActiveTicket: (ticket: SupportTicket | null) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  sending: boolean;
  onSendReply: (e: React.FormEvent) => void;
  onNewTicket?: () => void;
  currentUserEmail?: string;
}

export default function SupportTickets({
  tickets,
  activeTicket,
  setActiveTicket,
  replyText,
  setReplyText,
  sending,
  onSendReply,
  onNewTicket,
  currentUserEmail,
}: SupportTicketsProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?._id, activeTicket?.replies?.length]);

  useEffect(() => {
    if (activeTicket && isMobile) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [activeTicket, isMobile]);

  const isUnread = (ticket: SupportTicket) => {
    if (!currentUserEmail) return false;
    const hasAdminReply = (ticket.replies || []).some((r: any) => r.sender === "admin");
    const userRead = (ticket.readBy || []).includes(currentUserEmail);
    return hasAdminReply && !userRead;
  };

  const showList = !isMobile || (isMobile && !activeTicket);
  const showChat = !isMobile || (isMobile && !!activeTicket);

  return (
    <div
      className="flex rounded-[2.5rem] overflow-hidden border border-card-border bg-foreground/[0.01] shadow-2xl relative"
      style={{ minHeight: isMobile ? "calc(100dvh - 220px)" : "600px", maxHeight: isMobile ? "calc(100dvh - 220px)" : "680px" }}
    >
      {/* Ticket list */}
      {showList && (
        <div className={`${isMobile ? "w-full absolute inset-0 z-10" : "w-80 shrink-0"} flex flex-col border-r border-card-border bg-foreground/[0.02]`}>
          <div className="px-5 py-4 border-b border-card-border bg-foreground/[0.03] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-0.5">Priority Support</span>
              <span className="text-sm font-bold text-foreground/80">{tickets.length} Tickets</span>
            </div>
            {onNewTicket && (
              <button
                onClick={onNewTicket}
                className="w-10 h-10 rounded-2xl bg-brand-500 hover:bg-brand-400 transition-all flex items-center justify-center text-white shadow-lg shadow-brand-500/20 active:scale-95"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-30">
                <Shield size={32} className="mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest">No tickets yet</p>
              </div>
            ) : (
              tickets.map((t) => {
                const isActive = activeTicket?._id === t._id;
                const unread = isUnread(t);
                const ticketDate = new Date(t.createdAt || t.time || Date.now());
                return (
                  <button
                    key={t._id}
                    onClick={() => setActiveTicket(t)}
                    className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-start gap-3 relative group active:scale-[0.98] ${
                      isActive
                        ? "bg-brand-500/10 border border-brand-500/20 shadow-lg shadow-brand-500/5"
                        : unread
                        ? "bg-brand-500/[0.03] border border-transparent"
                        : "hover:bg-foreground/[0.03] border border-transparent"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                      t.status === "open" ? "bg-green-500/15 text-green-500" : "bg-foreground/10 text-foreground/40"
                    }`}>
                      {t.status === "open" ? <Zap size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[9px] font-bold text-foreground/30 uppercase">#{t._id.slice(-4)}</span>
                        <span className="text-[9px] font-bold text-foreground/30 uppercase">{formatDistanceToNow(ticketDate)}</span>
                      </div>
                      <p className={`text-xs font-bold truncate ${isActive ? "text-brand-400" : "text-foreground/80"}`}>
                        {t.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          t.status === "open" ? "bg-green-500/10 text-green-500" : "bg-foreground/10 text-foreground/40"
                        }`}>{t.status}</span>
                        {unread && <span className="text-[8px] font-extrabold text-brand-500 animate-pulse">NEW REPLY</span>}
                      </div>
                    </div>
                    {isActive && <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-500 rounded-full" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Chat panel */}
      {showChat && (
        <div className={`${isMobile ? "absolute inset-0 z-20" : "flex-1"} flex flex-col overflow-hidden bg-background/50 backdrop-blur-sm relative`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />

          {activeTicket ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-card-border bg-foreground/[0.02] flex items-center gap-3 shrink-0 relative z-10">
                {isMobile && (
                  <button
                    onClick={() => setActiveTicket(null)}
                    className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1 shrink-0"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 ${activeTicket.status === "open" ? "bg-green-500 shadow-green-500/20" : "bg-foreground/20"}`}>
                  <Shield size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground leading-tight truncate">
                    Support Thread
                    <span className="ml-1.5 text-foreground/20 font-mono text-xs">#{activeTicket._id.slice(-6)}</span>
                  </h4>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTicket.status === "open" ? "bg-green-500 animate-pulse" : "bg-foreground/20"}`} />
                    {activeTicket.status === "open" ? "Active" : "Resolved"}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-card-border flex items-center gap-2">
                    <Clock size={11} className="text-foreground/30" />
                    <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">~2h response</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-card-border to-transparent mb-3" />
                  <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] bg-background px-4 -mt-5">Thread Started</span>
                </div>

                <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="max-w-[82%] flex flex-col items-end">
                    <div className="px-4 py-3 rounded-[1.4rem] rounded-br-md bg-gradient-to-br from-brand-600 to-brand-500 text-white text-sm font-medium shadow-lg shadow-brand-500/10">
                      {activeTicket.message}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 px-1 text-[9px] font-semibold text-foreground/25 flex-row-reverse">
                      <span>{formatDistanceToNow(new Date(activeTicket.createdAt || Date.now()))} ago</span>
                      <span className="flex text-brand-500/60">
                        <Check size={10} className="-mr-0.5" />
                        <Check size={10} />
                      </span>
                    </div>
                  </div>
                </div>

                {(activeTicket.replies || []).map((msg: any, idx: number) => {
                  const isUserMsg = msg.sender === "user";
                  const isLast = idx === (activeTicket.replies || []).length - 1;
                  return (
                    <div key={idx} className={`flex gap-3 ${isUserMsg ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
                      {!isUserMsg && (
                        <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 shadow-sm mt-1">
                          <Zap size={14} />
                        </div>
                      )}
                      <div className={`max-w-[78%] flex flex-col ${isUserMsg ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 text-sm leading-relaxed font-medium ${
                          isUserMsg
                            ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-[1.4rem] rounded-br-md shadow-lg shadow-brand-500/10"
                            : "bg-foreground/[0.06] border border-card-border text-foreground/90 rounded-[1.4rem] rounded-bl-md"
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 px-1 text-[9px] font-semibold text-foreground/25 ${isUserMsg ? "flex-row-reverse" : ""}`}>
                          <span>{msg.time ? formatDistanceToNow(new Date(msg.time)) + " ago" : "just now"}</span>
                          <span>•</span>
                          <span>{isUserMsg ? "You" : "Support"}</span>
                          {isUserMsg && (
                            <span className="flex text-brand-500/60">
                              <Check size={10} className="-mr-0.5" />
                              <Check size={10} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              <div className="p-3 md:p-4 border-t border-card-border bg-foreground/[0.02] shrink-0 relative z-10">
                {activeTicket.status === "resolved" ? (
                  <div className="flex items-center justify-center py-3 bg-foreground/5 rounded-[2rem] border border-dashed border-card-border gap-2">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Thread resolved & archived</p>
                  </div>
                ) : (
                  <form onSubmit={onSendReply} className="flex gap-2 items-center">
                    <div className="flex-1 bg-foreground/[0.04] border border-card-border rounded-[2rem] px-4 py-3 focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
                      <input
                        ref={inputRef}
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to support…"
                        disabled={sending}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || sending}
                      className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-95 shrink-0 shadow-lg shadow-brand-500/30"
                    >
                      {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="ml-0.5" />}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
              <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 border border-dashed border-card-border flex items-center justify-center mb-5 text-foreground/20">
                <MessageSquare size={36} />
              </div>
              <h5 className="font-bold text-lg text-foreground mb-2">Select a ticket</h5>
              <p className="text-sm font-medium text-foreground/40 max-w-[240px] leading-relaxed">
                Pick a support ticket from the list to view the conversation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
