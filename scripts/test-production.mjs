#!/usr/bin/env node

/**
 * Script de test de l'application CryptoBoost en production
 * Test des URLs et fonctionnalités déployées
 */

import fetch from 'node-fetch';

// URLs de production
const PRODUCTION_URLS = {
  main: 'https://cryptoboost.world',
  admin: 'https://cryptoboost.world/admin',
  client: 'https://cryptoboost.world/client',
  login: 'https://cryptoboost.world/login',
  register: 'https://cryptoboost.world/register'
};

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

// Test d'une URL
async function testUrl(url, name) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'CryptoBoost-Test/1.0'
      },
      timeout: 10000
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      const content = await response.text();
      
      // Vérifier que c'est bien notre application
      if (content.includes('CryptoBoost') || content.includes('cryptoboost')) {
        logSuccess(`${name}: OK (${response.status}) - ${responseTime}ms`);
        return true;
      } else {
        logWarning(`${name}: Réponse inattendue (${response.status}) - ${responseTime}ms`);
        return false;
      }
    } else {
      logError(`${name}: Erreur ${response.status} - ${responseTime}ms`);
      return false;
    }
  } catch (error) {
    logError(`${name}: Erreur de connexion - ${error.message}`);
    return false;
  }
}

// Test de la navigation
async function testNavigation() {
  log('\n🧭 TEST DE LA NAVIGATION', 'cyan');
  
  const results = [];
  
  for (const [key, url] of Object.entries(PRODUCTION_URLS)) {
    const result = await testUrl(url, key.toUpperCase());
    results.push([key, result]);
  }
  
  return results;
}

// Test des fonctionnalités principales
async function testMainFeatures() {
  log('\n🎯 TEST DES FONCTIONNALITÉS PRINCIPALES', 'cyan');
  
  try {
    // Test de la page principale
    const mainResponse = await fetch(PRODUCTION_URLS.main);
    const mainContent = await mainResponse.text();
    
    // Vérifier les éléments clés
    const checks = [
      { name: 'Titre CryptoBoost', found: mainContent.includes('CryptoBoost') },
      { name: 'Navigation', found: mainContent.includes('nav') || mainContent.includes('menu') },
      { name: 'Footer', found: mainContent.includes('footer') },
      { name: 'React App', found: mainContent.includes('root') || mainContent.includes('app') }
    ];
    
    let allChecksPassed = true;
    
    for (const check of checks) {
      if (check.found) {
        logSuccess(`${check.name}: Présent`);
      } else {
        logWarning(`${check.name}: Manquant`);
        allChecksPassed = false;
      }
    }
    
    return allChecksPassed;
  } catch (error) {
    logError(`Erreur lors du test des fonctionnalités: ${error.message}`);
    return false;
  }
}

// Test de la performance
async function testPerformance() {
  log('\n⚡ TEST DE PERFORMANCE', 'cyan');
  
  const performanceResults = [];
  
  for (const [key, url] of Object.entries(PRODUCTION_URLS)) {
    try {
      const startTime = Date.now();
      const response = await fetch(url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        if (responseTime < 2000) {
          logSuccess(`${key}: Rapide (${responseTime}ms)`);
          performanceResults.push(true);
        } else if (responseTime < 5000) {
          logWarning(`${key}: Lent (${responseTime}ms)`);
          performanceResults.push(false);
        } else {
          logError(`${key}: Très lent (${responseTime}ms)`);
          performanceResults.push(false);
        }
      } else {
        logError(`${key}: Erreur ${response.status}`);
        performanceResults.push(false);
      }
    } catch (error) {
      logError(`${key}: Erreur de connexion`);
      performanceResults.push(false);
    }
  }
  
  const successRate = (performanceResults.filter(Boolean).length / performanceResults.length) * 100;
  return successRate >= 80;
}

// Test de la sécurité
async function testSecurity() {
  log('\n🔒 TEST DE SÉCURITÉ', 'cyan');
  
  try {
    // Test des en-têtes de sécurité
    const response = await fetch(PRODUCTION_URLS.main);
    const headers = response.headers;
    
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy'
    ];
    
    let securityScore = 0;
    
    for (const header of securityHeaders) {
      if (headers.get(header)) {
        logSuccess(`En-tête ${header}: Présent`);
        securityScore++;
      } else {
        logWarning(`En-tête ${header}: Manquant`);
      }
    }
    
    const securityPercentage = (securityScore / securityHeaders.length) * 100;
    
    if (securityPercentage >= 60) {
      logSuccess(`Score de sécurité: ${securityPercentage.toFixed(1)}%`);
      return true;
    } else {
      logWarning(`Score de sécurité faible: ${securityPercentage.toFixed(1)}%`);
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test de sécurité: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runProductionTests() {
  log('\n🚀 TEST DE L\'APPLICATION CRYPTOBOOST EN PRODUCTION', 'magenta');
  log('=' * 60, 'magenta');
  
  const startTime = Date.now();
  
  try {
    // Tests séquentiels
    const navigationResults = await testNavigation();
    const featuresResult = await testMainFeatures();
    const performanceResult = await testPerformance();
    const securityResult = await testSecurity();
    
    const totalTime = Date.now() - startTime;
    
    // Résumé
    log('\n🎉 RÉSUMÉ DES TESTS DE PRODUCTION', 'green');
    log('=' * 40, 'green');
    
    const navigationSuccess = navigationResults.filter(([, result]) => result).length;
    const navigationTotal = navigationResults.length;
    
    logSuccess(`Navigation: ${navigationSuccess}/${navigationTotal} URLs accessibles`);
    logSuccess(`Fonctionnalités: ${featuresResult ? 'OK' : 'PROBLÈMES'}`);
    logSuccess(`Performance: ${performanceResult ? 'OK' : 'LENT'}`);
    logSuccess(`Sécurité: ${securityResult ? 'OK' : 'AMÉLIORATIONS NÉCESSAIRES'}`);
    
    log('\n📊 STATISTIQUES', 'cyan');
    log(`Temps total: ${totalTime}ms`);
    log(`URLs testées: ${navigationTotal}`);
    log(`URLs accessibles: ${navigationSuccess}`);
    
    const overallSuccess = navigationSuccess >= 4 && featuresResult && performanceResult;
    
    if (overallSuccess) {
      log('\n🎯 VOTRE APPLICATION CRYPTOBOOST EST OPÉRATIONNELLE EN PRODUCTION !', 'green');
      log('🌐 URL principale: https://cryptoboost.world/', 'cyan');
      log('📊 Dashboard Admin: https://cryptoboost.world/admin', 'cyan');
      log('👤 Dashboard Client: https://cryptoboost.world/client', 'cyan');
    } else {
      log('\n⚠️ DES PROBLÈMES ONT ÉTÉ DÉTECTÉS EN PRODUCTION', 'yellow');
      log('Veuillez vérifier le déploiement et la configuration.', 'yellow');
    }
    
  } catch (error) {
    logError(`Erreur critique lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
runProductionTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});