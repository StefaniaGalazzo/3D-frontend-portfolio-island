# 📚 DOCUMENTATION INDEX

## 🎯 QUICK ACCESS

### **Per Sviluppatori**
- 📖 [`README.md`](./README.md) - Quick start, features, setup
- 🏗️ [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) - Architettura completa del progetto
- 🎨 [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) - Loading & optimization modelli 3D

### **Per Deploy**
- 🚀 [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md) - Setup Cloudflare Pages (10-15 min)
- 🔒 [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) - Security checklist & best practices

---

## 📖 GUIDE DETTAGLIATE

### **README.md**
**Contenuto**:
- Quick start & installation
- Tech stack overview
- Performance metrics
- Project structure
- Troubleshooting basics

**Per chi è**:
- Nuovi developer che clonano il repo
- Quick reference per comandi base
- Overview generale del progetto

---

### **PROJECT_DOCS.md**
**Contenuto**:
- Architettura completa applicazione
- State management (Zustand)
- Sistema loading progressivo
- Features principali (Canvas persistente, PostProcessing lazy, etc)
- Ottimizzazioni performance dettagliate
- Best practices & patterns applicati

**Per chi è**:
- Developer che devono capire come funziona il progetto
- Onboarding nuovi membri team
- Reference per architettura e design decisions

---

### **3D_MODELS_GUIDE.md**
**Contenuto**:
- Sistema di preload modelli
- Runtime optimization (texture, materiali, geometria)
- DRACO compression setup
- Device detection adaptive quality
- Performance metrics modelli
- Troubleshooting loading issues

**Per chi è**:
- Developer che lavorano sui modelli 3D
- Ottimizzazione performance
- Debug problemi di loading

---

### **CLOUDFLARE_GUIDE.md**
**Contenuto**:
- Setup Cloudflare Pages step-by-step (6 passi, 10-15 min)
- Configurazione build & environment
- Verifica funzionamento & performance
- DRACO compression (opzionale)
- Troubleshooting deploy
- Custom domain setup
- Monitoring & analytics

**Per chi è**:
- Setup iniziale deployment
- Migrare da GitHub Pages
- Configurare CI/CD

---

### **SECURITY_AUDIT.md**
**Contenuto**:
- Audit completo sicurezza progetto
- `.gitignore` verification
- Environment variables management
- EmailJS keys (pubbliche per design)
- Best practices sicurezza frontend
- Raccomandazioni opzionali

**Per chi è**:
- Security review
- Verifica prima del deploy production
- Compliance check

---

## 🎓 LEARNING PATH

### **1. Prima volta nel progetto?**
Leggi in ordine:
1. [`README.md`](./README.md) - Quick overview
2. [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) - Architettura dettagliata
3. [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) - Come funzionano i modelli

### **2. Devi deployare?**
1. [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) - Verifica sicurezza
2. [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md) - Setup deployment

### **3. Problemi di performance?**
1. [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) - Optimization checklist
2. [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) → Section "Ottimizzazioni Performance"

### **4. Debugging?**
1. [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) → Section "Troubleshooting"
2. [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) → Section "Troubleshooting"
3. [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md) → Section "Troubleshooting"

---

## 📊 DOCUMENTATION STRUCTURE

```
Documentation/
├── README.md                    # Entry point, quick start
├── PROJECT_DOCS.md              # Complete technical docs
├── 3D_MODELS_GUIDE.md          # Models management
├── CLOUDFLARE_GUIDE.md         # Deployment guide
├── SECURITY_AUDIT.md           # Security checklist
└── DOCS_INDEX.md               # This file (navigation)
```

---

## 🔍 QUICK SEARCH

### **Come faccio a...**

**...deployare il progetto?**
→ [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md)

**...ottimizzare i modelli 3D?**
→ [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) → Section "DRACO Compression"

**...capire il sistema di loading?**
→ [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) → Section "Sistema di Caricamento"

**...configurare environment variables?**
→ [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) → Section "Environment Variables"

**...fixare schermata bianca dopo deploy?**
→ [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md) → Section "Troubleshooting"

**...migliorare le performance?**
→ [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) → Section "Optimization Checklist"

**...aggiungere una nuova isola?**
→ [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) → Section "Customization"

**...gestire la sicurezza?**
→ [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md)

---

## 📝 MAINTENANCE

### **Aggiornare la documentazione**

Quando modifichi il codice, aggiorna anche:

**Nuova feature**:
- `README.md` → Section "Features"
- `PROJECT_DOCS.md` → Section appropriata

**Cambio architettura**:
- `PROJECT_DOCS.md` → Section "Architettura"

**Nuova ottimizzazione**:
- `3D_MODELS_GUIDE.md` o `PROJECT_DOCS.md`

**Cambio deployment**:
- `CLOUDFLARE_GUIDE.md`

**Issue sicurezza**:
- `SECURITY_AUDIT.md`

---

## 🎯 DOCUMENT VERSIONS

All docs are versioned with the project.

**Current version**: v2.0 (Dicembre 2024)

**Changes from v1.0**:
- ✅ Cloudflare Pages deployment (prima GitHub Pages)
- ✅ Runtime optimization modelli
- ✅ Lazy PostProcessing
- ✅ Device detection adaptive
- ✅ Service Worker caching
- ✅ Security audit completo

---

## 🤝 CONTRIBUTING TO DOCS

Se trovi errori o vuoi migliorare la documentazione:

1. Fork repository
2. Edit Markdown file
3. Submit Pull Request

**Style guide**:
- Use emoji per sezioni principali (📚 🎯 ✨)
- Code blocks con syntax highlighting
- Tables per comparisons
- Clear headers hierarchy
- Link interni tra documenti

---

## 📬 SUPPORT

Se hai domande sulla documentazione:

1. Check questo index per trovare il doc giusto
2. Leggi sezione "Troubleshooting" nel doc appropriato
3. Open issue su GitHub se non trovi risposta

---

_Documentation Index v1.0_  
_Last updated: Dicembre 2024_
