import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'add-nojekyll',
      closeBundle() {
        writeFileSync('dist/.nojekyll', '')
      },
    },
  ],
  base: '/3D-frontend-portfolio-island/',
  assetsInclude: ['**/*.glb'],
})
