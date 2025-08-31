import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/financitos/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Financitos - Gestão Financeira',
        short_name: 'Financitos',
        description: 'PWA para gestão de finanças pessoais com sincronização Google Drive',
        theme_color: '#139469',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true
  }
})