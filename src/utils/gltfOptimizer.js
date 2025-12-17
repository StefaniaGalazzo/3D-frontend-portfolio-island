import * as THREE from 'three'

/**
 * Ottimizza materiali e texture di un modello GLTF
 * Riduce memory footprint e migliora performance
 */
export function optimizeGLTFMaterials(gltf, options = {}) {
  const {
    maxTextureSize = 1024,
    anisotropy = 4,
    simplifyMaterials = true,
  } = options

  const textures = new Map()
  
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      const material = child.material
      
      if (!material) return

      // Processa array di materiali o materiale singolo
      const materials = Array.isArray(material) ? material : [material]
      
      materials.forEach((mat) => {
        // Ottimizza texture del materiale
        optimizeMaterialTextures(mat, { maxTextureSize, anisotropy, textures })
        
        // Semplifica materiali complessi se richiesto
        if (simplifyMaterials) {
          simplifyMaterial(mat)
        }
      })

      // Ottimizzazioni geometria
      if (child.geometry) {
        optimizeGeometry(child.geometry)
      }

      // Abilita frustum culling
      child.frustumCulled = true
    }
  })

  return gltf
}

function optimizeMaterialTextures(material, { maxTextureSize, anisotropy, textures }) {
  const textureProps = [
    'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
    'aoMap', 'emissiveMap', 'bumpMap', 'displacementMap'
  ]

  textureProps.forEach((prop) => {
    const texture = material[prop]
    if (!texture) return

    // Evita duplicati - ottimizza texture una sola volta
    if (textures.has(texture.uuid)) {
      material[prop] = textures.get(texture.uuid)
      return
    }

    // Ridimensiona se troppo grande
    if (texture.image && (texture.image.width > maxTextureSize || texture.image.height > maxTextureSize)) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const scale = Math.min(maxTextureSize / texture.image.width, maxTextureSize / texture.image.height)
      canvas.width = texture.image.width * scale
      canvas.height = texture.image.height * scale
      
      ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height)
      texture.image = canvas
    }

    // Ottimizza parametri texture
    texture.anisotropy = anisotropy
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    
    // Encoding corretto per color maps
    if (prop === 'map' || prop === 'emissiveMap') {
      texture.colorSpace = THREE.SRGBColorSpace
    }

    textures.set(texture.uuid, texture)
  })
}

function simplifyMaterial(material) {
  // Disabilita features costose se non necessarie
  if (material.normalMap && material.normalScale) {
    // Riduce intensità normal map se troppo alta
    const scale = material.normalScale
    if (scale.x > 1 || scale.y > 1) {
      material.normalScale.set(
        Math.min(scale.x, 1),
        Math.min(scale.y, 1)
      )
    }
  }

  // Disabilita displacement se minimo
  if (material.displacementMap && Math.abs(material.displacementScale) < 0.01) {
    material.displacementMap = null
  }

  // Semplifica shading per oggetti distanti
  material.flatShading = false
}

function optimizeGeometry(geometry) {
  // Calcola bounding sphere per frustum culling
  if (!geometry.boundingSphere) {
    geometry.computeBoundingSphere()
  }
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox()
  }

  // Remove unused attributes
  const attributes = Object.keys(geometry.attributes)
  attributes.forEach((attr) => {
    // Rimuovi attributi non standard se non usati
    if (attr.startsWith('_') || attr.includes('temp')) {
      geometry.deleteAttribute(attr)
    }
  })
}

/**
 * Dispone correttamente di materiali e texture
 */
export function disposeGLTF(gltf) {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose()
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((mat) => {
        if (mat.map) mat.map.dispose()
        if (mat.normalMap) mat.normalMap.dispose()
        if (mat.roughnessMap) mat.roughnessMap.dispose()
        if (mat.metalnessMap) mat.metalnessMap.dispose()
        if (mat.aoMap) mat.aoMap.dispose()
        if (mat.emissiveMap) mat.emissiveMap.dispose()
        mat.dispose()
      })
    }
  })
}

/**
 * Configurazione ottimale per device
 */
export function getOptimalTextureSettings(isMobile = false, isLowEnd = false) {
  if (isLowEnd || isMobile) {
    return {
      maxTextureSize: 512,
      anisotropy: 2,
      simplifyMaterials: true,
    }
  }

  return {
    maxTextureSize: 1024,
    anisotropy: 4,
    simplifyMaterials: false,
  }
}
