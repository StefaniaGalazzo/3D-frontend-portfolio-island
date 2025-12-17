import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import useAppStore from '../store/useAppStore'

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

    const preload = async () => {
      try {
        setLoadingProgress(10)

        // Preload in parallelo (SINGOLO FETCH per file)
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
          setLoadingProgress(100)
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
