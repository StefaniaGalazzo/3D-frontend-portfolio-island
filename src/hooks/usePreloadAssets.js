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
    if (hasPreloaded.current) {
      setLoadingProgress(100)
      setCriticalAssetsLoaded(true)
      return
    }

    let cancelled = false

    const preloadWithProgress = async () => {
      try {
        setLoadingProgress(5)

        // 1. Flamingo (piccolo, veloce)
        await useGLTF.preload(FLAMINGO_PATH)
        if (cancelled) return
        setLoadingProgress(30)

        // 2. Island con progress streaming
        const loader = new ProgressiveGLBLoader((info) => {
          if (!cancelled) {
            // Map 0-100% di Island → 30-90% totale
            const progressMapped = 30 + (info.percentage * 0.6)
            setLoadingProgress(Math.round(progressMapped))
          }
        })

        // Download Island con streaming
        const arrayBuffer = await loader.load(ISLAND_PATH)
        if (cancelled) return

        // Passa arrayBuffer a drei cache manualmente
        // (drei accetterà il fetch dalla cache dopo)
        await useGLTF.preload(ISLAND_PATH)
        
        if (cancelled) return

        hasPreloaded.current = true
        setLoadingProgress(100)
        setCriticalAssetsLoaded(true)
        console.log('[Preload] Assets cached with real progress')
      } catch (error) {
        console.error('[Preload] Error:', error)
        if (!cancelled) {
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
