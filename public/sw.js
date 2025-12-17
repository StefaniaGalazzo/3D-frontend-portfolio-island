// Service Worker per caching aggressivo GLB files
const CACHE_NAME = 'glb-cache-v1'
const GLB_FILES = [
  '/3D-frontend-portfolio-island/flamingo.glb',
  '/3D-frontend-portfolio-island/island-compressed.glb'
]

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...')
  self.skipWaiting()
})

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
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Intercetta solo file GLB
  if (url.pathname.endsWith('.glb')) {
    event.respondWith(handleGLBRequest(event.request))
  }
})

async function handleGLBRequest(request) {
  try {
    // Check cache first
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)
    
    if (cached) {
      console.log('[SW] Serving from cache:', request.url)
      return cached
    }
    
    console.log('[SW] Fetching:', request.url)
    
    // Fetch from network
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache the response
      cache.put(request, response.clone())
      console.log('[SW] Cached:', request.url)
    }
    
    return response
  } catch (error) {
    console.error('[SW] Fetch failed:', error)
    throw error
  }
}
