# 🎨 Guida Configurazione Post-Processing Permanente

## Come impostare il preset "Moody Blue" in modo permanente

### Metodo 1: Modifica diretta in PostProcessing.jsx (RACCOMANDATO)

**File**: `src/components/PostProcessing.jsx`

Sostituisci la sezione dei controlli con questi valori di default:

```javascript
const [duoToneControls, set] = useControls(
  'Post-Processing',
  () => ({
    // Preset Manager
    presets: folder({
      preset: {
        value: 'Moody Blue', // ← Cambia da 'Custom' a 'Moody Blue'
        options: ['Custom', ...getPresetNames()],
        label: 'Load Preset',
        onChange: (presetName) => {
          // ... resto del codice
        },
      },
    }),

    // DuoTone Settings - VALORI MOODY BLUE
    duotone: folder({
      enabled: { value: true, label: 'Enable DuoTone' },
      darkColor: { value: '#1a0a2e', label: 'Dark Color' },      // ← Moody Blue dark
      lightColor: { value: '#f39c6b', label: 'Light Color' },    // ← Moody Blue light
      mixFactor: { value: 0.7, min: 0, max: 1, step: 0.01, label: 'Intensity' },
    }),

    // Vignette Settings - ATTIVATA
    vignette: folder({
      vignetteEnabled: { value: true, label: 'Enable Vignette' }, // ← Cambia da false a true
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
```

### Salva e riavvia
```bash
# Il file si salva automaticamente
# Riavvia il dev server se necessario
npm run dev
```

---

## Metodo 2: Usando i Preset Esistenti

Se vuoi semplicemente caricare Moody Blue all'avvio:

**File**: `src/effects/duotonePresets.js`

Verifica che esista questo preset:

```javascript
export const DUOTONE_PRESETS = {
  MOODY_BLUE: {
    name: 'Moody Blue',
    darkColor: '#1a0a2e',
    lightColor: '#f39c6b',
    mixFactor: 0.7,
    vignette: {
      offset: 0.3,
      darkness: 0.6,
    },
  },
  // ... altri preset
}
```

Poi in `PostProcessing.jsx`, modifica il valore iniziale:

```javascript
preset: {
  value: 'Moody Blue', // ← Preset caricato di default
  options: ['Custom', ...getPresetNames()],
  // ...
}
```

---

## 🎯 Valori Moody Blue Completi

Per riferimento, ecco tutti i valori del preset Moody Blue:

```javascript
// DuoTone
enabled: true
darkColor: '#1a0a2e'  // Blu scuro/viola
lightColor: '#f39c6b' // Arancio caldo
mixFactor: 0.7        // 70% intensità

// Vignette
vignetteEnabled: true
vignetteOffset: 0.3
vignetteDarkness: 0.6

// Bloom (opzionale)
bloomEnabled: true
bloomIntensity: 0.53
bloomLuminanceThreshold: 0.33
bloomRadius: 0.4
```

---

## 📝 Altri Preset Disponibili

Per cambiare preset, modifica semplicemente il valore in `PostProcessing.jsx`:

```javascript
preset: {
  value: 'Vintage Sunset',  // Cambia qui
  // oppure
  value: 'Cyberpunk Night',
  // oppure
  value: 'Ocean Breeze',
  // oppure
  value: 'Forest Mood',
  // oppure
  value: 'Warm Film',
}
```

### Lista completa preset:
- **Moody Blue** - Atmosfera blu/viola con toni caldi
- **Vintage Sunset** - Toni vintage seppia/dorati
- **Cyberpunk Night** - Neon viola/cyan futuristico
- **Ocean Breeze** - Blu/turchese rilassante
- **Forest Mood** - Verde scuro naturale
- **Warm Film** - Cinematico caldo

---

## ⚙️ Configurazione Avanzata

### Disattivare Vignette permanentemente

```javascript
vignette: folder({
  vignetteEnabled: { value: false, label: 'Enable Vignette' }, // ← false
  // ...
}),
```

### Disattivare Bloom permanentemente

```javascript
bloom: folder({
  bloomEnabled: { value: false, label: 'Enable Bloom' }, // ← false
  // ...
}),
```

### Disattivare DuoTone permanentemente

```javascript
duotone: folder({
  enabled: { value: false, label: 'Enable DuoTone' }, // ← false
  // ...
}),
```

---

## 🔧 Personalizzazione Colori

Vuoi creare il tuo preset personalizzato? Ecco come:

### 1. Trova i tuoi colori perfetti

Usa il pannello Leva in dev mode:
1. Apri la pagina Home
2. Apri il pannello Leva (icona in alto a destra)
3. Espandi "Post-Processing"
4. Gioca con darkColor e lightColor
5. Annota i valori che ti piacciono

### 2. Salva i valori in PostProcessing.jsx

Sostituisci i valori di default:

