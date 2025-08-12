#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - DASHBOARD CLIENT SSL
 * Correction spécifique de la page Dashboard Client avec problème SSL
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
// CORRECTION 1: HEADERS SPÉCIAUX POUR CLIENT DASHBOARD
// ============================================================================

function fixClientDashboardHeaders() {
  logSection('🔧 CORRECTION 1: HEADERS SPÉCIAUX POUR CLIENT DASHBOARD');
  
  try {
    // Configuration avec headers spéciaux pour le dashboard client
    const headersContent = `# Configuration SSL avec headers spéciaux pour Client Dashboard
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

# Configuration spéciale pour le dashboard client
/client
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Configuration spéciale pour les sous-pages client problématiques
/client/investments
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/client/wallets
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
    log('✅ Headers spéciaux pour Client Dashboard appliqués', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur headers Client Dashboard: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 2: REDIRECTIONS SPÉCIALES POUR CLIENT DASHBOARD
// ============================================================================

function fixClientDashboardRedirects() {
  logSection('🔧 CORRECTION 2: REDIRECTIONS SPÉCIALES POUR CLIENT DASHBOARD');
  
  try {
    // Redirections avec configuration spéciale pour client dashboard
    const redirectsContent = `# Redirections SSL avec configuration spéciale pour Client Dashboard
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
https://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Redirection spéciale pour login
http://cryptoboost.world/login https://cryptoboost.world/login 301!
https://www.cryptoboost.world/login https://cryptoboost.world/login 301!

# Redirections spéciales pour client dashboard
http://cryptoboost.world/client https://cryptoboost.world/client 301!
https://www.cryptoboost.world/client https://cryptoboost.world/client 301!
http://cryptoboost.world/client/investments https://cryptoboost.world/client/investments 301!
https://www.cryptoboost.world/client/investments https://cryptoboost.world/client/investments 301!
http://cryptoboost.world/client/wallets https://cryptoboost.world/client/wallets 301!
https://www.cryptoboost.world/client/wallets https://cryptoboost.world/client/wallets 301!

# SPA fallback
/*    /index.html   200

# Sécurité
/.env /404 404
/.git /404 404
/node_modules /404 404`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Redirections spéciales pour Client Dashboard appliquées', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur redirections Client Dashboard: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 3: NETLIFY.TOML SPÉCIAL POUR CLIENT DASHBOARD
// ============================================================================

function fixClientDashboardNetlify() {
  logSection('🔧 CORRECTION 3: NETLIFY.TOML SPÉCIAL POUR CLIENT DASHBOARD');
  
  try {
    // Configuration Netlify avec headers spéciaux pour client dashboard
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

# Redirections spéciales pour client dashboard
[[redirects]]
  from = "http://cryptoboost.world/client"
  to = "https://cryptoboost.world/client"
  status = 301

[[redirects]]
  from = "https://www.cryptoboost.world/client"
  to = "https://cryptoboost.world/client"
  status = 301

[[redirects]]
  from = "http://cryptoboost.world/client/investments"
  to = "https://cryptoboost.world/client/investments"
  status = 301

[[redirects]]
  from = "https://www.cryptoboost.world/client/investments"
  to = "https://cryptoboost.world/client/investments"
  status = 301

[[redirects]]
  from = "http://cryptoboost.world/client/wallets"
  to = "https://cryptoboost.world/client/wallets"
  status = 301

[[redirects]]
  from = "https://www.cryptoboost.world/client/wallets"
  to = "https://cryptoboost.world/client/wallets"
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

# Headers spéciaux pour le dashboard client
[[headers]]
  for = "/client"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"

# Headers spéciaux pour les sous-pages client problématiques
[[headers]]
  for = "/client/investments"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"

[[headers]]
  for = "/client/wallets"
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
    log('✅ Configuration Netlify spéciale pour Client Dashboard appliquée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur Netlify Client Dashboard: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 4: VÉRIFICATION COMPOSANT CLIENT DASHBOARD
// ============================================================================

function checkClientDashboardComponent() {
  logSection('🔧 CORRECTION 4: VÉRIFICATION COMPOSANT CLIENT DASHBOARD');
  
  try {
    const clientDashboardPath = 'src/pages/client/Dashboard.tsx';
    
    if (fs.existsSync(clientDashboardPath)) {
      const dashboardContent = fs.readFileSync(clientDashboardPath, 'utf8');
      
      // Vérifier les problèmes potentiels
      let issues = [];
      
      if (dashboardContent.includes('window.location')) {
        issues.push('Redirections côté client');
      }
      
      if (dashboardContent.includes('fetch(')) {
        issues.push('Appels fetch directs');
      }
      
      if (dashboardContent.includes('XMLHttpRequest')) {
        issues.push('XMLHttpRequest');
      }
      
      if (issues.length > 0) {
        log(`⚠️ Problèmes potentiels détectés: ${issues.join(', ')}`, 'yellow');
      } else {
        log('✅ Composant Client Dashboard semble correct', 'green');
      }
      
      return true;
    } else {
      log('❌ Fichier Client Dashboard.tsx non trouvé', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur vérification Client Dashboard: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CORRECTION 5: CRÉATION FICHIER DE CONFIGURATION CLIENT DASHBOARD
// ============================================================================

function createClientDashboardConfig() {
  logSection('🔧 CORRECTION 5: CONFIGURATION CLIENT DASHBOARD');
  
  try {
    // Créer un fichier de configuration spécial pour le client dashboard
    const clientDashboardConfigContent = `# Configuration spéciale pour le Client Dashboard
# Problème SSL sur /client, /client/investments, /client/wallets

## Symptômes :
# - SSL alert number 80
# - Erreur sur les pages client principales
# - Sous-pages client fonctionnelles

## Solutions appliquées :
# 1. Headers spéciaux pour /client
# 2. Redirections SSL explicites
# 3. Cache-control spécial
# 4. Vérification composant

## Headers spéciaux :
# - Cache-Control: no-cache, no-store, must-revalidate
# - Pragma: no-cache
# - Expires: 0

## Redirections explicites :
# - http://cryptoboost.world/client -> https://cryptoboost.world/client
# - https://www.cryptoboost.world/client -> https://cryptoboost.world/client
# - http://cryptoboost.world/client/investments -> https://cryptoboost.world/client/investments
# - http://cryptoboost.world/client/wallets -> https://cryptoboost.world/client/wallets

## Test après déploiement :
# 1. https://cryptoboost.world/client
# 2. https://cryptoboost.world/client/investments
# 3. https://cryptoboost.world/client/wallets
# 4. Vérifier les erreurs SSL

## Codes d'accès :
# Client: client@cryptoboost.world / ClientPass123!
# Admin: admin2@cryptoboost.world / AdminPass123!

Date de correction: ${new Date().toISOString()}`;

    fs.writeFileSync('CLIENT_DASHBOARD_SSL_CONFIG.md', clientDashboardConfigContent);
    log('✅ Configuration Client Dashboard créée', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur configuration Client Dashboard: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

function fixClientDashboardSSL() {
  log('🔧 CORRECTION CLIENT DASHBOARD SSL', 'bright');
  log('Correction spécifique du Dashboard Client avec problème SSL', 'cyan');
  
  try {
    // 1. Headers spéciaux pour Client Dashboard
    const clientHeaders = fixClientDashboardHeaders();
    
    // 2. Redirections spéciales pour Client Dashboard
    const clientRedirects = fixClientDashboardRedirects();
    
    // 3. Netlify.toml spécial pour Client Dashboard
    const clientNetlify = fixClientDashboardNetlify();
    
    // 4. Vérification composant Client Dashboard
    const clientComponent = checkClientDashboardComponent();
    
    // 5. Configuration Client Dashboard
    const clientConfig = createClientDashboardConfig();
    
    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS CLIENT DASHBOARD');
    log(`✅ Headers Client Dashboard: ${clientHeaders ? 'Oui' : 'Non'}`, clientHeaders ? 'green' : 'red');
    log(`✅ Redirections Client Dashboard: ${clientRedirects ? 'Oui' : 'Non'}`, clientRedirects ? 'green' : 'red');
    log(`✅ Netlify Client Dashboard: ${clientNetlify ? 'Oui' : 'Non'}`, clientNetlify ? 'green' : 'red');
    log(`✅ Composant Client Dashboard: ${clientComponent ? 'Oui' : 'Non'}`, clientComponent ? 'green' : 'red');
    log(`✅ Config Client Dashboard: ${clientConfig ? 'Oui' : 'Non'}`, clientConfig ? 'green' : 'red');
    
    const allFixed = clientHeaders && clientRedirects && clientNetlify && clientComponent && clientConfig;
    
    if (allFixed) {
      logSection('🎉 CORRECTION CLIENT DASHBOARD SSL RÉUSSIE');
      log('✅ Headers spéciaux appliqués', 'green');
      log('✅ Redirections explicites configurées', 'green');
      log('✅ Cache-control optimisé', 'green');
      log('✅ Configuration SSL spéciale', 'green');
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez les pages Client Dashboard', 'blue');
      
      log('\n🌐 PAGES À TESTER:', 'yellow');
      log('   - https://cryptoboost.world/client', 'blue');
      log('   - https://cryptoboost.world/client/investments', 'blue');
      log('   - https://cryptoboost.world/client/wallets', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n💡 Configuration spéciale pour résoudre l\'erreur SSL Client Dashboard !', 'green');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certaines corrections Client Dashboard ont échoué', 'red');
      log('💡 Vérifiez les permissions de fichiers', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction Client Dashboard SSL', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixClientDashboardSSL();