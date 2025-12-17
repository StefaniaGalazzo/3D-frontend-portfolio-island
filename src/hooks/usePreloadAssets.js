import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import useAppStore from '../store/useAppStore'

// Usa BASE_URL per supportare GitHub Pages
const FLAMINGO_PATH = `${import.meta.env.BASE_URL}flamingo.glb`
const ISLAND_PATH = `${import.meta.env.BASE_URL}island-compressed.glb`

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

    const preload = async () => {
      try {
        setLoadingProgress(10)

        // Preload entrambi i modelli in parallelo
        await Promise.all([
          useGLTF.preload(FLAMINGO_PATH),
          useGLTF.preload(ISLAND_PATH)
        ])

        if (cancelled) return

        hasPreloaded.current = true
        setLoadingProgress(100)
        setCriticalAssetsLoaded(true)
        console.log('[Preload] Assets cached and ready')
      } catch (error) {
        console.error('[Preload] Error:', error)
        if (!cancelled) {
          setCriticalAssetsLoaded(true)
          hasPreloaded.current = true
        }
      }
    }

    preload()

    return () => {
      cancelled = true
    }
  }, [setLoadingProgress, setCriticalAssetsLoaded])
}

export default usePreloadAssets
