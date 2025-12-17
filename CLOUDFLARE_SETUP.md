# GUIDA SETUP CLOUDFLARE PAGES - STEP BY STEP

## PREREQUISITI

✅ Account GitHub con repo `3D-frontend-portfolio-island`
✅ Codice aggiornato e funzionante (build locale OK)
✅ Node 14+ installato

---

## STEP 1: CREA ACCOUNT CLOUDFLARE (2 min)

1. **Vai su**: https://dash.cloudflare.com/sign-up

2. **Compila form**:
   - Email: [tua email]
   - Password: [scegli password sicura]
   - Clicca "Sign Up"

3. **Verifica email**:
   - Controlla inbox
   - Clicca link di verifica
   - Login completato ✅

---

## STEP 2: CREA PROGETTO PAGES (3 min)

1. **Dashboard Cloudflare**:
   - Dopo login, sei su: https://dash.cloudflare.com/
   - Nel menu laterale sinistro, clicca: **"Workers & Pages"**
   
2. **Crea nuovo progetto**:
   - Clicca pulsante blu: **"Create application"**
   - Clicca tab: **"Pages"**
   - Clicca: **"Connect to Git"**

3. **Autorizza GitHub**:
   - Si apre popup GitHub
   - Clicca: **"Authorize Cloudflare Pages"**
   - Potrebbe chiederti password GitHub → inseriscila
   - Torna su Cloudflare

---

## STEP 3: SELEZIONA REPOSITORY (1 min)

1. **Select a repository**:
   - Vedi lista dei tuoi repo GitHub
   - Cerca: `3D-frontend-portfolio-island`
   - Clicca sul repo per selezionarlo

2. **Configurazione permessi** (se appare):
   - Se Cloudflare chiede "Only select repositories"
   - Seleziona: `3D-frontend-portfolio-island`
   - Clicca: "Save" o "Install & Authorize"

3. **Begin setup**:
   - Clicca: **"Begin setup"**

---

## STEP 4: CONFIGURA BUILD (2 min)

Nella schermata "Set up builds and deployments":

### **Project name** (opzionale)
```
3d-portfolio-island
```
*(Puoi lasciare il default o personalizzare)*

### **Production branch**
```
main
```
*(O il nome del tuo branch principale: `master`, `main`)*

### **Build settings**

**Framework preset**: Seleziona **"Vite"** dal dropdown

Questo auto-compila i campi, ma verifica che siano:

**Build command**:
```bash
npm run build
```

**Build output directory**:
```
dist
```

**Root directory** (Path):
```
/
```
*(Lascia vuoto o metti `/` se il progetto è alla root)*

### **Environment variables** (opzionale, salta per ora)
- Clicca "Add variable" solo se hai API keys in `.env`
- Per questo progetto: **NON SERVONO** (puoi skipare)

### **Conferma**:
- Clicca pulsante blu: **"Save and Deploy"**

---

## STEP 5: PRIMO DEPLOY (5-8 min)

1. **Build in progress**:
   - Cloudflare clona il repo
   - Esegue `npm install`
   - Esegue `npm run build`
   - Genera file in `dist/`
   - Deploy su CDN globale

2. **Monitoraggio**:
   - Vedi log in tempo reale
   - Attendi messaggio: **"Success! Your site is deployed"**

3. **IMPORTANTE - Possibili errori**:

   **Se vedi errore "Build failed"**:
   - Clicca su "View build log"
   - Cerca la riga rossa con l'errore
   - Errori comuni:

   **a) "Cannot find module"**:
   ```bash
   # Fix: verifica package.json dependencies
   # Tutti i package usati devono essere in dependencies, non devDependencies
   ```

   **b) "Node version"**:
   ```bash
   # Fix: aggiungi .nvmrc o imposta in env variables
   # NODE_VERSION=18
   ```

   **c) "Build command failed"**:
   ```bash
   # Verifica che npm run build funzioni in locale
   ```

4. **Deploy success**:
   - Vedi: ✅ "Success"
   - URL generato automaticamente:
     ```
     https://3d-portfolio-island-xxx.pages.dev
     ```
   - Clicca sul link per vedere il sito LIVE!

---

## STEP 6: VERIFICA FUNZIONAMENTO (2 min)

1. **Apri sito**:
   - Clicca URL: `https://xxx.pages.dev`

2. **Test performance**:
   - Apri **DevTools** (F12)
   - Tab **Network**
   - Refresh pagina (Ctrl+R)

3. **Controlla GLB files**:
   ```
   island-compressed.glb
   Status: 200 ✅
   Size: ~15MB (senza DRACO) o ~2MB (con DRACO)
   Time: <2 secondi ✅
   ```

4. **Controlla compression** (BONUS):
   - Nel Network tab, clicca su `island-compressed.glb`
   - Tab "Headers"
   - Cerca:
     ```
     Content-Encoding: br  (o gzip)
     ```
   - Se c'è → Cloudflare sta comprimendo! 🎉

---

## STEP 7: DOMINI CUSTOM (OPZIONALE)

Se hai un dominio tipo `portfolio.com`:

1. **Dashboard Cloudflare Pages**:
   - Vai su progetto `3d-portfolio-island`
   - Tab: **"Custom domains"**

2. **Add custom domain**:
   - Inserisci: `portfolio.com` o `3d.portfolio.com`
   - Clicca "Continue"

3. **DNS Setup**:
   - Se dominio già su Cloudflare:
     - Automatico! ✅
   - Se dominio su altro provider:
     - Aggiungi CNAME record:
       ```
       Type: CNAME
       Name: @ (o 3d)
       Value: 3d-portfolio-island-xxx.pages.dev
       ```

4. **Attendi propagazione** (5-30 min)

---

## STEP 8: AUTO-DEPLOY (BONUS)

