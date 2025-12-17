import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Sistema LOD (Level of Detail) automatico
 * Riduce complessità modello in base alla distanza dalla camera
 */
export class LODManager {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.lodObjects = new Map()
  }

  /**
   * Crea versioni LOD di un oggetto
   */
  createLOD(object, distances = [15, 30, 50]) {
    const lod = new THREE.LOD()
    
    // LOD 0: Full detail (vicino)
    lod.addLevel(object.clone(), 0)
    
    // LOD 1: Medium detail
    const mediumDetail = this.simplifyObject(object.clone(), 0.5)
    lod.addLevel(mediumDetail, distances[0])
    
    // LOD 2: Low detail
    const lowDetail = this.simplifyObject(object.clone(), 0.25)
    lod.addLevel(lowDetail, distances[1])
    
    // LOD 3: Very low detail (lontano)
    const veryLowDetail = this.simplifyObject(object.clone(), 0.1)
    lod.addLevel(veryLowDetail, distances[2])
    
    return lod
  }

  /**
   * Semplifica geometria di un oggetto
   */
  simplifyObject(object, ratio) {
    object.traverse((child) => {
      if (child.isMesh && child.geometry) {
        // Riduci qualità materiali per LOD bassi
        if (child.material) {
          const mat = Array.isArray(child.material) ? child.material[0] : child.material
          
          if (ratio < 0.5) {
            // Disabilita normal map per LOD bassi
            if (mat.normalMap) {
              mat.normalMap = null
              mat.needsUpdate = true
            }
          }
          
          if (ratio < 0.3) {
            // Usa material più semplice
            mat.flatShading = true
            mat.needsUpdate = true
          }
        }
      }
    })
    
    return object
  }

  /**
   * Registra oggetto per gestione LOD automatica
   */
  register(object, distances) {
    const lod = this.createLOD(object, distances)
    this.lodObjects.set(object.uuid, lod)
    return lod
  }

  /**
   * Update distanze LOD ogni frame
   */
  update() {
    this.lodObjects.forEach((lod) => {
      lod.update(this.camera)
    })
  }

  /**
   * Dispose
   */
  dispose() {
    this.lodObjects.forEach((lod) => {
      lod.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach(mat => mat.dispose())
        }
      })
    })
    this.lodObjects.clear()
  }
}

/**
 * Hook React per LOD
 */
export function useLOD(object, camera, distances = [15, 30, 50]) {
  const lodManager = useRef(null)

  useEffect(() => {
    if (!object || !camera) return

    lodManager.current = new LODManager(object.parent, camera)
    const lod = lodManager.current.register(object, distances)
    
    // Sostituisci oggetto originale con LOD
    if (object.parent) {
      object.parent.add(lod)
      object.parent.remove(object)
    }

    return () => {
      if (lodManager.current) {
        lodManager.current.dispose()
      }
    }
  }, [object, camera, distances])

  useFrame(() => {
    if (lodManager.current) {
      lodManager.current.update()
    }
  })
}
