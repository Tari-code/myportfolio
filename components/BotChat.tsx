"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ShieldAlert } from "lucide-react";
import gsap from "gsap";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isTicket?: boolean;
}

const DEFAULT_POS = { bottom: 24, right: 24 };

export default function BotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Welcome to Tari Tech! I'm Tari AI, your autonomous assistant. Let me know what you'd like to build today!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBotActiveByAdmin, setIsBotActiveByAdmin] = useState(true);

  // Drag state
  const [pos, setPos] = useState(DEFAULT_POS);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, bottom: DEFAULT_POS.bottom, right: DEFAULT_POS.right });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tari_guest_id");
      if (stored) return stored;
      const id = `guest_${Math.floor(Math.random() * 10000)}`;
      sessionStorage.setItem("tari_guest_id", id);
      return id;
    }
    return "guest_user";
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const seenRepliesRef = useRef(new Set<string>());

  const checkBotActiveConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const config = await res.json();
        setIsBotActiveByAdmin(config.chatbotActive ?? true);
      }
    } catch {}
  };

  useEffect(() => {
    checkBotActiveConfig();
    const configInterval = setInterval(checkBotActiveConfig, 5000);
    return () => clearInterval(configInterval);
  }, []);

  // Drag handlers
  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
    if (!hasDragged.current) return;
    const newRight = Math.max(8, Math.min(window.innerWidth - 72, dragStart.current.right - dx));
    const newBottom = Math.max(8, Math.min(window.innerHeight - 72, dragStart.current.bottom - dy));
    setPos({ right: newRight, bottom: newBottom });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  const handleToggleDragStart = (e: React.PointerEvent) => {
    hasDragged.current = false;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, bottom: pos.bottom, right: pos.right };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const handleToggleClick = () => {
    if (hasDragged.current) return; // was a drag, not a click
    toggleChat();
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      gsap.to(toggleRef.current, { scale: 0.8, opacity: 0, rotate: 45, duration: 0.25, ease: "power2.in" });
      gsap.set(chatRef.current, { display: "flex" });
      const isMobile = window.innerWidth < 768;
      gsap.fromTo(
        chatRef.current,
        { opacity: 0, y: isMobile ? 60 : 40, scale: 0.9, clipPath: "circle(0% at 90% 90%)" },
        {
          opacity: 1, y: 0, scale: 1, clipPath: "circle(150% at 90% 90%)", duration: 0.5, ease: "power3.out",
          onComplete: () => { if (chatRef.current) gsap.set(chatRef.current, { clearProps: "transform,clipPath" }); }
        }
      );
    } else {
      gsap.to(chatRef.current, {
        opacity: 0, y: 40, scale: 0.9, clipPath: "circle(0% at 90% 90%)", duration: 0.35, ease: "power3.in",
        onComplete: () => {
          setIsOpen(false);
          gsap.set(chatRef.current, { display: "none" });
          gsap.to(toggleRef.current, { scale: 1, opacity: 1, rotate: 0, duration: 0.3, ease: "back.out(1.7)" });
        }
      });
    }
  };

  useEffect(() => {
    if (chatRef.current && !isOpen) gsap.set(chatRef.current, { opacity: 0, y: 40, scale: 0.9, display: "none" });
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!document.hasFocus() || !isBotActiveByAdmin) return;
      try {
        const res = await fetch(`/api/tickets?user=${userId}`);
        const userTickets = await res.json();
        let newMessages: Message[] = [];
        for (const ticket of userTickets) {
          if (ticket.replies) {
            for (const reply of ticket.replies) {
              const replyId = `${ticket.id}_${reply.time}`;
              if (!seenRepliesRef.current.has(replyId)) {
                seenRepliesRef.current.add(replyId);
                newMessages.push({ id: replyId, sender: reply.sender === "admin" ? "bot" : "user", text: reply.text, isTicket: false });
              }
            }
          }
        }
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages]);
          if (!isOpen) {
            setIsOpen(true);
            gsap.set(toggleRef.current, { scale: 0.8, opacity: 0 });
            gsap.set(chatRef.current, { display: "flex" });
            gsap.fromTo(chatRef.current,
              { opacity: 0, y: 40, scale: 0.9, clipPath: "circle(0% at 90% 90%)" },
              { opacity: 1, y: 0, scale: 1, clipPath: "circle(150% at 90% 90%)", duration: 0.5, ease: "power3.out",
                onComplete: () => { if (chatRef.current) gsap.set(chatRef.current, { clearProps: "transform,clipPath" }); }
              }
            );
          }
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [userId, isOpen, isBotActiveByAdmin]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, userId })
      });
      const data = await res.json();
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "bot", text: data.response, isTicket: data.isTicket }]);
        setIsLoading(false);
      }, 700);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "bot", text: "Sorry, I'm having trouble connecting right now." }]);
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSend(input); };

  if (!isBotActiveByAdmin) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed z-[9999] flex flex-col items-end pointer-events-none"
      style={{ bottom: pos.bottom, right: pos.right, transition: dragging.current ? "none" : "bottom 0.1s, right 0.1s" }}
    >
      {/* Chat Panel */}
      <div
        ref={chatRef}
        className="glass-panel w-[310px] max-w-[calc(100vw-2rem)] sm:w-[20rem] sm:max-w-none h-[60vh] min-h-[380px] max-h-[500px] sm:max-h-none sm:h-[32rem] md:h-[30rem] rounded-[2rem] md:rounded-[2.5rem] flex flex-col overflow-hidden origin-bottom-right shadow-[0_30px_100px_-15px_rgba(99,102,241,0.4)] border border-white/20 bg-background/60 backdrop-blur-3xl relative pointer-events-auto"
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 pointer-events-none z-20" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none" />

        <div className="bg-foreground/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center relative z-10 w-full shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full bg-background/90 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-foreground shrink-0" />
                </div>
              </div>
              <div className="absolute -bottom-0 -right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-background rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-[15px] tracking-tight truncate pb-1 -mb-1">
                  Tari.ai
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[9px] font-black uppercase tracking-widest shrink-0">Beta</span>
              </div>
              <p className="text-[10px] text-foreground/50 font-bold tracking-[0.2em] uppercase truncate mt-0.5 flex items-center gap-1">
                Online <Sparkles size={10} className="text-yellow-400" />
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="w-9 h-9 shrink-0 rounded-full bg-foreground/5 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/10 hover:rotate-90 hover:scale-110 transition-all active:scale-90 ml-2 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={messagesContainerRef} className="flex-1 h-0 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar relative z-10 w-full">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] px-4 py-3.5 text-[13px] leading-relaxed font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
                msg.sender === "user"
                  ? "bg-foreground text-background self-end rounded-[1.5rem] rounded-br-[0.25rem] shadow-[0_5px_20px_rgba(255,255,255,0.08)]"
                  : msg.isTicket
                    ? "bg-orange-500/10 backdrop-blur-md text-orange-500 self-start rounded-[1.5rem] rounded-tl-[0.25rem] border border-orange-500/20 shadow-inner"
                    : "bg-foreground/5 backdrop-blur-md text-foreground self-start rounded-[1.5rem] rounded-tl-[0.25rem] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-foreground/5 backdrop-blur-md text-foreground/60 self-start rounded-[1.5rem] rounded-tl-[0.25rem] border border-white/10 px-4 py-3.5 text-xs flex gap-2 shadow-inner items-center font-bold animate-in fade-in">
              <Bot size={16} className="text-purple-500 animate-bounce" />
              <span className="flex gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-foreground/[0.02] relative z-10 shrink-0 backdrop-blur-xl">
          <form onSubmit={handleFormSubmit} className="flex gap-2 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-background/50 border border-white/10 rounded-full px-5 py-4 pr-14 text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/20 focus:bg-background/80 transition-all font-medium shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full text-white hover:scale-105 active:scale-90 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] disabled:opacity-40 disabled:grayscale"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Draggable Floating Toggle */}
      <button
        ref={toggleRef}
        onPointerDown={handleToggleDragStart}
        onClick={handleToggleClick}
        className={`w-16 h-16 shrink-0 bg-background/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center text-foreground shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-transform duration-200 relative group pointer-events-auto mt-4 overflow-hidden select-none cursor-grab active:cursor-grabbing ${isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"}`}
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-[2rem] [mask-image:linear-gradient(transparent,transparent,black)] opacity-50" />
        <Bot size={28} className="relative z-10 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-ping" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        {/* Drag hint */}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-30">
          <span className="w-3 h-0.5 bg-foreground/60 rounded-full" />
          <span className="w-1.5 h-0.5 bg-foreground/40 rounded-full" />
        </div>
      </button>
    </div>
  );
}
