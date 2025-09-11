// sw.js
const CACHE_NAME = 'png-cache-v11';
// navigator.serviceWorker.getRegistration()
//   .then(reg => reg?.update())
self.addEventListener('install', (event) => {
     event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/app.js'
      ]))
      .then(() => self.skipWaiting()) // ⚠️ 强制立即激活新版本
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(name => {
            if (name !== CACHE_NAME) {
              console.log('[SW] 删除旧缓存:', name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // ⚠️ 立即接管所有页面
  );
});
self.addEventListener('fetch', (event) => {
    if (event.request.url.match(/\.png$/) || event.request.url.match(/\.jpg$/)) { // 匹配所有的 PNG 文件
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone()); // 缓存新的 PNG 资源
                        return response;
                    });
                });
            })
        );
    }
});