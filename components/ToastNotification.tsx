"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Bell, X, ArrowRight } from "lucide-react";

interface Toast {
  id: string;
  type: "dm" | "notif";
  title: string;
  body: string;
  tab: string;
}

interface Props {
  unreadCount: number;
  notifCount: number;
  onNavigate: (tab: string) => void;
}

export default function ToastNotification({ unreadCount, notifCount, onNavigate }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevUnread = useRef(-1);
  const prevNotif = useRef(-1);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  };

  const push = (toast: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    const t = setTimeout(() => dismiss(id), 5500);
    timers.current.set(id, t);
  };

  useEffect(() => {
    if (prevUnread.current === -1) {
      prevUnread.current = unreadCount;
      prevNotif.current = notifCount;
      return;
    }
    if (unreadCount > prevUnread.current) {
      push({ type: "dm", title: "New Message", body: "You have a new unread message or ticket reply.", tab: "comms" });
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (prevNotif.current === -1) { prevNotif.current = notifCount; return; }
    if (notifCount > prevNotif.current) {
      push({ type: "notif", title: "New Notification", body: "You have a new notification.", tab: "notifications" });
    }
    prevNotif.current = notifCount;
  }, [notifCount]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          style={{ animationDelay: `${i * 50}ms` }}
          className="pointer-events-auto flex items-start gap-3 w-80 glass-panel border border-card-border rounded-2xl p-4 shadow-2xl shadow-black/40 animate-in slide-in-from-right-4 fade-in duration-300"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            toast.type === "dm"
              ? "bg-brand-500/15 text-brand-400"
              : "bg-purple-500/15 text-purple-400"
          }`}>
            {toast.type === "dm" ? <MessageSquare size={16} /> : <Bell size={16} />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground leading-tight">{toast.title}</p>
            <p className="text-[10px] text-foreground/50 font-medium mt-0.5 leading-relaxed">{toast.body}</p>
            <button
              onClick={() => { onNavigate(toast.tab); dismiss(toast.id); }}
              className="mt-2 flex items-center gap-1 text-[10px] font-bold text-brand-500 hover:text-brand-400 transition-colors"
            >
              View now <ArrowRight size={10} />
            </button>
          </div>

          <button
            onClick={() => dismiss(toast.id)}
            className="text-foreground/20 hover:text-foreground/60 transition-colors shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
