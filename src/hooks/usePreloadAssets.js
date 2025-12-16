import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import useAppStore from '../store/useAppStore'
import flamingoModel from '../assets/3d/flamingo.glb'
import islandModel from '../assets/3d/island.glb'

const usePreloadAssets = () => {
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress)
  const setSceneReady = useAppStore((s) => s.setSceneReady)
  const setCriticalAssetsLoaded = useAppStore((s) => s.setCriticalAssetsLoaded)
  const hasPreloaded = useRef(false)

  useEffect(() => {
    if (hasPreloaded.current) {
      setLoadingProgress(100)
      setCriticalAssetsLoaded(true)
      setSceneReady(true)
      return
    }

    let isCancelled = false

    const loadAssets = async () => {
      try {
        console.log('[Preload] Inizio caricamento...')
        setLoadingProgress(5)
        
        // Carica Flamingo
        await useGLTF.preload(flamingoModel)
        if (isCancelled) return
        
        console.log('[Preload] Flamingo loaded')
        setLoadingProgress(40)
        setCriticalAssetsLoaded(true)

        // Carica Island
        await useGLTF.preload(islandModel)
        if (isCancelled) return
        
        console.log('[Preload] Island loaded')
        setLoadingProgress(80)
        setSceneReady(true)
        
        hasPreloaded.current = true
        console.log('[Preload] Preload completo - modelli in memoria')
      } catch (error) {
        console.error('[Preload] Errore:', error)
        if (!isCancelled) {
          setLoadingProgress(80)
          setCriticalAssetsLoaded(true)
          setSceneReady(true)
          hasPreloaded.current = true
        }
      }
    }

    loadAssets()

    return () => {
      isCancelled = true
    }
  }, [setLoadingProgress, setSceneReady, setCriticalAssetsLoaded])
}

export default usePreloadAssets
