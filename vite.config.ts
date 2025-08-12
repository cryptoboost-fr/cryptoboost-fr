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
    sourcemap: false,
    minify: 'esbuild', // Use esbuild instead of terser for better compatibility
    target: 'es2015',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Simplified chunking strategy
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@supabase/supabase-js', 'zustand']
        }
      }
    }
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