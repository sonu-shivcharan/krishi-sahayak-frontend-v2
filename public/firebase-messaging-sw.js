// public/firebase-messaging-sw.js

self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.notification) {
        event.stopImmediatePropagation(); // Prevent Firebase from handling it
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: "/vite.svg", // Add the icon on the client side
          data: payload.data || {},
        };
        event.waitUntil(
          self.registration.showNotification(
            notificationTitle,
            notificationOptions,
          ),
        );
      }
    } catch (err) {
      console.error("[SW] Error parsing push event data", err);
    }
  }
});

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDY6b47rPlqjcXVOMHfM3fI-XMwTzJAqzo",
  authDomain: "krishi-sahayak-v2.firebaseapp.com",
  projectId: "krishi-sahayak-v2",
  storageBucket: "krishi-sahayak-v2.firebasestorage.app",
  messagingSenderId: "732367701178",
  appId: "1:732367701178:web:aaa20bc19e94dc60c3ee83",
  measurementId: "G-7E5V2YYJZ9",
};
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const urlToOpen = e.notification.data?.url || "/";
  e.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
