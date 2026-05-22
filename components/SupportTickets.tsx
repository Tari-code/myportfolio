"use client";

import React, { useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, CheckCircle2, Shield, Plus, Zap, Clock, AlertCircle } from "lucide-react";
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
  setActiveTicket: (ticket: SupportTicket) => void;
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
  currentUserEmail
}: SupportTicketsProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?._id, activeTicket?.replies?.length]);

  const isUnread = (ticket: SupportTicket) => {
    if (!currentUserEmail) return false;
    const hasAdminReply = (ticket.replies || []).some((r: any) => r.sender === "admin");
    const userRead = (ticket.readBy || []).includes(currentUserEmail);
    return hasAdminReply && !userRead;
  };

  return (
    <div className="flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden border border-card-border bg-foreground/[0.01] shadow-2xl" style={{ height: "600px" }}>
      {/* Left: thread list */}
      <div className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-card-border flex flex-col bg-foreground/[0.02]">
         <div className="px-6 py-5 border-b border-card-border bg-foreground/[0.03] flex items-center justify-between">
           <div>
             <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-1">Priority Support</span>
             <span className="text-sm font-bold text-foreground/80">{tickets.length} Active Tickets</span>
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

         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
           {tickets.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-30">
               <Shield size={32} className="mb-3" />
               <p className="text-xs font-bold uppercase tracking-widest">Secure queue empty</p>
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
                   className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-start gap-4 relative group ${
                     isActive
                       ? "bg-brand-500/10 border border-brand-500/20 shadow-lg shadow-brand-500/5"
                       : unread 
                         ? "bg-brand-500/[0.03] border border-transparent"
                         : "hover:bg-foreground/[0.03] border border-transparent"
                   }`}
                 >
                   <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                     t.status === 'open' ? 'bg-green-500/15 text-green-500' : 'bg-foreground/10 text-foreground/40'
                   }`}>
                     {t.status === 'open' ? <Zap size={20} /> : <CheckCircle2 size={20} />}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-bold text-foreground/30 uppercase">Ticket #{t._id.slice(-4)}</span>
                        <span className="text-[8px] font-bold text-foreground/30 uppercase">{formatDistanceToNow(ticketDate)}</span>
                     </div>
                     <p className={`text-xs font-bold truncate ${isActive ? 'text-brand-400' : 'text-foreground/80'}`}>
                       {t.message}
                     </p>
                     <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          t.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-foreground/10 text-foreground/40'
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

      {/* Right: chat panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background/50 backdrop-blur-sm relative">
        {/* Neural Grid Decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {activeTicket ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-card-border bg-foreground/[0.02] flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xl ${activeTicket.status === 'open' ? 'bg-green-500 shadow-green-500/20' : 'bg-foreground/20 shadow-none'}`}>
                  <Shield size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground leading-tight">
                    Secure Support Thread
                    <span className="ml-2 text-foreground/20 font-mono text-xs">#{activeTicket._id.slice(-6)}</span>
                  </h4>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTicket.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-foreground/20'}`} />
                    {activeTicket.status === 'open' ? 'Agent Assigned • Active' : 'Thread Resolved • Archived'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                 <div className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-card-border flex items-center gap-2">
                    <Clock size={12} className="text-foreground/30" />
                    <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                       EST Response: 2h
                    </span>
                 </div>
              </div>
            </div>

            {/* Messages stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
              {/* Initial message */}
              <div className="flex flex-col items-center mb-10">
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-card-border to-transparent mb-4" />
                 <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] bg-background px-4 -mt-6">Transmission Started</span>
              </div>

           <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
             <div className="max-w-[80%] flex flex-col items-end">
               <div className="px-5 py-3.5 rounded-[1.8rem] rounded-br-none bg-gradient-to-br from-brand-600 to-brand-500 text-white text-[13px] font-medium shadow-xl shadow-brand-500/10">
                 {activeTicket.message}
               </div>
               {/* Compute date outside JSX to avoid impure function during render */}
               <span className="text-[9px] text-foreground/25 font-bold uppercase mt-2 mr-1">
                 System Entry • {formatDistanceToNow(new Date(activeTicket.createdAt || Date.now()))} ago
               </span>
             </div>
           </div>

              {/* Reply bubbles */}
              {(activeTicket.replies || []).map((msg: any, idx: number) => {
                const isUserMsg = msg.sender === "user";
                return (
                  <div key={idx} className={`flex gap-4 ${isUserMsg ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {!isUserMsg && (
                      <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 shadow-sm mt-1">
                        <Zap size={16} />
                      </div>
                    )}
                    <div className={`max-w-[75%] flex flex-col ${isUserMsg ? "items-end" : "items-start"}`}>
                      <div className={`px-5 py-3.5 rounded-[1.8rem] text-[13px] leading-relaxed font-medium transition-all ${
                        isUserMsg
                          ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-br-none shadow-xl shadow-brand-500/10"
                          : "bg-foreground/[0.06] border border-card-border text-foreground/90 rounded-bl-none backdrop-blur-md"
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-foreground/25 font-bold uppercase mt-2 px-1 flex items-center gap-1.5 ${isUserMsg ? 'flex-row-reverse' : ''}`}>
                        <span>{msg.time ? formatDistanceToNow(new Date(msg.time)) + " ago" : "just now"}</span>
                        <span>•</span>
                        <span>{isUserMsg ? "Client Data" : "Tari Support"}</span>
                        {isUserMsg && <CheckCircle2 size={10} className="text-brand-500/50" />}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="p-4 md:p-6 border-t border-card-border bg-foreground/[0.02] shrink-0 relative z-10">
              {activeTicket.status === "resolved" ? (
                <div className="flex flex-col items-center py-4 bg-foreground/5 rounded-[2rem] border border-dashed border-card-border">
                  <CheckCircle2 size={24} className="text-green-500 mb-2" />
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                    This encrypted thread has been resolved and archived.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSendReply} className="flex gap-3">
                  <div className="flex-1 bg-foreground/[0.03] border border-card-border rounded-[2rem] px-6 py-4 focus-within:border-brand-500/50 transition-all flex items-center">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Add transmission to thread..."
                      disabled={sending}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-95 shrink-0 shadow-xl shadow-brand-500/30"
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="ml-1" />}
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
             <div className="w-24 h-24 rounded-[2.5rem] bg-foreground/5 border border-dashed border-card-border flex items-center justify-center mb-6 text-foreground/20">
                <MessageSquare size={40} />
             </div>
             <h5 className="font-display font-bold text-xl text-foreground mb-2">Queue Selection Required</h5>
             <p className="text-sm font-medium text-foreground/40 max-w-[240px] mx-auto leading-relaxed">
                Pick an existing support ticket or initiate a new high-priority channel to begin.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
