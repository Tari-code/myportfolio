"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Users, Clock, Trash2, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDirectMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/direct-messages");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to fetch DMs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conv: any) => {
    setLoadingMessages(true);
    setActiveConv(conv);
    try {
      const res = await fetch(
        `/api/admin/direct-messages?user1=${conv.user1._id}&user2=${conv.user2._id}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConv) return;
    if (!confirm("Delete this entire conversation? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/direct-messages?user1=${activeConv.user1._id}&user2=${activeConv.user2._id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setToast("Conversation deleted.");
        setTimeout(() => setToast(null), 3000);
        setActiveConv(null);
        setMessages([]);
        fetchConversations();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const totalMessages = conversations.reduce((acc, c) => acc + c.messageCount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-brand-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-2xl border border-brand-500 animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1 flex items-center gap-3">
            <MessageSquare size={28} className="text-brand-500" /> Direct Messages
          </h1>
          <p className="text-foreground/50 font-semibold text-sm">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} · {totalMessages} total messages
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-foreground/[0.03] border border-card-border">
          <Users size={16} className="text-brand-500" />
          <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest">User-to-User DM Oversight</span>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] border border-card-border overflow-hidden flex" style={{ minHeight: "600px" }}>
        {/* Conversation list */}
        <div className="w-80 shrink-0 border-r border-card-border flex flex-col bg-foreground/[0.01]">
          <div className="px-5 py-3.5 border-b border-card-border bg-foreground/[0.02]">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">All Conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-brand-500" size={28} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-foreground/30 text-xs font-semibold">
                No direct messages found between users.
              </div>
            ) : (
              conversations.map((conv, i) => {
                const isActive = activeConv &&
                  activeConv.user1._id === conv.user1._id &&
                  activeConv.user2._id === conv.user2._id;
                return (
                  <button
                    key={i}
                    onClick={() => fetchMessages(conv)}
                    className={`w-full text-left px-4 py-4 border-b border-card-border transition-all flex items-start gap-3 ${
                      isActive
                        ? "bg-brand-500/10 border-l-[3px] border-l-brand-500"
                        : "hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {conv.user1.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-xs font-bold truncate ${isActive ? "text-brand-500" : "text-foreground/80"}`}>
                          {conv.user1.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-1">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {conv.user2.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-xs font-bold truncate ${isActive ? "text-brand-500" : "text-foreground/80"}`}>
                          {conv.user2.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 pl-1">
                        <p className="text-[10px] text-foreground/40 font-medium truncate max-w-[140px]">
                          {conv.lastMessage}
                        </p>
                        <span className="text-[9px] text-foreground/30 font-bold shrink-0 ml-1">
                          {conv.messageCount} msg{conv.messageCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className="text-[9px] text-foreground/25 font-bold flex items-center gap-1 pl-1">
                        <Clock size={8} /> {formatDistanceToNow(new Date(conv.lastTime))} ago
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-foreground/20 shrink-0 mt-2" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message viewer */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeConv ? (
            <>
              <div className="px-6 py-4 border-b border-card-border bg-foreground/[0.01] flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center text-sm font-bold">
                      {activeConv.user1.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{activeConv.user1.name}</p>
                      <p className="text-[10px] text-foreground/40">{activeConv.user1.email}</p>
                    </div>
                  </div>
                  <div className="text-foreground/20 font-bold text-lg">↔</div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center text-sm font-bold">
                      {activeConv.user2.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{activeConv.user2.name}</p>
                      <p className="text-[10px] text-foreground/40">{activeConv.user2.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDeleteConversation}
                  disabled={deleting}
                  title="Delete Conversation"
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-brand-500" size={28} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-foreground/30 py-20 font-medium text-sm">
                    No messages in this conversation.
                  </div>
                ) : (
                  messages.map((msg: any, i: number) => {
                    const isUser1 = msg.sender?._id?.toString() === activeConv.user1._id?.toString() ||
                                    msg.sender?.toString() === activeConv.user1._id?.toString();
                    const senderName = isUser1 ? activeConv.user1.name : activeConv.user2.name;
                    return (
                      <div key={i} className={`flex items-end gap-2 ${isUser1 ? "justify-start" : "justify-end"}`}>
                        {isUser1 && (
                          <div className="w-7 h-7 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {senderName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className={`max-w-[65%] flex flex-col ${isUser1 ? "items-start" : "items-end"}`}>
                          <div className={`px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                            isUser1
                              ? "bg-foreground/[0.06] border border-card-border text-foreground/80 rounded-bl-sm"
                              : "bg-brand-500 text-white rounded-br-sm shadow-md shadow-brand-500/20"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-foreground/25 font-bold uppercase mt-1">
                            {senderName} · {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt)) + " ago" : "just now"}
                          </span>
                        </div>
                        {!isUser1 && (
                          <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {senderName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-6 py-3 border-t border-card-border bg-foreground/[0.01] shrink-0">
                <p className="text-[10px] font-bold text-foreground/25 uppercase tracking-wider text-center">
                  Read-only view · {activeConv.messageCount} messages · Admin oversight mode
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="opacity-25">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                <p className="text-sm font-semibold max-w-[200px] mx-auto leading-relaxed">
                  Choose a DM thread from the left to review the exchange
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
