const CACHE_NAME = "3d-druck-rechner-v1";

// Dateien, die offline verfügbar sein sollen
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Installations-Event: Dateien werden gecached
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Fetch-Event: offline aus dem Cache bedienen
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Wenn im Cache, dann zurückgeben, sonst aus Netz laden
      return response || fetch(event.request);
    })
  );
});
