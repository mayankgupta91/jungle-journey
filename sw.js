const CACHE = 'jungle-journey-v2';
const ASSETS = [
  '/jungle-journey/game.html',
  '/jungle-journey/src/logic/constants.js',
  '/jungle-journey/src/logic/rules.js',
  '/jungle-journey/src/logic/board.js',
  '/jungle-journey/src/logic/game.js',
  '/jungle-journey/manifest.json',
  '/jungle-journey/icons/icon-192.png',
  '/jungle-journey/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
