// src/hooks/usePreloadAssets.js
import { useEffect, useCallback } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import useAppStore from '../store/useAppStore'

import flamingoModel from '../assets/3d/flamingo.glb'
import islandModel from '../assets/3d/island.glb'

/**
 * PROGRESSIVE LOADING STRATEGY
 *
 * PRIORITY 1 (Critical - 0-40%): Assets essenziali per rendering iniziale
 *   - Flamingo: Elemento principale interattivo, leggero (~200KB)
 *   Goal: Mostrare scena base entro 1-2 secondi
 *
 * PRIORITY 2 (Important - 40-100%): Assets visibili ma non critici
 *   - Island: Modello pesante ma centrale (~4MB)
 *   Goal: Completare caricamento completo entro 3-5 secondi
 *
 * PRIORITY 3 (Deferred): Assets opzionali caricati in background
 *   - Altri modelli decorativi
 *   Goal: Non bloccare l'interazione utente
 */

// Priority 1: Critical assets (caricamento veloce, rendering immediato)
const CRITICAL_ASSETS = {
  models: {
    flamingo: flamingoModel, // ✅ Importato correttamente
  },
  textures: [],
}

// Priority 2: Important assets (caricamento completo prima di considerare "ready")
const IMPORTANT_ASSETS = {
  models: {
    island: islandModel, // ✅ Importato correttamente
  },
  textures: [],
}

// Priority 3: Deferred assets (caricamento in background, non bloccante)
const DEFERRED_ASSETS = {
  models: {
    // bird: import('../assets/3d/bird.glb'),
    // fox: import('../assets/3d/fox.glb'),
    // plane: import('../assets/3d/plane.glb'),
    // sky: import('../assets/3d/sky.glb'),
  },
  textures: [],
}

/**
 * Progressive Asset Loader Hook
 * Carica gli asset in 3 fasi prioritizzate per ottimizzare UX
 */
