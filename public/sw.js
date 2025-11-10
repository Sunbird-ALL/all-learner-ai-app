// Service Worker for ALL PWA
const CACHE_NAME = 'all-pwa-v1';
const RUNTIME_CACHE = 'all-pwa-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // CRITICAL: Don't intercept non-GET requests (POST, PUT, DELETE, etc.)
  // These are API calls that must go directly to the network
  // Return immediately without calling event.respondWith()
  if (request.method !== 'GET') {
    // Log for debugging (remove in production if needed)
    console.log('[SW] Skipping non-GET request:', request.method, request.url);
    return; // Let browser handle it normally - don't call event.respondWith()
  }

  // CRITICAL: Don't intercept cross-origin requests
  // All API calls to external domains must go through normally
  // Return immediately without calling event.respondWith()
  if (url.origin !== self.location.origin) {
    // Log for debugging (remove in production if needed)
    console.log('[SW] Skipping cross-origin request:', request.url);
    return; // Let browser handle it normally - don't call event.respondWith()
  }

  // Don't intercept requests with Authorization headers (API calls)
  // Return immediately without calling event.respondWith()
  if (request.headers && request.headers.get && request.headers.get('Authorization')) {
    console.log('[SW] Skipping request with Authorization header:', request.url);
    return; // Let browser handle it normally - don't call event.respondWith()
  }

  // Don't intercept API-like paths
  const isApiPath = 
    url.pathname.includes('/api/') ||
    url.pathname.includes('/content/') ||
    url.pathname.includes('/learner/') ||
    url.pathname.includes('/orchestration/') ||
    url.pathname.includes('/virtual-id') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/login') ||
    url.pathname.includes('/signin');

  if (isApiPath) {
    return; // Let browser handle it normally
  }

  // Only handle static assets (HTML, CSS, JS, images, fonts) from same origin
  const isStaticAsset = 
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  // Network-first strategy for static assets only
  if (isStaticAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch((error) => {
          // If network fails, try cache
          console.log('[Service Worker] Network failed, trying cache:', request.url);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If it's a document request and we have index.html cached, return that
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            throw error;
          });
        })
    );
  } else {
    // For everything else, don't intercept - let browser handle normally
    return;
  }
});

// Handle background sync (if needed in future)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  // Implement background sync logic here if needed
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  // Implement push notification logic here if needed
});

// Handle messages from the client (e.g., skip waiting for updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skipping waiting...');
    self.skipWaiting();
  }
});
