const CACHE_NAME = 'inventori-cachegfhftduy';
const urlsToCache = [
  '/index.html',
  '/wellcome.html', // ✅ Diperbaiki
  '/form.html',
  '/confirm.html',
  '/assets/logo.png',
  '/assets/manifest.json',
  '/js/main.js',
  '/js/pwa.js'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error('Caching gagal:', err);
    })
  );
});

// Ambil dari cache, fallback ke jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Bersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
