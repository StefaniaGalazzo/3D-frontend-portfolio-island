# CLOUDFLARE PAGES SETUP - CHECKLIST

## PRE-SETUP

- [ ] Node 14+ installato (`node -v`)
- [ ] Build locale funzionante (`npm run build`)
- [ ] Codice pushato su GitHub (branch `main`)
- [ ] File `public/_headers` presente
- [ ] Service Worker `public/sw.js` presente

---

## SETUP (15 minuti totali)

### 1. ACCOUNT (2 min)
- [ ] Vai su: https://dash.cloudflare.com/sign-up
- [ ] Registrati con email/password
- [ ] Verifica email (clicca link)
- [ ] Login completato

### 2. CREA PROGETTO (3 min)
- [ ] Dashboard → Menu laterale → **"Workers & Pages"**
- [ ] Click: **"Create application"**
- [ ] Tab: **"Pages"**
- [ ] Click: **"Connect to Git"**
- [ ] Autorizza GitHub (popup)

### 3. REPOSITORY (1 min)
- [ ] Seleziona: `3D-frontend-portfolio-island`
- [ ] Click: **"Begin setup"**

### 4. BUILD CONFIG (2 min)
- [ ] **Project name**: `3d-portfolio-island` (o custom)
- [ ] **Production branch**: `main`
- [ ] **Framework preset**: `Vite`
- [ ] **Build command**: `npm run build` (auto-compilato)
- [ ] **Build output**: `dist` (auto-compilato)
- [ ] **Root directory**: `/` (lascia vuoto)
- [ ] Click: **"Save and Deploy"**

### 5. DEPLOY (5-8 min)
- [ ] Attendi build (vedi log in tempo reale)
- [ ] Status: ✅ "Success! Your site is deployed"
- [ ] Copia URL: `https://xxx.pages.dev`

### 6. TEST (2 min)
- [ ] Apri URL in browser
- [ ] Sito carica? ✅
- [ ] 3D scene visibile? ✅
- [ ] DevTools → Network → `island-compressed.glb` 200? ✅
- [ ] Tempo download <2s? ✅

---

## POST-SETUP (OPZIONALE)

### VERIFICA COMPRESSION
- [ ] DevTools → Network → `island-compressed.glb`
- [ ] Headers → Cerca `Content-Encoding: br` o `gzip`
- [ ] Se presente → ✅ Compression attiva!

### APPLICA DRACO (se non fatto)
```bash
npm install -g gltf-pipeline
gltf-pipeline -i public/island-compressed.glb -o public/island-draco.glb -d
mv public/island-draco.glb public/island-compressed.glb
git add public/island-compressed.glb
git commit -m "perf: DRACO compression"
git push
```
- [ ] Attendi auto-deploy (2-3 min)
- [ ] Refresh sito
- [ ] File size ridotto 15MB → 2MB? ✅
- [ ] Loading time <1s? ✅

### CUSTOM DOMAIN (opzionale)
- [ ] Dashboard → Progetto → **"Custom domains"**
- [ ] Add domain: `tuodiminio.com`
- [ ] Configura DNS (CNAME)
- [ ] Attendi propagazione (5-30 min)

---

## TROUBLESHOOTING RAPIDO

### ❌ Build failed
```bash
# In locale
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: lock file"
git push
```
→ Cloudflare auto-rebuild

### ❌ 404 su GLB files
- Verifica: `ls public/island-compressed.glb`
- Se manca: `git add public/*.glb && git push`

### ❌ 3D scene blank
- Console errors? (F12)
- Probabilmente path issue
- Verifica `BASE_URL` in codice

### ❌ Slow loading ancora
- DRACO applicato? (file deve essere ~2MB)
- Compression attiva? (vedi headers)
- Service Worker registrato? (Application tab in DevTools)

---

## SUCCESS METRICS

✅ **Setup completato quando**:
- Sito live su `https://xxx.pages.dev`
- 3D scene renderizza correttamente
- Loading time <2s (senza DRACO) o <1s (con DRACO)
- Auto-deploy funziona (push → auto-build → live)

---

## COMANDI UTILI

```bash
# Trigger manual redeploy
# → Dashboard → "Retry deployment"

# View build logs
# → Dashboard → Click deployment → "View details"

# Rollback version
# → Dashboard → "Deployments" → Select old → "Rollback"
```

---

## LINK RAPIDI

- **Dashboard**: https://dash.cloudflare.com/
- **Docs**: https://developers.cloudflare.com/pages/
- **Support**: https://community.cloudflare.com/

---

## TIMELINE

| Step | Tempo | Azione |
|------|-------|--------|
| 1 | 2 min | Crea account |
| 2-4 | 5 min | Setup progetto |
| 5 | 5-8 min | Primo deploy |
| 6 | 2 min | Test sito |
| **TOTALE** | **~15 min** | **Setup completo** |

---

## DOPO SETUP

Ogni push su `main`:
1. Cloudflare rileva automaticamente
2. Esegue `npm run build`
3. Deploy su CDN
4. Sito live in 2-3 minuti

**Zero configurazione aggiuntiva necessaria!** 🎉

---

**Ora inizia con lo STEP 1 su `CLOUDFLARE_SETUP.md`** →
