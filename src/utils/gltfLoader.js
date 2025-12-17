// src/utils/gltfLoader.js
import { useGLTF } from '@react-three/drei'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Configura DRACO decoder per compressione geometria
 * DRACO riduce file GLB del 80-90% per geometrie complesse
 */
let dracoLoader = null
let gltfLoader = null

export function setupDracoLoader() {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader()
    // Usa decoder WASM da CDN (più veloce del JS decoder)
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.preload()
  }
  return dracoLoader
}

export function getOptimizedGLTFLoader() {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(setupDracoLoader())
  }
  return gltfLoader
}

/**
 * Preload con supporto DRACO
 */
export async function preloadWithDraco(path) {
  const loader = getOptimizedGLTFLoader()
  
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        // Cache per useGLTF
        useGLTF.preload(path)
        resolve(gltf)
      },
      undefined,
      reject
    )
  })
}
