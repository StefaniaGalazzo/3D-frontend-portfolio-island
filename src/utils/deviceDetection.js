// src/utils/deviceDetection.js

/**
 * Device Detection Utilities
 * Senior Three.js approach - detect capabilities, not just user agent
 */

export const isMobile = () => {
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  const smallScreen = window.innerWidth < 768
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return mobileUA || (smallScreen && hasTouch)
}

export const isTablet = () => {
  const tabletUA = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
  const mediumScreen = window.innerWidth >= 768 && window.innerWidth < 1024
  
  return tabletUA || mediumScreen
}

export const getGPUTier = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  if (!gl) return 'low'
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return 'medium'
  
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
  
  if (
    renderer.includes('nvidia') || 
    renderer.includes('geforce') ||
    renderer.includes('radeon') ||
    renderer.includes('amd') ||
    renderer.includes('apple m1') ||
    renderer.includes('apple m2')
  ) {
    return 'high'
  }
  
  if (
    renderer.includes('mali') ||
    renderer.includes('adreno') ||
    renderer.includes('powervr') ||
    renderer.includes('intel')
  ) {
    return 'low'
  }
  
  return 'medium'
}

export const getQualityConfig = () => {
  const mobile = isMobile()
  const tablet = isTablet()
  const gpuTier = getGPUTier()
  
  if (mobile && gpuTier === 'low') {
    return {
      modelQuality: 'low',
      textureSize: 512,
      shadows: false,
      postProcessing: false,
      pixelRatio: 1,
      antialias: false,
    }
  }
  
  if (mobile && gpuTier !== 'low') {
    return {
      modelQuality: 'medium',
      textureSize: 1024,
      shadows: false,
      postProcessing: false,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
    }
  }
  
  if (tablet) {
    return {
      modelQuality: 'medium',
      textureSize: 1024,
      shadows: true,
      postProcessing: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
    }
  }
  
  return {
    modelQuality: 'high',
    textureSize: 2048,
    shadows: true,
    postProcessing: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    antialias: true,
  }
}

export const logDeviceInfo = () => {
  const config = getQualityConfig()
  
  console.group('🔍 Device Detection')
  console.log('Mobile:', isMobile())
  console.log('Tablet:', isTablet())
  console.log('GPU Tier:', getGPUTier())
  console.log('Quality Config:', config)
  console.log('Screen:', `${window.innerWidth}x${window.innerHeight}`)
  console.log('DPR:', window.devicePixelRatio)
  console.groupEnd()
  
  return config
}
