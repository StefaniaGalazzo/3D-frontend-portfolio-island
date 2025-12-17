/**
 * GradientBackground - Background gradient nativo Three.js con controlli Leva
 *
 * FEATURES:
 * - Controllo real-time colori e stops
 * - Preset predefiniti
 * - Performance ottimale (4KB texture)
 */
// Preset gradient
export const GRADIENT_PRESETS = {
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
