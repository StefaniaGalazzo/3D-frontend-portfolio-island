/**
 * Configurazione centralizzata delle isole
 * Posizioni 3D calcolate in base all'analisi del modello Island.glb
 */

export const ISLAND_CONFIG = {
  // Isola principale - centro della scena
  main: {
    id: 'main',
    stage: 1,
    position: { x: 0, y: 0, z: 0 },
    plumbobOffset: { x: 0, y: 2, z: 0 }, // Centro esatto dell'isola principale
    orbitRadius: 8, // Raggio orbita flamingo
    color: '#00ff88', // Verde
    label: 'Isola Principale',
  },

  // Isola 2 - Island_2_Low (analisi da Island.jsx linea ~850)
  // Position originale: [843.941, -66.859, -33.407] scala 100
  // Convertito: [8.44, -0.67, -0.33]
  island2: {
    id: 'island2',
    stage: 2,
    position: { x: 8.44, y: -0.67, z: -0.33 },
    plumbobOffset: { x: 8.44, y: 1.5, z: -0.33 }, // Centro isola 2
    orbitRadius: 5, // Raggio più piccolo
    color: '#ff00ff', // Magenta
    label: 'Isola Progetti',
  },

  // Isola 3 - Island_3_Low (analisi da Island.jsx linea ~860)
  // Position originale: [342.89, 1.804, -615.623] scala 100
  // Convertito: [3.43, 0.02, -6.16]
  island3: {
    id: 'island3',
    stage: 3,
    position: { x: 3.43, y: 0.02, z: -6.16 },
    plumbobOffset: { x: 3.43, y: 1.5, z: -6.16 }, // Centro isola 3
    orbitRadius: 5,
    color: '#ffaa00', // Arancione
    label: 'Isola Contatti',
  },
}

/**
 * Ottiene array di tutte le isole
 */
export const getAllIslands = () => {
  return [ISLAND_CONFIG.main, ISLAND_CONFIG.island2, ISLAND_CONFIG.island3]
}

/**
 * Trova l'isola più vicina ad una posizione
 */
export const findNearestIsland = (position) => {
  const islands = getAllIslands()
  let nearest = islands[0]
  let minDistance = Infinity

  islands.forEach((island) => {
    const dx = position.x - island.plumbobOffset.x
    const dz = position.z - island.plumbobOffset.z
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance < minDistance) {
      minDistance = distance
      nearest = island
    }
  })

  return nearest
}
