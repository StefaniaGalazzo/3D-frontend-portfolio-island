# 🎨 DuoTone Effect - Effetto Bitonale Personalizzato

## 📋 Overview

Ho implementato un **sistema completo di post-processing** con effetto bitonale (duotone) completamente controllabile in tempo reale. La soluzione è professionale, ottimizzata e modulare.

## 🎯 Caratteristiche Implementate

### ✅ Custom Shader Effect

- **DuoToneEffect**: Shader GLSL personalizzato
- Conversione automatica in scala di grigi con coefficienti percettivi
- Rimapping su due colori controllabili
- Mix factor per intensità dell'effetto (0 = originale, 1 = full duotone)

### ✅ Controlli in Tempo Reale (Leva)

- **Dark Color**: Colore per le ombre
- **Light Color**: Colore per le luci
- **Mix Factor**: Intensità effetto (0-1)
- **Vignette**: Vignettatura opzionale
- **Bloom**: Glow effect opzionale

### ✅ Performance Ottimizzate

- Memoizzazione degli effetti
- Re-render solo quando cambiano i controlli
- Integrazione con `@react-three/postprocessing`

## 📁 Struttura File Creati

```
src/
├── effects/
│   ├── DuoToneEffect.js          # Custom shader effect
│   └── duotonePresets.js         # 16 preset predefiniti
├── components/
│   ├── PostProcessing.jsx        # Componente wrapper effetti + preset manager
│   └── Scene3D.jsx              # Con PostProcessing
```

## 🔧 Come Funziona

### 1. DuoToneEffect (Custom Shader)

```javascript
// Shader GLSL che:
// 1. Converte RGB in grayscale
float gray = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

// 2. Rimappa tra darkColor e lightColor
vec3 duotone = mix(darkColor, lightColor, gray);

// 3. Blend con originale in base a mixFactor
vec3 finalColor = mix(inputColor.rgb, duotone, mixFactor);
```

**Coefficienti Percettivi:**

- Red: 0.299 (occhio umano meno sensibile)
- Green: 0.587 (occhio umano più sensibile)
- Blue: 0.114 (occhio umano meno sensibile)

### 2. PostProcessing Component

```jsx
<EffectComposer>
  {/* Custom DuoTone */}
  <primitive object={duoToneEffect} />

  {/* Vignette opzionale */}
  <Vignette offset={0.3} darkness={0.6} />

  {/* Bloom opzionale */}
  <Bloom intensity={0.3} />
</EffectComposer>
```

### 3. Integrazione in Scene3D

```jsx
<Canvas>
  {/* ... scena 3D ... */}

  {/* Post-processing alla fine */}
  <PostProcessing />
</Canvas>
```

## 🎮 Come Usare

### Apertura Controlli Leva

1. Avvia l'app: `npm run dev`
2. Apri il browser
3. Cerca il pannello **Leva** (icona toggle in alto a destra)
4. Espandi la sezione **"Post-Processing"**

### 🎨 Preset Manager (NUOVO!)

**Modo più veloce per iniziare:**

1. Apri il folder **"Presets"** in Leva
2. Seleziona un preset dal dropdown **"Load Preset"**
3. I colori e le impostazioni si applicano automaticamente!

**Preset Disponibili:**

- Sunset Vintage, Sepia Warm, Noir Classic
- Ocean Blue, Forest Green, Mint Fresh
- Cyberpunk, Neon Pink, Cotton Candy
- Fire Orange, Deep Purple, Ice Blue
- E molti altri... (16 preset totali!)

### Controlli Disponibili

#### 🎨 DuoTone

- **Enable DuoTone**: On/Off
- **Dark Color**: Picker colore per ombre (default: `#1a0a2e`)
- **Light Color**: Picker colore per luci (default: `#f39c6b`)
- **Intensity**: 0 (disabilitato) → 1 (full effect)

#### 🌑 Vignette

- **Enable Vignette**: On/Off
- **Offset**: 0-1 (dimensione vignetta)
- **Darkness**: 0-1 (intensità scurimento)

#### ✨ Bloom (Glow)

- **Enable Bloom**: On/Off
- **Intensity**: 0-2 (forza del glow)
- **Threshold**: 0-1 (soglia luminosità)
- **Radius**: 0-1 (dimensione glow)

## 🎨 Preset Suggeriti

### 1. **Sunset Vintage**

