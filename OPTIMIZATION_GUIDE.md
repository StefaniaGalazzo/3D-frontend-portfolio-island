# GUIDA COMPLETA OTTIMIZZAZIONE ISLAND.GLB

## STATUS ATTUALE

```
File: island-compressed.glb
Size: 37MB
Triangles: 44.2k
Vertices: 26.2k
Textures: 22
Materials: 6
```

**PROBLEMA**: 37MB è TROPPO per web. Target: <5MB

---

## IMPLEMENTAZIONI (LATO CODICE)

### ✅ 1. **Ottimizzazione Runtime**

- `gltfOptimizer.js`: Ridimensiona texture a 1024px (mobile: 512px)
- Merge vertices duplicati
- Ottimizza anisotropy e mipmap
- Semplifica materiali non essenziali

### ✅ 2. **DRACO Loader Ready**

- `gltfLoader.js`: Setup per caricare modelli con DRACO compression
- Riduzione file del 80-90% per geometrie complesse

### ✅ 3. **LOD System**

- `lodManager.js`: Riduce dettaglio in base a distanza camera
- 4 livelli: full, medium, low, very low

**NOTA**: Queste ottimizzazioni aiutano ma il file rimane 37MB da scaricare.

---

## COSA DEVI FARE TU (TOOL ESTERNI)

### 🔥 **PRIORITÀ 1: DRACO COMPRESSION** (OBBLIGATORIO)

**Risultato atteso**: 37MB → 3-5MB (90% riduzione)

#### **Opzione A: gltf-pipeline (Consigliato)**

```bash
# Install
npm install -g gltf-pipeline

# Compress con DRACO
gltf-pipeline -i island-compressed.glb -o island-draco.glb -d

# Opzioni avanzate (migliore qualità/size ratio)
gltf-pipeline -i island-compressed.glb -o island-draco.glb \
  -d \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12
```

**Parametri spiegati**:

- `compressionLevel 10`: Max compression (0-10)
- `quantizePositionBits 14`: Precisione vertici (11-14, più alto = migliore)
- `quantizeNormalBits 10`: Precisione normali (8-11)
- `quantizeTexcoordBits 12`: Precisione UV (8-12)

#### **Opzione B: glTF Transform CLI**

```bash
# Install
npm install -g @gltf-transform/cli

# Compress
gltf-transform draco island-compressed.glb island-draco.glb \
  --method edgebreaker \
  --encoder-speed 0 \
  --decoder-speed 5
```

#### **Opzione C: Online Tool**

- Vai su: https://gltf.report/
- Upload `island-compressed.glb`
- Clicca "Script" → "Draco Compression"
- Download risultato

**DOPO LA COMPRESSIONE**:

```bash
# Rinomina e sostituisci
mv island-draco.glb public/island-compressed.glb
```

---

### 🔥 **PRIORITÀ 2: OTTIMIZZAZIONE TEXTURE** (CRITICO)

**Problema**: 22 texture sono TROPPE e probabilmente troppo grandi.

#### **Tool: Texture Packer / Squoosh**

1. **Identifica le texture**:

```bash
# Estrai GLB per vedere le texture
gltf-pipeline -i island-compressed.glb -o island-folder/

# Controlla le texture in island-folder/
ls -lh island-folder/*.png island-folder/*.jpg
```

2. **Riduci dimensioni texture**:

```bash
# Ridimensiona tutte le texture a max 1024x1024
for img in island-folder/*.png; do
  convert "$img" -resize 1024x1024\> "$img"
done

# Converti PNG → JPG per texture color (non normal maps!)
for img in island-folder/*color*.png; do
  convert "$img" -quality 85 "${img%.png}.jpg"
  rm "$img"
done
```

3. **Usa WebP** (migliore di JPG):

```bash
# Converti tutte le texture in WebP
for img in island-folder/*.{png,jpg}; do
  cwebp -q 85 "$img" -o "${img%.*}.webp"
done
```

4. **Texture Atlas** (Combina texture multiple):

- Usa Blender addon "UVPackmaster"
- O Texture Packer: https://www.codeandweb.com/texturepacker

**RISULTATO ATTESO**: 22 texture → 8-10 texture + 50% size reduction

---

### 🔥 **PRIORITÀ 3: DECIMAZIONE GEOMETRIA** (SE NECESSARIO)

**Solo se DRACO + Texture optimization non bastano**

#### **Blender**

1. Apri `island.glb` in Blender
2. Seleziona l'isola
3. Aggiungi Modifier: **Decimate**
4. Settings:
   - Collapse Type: `Collapse`
   - Ratio: `0.5` (50% dei triangoli)
   - Preserva UVs: ✅
   - Preserva Sharp Edges: ✅
5. Apply Modifier
6. Export: File → Export → glTF 2.0 (.glb)
   - Format: `GLB`
   - Include: Limit to Selected Objects
   - Transform: +Y Up
   - Geometry: Apply Modifiers ✅

