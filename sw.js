/* sw.js */
const CACHE_NAME = 'in-between-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/template.html',
  '/style.css',
  '/manifest.json'
];

// Install the Service Worker and Cache Files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Serve Cached Files when Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
