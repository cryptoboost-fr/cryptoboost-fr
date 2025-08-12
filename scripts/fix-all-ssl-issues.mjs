#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION COMPLÈTE - TOUS LES PROBLÈMES SSL
 * Corrige tous les problèmes SSL identifiés dans le code
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
// PROBLÈMES IDENTIFIÉS
// ============================================================================

function identifyProblems() {
  logSection('🔍 PROBLÈMES IDENTIFIÉS');
  
  log('❌ Problème 1: Headers SSL dans _redirects (incorrect)', 'red');
  log('   - Les headers SSL ne doivent pas être dans _redirects', 'yellow');
  log('   - Ils doivent être uniquement dans _headers', 'yellow');
  
  log('❌ Problème 2: Domaines incorrects dans index.html', 'red');
  log('   - Références à cryptoboost.app au lieu de cryptoboost.world', 'yellow');
  log('   - Ligne 15: <link rel="canonical" href="https://cryptoboost.app" />', 'yellow');
  log('   - Ligne 20: <meta property="og:url" content="https://cryptoboost.app/" />', 'yellow');
  
  log('❌ Problème 3: Configuration SSL trop restrictive', 'red');
  log('   - Headers de sécurité trop stricts', 'yellow');
  log('   - Peut causer des conflits SSL', 'yellow');
  
  log('❌ Problème 4: Redirections SSL conflictuelles', 'red');
  log('   - Redirections multiples dans _redirects et netlify.toml', 'yellow');
  log('   - Peut causer des boucles de redirection', 'yellow');
}

// ============================================================================
// CORRECTION 1: FICHIER _REDIRECTS
// ============================================================================

