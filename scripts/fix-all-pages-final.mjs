#!/usr/bin/env node

/**
 * SCRIPT FINAL - CORRECTION DE TOUTES LES PAGES
 * Solution simple et efficace pour tous les problèmes SSL
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Configuration
const SITE_URL = 'https://cryptoboost.world';

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
// CORRECTION CONFIGURATION SIMPLIFIÉE
// ============================================================================

function fixSimpleConfiguration() {
  logSection('🔧 CORRECTION CONFIGURATION SIMPLIFIÉE');
  
  try {
    // 1. Configuration _headers très simple
    log('🔍 Configuration _headers simplifiée...', 'blue');
    
    const headersContent = `# Configuration SSL simplifiée
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains

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
    log('✅ _headers simplifié', 'green');

    // 2. Configuration _redirects simple
    log('🔍 Configuration _redirects simplifiée...', 'blue');
    
    const redirectsContent = `# Redirections simples
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
    log('✅ _redirects simplifié', 'green');

    // 3. Configuration netlify.toml simple
    log('🔍 Configuration netlify.toml simplifiée...', 'blue');
    
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
    log('✅ netlify.toml simplifié', 'green');

    return true;
  } catch (error) {
    log(`❌ Erreur configuration: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// TEST SIMPLE DE TOUTES LES PAGES
// ============================================================================

async function testAllPagesSimple() {
  logSection('🧪 TEST SIMPLE DE TOUTES LES PAGES');
  
  const pages = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login', name: 'Page de connexion' },
    { path: '/register', name: 'Page d\'inscription' },
    { path: '/about', name: 'Page À propos' },
    { path: '/plans', name: 'Page Plans' },
    { path: '/contact', name: 'Page Contact' },
    { path: '/terms', name: 'Page Conditions' },
    { path: '/privacy', name: 'Page Confidentialité' },
    { path: '/faq', name: 'Page FAQ' },
    { path: '/help', name: 'Page Aide' }
  ];

  let successCount = 0;
  let totalCount = pages.length;

  for (const page of pages) {
    try {
      log(`🔍 Test de ${page.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        log(`✅ ${page.name} - Status: ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
    }
  }

  // Résumé
  logSection('📊 RÉSUMÉ DU TEST');
  log(`✅ Pages fonctionnelles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  if (successCount === totalCount) {
    logSection('🎉 TOUTES LES PAGES FONCTIONNELLES');
    log('✅ Site 100% opérationnel', 'green');
    log('✅ Aucune erreur SSL', 'green');
    log('✅ Configuration simplifiée', 'green');
  } else {
    logSection('⚠️  PROBLÈMES RESTANTS');
    log(`❌ ${totalCount - successCount} pages avec problèmes`, 'red');
  }

  return successCount === totalCount;
}

// ============================================================================
// SOLUTION ALTERNATIVE - TEST AVEC CURL
// ============================================================================

async function testWithCurlAlternative() {
  logSection('🔄 SOLUTION ALTERNATIVE - TEST AVEC CURL');
  
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  const pages = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login', name: 'Page de connexion' },
    { path: '/register', name: 'Page d\'inscription' },
    { path: '/about', name: 'Page À propos' },
    { path: '/plans', name: 'Page Plans' },
    { path: '/contact', name: 'Page Contact' },
    { path: '/terms', name: 'Page Conditions' },
    { path: '/privacy', name: 'Page Confidentialité' },
    { path: '/faq', name: 'Page FAQ' },
    { path: '/help', name: 'Page Aide' }
  ];

  let successCount = 0;
  let totalCount = pages.length;

  for (const page of pages) {
    try {
      log(`🔍 Test curl de ${page.name}...`, 'blue');
      
      const { stdout, stderr } = await execAsync(`curl -I ${SITE_URL}${page.path}`);
      
      if (stdout.includes('HTTP/2 200') || stdout.includes('HTTP/1.1 200')) {
        log(`✅ ${page.name} - Status: 200`, 'green');
        successCount++;
      } else {
        log(`❌ ${page.name} - Erreur`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
    }
  }

  // Résumé
  logSection('📊 RÉSUMÉ TEST CURL');
  log(`✅ Pages fonctionnelles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  return successCount === totalCount;
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixAllPagesFinal() {
  log('🔧 CORRECTION FINALE DE TOUTES LES PAGES', 'bright');
  log('Solution simple et efficace pour tous les problèmes', 'cyan');
  
  try {
    // 1. Configuration simplifiée
    const configFixed = fixSimpleConfiguration();
    
    // 2. Test simple
    const simpleTest = await testAllPagesSimple();
    
    // 3. Test alternatif avec curl
    const curlTest = await testWithCurlAlternative();

    // Résumé
    logSection('📊 RÉSUMÉ FINAL');
    log(`✅ Configuration simplifiée: ${configFixed ? 'Oui' : 'Non'}`, configFixed ? 'green' : 'red');
    log(`✅ Test simple: ${simpleTest ? 'Réussi' : 'Échoué'}`, simpleTest ? 'green' : 'red');
    log(`✅ Test curl: ${curlTest ? 'Réussi' : 'Échoué'}`, curlTest ? 'green' : 'red');

    if (simpleTest || curlTest) {
      logSection('🎉 SUCCÈS PARTIEL OU TOTAL');
      if (simpleTest) {
        log('✅ Toutes les pages fonctionnelles avec Node.js', 'green');
      }
      if (curlTest) {
        log('✅ Toutes les pages fonctionnelles avec curl', 'green');
      }
      
      log('\n📋 PROCHAINES ÉTAPES:', 'yellow');
      log('1. Commitez les changements', 'blue');
      log('2. Poussez vers GitHub', 'blue');
      log('3. Attendez le redéploiement Netlify', 'blue');
      log('4. Testez manuellement dans le navigateur', 'blue');
      
      log('\n🌐 SITE OPÉRATIONNEL:', 'yellow');
      log('   - https://cryptoboost.world', 'blue');
      log('   - Configuration simplifiée', 'blue');
      log('   - Pages accessibles', 'blue');
    } else {
      logSection('⚠️  PROBLÈMES PERSISTANTS');
      log('❌ Les problèmes SSL persistent', 'red');
      log('💡 Le problème est côté serveur Netlify', 'yellow');
      log('💡 Contactez le support Netlify', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors de la correction', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixAllPagesFinal().catch(console.error);