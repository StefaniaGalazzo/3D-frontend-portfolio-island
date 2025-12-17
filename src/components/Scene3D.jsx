import React, { Suspense, useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { PostProcessing, PlumbobLabel } from '../components'
import { Flamingo, Island, Plumbob } from '../models'
import { getAllIslands } from '../constants/islandConfig'
import useAppStore from '../store/useAppStore'
import useSceneInteraction from '../hooks/useSceneInteraction'
import useCameraInitializer from '../hooks/useCameraInitializer'
import GradientBackground from './GradientBackground'
import { logDeviceInfo } from '../utils/deviceDetection'

const Scene3D = () => {
  const controlsRef = useRef(null)
  const [controlsReady, setControlsReady] = useState(false)
  const [qualityConfig, setQualityConfig] = useState(null)

  const currentStage = useAppStore((state) => state.currentStage)
  const setCurrentStage = useAppStore((state) => state.setCurrentStage)
  const flamingoInfo = useAppStore((state) => state.flamingoInfo)
  const setFlamingoInfo = useAppStore((state) => state.setFlamingoInfo)
  const hasVisited = useAppStore((state) => state.hasVisited)
  const criticalAssetsLoaded = useAppStore((state) => state.criticalAssetsLoaded)
  const postProcessingReady = useAppStore((state) => state.postProcessingReady)

  // Detect device
  useEffect(() => {
    const config = logDeviceInfo()
    setQualityConfig(config)
  }, [])

  useSceneInteraction(controlsRef, controlsReady)
  useCameraInitializer(controlsRef, controlsReady)

  const { minDist, maxDist, rotSpeed } = useControls(
    'Camera',
    {
      minDist: { value: 12, min: 5, max: 80 },
      maxDist: { value: 25, min: 10, max: 200 },
      rotSpeed: { value: 0.9, min: 0.1, max: 3, step: 0.05 },
    },
    { collapsed: true }
  )

  const islands = useMemo(() => getAllIslands(), [])

  const handleIslandChange = useCallback(
    (stage) => {
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
      enabled: hasVisited,
    }),
    [hasVisited, minDist, maxDist]
  )

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

  const plumbobLabels = useMemo(
    () =>
      islands.map((isle) => (
        <PlumbobLabel
          key={`label-${isle.id}`}
          position={[isle.plumbobOffset.x, isle.plumbobOffset.y - 2.2, isle.plumbobOffset.z]}
          stage={isle.stage}
          flamingoInfo={flamingoInfo}
        />
      )),
    [islands, flamingoInfo]
  )

  const starsConfig = useMemo(() => {
    if (!qualityConfig) return { count: 1000, factor: 8 }
    return qualityConfig.modelQuality === 'low' ? { count: 300, factor: 4 } : { count: 1000, factor: 8 }
  }, [qualityConfig])

  const orbitRefCallback = useCallback((ctrl) => {
    controlsRef.current = ctrl
    setControlsReady(Boolean(ctrl))
  }, [])

  if (!qualityConfig) return null

  return (
    <>
      <Leva collapsed hidden />
      <Canvas
        className='w-full h-screen inset-0 z-0'
        camera={{ position: [86, 0, -50], fov: 50, near: 0.1, far: 300 }}
        dpr={qualityConfig.pixelRatio}
        performance={{ min: 0.5 }}
        gl={{
          antialias: qualityConfig.antialias,
          powerPreference: 'high-performance',
          alpha: false,
        }}>
        <GradientBackground />

        <OrbitControls ref={orbitRefCallback} makeDefault {...orbitControlsProps} />

        {lights}
        <Stars
          radius={70}
          depth={50}
          count={starsConfig.count}
          factor={starsConfig.factor}
          saturation={0.08}
          speed={0.2}
          fade
        />

        {/* Render immediato appena assets precaricati - NO Suspense */}
        {criticalAssetsLoaded && (
          <>
            <Flamingo
              rotSpeedFactor={rotSpeed}
              onIslandChange={handleIslandChange}
              onPositionUpdate={handleFlamingoPositionUpdate}
            />
            <group position={[0, -3, 0]}>
              {plumbobs}
              <Island position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
            </group>
          </>
        )}

        {criticalAssetsLoaded && hasVisited && plumbobLabels}

        {/* PostProcessing lazy load */}
        {qualityConfig.postProcessing && postProcessingReady && <PostProcessing />}
      </Canvas>
    </>
  )
}

export default React.memo(Scene3D)
