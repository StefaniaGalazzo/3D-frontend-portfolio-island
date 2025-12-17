# 🏝️ 3D Portfolio Island

Interactive 3D portfolio built with **React Three Fiber** featuring a navigable island with orbital camera controls.

[![Deploy Status](https://img.shields.io/badge/deploy-cloudflare_pages-orange)](https://3d-frontend-portfolio-island.pages.dev/)
[![Performance](https://img.shields.io/badge/performance-optimized-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

**Live Demo**: [3d-frontend-portfolio-island.pages.dev](https://3d-frontend-portfolio-island.pages.dev/)

---

## ✨ Features

- 🎮 **Interactive 3D Navigation** - Orbital camera con Flamingo animato
- 🏝️ **Animated Island** - Modello 3D con animazioni GLTF
- 💫 **Post-Processing Effects** - Bloom, vignette, duo-tone (lazy-loaded)
- 📱 **Fully Responsive** - Adaptive quality per mobile/desktop
- ⚡ **Performance Optimized** - <1s time-to-interactive
- 🎨 **Custom Cursor** - Drag cursor per migliore UX
- 🌐 **SPA Routing** - React Router con GitHub Pages/Cloudflare support

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ 
- npm or yarn

### **Installation**

```bash
# Clone repository
git clone https://github.com/stefaniagalazzo/3D-frontend-portfolio-island.git

# Navigate to project
cd 3D-frontend-portfolio-island

# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser at `http://localhost:5173`

---

## 📦 Build & Deploy

### **Local Build**

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### **Deploy to Cloudflare Pages**

**Automatic deployment** on every push to `main` branch.

**Manual setup**: See [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md)

---

## 🛠️ Tech Stack

### **Core**
- [React 18](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Three.js](https://threejs.org/) - 3D engine
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers

### **State & Routing**
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Router](https://reactrouter.com/) - Client-side routing

### **Styling**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Leva](https://github.com/pmndrs/leva) - GUI controls (dev only)

### **Deployment**
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting & CDN

---

## 📊 Performance

### **Metrics**

| Metric | Value | Status |
|--------|-------|--------|
| **Time to Interactive** | <1s | ✅ |
| **First Contentful Paint** | <0.5s | ✅ |
| **Largest Contentful Paint** | <1.5s | ✅ |
| **Cumulative Layout Shift** | 0 | ✅ |

### **Optimizations**

- ✅ **Parallel preload** con `Promise.all()`
- ✅ **Runtime texture optimization** (1024px desktop, 512px mobile)
- ✅ **Lazy-loaded PostProcessing** (dopo stabilizzazione scena)
- ✅ **Device-adaptive quality** (mobile vs desktop)
- ✅ **Brotli compression** automatica (Cloudflare)
- ✅ **Service Worker caching** (secondo load istantaneo)

**Memory usage**: 80MB (down from 220MB)

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Scene3D.jsx     # Main 3D canvas
│   ├── WelcomeModal.jsx
│   └── ...
├── models/             # 3D models
│   ├── Flamingo.jsx
│   ├── Island.jsx
│   └── Plumbob.jsx
├── pages/              # Route pages
│   ├── Home.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   └── ...
├── hooks/              # Custom hooks
│   ├── usePreloadAssets.js
│   └── ...
├── store/              # Zustand store
│   └── useAppStore.js
├── utils/              # Utilities
│   ├── gltfOptimizer.js
│   └── deviceDetection.js
└── constants/          # Configuration
    └── islandConfig.js
```

---

## 📚 Documentation

### **Main Docs**

- [`PROJECT_DOCS.md`](./PROJECT_DOCS.md) - Complete technical documentation
- [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) - Models loading & optimization
- [`CLOUDFLARE_GUIDE.md`](./CLOUDFLARE_GUIDE.md) - Deployment guide
- [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md) - Security checklist

### **Key Concepts**

#### **Progressive Loading**
```
Preload → Cache → Mount → GPU Render → Ready
  ↓       ↓       ↓       ↓            ↓
 10%     40%    80%    100%    Modal closes
```

#### **Persistent Canvas**
Canvas monta **una volta** e persiste durante navigazione → zero flickering.

#### **Lazy PostProcessing**
Effects caricano **dopo** primo render → modal chiude velocemente.

---

## 🎨 Customization

### **Island Configuration**

Edit `src/constants/islandConfig.js`:

```javascript
export const ISLANDS = [
  {
    id: 'main',
    stage: 1,
    position: { x: 0, y: 0, z: 0 },
    plumbobOffset: { x: 0, y: 2, z: -5 },
    color: '#00ff00',
    linkTo: '/skills',
    text: 'Skills',
  },
  // Add more islands...
]
```

### **Camera Settings**

Edit `src/components/Scene3D.jsx`:

```javascript
const { minDist, maxDist, rotSpeed } = useControls('Camera', {
  minDist: { value: 12, min: 5, max: 80 },
  maxDist: { value: 25, min: 10, max: 200 },
  rotSpeed: { value: 0.9, min: 0.1, max: 3 },
})
```

### **PostProcessing Effects**

Enable/disable in `src/components/PostProcessing.jsx`.

---

## 🐛 Troubleshooting

### **White Screen on Deploy**

**Cause**: Wrong `basename` in router

**Fix**:
```javascript
// src/App.jsx
<BrowserRouter basename='/'>  // Cloudflare
<BrowserRouter basename='/repo-name'>  // GitHub Pages
```

### **Slow Loading**

**Cause**: Large model files (>15MB)

**Fix**: Apply DRACO compression
```bash
npm install -g gltf-pipeline
gltf-pipeline -i model.glb -o model-draco.glb -d
```

See [`3D_MODELS_GUIDE.md`](./3D_MODELS_GUIDE.md) for details.

### **404 on GLB Files**

**Cause**: Files not in `/public` or wrong path

**Fix**:
```javascript
const PATH = `${import.meta.env.BASE_URL}model.glb`
```

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Stefania Galazzo**

- Website: [stefaniagalazzo.com](https://stefaniagalazzo.com)
- GitHub: [@stefaniagalazzo](https://github.com/stefaniagalazzo)
- Portfolio: [3d-frontend-portfolio-island.pages.dev](https://3d-frontend-portfolio-island.pages.dev/)

---

## 🙏 Acknowledgments

- 3D Models: Custom created
- Icons: [React Icons](https://react-icons.github.io/react-icons/)
- Fonts: [Google Fonts](https://fonts.google.com/)
- Hosting: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/stefaniagalazzo/3D-frontend-portfolio-island?style=social)
![GitHub Forks](https://img.shields.io/github/forks/stefaniagalazzo/3D-frontend-portfolio-island?style=social)
![GitHub Issues](https://img.shields.io/github/issues/stefaniagalazzo/3D-frontend-portfolio-island)

---

_Built with ❤️ using React Three Fiber_
