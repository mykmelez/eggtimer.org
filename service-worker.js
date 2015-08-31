var CACHE_KEY = "cache-v3";

var urlsToCache = [
  "index.css",
  "index.html",
  "index.js",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_KEY).then(function(cache) {
      console.log("Opened cache: " + CACHE_KEY);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) {
      if (key !== CACHE_KEY) {
        console.log("Delete cache: " + key);
        return caches.delete(key);
      }
    }));
  }));
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(event.request.url + " cache " + (response ? "hit!" : "miss!"));
      return response || fetch(event.request);
    })
  );
});
