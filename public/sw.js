self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { payload = { title: "Tari Tech", body: event.data.text() }; }

  const options = {
    body: payload.body || "You have a new notification",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.tag || "tari-notif",
    renotify: true,
    vibrate: [100, 50, 100],
    data: { url: payload.url || "/dashboard?tab=notifications" },
    actions: [{ action: "view", title: "View" }, { action: "dismiss", title: "Dismiss" }],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Tari Tech", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/dashboard?tab=notifications";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
