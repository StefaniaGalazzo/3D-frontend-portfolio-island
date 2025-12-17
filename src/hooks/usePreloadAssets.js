import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import useAppStore from '../store/useAppStore'
import { ProgressiveGLBLoader } from '../utils/progressiveLoader'

const ISLAND_PATH = `${import.meta.env.BASE_URL}island-compressed.glb`
const FLAMINGO_PATH = `${import.meta.env.BASE_URL}flamingo.glb`

const usePreloadAssets = () => {
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress)
  const setCriticalAssetsLoaded = useAppStore((s) => s.setCriticalAssetsLoaded)
  const hasPreloaded = useRef(false)

  useEffect(() => {
    // Cache hit: instant return
    if (hasPreloaded.current) {
      setLoadingProgress(100)
      setCriticalAssetsLoaded(true)
      return
    }

    let cancelled = false

    const preloadWithProgress = async () => {
      try {
        setLoadingProgress(5)

        // 1. Flamingo (piccolo, veloce) - SENZA progress
        const flamingoLoader = new ProgressiveGLBLoader()
        await flamingoLoader.load(FLAMINGO_PATH)
        
        if (cancelled) return
        setLoadingProgress(20)

        // 2. Island (pesante) - CON progress tracking
        const islandLoader = new ProgressiveGLBLoader((info) => {
          if (!cancelled) {
            // Map 0-100% Island → 20-90% totale
            const progressMapped = 20 + (info.percentage * 0.7)
            setLoadingProgress(Math.round(progressMapped))
          }
        })

        await islandLoader.load(ISLAND_PATH)
        
        if (cancelled) return
        setLoadingProgress(95)

        // 3. Popola cache drei per componenti Island/Flamingo
        // Questi useranno browser cache, NO doppio download
        await Promise.all([
          useGLTF.preload(FLAMINGO_PATH),
          useGLTF.preload(ISLAND_PATH)
        ])

        if (cancelled) return

        hasPreloaded.current = true
        setLoadingProgress(100)
        setCriticalAssetsLoaded(true)
        console.log('[Preload] Assets cached with real progress')
      } catch (error) {
        console.error('[Preload] Error:', error)
        if (!cancelled) {
          // Fallback: prova preload standard
          try {
            await Promise.all([
              useGLTF.preload(FLAMINGO_PATH),
              useGLTF.preload(ISLAND_PATH)
            ])
          } catch (fallbackError) {
            console.error('[Preload] Fallback also failed:', fallbackError)
          }
          
          setCriticalAssetsLoaded(true)
          hasPreloaded.current = true
          setLoadingProgress(100)
        }
      }
    }

    preloadWithProgress()

    return () => {
      cancelled = true
    }
  }, [setLoadingProgress, setCriticalAssetsLoaded])
}

export default usePreloadAssets
