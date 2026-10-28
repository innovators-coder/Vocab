/* EPS-TOPIK TRAINER service worker
 *
 * DEPLOYMENT NOTES
 * - Every path below is relative to THIS file, so the app works at a domain root
 *   (https://example.com/) or in a subfolder (http://localhost/eps/) with no edits.
 * - Keep sw.js, index.html, manifest.json and icons/ in the same folder.
 * - Bump VERSION whenever sw.js or the precache lists change. index.html itself
 *   does NOT need a bump: it is fetched network-first (see navigate()).
 *
 * WHAT IS CACHED
 * - index.html + manifest + icons (same origin).
 * - Google Fonts CSS and font files (fonts.googleapis.com / fonts.gstatic.com).
 * WHAT IS NEVER TOUCHED
 * - Any other origin (e.g. the MyMemory translation API), any non-GET request,
 *   and any same-origin URL that is not listed below. Those go straight to the network.
 */
const VERSION = 'v1';
const SHELL_CACHE = 'eps-shell-' + VERSION;   // replaced on each VERSION bump
const FONT_CACHE = 'eps-fonts-v1';            // kept across versions
const FONT_MAX_ENTRIES = 150;
const NAV_TIMEOUT_MS = 4000;                  // slow network: show cached app after this

const BASE = new URL('./', self.location.href).href;
const ENTRY = new URL('./index.html', BASE).href;
const OPTIONAL = ['./manifest.json', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon-180.png'].map(p => new URL(p, BASE).href);
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

async function okFetch(req) {
  const r = await fetch(req);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r;
}
// A redirected response cannot be used to answer a navigation, so rebuild it.
async function clean(r) {
  if (!r.redirected) return r;
  return new Response(await r.blob(), { status: r.status, statusText: r.statusText, headers: r.headers });
}
function offlinePage() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Offline</title><body style="font:16px system-ui;padding:24px;line-height:1.5">' +
    '<h1>You are offline</h1><p>The app has not been saved on this device yet. ' +
    'Connect to the internet once and open the app again.</p></body>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

self.addEventListener('install', event => {
  // No skipWaiting here: an update waits until the user chooses to apply it.
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // index.html is required; if it fails, installation fails and the old worker stays.
    await cache.put(ENTRY, await clean(await okFetch(new Request(ENTRY, { cache: 'reload' }))));
    // Icons and manifest are best-effort so one missing file cannot break offline use.
    await Promise.allSettled(OPTIONAL.map(async u => {
      await cache.put(u, await okFetch(new Request(u, { cache: 'reload' })));
    }));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(n => n.startsWith('eps-shell-') && n !== SHELL_CACHE)
      .map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.hostname)) { event.respondWith(fonts(event)); return; }
  if (url.origin !== self.location.origin) return;           // third parties: untouched

  const bare = url.origin + url.pathname;
  if (req.mode === 'navigate' && (bare === BASE || bare === ENTRY)) {
    event.respondWith(navigate(event)); return;
  }
  if (OPTIONAL.includes(bare)) { event.respondWith(asset(event, bare)); }
  // everything else (sw.js itself, other files, APIs): normal network behaviour
});

// App page: network-first so users always get the newest HTML; cached copy is the
// fallback when offline, on errors, or when the network is slower than NAV_TIMEOUT_MS.
async function navigate(event) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(ENTRY);
  const update = (async () => {
    const r = await clean(await okFetch(new Request(ENTRY, { cache: 'no-cache' })));
    await cache.put(ENTRY, r.clone());
    return r;
  })();
  update.catch(() => {});                                     // mark handled

  if (!cached) {
    try { return await update; } catch (e) { return offlinePage(); }
  }
  try {
    const fresh = await Promise.race([
      update, new Promise(res => setTimeout(() => res(null), NAV_TIMEOUT_MS))]);
    if (fresh) return fresh;
  } catch (e) { /* offline or server error: use cache */ }
  event.waitUntil(update.catch(() => {}));                    // let a slow fetch refresh the cache
  return cached;
}

// Manifest and icons: stale-while-revalidate.
async function asset(event, key) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(key);
  const net = okFetch(new Request(key, { cache: 'no-cache' }))
    .then(async r => { await cache.put(key, r.clone()); return r; });
  net.catch(() => {});
  if (cached) { event.waitUntil(net.catch(() => {})); return cached; }
  try { return await net; } catch (e) { return Response.error(); }
}

// Google Fonts: stale-while-revalidate, fetched in CORS mode so responses are not opaque.
async function fonts(event) {
  const key = event.request.url;
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(key);
  const net = okFetch(new Request(key, { mode: 'cors', credentials: 'omit' }))
    .then(async r => {
      try { await cache.put(key, r.clone()); trim(cache); } catch (e) { /* quota: ignore */ }
      return r;
    });
  net.catch(() => {});
  if (cached) { event.waitUntil(net.catch(() => {})); return cached; }
  try { return await net; } catch (e) { return Response.error(); }
}
async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - FONT_MAX_ENTRIES; i++) await cache.delete(keys[i]);
}
