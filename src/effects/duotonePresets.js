/**
 * DuoTone Presets - Palette predefinite per effetti bitonali
 *
 * Ogni preset definisce:
 * - darkColor: colore per le ombre
 * - lightColor: colore per le luci
 * - mixFactor: intensità effetto (0-1)
 * - vignette: configurazione vignettatura (opzionale)
 */

export const DUOTONE_PRESETS = {
  // Vintage & Retro
  sunsetVintage: {
    name: 'Sunset Vintage',
    darkColor: '#2d1b2e',
    lightColor: '#ff6b35',
    mixFactor: 0.8,
    vignette: { offset: 0.3, darkness: 0.6 },
  },

  sepiaWarm: {
    name: 'Sepia Warm',
    darkColor: '#3d2817',
    lightColor: '#f4e4c1',
    mixFactor: 0.75,
    vignette: { offset: 0.4, darkness: 0.5 },
  },

  // Cinematografici
  noirClassic: {
    name: 'Noir Classic',
    darkColor: '#000000',
    lightColor: '#ffffff',
    mixFactor: 1.0,
    vignette: { offset: 0.2, darkness: 0.8 },
  },

  moodyBlue: {
    name: 'Moody Blue',
    darkColor: '#0f0f23',
    // lightColor: '#5e7ce2',
    lightColor: '#4c76ff',
    mixFactor: 0.63,
    vignette: { offset: 0.35, darkness: 0.7 },
  },

  // Natura
  oceanBlue: {
    name: 'Ocean Blue',
    darkColor: '#0a192f',
    lightColor: '#64ffda',
    mixFactor: 0.7,
    vignette: { offset: 0.3, darkness: 0.4 },
  },

  forestGreen: {
    name: 'Forest Green',
    darkColor: '#1a3a1a',
    lightColor: '#90ee90',
    mixFactor: 0.65,
    vignette: { offset: 0.3, darkness: 0.5 },
  },

  mintFresh: {
    name: 'Mint Fresh',
    darkColor: '#1a3a3a',
    lightColor: '#b8f2e6',
    mixFactor: 0.6,
    vignette: { offset: 0.25, darkness: 0.3 },
  },

  // Futuristico & Cyberpunk
  cyberpunk: {
    name: 'Cyberpunk',
    darkColor: '#1a0033',
    lightColor: '#00ffff',
    mixFactor: 0.9,
    vignette: { offset: 0.2, darkness: 0.7 },
  },

  neonPink: {
    name: 'Neon Pink',
    darkColor: '#2d0a2e',
    lightColor: '#ff1493',
    mixFactor: 0.85,
    vignette: { offset: 0.25, darkness: 0.6 },
  },

  // Pastello & Soft
  cottonCandy: {
    name: 'Cotton Candy',
    darkColor: '#4a3f57',
    lightColor: '#ffc0cb',
    mixFactor: 0.65,
    vignette: { offset: 0.3, darkness: 0.4 },
  },

  lavenderDream: {
    name: 'Lavender Dream',
    darkColor: '#3a2f4a',
    lightColor: '#c5b4e3',
    mixFactor: 0.7,
    vignette: { offset: 0.35, darkness: 0.5 },
  },

  // Drammatico
  fireOrange: {
    name: 'Fire Orange',
    darkColor: '#1a0a00',
    lightColor: '#ff6600',
    mixFactor: 0.8,
    vignette: { offset: 0.2, darkness: 0.7 },
  },

  deepPurple: {
    name: 'Deep Purple',
    darkColor: '#1a0033',
    lightColor: '#9b59b6',
    mixFactor: 0.75,
    vignette: { offset: 0.3, darkness: 0.6 },
  },

  // Minimal & Clean
  iceBlue: {
    name: 'Ice Blue',
    darkColor: '#1a2332',
    lightColor: '#e0f7fa',
    mixFactor: 0.6,
    vignette: { offset: 0.4, darkness: 0.3 },
  },

  monochrome: {
    name: 'Monochrome',
    darkColor: '#1a1a1a',
    lightColor: '#f5f5f5',
    mixFactor: 1.0,
    vignette: { offset: 0.3, darkness: 0.5 },
  },
}

/**
 * Applica un preset ai controlli Leva
 * @param {Object} preset - Preset da applicare
 * @param {Function} set - Funzione set di Leva
 */
export const applyPreset = (preset, set) => {
  set({
    darkColor: preset.darkColor,
    lightColor: preset.lightColor,
    mixFactor: preset.mixFactor,
  })

  if (preset.vignette) {
    set({
      vignetteEnabled: true,
      vignetteOffset: preset.vignette.offset,
      vignetteDarkness: preset.vignette.darkness,
    })
  }
}

/**
 * Ottieni lista nomi preset
 */
export const getPresetNames = () => {
  return Object.keys(DUOTONE_PRESETS).map((key) => DUOTONE_PRESETS[key].name)
}

/**
 * Ottieni preset per nome
 * @param {string} name - Nome del preset
 */
export const getPresetByName = (name) => {
  const key = Object.keys(DUOTONE_PRESETS).find((k) => DUOTONE_PRESETS[k].name === name)
  return key ? DUOTONE_PRESETS[key] : null
}
