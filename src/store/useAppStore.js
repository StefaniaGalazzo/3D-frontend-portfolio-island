// src/store/useAppStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Modal visita
      hasVisited: false,
      setHasVisited: (value) => set({ hasVisited: value }),

      // Stato principale della scena
      isSceneReady: false,
      setSceneReady: (value) => set({ isSceneReady: value }),

      // Asset critici (se vuoi usarli)
      criticalAssetsLoaded: false,
      setCriticalAssetsLoaded: (value) => set({ criticalAssetsLoaded: value }),

      // Stages dell’isola
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

      // PROGRESS REALE DI CARICAMENTO
      loadingProgress: 0,
      setLoadingProgress: (progress) => set({ loadingProgress: progress }),

      // Extra info del modello flamingo
      flamingoInfo: null,
      setFlamingoInfo: (info) => set({ flamingoInfo: info }),

      // Reset completo della sessione (modal + scena)
      reset: () =>
        set({
          hasVisited: false,
          isSceneReady: false,
          criticalAssetsLoaded: false,
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
      // Non persistiamo nulla (sessione effimera)
      partialize: () => ({}),
    }
  )
)

export default useAppStore
