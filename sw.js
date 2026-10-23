// Deixa o sistema instalável e abre a tela mesmo com a internet fraca. Os dados vêm sempre do Firebase.
const V = 'ebd-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { if (r.ok) { const c = r.clone(); caches.open(V).then((ch) => ch.put(e.request, c)); } return r; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./')))
  );
});
