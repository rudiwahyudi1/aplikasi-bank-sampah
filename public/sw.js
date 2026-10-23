const CACHE_NAME = "bank-sampah-v1";
const STATIC_ASSETS = [
    "/css/style.css",
    "/manifest.json",
    "/assets/img/icon/144x144.png",
    "/assets/img/icon/192x192.png",
    "/assets/img/icon/512x512.png"
];

// Install event - Pre-cache static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn("[SW] Gagal pre-cache sebagian file:", err);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first with cache fallback
self.addEventListener("fetch", (event) => {
    // Only handle GET requests and skip socket/SSE streams
    if (event.request.method !== "GET" || event.request.url.includes("/realtime/")) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If valid response, clone and update cache for static assets
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Return cached version if offline
                return caches.match(event.request);
            })
    );
});
