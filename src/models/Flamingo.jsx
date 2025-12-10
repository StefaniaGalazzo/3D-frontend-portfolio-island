// src/models/Flamingo.jsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import flamingoModel from '../assets/3d/flamingo.glb'
import { getAllIslands, findNearestIsland } from '../constants/islandConfig'

// Preload del modello
useGLTF.preload(flamingoModel)

// utility: normalizza angoli in [-PI, PI]
function normalizeAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

/**
 * Flamingo Component (Ottimizzato)
 * - Props memoizzate
 * - Callbacks memoizzati
 * - Stato interno ottimizzato
 */
const Flamingo = React.memo(({ rotSpeedFactor = 1.0, onIslandChange, onPositionUpdate }) => {
  const rootRef = useRef(null)
  const { camera, controls } = useThree()
  const { nodes, materials, animations } = useGLTF(flamingoModel)
  const { actions } = useAnimations(animations, rootRef)

  const state = useRef({
    azimuth: 0,
    previousAzimuth: 0,
    lastControlsAz: 0,
    lastTime: 0,
    isInteracting: false,
    animPlaying: false,
    smoothedSpeed: 0,
    currentIslandId: null,
  })

  // Configurazione isole (memoizzata)
  const { islands, mainIsland, orbitRadius, orbitCenter, flightHeight } = useMemo(() => {
    const isles = getAllIslands()
    const main = isles.find((i) => i.stage === 1) || isles[0]
    const radius = main.orbitRadius || 8
    const center = main.position || { x: 0, y: 0, z: 0 }
    const height = (main.position?.y ?? 0) + 1.25

    return {
      islands: isles,
      mainIsland: main,
      orbitRadius: radius,
      orbitCenter: center,
      flightHeight: height,
    }
  }, [])

  // Setup animazione
  useEffect(() => {
    const flyAction = actions?.['flamingo_flyA_'] || Object.values(actions || {})[0]
    if (!flyAction) return

    flyAction.reset()
    flyAction.setLoop(THREE.LoopRepeat, Infinity)
    flyAction.play()
  }, [actions])

  // Listener OrbitControls
  useEffect(() => {
    if (!controls) return
    const onStart = () => (state.current.isInteracting = true)
    const onEnd = () => (state.current.isInteracting = false)

    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)

    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
    }
  }, [controls])

  // Frame loop
  useFrame((frameState, delta) => {
    if (!rootRef.current || !camera || !controls) return
    const s = state.current

    // Calcola azimuth
    const camPos = camera.position
    const relX = camPos.x - orbitCenter.x
    const relZ = camPos.z - orbitCenter.z
    let azimuth = Math.atan2(relX, relZ)
    azimuth = normalizeAngle(azimuth)

    // Direzione rotazione
    let deltaAzimuth = normalizeAngle(azimuth - s.previousAzimuth)
    s.previousAzimuth = azimuth
    s.azimuth = azimuth

    const isMovingCounterClockwise = deltaAzimuth > 0

    // Posizione flamingo
    const targetPos = new THREE.Vector3(
      orbitCenter.x + Math.sin(azimuth) * orbitRadius,
      flightHeight,
      orbitCenter.z + Math.cos(azimuth) * orbitRadius
    )

    const cur = rootRef.current.position
    const lerpFactor = 0.18
    cur.x += (targetPos.x - cur.x) * lerpFactor
    cur.y += (targetPos.y - cur.y) * lerpFactor
    cur.z += (targetPos.z - cur.z) * lerpFactor

    // Orientamento
    let targetRotationY = azimuth + Math.PI / 2
    if (!isMovingCounterClockwise && Math.abs(deltaAzimuth) > 0.001) {
      targetRotationY += Math.PI
    }

    let dRot = normalizeAngle(targetRotationY - rootRef.current.rotation.y)
    rootRef.current.rotation.y += dRot * 0.18

    // Velocità
    let controlsAz = null
    try {
      controlsAz = typeof controls.getAzimuthalAngle === 'function' ? controls.getAzimuthalAngle() : azimuth
    } catch (e) {
      controlsAz = azimuth
    }

    let deltaAng = normalizeAngle(controlsAz - (s.lastControlsAz ?? controlsAz))
    s.lastControlsAz = controlsAz

    const angularSpeed = Math.abs(deltaAng) / Math.max(delta, 1e-6)
    s.smoothedSpeed += (angularSpeed - s.smoothedSpeed) * 0.12

    // Animazione ali
    const flyAction = actions?.['flamingo_flyA_'] || Object.values(actions || {})[0]
    if (flyAction) {
      const userInteracting = s.isInteracting || s.smoothedSpeed > 0.01

      if (userInteracting) {
        if (!s.animPlaying) {
          s.animPlaying = true
          flyAction.paused = false
        }
        const mapped = THREE.MathUtils.clamp(0.8 + s.smoothedSpeed * rotSpeedFactor * 2.5, 0.8, 3.5)
        flyAction.timeScale += (mapped - flyAction.timeScale) * 0.18
      } else {
        flyAction.timeScale += (0 - flyAction.timeScale) * 0.08
        if (flyAction.timeScale < 0.02) {
          flyAction.paused = true
          flyAction.timeScale = 0
          s.animPlaying = false
        }
      }
    }

    // Trova isola più vicina
    const currentPos = new THREE.Vector3(cur.x, cur.y, cur.z)
    const nearestIsland = findNearestIsland(currentPos)

    if (nearestIsland && nearestIsland.id !== s.currentIslandId) {
      s.currentIslandId = nearestIsland.id
      if (onIslandChange) {
        onIslandChange(nearestIsland.stage)
      }
    }

    // Notifica posizione
    if (onPositionUpdate) {
      const posCopy = new THREE.Vector3(cur.x, cur.y, cur.z)
      onPositionUpdate({ position: posCopy, azimuth })
    }
  })

  return (
    <group ref={rootRef} position={[0, flightHeight, orbitCenter.z + orbitRadius]} dispose={null}>
      <group scale={0.025}>{nodes?.mesh_0 && <primitive object={nodes.mesh_0} />}</group>
    </group>
  )
})

Flamingo.displayName = 'Flamingo'

export default Flamingo
