// Bump VERSION whenever you upload new files so old caches get cleaned up.
const VERSION = 'eps-trainer-v12';
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'css/style.css', 'css/patches.css',
  'js/boot.js', 'js/app.js', 'js/sheet-nav.js', 'js/continue-lesson.js', 'js/sentences.js',
  'js/desktop-nav.js', 'js/paper-bg.js', 'js/vocab.js', 'js/skill-test.js', 'js/pwa.js',
  'data/hangul.js', 'data/words.js', 'data/lessons.js', 'data/sentences.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Stale-while-revalidate: open instantly from cache (works offline), refresh in the background.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ok = u.origin === location.origin || /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);
  if (!ok) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (r.mode === 'navigate' ? c.match('index.html') : Response.error());
  }));
});
