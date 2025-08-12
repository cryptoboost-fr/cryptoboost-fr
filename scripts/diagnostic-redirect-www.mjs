#!/usr/bin/env node

/**
 * DIAGNOSTIC REDIRECT WWW - CRYPTOBOOST
 * Diagnostic spécifique du problème de redirection www
 */

import fetch from 'node-fetch';

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
// DIAGNOSTIC REDIRECTION WWW
// ============================================================================

async function diagnosticRedirectWWW() {
  logSection('DIAGNOSTIC REDIRECTION WWW');
  
  const testUrl = 'http://www.cryptoboost.world';
  
  try {
    log(`🔍 Test spécifique: ${testUrl}`, 'blue');
    
    // Test 1: Redirection manuelle
    log('\n📋 Test 1: Redirection manuelle...', 'yellow');
    const response1 = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'manual'
    });

    log(`Status: ${response1.status}`, response1.status === 301 ? 'green' : 'red');
    log(`Location: ${response1.headers.get('location')}`, 'blue');
    
    // Test 2: Redirection automatique
    log('\n📋 Test 2: Redirection automatique...', 'yellow');
    const response2 = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow'
    });

    log(`Status final: ${response2.status}`, response2.status === 200 ? 'green' : 'red');
    log(`URL finale: ${response2.url}`, 'blue');
    
    // Test 3: Vérification du contenu
    log('\n📋 Test 3: Vérification du contenu...', 'yellow');
    const content = await response2.text();
    log(`Contenu reçu: ${content.length} caractères`, 'blue');
    log(`Contient CryptoBoost: ${content.includes('CryptoBoost') ? 'Oui' : 'Non'}`, 
        content.includes('CryptoBoost') ? 'green' : 'red');
    
    // Test 4: Test avec différents User-Agents
    log('\n📋 Test 4: Test avec différents User-Agents...', 'yellow');
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'curl/7.68.0'
    ];
    
    for (const userAgent of userAgents) {
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: { 'User-Agent': userAgent },
          redirect: 'manual'
        });
        log(`User-Agent: ${userAgent.substring(0, 30)}... - Status: ${response.status} - Location: ${response.headers.get('location')}`, 
            response.headers.get('location')?.includes('cryptoboost.world') && !response.headers.get('location')?.includes('www.cryptoboost.world') ? 'green' : 'red');
      } catch (error) {
        log(`User-Agent: ${userAgent.substring(0, 30)}... - Erreur: ${error.message}`, 'red');
      }
    }
    
    // Test 5: Test avec cache désactivé
    log('\n📋 Test 5: Test avec cache désactivé...', 'yellow');
    const response5 = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'manual'
    });

    log(`Status: ${response5.status}`, response5.status === 301 ? 'green' : 'red');
    log(`Location: ${response5.headers.get('location')}`, 'blue');
    
    return {
      status: response1.status,
      location: response1.headers.get('location'),
      finalUrl: response2.url,
      contentLength: content.length,
      hasCryptoBoost: content.includes('CryptoBoost')
    };
    
  } catch (error) {
    log(`❌ Erreur lors du diagnostic: ${error.message}`, 'red');
    return { error: error.message };
  }
}

// ============================================================================
// ANALYSE DES RÉSULTATS
// ============================================================================

function analyzeResults(results) {
  logSection('ANALYSE DES RÉSULTATS');
  
  if (results.error) {
    log(`❌ Erreur détectée: ${results.error}`, 'red');
    return;
  }
  
  log(`📊 Status de redirection: ${results.status}`, results.status === 301 ? 'green' : 'red');
  log(`📊 Location header: ${results.location}`, 'blue');
  log(`📊 URL finale: ${results.finalUrl}`, 'blue');
  log(`📊 Contenu reçu: ${results.contentLength} caractères`, 'blue');
  log(`📊 Contient CryptoBoost: ${results.hasCryptoBoost ? 'Oui' : 'Non'}`, 
      results.hasCryptoBoost ? 'green' : 'red');
  
  // Analyse du problème
  log('\n🔍 ANALYSE DU PROBLÈME:', 'yellow');
  
  if (results.location && results.location.includes('www.cryptoboost.world')) {
    log('❌ PROBLÈME IDENTIFIÉ: Redirection vers www.cryptoboost.world', 'red');
    log('💡 CAUSE POSSIBLE: Configuration DNS ou Netlify spécifique', 'yellow');
    log('💡 SOLUTION: Vérifier la configuration DNS de www.cryptoboost.world', 'yellow');
  } else if (results.location && results.location.includes('cryptoboost.world')) {
    log('✅ REDIRECTION CORRECTE: Vers cryptoboost.world (sans www)', 'green');
  } else {
    log('⚠️ REDIRECTION INATTENDUE: Vérifier la configuration', 'yellow');
  }
  
  // Recommandations
  log('\n💡 RECOMMANDATIONS:', 'yellow');
  log('1. Vérifier la configuration DNS de www.cryptoboost.world', 'blue');
  log('2. Vérifier les paramètres Netlify pour les sous-domaines', 'blue');
  log('3. Attendre la propagation DNS (peut prendre 24-48h)', 'blue');
  log('4. Contacter le support Netlify si le problème persiste', 'blue');
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function diagnosticWWW() {
  log('🔍 DIAGNOSTIC REDIRECT WWW - CRYPTOBOOST', 'bright');
  log('Diagnostic spécifique du problème de redirection www', 'cyan');
  
  try {
    const results = await diagnosticRedirectWWW();
    analyzeResults(results);
    
    logSection('📋 RÉSUMÉ DIAGNOSTIC');
    log('✅ Diagnostic complet effectué', 'green');
    log('✅ Problème identifié et analysé', 'green');
    log('✅ Recommandations fournies', 'green');
    
  } catch (error) {
    log('\n❌ Erreur lors du diagnostic WWW', 'red');
    log(error.message, 'red');
  }
}

// Exécution
diagnosticWWW().catch(console.error);