```javascript
darkColor: '#2d1b2e' // Viola scuro
lightColor: '#ff6b35' // Arancione
mixFactor: 0.8
```

### 2. **Ocean Blue**

```javascript
darkColor: '#0a192f' // Navy scuro
lightColor: '#64ffda' // Turchese
mixFactor: 0.7
```

### 3. **Noir Classic**

```javascript
darkColor: '#000000' // Nero
lightColor: '#ffffff' // Bianco
mixFactor: 1.0
```

### 4. **Cyberpunk**

```javascript
darkColor: '#1a0033' // Viola scurissimo
lightColor: '#00ffff' // Ciano
mixFactor: 0.9
```

### 5. **Sepia Warm**

```javascript
darkColor: '#3d2817' // Marrone scuro
lightColor: '#f4e4c1' // Beige chiaro
mixFactor: 0.75
```

### 6. **Mint Fresh**

```javascript
darkColor: '#1a3a3a' // Verde scuro
lightColor: '#b8f2e6' // Mint chiaro
mixFactor: 0.6
```

## ⚙️ API del DuoToneEffect

### Constructor

```javascript
new DuoToneEffect({
  darkColor: '#000000', // Color | string | number
  lightColor: '#ffffff', // Color | string | number
  mixFactor: 1.0, // number (0-1)
})
```

### Properties

```javascript
effect.darkColor = '#ff0000' // Setter
const dark = effect.darkColor // Getter

effect.lightColor = '#00ff00' // Setter
const light = effect.lightColor // Getter

effect.mixFactor = 0.5 // Setter
const mix = effect.mixFactor // Getter
```

## 🚀 Performance Tips

### ✅ Best Practices

1. **Usa memoizzazione**: Gli effetti sono già memoizzati
2. **Disabilita effetti non usati**: Ogni effect costa performance
3. **Testa su device mobile**: Gli shader sono costosi su GPU deboli

### ⚠️ Attenzione

- **Bloom è costoso**: Usalo solo se necessario
- **Troppi effetti insieme**: Possono causare lag
- **Dispositivi low-end**: Considera di disabilitare automaticamente

### Ottimizzazione Automatica

```javascript
// Esempio: disabilita bloom su mobile
const isMobile = window.innerWidth < 768
bloomEnabled: !isMobile
```

## 🎯 Casi d'Uso Ideali

### ✅ Quando Usare DuoTone

- Portfolio artistici
- Presentazioni vintage/retro
- Branding con palette limitata
- Effetti stilizzati
- Mood specifici (horror, sci-fi, etc.)

### ❌ Quando NON Usare

- Applicazioni fotorealistiche
- E-commerce (colori prodotti devono essere accurati)
- Medical imaging
- Contenuti dove i colori originali sono critici

## 🔄 Workflow Consigliato

1. **Sviluppo**: Usa Leva per sperimentare in tempo reale
2. **Testing**: Prova su diversi device (desktop, tablet, mobile)
3. **Ottimizzazione**: Trova il balance tra estetica e performance
4. **Produzione**: Considera di nascondere Leva in produzione:
   ```jsx
   <Leva collapsed hidden={import.meta.env.PROD} />
   ```

## 🐛 Troubleshooting

### Effetto non visibile?

1. Verifica che `enabled: true` in Leva
2. Controlla che `mixFactor > 0`
3. Assicurati che `PostProcessing` sia dentro `<Canvas>`

### Performance issues?

1. Disabilita Bloom se attivo
2. Riduci `mixFactor` per blend parziale
3. Controlla console per errori shader

### Colori strani?

1. Verifica formato colori (hex, rgb, o Color object)
2. Controlla che i colori siano sufficientemente contrastati
3. Testa con preset suggeriti

## 📚 Risorse Aggiuntive

- [postprocessing library](https://github.com/pmndrs/postprocessing)
- [Three.js Shaders](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [GLSL Reference](<https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)>)
- [@react-three/postprocessing](https://docs.pmnd.rs/react-postprocessing)

## 🎉 Risultato Finale

Hai ora un **sistema completo di post-processing** con:

- ✅ Effetto bitonale custom e controllabile
- ✅ Controlli in tempo reale via Leva
- ✅ Performance ottimizzate
- ✅ Modulare ed estendibile
- ✅ Preset pronti all'uso

**Sperimenta con i colori e trova la palette perfetta per il tuo portfolio! 🎨**
