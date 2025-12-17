import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Advanced Light Helper con controllo target
 */
export const AdvancedLightHelpers = ({ lights, showHelpers, dirTargets = {} }) => {
  const { scene } = useThree()
  const helpersRef = useRef([])
  
  useEffect(() => {
    if (!showHelpers) {
      // Cleanup
      helpersRef.current.forEach((helper) => {
        scene.remove(helper)
        helper.dispose()
      })
      helpersRef.current = []
      return
    }
    
    const helpers = []
    let lightIndex = 0
    
    // Trova tutte le directional lights
    scene.traverse((child) => {
      if (child instanceof THREE.DirectionalLight) {
        // DirectionalLightHelper
        const helper = new THREE.DirectionalLightHelper(child, 5, child.color)
        scene.add(helper)
        helpers.push(helper)
        
        // Target position custom (se specificato)
        const targetKey = `dir${lightIndex + 1}`
        if (dirTargets[targetKey]) {
          child.target.position.set(...dirTargets[targetKey])
        }
        
        // Axes helper sul target
        const targetHelper = new THREE.AxesHelper(2)
        targetHelper.position.copy(child.target.position)
        scene.add(targetHelper)
        helpers.push(targetHelper)
        
        // Sphere sul target (più visibile)
        const targetSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          new THREE.MeshBasicMaterial({ color: child.color, wireframe: true })
        )
        targetSphere.position.copy(child.target.position)
        scene.add(targetSphere)
        helpers.push(targetSphere)
        
        console.log(`[LightHelper] Light ${lightIndex + 1}:`)
        console.log('  Position:', child.position)
        console.log('  Target:', child.target.position)
        console.log('  Color:', child.color.getHexString())
        
        lightIndex++
      }
    })
    
    helpersRef.current = helpers
    
    // Cleanup
    return () => {
      helpers.forEach((helper) => {
        scene.remove(helper)
        if (helper.dispose) helper.dispose()
      })
    }
  }, [scene, showHelpers, lights, dirTargets])
  
  return null
}

export default AdvancedLightHelpers
