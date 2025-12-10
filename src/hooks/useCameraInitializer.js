import { useEffect } from 'react'

/**
 * useCameraInitializer(controlsRef, ready, initialPosition, target)
 * - esegue l'inizializzazione solo quando ready === true
 */
const useCameraInitializer = (
  controlsRef,
  ready = false,
  initialPosition = { x: 86, y: 0, z: -50 },
  target = { x: 0, y: 0, z: 0 }
) => {
  useEffect(() => {
    if (!ready) {
      // console.warn('[CameraInitializer] controls not ready yet')
      return
    }
    if (!controlsRef?.current) {
      console.warn('[CameraInitializer] controlsRef.current is falsy despite ready=true')
      return
    }

    console.log('[CameraInitializer] Initializing camera (controls ready)')
    const controls = controlsRef.current

    // protezioni: assicurati che object e target esistano
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
