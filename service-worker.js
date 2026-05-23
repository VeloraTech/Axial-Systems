const STATIC_CACHE = "axial-static-v2";
const RUNTIME_CACHE = "axial-runtime-v2";
const LOCAL_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/script2.js",
  "/image_1_1770857077129-removebg-preview.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(LOCAL_ASSETS))
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

const isExternalAssetRequest = (request) => {
  const url = new URL(request.url);
  if (url.origin === self.location.origin) return false;

  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    return true;
  }

  return (
    url.hostname.includes("jsdelivr.net") ||
    url.hostname.includes("unpkg.com") ||
    url.hostname.includes("images.unsplash.com")
  );
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && (response.ok || response.type === "opaque")) {
    cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const req = event.request;
  const isHTMLRequest =
    req.mode === "navigate" ||
    req.destination === "document" ||
    req.headers.get("accept")?.includes("text/html");

  if (isHTMLRequest) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const copy = networkRes.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
          return networkRes;
        })
        .catch(async () => {
          const cachedPage = await caches.match(req);
          return cachedPage || caches.match("/index.html");
        }),
    );
    return;
  }

  if (isExternalAssetRequest(req)) {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE));
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((networkRes) => {
        if (
          req.destination === "script" ||
          req.destination === "style" ||
          req.destination === "image" ||
          req.destination === "font"
        ) {
          const copy = networkRes.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
        }
        return networkRes;
      });
    }),
  );
});
