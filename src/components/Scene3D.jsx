import React, { Suspense, useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import * as THREE from 'three'
import { PostProcessing, PlumbobLabel } from '../components'
import { Flamingo, Island, Plumbob } from '../models'
import { getAllIslands } from '../constants/islandConfig'
import useAppStore from '../store/useAppStore'
import useSceneInteraction from '../hooks/useSceneInteraction'
import useCameraInitializer from '../hooks/useCameraInitializer'
import GradientBackground from './GradientBackground'
import { logDeviceInfo } from '../utils/deviceDetection'

// Helper component per visualizzare directional lights
const LightHelpers = ({ lights, showHelpers }) => {
  const { scene } = useThree()

  useEffect(() => {
    if (!showHelpers) return

    const helpers = []

    // Trova tutte le directional lights nella scena
    scene.traverse((child) => {
      if (child instanceof THREE.DirectionalLight) {
        const helper = new THREE.DirectionalLightHelper(child, 5, child.color)
        scene.add(helper)
        helpers.push(helper)

        // Aggiungi anche helper per il target (dove punta)
        const targetHelper = new THREE.AxesHelper(2)
        child.target.add(targetHelper)

        console.log('[LightHelper] Added helper for light at:', child.position)
      }
    })

    // Cleanup
    return () => {
      helpers.forEach((helper) => {
        scene.remove(helper)
        helper.dispose()
      })
    }
  }, [scene, showHelpers, lights])

  return null
}

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

  const lightControls = useControls(
    'Lights',
    {
      // Debug
      showHelpers: { value: false, label: '👁️ Show Helpers' },

      // Directional Light 1
      dirPosition: { value: [8, 3, 5], step: 0.5, label: 'Dir1 Position' },
      dirIntensity: { value: 5, min: 0, max: 5, step: 0.5, label: 'Dir1 Intensity' },
      dirColor: { value: '#243ef0', label: 'Dir1 Color' },

      // Ambient Light
      ambIntensity: { value: 0.15, min: 0, max: 3, step: 0.1, label: 'Amb Intensity' },
      ambColor: { value: '#959ded', label: 'Amb Color' },

      // Hemisphere Light
      hemiIntensity: { value: 1.1, min: 0, max: 2, step: 0.1, label: 'Hemi Intensity' },
      hemiSkyColor: { value: '#3b54ff', label: 'Hemi Sky' },
      hemiGroundColor: { value: '#06022d', label: 'Hemi Ground' },

      // Directional Light 2
      dirPosition_2: { value: [-19, 8, -17], step: 0.5, label: 'Dir2 Position' },
      dirIntensity_2: { value: 5, min: 0, max: 5, step: 0.5, label: 'Dir2 Intensity' },
      dirColor_2: { value: '#243ef0', label: 'Dir2 Color' },
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
        <directionalLight
          position={lightControls.dirPosition}
          intensity={lightControls.dirIntensity}
          color={lightControls.dirColor}
        />
        <ambientLight intensity={lightControls.ambIntensity} color={lightControls.ambColor} />
        <hemisphereLight
          skyColor={lightControls.hemiSkyColor}
          groundColor={lightControls.hemiGroundColor}
          intensity={lightControls.hemiIntensity}
        />
        <directionalLight
          position={lightControls.dirPosition_2}
          intensity={lightControls.dirIntensity_2}
          color={lightControls.dirColor_2}
        />
      </>
    ),
    [
      lightControls.dirPosition,
      lightControls.dirIntensity,
      lightControls.dirColor,
      lightControls.ambIntensity,
      lightControls.ambColor,
      lightControls.hemiIntensity,
      lightControls.hemiSkyColor,
      lightControls.hemiGroundColor,
      lightControls.dirPosition_2,
      lightControls.dirIntensity_2,
      lightControls.dirColor_2,
    ]
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
      <Leva collapsed={false} />
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

        {/* Helper per visualizzare luci */}
        <LightHelpers lights={lights} showHelpers={lightControls.showHelpers} />

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
