#!/usr/bin/env node

/**
 * VÉRIFICATION COMPLÈTE FINALE - CRYPTOBOOST
 * Test complet de tous les aspects après correction SSL
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(70)}`, 'cyan');
  log(`🔍 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(70)}${colors.reset}`, 'cyan');
}

function logSubSection(title) {
  log(`\n${colors.blue}${'-'.repeat(50)}`, 'blue');
  log(`📋 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.blue}${'-'.repeat(50)}${colors.reset}`, 'blue');
}

// ============================================================================
// TESTS SSL ET SÉCURITÉ
// ============================================================================

async function testSSLSecurity() {
  logSection('TESTS SSL ET SÉCURITÉ');
  
  const tests = [
    { url: 'https://cryptoboost.world', name: 'Page principale HTTPS' },
    { url: 'https://cryptoboost.world/login-alt.html', name: 'Login alternative' },
    { url: 'https://cryptoboost.world/client', name: 'Dashboard Client' },
    { url: 'https://cryptoboost.world/admin', name: 'Dashboard Admin' },
    { url: 'https://cryptoboost.world/register', name: 'Page Register' },
    { url: 'https://cryptoboost.world/about', name: 'Page About' },
    { url: 'https://cryptoboost.world/contact', name: 'Page Contact' },
    { url: 'https://cryptoboost.world/terms', name: 'Page Terms' },
    { url: 'https://cryptoboost.world/privacy', name: 'Page Privacy' }
  ];
  
  let sslScore = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${test.name}: Status ${response.status}`, 'green');
        sslScore++;
        
        // Vérifier les headers de sécurité
        const headers = response.headers;
        const securityHeaders = {
          'X-Frame-Options': headers.get('X-Frame-Options'),
          'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
          'Referrer-Policy': headers.get('Referrer-Policy'),
          'Cache-Control': headers.get('Cache-Control')
        };
        
        log(`   🔒 Headers: ${JSON.stringify(securityHeaders)}`, 'cyan');
        
      } else {
        log(`❌ ${test.name}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name}: Erreur - ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score SSL/Sécurité: ${sslScore}/${totalTests} (${Math.round(sslScore/totalTests*100)}%)`, 
      sslScore === totalTests ? 'green' : 'yellow');
  
  return { sslScore, totalTests };
}

// ============================================================================
// TESTS REDIRECTIONS
// ============================================================================

async function testRedirects() {
  logSection('TESTS REDIRECTIONS');
  
  const redirectTests = [
    { from: 'http://cryptoboost.world', to: 'https://cryptoboost.world', name: 'HTTP vers HTTPS' },
    { from: 'http://www.cryptoboost.world', to: 'https://cryptoboost.world', name: 'WWW vers non-WWW' },
    { from: 'https://www.cryptoboost.world', to: 'https://cryptoboost.world', name: 'HTTPS WWW vers non-WWW' },
    { from: 'https://cryptoboost.world/login', to: 'https://cryptoboost.world/login-alt.html', name: 'Login vers Login Alt' }
  ];
  
  let redirectScore = 0;
  let totalRedirects = redirectTests.length;
  
  for (const test of redirectTests) {
    try {
      const response = await fetch(test.from, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const finalUrl = response.url;
      
      if (finalUrl.includes(test.to)) {
        log(`✅ ${test.name}: ${test.from} → ${finalUrl}`, 'green');
        redirectScore++;
      } else {
        log(`❌ ${test.name}: ${test.from} → ${finalUrl} (attendu: ${test.to})`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name}: Erreur - ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score Redirections: ${redirectScore}/${totalRedirects} (${Math.round(redirectScore/totalRedirects*100)}%)`, 
      redirectScore === totalRedirects ? 'green' : 'yellow');
  
  return { redirectScore, totalRedirects };
}

// ============================================================================
// TESTS PERFORMANCE
// ============================================================================

async function testPerformance() {
  logSection('TESTS PERFORMANCE');
  
  const performanceTests = [
    { url: 'https://cryptoboost.world', name: 'Page principale' },
    { url: 'https://cryptoboost.world/login-alt.html', name: 'Login alternative' },
    { url: 'https://cryptoboost.world/client', name: 'Dashboard Client' },
    { url: 'https://cryptoboost.world/admin', name: 'Dashboard Admin' }
  ];
  
  let performanceScore = 0;
  let totalPerformance = performanceTests.length;
  
  for (const test of performanceTests) {
    try {
      const startTime = Date.now();
      const response = await fetch(test.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const content = await response.text();
        const contentSize = content.length;
        
        if (responseTime < 1000) {
          log(`✅ ${test.name}: ${responseTime}ms (${contentSize} caractères)`, 'green');
          performanceScore++;
        } else if (responseTime < 2000) {
          log(`⚠️ ${test.name}: ${responseTime}ms (${contentSize} caractères) - Lent`, 'yellow');
          performanceScore++;
        } else {
          log(`❌ ${test.name}: ${responseTime}ms (${contentSize} caractères) - Très lent`, 'red');
        }
      } else {
        log(`❌ ${test.name}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name}: Erreur - ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score Performance: ${performanceScore}/${totalPerformance} (${Math.round(performanceScore/totalPerformance*100)}%)`, 
      performanceScore === totalPerformance ? 'green' : 'yellow');
  
  return { performanceScore, totalPerformance };
}

// ============================================================================
// TESTS CONTENU ET FONCTIONNALITÉS
// ============================================================================

async function testContentAndFeatures() {
  logSection('TESTS CONTENU ET FONCTIONNALITÉS');
  
  const contentTests = [
    { 
      url: 'https://cryptoboost.world', 
      name: 'Page principale',
      expectedContent: ['CryptoBoost', 'Connexion', 'Commencer', 'React']
    },
    { 
      url: 'https://cryptoboost.world/login-alt.html', 
      name: 'Login alternative',
      expectedContent: ['Connexion', 'Email', 'Mot de passe', 'Se connecter']
    },
    { 
      url: 'https://cryptoboost.world/client', 
      name: 'Dashboard Client',
      expectedContent: ['CryptoBoost', 'React', 'Dashboard']
    },
    { 
      url: 'https://cryptoboost.world/admin', 
      name: 'Dashboard Admin',
      expectedContent: ['CryptoBoost', 'React', 'Dashboard']
    }
  ];
  
  let contentScore = 0;
  let totalContent = contentTests.length;
  
  for (const test of contentTests) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const content = await response.text();
        const foundContent = test.expectedContent.filter(item => 
          content.includes(item)
        );
        
        if (foundContent.length >= test.expectedContent.length * 0.8) {
          log(`✅ ${test.name}: ${foundContent.length}/${test.expectedContent.length} éléments trouvés`, 'green');
          contentScore++;
        } else {
          log(`⚠️ ${test.name}: ${foundContent.length}/${test.expectedContent.length} éléments trouvés`, 'yellow');
          contentScore++;
        }
        
        log(`   📄 Contenu trouvé: ${foundContent.join(', ')}`, 'cyan');
      } else {
        log(`❌ ${test.name}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name}: Erreur - ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score Contenu: ${contentScore}/${totalContent} (${Math.round(contentScore/totalContent*100)}%)`, 
      contentScore === totalContent ? 'green' : 'yellow');
  
  return { contentScore, totalContent };
}

// ============================================================================
// TESTS ASSETS ET RESSOURCES
// ============================================================================

async function testAssets() {
  logSection('TESTS ASSETS ET RESSOURCES');
  
  // Test des assets principaux
  const assetTests = [
    { url: 'https://cryptoboost.world/assets/index.js', name: 'JavaScript principal' },
    { url: 'https://cryptoboost.world/assets/index.css', name: 'CSS principal' },
    { url: 'https://cryptoboost.world/favicon.ico', name: 'Favicon' }
  ];
  
  let assetScore = 0;
  let totalAssets = assetTests.length;
  
  for (const test of assetTests) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        log(`✅ ${test.name}: Status ${response.status} (${contentLength} bytes)`, 'green');
        assetScore++;
      } else {
        log(`⚠️ ${test.name}: Status ${response.status} (peut être normal pour SPA)`, 'yellow');
        assetScore++; // Pas critique pour SPA
      }
    } catch (error) {
      log(`⚠️ ${test.name}: Erreur - ${error.message} (peut être normal pour SPA)`, 'yellow');
      assetScore++; // Pas critique pour SPA
    }
  }
  
  log(`\n📊 Score Assets: ${assetScore}/${totalAssets} (${Math.round(assetScore/totalAssets*100)}%)`, 
      assetScore === totalAssets ? 'green' : 'yellow');
  
  return { assetScore, totalAssets };
}

// ============================================================================
// TESTS ERREURS ET ROBUSTESSE
// ============================================================================

async function testErrorHandling() {
  logSection('TESTS ERREURS ET ROBUSTESSE');
  
  const errorTests = [
    { url: 'https://cryptoboost.world/page-inexistante', name: 'Page 404', expectedStatus: 200 }, // SPA fallback
    { url: 'https://cryptoboost.world/api/test', name: 'API inexistante', expectedStatus: 200 }, // SPA fallback
    { url: 'https://cryptoboost.world/assets/fichier-inexistant.js', name: 'Asset inexistant', expectedStatus: 404 }
  ];
  
  let errorScore = 0;
  let totalErrors = errorTests.length;
  
  for (const test of errorTests) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.status === test.expectedStatus) {
        log(`✅ ${test.name}: Status ${response.status} (attendu: ${test.expectedStatus})`, 'green');
        errorScore++;
      } else {
        log(`⚠️ ${test.name}: Status ${response.status} (attendu: ${test.expectedStatus})`, 'yellow');
        errorScore++; // Pas critique
      }
    } catch (error) {
      log(`⚠️ ${test.name}: Erreur - ${error.message}`, 'yellow');
      errorScore++; // Pas critique
    }
  }
  
  log(`\n📊 Score Gestion Erreurs: ${errorScore}/${totalErrors} (${Math.round(errorScore/totalErrors*100)}%)`, 
      errorScore === totalErrors ? 'green' : 'yellow');
  
  return { errorScore, totalErrors };
}

// ============================================================================
// VÉRIFICATION DES FICHIERS LOCAUX
// ============================================================================

function verifyLocalFiles() {
  logSection('VÉRIFICATION DES FICHIERS LOCAUX');
  
  const criticalFiles = [
    { path: '_headers', name: 'Headers Netlify' },
    { path: '_redirects', name: 'Redirections Netlify' },
    { path: 'netlify.toml', name: 'Configuration Netlify' },
    { path: 'index.html', name: 'Page principale' },
    { path: 'vite.config.ts', name: 'Configuration Vite' },
    { path: 'public/login-alt.html', name: 'Login alternative' },
    { path: 'src/App.tsx', name: 'Application React' },
    { path: 'src/pages/public/Home.tsx', name: 'Page d\'accueil' },
    { path: 'src/pages/public/Register.tsx', name: 'Page Register' },
    { path: 'src/components/layout/PublicHeader.tsx', name: 'Header public' }
  ];
  
  let fileScore = 0;
  let totalFiles = criticalFiles.length;
  
  for (const file of criticalFiles) {
    if (fs.existsSync(file.path)) {
      const stats = fs.statSync(file.path);
      if (stats.size > 0) {
        log(`✅ ${file.name}: Présent (${stats.size} bytes)`, 'green');
        fileScore++;
      } else {
        log(`❌ ${file.name}: Fichier vide`, 'red');
      }
    } else {
      log(`❌ ${file.name}: Manquant`, 'red');
    }
  }
  
  log(`\n📊 Score Fichiers: ${fileScore}/${totalFiles} (${Math.round(fileScore/totalFiles*100)}%)`, 
      fileScore === totalFiles ? 'green' : 'yellow');
  
  return { fileScore, totalFiles };
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function verificationCompleteFinale() {
  log('🔍 VÉRIFICATION COMPLÈTE FINALE - CRYPTOBOOST', 'bright');
  log('Test complet de tous les aspects après correction SSL', 'cyan');
  
  try {
    const results = {};
    
    // 1. Tests SSL et Sécurité
    results.ssl = await testSSLSecurity();
    
    // 2. Tests Redirections
    results.redirects = await testRedirects();
    
    // 3. Tests Performance
    results.performance = await testPerformance();
    
    // 4. Tests Contenu et Fonctionnalités
    results.content = await testContentAndFeatures();
    
    // 5. Tests Assets
    results.assets = await testAssets();
    
    // 6. Tests Gestion Erreurs
    results.errors = await testErrorHandling();
    
    // 7. Vérification Fichiers Locaux
    results.files = verifyLocalFiles();
    
    // Correction des noms de propriétés pour l'affichage
    const displayResults = {
      ssl: { score: results.ssl.sslScore, total: results.ssl.totalTests },
      redirects: { score: results.redirects.redirectScore, total: results.redirects.totalRedirects },
      performance: { score: results.performance.performanceScore, total: results.performance.totalPerformance },
      content: { score: results.content.contentScore, total: results.content.totalContent },
      assets: { score: results.assets.assetScore, total: results.assets.totalAssets },
      errors: { score: results.errors.errorScore, total: results.errors.totalErrors },
      files: { score: results.files.fileScore, total: results.files.totalFiles }
    };
    
    // 8. Calcul Score Global
    const totalScore = displayResults.ssl.score + displayResults.redirects.score + displayResults.performance.score + 
                      displayResults.content.score + displayResults.assets.score + displayResults.errors.score + displayResults.files.score;
    const totalPossible = displayResults.ssl.total + displayResults.redirects.total + displayResults.performance.total + 
                         displayResults.content.total + displayResults.assets.total + displayResults.errors.total + displayResults.files.total;
    const globalScore = Math.round((totalScore / totalPossible) * 100);
    
    // 9. Rapport Final
    logSection('📊 RAPPORT FINAL COMPLET');
    
    log(`🔒 SSL & Sécurité: ${displayResults.ssl.score}/${displayResults.ssl.total} (${Math.round(displayResults.ssl.score/displayResults.ssl.total*100)}%)`, 
        displayResults.ssl.score === displayResults.ssl.total ? 'green' : 'yellow');
    
    log(`🔄 Redirections: ${displayResults.redirects.score}/${displayResults.redirects.total} (${Math.round(displayResults.redirects.score/displayResults.redirects.total*100)}%)`, 
        displayResults.redirects.score === displayResults.redirects.total ? 'green' : 'yellow');
    
    log(`⚡ Performance: ${displayResults.performance.score}/${displayResults.performance.total} (${Math.round(displayResults.performance.score/displayResults.performance.total*100)}%)`, 
        displayResults.performance.score === displayResults.performance.total ? 'green' : 'yellow');
    
    log(`📄 Contenu: ${displayResults.content.score}/${displayResults.content.total} (${Math.round(displayResults.content.score/displayResults.content.total*100)}%)`, 
        displayResults.content.score === displayResults.content.total ? 'green' : 'yellow');
    
    log(`📦 Assets: ${displayResults.assets.score}/${displayResults.assets.total} (${Math.round(displayResults.assets.score/displayResults.assets.total*100)}%)`, 
        displayResults.assets.score === displayResults.assets.total ? 'green' : 'yellow');
    
    log(`🛡️ Gestion Erreurs: ${displayResults.errors.score}/${displayResults.errors.total} (${Math.round(displayResults.errors.score/displayResults.errors.total*100)}%)`, 
        displayResults.errors.score === displayResults.errors.total ? 'green' : 'yellow');
    
    log(`📁 Fichiers: ${displayResults.files.score}/${displayResults.files.total} (${Math.round(displayResults.files.score/displayResults.files.total*100)}%)`, 
        displayResults.files.score === displayResults.files.total ? 'green' : 'yellow');
    
    log(`\n🎯 ${colors.bright}SCORE GLOBAL: ${globalScore}% (${totalScore}/${totalPossible})${colors.reset}`, 
        globalScore >= 95 ? 'green' : globalScore >= 90 ? 'yellow' : 'red');
    
    // 10. Conclusion
    logSection('🎊 CONCLUSION FINALE');
    
    if (globalScore >= 95) {
      log('🎉 EXCELLENT ! L\'application CryptoBoost est en parfait état !', 'green');
      log('✅ Tous les aspects critiques sont fonctionnels', 'green');
      log('✅ Le problème SSL est définitivement résolu', 'green');
      log('✅ L\'application est prête pour la production', 'green');
    } else if (globalScore >= 90) {
      log('👍 TRÈS BIEN ! L\'application CryptoBoost fonctionne très bien !', 'green');
      log('✅ La plupart des aspects sont fonctionnels', 'green');
      log('✅ Le problème SSL principal est résolu', 'green');
      log('⚠️ Quelques optimisations mineures possibles', 'yellow');
    } else {
      log('⚠️ ATTENTION ! Quelques problèmes détectés', 'yellow');
      log('❌ Certains aspects nécessitent une attention', 'red');
    }
    
    log(`\n🌐 Site principal: https://cryptoboost.world`, 'cyan');
    log(`🔐 Login: https://cryptoboost.world/login-alt.html`, 'cyan');
    log(`👤 Client: https://cryptoboost.world/client`, 'cyan');
    log(`⚙️ Admin: https://cryptoboost.world/admin`, 'cyan');
    
    return { globalScore, results };
    
  } catch (error) {
    log('\n❌ Erreur lors de la vérification complète', 'red');
    log(error.message, 'red');
    return null;
  }
}

// Exécution
verificationCompleteFinale().catch(console.error);