import { useEffect } from 'react'

/**
 * Inizializza camera position e target SOLO quando controls è pronto.
 * Elimina il delay artificiale - i controls sono pronti appena montati.
 */
const useCameraInitializer = (
  controlsRef,
  ready = false,
  initialPosition = { x: 86, y: 0, z: -50 },
  target = { x: 0, y: 0, z: 0 }
) => {
  useEffect(() => {
    if (!ready || !controlsRef?.current) return

    const controls = controlsRef.current

    if (controls.object && typeof controls.target?.set === 'function') {
      controls.object.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
      controls.target.set(target.x, target.y, target.z)
      // forzi l'update per applicare damping/target
      try {
        controls.update()
      } catch (e) {
        console.warn('[CameraInitializer] controls.update() failed', e)
      }
    } else {
      // fallback: se manca la struttura attesa
      console.warn('[CameraInitializer] Unexpected controls shape:', controls)
    }
  }, [ready, controlsRef, initialPosition.x, initialPosition.y, initialPosition.z, target.x, target.y, target.z])
}

export default useCameraInitializer
