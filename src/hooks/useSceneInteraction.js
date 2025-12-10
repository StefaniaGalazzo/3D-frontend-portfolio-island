import { useEffect } from 'react'
import useAppStore from '../store/useAppStore'

/**
 * useSceneInteraction(controlsRef, ready)
 * - controlsRef: ref object (current = OrbitControls instance)
 * - ready: boolean set by parent when ref was attached
 */
const useSceneInteraction = (controlsRef, ready = false) => {
  const setIsInteracting = useAppStore((state) => state.setIsInteracting)

  useEffect(() => {
    if (!ready) {
      // debug utile
      // console.warn('[SceneInteraction] controls not ready yet')
      return
    }
    if (!controlsRef?.current) {
      console.warn('[SceneInteraction] controlsRef.current is falsy despite ready=true')
      return
    }

    console.log('[SceneInteraction] Hook mounted (controls ready)')
    const controls = controlsRef.current

    const handleStart = () => {
      // console.log('[SceneInteraction] start')
      setIsInteracting(true)
    }

    const handleEnd = () => {
      // console.log('[SceneInteraction] end')
      setIsInteracting(false)
    }

    // OrbitControls usa EventTarget-like API
    controls.addEventListener?.('start', handleStart)
    controls.addEventListener?.('end', handleEnd)

    return () => {
      console.log('[SceneInteraction] cleanup')
      controls.removeEventListener?.('start', handleStart)
      controls.removeEventListener?.('end', handleEnd)
    }
  }, [ready, controlsRef, setIsInteracting])
}

export default useSceneInteraction
