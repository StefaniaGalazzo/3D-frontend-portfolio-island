import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useAppStore from '../store/useAppStore'

const ISLAND_PATH = `${import.meta.env.BASE_URL}island-compressed.glb`

export function Island({ position, rotation, scale, ...props }) {
  const group = useRef()
  const gltf = useGLTF(ISLAND_PATH)
  const { actions } = useAnimations(gltf.animations, group)
  const setModelsRendered = useAppStore((s) => s.setModelsRendered)
  const setPostProcessingReady = useAppStore((s) => s.setPostProcessingReady)
  const hasRendered = useRef(false)

  const basePosition = useRef(position)
  const baseRotation = useRef(rotation)

  // Animazione GLTF
  useEffect(() => {
    const firstAction = Object.values(actions)[0]
    if (firstAction) {
      firstAction.reset().play()
      firstAction.setLoop(THREE.LoopRepeat, Infinity)
    }
  }, [actions])

  // Segnala rendering al primo frame, attiva PostProcessing immediatamente
  useFrame(() => {
    if (!hasRendered.current && group.current) {
      hasRendered.current = true
      console.log('[Island] First frame rendered')
      setModelsRendered(true)
      
      // Attiva PostProcessing dopo un breve delay (2 frames)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPostProcessingReady(true)
        })
      })
    }

    if (!group.current) return
    const t = Date.now() * 0.001

    group.current.position.y = basePosition.current[1] + Math.sin(t * 0.3) * 0.08
    group.current.rotation.y = baseRotation.current[1] + Math.sin(t * 0.2) * 0.05
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export default React.memo(Island)
