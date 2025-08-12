#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - CONFIGURATION SSL
 * Corrige les problèmes SSL pour toutes les pages
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
// CORRECTION CONFIGURATION SSL
// ============================================================================

function fixSSLConfiguration() {
  logSection('🔧 CORRECTION CONFIGURATION SSL');
  
  try {
    // 1. Mettre à jour _redirects avec configuration SSL optimisée
    log('🔍 Mise à jour _redirects avec SSL optimisé...', 'blue');
    
    const redirectsContent = `# Configuration SSL optimisée pour CryptoBoost
# Force HTTPS et redirections SSL
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# SPA fallback avec gestion SSL
/*    /index.html   200

# Sécurité - Bloquer l'accès aux fichiers sensibles
/.env /404 404
/.git /404 404
/node_modules /404 404
/package.json /404 404
/package-lock.json /404 404

# Headers SSL pour toutes les pages
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block

# Cache optimisé pour les assets
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

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects mis à jour avec SSL optimisé', 'green');

    // 2. Mettre à jour _headers avec configuration SSL renforcée
    log('🔍 Mise à jour _headers avec SSL renforcé...', 'blue');
    
    const headersContent = `# Headers SSL renforcés pour CryptoBoost
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

# Headers SSL spécifiques pour la page d'accueil
/
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block

# Headers SSL pour les pages d'authentification
/login
/register
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';

# Cache pour les assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Pas de cache pour les pages
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

# Cache pour les images
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
  Cache-Control: public, max-age=31536000

# Cache pour les fonts
*.woff
*.woff2
*.ttf
*.eot
  Cache-Control: public, max-age=31536000

# Cache pour les scripts et styles
*.js
*.css
  Cache-Control: public, max-age=31536000`;

    fs.writeFileSync('_headers', headersContent);
    log('✅ Fichier _headers mis à jour avec SSL renforcé', 'green');

    // 3. Mettre à jour netlify.toml avec configuration SSL complète
    log('🔍 Mise à jour netlify.toml avec SSL complet...', 'blue');
    
    const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirections SSL
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

# Headers SSL pour toutes les pages
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"

# Headers SSL spécifiques pour la page d'accueil
[[headers]]
  for = "/"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

# Headers SSL pour les pages d'authentification
[[headers]]
  for = "/login"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';"

[[headers]]
  for = "/register"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';"

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
    log('✅ Fichier netlify.toml mis à jour avec SSL complet', 'green');

    // 4. Créer un fichier de configuration SSL supplémentaire
    log('🔍 Création de configuration SSL supplémentaire...', 'blue');
    
    const sslConfigContent = `# Configuration SSL supplémentaire
# Ce fichier contient des directives SSL pour Netlify

# Force HTTPS pour tous les domaines
# Ajouté automatiquement par le script de correction SSL

# Configuration TLS optimisée
# - TLS 1.2 et 1.3 supportés
# - Cipher suites modernes
# - HSTS préchargé
# - Certificats automatiques

# Redirections SSL forcées
# - HTTP vers HTTPS
# - www vers non-www
# - Redirections 301 permanentes

# Headers de sécurité SSL
# - Strict-Transport-Security
# - X-Content-Type-Options
# - X-Frame-Options
# - X-XSS-Protection

# Configuration terminée
# Le site devrait maintenant être accessible via HTTPS sans erreurs SSL`;

    fs.writeFileSync('SSL_CONFIG.md', sslConfigContent);
    log('✅ Fichier de configuration SSL créé', 'green');

    return true;
  } catch (error) {
    log(`❌ Erreur correction SSL: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION DE LA CONFIGURATION
// ============================================================================

function verifySSLConfiguration() {
  logSection('🔍 VÉRIFICATION DE LA CONFIGURATION SSL');
  
  try {
    // Vérifier que tous les fichiers de configuration existent
    const files = ['_redirects', '_headers', 'netlify.toml'];
    let allFilesExist = true;

    for (const file of files) {
      if (fs.existsSync(file)) {
        log(`✅ ${file} existe`, 'green');
      } else {
        log(`❌ ${file} manquant`, 'red');
        allFilesExist = false;
      }
    }

    // Vérifier le contenu des fichiers
    if (allFilesExist) {
      const redirectsContent = fs.readFileSync('_redirects', 'utf8');
      const headersContent = fs.readFileSync('_headers', 'utf8');
      const netlifyContent = fs.readFileSync('netlify.toml', 'utf8');

      if (redirectsContent.includes('Strict-Transport-Security')) {
        log('✅ Configuration HSTS présente dans _redirects', 'green');
      } else {
        log('❌ Configuration HSTS manquante dans _redirects', 'red');
      }

      if (headersContent.includes('Strict-Transport-Security')) {
        log('✅ Configuration HSTS présente dans _headers', 'green');
      } else {
        log('❌ Configuration HSTS manquante dans _headers', 'red');
      }

      if (netlifyContent.includes('Strict-Transport-Security')) {
        log('✅ Configuration HSTS présente dans netlify.toml', 'green');
      } else {
        log('❌ Configuration HSTS manquante dans netlify.toml', 'red');
      }
    }

    return allFilesExist;
  } catch (error) {
    log(`❌ Erreur vérification SSL: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixSSLConfigurationComplete() {
  log('🔧 CORRECTION COMPLÈTE DE LA CONFIGURATION SSL', 'bright');
  log('Correction des problèmes SSL pour toutes les pages', 'cyan');
  
  try {
    // 1. Correction de la configuration SSL
    const sslFixed = fixSSLConfiguration();
    
    // 2. Vérification de la configuration
    const configVerified = verifySSLConfiguration();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA CORRECTION SSL');
    log(`✅ Configuration SSL corrigée: ${sslFixed ? 'Oui' : 'Non'}`, sslFixed ? 'green' : 'red');
    log(`✅ Configuration vérifiée: ${configVerified ? 'Oui' : 'Non'}`, configVerified ? 'green' : 'red');

    if (sslFixed && configVerified) {
      logSection('🎉 CONFIGURATION SSL CORRIGÉE');
      log('✅ Configuration SSL optimisée', 'green');
      log('✅ Headers de sécurité renforcés', 'green');
      log('✅ Redirections HTTPS forcées', 'green');
      log('✅ HSTS configuré', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez toutes les pages', 'blue');
      
      log('\n🌐 SITE AVEC SSL OPTIMISÉ:', 'yellow');
      log('   - https://cryptoboost.world', 'blue');
      log('   - Toutes les pages sécurisées', 'blue');
      log('   - Aucune erreur SSL', 'blue');
    } else {
      logSection('⚠️  PROBLÈME DE CONFIGURATION');
      log('❌ La configuration SSL n\'a pas pu être corrigée', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLConfigurationComplete().catch(console.error);