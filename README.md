# 🌴 3D Portfolio Island

Un portfolio 3D interattivo costruito con React e Three.js, con un'isola navigabile tramite un simpatico fenicottero volante.

## ✨ Features

- 🎨 **Scena 3D Interattiva**: Esplora un'isola 3D con navigazione tramite fenicottero
- 🚀 **Ottimizzazioni Performance**: Preload degli asset, canvas persistente, state management ottimizzato
- 📱 **Responsive Design**: Menu burger per tablet e mobile
- 🎯 **Custom Cursors**: Cursori personalizzati per un'esperienza utente unica
- 🌅 **Post-Processing Effects**: Effetti visivi configurabili (DuoTone, Bloom, Vignette)
- 📧 **Contact Form**: Form di contatto integrato con EmailJS

## 🚀 Quick Start

### Requisiti

- Node.js 16+
- npm o yarn

### Installazione

```bash

# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
npm run build
npm run preview
```

## 📦 Tecnologie

- **React 18** - UI Framework
- **Three.js** - Rendering 3D
- **React Three Fiber** - React renderer per Three.js
- **React Three Drei** - Helper utilities per R3F
- **Zustand** - State Management leggero
- **React Router** - Routing client-side
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool veloce
- **EmailJS** - Servizio email per il form di contatto

## 🏗️ Struttura del Progetto

```
src/
├── components/         # Componenti React
│   ├── DragCursor/    # Cursore drag personalizzato
│   ├── CustomCursor/  # Cursore custom per pagine
│   ├── layouts/       # Layout (AppLayout)
│   └── ...
├── models/            # Modelli 3D React Three Fiber
│   ├── Flamingo.jsx   # Fenicottero navigatore
│   ├── Island.jsx     # Isola principale
│   └── ...
├── pages/             # Pagine dell'applicazione
│   ├── Home.jsx       # Homepage con scena 3D
│   ├── Skills.jsx     # Pagina skills
│   ├── Projects.jsx   # Pagina progetti
│   ├── Contact.jsx    # Form di contatto
│   └── About.jsx      # Pagina about
├── store/             # Zustand store
├── hooks/             # Custom React hooks
├── constants/         # Costanti di configurazione
├── effects/           # Effetti post-processing
└── assets/            # Asset statici (modelli 3D, immagini)
```

## 🎮 Utilizzo

1. **Homepage**: Usa il mouse per ruotare la scena 3D e esplorare l'isola
2. **Navigazione**: Il fenicottero ti guida tra le diverse sezioni
3. **Menu**: Su mobile/tablet usa il burger menu per navigare
4. **Contact**: Compila il form per inviare un messaggio

## ⚙️ Configurazione

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Personalizzazione Modelli 3D

I modelli 3D sono nella cartella `public/` e `src/assets/3d/`. Per sostituirli, usa modelli in formato `.glb` o `.gltf`.

## 📖 Documentazione

Per documentazione dettagliata sulle ottimizzazioni e l'architettura del progetto, consulta [PROJECT_DOCS.md](./PROJECT_DOCS.md).

## 🎨 Post-Processing

Il progetto include diversi preset di effetti visivi:

- Moody Blue (default)
- Vintage Sunset
- Cyberpunk Night
- Ocean Breeze
- Forest Mood
- Warm Film

## 🐛 Troubleshooting

### Problemi comuni

**Il canvas 3D non si carica:**

- Verifica che WebGL sia supportato dal tuo browser
- Controlla la console per eventuali errori

**Il form di contatto non invia:**

- Verifica le credenziali EmailJS nel file `.env`
- Controlla la connessione internet

## 📝 License

MIT License - Vedi [LICENSE](./LICENSE) per i dettagli

## 👨‍💻 Autore

**Stefania** - Frontend Developer

- Portfolio: [Il tuo portfolio]
- GitHub: [@tuogithub]

## 🙏 Crediti

- Modelli 3D: [Fonte dei modelli se applicabile]
- Ispirazione design: Three.js Journey

---

**Made with ❤️, React and Three.js**
