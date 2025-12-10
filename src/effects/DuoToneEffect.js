import { Effect } from 'postprocessing'
import { Uniform, Color } from 'three'

/**
 * DuoToneEffect - Custom shader effect per look bitonale
 *
 * Converte l'immagine in scala di grigi e rimappa i valori su due colori:
 * - darkColor: per i toni scuri (ombre)
 * - lightColor: per i toni chiari (luci)
 *
 * @param {Object} options
 * @param {Color|string} options.darkColor - Colore per le ombre (default: nero)
 * @param {Color|string} options.lightColor - Colore per le luci (default: bianco)
 * @param {number} options.mixFactor - Intensità dell'effetto 0-1 (default: 1)
 */

const fragmentShader = /* glsl */ `
  uniform vec3 darkColor;
  uniform vec3 lightColor;
  uniform float mixFactor;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Converti in scala di grigi usando coefficienti luminanza percettiva
    float gray = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Mappa il valore grigio tra darkColor e lightColor
    vec3 duotone = mix(darkColor, lightColor, gray);
    
    // Mix tra colore originale e duotone in base a mixFactor
    vec3 finalColor = mix(inputColor.rgb, duotone, mixFactor);
    
    outputColor = vec4(finalColor, inputColor.a);
  }
`

export class DuoToneEffect extends Effect {
  constructor({ darkColor = '#000000', lightColor = '#ffffff', mixFactor = 1.0 } = {}) {
    super('DuoToneEffect', fragmentShader, {
      uniforms: new Map([
        ['darkColor', new Uniform(new Color(darkColor))],
        ['lightColor', new Uniform(new Color(lightColor))],
        ['mixFactor', new Uniform(mixFactor)],
      ]),
    })
  }

  /**
   * Aggiorna il colore scuro
   * @param {Color|string|number} value
   */
  set darkColor(value) {
    this.uniforms.get('darkColor').value.set(value)
  }

  get darkColor() {
    return this.uniforms.get('darkColor').value
  }

  /**
   * Aggiorna il colore chiaro
   * @param {Color|string|number} value
   */
  set lightColor(value) {
    this.uniforms.get('lightColor').value.set(value)
  }

  get lightColor() {
    return this.uniforms.get('lightColor').value
  }

  /**
   * Aggiorna l'intensità del mix
   * @param {number} value - 0 (originale) a 1 (full duotone)
   */
  set mixFactor(value) {
    this.uniforms.get('mixFactor').value = value
  }

  get mixFactor() {
    return this.uniforms.get('mixFactor').value
  }
}