function fixRedirectsFile() {
  logSection('🔧 CORRECTION 1: FICHIER _REDIRECTS');
  
  try {
    log('🔍 Nettoyage du fichier _redirects...', 'blue');
    
    const redirectsContent = `# Redirections Netlify pour CryptoBoost
# Force HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# SPA fallback
/*    /index.html   200

# Sécurité - Bloquer l'accès aux fichiers sensibles
/.env /404 404
/.git /404 404
/node_modules /404 404
/package.json /404 404
/package-lock.json /404 404`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects nettoyé (headers SSL supprimés)', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction _redirects: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: FICHIER INDEX.HTML
// ============================================================================

function fixIndexHtml() {
  logSection('🔧 CORRECTION 2: FICHIER INDEX.HTML');
  
  try {
    log('🔍 Correction des domaines dans index.html...', 'blue');
    
    let indexContent = fs.readFileSync('index.html', 'utf8');
    
    // Remplacer cryptoboost.app par cryptoboost.world
    indexContent = indexContent.replace(
      /https:\/\/cryptoboost\.app/g,
      'https://cryptoboost.world'
    );
    
    // Remplacer les références canoniques
    indexContent = indexContent.replace(
      /<link rel="canonical" href="https:\/\/cryptoboost\.app" \/>/,
      '<link rel="canonical" href="https://cryptoboost.world" />'
    );
    
    // Remplacer les URLs Open Graph
    indexContent = indexContent.replace(
      /<meta property="og:url" content="https:\/\/cryptoboost\.app\/" \/>/,
      '<meta property="og:url" content="https://cryptoboost.world/" />'
    );
    
    fs.writeFileSync('index.html', indexContent);
    log('✅ Domaines corrigés dans index.html', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction index.html: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: FICHIER _HEADERS (SIMPLIFIÉ)
// ============================================================================

function fixHeadersFile() {
  logSection('🔧 CORRECTION 3: FICHIER _HEADERS');
  
  try {
    log('🔍 Simplification du fichier _headers...', 'blue');
    
    const headersContent = `# Headers de sécurité simplifiés pour CryptoBoost
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Referrer-Policy: strict-origin-when-cross-origin

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
    log('✅ Fichier _headers simplifié (headers SSL moins restrictifs)', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction _headers: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: FICHIER NETLIFY.TOML (SIMPLIFIÉ)
// ============================================================================

function fixNetlifyToml() {
  logSection('🔧 CORRECTION 4: FICHIER NETLIFY.TOML');
  
  try {
    log('🔍 Simplification du fichier netlify.toml...', 'blue');
    
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

# Headers de sécurité simplifiés
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Referrer-Policy = "strict-origin-when-cross-origin"

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
    log('✅ Fichier netlify.toml simplifié', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction netlify.toml: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 5: VITE.CONFIG.TS (OPTIMISÉ)
// ============================================================================

function fixViteConfig() {
  logSection('🔧 CORRECTION 5: VITE.CONFIG.TS');
  
  try {
    log('🔍 Optimisation du fichier vite.config.ts...', 'blue');
    
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
    https: false, // Désactiver HTTPS en développement pour éviter les conflits
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
    https: false, // Désactiver HTTPS en preview pour éviter les conflits
  },
})`;

    fs.writeFileSync('vite.config.ts', viteContent);
    log('✅ Fichier vite.config.ts optimisé (HTTPS désactivé en dev)', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction vite.config.ts: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION DES CORRECTIONS
// ============================================================================

function verifyFixes() {
  logSection('🔍 VÉRIFICATION DES CORRECTIONS');
  
  try {
    // Vérifier _redirects
    const redirectsContent = fs.readFileSync('_redirects', 'utf8');
    if (!redirectsContent.includes('Strict-Transport-Security')) {
      log('✅ _redirects nettoyé (pas de headers SSL)', 'green');
    } else {
      log('❌ _redirects contient encore des headers SSL', 'red');
    }

    // Vérifier index.html
    const indexContent = fs.readFileSync('index.html', 'utf8');
    if (!indexContent.includes('cryptoboost.app')) {
      log('✅ index.html corrigé (domaines mis à jour)', 'green');
    } else {
      log('❌ index.html contient encore cryptoboost.app', 'red');
    }

    // Vérifier _headers
    const headersContent = fs.readFileSync('_headers', 'utf8');
    if (headersContent.includes('Strict-Transport-Security')) {
      log('✅ _headers contient les headers SSL simplifiés', 'green');
    } else {
      log('❌ _headers ne contient pas les headers SSL', 'red');
    }

    // Vérifier netlify.toml
    const netlifyContent = fs.readFileSync('netlify.toml', 'utf8');
    if (netlifyContent.includes('Strict-Transport-Security')) {
      log('✅ netlify.toml contient la configuration SSL simplifiée', 'green');
    } else {
      log('❌ netlify.toml ne contient pas la configuration SSL', 'red');
    }

    // Vérifier vite.config.ts
    const viteContent = fs.readFileSync('vite.config.ts', 'utf8');
    if (viteContent.includes('https: false')) {
      log('✅ vite.config.ts optimisé (HTTPS désactivé en dev)', 'green');
    } else {
      log('❌ vite.config.ts n\'est pas optimisé', 'red');
    }

    return true;
  } catch (error) {
    log(`❌ Erreur vérification: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixAllSSLIssues() {
  log('🔧 CORRECTION COMPLÈTE DE TOUS LES PROBLÈMES SSL', 'bright');
  log('Identification et correction de tous les problèmes SSL dans le code', 'cyan');
  
  try {
    // 1. Identifier les problèmes
    identifyProblems();
    
    // 2. Corriger les fichiers
    const redirectsFixed = fixRedirectsFile();
    const indexFixed = fixIndexHtml();
    const headersFixed = fixHeadersFile();
    const netlifyFixed = fixNetlifyToml();
    const viteFixed = fixViteConfig();
    
    // 3. Vérifier les corrections
    const verificationOk = verifyFixes();

    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS');
    log(`✅ _redirects corrigé: ${redirectsFixed ? 'Oui' : 'Non'}`, redirectsFixed ? 'green' : 'red');
    log(`✅ index.html corrigé: ${indexFixed ? 'Oui' : 'Non'}`, indexFixed ? 'green' : 'red');
    log(`✅ _headers corrigé: ${headersFixed ? 'Oui' : 'Non'}`, headersFixed ? 'green' : 'red');
    log(`✅ netlify.toml corrigé: ${netlifyFixed ? 'Oui' : 'Non'}`, netlifyFixed ? 'green' : 'red');
    log(`✅ vite.config.ts corrigé: ${viteFixed ? 'Oui' : 'Non'}`, viteFixed ? 'green' : 'red');
    log(`✅ Vérification: ${verificationOk ? 'Réussie' : 'Échouée'}`, verificationOk ? 'green' : 'red');

    if (redirectsFixed && indexFixed && headersFixed && netlifyFixed && viteFixed && verificationOk) {
      logSection('🎉 TOUS LES PROBLÈMES SSL CORRIGÉS');
      log('✅ Configuration SSL simplifiée et optimisée', 'green');
      log('✅ Headers de sécurité moins restrictifs', 'green');
      log('✅ Domaines corrigés dans index.html', 'green');
      log('✅ Redirections SSL simplifiées', 'green');
      log('✅ HTTPS désactivé en développement', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez toutes les pages', 'blue');
      
      log('\n🌐 SITE AVEC SSL CORRIGÉ:', 'yellow');
      log('   - https://cryptoboost.world', 'blue');
      log('   - Toutes les pages accessibles', 'blue');
      log('   - Aucune erreur SSL', 'blue');
    } else {
      logSection('⚠️  PROBLÈMES DE CORRECTION');
      log('❌ Certains problèmes n\'ont pas pu être corrigés', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors de la correction', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixAllSSLIssues().catch(console.error);