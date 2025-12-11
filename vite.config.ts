import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  // Inject build timestamp and cache-busting version for aggressive cache invalidation
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __CACHE_VERSION__: JSON.stringify(`v${Date.now()}`), // Unique cache version per build
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg', 'icons/*.png', 'screenshots/*.png'],
      manifest: false, // Use public/manifest.json instead
      workbox: {
        // Define caching strategies - exclude large GeoJSON files from precaching
        globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2}'],
        globIgnores: ['**/data/*.json'], // Don't precache large GeoJSON files

        // Offline fallback page
        navigateFallback: '/colombia_department_puzzle/offline.html',
        navigateFallbackDenylist: [/^\/api/, /\.(js|css|png|svg|json)$/],

        // Inject unique cache version
        additionalManifestEntries: [
          {
            url: '/cache-version.json',
            revision: `${Date.now()}`, // Force cache bust on every build
          },
        ],

        // Runtime caching for different resource types
        runtimeCaching: [
          {
            // API calls or dynamic content
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              networkTimeoutSeconds: 3,
            },
          },
          {
            // Colombia map GeoJSON data
            urlPattern: /\/data\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-data-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Static assets (images, fonts)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // JavaScript and CSS bundles
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
        ],

        // Maximum cache size: 5MB
        maximumFileSizeToCacheInBytes: 5000000,

        // Clean up old caches
        cleanupOutdatedCaches: true,

        // Skip waiting and activate immediately
        skipWaiting: true,
        clientsClaim: true,
      },

      // Development options
      devOptions: {
        enabled: false, // Disable SW in development for easier debugging
        type: 'module',
      },
    }),
  ],
  base: '/colombia_department_puzzle/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Code splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'game-logic': ['@dnd-kit/core'],
          'utilities': ['d3-geo', 'zustand'],
        },
      }
    }
  },
  publicDir: 'public'
});