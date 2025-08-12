#!/usr/bin/env node

/**
 * SCRIPT DE DIAGNOSTIC - SITE CRYPTOBOOST
 * Diagnostic rapide pour identifier pourquoi le site n'apparaît pas
 */

import fetch from 'node-fetch';

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
// DIAGNOSTIC 1: VÉRIFICATION CONNEXION DE BASE
// ============================================================================

async function testBasicConnection() {
  logSection('🔍 DIAGNOSTIC 1: VÉRIFICATION CONNEXION DE BASE');
  
  try {
    log(`🔍 Test connexion à ${SITE_URL}...`, 'blue');
    
    const response = await fetch(SITE_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    log(`✅ Connexion réussie - Status: ${response.status}`, 'green');
    log(`✅ URL finale: ${response.url}`, 'green');
    
    // Vérifier le contenu
    const content = await response.text();
    log(`✅ Contenu reçu: ${content.length} caractères`, 'green');
    
    if (content.includes('<html')) {
      log(`✅ HTML détecté dans la réponse`, 'green');
    } else {
      log(`❌ Pas de HTML détecté dans la réponse`, 'red');
    }
    
    if (content.includes('CryptoBoost')) {
      log(`✅ CryptoBoost détecté dans la réponse`, 'green');
    } else {
      log(`❌ CryptoBoost non détecté dans la réponse`, 'red');
    }
    
    return { success: true, status: response.status, contentLength: content.length };
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// ============================================================================
// DIAGNOSTIC 2: VÉRIFICATION REDIRECTIONS
// ============================================================================

async function testRedirects() {
  logSection('🔍 DIAGNOSTIC 2: VÉRIFICATION REDIRECTIONS');
  
  const testUrls = [
    'http://cryptoboost.world',
    'https://www.cryptoboost.world',
    'http://www.cryptoboost.world'
  ];
  
  for (const url of testUrls) {
    try {
      log(`🔍 Test redirection ${url}...`, 'blue');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'manual'
      });

      if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('location');
        log(`✅ Redirection ${response.status} vers: ${location}`, 'green');
      } else {
        log(`⚠️ Status: ${response.status} (pas de redirection)`, 'yellow');
      }
    } catch (error) {
      log(`❌ Erreur ${url}: ${error.message}`, 'red');
    }
  }
}

// ============================================================================
// DIAGNOSTIC 3: VÉRIFICATION PAGES SPÉCIFIQUES
// ============================================================================

async function testSpecificPages() {
  logSection('🔍 DIAGNOSTIC 3: VÉRIFICATION PAGES SPÉCIFIQUES');
  
  const pages = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login-alt.html', name: 'Login Alternative' },
    { path: '/client', name: 'Dashboard Client' },
    { path: '/admin', name: 'Dashboard Admin' }
  ];
  
  for (const page of pages) {
    try {
      log(`🔍 Test ${page.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${page.name} - Status: ${response.status} - Contenu: ${content.length} caractères`, 'green');
        
        if (content.includes('<html')) {
          log(`   ✅ HTML détecté`, 'green');
        } else {
          log(`   ❌ Pas de HTML`, 'red');
        }
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
    }
  }
}

// ============================================================================
// DIAGNOSTIC 4: VÉRIFICATION DNS ET RÉSOLUTION
// ============================================================================

async function testDNSResolution() {
  logSection('🔍 DIAGNOSTIC 4: VÉRIFICATION DNS ET RÉSOLUTION');
  
  try {
    log(`🔍 Test résolution DNS cryptoboost.world...`, 'blue');
    
    // Test avec différentes méthodes
    const testUrls = [
      'https://cryptoboost.world',
      'https://cryptoboost.world/',
      'https://cryptoboost.world/index.html'
    ];
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        log(`✅ ${url} - Status: ${response.status}`, 'green');
      } catch (error) {
        log(`❌ ${url} - Erreur: ${error.message}`, 'red');
      }
    }
  } catch (error) {
    log(`❌ Erreur DNS: ${error.message}`, 'red');
  }
}

// ============================================================================
// DIAGNOSTIC 5: VÉRIFICATION CONFIGURATION NETLIFY
// ============================================================================

async function testNetlifyConfig() {
  logSection('🔍 DIAGNOSTIC 5: VÉRIFICATION CONFIGURATION NETLIFY');
  
  const netlifyFiles = [
    '/_redirects',
    '/_headers',
    '/netlify.toml'
  ];
  
  for (const file of netlifyFiles) {
    try {
      log(`🔍 Test ${file}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${file}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${file} - Status: ${response.status} - Contenu: ${content.length} caractères`, 'green');
      } else {
        log(`⚠️ ${file} - Status: ${response.status} (normal si 404)`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${file} - Erreur: ${error.message}`, 'red');
    }
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function diagnosticSite() {
  log('🔍 DIAGNOSTIC SITE CRYPTOBOOST', 'bright');
  log('Identification du problème pourquoi le site n\'apparaît pas', 'cyan');
  
  try {
    // 1. Test connexion de base
    const basicConnection = await testBasicConnection();
    
    // 2. Test redirections
    await testRedirects();
    
    // 3. Test pages spécifiques
    await testSpecificPages();
    
    // 4. Test DNS
    await testDNSResolution();
    
    // 5. Test configuration Netlify
    await testNetlifyConfig();
    
    // Résumé et recommandations
    logSection('📊 RÉSUMÉ DIAGNOSTIC');
    
    if (basicConnection.success) {
      log('✅ Connexion de base fonctionnelle', 'green');
      log('✅ Le site répond correctement', 'green');
      log('✅ Problème probablement côté client', 'yellow');
      
      log('\n💡 RECOMMANDATIONS:', 'yellow');
      log('1. Vider le cache du navigateur', 'blue');
      log('2. Essayer un autre navigateur', 'blue');
      log('3. Vérifier la connexion internet', 'blue');
      log('4. Désactiver les extensions', 'blue');
      log('5. Essayer en navigation privée', 'blue');
      
      log('\n🌐 URLS À TESTER:', 'yellow');
      log('   - https://cryptoboost.world', 'blue');
      log('   - https://cryptoboost.world/login-alt.html', 'blue');
      log('   - https://cryptoboost.world/client', 'blue');
      log('   - https://cryptoboost.world/admin', 'blue');
      
    } else {
      log('❌ Problème de connexion détecté', 'red');
      log(`❌ Erreur: ${basicConnection.error}`, 'red');
      
      log('\n💡 RECOMMANDATIONS:', 'yellow');
      log('1. Vérifier la connexion internet', 'blue');
      log('2. Attendre quelques minutes', 'blue');
      log('3. Contacter le support', 'blue');
      log('4. Vérifier le statut Netlify', 'blue');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du diagnostic', 'red');
    log(error.message, 'red');
  }
}

// Exécution
diagnosticSite().catch(console.error);