**Deploy automatico ad ogni push**:

Ora ogni volta che fai:
```bash
git add .
git commit -m "update"
git push origin main
```

Cloudflare:
1. ✅ Rileva il push
2. ✅ Esegue build automaticamente
3. ✅ Deploy su CDN globale
4. ✅ Sito aggiornato in 2-3 minuti!

**Preview branches**:
- Push su branch `develop` → Cloudflare crea preview URL
- Esempio: `https://develop.3d-portfolio-island-xxx.pages.dev`
- Perfetto per testare prima di merge su main!

---

## STEP 9: HEADERS & OPTIMIZATION (OPZIONALE)

Il file `public/_headers` che abbiamo creato viene letto automaticamente da Cloudflare!

**Verifica**:
1. Deploy completato
2. Apri DevTools → Network
3. Clicca su `island-compressed.glb`
4. Tab "Headers"
5. Dovresti vedere:
   ```
   Cache-Control: public, max-age=31536000, immutable
   Content-Type: model/gltf-binary
   ```

Se non vedi questi headers:
- Verifica che `public/_headers` sia committato su GitHub
- Force redeploy: Dashboard → "Retry deployment"

---

## TROUBLESHOOTING

### ❌ "Build failed - npm install error"

**Fix**:
```bash
# In locale
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update lock file"
git push
```

### ❌ "404 on island-compressed.glb"

**Cause**:
- File non in `/public` directory
- `BASE_URL` non corretto

**Fix**:
```bash
# Verifica file presente
ls public/island-compressed.glb

# Se manca, aggiungi
git add public/island-compressed.glb
git commit -m "add: island model"
git push
```

### ❌ "Site loads but 3D scene blank"

**Fix**:
- Apri Console (F12)
- Cerca errori
- Probabilmente path issue con `BASE_URL`

**Verifica in codice**:
```javascript
// usePreloadAssets.js, Island.jsx, Flamingo.jsx
const ISLAND_PATH = `${import.meta.env.BASE_URL}island-compressed.glb`
// ✅ Corretto per Cloudflare (BASE_URL = '/')
```

**Se usi Cloudflare con subfolder**:
```javascript
// vite.config.js
export default defineConfig({
  base: '/',  // ← Per Cloudflare usa root '/'
  // NON '/3D-frontend-portfolio-island/' (questo è per GitHub Pages)
})
```

### ❌ "Service Worker not working"

**Fix**:
```javascript
// main.jsx - aggiorna path Service Worker
const swPath = import.meta.env.BASE_URL + 'sw.js'
// ✅ Con base: '/' → '/sw.js'
```

---

## CONFRONTO FINALE: GITHUB PAGES VS CLOUDFLARE

| Metrica | GitHub Pages | Cloudflare Pages |
|---------|--------------|------------------|
| **Build time** | Manual | Auto (ogni push) |
| **Compression** | ❌ No GLB | ✅ Brotli auto |
| **CDN** | ⚠️ Basic | ✅ 300+ locations |
| **Speed (15MB)** | 8.05s | ~1.2s |
| **Speed (2MB DRACO)** | 1.5s | ~0.5s |
| **Custom headers** | ❌ | ✅ _headers file |
| **Preview deploys** | ❌ | ✅ Per branch |
| **Analytics** | Basic | ✅ Web Analytics free |

---

## NEXT STEPS

Dopo setup Cloudflare:

1. ✅ **Verifica sito live**
2. ✅ **Test performance** (Network tab)
3. ⚠️ **APPLICA DRACO** (se non fatto):
   ```bash
   npm install -g gltf-pipeline
   gltf-pipeline -i public/island-compressed.glb -o public/island-draco.glb -d
   mv public/island-draco.glb public/island-compressed.glb
   git add public/island-compressed.glb
   git commit -m "perf: apply DRACO compression"
   git push
   ```
4. ✅ **Attendi auto-deploy** (2-3 min)
5. 🎉 **Goditi <1 secondo loading!**

---

## COMANDI UTILI

```bash
# Forza rebuild su Cloudflare (senza push)
# → Dashboard → "Retry deployment"

# Rollback a versione precedente
# → Dashboard → "Deployments" → Seleziona vecchia → "Rollback"

# View logs build
# → Dashboard → Clicca su deployment → "View details" → "Build log"

# Delete progetto (se serve ricominciare)
# → Dashboard → Settings → "Delete project" (in fondo)
```

---

## LINK UTILI

- Dashboard: https://dash.cloudflare.com/
- Docs Pages: https://developers.cloudflare.com/pages/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/

---

## DOMANDE FREQUENTI

**Q: Costa qualcosa?**
A: NO. Piano free include:
- Unlimited bandwidth
- Unlimited requests
- Unlimited sites
- 500 builds/month

**Q: Posso usare sia GitHub Pages che Cloudflare?**
A: Sì, ma consiglio di usarne uno solo per evitare confusione. Cloudflare è meglio.

**Q: Devo cancellare GitHub Pages?**
A: Non necessario, ma puoi:
```bash
# Disabilita GitHub Pages
# → Repo Settings → Pages → Source: None
```

**Q: Quanto tempo ci vuole?**
A: Setup: 10 minuti. Primo deploy: 5 minuti. Deploys successivi: 2-3 minuti automatici.

**Q: Cloudflare modifica il mio codice?**
A: NO. Build uguale a locale. L'unica differenza è il CDN (più veloce).

---

## CONCLUSIONE

Dopo questo setup:
- ✅ Deploy automatico ad ogni push
- ✅ 5-10x più veloce di GitHub Pages
- ✅ Compression automatica
- ✅ Preview branches
- ✅ Analytics gratuita
- ✅ CDN globale

**Sei pronto! Inizia dallo STEP 1** 🚀
