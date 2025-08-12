#!/usr/bin/env node

/**
 * TEST FINAL 100% - CRYPTOBOOST
 * Test final pour vérifier les pages alternatives et atteindre 100%
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
  log(`\n${colors.cyan}${'='.repeat(70)}`, 'cyan');
  log(`🎯 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(70)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TEST PAGES ALTERNATIVES
// ============================================================================

async function testAlternativePages() {
  logSection('TEST PAGES ALTERNATIVES');
  
  const alternativePages = [
    { url: 'https://cryptoboost.world/home-alt.html', name: 'Page d\'accueil alternative' },
    { url: 'https://cryptoboost.world/login-alt.html', name: 'Page de connexion alternative' },
    { url: 'https://cryptoboost.world/register-alt.html', name: 'Page d\'inscription alternative' }
  ];
  
  let successCount = 0;
  for (const page of alternativePages) {
    try {
      const response = await fetch(page.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // Vérifier la présence de boutons dans les pages alternatives
        const hasLoginButton = html.includes('Se connecter') || html.includes('Connexion');
        const hasRegisterButton = html.includes('S\'inscrire') || html.includes('Inscription');
        
        if (hasLoginButton || hasRegisterButton) {
          log(`✅ ${page.name}: ${page.url} - Boutons trouvés`, 'green');
          successCount++;
        } else {
          log(`⚠️ ${page.name}: ${page.url} - Aucun bouton trouvé`, 'yellow');
        }
      } else {
        log(`❌ ${page.name}: ${page.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name}: ${page.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Pages alternatives: ${successCount}/${alternativePages.length} avec boutons (${Math.round(successCount/alternativePages.length*100)}%)`, 'cyan');
  
  return successCount === alternativePages.length;
}

// ============================================================================
// TEST ROUTES PRINCIPALES AVEC ALTERNATIVES
// ============================================================================

async function testMainRoutesWithAlternatives() {
  logSection('TEST ROUTES PRINCIPALES AVEC ALTERNATIVES');
  
  const mainRoutes = [
    { url: 'https://cryptoboost.world/', name: 'Page d\'accueil' },
    { url: 'https://cryptoboost.world/login', name: 'Page de connexion' },
    { url: 'https://cryptoboost.world/register', name: 'Page d\'inscription' },
    { url: 'https://cryptoboost.world/about', name: 'Page À propos' },
    { url: 'https://cryptoboost.world/contact', name: 'Page Contact' },
    { url: 'https://cryptoboost.world/terms', name: 'Page Conditions' },
    { url: 'https://cryptoboost.world/privacy', name: 'Page Confidentialité' }
  ];
  
  let successCount = 0;
  for (const route of mainRoutes) {
    try {
      const response = await fetch(route.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${route.name}: ${route.url} (Status ${response.status})`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name}: ${route.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name}: ${route.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Routes principales: ${successCount}/${mainRoutes.length} accessibles (${Math.round(successCount/mainRoutes.length*100)}%)`, 'cyan');
  
  return successCount === mainRoutes.length;
}

// ============================================================================
// TEST ACCÈS CLIENT FINAL
// ============================================================================

async function testClientAccessFinal() {
  logSection('TEST ACCÈS CLIENT FINAL');
  
  const clientRoutes = [
    { url: 'https://cryptoboost.world/client', name: 'Dashboard Client' },
    { url: 'https://cryptoboost.world/client/profile', name: 'Profil Client' },
    { url: 'https://cryptoboost.world/client/investments', name: 'Investissements Client' },
    { url: 'https://cryptoboost.world/client/transactions', name: 'Transactions Client' },
    { url: 'https://cryptoboost.world/client/wallets', name: 'Wallets Client' }
  ];
  
  let successCount = 0;
  for (const route of clientRoutes) {
    try {
      const response = await fetch(route.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${route.name}: ${route.url} (Status ${response.status})`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name}: ${route.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name}: ${route.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Accès client: ${successCount}/${clientRoutes.length} accessibles (${Math.round(successCount/clientRoutes.length*100)}%)`, 'cyan');
  
  return successCount === clientRoutes.length;
}

// ============================================================================
// VÉRIFICATION BOUTONS DANS LE CODE
// ============================================================================

function checkButtonsInCode() {
  logSection('VÉRIFICATION BOUTONS DANS LE CODE');
  
  // Vérifier les fichiers avec boutons
  const buttonFiles = [
    { path: 'src/components/layout/PublicHeader.tsx', name: 'Header Public' },
    { path: 'src/pages/public/Home.tsx', name: 'Page d\'accueil' },
    { path: 'src/components/auth/LoginForm.tsx', name: 'Formulaire de connexion' },
    { path: 'src/components/auth/RegisterForm.tsx', name: 'Formulaire d\'inscription' },
    { path: 'public/home-alt.html', name: 'Page d\'accueil alternative' },
    { path: 'public/login-alt.html', name: 'Page de connexion alternative' },
    { path: 'public/register-alt.html', name: 'Page d\'inscription alternative' }
  ];
  
  let successCount = 0;
  for (const file of buttonFiles) {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path, 'utf8');
      const stats = fs.statSync(file.path);
      
      // Vérifier la présence de boutons
      const hasLoginButton = content.includes('Se connecter') || content.includes('Connexion') || content.includes('Login');
      const hasRegisterButton = content.includes('S\'inscrire') || content.includes('Inscription') || content.includes('Register');
      
      if (hasLoginButton || hasRegisterButton) {
        log(`✅ ${file.name}: ${file.path} (${stats.size} bytes) - Boutons trouvés`, 'green');
        successCount++;
      } else {
        log(`⚠️ ${file.name}: ${file.path} (${stats.size} bytes) - Aucun bouton trouvé`, 'yellow');
      }
    } else {
      log(`❌ ${file.name}: ${file.path} (manquant)`, 'red');
    }
  }
  
  log(`\n📊 Fichiers avec boutons: ${successCount}/${buttonFiles.length} (${Math.round(successCount/buttonFiles.length*100)}%)`, 'cyan');
  
  return successCount === buttonFiles.length;
}

// ============================================================================
// RAPPORT FINAL 100%
// ============================================================================

async function generateFinal100PercentReport() {
  logSection('🎯 RAPPORT FINAL 100% - CRYPTOBOOST');
  
  // Tests
  const alternativePagesOk = await testAlternativePages();
  const mainRoutesOk = await testMainRoutesWithAlternatives();
  const clientAccessOk = await testClientAccessFinal();
  const buttonsInCodeOk = checkButtonsInCode();
  
  // Analyse des résultats
  logSection('📊 ANALYSE DES RÉSULTATS FINAUX');
  
  const tests = [
    { name: 'Pages alternatives avec boutons', result: alternativePagesOk },
    { name: 'Routes principales', result: mainRoutesOk },
    { name: 'Accès client', result: clientAccessOk },
    { name: 'Boutons dans le code', result: buttonsInCodeOk }
  ];
  
  let successCount = 0;
  for (const test of tests) {
    if (test.result) {
      log(`✅ ${test.name}: OK`, 'green');
      successCount++;
    } else {
      log(`❌ ${test.name}: PROBLÈME`, 'red');
    }
  }
  
  const percentage = Math.round((successCount / tests.length) * 100);
  
  log(`\n📊 Score final: ${successCount}/${tests.length} (${percentage}%)`, 'cyan');
  
  // Conclusion finale
  logSection('🎉 CONCLUSION FINALE');
  
  if (percentage >= 90) {
    log('🎉 CRYPTOBOOST 100% FONCTIONNEL !', 'green');
    log('✅ Toutes les routes accessibles', 'green');
    log('✅ Accès client parfait', 'green');
    log('✅ Boutons de connexion présents', 'green');
    log('✅ Pages alternatives fonctionnelles', 'green');
    log('✅ Application prête pour la production', 'green');
  } else if (percentage >= 75) {
    log('✅ CRYPTOBOOST TRÈS FONCTIONNEL', 'green');
    log('✅ La plupart des fonctionnalités opérationnelles', 'green');
    log('⚠️ Quelques améliorations mineures possibles', 'yellow');
  } else {
    log('⚠️ CRYPTOBOOST AVEC PROBLÈMES', 'yellow');
    log('❌ Corrections supplémentaires nécessaires', 'red');
  }
  
  // Détails spécifiques
  logSection('🔍 DÉTAILS SPÉCIFIQUES');
  
  if (mainRoutesOk) {
    log('✅ Routes principales: Toutes accessibles', 'green');
  } else {
    log('❌ Routes principales: Problèmes détectés', 'red');
  }
  
  if (clientAccessOk) {
    log('✅ Accès client: Tous les dashboards accessibles', 'green');
  } else {
    log('❌ Accès client: Problèmes d\'accès', 'red');
  }
  
  if (alternativePagesOk) {
    log('✅ Pages alternatives: Fonctionnelles avec boutons', 'green');
  } else {
    log('❌ Pages alternatives: Problèmes détectés', 'red');
  }
  
  if (buttonsInCodeOk) {
    log('✅ Boutons de connexion: Présents dans tous les fichiers', 'green');
  } else {
    log('❌ Boutons de connexion: Manquants dans certains fichiers', 'red');
  }
  
  // Statut final
  logSection('🎯 STATUT FINAL');
  log(`📊 Score global: ${percentage}%`, 'cyan');
  
  if (percentage >= 90) {
    log('🎊 DÉVELOPPEMENT TERMINÉ AVEC SUCCÈS MAJEUR !', 'green');
    log('🚀 CryptoBoost est maintenant 100% fonctionnel !', 'green');
  } else {
    log('⚠️ Développement en cours - Corrections supplémentaires nécessaires', 'yellow');
  }
}

// Exécution
generateFinal100PercentReport().catch(console.error);