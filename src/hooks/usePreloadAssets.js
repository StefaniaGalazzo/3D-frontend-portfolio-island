// src/hooks/usePreloadAssets.js
import { useEffect, useCallback } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import useAppStore from '../store/useAppStore'

// Paths dei modelli 3D
const MODEL_PATHS = {
  flamingo: '/src/assets/3d/flamingo.glb',
  island: '/src/assets/3d/island.glb',
  bird: '/src/assets/3d/bird.glb',
  fox: '/src/assets/3d/fox.glb',
  plane: '/src/assets/3d/plane.glb',
  sky: '/src/assets/3d/sky.glb',
}

// Paths delle texture (se presenti)
const TEXTURE_PATHS = []

/**
 * Custom Hook per preload di tutti gli asset
 * Carica tutti i modelli 3D e le texture all'avvio
 */
const usePreloadAssets = () => {
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
  const setSceneReady = useAppStore((state) => state.setSceneReady)

  const preloadAssets = useCallback(async () => {
    const totalAssets = Object.keys(MODEL_PATHS).length + TEXTURE_PATHS.length
    let loadedCount = 0

    const updateProgress = () => {
      loadedCount++
      const progress = (loadedCount / totalAssets) * 100
      setLoadingProgress(progress)
    }

    try {
      // Preload modelli 3D
      const modelPromises = Object.values(MODEL_PATHS).map((path) => {
        return new Promise((resolve) => {
          useGLTF.preload(path, () => {
            updateProgress()
            resolve()
          })
        })
      })

      // Preload texture (se presenti)
      const texturePromises = TEXTURE_PATHS.map((path) => {
        return new Promise((resolve) => {
          useTexture.preload(path, () => {
            updateProgress()
            resolve()
          })
        })
      })

      // Attendi tutti i preload
      await Promise.all([...modelPromises, ...texturePromises])

      // Scena pronta
      setLoadingProgress(100)
      setSceneReady(true)
    } catch (error) {
      console.error('Errore durante il preload degli asset:', error)
      // Anche in caso di errore, segna come pronta per non bloccare l'app
      setLoadingProgress(100)
      setSceneReady(true)
    }
  }, [setLoadingProgress, setSceneReady])

  useEffect(() => {
    preloadAssets()
  }, [preloadAssets])
}

export default usePreloadAssets
