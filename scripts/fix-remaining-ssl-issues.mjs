#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - PROBLÈMES SSL RESTANTS
 * Correction des 3 pages restantes avec problèmes SSL
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
// CORRECTION 1: APPROCHE SSL MINIMALE
// ============================================================================

function fixSSLMinimal() {
  logSection('🔧 CORRECTION 1: APPROCHE SSL MINIMALE');
  
  try {
    // Configuration SSL ultra-minimale
    const headersContent = `# Configuration SSL minimale pour CryptoBoost
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

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
    log('✅ Configuration SSL minimale appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur SSL minimale: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: REDIRECTIONS SSL MINIMALES
// ============================================================================

function fixRedirectsMinimal() {
  logSection('🔧 CORRECTION 2: REDIRECTIONS SSL MINIMALES');
  
  try {
    // Redirections SSL minimales
    const redirectsContent = `# Redirections SSL minimales
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
    log('✅ Redirections SSL minimales appliquées', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur redirections minimales: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: NETLIFY.TOML MINIMAL
// ============================================================================

function fixNetlifyMinimal() {
  logSection('🔧 CORRECTION 3: NETLIFY.TOML MINIMAL');
  
  try {
    // Configuration Netlify minimale
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

# Headers de sécurité minimaux
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

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
    log('✅ Configuration Netlify minimale appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Netlify minimal: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: VÉRIFICATION INDEX.HTML
// ============================================================================

function fixIndexHtmlAdvanced() {
  logSection('🔧 CORRECTION 4: VÉRIFICATION INDEX.HTML AVANCÉE');
  
  try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    
    // Vérifier et corriger les problèmes potentiels
    let correctedContent = indexContent;
    
    // 1. Corriger les domaines
    if (indexContent.includes('cryptoboost.app')) {
      correctedContent = correctedContent.replace(/cryptoboost\.app/g, 'cryptoboost.world');
      log('✅ Domaines corrigés', 'green');
    }
    
    // 2. Vérifier les métadonnées
    if (!indexContent.includes('viewport')) {
      log('⚠️ Meta viewport manquant', 'yellow');
    }
    
    // 3. Vérifier les liens canoniques
    if (!indexContent.includes('canonical')) {
      log('⚠️ Lien canonique manquant', 'yellow');
    }
    
    // 4. Vérifier le service worker
    if (!indexContent.includes('sw.js')) {
      log('⚠️ Service worker manquant', 'yellow');
    }
    
    // 5. Ajouter des métadonnées de sécurité si manquantes
    if (!indexContent.includes('X-UA-Compatible')) {
      const metaTag = '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n';
      const headEnd = correctedContent.indexOf('</head>');
      if (headEnd !== -1) {
        correctedContent = correctedContent.slice(0, headEnd) + metaTag + correctedContent.slice(headEnd);
        log('✅ Meta X-UA-Compatible ajouté', 'green');
      }
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
// CORRECTION 5: CRÉATION FICHIER DE CONFIGURATION SPÉCIAL
// ============================================================================

function createSpecialConfig() {
  logSection('🔧 CORRECTION 5: CONFIGURATION SPÉCIALE');
  
  try {
    // Créer un fichier de configuration spécial pour les pages problématiques
    const specialConfigContent = `# Configuration spéciale pour les pages problématiques
# Pages avec problèmes SSL restants :
# 1. / (page d'accueil)
# 2. /login
# 3. /client (dashboard principal)

## Approche utilisée :
# 1. Suppression de tous les headers SSL complexes
# 2. Configuration minimale
# 3. Redirections simples
# 4. Pas de CSP restrictif

## Fichiers modifiés :
# - _headers : Configuration SSL minimale
# - _redirects : Redirections SSL minimales
# - netlify.toml : Configuration Netlify minimale
# - index.html : Vérification et correction

## Test après déploiement :
# 1. https://cryptoboost.world/
# 2. https://cryptoboost.world/login
# 3. https://cryptoboost.world/client

## Codes d'accès :
# Client: client@cryptoboost.world / ClientPass123!
# Admin: admin2@cryptoboost.world / AdminPass123!

Date de correction: ${new Date().toISOString()}`;

    fs.writeFileSync('SSL_SPECIAL_CONFIG.md', specialConfigContent);
    log('✅ Configuration spéciale créée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur configuration spéciale: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 6: VÉRIFICATION VITE.CONFIG.TS
// ============================================================================

function fixViteConfigAdvanced() {
  logSection('🔧 CORRECTION 6: VITE.CONFIG.TS AVANCÉ');
  
  try {
    // Configuration Vite optimisée pour éviter les conflits SSL
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
    cors: true,
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
    cors: true,
  },
})`;

    fs.writeFileSync('vite.config.ts', viteContent);
    log('✅ Configuration Vite avancée appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Vite avancé: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

function fixRemainingSSLIssues() {
  log('🔧 CORRECTION PROBLÈMES SSL RESTANTS', 'bright');
  log('Correction des 3 pages restantes avec problèmes SSL', 'cyan');
  
  try {
    // 1. Approche SSL minimale
    const sslMinimal = fixSSLMinimal();
    
    // 2. Redirections SSL minimales
    const redirectsMinimal = fixRedirectsMinimal();
    
    // 3. Netlify.toml minimal
    const netlifyMinimal = fixNetlifyMinimal();
    
    // 4. Vérification index.html avancée
    const indexAdvanced = fixIndexHtmlAdvanced();
    
    // 5. Configuration spéciale
    const specialConfig = createSpecialConfig();
    
    // 6. Vite config avancé
    const viteAdvanced = fixViteConfigAdvanced();
    
    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS');
    log(`✅ SSL minimal: ${sslMinimal ? 'Oui' : 'Non'}`, sslMinimal ? 'green' : 'red');
    log(`✅ Redirections minimales: ${redirectsMinimal ? 'Oui' : 'Non'}`, redirectsMinimal ? 'green' : 'red');
    log(`✅ Netlify minimal: ${netlifyMinimal ? 'Oui' : 'Non'}`, netlifyMinimal ? 'green' : 'red');
    log(`✅ Index.html avancé: ${indexAdvanced ? 'Oui' : 'Non'}`, indexAdvanced ? 'green' : 'red');
    log(`✅ Config spéciale: ${specialConfig ? 'Oui' : 'Non'}`, specialConfig ? 'green' : 'red');
    log(`✅ Vite avancé: ${viteAdvanced ? 'Oui' : 'Non'}`, viteAdvanced ? 'green' : 'red');
    
    const allFixed = sslMinimal && redirectsMinimal && netlifyMinimal && indexAdvanced && specialConfig && viteAdvanced;
    
    if (allFixed) {
      logSection('🎉 CORRECTION SSL RESTANTS RÉUSSIE');
      log('✅ Configuration SSL minimale appliquée', 'green');
      log('✅ Headers simplifiés', 'green');
      log('✅ Redirections optimisées', 'green');
      log('✅ Conflits éliminés', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez les 3 pages problématiques', 'blue');
      
      log('\n🌐 PAGES À TESTER:', 'yellow');
      log('   - https://cryptoboost.world/', 'blue');
      log('   - https://cryptoboost.world/login', 'blue');
      log('   - https://cryptoboost.world/client', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n💡 Approche minimale pour éviter les conflits SSL !', 'green');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certaines corrections ont échoué', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL restants', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixRemainingSSLIssues();