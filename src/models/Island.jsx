// src/models/Island.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import islandModel from '../assets/3d/island.glb'
import useAppStore from '../store/useAppStore'

export function Island({ position, rotation, scale, ...props }) {
  const group = useRef()
  const gltf = useGLTF(islandModel)
  const { actions } = useAnimations(gltf.animations, group)
  const setModelsRendered = useAppStore((s) => s.setModelsRendered)
  const setPostProcessingReady = useAppStore((s) => s.setPostProcessingReady)
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress)
  const hasRendered = useRef(false)
  const [frameCount, setFrameCount] = useState(0)

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

  // Segnala rendering avvenuto + attiva PostProcessing dopo stabilizzazione
  useFrame(() => {
    if (!hasRendered.current && group.current) {
      hasRendered.current = true
      console.log('[Island] Primo frame renderizzato')
      setLoadingProgress(100)
      setModelsRendered(true)
    }

    // Dopo 60 frames (~1 secondo a 60fps), abilita PostProcessing
    if (hasRendered.current && frameCount < 60) {
      setFrameCount((prev) => prev + 1)
      
      if (frameCount === 59) {
        console.log('[Island] Scene stabilized, enabling PostProcessing')
        setPostProcessingReady(true)
      }
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
