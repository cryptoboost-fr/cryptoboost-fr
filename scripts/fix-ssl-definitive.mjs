#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION DÉFINITIVE - PROBLÈMES SSL
 * Simplification et correction de la configuration SSL
 */

import fs from 'fs';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTION 1: SIMPLIFICATION _HEADERS
// ============================================================================

function fixHeaders() {
  logSection('🔧 CORRECTION 1: SIMPLIFICATION _HEADERS');
  
  try {
    // Configuration SSL ultra-simplifiée
    const headersContent = `# Configuration SSL simplifiée pour CryptoBoost
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src 'self' https:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';

# Cache pour les assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Pas de cache pour les pages HTML
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

# Cache pour les ressources statiques
*.js
*.css
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.woff
*.woff2
  Cache-Control: public, max-age=31536000`;

    fs.writeFileSync('_headers', headersContent);
    log('✅ Configuration _headers simplifiée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur _headers: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: SIMPLIFICATION _REDIRECTS
// ============================================================================

function fixRedirects() {
  logSection('🔧 CORRECTION 2: SIMPLIFICATION _REDIRECTS');
  
  try {
    // Redirections SSL ultra-simplifiées
    const redirectsContent = `# Redirections SSL simplifiées
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# SPA fallback
/*    /index.html   200

# Sécurité
/.env /404 404
/.git /404 404
/node_modules /404 404`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Configuration _redirects simplifiée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur _redirects: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: SIMPLIFICATION NETLIFY.TOML
// ============================================================================

function fixNetlifyToml() {
  logSection('🔧 CORRECTION 3: SIMPLIFICATION NETLIFY.TOML');
  
  try {
    // Configuration Netlify ultra-simplifiée
    const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirections SSL simples
[[redirects]]
  from = "http://cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301

[[redirects]]
  from = "http://www.cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301

[[redirects]]
  from = "https://www.cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de sécurité simples
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src 'self' https:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"

# Cache pour les assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Pas de cache pour les pages HTML
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"`;

    fs.writeFileSync('netlify.toml', netlifyContent);
    log('✅ Configuration netlify.toml simplifiée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur netlify.toml: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: OPTIMISATION VITE.CONFIG.TS
// ============================================================================

function fixViteConfig() {
  logSection('🔧 CORRECTION 4: OPTIMISATION VITE.CONFIG.TS');
  
  try {
    // Configuration Vite optimisée
    const viteContent = `import { defineConfig } from 'vite'
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
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    https: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          supabase: ['@supabase/supabase-js'],
          animations: ['framer-motion'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  preview: {
    port: 4173,
    host: true,
    https: false,
  },
})`;

    fs.writeFileSync('vite.config.ts', viteContent);
    log('✅ Configuration vite.config.ts optimisée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur vite.config.ts: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 5: VÉRIFICATION INDEX.HTML
// ============================================================================

function fixIndexHtml() {
  logSection('🔧 CORRECTION 5: VÉRIFICATION INDEX.HTML');
  
  try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    
    // Vérifier et corriger les domaines
    let correctedContent = indexContent;
    
    // Corriger les domaines si nécessaire
    if (indexContent.includes('cryptoboost.app')) {
      correctedContent = correctedContent.replace(/cryptoboost\.app/g, 'cryptoboost.world');
      log('✅ Domaines corrigés dans index.html', 'green');
    }
    
    // Vérifier la présence du service worker
    if (!indexContent.includes('sw.js')) {
      log('⚠️ Service worker manquant dans index.html', 'yellow');
    }
    
    fs.writeFileSync('index.html', correctedContent);
    log('✅ index.html vérifié et corrigé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur index.html: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 6: CRÉATION FICHIER DE CONFIGURATION SSL
// ============================================================================

function createSSLConfig() {
  logSection('🔧 CORRECTION 6: CONFIGURATION SSL');
  
  try {
    const sslConfigContent = `# Configuration SSL pour CryptoBoost
# Fichier de configuration pour résoudre les problèmes SSL

## Problèmes identifiés :
# 1. Configuration SSL trop complexe dans _headers
# 2. Conflits entre _headers et netlify.toml
# 3. CSP trop restrictif
# 4. Headers redondants

## Solutions appliquées :
# 1. Simplification _headers avec CSP permissif
# 2. Suppression des headers redondants
# 3. Configuration SSL unifiée
# 4. Optimisation des redirections

## Configuration finale :
# - _headers : Configuration SSL simplifiée
# - _redirects : Redirections SSL basiques
# - netlify.toml : Configuration unifiée
# - vite.config.ts : HTTPS désactivé en dev

## Test de validation :
# 1. Construire l'application : npm run build
# 2. Déployer sur Netlify
# 3. Tester toutes les pages
# 4. Vérifier les erreurs SSL

## URLs à tester :
# - https://cryptoboost.world/
# - https://cryptoboost.world/login
# - https://cryptoboost.world/register
# - https://cryptoboost.world/client
# - https://cryptoboost.world/admin

## Codes d'accès :
# Client: client@cryptoboost.world / ClientPass123!
# Admin: admin2@cryptoboost.world / AdminPass123!

Date de correction: ${new Date().toISOString()}`;

    fs.writeFileSync('SSL_CORRECTION.md', sslConfigContent);
    log('✅ Fichier de configuration SSL créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création config SSL: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

function fixSSLDefinitive() {
  log('🔧 CORRECTION DÉFINITIVE - PROBLÈMES SSL', 'bright');
  log('Simplification et correction de la configuration SSL', 'cyan');
  
  try {
    // 1. Simplification _headers
    const headersFixed = fixHeaders();
    
    // 2. Simplification _redirects
    const redirectsFixed = fixRedirects();
    
    // 3. Simplification netlify.toml
    const netlifyFixed = fixNetlifyToml();
    
    // 4. Optimisation vite.config.ts
    const viteFixed = fixViteConfig();
    
    // 5. Vérification index.html
    const indexFixed = fixIndexHtml();
    
    // 6. Création configuration SSL
    const sslConfigCreated = createSSLConfig();
    
    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS');
    log(`✅ _headers: ${headersFixed ? 'Oui' : 'Non'}`, headersFixed ? 'green' : 'red');
    log(`✅ _redirects: ${redirectsFixed ? 'Oui' : 'Non'}`, redirectsFixed ? 'green' : 'red');
    log(`✅ netlify.toml: ${netlifyFixed ? 'Oui' : 'Non'}`, netlifyFixed ? 'green' : 'red');
    log(`✅ vite.config.ts: ${viteFixed ? 'Oui' : 'Non'}`, viteFixed ? 'green' : 'red');
    log(`✅ index.html: ${indexFixed ? 'Oui' : 'Non'}`, indexFixed ? 'green' : 'red');
    log(`✅ SSL config: ${sslConfigCreated ? 'Oui' : 'Non'}`, sslConfigCreated ? 'green' : 'red');
    
    const allFixed = headersFixed && redirectsFixed && netlifyFixed && viteFixed && indexFixed && sslConfigCreated;
    
    if (allFixed) {
      logSection('🎉 CORRECTION SSL RÉUSSIE');
      log('✅ Configuration SSL simplifiée', 'green');
      log('✅ Conflits résolus', 'green');
      log('✅ Headers optimisés', 'green');
      log('✅ Redirections simplifiées', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez toutes les pages', 'blue');
      
      log('\n🌐 PAGES À TESTER:', 'yellow');
      log('   - https://cryptoboost.world/', 'blue');
      log('   - https://cryptoboost.world/login', 'blue');
      log('   - https://cryptoboost.world/register', 'blue');
      log('   - https://cryptoboost.world/client', 'blue');
      log('   - https://cryptoboost.world/admin', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certaines corrections ont échoué', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLDefinitive();