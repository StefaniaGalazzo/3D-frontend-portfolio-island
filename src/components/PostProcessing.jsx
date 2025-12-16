import React, { useMemo } from 'react'
import { EffectComposer, Vignette, Bloom } from '@react-three/postprocessing'
import { DuoToneEffect } from '../effects/DuoToneEffect'
import { useControls, folder, button } from 'leva'
import { DUOTONE_PRESETS, getPresetNames } from '../effects/duotonePresets'

/**
 * PostProcessing - Effetti di post-processing per la scena
 *
 * Include:
 * - DuoTone effect (bitonale personalizzato)
 * - Vignette (vignettatura)
 * - Bloom (optional glow effect)
 * - Preset manager (palette predefinite)
 *
 * Tutti controllabili in tempo reale tramite Leva
 */
const PostProcessing = () => {
  // Controlli Leva per DuoTone
  const [duoToneControls, set] = useControls(
    'Post-Processing',
    () => ({
      // Preset Manager
      presets: folder({
        preset: {
          value: 'Moody Blue',
          options: ['Custom', ...getPresetNames()],
          label: 'Load Preset',
          onChange: (presetName) => {
            if (presetName === 'Custom') return

            const presetKey = Object.keys(DUOTONE_PRESETS).find((k) => DUOTONE_PRESETS[k].name === presetName)

            if (presetKey) {
              const preset = DUOTONE_PRESETS[presetKey]
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
          },
        },
      }),

      // DuoTone Settings
      duotone: folder({
        enabled: { value: true, label: 'Enable DuoTone' },
        darkColor: { value: '#1a0a2e', label: 'Dark Color' },
        lightColor: { value: '#f39c6b', label: 'Light Color' },
        mixFactor: { value: 0.7, min: 0, max: 1, step: 0.01, label: 'Intensity' },
      }),

      // Vignette Settings
      vignette: folder({
        vignetteEnabled: { value: false, label: 'Enable Vignette' },
        vignetteOffset: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'Offset' },
        vignetteDarkness: { value: 0.6, min: 0, max: 1, step: 0.01, label: 'Darkness' },
      }),

      // Bloom Settings
      bloom: folder({
        bloomEnabled: { value: true, label: 'Enable Bloom' },
        bloomIntensity: { value: 0.53, min: 0, max: 2, step: 0.01, label: 'Intensity' },
        bloomLuminanceThreshold: { value: 0.33, min: 0, max: 1, step: 0.01, label: 'Threshold' },
        bloomRadius: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'Radius' },
      }),
    }),
    { collapsed: true }
  )

  // Crea l'effetto DuoTone con i controlli
  const duoToneEffect = useMemo(() => {
    if (!duoToneControls.enabled) return null

    return new DuoToneEffect({
      darkColor: duoToneControls.darkColor,
      lightColor: duoToneControls.lightColor,
      mixFactor: duoToneControls.mixFactor,
    })
  }, [duoToneControls.enabled, duoToneControls.darkColor, duoToneControls.lightColor, duoToneControls.mixFactor])

  return (
    <EffectComposer>
      {/* DuoTone Effect */}
      {duoToneEffect && <primitive object={duoToneEffect} />}

      {/* Vignette Effect
      {duoToneControls.vignetteEnabled && (
        <Vignette offset={duoToneControls.vignetteOffset} darkness={duoToneControls.vignetteDarkness} />
      )} */}

      {/* Bloom Effect (optional) */}
      {duoToneControls.bloomEnabled && (
        <Bloom
          intensity={duoToneControls.bloomIntensity}
          luminanceThreshold={duoToneControls.bloomLuminanceThreshold}
          radius={duoToneControls.bloomRadius}
        />
      )}
    </EffectComposer>
  )
}

export default React.memo(PostProcessing)
