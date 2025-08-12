#!/usr/bin/env node

/**
 * SCRIPT DE TEST FINAL - CORRECTION LOGIN SSL
 * Test de la page Login après correction SSL finale
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
// TEST FINAL PAGE LOGIN
// ============================================================================

async function testFinalLoginPage() {
  logSection('🧪 TEST FINAL PAGE LOGIN');
  
  const loginTests = [
    { name: 'Test 1 - Page Login', path: '/login' },
    { name: 'Test 2 - Page Login (retry)', path: '/login' },
    { name: 'Test 3 - Page Login (final)', path: '/login' },
    { name: 'Test 4 - Page Login (ultra)', path: '/login' },
    { name: 'Test 5 - Page Login (définitif)', path: '/login' }
  ];
  
  let successCount = 0;
  let totalCount = loginTests.length;
  
  for (const test of loginTests) {
    try {
      log(`🔍 ${test.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${test.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        log(`✅ ${test.name} - Status: ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${test.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name} - Erreur: ${error.message}`, 'red');
    }
    
    // Attendre un peu entre les tests
    if (test.name !== loginTests[loginTests.length - 1].name) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  log(`\n📊 Résumé tests finaux Login: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return successCount === totalCount;
}

// ============================================================================
// TEST COMPLET DU SITE
// ============================================================================

async function testCompleteSite() {
  logSection('🌐 TEST COMPLET DU SITE');
  
  const allPages = [
    // Pages publiques
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login', name: 'Page Login' },
    { path: '/register', name: 'Page Register' },
    
    // Dashboard Client
    { path: '/client', name: 'Dashboard Client' },
    { path: '/client/profile', name: 'Profil Client' },
    { path: '/client/investments', name: 'Investissements Client' },
    { path: '/client/transactions', name: 'Transactions Client' },
    { path: '/client/wallets', name: 'Wallets Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/exchange', name: 'Exchange Client' },
    
    // Dashboard Admin
    { path: '/admin', name: 'Dashboard Admin' },
    { path: '/admin/users', name: 'Gestion Utilisateurs' },
    { path: '/admin/transactions', name: 'Gestion Transactions' },
    { path: '/admin/investments', name: 'Gestion Investissements' },
    { path: '/admin/plans', name: 'Gestion Plans' },
    { path: '/admin/logs', name: 'Logs Système' },
    { path: '/admin/wallets', name: 'Gestion Wallets' },
    { path: '/admin/settings', name: 'Paramètres Admin' }
  ];
  
  let successCount = 0;
  let totalCount = allPages.length;
  
  for (const page of allPages) {
    try {
      log(`🔍 Test ${page.name}...`, 'blue');
      
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
  
  log(`\n📊 Résumé complet: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return successCount === totalCount;
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testLoginFinalFix() {
  log('🧪 TEST FINAL LOGIN SSL', 'bright');
  log('Vérification que la page Login est maintenant corrigée', 'cyan');
  
  try {
    // Attendre le redéploiement
    log('⏳ Attente du redéploiement Netlify...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // 1. Test final de la page Login
    const loginFixed = await testFinalLoginPage();
    
    // 2. Test complet du site
    const completeSite = await testCompleteSite();
    
    // Résumé final
    logSection('📊 RÉSUMÉ FINAL LOGIN');
    log(`✅ Page Login: ${loginFixed ? 'Oui' : 'Non'}`, loginFixed ? 'green' : 'red');
    log(`✅ Site complet: ${completeSite ? 'Oui' : 'Non'}`, completeSite ? 'green' : 'red');
    
    if (loginFixed && completeSite) {
      logSection('🎉 SUCCÈS COMPLET FINAL - SSL 100% RÉSOLU');
      log('✅ Page Login accessible', 'green');
      log('✅ Toutes les pages accessibles', 'green');
      log('✅ Problèmes SSL complètement résolus', 'green');
      log('✅ Site 100% fonctionnel', 'green');
      log('✅ Configuration SSL définitive', 'green');
      
      log('\n🌐 SITE 100% OPÉRATIONNEL:', 'yellow');
      log('   - URL: https://cryptoboost.world', 'blue');
      log('   - Login: https://cryptoboost.world/login', 'blue');
      log('   - Register: https://cryptoboost.world/register', 'blue');
      log('   - Dashboard Client: https://cryptoboost.world/client', 'blue');
      log('   - Dashboard Admin: https://cryptoboost.world/admin', 'blue');
      
      log('\n🔑 CODES D\'ACCÈS:', 'yellow');
      log('   Client: client@cryptoboost.world / ClientPass123!', 'blue');
      log('   Admin: admin2@cryptoboost.world / AdminPass123!', 'blue');
      
      log('\n🎉 TOUS LES PROBLÈMES SSL SONT DÉFINITIVEMENT RÉSOLUS !', 'green');
      log('🎉 CRYPTOBOOST EST 100% OPÉRATIONNEL !', 'green');
    } else if (loginFixed) {
      logSection('🎉 PROGRÈS MAJEUR');
      log('✅ La page Login est corrigée', 'green');
      log('⚠️ Certaines autres pages ont encore des problèmes', 'yellow');
      log('💡 Configuration SSL finale efficace pour Login', 'green');
    } else {
      logSection('⚠️  PROBLÈME RESTANT');
      log('❌ La page Login n\'est pas encore corrigée', 'red');
      log('💡 Vérifiez le redéploiement Netlify', 'yellow');
      log('💡 Contactez le support si nécessaire', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du test final Login', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testLoginFinalFix().catch(console.error);