```javascript
duotone: folder({
  enabled: { value: true, label: 'Enable DuoTone' },
  darkColor: { value: '#TUO_COLORE_SCURO', label: 'Dark Color' },
  lightColor: { value: '#TUO_COLORE_CHIARO', label: 'Light Color' },
  mixFactor: { value: 0.7, min: 0, max: 1, step: 0.01, label: 'Intensity' },
}),
```

### 3. (Opzionale) Aggiungi al file preset

**File**: `src/effects/duotonePresets.js`

```javascript
export const DUOTONE_PRESETS = {
  // ... preset esistenti
  
  MY_CUSTOM: {
    name: 'My Custom Preset',
    darkColor: '#TUO_COLORE_SCURO',
    lightColor: '#TUO_COLORE_CHIARO',
    mixFactor: 0.7,
    vignette: {
      offset: 0.3,
      darkness: 0.6,
    },
  },
}
```

---

## 🎨 Tips per Scegliere i Colori

### Combinazioni consigliate:

**1. Blu/Arancio (Complementari)**
```javascript
darkColor: '#1a0a2e'  // Blu scuro
lightColor: '#f39c6b' // Arancio
```

**2. Viola/Giallo (Caldo)**
```javascript
darkColor: '#2d1b69'  // Viola
lightColor: '#ffd93d' // Giallo
```

**3. Verde/Rosa (Natura)**
```javascript
darkColor: '#1a3a1a'  // Verde scuro
lightColor: '#ff6b9d' // Rosa
```

**4. Monocromatico Blu**
```javascript
darkColor: '#0a1628'  // Blu molto scuro
lightColor: '#4a90e2' // Blu chiaro
```

---

## 📊 Parametri Vignette

### Offset
- **0.0** = Vignette copre tutto lo schermo
- **0.3** = Equilibrato (raccomandato)
- **0.5** = Vignette solo agli angoli
- **1.0** = Nessuna vignette

### Darkness
- **0.0** = Trasparente (nessun effetto)
- **0.3** = Leggero
- **0.6** = Medio (raccomandato)
- **0.9** = Molto scuro
- **1.0** = Nero completo

---

## 🚀 Quick Start - Copia/Incolla

### Configurazione Moody Blue + Vignette ATTIVA

Copia questo blocco in `PostProcessing.jsx` alla riga ~15:

```javascript
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
      vignetteEnabled: { value: true, label: 'Enable Vignette' },
      vignetteOffset: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'Offset' },
      vignetteDarkness: { value: 0.6, min: 0, max: 1, step: 0.01, label: 'Darkness' },
    }),
    bloom: folder({
      bloomEnabled: { value: true, label: 'Enable Bloom' },
      bloomIntensity: { value: 0.53, min: 0, max: 2, step: 0.01, label: 'Intensity' },
      bloomLuminanceThreshold: { value: 0.33, min: 0, max: 1, step: 0.01, label: 'Threshold' },
      bloomRadius: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'Radius' },
    }),
  }),
  { collapsed: true }
)
```

### Salva il file
```bash
Ctrl+S (Windows) o Cmd+S (Mac)
```

### Verifica
1. Ricarica la pagina
2. Dovresti vedere immediatamente il preset Moody Blue
3. La vignette sarà attiva
4. Puoi ancora modificare i valori dal pannello Leva se serve

---

## ❓ Troubleshooting

### Il preset non si carica
- Verifica che il nome sia scritto esattamente come in `duotonePresets.js`
- Controlla la console per errori
- Riavvia il dev server: `npm run dev`

### La vignette non appare
- Verifica `vignetteEnabled: { value: true }`
- Controlla che `vignetteOffset` non sia 1.0
- Controlla che `vignetteDarkness` non sia 0.0

### I colori non cambiano
- Cancella la cache del browser (Ctrl+Shift+R)
- Verifica che DuoTone sia abilitato: `enabled: { value: true }`
- Controlla che mixFactor non sia 0

---

## 🎯 Risultato Finale

Dopo aver applicato la configurazione, dovresti vedere:
- ✅ Preset Moody Blue attivo di default
- ✅ Vignette visibile agli angoli dello schermo
- ✅ Atmosfera blu/viola con toni caldi
- ✅ Configurazione permanente (persiste dopo reload)

---

## 📝 Note Importanti

1. **I valori di default si applicano solo al primo caricamento**
2. **Leva può sovrascrivere i valori durante la sessione di dev**
3. **In produzione, i valori di default saranno sempre applicati**
4. **Per cambiamenti permanenti, modifica sempre i file sorgente**

---

## 💡 Best Practices

1. **Testa i preset in dev mode** prima di committare
2. **Usa nomi descrittivi** per i preset personalizzati
3. **Documenta i valori** se crei preset complessi
4. **Considera l'accessibilità** - contrasti troppo forti possono dare fastidio
5. **Testa su device diversi** - i colori appaiono diversi su monitor diversi

---

## 🔗 Risorse Utili

- **Picker colori online**: https://colorpicker.me
- **Palette generator**: https://coolors.co
- **Teoria del colore**: https://color.adobe.com

---

Ora hai tutto quello che ti serve per configurare permanentemente il preset Moody Blue e la vignette! 🎨✨
