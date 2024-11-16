// sw.js

const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'css/style.css',
  'css/bootstrap.min.css',
  'js/main.js',
  '/img/CB1.png',
  // Add more URLs as needed
];

// Install event to cache files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                console.log(`Caching ${url}`);
                return cache.put(url, response);
              })
              .catch(error => {
                console.error(`Failed to cache ${url}:`, error);
              });
          })
        );
      })
      .then(() => self.skipWaiting()) // Activate the Service Worker immediately
  );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim()) // Take control of clients immediately
  );
});

// Fetch event to serve cached files or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log(`Serving from cache: ${event.request.url}`);
          return response;
        }
        console.log(`Fetching from network: ${event.request.url}`);
        return fetch(event.request)
          .catch(error => {
            console.error('Fetch failed:', error);
            throw error;
          });
      })
  );
});
