import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Modal visita
      hasVisited: false,
      setHasVisited: (value) => set({ hasVisited: value }),

      // Asset critici caricati (Flamingo + Island)
      criticalAssetsLoaded: false,
      setCriticalAssetsLoaded: (value) => {
        console.log('[Store] criticalAssetsLoaded:', value)
        set({ criticalAssetsLoaded: value })
      },

      // I modelli sono effettivamente renderizzati e visibili
      modelsRendered: false,
      setModelsRendered: (value) => {
        console.log('[Store] modelsRendered:', value)
        set({ modelsRendered: value })
      },

      // PostProcessing pronto (lazy load)
      // postProcessingReady: false,
      // setPostProcessingReady: (value) => {
      //   console.log('[Store] postProcessingReady:', value)
      //   set({ postProcessingReady: value })
      // },

      // Stages dell'isola
      currentStage: 2,
      setCurrentStage: (stage) => set({ currentStage: stage }),

      // Interazioni utente
      isInteracting: false,
      hasInteracted: false,
      setIsInteracting: (value) => {
        set({ isInteracting: value })
        if (value && !get().hasInteracted) {
          set({ hasInteracted: true })
        }
      },
      resetInteraction: () => set({ hasInteracted: false }),

      // Progress di caricamento
      loadingProgress: 0,
      setLoadingProgress: (progress) => {
        console.log('[Store] loadingProgress:', progress)
        set({ loadingProgress: progress })
      },

      // Extra info del modello flamingo
      flamingoInfo: null,
      setFlamingoInfo: (info) => set({ flamingoInfo: info }),

      // Reset completo della sessione
      reset: () =>
        set({
          hasVisited: false,
          criticalAssetsLoaded: false,
          modelsRendered: false,
          postProcessingReady: false,
          currentStage: 1,
          isInteracting: false,
          hasInteracted: false,
          loadingProgress: 0,
          flamingoInfo: null,
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: () => ({}),
    }
  )
)

export default useAppStore
