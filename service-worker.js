const VERSION = "v17";
const HTML_CACHE   = `html-${VERSION}`;
const ASSET_CACHE  = `assets-${VERSION}`;
const IMAGE_CACHE  = `images-${VERSION}`;
const API_CACHE    = `api-${VERSION}`;

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

const htmlCache   = caches.open(HTML_CACHE);
const assetCache  = caches.open(ASSET_CACHE);
const imageCache  = caches.open(IMAGE_CACHE);
const apiCache    = caches.open(API_CACHE);

/* INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    htmlCache.then(c => c.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k =>
          ![HTML_CACHE, ASSET_CACHE, IMAGE_CACHE, API_CACHE].includes(k)
        ).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  /* HTML → Network First */
  if (req.destination === "document") {
    event.respondWith(networkFirst(req, htmlCache));
    return;
  }

  /* API → Network First mit Timeout */
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(apiNetworkFirst(req));
    return;
  }

  /* Bilder → Stale While Revalidate */
  if (req.destination === "image") {
    event.respondWith(staleWhileRevalidate(req, imageCache, 60));
    return;
  }

  /* Assets → Cache First */
  event.respondWith(cacheFirst(req, assetCache));
});

/* ================= HELPERS ================= */

async function networkFirst(req, cachePromise) {
  try {
    const res = await fetch(req);
    cachePromise.then(c => c.put(req, res.clone()));
    return res;
  } catch {
    return caches.match(req);
  }
}

async function cacheFirst(req, cachePromise) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  cachePromise.then(c => c.put(req, res.clone()));
  return res;
}

async function staleWhileRevalidate(req, cachePromise, maxItems) {
  const cached = await caches.match(req);

  const fetchPromise = fetch(req).then(res => {
    cachePromise.then(c => {
      c.put(req, res.clone());
      limitCache(c, maxItems);
    });
    return res;
  });

  return cached || fetchPromise;
}

/* API – iOS-sicher */
async function apiNetworkFirst(req) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(req, { signal: controller.signal });
    clearTimeout(timeout);

    apiCache.then(c => c.put(req, res.clone()));
    return res;
  } catch {
    return caches.match(req);
  }
}

/* Cache Limit */
async function limitCache(cache, max) {
  const keys = await cache.keys();
  if (keys.length > max) {
    await cache.delete(keys[0]);
    limitCache(cache, max);
  }
}