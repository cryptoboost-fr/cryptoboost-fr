#!/usr/bin/env node

/**
 * TEST SSL FIX - CRYPTOBOOST
 * Test pour vérifier que le problème ERR_SSL_PROTOCOL_ERROR est résolu
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
  log(`🔍 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TEST 1: VÉRIFICATION PAGE D'ACCUEIL
// ============================================================================

async function testHomePage() {
  logSection('TEST 1: VÉRIFICATION PAGE D\'ACCUEIL');
  
  try {
    log(`🔍 Test page d'accueil ${SITE_URL}...`, 'blue');
    
    const startTime = Date.now();
    const response = await fetch(SITE_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.ok) {
      const content = await response.text();
      
      log(`✅ Page d'accueil accessible - Status: ${response.status}`, 'green');
      log(`✅ Temps de réponse: ${responseTime}ms`, 'green');
      log(`✅ Contenu reçu: ${content.length} caractères`, 'green');
      log(`✅ URL finale: ${response.url}`, 'green');
      
      // Vérifications SSL
      const sslChecks = [
        { name: 'HTTPS', test: response.url.startsWith('https://') },
        { name: 'HTML', test: content.includes('<html') },
        { name: 'CryptoBoost', test: content.includes('CryptoBoost') },
        { name: 'Pas d\'erreur SSL', test: !content.includes('ERR_SSL_PROTOCOL_ERROR') },
        { name: 'Pas d\'erreur de connexion', test: !content.includes('connexion sécurisée') }
      ];
      
      let sslScore = 0;
      for (const check of sslChecks) {
        if (check.test) {
          log(`✅ ${check.name}`, 'green');
          sslScore++;
        } else {
          log(`❌ ${check.name}`, 'red');
        }
      }
      
      log(`\n📊 Score SSL: ${sslScore}/${sslChecks.length}`, 
          sslScore === sslChecks.length ? 'green' : 'yellow');
      
      return { 
        success: true, 
        status: response.status, 
        responseTime, 
        contentLength: content.length,
        sslScore,
        totalChecks: sslChecks.length
      };
    } else {
      log(`❌ Erreur HTTP - Status: ${response.status}`, 'red');
      return { success: false, status: response.status };
    }
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// ============================================================================
// TEST 2: VÉRIFICATION HEADERS SSL
// ============================================================================

async function testSSLHeaders() {
  logSection('TEST 2: VÉRIFICATION HEADERS SSL');
  
  try {
    log(`🔍 Test headers SSL...`, 'blue');
    
    const response = await fetch(SITE_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const headers = response.headers;
      let headerScore = 0;
      let totalChecks = 0;
      
      // Vérifier les headers de sécurité critiques
      const headerChecks = [
        { name: 'X-Frame-Options', header: 'x-frame-options', expected: 'DENY' },
        { name: 'X-Content-Type-Options', header: 'x-content-type-options', expected: 'nosniff' },
        { name: 'Referrer-Policy', header: 'referrer-policy', expected: 'strict-origin-when-cross-origin' },
        { name: 'Cache-Control', header: 'cache-control', expected: null },
        { name: 'HTTPS', header: null, expected: 'https' }
      ];
      
      for (const check of headerChecks) {
        if (check.header) {
          const value = headers.get(check.header);
          if (value) {
            log(`✅ ${check.name}: ${value}`, 'green');
            headerScore++;
          } else {
            log(`❌ ${check.name}: Manquant`, 'red');
          }
        } else if (check.name === 'HTTPS') {
          if (response.url.startsWith('https://')) {
            log(`✅ ${check.name}: Activé`, 'green');
            headerScore++;
          } else {
            log(`❌ ${check.name}: Non activé`, 'red');
          }
        }
        totalChecks++;
      }
      
      log(`\n📊 Score headers: ${headerScore}/${totalChecks}`, 
          headerScore === totalChecks ? 'green' : 'yellow');
      
      return { headerScore, totalChecks };
    } else {
      log(`❌ Impossible de vérifier les headers - Status: ${response.status}`, 'red');
      return { headerScore: 0, totalChecks: 1 };
    }
  } catch (error) {
    log(`❌ Erreur vérification headers: ${error.message}`, 'red');
    return { headerScore: 0, totalChecks: 1 };
  }
}

// ============================================================================
// TEST 3: VÉRIFICATION REDIRECTIONS
// ============================================================================

async function testRedirects() {
  logSection('TEST 3: VÉRIFICATION REDIRECTIONS');
  
  const testUrls = [
    'http://cryptoboost.world',
    'https://www.cryptoboost.world',
    'http://www.cryptoboost.world'
  ];
  
  let redirectScore = 0;
  let totalRedirects = testUrls.length;
  
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
        if (location && location.includes('https://cryptoboost.world')) {
          log(`✅ Redirection ${response.status} vers: ${location}`, 'green');
          redirectScore++;
        } else {
          log(`❌ Redirection incorrecte: ${location}`, 'red');
        }
      } else {
        log(`⚠️ Status: ${response.status} (pas de redirection)`, 'yellow');
      }
    } catch (error) {
      log(`❌ Erreur ${url}: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score redirections: ${redirectScore}/${totalRedirects}`, 
      redirectScore === totalRedirects ? 'green' : 'yellow');
  
  return { redirectScore, totalRedirects };
}

// ============================================================================
// TEST 4: VÉRIFICATION PAGES CRITIQUES
// ============================================================================

async function testCriticalPages() {
  logSection('TEST 4: VÉRIFICATION PAGES CRITIQUES');
  
  const criticalPages = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login-alt.html', name: 'Login Alternative' },
    { path: '/client', name: 'Dashboard Client' },
    { path: '/admin', name: 'Dashboard Admin' }
  ];
  
  let successCount = 0;
  let totalCount = criticalPages.length;
  
  for (const page of criticalPages) {
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
        successCount++;
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé pages critiques: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount };
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testSSLFix() {
  log('🔍 TEST SSL FIX - CRYPTOBOOST', 'bright');
  log('Vérification que le problème ERR_SSL_PROTOCOL_ERROR est résolu', 'cyan');
  
  try {
    // Attendre le redéploiement
    log('⏳ Attente du redéploiement Netlify...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // 1. Test page d'accueil
    const homePage = await testHomePage();
    
    // 2. Test headers SSL
    const sslHeaders = await testSSLHeaders();
    
    // 3. Test redirections
    const redirects = await testRedirects();
    
    // 4. Test pages critiques
    const criticalPages = await testCriticalPages();
    
    // Calcul du score global
    const totalSuccess = homePage.success ? 1 : 0;
    const totalSSL = homePage.sslScore;
    const totalHeaders = sslHeaders.headerScore;
    const totalRedirects = redirects.redirectScore;
    const totalPages = criticalPages.successCount;
    
    const totalTests = 1 + homePage.totalChecks + sslHeaders.totalChecks + redirects.totalRedirects + criticalPages.totalCount;
    const totalPassed = totalSuccess + totalSSL + totalHeaders + totalRedirects + totalPages;
    
    // Résumé final
    logSection('📊 RÉSUMÉ TEST SSL FIX');
    log(`✅ Page d'accueil: ${homePage.success ? 'Oui' : 'Non'}`, homePage.success ? 'green' : 'red');
    log(`✅ Score SSL: ${homePage.sslScore}/${homePage.totalChecks}`, homePage.sslScore === homePage.totalChecks ? 'green' : 'red');
    log(`✅ Headers SSL: ${sslHeaders.headerScore}/${sslHeaders.totalChecks}`, sslHeaders.headerScore === sslHeaders.totalChecks ? 'green' : 'red');
    log(`✅ Redirections: ${redirects.redirectScore}/${redirects.totalRedirects}`, redirects.redirectScore === redirects.totalRedirects ? 'green' : 'red');
    log(`✅ Pages critiques: ${criticalPages.successCount}/${criticalPages.totalCount}`, criticalPages.successCount === criticalPages.totalCount ? 'green' : 'red');
    
    const globalScore = Math.round((totalPassed / totalTests) * 100);
    log(`\n🎯 SCORE GLOBAL: ${totalPassed}/${totalTests} (${globalScore}%)`, 
        globalScore === 100 ? 'green' : globalScore >= 95 ? 'yellow' : 'red');
    
    if (globalScore === 100) {
      logSection('🎉 SUCCÈS COMPLET - PROBLÈME SSL RÉSOLU !');
      log('✅ ERR_SSL_PROTOCOL_ERROR résolu', 'green');
      log('✅ Page d\'accueil accessible', 'green');
      log('✅ Headers SSL corrects', 'green');
      log('✅ Redirections fonctionnelles', 'green');
      log('✅ Toutes les pages critiques accessibles', 'green');
      
      log('\n🌐 SITE 100% OPÉRATIONNEL:', 'yellow');
      log('   - URL: https://cryptoboost.world', 'blue');
      log('   - Login: https://cryptoboost.world/login-alt.html', 'blue');
      log('   - Dashboard Client: https://cryptoboost.world/client', 'blue');
      log('   - Dashboard Admin: https://cryptoboost.world/admin', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n🎉 LE PROBLÈME SSL EST DÉFINITIVEMENT RÉSOLU !', 'green');
    } else if (globalScore >= 95) {
      logSection('🎉 SUCCÈS MAJEUR - PROBLÈME SSL QUASI-RÉSOLU');
      log('✅ La plupart des problèmes SSL résolus', 'green');
      log('⚠️ Quelques éléments mineurs à vérifier', 'yellow');
      log('💡 Site fonctionnel', 'green');
    } else {
      logSection('⚠️ PROBLÈMES SSL RESTANTS');
      log('❌ Le problème SSL n\'est pas complètement résolu', 'red');
      log('💡 Vérification manuelle recommandée', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du test SSL fix', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testSSLFix().catch(console.error);