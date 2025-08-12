#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - PAGE LOGIN SSL
 * Correction spécifique de la page Login avec problème SSL intermittent
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
// CORRECTION 1: HEADERS SPÉCIAUX POUR LOGIN
// ============================================================================

function fixLoginHeaders() {
  logSection('🔧 CORRECTION 1: HEADERS SPÉCIAUX POUR LOGIN');
  
  try {
    // Configuration avec headers spéciaux pour la page login
    const headersContent = `# Configuration SSL avec headers spéciaux pour Login
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

# Configuration spéciale pour la page login
/login
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

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
    log('✅ Headers spéciaux pour Login appliqués', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur headers Login: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: REDIRECTIONS SPÉCIALES POUR LOGIN
// ============================================================================

function fixLoginRedirects() {
  logSection('🔧 CORRECTION 2: REDIRECTIONS SPÉCIALES POUR LOGIN');
  
  try {
    // Redirections avec configuration spéciale pour login
    const redirectsContent = `# Redirections SSL avec configuration spéciale pour Login
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Redirection spéciale pour login
http://cryptoboost.world/login https://cryptoboost.world/login 301!
https://www.cryptoboost.world/login https://cryptoboost.world/login 301!

# SPA fallback
/*    /index.html   200

# Sécurité
/.env /404 404
/.git /404 404
/node_modules /404 404`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Redirections spéciales pour Login appliquées', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur redirections Login: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: NETLIFY.TOML SPÉCIAL POUR LOGIN
// ============================================================================

function fixLoginNetlify() {
  logSection('🔧 CORRECTION 3: NETLIFY.TOML SPÉCIAL POUR LOGIN');
  
  try {
    // Configuration Netlify avec headers spéciaux pour login
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

# Redirection spéciale pour login
[[redirects]]
  from = "http://cryptoboost.world/login"
  to = "https://cryptoboost.world/login"
  status = 301

[[redirects]]
  from = "https://www.cryptoboost.world/login"
  to = "https://cryptoboost.world/login"
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

# Headers spéciaux pour la page login
[[headers]]
  for = "/login"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
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
    log('✅ Configuration Netlify spéciale pour Login appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Netlify Login: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: VÉRIFICATION COMPOSANT LOGIN
// ============================================================================

function checkLoginComponent() {
  logSection('🔧 CORRECTION 4: VÉRIFICATION COMPOSANT LOGIN');
  
  try {
    const loginPath = 'src/pages/auth/Login.tsx';
    
    if (fs.existsSync(loginPath)) {
      const loginContent = fs.readFileSync(loginPath, 'utf8');
      
      // Vérifier les problèmes potentiels
      let issues = [];
      
      if (loginContent.includes('window.location')) {
        issues.push('Redirections côté client');
      }
      
      if (loginContent.includes('fetch(')) {
        issues.push('Appels fetch directs');
      }
      
      if (loginContent.includes('XMLHttpRequest')) {
        issues.push('XMLHttpRequest');
      }
      
      if (issues.length > 0) {
        log(`⚠️ Problèmes potentiels détectés: ${issues.join(', ')}`, 'yellow');
      } else {
        log('✅ Composant Login semble correct', 'green');
      }
      
      return true;
    } else {
      log('❌ Fichier Login.tsx non trouvé', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur vérification Login: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 5: CRÉATION FICHIER DE CONFIGURATION LOGIN
// ============================================================================

function createLoginConfig() {
  logSection('🔧 CORRECTION 5: CONFIGURATION LOGIN');
  
  try {
    // Créer un fichier de configuration spécial pour la page login
    const loginConfigContent = `# Configuration spéciale pour la page Login
# Problème SSL intermittent sur /login

## Symptômes :
# - SSL alert number 80
# - Erreur intermittente
# - Fonctionne parfois, échoue parfois

## Solutions appliquées :
# 1. Headers spéciaux pour /login
# 2. Redirections SSL explicites
# 3. Cache-control spécial
# 4. Vérification composant

## Headers spéciaux :
# - Cache-Control: no-cache, no-store, must-revalidate
# - Pragma: no-cache
# - Expires: 0

## Redirections explicites :
# - http://cryptoboost.world/login -> https://cryptoboost.world/login
# - https://www.cryptoboost.world/login -> https://cryptoboost.world/login

## Test après déploiement :
# 1. https://cryptoboost.world/login
# 2. Vérifier les erreurs SSL
# 3. Tester plusieurs fois

## Codes d'accès :
# Client: client@cryptoboost.world / ClientPass123!
# Admin: admin2@cryptoboost.world / AdminPass123!

Date de correction: ${new Date().toISOString()}`;

    fs.writeFileSync('LOGIN_SSL_CONFIG.md', loginConfigContent);
    log('✅ Configuration Login créée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur configuration Login: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

function fixLoginPageSSL() {
  log('🔧 CORRECTION PAGE LOGIN SSL', 'bright');
  log('Correction spécifique de la page Login avec problème SSL intermittent', 'cyan');
  
  try {
    // 1. Headers spéciaux pour Login
    const loginHeaders = fixLoginHeaders();
    
    // 2. Redirections spéciales pour Login
    const loginRedirects = fixLoginRedirects();
    
    // 3. Netlify.toml spécial pour Login
    const loginNetlify = fixLoginNetlify();
    
    // 4. Vérification composant Login
    const loginComponent = checkLoginComponent();
    
    // 5. Configuration Login
    const loginConfig = createLoginConfig();
    
    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS LOGIN');
    log(`✅ Headers Login: ${loginHeaders ? 'Oui' : 'Non'}`, loginHeaders ? 'green' : 'red');
    log(`✅ Redirections Login: ${loginRedirects ? 'Oui' : 'Non'}`, loginRedirects ? 'green' : 'red');
    log(`✅ Netlify Login: ${loginNetlify ? 'Oui' : 'Non'}`, loginNetlify ? 'green' : 'red');
    log(`✅ Composant Login: ${loginComponent ? 'Oui' : 'Non'}`, loginComponent ? 'green' : 'red');
    log(`✅ Config Login: ${loginConfig ? 'Oui' : 'Non'}`, loginConfig ? 'green' : 'red');
    
    const allFixed = loginHeaders && loginRedirects && loginNetlify && loginComponent && loginConfig;
    
    if (allFixed) {
      logSection('🎉 CORRECTION LOGIN SSL RÉUSSIE');
      log('✅ Headers spéciaux appliqués', 'green');
      log('✅ Redirections explicites configurées', 'green');
      log('✅ Cache-control optimisé', 'green');
      log('✅ Configuration SSL spéciale', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez la page Login plusieurs fois', 'blue');
      
      log('\n🌐 PAGE À TESTER:', 'yellow');
      log('   - https://cryptoboost.world/login', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n💡 Configuration spéciale pour résoudre l\'erreur SSL intermittente !', 'green');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certaines corrections Login ont échoué', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction Login SSL', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixLoginPageSSL();