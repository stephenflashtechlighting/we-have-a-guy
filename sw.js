const CACHE = "whag-v1";
const ASSETS = [
  "/we-have-a-guy/",
  "/we-have-a-guy/index.html",
  "/we-have-a-guy/manifest.json",
  "/we-have-a-guy/icon-192.png",
  "/we-have-a-guy/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Always go network-first for the Apps Script API
  if (e.request.url.includes("script.google.com")) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({ error: "offline" }), { headers: { "Content-Type": "application/json" } })));
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
