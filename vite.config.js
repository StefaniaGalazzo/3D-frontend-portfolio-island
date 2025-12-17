import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { gzipSync, brotliCompressSync, constants } from 'zlib'
import { resolve } from 'path'

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
    {
      name: 'compress-glb',
      closeBundle() {
        const glbFiles = ['flamingo.glb', 'island-compressed.glb']

        glbFiles.forEach((file) => {
          const filePath = resolve('dist', file)
          if (existsSync(filePath)) {
            const content = readFileSync(filePath)

            // Create gzip version
            const gzipped = gzipSync(content, { level: 9 })
            writeFileSync(`${filePath}.gz`, gzipped)

            // Create brotli version (better compression)
            const brotlied = brotliCompressSync(content, {
              params: {
                [constants.BROTLI_PARAM_QUALITY]: 11,
              },
            })
            writeFileSync(`${filePath}.br`, brotlied)

            console.log(`[Compress] ${file}:`)
            console.log(`  Original: ${(content.length / 1024).toFixed(2)} KB`)
            console.log(
              `  Gzip:     ${(gzipped.length / 1024).toFixed(2)} KB (${((1 - gzipped.length / content.length) * 100).toFixed(1)}% reduction)`
            )
            console.log(
              `  Brotli:   ${(brotlied.length / 1024).toFixed(2)} KB (${((1 - brotlied.length / content.length) * 100).toFixed(1)}% reduction)`
            )
          }
        })
      },
    },
  ],
  
  // IMPORTANTE: Per Cloudflare Pages usa '/' (root)
  // Per GitHub Pages usa '/3D-frontend-portfolio-island/'
  base: '/',
  
  assetsInclude: ['**/*.glb'],

  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-addons': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },

  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },

  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
    },
  },
})
