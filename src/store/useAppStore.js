// src/store/useAppStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Stato della visita - NON persiste
      hasVisited: false,
      setHasVisited: (value) => set({ hasVisited: value }),

      // Stato del canvas e della scena 3D
      isSceneReady: false,
      setSceneReady: (value) => set({ isSceneReady: value }),

      // Stato dell'isola corrente
      currentStage: 2,
      setCurrentStage: (stage) => set({ currentStage: stage }),

      // Stato dell'interazione utente
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
      setLoadingProgress: (progress) => set({ loadingProgress: progress }),

      // Info del flamingo
      flamingoInfo: null,
      setFlamingoInfo: (info) => set({ flamingoInfo: info }),

      // Reset completo
      reset: () =>
        set({
          hasVisited: false,
          isSceneReady: false,
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
      // Non persistiamo NULLA - tutto si resetta al refresh
      partialize: () => ({}),
    }
  )
)

export default useAppStore
