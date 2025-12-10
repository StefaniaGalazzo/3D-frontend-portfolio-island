// src/models/Plumbob.jsx
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// normalize angle [-PI, PI]
function normalizeAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

/**
 * Plumbob
 * props:
 *  - position: [x,y,z]
 *  - color: css/hex
 *  - intensity: base intensity for the point light
 *  - flamingoInfo: { position: THREE.Vector3, azimuth: number }
 *  - angleThreshold: radians (quanto ampia è la "slice" della circonferenza)
 *  - isMainIsland: boolean - se true, questo plumbob è sempre attivo quando nessun altro è attivo
 *  - currentStage: number - stage corrente attivo
 *  - stage: number - stage di questo plumbob
 */
export default function Plumbob({
  position = [0, 0, 0],
  color = '#00ff88',
  intensity = 1.8,
  flamingoInfo = null,
  angleThreshold = 0.38,
  isMainIsland = false,
  currentStage = null,
  stage = null,
}) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const lightRef = useRef(null)
  const baseYRef = useRef(position[1] ?? 0)
  const scaleRef = useRef(1)

  useEffect(() => {
    baseYRef.current = position[1] ?? 0
  }, [position])

  // plumbob angle relative to scene center
  const plumbobAngle = Math.atan2(position[0], position[2])

  useFrame(() => {
    if (!groupRef.current || !meshRef.current || !lightRef.current) return
    const t = performance.now() * 0.001

    let active = false

    // Logica di attivazione:
    // 1. Se è l'isola corrente (tramite currentStage), è sempre attiva
    // 2. Altrimenti, se è l'isola principale e nessun'altra isola è attiva, attivala
    // 3. Altrimenti, verifica l'angolo con il flamingo
    
    if (currentStage === stage) {
      // Questa è l'isola corrente selezionata
      active = true
    } else if (isMainIsland && !currentStage) {
      // Isola principale di default quando nessuna isola è selezionata
      active = true
    } else if (flamingoInfo && typeof flamingoInfo.azimuth === 'number') {
      // Verifica vicinanza angolare con il flamingo
      const delta = Math.abs(normalizeAngle(plumbobAngle - flamingoInfo.azimuth))
      active = delta <= angleThreshold
    }

    // smooth scale
    const targetScale = active ? 2.45 : 1.0
    scaleRef.current += (targetScale - scaleRef.current) * 0.12
    const finalScale = scaleRef.current

    // apply scale & slight stretch on Y
    meshRef.current.scale.set(finalScale * 0.5, finalScale * 1.6, finalScale * 0.5)

    // vertical offset when active
    const targetY = active ? baseYRef.current + 0.7 : baseYRef.current
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.12

    // rotation
    meshRef.current.rotation.y = t * 0.7

    // light pulse
    const pulse = active ? Math.sin(t * 8) * 0.12 + 1.0 : Math.sin(t * 2) * 0.06 + 0.9
    lightRef.current.intensity = intensity * pulse
  })

  return (
    <group ref={groupRef} position={position}>
      <pointLight ref={lightRef} color={color} intensity={intensity} distance={12} decay={1.5} />

      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          metalness={0.25}
          roughness={0.05}
        />
      </mesh>

      {/* fake glow */}
      <mesh scale={[1.6, 1.6, 1.6]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
