import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Désactiver les sourcemaps en production
    minify: 'terser', // Utiliser Terser pour une meilleure minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimized vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['zustand', 'clsx', 'tailwind-merge'],

          // Feature-based chunks for better caching
          'auth-features': [
            './src/store/auth',
            './src/components/ProtectedRoute'
          ],
          'ui-components': [
            './src/components/ui/Button',
            './src/components/ui/Input',
            './src/components/ui/Card'
          ]
        },
        // Optimiser les noms de fichiers
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    // Optimisations de build
    target: 'es2015', // Support des navigateurs modernes
    cssCodeSplit: true,
    reportCompressedSize: false, // Améliorer les performances de build
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    host: true,
    // Configuration pour le développement
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Optimisations pour la production
  define: {
    __DEV__: process.env.NODE_ENV === 'development'
  },
  // Optimisations CSS
  css: {
    postcss: './postcss.config.cjs'
  },
  // Optimisations d'import
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'framer-motion',
      'zustand'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Configuration pour Netlify
  preview: {
    port: 4173,
    host: true
  }
})