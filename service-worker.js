const CACHED_FILES = [
    '/',
    '/items.json',
    '/index.html',
    '/assets/js/main.js',
    '/assets/img/pwa.png',
    '/assets/img/img1.jpg',
    '/assets/img/img2.jpg',
    '/assets/img/img3.jpg',
    '/assets/css/bootstrap.min.css'
];

const CACHE_NAME = 'pwa-cache.v1';
const DATA_CACHE_NAME = 'pwa-data.v1';

self.addEventListener('install', event => {
    console.log('Installing service worker');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching app assets');
            return cache.addAll(CACHED_FILES);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker start');
    event.waitUntil(
        // Delete all caches that doesn't match
        // cache for the current app version
        caches.keys().then(cacheKeys => {
            // Remove unecessary keys
            const oldKeys = cacheKeys
                .filter(cacheKey => cacheKey != CACHE_NAME)
                .map(cacheKey => caches.delete(cacheKey));

            return Promise.all(oldKeys);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('fetch', event);
    event.respondWith(
        // Handle each web request from our app
        caches.match(event.request).then(response => {
            // If request was cached before - return response from cache.
            // Otherwize - get data from web and put to the cache.
            return response || fetch(event.request).then(res => {
                caches.open(DATA_CACHE_NAME).then(cache => {
                    cache.put(event.request, res.clone());
                    console.log('Request cached');
                    return res;
                })
            })
        })
    );
});