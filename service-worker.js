const CACHE_VERSION = "arcane-spell-craft-pwa-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/app-icon-192.png",
  "./assets/icons/app-icon-512.png",
  "./assets/icons/app-icon-maskable-192.png",
  "./assets/icons/app-icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_VERSION)
        .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Do not cache Firebase/Gstatic SDK calls or Realtime Database traffic.
  if (url.hostname.includes("firebaseio.com") ||
      url.hostname.includes("firebasedatabase.app") ||
      url.hostname.includes("gstatic.com") ||
      url.hostname.includes("googleapis.com")) {
    return;
  }

  // Network-first for the HTML shell so GitHub updates show quickly.
  if (request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Cache-first for same-origin assets, with background cache update.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
