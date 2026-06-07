/* sw.js — 咖啡计算器 PWA service worker
   App-shell precache + runtime cache (CDN libs & fonts). Bump CACHE to invalidate. */
const CACHE = 'coffee-calc-v4';

// Local app shell (same-origin) — precache for instant offline.
const APP_SHELL = [
  './',
  'index.html',
  'shared.jsx',
  'milk-coffee.jsx',
  'iced-pourover.jsx',
  'presets.jsx',
  'app-pwa.jsx',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

// CDN dependencies — cached on install too (opaque allowed).
const VENDOR = [
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(APP_SHELL);
    // vendor + fonts: best-effort, don't fail install if offline
    await Promise.allSettled(VENDOR.map((u) => cache.add(new Request(u, { mode: 'no-cors' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

// Navigations: network-first (fresh app), fall back to cached index.html offline.
// Everything else: stale-while-revalidate.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('index.html', fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match('index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) {
        caches.open(CACHE).then((c) => c.put(req, res.clone()));
      }
      return res;
    }).catch(() => null);
    return cached || network || new Response('', { status: 504 });
  })());
});
