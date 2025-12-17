/**
 * Progressive GLB Loader
 * Scarica il modello in chunks per feedback visivo e start più rapido
 */

export class ProgressiveGLBLoader {
  constructor(onProgress) {
    this.onProgress = onProgress
  }

  async load(url) {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      if (!response.body || !total) {
        // Fallback: no streaming support
        const blob = await response.blob()
        if (this.onProgress) {
          this.onProgress({ loaded: total, total, percentage: 100 })
        }
        return await blob.arrayBuffer()
      }

      // Stream response con progress
      const reader = response.body.getReader()
      const chunks = []
      let loaded = 0

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        chunks.push(value)
        loaded += value.length

        if (this.onProgress) {
          this.onProgress({
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100)
          })
        }
      }

      // Combine chunks
      const allChunks = new Uint8Array(loaded)
      let position = 0
      for (const chunk of chunks) {
        allChunks.set(chunk, position)
        position += chunk.length
      }

      return allChunks.buffer
    } catch (error) {
      console.error('[ProgressiveLoader] Error:', error)
      throw error
    }
  }
}

/**
 * Hook React per progressive loading
 */
import { useState, useEffect, useRef } from 'react'

export function useProgressiveGLB(url) {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const dataRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const loader = new ProgressiveGLBLoader((info) => {
          if (!cancelled) {
            setProgress(info.percentage)
          }
        })

        const arrayBuffer = await loader.load(url)
        
        if (!cancelled) {
          dataRef.current = arrayBuffer
          setLoaded(true)
          setProgress(100)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [url])

  return { progress, loaded, error, data: dataRef.current }
}
