// The version of this file, in milliseconds since the epoch.  We update this
// every time the file is regenerated to ensure the file is byte-different
// and will trigger an update on the client.
var VERSION = "{{VERSION}}";
var CACHE_KEY = "cache-" + VERSION;

importScripts('manifest.js');

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
