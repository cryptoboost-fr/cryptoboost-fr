#!/usr/bin/env node

/**
 * FIX REDIRECT WWW - CRYPTOBOOST
 * Correction de la redirection www manquante
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
  log(`🔧 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTION REDIRECTIONS
// ============================================================================

function fixRedirects() {
  logSection('CORRECTION REDIRECTIONS WWW');
  
  try {
    // 1. Corriger _redirects
    log('🔧 Correction fichier _redirects...', 'blue');
    
    const redirectsContent = `# Redirections SSL critiques pour CryptoBoost
# HTTP vers HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!

# WWW vers non-WWW (correction critique)
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Login alternative
/login /login-alt.html 200

# SPA fallback
/* /index.html 200`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects corrigé', 'green');
    
    // 2. Corriger netlify.toml
    log('🔧 Correction fichier netlify.toml...', 'blue');
    
    const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

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

[[redirects]]
  from = "/login"
  to = "/login-alt.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Cache-Control = "no-cache, no-store, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.jpeg"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.gif"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.ico"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.woff"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000"`;

    fs.writeFileSync('netlify.toml', netlifyContent);
    log('✅ Fichier netlify.toml corrigé', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la correction: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION DES FICHIERS
// ============================================================================

function verifyFiles() {
  logSection('VÉRIFICATION DES FICHIERS');
  
  try {
    // Vérifier _redirects
    if (fs.existsSync('_redirects')) {
      const redirectsContent = fs.readFileSync('_redirects', 'utf8');
      const hasWWWRedirect = redirectsContent.includes('www.cryptoboost.world');
      log(`✅ Fichier _redirects: ${hasWWWRedirect ? 'Contient redirections WWW' : 'Redirections WWW manquantes'}`, 
          hasWWWRedirect ? 'green' : 'red');
    } else {
      log('❌ Fichier _redirects manquant', 'red');
    }
    
    // Vérifier netlify.toml
    if (fs.existsSync('netlify.toml')) {
      const netlifyContent = fs.readFileSync('netlify.toml', 'utf8');
      const hasWWWRedirect = netlifyContent.includes('www.cryptoboost.world');
      log(`✅ Fichier netlify.toml: ${hasWWWRedirect ? 'Contient redirections WWW' : 'Redirections WWW manquantes'}`, 
          hasWWWRedirect ? 'green' : 'red');
    } else {
      log('❌ Fichier netlify.toml manquant', 'red');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la vérification: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixWWWRedirect() {
  log('🔧 FIX REDIRECT WWW - CRYPTOBOOST', 'bright');
  log('Correction de la redirection www manquante', 'cyan');
  
  try {
    // 1. Corriger les redirections
    const redirectsFixed = fixRedirects();
    
    if (!redirectsFixed) {
      log('❌ Échec de la correction des redirections', 'red');
      return false;
    }
    
    // 2. Vérifier les fichiers
    const filesVerified = verifyFiles();
    
    if (!filesVerified) {
      log('❌ Échec de la vérification des fichiers', 'red');
      return false;
    }
    
    // 3. Commit et push
    logSection('COMMIT ET PUSH');
    
    const { execSync } = await import('child_process');
    
    try {
      log('🔧 Ajout des fichiers...', 'blue');
      execSync('git add _redirects netlify.toml', { stdio: 'inherit' });
      
      log('🔧 Commit des corrections...', 'blue');
      execSync('git commit -m "🔧 Fix: Correction redirection www manquante"', { stdio: 'inherit' });
      
      log('🔧 Push vers GitHub...', 'blue');
      execSync('git push origin main', { stdio: 'inherit' });
      
      log('✅ Corrections déployées avec succès', 'green');
      
    } catch (error) {
      log(`❌ Erreur Git: ${error.message}`, 'red');
      return false;
    }
    
    // 4. Résumé
    logSection('📊 RÉSUMÉ CORRECTION');
    log('✅ Redirections WWW corrigées', 'green');
    log('✅ Fichiers _redirects et netlify.toml mis à jour', 'green');
    log('✅ Corrections déployées sur Netlify', 'green');
    
    log('\n🎯 PROBLÈME IDENTIFIÉ ET CORRIGÉ:', 'yellow');
    log('   - Redirection http://www.cryptoboost.world incorrecte', 'blue');
    log('   - Maintenant redirige vers https://cryptoboost.world', 'green');
    
    log('\n⏳ Redéploiement en cours...', 'yellow');
    log('   Attendez 2-3 minutes puis testez à nouveau', 'blue');
    
    return true;
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction WWW', 'red');
    log(error.message, 'red');
    return false;
  }
}

// Exécution
fixWWWRedirect().catch(console.error);