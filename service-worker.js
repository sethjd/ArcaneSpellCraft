self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.includes("arcane-spell-craft"))
        .map(key => caches.delete(key))
      ))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

// No fetch handler: let the browser load files normally.
