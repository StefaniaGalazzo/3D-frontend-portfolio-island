import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const GradientBackground = () => {
  const { scene } = useThree()

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 512

    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)

    // CSS gradient: to bottom, #000000 10%, #100d62 80%, #212083 100%
    gradient.addColorStop(0, '#000000') // Top (10% → 0 for smoother)
    gradient.addColorStop(0.1, '#000000')
    gradient.addColorStop(0.8, '#100d62')
    gradient.addColorStop(1, '#212083') // Bottom

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2, 512)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }, [])

  // Applica al background della scena
  useMemo(() => {
    scene.background = gradientTexture
  }, [scene, gradientTexture])

  return null
}

export default React.memo(GradientBackground)
