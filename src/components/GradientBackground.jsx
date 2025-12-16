import React, { useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useControls, folder } from 'leva'
import * as THREE from 'three'

/**
 * GradientBackground - Background gradient nativo Three.js con controlli Leva
 *
 * FEATURES:
 * - Controllo real-time colori e stops
 * - Preset predefiniti
 * - Performance ottimale (4KB texture)
 */

// Preset gradient
const GRADIENT_PRESETS = {
  default: {
    name: 'Default Space',
    color1: '#000000',
    color1Stop: 0.1,
    color2: '#100d62',
    color2Stop: 0.8,
    color3: '#212083',
    color3Stop: 1.0,
  },
  sunset: {
    name: 'Sunset',
    color1: '#0f0c29',
    color1Stop: 0.0,
    color2: '#302b63',
    color2Stop: 0.5,
    color3: '#24243e',
    color3Stop: 1.0,
  },
  ocean: {
    name: 'Deep Ocean',
    color1: '#000428',
    color1Stop: 0.0,
    color2: '#004e92',
    color2Stop: 0.7,
    color3: '#000428',
    color3Stop: 1.0,
  },
  forest: {
    name: 'Forest Night',
    color1: '#0f2027',
    color1Stop: 0.0,
    color2: '#203a43',
    color2Stop: 0.5,
    color3: '#2c5364',
    color3Stop: 1.0,
  },
  purple: {
    name: 'Purple Dream',
    color1: '#1e3c72',
    color1Stop: 0.0,
    color2: '#2a5298',
    color2Stop: 0.5,
    color3: '#7e22ce',
    color3Stop: 1.0,
  },
}

const GradientBackground = () => {
  const { scene } = useThree()

  const [{ color1, color2, color3, color1Stop, color2Stop, color3Stop }, set] = useControls(
    'Background Gradient',
    () => ({
      // Preset selector
      presets: folder({
        preset: {
          value: 'ocean',
          options: Object.keys(GRADIENT_PRESETS),
          label: 'Load Preset',
          onChange: (presetKey) => {
            const preset = GRADIENT_PRESETS[presetKey]
            set({
              color1: preset.color1,
              color1Stop: preset.color1Stop,
              color2: preset.color2,
              color2Stop: preset.color2Stop,
              color3: preset.color3,
              color3Stop: preset.color3Stop,
            })
          },
        },
      }),

      // Manual controls
      colors: folder({
        color1: { value: '#000000', label: 'Top Color' },
        color1Stop: { value: 0.1, min: 0, max: 1, step: 0.01, label: 'Top Stop' },
        color2: { value: '#100d62', label: 'Middle Color' },
        color2Stop: { value: 0.8, min: 0, max: 1, step: 0.01, label: 'Middle Stop' },
        color3: { value: '#212083', label: 'Bottom Color' },
        color3Stop: { value: 1.0, min: 0, max: 1, step: 0.01, label: 'Bottom Stop' },
      }),
    }),
    { collapsed: true }
  )

  // Crea texture gradient
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 512

    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)

    gradient.addColorStop(0, color1)
    gradient.addColorStop(color1Stop, color1)
    gradient.addColorStop(color2Stop, color2)
    gradient.addColorStop(color3Stop, color3)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2, 512)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }, [color1, color2, color3, color1Stop, color2Stop, color3Stop])

  // Applica al background
  useEffect(() => {
    scene.background = gradientTexture

    return () => {
      scene.background = null
      gradientTexture.dispose()
    }
  }, [scene, gradientTexture])

  return null
}

export default React.memo(GradientBackground)