**ATTENZIONE**: Controlla che il modello non sia troppo semplificato!

#### **gltf-transform (CLI)**

```bash
# Simplificazione automatica
gltf-transform simplify island-compressed.glb island-simplified.glb \
  --ratio 0.5 \
  --error 0.001
```

**RISULTATO ATTESO**: 44.2k triangles → 22k triangles

---

### 🎯 **PRIORITÀ 4: OTTIMIZZAZIONE MATERIALI**

#### **Blender - Pulizia Materiali**

1. Apri modello in Blender
2. Vai in Shading workspace
3. Per ogni materiale:

   - **Rimuovi texture inutilizzate** (es. height map se non serve)
   - **Combina materiali simili** (6 materiali → 3-4)
   - **Usa texture condivise** quando possibile

4. **Bake Lighting** (se hai molte luci statiche):

   - Rendering → Bake → Combined
   - Salva come texture unica
   - Usa material più semplice con la baked texture

5. Export nuovo GLB

**RISULTATO ATTESO**: 6 materials → 3-4 materials, texture più semplici

---

## WORKFLOW COMPLETO RACCOMANDATO

```bash
# 1. BACKUP
cp island-compressed.glb island-original.glb

# 2. OTTIMIZZA TEXTURE (in Blender o con script)
# - Riduci dimensioni a 1024px max
# - Converti in WebP/JPG dove possibile
# - Combina in atlas se possibile

# 3. DRACO COMPRESSION (OBBLIGATORIO)
gltf-pipeline -i island-compressed.glb -o island-draco.glb \
  -d \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12

# 4. VERIFICA RISULTATO
ls -lh island-draco.glb
# Target: <5MB

# 5. TEST VISIVO
# Apri in https://gltf-viewer.donmccurdy.com/
# Controlla che non ci siano artefatti

# 6. SOSTITUISCI
cp island-draco.glb public/island-compressed.glb

# 7. BUILD E TEST
npm run build
npm run preview
```

---

## RISULTATI ATTESI

### Prima:

```
island-compressed.glb: 37MB
Download time (3G): ~15 secondi
Parse time: ~2-3 secondi
Total: ~18 secondi ❌
```

### Dopo (solo DRACO):

```
island-draco.glb: 3-5MB
Download time (3G): ~2 secondi
Parse time: ~0.5 secondi
Total: ~2.5 secondi ✅
```

### Dopo (DRACO + Texture + Decimation):

```
island-optimized.glb: 1-2MB
Download time (3G): ~1 secondo
Parse time: ~0.3 secondi
Total: ~1.3 secondi ✅✅✅
```

---

## TOOLS RICHIESTI

### **MUST HAVE**:

```bash
npm install -g gltf-pipeline
# O
npm install -g @gltf-transform/cli
```

### **RECOMMENDED**:

- Blender 3.x+ (free): https://www.blender.org/
- ImageMagick (per batch resize): https://imagemagick.org/
- cwebp (per WebP): https://developers.google.com/speed/webp/download

### **OPTIONAL**:

- Texture Packer: https://www.codeandweb.com/texturepacker
- Squoosh (online): https://squoosh.app/

---

## VERIFICA FINALE

```bash
# Check file size
ls -lh public/island-compressed.glb

# Check details
gltf-pipeline -i public/island-compressed.glb --stats

# Test in browser
npm run dev
# Apri DevTools → Network → Controlla dimensione download
```

---

## TROUBLESHOOTING

### ❌ "DRACO decoder failed"

**Fix**: Verifica che il decoder path in `gltfLoader.js` sia corretto:

```js
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
```

### ❌ "Modello appare distorto dopo compression"

**Fix**: Riduci compression level:

```bash
gltf-pipeline -i island.glb -o island-draco.glb \
  -d \
  --draco.compressionLevel 7  # invece di 10
```

### ❌ "Texture sfocate"

**Fix**: Aumenta quantizeTexcoordBits:

```bash
--draco.quantizeTexcoordBits 14  # invece di 12
```

---

## NEXT STEPS

1. ✅ **START**: Applica DRACO compression (3 minuti)
2. ✅ **TEST**: Verifica che tutto funzioni
3. ⚠️ **SE ANCORA LENTO**: Ottimizza texture (30 minuti)
4. ⚠️ **SE ANCORA LENTO**: Decima geometria (15 minuti)

**PRIORITÀ ASSOLUTA**: DRACO compression. È l'unico step che ti darà 90% di miglioramento con 5 minuti di lavoro.

---

## CONTATTI TOOL

- gltf-pipeline: https://github.com/CesiumGS/gltf-pipeline
- glTF Transform: https://gltf-transform.donmccurdy.com/
- glTF Report: https://gltf.report/
- Three.js Editor: https://threejs.org/editor/
