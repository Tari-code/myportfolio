"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User, CheckCircle2, Loader2, MessageSquare, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminMessages() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTickets(data);
        if (activeTicket) {
          const updated = data.find((t: any) => t._id === activeTicket._id);
          if (updated) setActiveTicket(updated);
        }
      } else {
        setTickets([]);
      }
    } catch (error) {
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?._id, activeTicket?.replies?.length]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeTicket) return;
    setSending(true);
    try {
      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", id: activeTicket._id, message: reply })
      });
      const newReply = { sender: "admin", text: reply, time: new Date().toISOString() };
      setActiveTicket({ ...activeTicket, replies: [...(activeTicket.replies || []), newReply] });
      setTickets(prev => prev.map(t =>
        t._id === activeTicket._id
          ? { ...t, replies: [...(t.replies || []), newReply], readBy: [] }
          : t
      ));
      setReply("");
    } catch (error) {
      console.error("Failed to send reply", error);
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async () => {
    if (!activeTicket) return;
    setResolving(true);
    try {
      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve", id: activeTicket._id })
      });
      setActiveTicket({ ...activeTicket, status: "resolved" });
      setTickets(prev => prev.map(t => t._id === activeTicket._id ? { ...t, status: "resolved" } : t));
    } catch (error) {
      console.error("Failed to resolve ticket", error);
    } finally {
      setResolving(false);
    }
  };

  const openCount = tickets.filter(t => t.status === "open").length;

  return (
    <div className="max-w-7xl mx-auto flex flex-col" style={{ height: "calc(100vh - 10rem)" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3 mb-1">
            <MessageSquare size={28} className="text-brand-500" />
            Messages & Support
            {openCount > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold animate-pulse shadow-lg shadow-brand-500/30">
                {openCount}
              </span>
            )}
          </h1>
          <p className="text-foreground/50 font-semibold text-sm">
            {tickets.length} threads · {openCount} open · {tickets.filter(t => t.status === "resolved").length} resolved
          </p>
        </div>
      </div>

      {/* Main chat interface */}
      <div className="flex-1 glass-panel rounded-[2rem] overflow-hidden flex border border-card-border min-h-0">
        {/* Sidebar — ticket list */}
        <div className="w-72 shrink-0 border-r border-card-border flex flex-col bg-foreground/[0.01] overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border bg-foreground/[0.02] flex items-center justify-between">
            <span className="font-bold text-foreground/40 uppercase tracking-widest text-[9px]">Conversations</span>
            <span className="text-[9px] font-bold text-foreground/30">{tickets.length} total</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-6 text-center text-foreground/30 text-xs font-semibold">No tickets yet.</div>
            ) : (
              tickets.map((ticket) => {
                const isBot = ticket.message.startsWith("[AUTOMATED");
                const replies = ticket.replies || [];
                const lastReply = replies[replies.length - 1];
                const lastMsg = lastReply ? lastReply.text : ticket.message;
                const lastTime = lastReply ? lastReply.time : ticket.time || ticket.createdAt;
                const replyCount = replies.length;
                const isActive = activeTicket?._id === ticket._id;
                return (
                  <button
                    key={ticket._id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`w-full text-left px-4 py-3.5 border-b border-card-border transition-all flex items-start gap-3 ${
                      isActive
                        ? "bg-brand-500/10 border-l-[3px] border-l-brand-500"
                        : "hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 ${
                      isBot ? "bg-purple-500/15 text-purple-400" : "bg-brand-500/15 text-brand-400"
                    }`}>
                      {isBot ? "🤖" : (ticket.user?.charAt(0)?.toUpperCase() || "U")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1 mb-0.5">
                        <span className={`text-xs truncate font-semibold ${isActive ? "text-brand-500" : "text-foreground/80"}`}>
                          {ticket.user || "Guest"}
                        </span>
                        <span className="text-[9px] text-foreground/30 font-bold shrink-0">
                          {formatDistanceToNow(new Date(lastTime))}
                        </span>
                      </div>
                      <p className="text-[11px] truncate leading-relaxed font-medium text-foreground/45">
                        {lastMsg}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {isBot ? (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">🤖 Bot Quote</span>
                        ) : (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">👤 User Support</span>
                        )}
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ticket.status === "open"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-foreground/10 text-foreground/30 border border-card-border"
                        }`}>{ticket.status}</span>
                        {replyCount > 0 && (
                          <span className="text-[8px] font-bold text-foreground/30 bg-foreground/5 px-1.5 py-0.5 rounded border border-card-border">
                            {replyCount} msg{replyCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background min-w-0">
          {activeTicket ? (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-card-border bg-foreground/[0.01] flex items-center gap-3 shrink-0">
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-sm font-bold ${
                  activeTicket.message.startsWith("[AUTOMATED") ? "bg-purple-500/15 text-purple-400" : "bg-brand-500/15 text-brand-400"
                }`}>
                  {activeTicket.message.startsWith("[AUTOMATED") ? "🤖" : (activeTicket.user?.charAt(0)?.toUpperCase() || "U")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground leading-tight">
                    {activeTicket.user || "Guest User"}
                    <span className="ml-2 text-foreground/30 font-normal text-xs">#{activeTicket._id.slice(-4)}</span>
                  </h3>
                  <p className="text-[10px] text-foreground/40 font-semibold flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTicket.status === "open" ? "bg-green-500 animate-pulse" : "bg-foreground/20"}`} />
                    {activeTicket.message.startsWith("[AUTOMATED") ? "🤖 Bot Quote" : "👤 User Support"} ·
                    {activeTicket.status === "open" ? " Active" : " Resolved"} ·
                    {" "}{(activeTicket.replies || []).length} messages
                  </p>
                </div>
                {/* Resolve — only for USER support threads, NOT bot quotes */}
                {!activeTicket.message.startsWith("[AUTOMATED") && activeTicket.status === "open" && (
                  <button
                    onClick={handleResolve}
                    disabled={resolving}
                    className="px-4 py-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {resolving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Mark Resolved
                  </button>
                )}
                {activeTicket.status === "resolved" && (
                  <span className="px-3 py-1.5 bg-foreground/5 text-foreground/30 rounded-xl text-[10px] uppercase tracking-wider font-bold border border-card-border">
                    ✓ Resolved
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-foreground/[0.005]">
                {/* Date divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-card-border" />
                  <span className="text-[9px] font-bold text-foreground/25 uppercase tracking-wider px-2">
                    {new Date(activeTicket.time || activeTicket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <div className="flex-1 h-px bg-card-border" />
                </div>

                {/* Initial message (user/left side) */}
                <div className="flex items-end gap-2">
                  <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    activeTicket.message.startsWith("[AUTOMATED") ? "bg-purple-500/15 text-purple-400" : "bg-brand-500/15 text-brand-400"
                  }`}>
                    {activeTicket.message.startsWith("[AUTOMATED") ? "🤖" : (activeTicket.user?.charAt(0)?.toUpperCase() || "U")}
                  </div>
                  <div className="max-w-[75%]">
                    <div className="bg-foreground/[0.06] border border-card-border rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-foreground/80 leading-relaxed font-semibold">
                      {activeTicket.message}
                    </div>
                    <span className="text-[9px] text-foreground/25 font-bold uppercase ml-1 mt-1 block">
                      {formatDistanceToNow(new Date(activeTicket.time || activeTicket.createdAt))} ago · {activeTicket.user || "User"}
                    </span>
                  </div>
                </div>

                {/* Reply bubbles */}
                {(activeTicket.replies || []).map((msg: any, idx: number) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div key={idx} className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                      {!isAdmin && (
                        <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          activeTicket.message.startsWith("[AUTOMATED") ? "bg-purple-500/15 text-purple-400" : "bg-brand-500/15 text-brand-400"
                        }`}>
                          {activeTicket.message.startsWith("[AUTOMATED") ? "🤖" : (activeTicket.user?.charAt(0)?.toUpperCase() || "U")}
                        </div>
                      )}
                      <div className={`max-w-[75%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                          isAdmin
                            ? "bg-brand-500 text-white rounded-br-sm shadow-md shadow-brand-500/20"
                            : "bg-foreground/[0.06] border border-card-border text-foreground/80 rounded-bl-sm"
                        }`}>
                          {msg.text}
                        </div>
                        <span className={`text-[9px] text-foreground/25 font-bold uppercase mt-1 flex items-center gap-1 ${isAdmin ? "flex-row-reverse" : ""}`}>
                          <span>{msg.time ? formatDistanceToNow(new Date(msg.time)) + " ago" : "just now"}</span>
                          <span>·</span>
                          <span>{isAdmin ? "You (Admin)" : activeTicket.user || "User"}</span>
                          {isAdmin && <CheckCircle2 size={10} className="text-brand-400 opacity-70" />}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="w-7 h-7 rounded-xl bg-brand-500/20 border border-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-500 shrink-0">A</div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-card-border bg-foreground/[0.01] shrink-0">
                {activeTicket.status === "resolved" ? (
                  <p className="text-center text-[10px] font-bold text-foreground/25 uppercase tracking-wider py-1">✓ This thread has been resolved</p>
                ) : (
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <div className="flex-1 bg-foreground/5 border border-card-border rounded-2xl px-4 py-2.5 focus-within:border-brand-500/50 transition-all">
                      <input
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Reply to this ticket..."
                        disabled={sending}
                        className="w-full bg-transparent text-xs text-foreground placeholder:text-foreground/30 focus:outline-none font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!reply.trim() || sending}
                      className="w-10 h-10 rounded-2xl bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-95 shrink-0 shadow-lg shadow-brand-500/20"
                    >
                      {sending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="opacity-25">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                <p className="text-sm font-semibold max-w-[200px] mx-auto leading-relaxed">
                  Choose a thread from the left to view and reply
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