const usePreloadAssets = () => {
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
  const setSceneReady = useAppStore((state) => state.setSceneReady)
  const setCriticalAssetsLoaded = useAppStore((state) => state.setCriticalAssetsLoaded)

  /**
   * Simula progress graduale durante caricamento asset
   * Smooth UX: invece di 0 → 40 → 100, vediamo 0...10...20...30...40
   */
  const simulateSmoothProgress = useCallback(
    (startProgress, endProgress, duration) => {
      return new Promise((resolve) => {
        const startTime = Date.now()
        const deltaProgress = endProgress - startProgress

        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1) // 0 to 1
          const currentProgress = startProgress + deltaProgress * progress

          setLoadingProgress(Math.round(currentProgress))

          if (progress >= 1) {
            clearInterval(interval)
            resolve()
          }
        }, 500) // Update ogni 50ms per smooth animation
      })
    },
    [setLoadingProgress]
  )

  /**
   * Carica un singolo asset con gestione errori robusta
   */
  const loadAsset = useCallback(async (path, type = 'model') => {
    try {
      if (type === 'model') {
        await useGLTF.preload(path)
      } else if (type === 'texture') {
        await useTexture.preload(path)
      }
    } catch (err) {
      console.error('Preload failed:', path, err)
    }
  }, [])

  // const loadAsset = useCallback((path, type = 'model') => {
  //   return new Promise((resolve, reject) => {
  //     const timeout = setTimeout(() => {
  //       reject(new Error(`Timeout loading ${path}`))
  //     }, 30000) // 30s timeout (aumentato per connessioni lente)

  //     try {
  //       if (type === 'model') {
  //         useGLTF.preload(path, () => {
  //           clearTimeout(timeout)
  //           resolve()
  //         })
  //       } else if (type === 'texture') {
  //         useTexture.preload(path, () => {
  //           clearTimeout(timeout)
  //           resolve()
  //         })
  //       }
  //     } catch (error) {
  //       clearTimeout(timeout)
  //       reject(error)
  //     }
  //   })
  // }, [])

  /**
   * Fase 1: Caricamento Critical Assets
   * Obiettivo: Render iniziale veloce
   * Progress: 0% → 40% con smooth animation
   */
  const loadCriticalAssets = useCallback(async () => {
    console.log('🚀 [LOADING] Phase 1: Critical Assets Starting...')
    const startTime = performance.now()

    const criticalModels = Object.entries(CRITICAL_ASSETS.models)
    const criticalTextures = CRITICAL_ASSETS.textures
    const totalCritical = criticalModels.length + criticalTextures.length

    if (totalCritical === 0) {
      await simulateSmoothProgress(0, 40, 1500) // Smooth 0→40 in 1.5s
      setCriticalAssetsLoaded(true)
      return
    }

    try {
      // Start smooth progress animation (0→35% in 2s)
      const smoothProgressPromise = simulateSmoothProgress(0, 35, 2000)

      // Carica modelli critici in parallelo con smooth progress
      const loadPromises = criticalModels.map(async ([name, path]) => {
        try {
          console.log(`📦 Loading critical asset: ${name}...`)
          await loadAsset(path, 'model')
          console.log(`✅ Critical model loaded: ${name}`)
        } catch (error) {
          console.error(`❌ Failed to load critical model: ${name}`, error)
          // Continua comunque - graceful degradation
        }
      })

      // Attendi sia il caricamento che l'animazione smooth
      await Promise.all([...loadPromises, smoothProgressPromise])

      // Final push to 40%
      setLoadingProgress(40)

      const loadTime = ((performance.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ [LOADING] Phase 1 Complete in ${loadTime}s`)

      setCriticalAssetsLoaded(true)
    } catch (error) {
      console.error('❌ Critical assets loading failed:', error)
      setLoadingProgress(40)
      setCriticalAssetsLoaded(true) // Continua comunque
    }
  }, [loadAsset, setLoadingProgress, setCriticalAssetsLoaded, simulateSmoothProgress])

  /**
   * Fase 2: Caricamento Important Assets
   * Obiettivo: Completamento scena principale
   * Progress: 40% → 100% con smooth animation
   */
  const loadImportantAssets = useCallback(async () => {
    console.log('🚀 [LOADING] Phase 2: Important Assets Starting...')
    const startTime = performance.now()

    const importantModels = Object.entries(IMPORTANT_ASSETS.models)
    const importantTextures = IMPORTANT_ASSETS.textures
    const totalImportant = importantModels.length + importantTextures.length

    if (totalImportant === 0) {
      await simulateSmoothProgress(40, 100, 1500) // Smooth 40→100 in 1.5s
      setSceneReady(true)
      return
    }

    try {
      // Start smooth progress animation (40→95% in 3s)
      const smoothProgressPromise = simulateSmoothProgress(40, 95, 3000)

      // Carica modelli importanti in parallelo con smooth progress
      const loadPromises = importantModels.map(async ([name, path]) => {
        try {
          console.log(`📦 Loading important asset: ${name}...`)
          await loadAsset(path, 'model')
          console.log(`✅ Important model loaded: ${name}`)
        } catch (error) {
          console.error(`❌ Failed to load important model: ${name}`, error)
          // Continua comunque
        }
      })

      // Attendi sia il caricamento che l'animazione smooth
      await Promise.all([...loadPromises, smoothProgressPromise])

      // Final push to 100%
      setLoadingProgress(100)

      const loadTime = ((performance.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ [LOADING] Phase 2 Complete in ${loadTime}s`)

      setSceneReady(true)
    } catch (error) {
      console.error('❌ Important assets loading failed:', error)
      setLoadingProgress(100)
      setSceneReady(true)
    }
  }, [loadAsset, setLoadingProgress, setSceneReady, simulateSmoothProgress])

  /**
   * Fase 3: Caricamento Deferred Assets (Background)
   * Non blocca l'interazione utente
   */
  const loadDeferredAssets = useCallback(async () => {
    const deferredModels = Object.entries(DEFERRED_ASSETS.models)
    const deferredTextures = DEFERRED_ASSETS.textures
    const totalDeferred = deferredModels.length + deferredTextures.length

    if (totalDeferred === 0) return

    console.log('🚀 [LOADING] Phase 3: Deferred Assets Starting (background)...')
    const startTime = performance.now()

    try {
      // Carica in background senza bloccare
      await Promise.all([
        ...deferredModels.map(async ([name, path]) => {
          try {
            await loadAsset(path, 'model')
            console.log(`✅ Deferred model loaded: ${name}`)
          } catch (error) {
            console.warn(`⚠️ Deferred model skipped: ${name}`, error)
          }
        }),
        ...deferredTextures.map(async (path) => {
          try {
            await loadAsset(path, 'texture')
          } catch (error) {
            console.warn(`⚠️ Deferred texture skipped: ${path}`, error)
          }
        }),
      ])

      const loadTime = ((performance.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ [LOADING] Phase 3 Complete in ${loadTime}s`)
    } catch (error) {
      console.warn('⚠️ Some deferred assets failed to load:', error)
    }
  }, [loadAsset])

  /**
   * Orchestrator: Esegue loading in sequenza con priorità
   */
  const preloadAssets = useCallback(async () => {
    const totalStart = performance.now()
    console.log('🎬 [LOADING] Progressive Loading Started')

    try {
      // Fase 1: Critical (bloccante con smooth progress)
      await loadCriticalAssets()

      // Fase 2: Important (bloccante con smooth progress)
      await loadImportantAssets()

      // Fase 3: Deferred (non bloccante - fire and forget)
      loadDeferredAssets().catch((err) => console.warn('Background loading failed:', err))

      const totalTime = ((performance.now() - totalStart) / 1000).toFixed(2)
      console.log(`🎉 [LOADING] All Essential Assets Loaded in ${totalTime}s`)
    } catch (error) {
      console.error('❌ [LOADING] Critical failure:', error)
      // Fallback: Segna come pronto per non bloccare l'app
      setLoadingProgress(100)
      setSceneReady(true)
      setCriticalAssetsLoaded(true)
    }
  }, [
    loadCriticalAssets,
    loadImportantAssets,
    loadDeferredAssets,
    setLoadingProgress,
    setSceneReady,
    setCriticalAssetsLoaded,
  ])

  useEffect(() => {
    preloadAssets()
  }, [preloadAssets])
}

export default usePreloadAssets
