import { useEffect, useCallback } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import useAppStore from '../store/useAppStore'
import flamingoModel from '../assets/3d/flamingo.glb'
import islandModel from '../assets/3d/island.glb'

const usePreloadAssets = () => {
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress)
  const setSceneReady = useAppStore((s) => s.setSceneReady)
  const setCriticalAssetsLoaded = useAppStore((s) => s.setCriticalAssetsLoaded)

  const preloadModel = useCallback(async (path) => {
    try {
      await useGLTF.preload(path)
    } catch (e) {
      console.warn('Preload failed', path, e)
    }
  }, [])

  const simulateProgress = useCallback(
    (from, to, duration = 1000) =>
      new Promise((resolve) => {
        const start = Date.now()
        const interval = setInterval(() => {
          const t = Math.min((Date.now() - start) / duration, 1)
          setLoadingProgress(Math.round(from + (to - from) * t))
          if (t >= 1) {
            clearInterval(interval)
            resolve()
          }
        }, 50)
      }),
    [setLoadingProgress]
  )

  const loadAssets = useCallback(async () => {
    // Phase 1: Flamingo
    await Promise.all([preloadModel(flamingoModel), simulateProgress(0, 40, 1500)])
    setCriticalAssetsLoaded(true)

    // Phase 2: Island
    await Promise.all([preloadModel(islandModel), simulateProgress(40, 100, 2500)])
    setSceneReady(true)
  }, [preloadModel, simulateProgress, setCriticalAssetsLoaded, setSceneReady])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])
}

export default usePreloadAssets
