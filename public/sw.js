// Service Worker ottimizzato per GLB files
const CACHE_NAME = 'glb-cache-v2'  // Bump version per force update
const GLB_FILES = [
  '/flamingo.glb',
  '/island-compressed.glb'
]

// Install: Pre-cache GLB files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching GLB files...')
      // Pre-cache in background (non-blocking)
      return cache.addAll(GLB_FILES).catch((error) => {
        console.warn('[SW] Pre-cache failed (will cache on demand):', error)
      })
    }).then(() => {
      console.log('[SW] Install complete')
      return self.skipWaiting()
    })
  )
})

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch: Cache-first strategy for GLB files
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Intercetta SOLO file GLB
  if (url.pathname.endsWith('.glb')) {
    event.respondWith(handleGLBRequest(event.request))
  }
})

async function handleGLBRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  
  // 1. Check cache FIRST
  const cached = await cache.match(request)
  if (cached) {
    console.log('[SW] ✅ Cache HIT:', request.url)
    return cached
  }
  
  console.log('[SW] ⬇️ Cache MISS, fetching:', request.url)
  
  try {
    // 2. Fetch from network
    const response = await fetch(request)
    
    if (response.ok) {
      // 3. Cache for next time
      cache.put(request, response.clone())
      console.log('[SW] 💾 Cached:', request.url)
    }
    
    return response
  } catch (error) {
    console.error('[SW] ❌ Fetch failed:', error)
    throw error
  }
}
