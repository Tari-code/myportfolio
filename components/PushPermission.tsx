"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function PushPermission() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);
    const isDismissed = sessionStorage.getItem("push-prompt-dismissed");
    if (isDismissed) setDismissed(true);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  const handleEnable = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    setSubscribing(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") { setSubscribing(false); return; }

      const vapidRes = await fetch("/api/push/subscribe");
      const { publicKey } = await vapidRes.json();
      if (!publicKey) { setSubscribing(false); return; }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });

      setSubscribed(true);
    } catch (err) {
      console.error("Push subscribe error:", err);
    }
    setSubscribing(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("push-prompt-dismissed", "1");
  };

  if (!permission || permission === "denied" || dismissed || subscribed) return null;
  if (permission === "granted") return null;

  return (
    <div className="glass-panel flex items-center gap-4 p-4 md:p-5 rounded-[2rem] border border-brand-500/20 bg-brand-500/[0.03] mb-5 animate-in slide-in-from-top-3 duration-500">
      <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
        <Bell size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground">Enable push notifications</p>
        <p className="text-xs text-foreground/50 font-medium mt-0.5">Get real-time alerts even when the tab is closed</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEnable}
          disabled={subscribing}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-400 transition-all active:scale-95 disabled:opacity-50"
        >
          {subscribing ? "Enabling…" : "Enable"}
        </button>
        <button onClick={handleDismiss} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/40 transition-all">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
