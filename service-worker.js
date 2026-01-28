/* ==========================================
   Service Worker – Optimiert & Stabil
   Verbesserungen:
   1) Caches lokal öffnen (kein globales Promise)
   2) Network-First immer mit Fallback
   3) Stale-While-Revalidate mit Fehlerabsicherung
   4) Iteratives Cache-Limit (keine Rekursion)
   ========================================== */

const VERSION = "v18.5";

const HTML_CACHE   = `html-${VERSION}`;
const ASSET_CACHE  = `assets-${VERSION}`;
const IMAGE_CACHE  = `images-${VERSION}`;
const API_CACHE    = `api-${VERSION}`;

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192-V2.png",
  "./icon-512-V2.png"
];

/* ---------- INSTALL ---------- */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(HTML_CACHE).then(cache => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE ---------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![HTML_CACHE, ASSET_CACHE, IMAGE_CACHE, API_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------- FETCH ---------- */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  /* HTML → Network First */
  if (req.destination === "document") {
    event.respondWith(networkFirst(req, HTML_CACHE));
    return;
  }

  /* API → Network First mit Timeout */
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(apiNetworkFirst(req));
    return;
  }

  /* Bilder → Stale While Revalidate */
  if (req.destination === "image") {
    event.respondWith(staleWhileRevalidate(req, IMAGE_CACHE, 60));
    return;
  }

  /* Assets → Cache First */
  event.respondWith(cacheFirst(req, ASSET_CACHE));
});

/* ================= HELPERS ================= */

/* ---------- Network First (immer mit Fallback) ---------- */
async function networkFirst(req, cacheName){
  try {
    const res = await fetch(req);
    const cache = await caches.open(cacheName);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await caches.match(req);
    return cached || new Response("Offline", { status: 503 });
  }
}

/* ---------- Cache First ---------- */
async function cacheFirst(req, cacheName){
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  const cache = await caches.open(cacheName);
  cache.put(req, res.clone());
  return res;
}

/* ---------- Stale While Revalidate (robust) ---------- */
async function staleWhileRevalidate(req, cacheName, maxItems){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req)
    .then(res => {
      cache.put(req, res.clone());
      limitCache(cache, maxItems);
      return res;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/* ---------- API – Network First mit Timeout (iOS-safe) ---------- */
async function apiNetworkFirst(req){
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(req, { signal: controller.signal });
    clearTimeout(timeout);

    const cache = await caches.open(API_CACHE);
    cache.put(req, res.clone());
    return res;
  } catch {
    return caches.match(req);
  }
}

/* ---------- Cache Limit (iterativ, stabil) ---------- */
async function limitCache(cache, max){
  let keys = await cache.keys();
  while (keys.length > max){
    await cache.delete(keys[0]);
    keys = await cache.keys();
  }
}