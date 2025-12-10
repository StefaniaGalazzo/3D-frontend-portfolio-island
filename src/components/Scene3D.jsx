import React, { Suspense, useRef, useMemo, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { PostProcessing } from '../components'
import { Flamingo, Island, Plumbob } from '../models'
import { getAllIslands } from '../constants/islandConfig'
import useAppStore from '../store/useAppStore'
import useSceneInteraction from '../hooks/useSceneInteraction'
import useCameraInitializer from '../hooks/useCameraInitializer'

/**
 * Scene3D Component - Ottimizzato con Progressive Rendering
 *
 * PROGRESSIVE RENDERING STRATEGY:
 * 1. Mostra sempre Canvas + Lights + Stars (instant feedback)
 * 2. Flamingo appare appena caricato (Fase 1: 0-40%)
 * 3. Island appare quando pronta (Fase 2: 40-100%)
 * 4. Altri elementi in background
 *
 * REMOVED: <Suspense> wrapper con Loader component
 * WHY: Loader duplicava WelcomeModal, creando double loading screen
 */
const Scene3D = () => {
  // Ref per i controlli (aggiornato tramite callback)
  const controlsRef = useRef(null)
  const [controlsReady, setControlsReady] = useState(false)

  // Store globale
  const currentStage = useAppStore((state) => state.currentStage)
  const setCurrentStage = useAppStore((state) => state.setCurrentStage)
  const flamingoInfo = useAppStore((state) => state.flamingoInfo)
  const setFlamingoInfo = useAppStore((state) => state.setFlamingoInfo)
  const hasVisited = useAppStore((state) => state.hasVisited)
  const criticalAssetsLoaded = useAppStore((state) => state.criticalAssetsLoaded)
  const isSceneReady = useAppStore((state) => state.isSceneReady)

  // Custom hooks: passiamo controlsRef + ready flag
  useSceneInteraction(controlsRef, controlsReady)
  useCameraInitializer(controlsRef, controlsReady)

  // Leva controls (memoizzati)
  const { minDist, maxDist, rotSpeed } = useControls(
    'Camera',
    {
      minDist: { value: 12, min: 5, max: 80 },
      maxDist: { value: 25, min: 10, max: 200 },
      rotSpeed: { value: 0.9, min: 0.1, max: 3, step: 0.05 },
    },
    { collapsed: true }
  )

  // Isole (memoizzate)
  const islands = useMemo(() => getAllIslands(), [])

  // Handlers memoizzati
  const handleIslandChange = useCallback(
    (stage) => {
      // console.log('[Scene3D] Island changed to stage:', stage)
      setCurrentStage(stage)
    },
    [setCurrentStage]
  )

  const handleFlamingoPositionUpdate = useCallback(
    (info) => {
      setFlamingoInfo(info)
    },
    [setFlamingoInfo]
  )

  // OrbitControls props (senza makeDefault — quello lo mettiamo direttamente)
  const orbitControlsProps = useMemo(
    () => ({
      target: [0, 0, 0],
      enableDamping: true,
      dampingFactor: 0.05,
      enableZoom: true,
      enableRotate: true,
      enablePan: false,
      minDistance: minDist,
      maxDistance: maxDist,
      minPolarAngle: Math.PI / 2 - 0.1,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enabled: hasVisited, // Disabilita controlli finché non si chiude la modale
    }),
    [hasVisited, minDist, maxDist]
  )

  // Lights memoizzati
  const lights = useMemo(
    () => (
      <>
        <directionalLight position={[8, 6, 5]} intensity={1.3} color='#e89067ff' />
        <ambientLight intensity={1} color='#c04612ff' />
        <hemisphereLight skyColor='#f3ac88ff' groundColor='#6c2f17ff' intensity={0.5} />
      </>
    ),
    []
  )

  // Plumbobs memoizzati
  const plumbobs = useMemo(
    () =>
      islands.map((isle) => (
        <Plumbob
          key={isle.id}
          position={[isle.plumbobOffset.x, isle.plumbobOffset.y, isle.plumbobOffset.z]}
          color={isle.color}
          intensity={3.0}
          flamingoInfo={flamingoInfo}
          angleThreshold={0.38}
          isMainIsland={isle.stage === 1}
          currentStage={currentStage}
          stage={isle.stage}
        />
      )),
    [islands, flamingoInfo, currentStage]
  )

  // ref callback: setta both ref e ready flag
  const orbitRefCallback = (ctrl) => {
    controlsRef.current = ctrl
    setControlsReady(Boolean(ctrl))
    // debug veloce:
    // if (ctrl) {
    // console.log('[Scene3D] OrbitControls mounted (ref ok)')
    // } else {
    // console.log('[Scene3D] OrbitControls unmounted (ref null)')
    // }
  }

  return (
    <>
      <Leva collapsed hidden />

      <Canvas
        className='w-full h-screen inset-0 z-0'
        camera={{ position: [86, 0, -50], fov: 50, near: 0.1, far: 300 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}>
        {/* OrbitControls */}
        <OrbitControls ref={orbitRefCallback} makeDefault {...orbitControlsProps} />

        {/* Always visible */}
        {lights}
        <Stars radius={70} depth={50} count={1200} factor={8} saturation={0.08} speed={0.2} fade />

        {/* Progressive Rendering: Flamingo (Critical Asset - Fase 1) */}
        {criticalAssetsLoaded && (
          <Suspense fallback={null}>
            <Flamingo
              rotSpeedFactor={rotSpeed}
              onIslandChange={handleIslandChange}
              onPositionUpdate={handleFlamingoPositionUpdate}
            />
          </Suspense>
        )}

        {/* Progressive Rendering: Island + Plumbobs (Important Assets - Fase 2) */}
        {isSceneReady && (
          <Suspense fallback={null}>
            <group position={[0, -3, 0]}>
              {plumbobs}
              <Island position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
            </group>
          </Suspense>
        )}

        {/* Post-Processing Effects */}
        <PostProcessing />
      </Canvas>
    </>
  )
}

export default React.memo(Scene3D)
