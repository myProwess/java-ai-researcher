import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Java Interview Hub',
        short_name: 'JavaHub',
        theme_color: '#0f172a',
      }
    })
  ],
  base: './',
  build: {
    chunkSizeWarningLimit: 1000
  }
})
