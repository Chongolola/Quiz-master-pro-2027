const CACHE_NAME = 'quiz-master-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/pages/Home.tsx',
  '/src/pages/Quiz.tsx',
  '/src/pages/Minsa.tsx',
  '/src/pages/Ranking.tsx',
  '/src/pages/Shop.tsx',
  '/src/pages/About.tsx',
  '/src/pages/Profile.tsx',
  '/src/types.ts',
  '/src/lib/gemini.ts',
  '/src/hooks/useLives.ts',
  '/src/services/adService.ts'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorar requisições para a API do Gemini ou Firebase se estiver offline
  if (event.request.url.includes('googleapis') || event.request.url.includes('firebase')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "Offline" }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          // Cachear novos recursos estáticos on-the-fly
          if (event.request.method === 'GET' && !event.request.url.includes('firestore')) {
             cache.put(event.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Fallback para a página principal se for uma navegação e estiver offline
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
