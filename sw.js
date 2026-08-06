/* Kill switch — dezactiveaza orice service worker ramas inregistrat.
   Inlocuieste service worker-ul Monetag (5gvci.com, zoneId 11469533).
   Se dezinstaleaza singur la prima vizita si reincarca paginile deschise.
   Poate fi sters complet din repo dupa ~30 de zile. */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      // sterge orice cache lasat in urma
      try {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      } catch (e) {}

      // se dezinregistreaza pe sine
      try {
        await self.registration.unregister();
      } catch (e) {}

      // reincarca paginile deschise, ca sa scape de worker imediat
      try {
        var clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach(function (c) {
          if ('navigate' in c) { c.navigate(c.url); }
        });
      } catch (e) {}
    })()
  );
});

/* nu intercepteaza nimic si nu afiseaza nicio notificare */
self.addEventListener('fetch', function () {});
self.addEventListener('push', function () {});
