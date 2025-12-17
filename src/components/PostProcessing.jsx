// src/components/PostProcessing.jsx
import React, { useMemo } from 'react'
import { EffectComposer, Vignette, Bloom } from '@react-three/postprocessing'
import { DuoToneEffect } from '../effects/DuoToneEffect'
import { useControls, folder } from 'leva'
import { DUOTONE_PRESETS, getPresetNames } from '../effects/duotonePresets'
import useAppStore from '../store/useAppStore'

/**
 * PostProcessing - Lazy-loaded DOPO stabilizzazione scena
 *
 * PERFORMANCE STRATEGY:
 * 1. modelsRendered = true → Modelli visibili (100%)
 * 2. Scena si stabilizza per ~1 secondo (60 frames)
 * 3. postProcessingReady = true → Abilita effetti
 *
 * RISULTATO:
 * - Modale si chiude velocemente
 * - Isola appare immediatamente
 * - PostProcessing fade-in smooth dopo stabilizzazione
 */
const PostProcessing = () => {
  // Attendi che la scena sia stabile prima di abilitare
  const postProcessingReady = useAppStore((state) => state.postProcessingReady)

  const [duoToneControls, set] = useControls(
    'Post-Processing',
    () => ({
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

      duotone: folder({
        enabled: { value: true, label: 'Enable DuoTone' },
        darkColor: { value: '#1a0a2e', label: 'Dark Color' },
        lightColor: { value: '#f39c6b', label: 'Light Color' },
        mixFactor: { value: 0.7, min: 0, max: 1, step: 0.01, label: 'Intensity' },
      }),

      vignette: folder({
        vignetteEnabled: { value: false, label: 'Enable Vignette' },
        vignetteOffset: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'Offset' },
        vignetteDarkness: { value: 0.6, min: 0, max: 1, step: 0.01, label: 'Darkness' },
      }),

      bloom: folder({
        bloomEnabled: { value: true, label: 'Enable Bloom' },
        bloomIntensity: { value: 0.53, min: 0, max: 2, step: 0.01, label: 'Intensity' },
        bloomLuminanceThreshold: {
          value: 0.33,
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Threshold',
        },
        bloomRadius: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'Radius' },
      }),
    }),
    { collapsed: true }
  )

  const duoToneEffect = useMemo(() => {
    if (!duoToneControls.enabled) return null

    return new DuoToneEffect({
      darkColor: duoToneControls.darkColor,
      lightColor: duoToneControls.lightColor,
      mixFactor: duoToneControls.mixFactor,
    })
  }, [duoToneControls.enabled, duoToneControls.darkColor, duoToneControls.lightColor, duoToneControls.mixFactor])

  // NON renderizzare finché la scena non è stabilizzata
  if (!postProcessingReady) {
    return null
  }

  console.log('[PostProcessing] ✨ Attivato dopo stabilizzazione')

  return (
    <EffectComposer>
      {/* {duoToneEffect && <primitive object={duoToneEffect} />} */}
      {/* Vignette Effect
      {duoToneControls.vignetteEnabled && (
        <Vignette offset={duoToneControls.vignetteOffset} darkness={duoToneControls.vignetteDarkness} />
      )}
      )} */}
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
