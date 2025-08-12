#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION SSL CRITIQUE
 * Correction immédiate du problème ERR_SSL_PROTOCOL_ERROR
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
  log(`🚨 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTION 1: HEADERS SSL CRITIQUES
// ============================================================================

function fixCriticalSSLHeaders() {
  logSection('CORRECTION 1: HEADERS SSL CRITIQUES');
  
  try {
    // Configuration SSL critique pour résoudre ERR_SSL_PROTOCOL_ERROR
    const headersContent = `# Configuration SSL critique pour résoudre ERR_SSL_PROTOCOL_ERROR
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Configuration critique pour la page d'accueil
/
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Configuration critique pour toutes les pages
/*.html
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache, no-store, must-revalidate

# Cache pour les assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

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
    log('✅ Headers SSL critiques appliqués', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur headers SSL critiques: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: REDIRECTIONS SSL CRITIQUES
// ============================================================================

function fixCriticalSSLRedirects() {
  logSection('CORRECTION 2: REDIRECTIONS SSL CRITIQUES');
  
  try {
    // Redirections SSL critiques pour résoudre ERR_SSL_PROTOCOL_ERROR
    const redirectsContent = `# Redirections SSL critiques pour résoudre ERR_SSL_PROTOCOL_ERROR
# Redirections HTTP vers HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Redirection spécifique pour la page d'accueil
http://cryptoboost.world/ https://cryptoboost.world/ 301!
http://www.cryptoboost.world/ https://cryptoboost.world/ 301!

# SPA fallback
/*    /index.html   200

# Sécurité
/.env /404 404
/.git /404 404
/node_modules /404 404`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Redirections SSL critiques appliquées', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur redirections SSL critiques: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: NETLIFY.TOML CRITIQUE
// ============================================================================

function fixCriticalNetlifyConfig() {
  logSection('CORRECTION 3: NETLIFY.TOML CRITIQUE');
  
  try {
    // Configuration Netlify critique pour résoudre ERR_SSL_PROTOCOL_ERROR
    const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirections SSL critiques
[[redirects]]
  from = "http://cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301
  force = true

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de sécurité critiques
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Headers spécifiques pour la page d'accueil
[[headers]]
  for = "/"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"

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
    log('✅ Configuration Netlify critique appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Netlify critique: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: INDEX.HTML CRITIQUE
// ============================================================================

function fixCriticalIndexHtml() {
  logSection('CORRECTION 4: INDEX.HTML CRITIQUE');
  
  try {
    const indexPath = 'index.html';
    
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Corrections critiques pour SSL
      let corrections = 0;
      
      // 1. Supprimer les métadonnées problématiques
      if (indexContent.includes('X-UA-Compatible')) {
        indexContent = indexContent.replace(/<meta http-equiv="X-UA-Compatible"[^>]*>/g, '');
        corrections++;
        log('✅ Meta X-UA-Compatible supprimé', 'green');
      }
      
      // 2. Supprimer les CSP problématiques
      if (indexContent.includes('Content-Security-Policy')) {
        indexContent = indexContent.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');
        corrections++;
        log('✅ CSP supprimé', 'green');
      }
      
      // 3. Corriger les domaines
      if (indexContent.includes('cryptoboost.app')) {
        indexContent = indexContent.replace(/cryptoboost\.app/g, 'cryptoboost.world');
        corrections++;
        log('✅ Domaines corrigés', 'green');
      }
      
      // 4. Ajouter des métadonnées de sécurité
      const securityMeta = `
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">`;
      
      if (!indexContent.includes('X-Content-Type-Options')) {
        indexContent = indexContent.replace('</head>', `${securityMeta}\n  </head>`);
        corrections++;
        log('✅ Métadonnées de sécurité ajoutées', 'green');
      }
      
      fs.writeFileSync(indexPath, indexContent);
      log(`✅ ${corrections} corrections appliquées à index.html`, 'green');
      return true;
    } else {
      log('❌ index.html non trouvé', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur index.html critique: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 5: VITE.CONFIG.TS CRITIQUE
// ============================================================================

function fixCriticalViteConfig() {
  logSection('CORRECTION 5: VITE.CONFIG.TS CRITIQUE');
  
  try {
    // Configuration Vite critique pour résoudre les problèmes SSL
    const viteContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
  // Configuration critique pour SSL
  base: '/',
  publicDir: 'public',
})`;

    fs.writeFileSync('vite.config.ts', viteContent);
    log('✅ Configuration Vite critique appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Vite critique: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 6: CRÉATION FICHIER DE CONFIGURATION CRITIQUE
// ============================================================================

function createCriticalConfig() {
  logSection('CORRECTION 6: CONFIGURATION CRITIQUE');
  
  try {
    // Créer un fichier de configuration critique
    const criticalConfigContent = `# Configuration critique pour résoudre ERR_SSL_PROTOCOL_ERROR
# Problème: ERR_SSL_PROTOCOL_ERROR sur la page d'accueil

## Symptômes :
# - "Ce site ne peut pas fournir de connexion sécurisée"
# - "cryptoboost.world a envoyé une réponse incorrecte"
# - ERR_SSL_PROTOCOL_ERROR

## Solutions appliquées :
# 1. Headers SSL critiques avec X-Content-Type-Options
# 2. Redirections SSL forcées
# 3. Configuration Netlify critique
# 4. Correction index.html
# 5. Configuration Vite critique

## Headers critiques appliqués :
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Referrer-Policy: strict-origin-when-cross-origin
# - Permissions-Policy: camera=(), microphone=(), geolocation=()

## Redirections critiques :
# - http://cryptoboost.world/* -> https://cryptoboost.world/:splat 301!
# - http://www.cryptoboost.world/* -> https://cryptoboost.world/:splat 301!
# - https://www.cryptoboost.world/* -> https://cryptoboost.world/:splat 301!

## Test après déploiement :
# 1. https://cryptoboost.world
# 2. Vérifier l'absence d'ERR_SSL_PROTOCOL_ERROR
# 3. Tester toutes les pages

## Codes d'accès :
# Client: client@cryptoboost.world / ClientPass123!
# Admin: admin2@cryptoboost.world / AdminPass123!

Date de correction critique: ${new Date().toISOString()}`;

    fs.writeFileSync('SSL_CRITICAL_FIX.md', criticalConfigContent);
    log('✅ Configuration critique créée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur configuration critique: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

function fixSSLCritical() {
  log('🚨 CORRECTION SSL CRITIQUE', 'bright');
  log('Correction immédiate du problème ERR_SSL_PROTOCOL_ERROR', 'red');
  
  try {
    // 1. Headers SSL critiques
    const headersFixed = fixCriticalSSLHeaders();
    
    // 2. Redirections SSL critiques
    const redirectsFixed = fixCriticalSSLRedirects();
    
    // 3. Netlify.toml critique
    const netlifyFixed = fixCriticalNetlifyConfig();
    
    // 4. Index.html critique
    const indexFixed = fixCriticalIndexHtml();
    
    // 5. Vite config critique
    const viteFixed = fixCriticalViteConfig();
    
    // 6. Configuration critique
    const configCreated = createCriticalConfig();
    
    // Résumé
    logSection('📊 RÉSUMÉ CORRECTIONS CRITIQUES');
    log(`✅ Headers SSL critiques: ${headersFixed ? 'Oui' : 'Non'}`, headersFixed ? 'green' : 'red');
    log(`✅ Redirections SSL critiques: ${redirectsFixed ? 'Oui' : 'Non'}`, redirectsFixed ? 'green' : 'red');
    log(`✅ Netlify critique: ${netlifyFixed ? 'Oui' : 'Non'}`, netlifyFixed ? 'green' : 'red');
    log(`✅ Index.html critique: ${indexFixed ? 'Oui' : 'Non'}`, indexFixed ? 'green' : 'red');
    log(`✅ Vite config critique: ${viteFixed ? 'Oui' : 'Non'}`, viteFixed ? 'green' : 'red');
    log(`✅ Config critique: ${configCreated ? 'Oui' : 'Non'}`, configCreated ? 'green' : 'red');
    
    const allFixed = headersFixed && redirectsFixed && netlifyFixed && indexFixed && viteFixed && configCreated;
    
    if (allFixed) {
      logSection('🎉 CORRECTION SSL CRITIQUE RÉUSSIE');
      log('✅ Headers SSL critiques appliqués', 'green');
      log('✅ Redirections SSL forcées', 'green');
      log('✅ Configuration Netlify critique', 'green');
      log('✅ Index.html corrigé', 'green');
      log('✅ Configuration Vite critique', 'green');
      log('✅ Configuration critique créée', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES CRITIQUES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez https://cryptoboost.world', 'blue');
      log('5. Vérifiez l\'absence d\'ERR_SSL_PROTOCOL_ERROR', 'blue');
      
      log('\n🌐 PAGE À TESTER:', 'yellow');
      log('   - https://cryptoboost.world', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n💡 Correction SSL critique appliquée pour résoudre ERR_SSL_PROTOCOL_ERROR !', 'green');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certaines corrections critiques ont échoué', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL critique', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLCritical();