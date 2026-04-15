const CACHE_NAME = 'training-tracker-v5-sync';

// Install - skip waiting immediately
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

// Activate - delete ALL old caches, take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Fetch - network first, cache only as offline fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
