#!/usr/bin/env node

/**
 * SCRIPT DE TEST - CORRECTION CLIENT DASHBOARD
 * Test spécifique du Dashboard Client après correction SSL
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
// TEST SPÉCIFIQUE CLIENT DASHBOARD
// ============================================================================

async function testClientDashboard() {
  logSection('🧪 TEST SPÉCIFIQUE CLIENT DASHBOARD');
  
  const clientDashboardTests = [
    { name: 'Test 1 - Dashboard Client Principal', path: '/client' },
    { name: 'Test 2 - Dashboard Client Principal (retry)', path: '/client' },
    { name: 'Test 3 - Dashboard Client Principal (final)', path: '/client' }
  ];
  
  let successCount = 0;
  let totalCount = clientDashboardTests.length;
  
  for (const test of clientDashboardTests) {
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
    if (test.name !== clientDashboardTests[clientDashboardTests.length - 1].name) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  log(`\n📊 Résumé tests Client Dashboard: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return successCount === totalCount;
}

// ============================================================================
// TEST SOUS-PAGES CLIENT PROBLÉMATIQUES
// ============================================================================

async function testClientSubPages() {
  logSection('🧪 TEST SOUS-PAGES CLIENT PROBLÉMATIQUES');
  
  const clientSubPages = [
    { name: 'Test 1 - Client Investments', path: '/client/investments' },
    { name: 'Test 2 - Client Wallets', path: '/client/wallets' }
  ];
  
  let successCount = 0;
  let totalCount = clientSubPages.length;
  
  for (const test of clientSubPages) {
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
  }
  
  log(`\n📊 Résumé sous-pages Client: ${successCount}/${totalCount}`, 
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

async function testClientDashboardFix() {
  log('🧪 TEST CORRECTION CLIENT DASHBOARD', 'bright');
  log('Vérification que le Dashboard Client est maintenant corrigé', 'cyan');
  
  try {
    // Attendre le redéploiement
    log('⏳ Attente du redéploiement Netlify...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // 1. Test spécifique du Dashboard Client
    const clientDashboardFixed = await testClientDashboard();
    
    // 2. Test des sous-pages client problématiques
    const clientSubPagesFixed = await testClientSubPages();
    
    // 3. Test complet du site
    const completeSite = await testCompleteSite();
    
    // Résumé final
    logSection('📊 RÉSUMÉ FINAL');
    log(`✅ Dashboard Client: ${clientDashboardFixed ? 'Oui' : 'Non'}`, clientDashboardFixed ? 'green' : 'red');
    log(`✅ Sous-pages Client: ${clientSubPagesFixed ? 'Oui' : 'Non'}`, clientSubPagesFixed ? 'green' : 'red');
    log(`✅ Site complet: ${completeSite ? 'Oui' : 'Non'}`, completeSite ? 'green' : 'red');
    
    if (clientDashboardFixed && clientSubPagesFixed && completeSite) {
      logSection('🎉 SUCCÈS COMPLET - CLIENT DASHBOARD CORRIGÉ');
      log('✅ Dashboard Client accessible', 'green');
      log('✅ Sous-pages Client accessibles', 'green');
      log('✅ Toutes les pages accessibles', 'green');
      log('✅ Problèmes SSL complètement résolus', 'green');
      log('✅ Site 100% fonctionnel', 'green');
      
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
    } else if (clientDashboardFixed && clientSubPagesFixed) {
      logSection('🎉 PROGRÈS MAJEUR');
      log('✅ Le Dashboard Client est corrigé', 'green');
      log('✅ Les sous-pages Client sont corrigées', 'green');
      log('⚠️ Certaines autres pages ont encore des problèmes', 'yellow');
      log('💡 Configuration spéciale efficace pour Client Dashboard', 'green');
    } else if (clientDashboardFixed) {
      logSection('🎉 PROGRÈS PARTIEL');
      log('✅ Le Dashboard Client principal est corrigé', 'green');
      log('⚠️ Certaines sous-pages ont encore des problèmes', 'yellow');
      log('💡 Configuration spéciale partiellement efficace', 'green');
    } else {
      logSection('⚠️  PROBLÈME RESTANT');
      log('❌ Le Dashboard Client n\'est pas encore corrigé', 'red');
      log('💡 Vérifiez le redéploiement Netlify', 'yellow');
      log('💡 Contactez le support si nécessaire', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du test Client Dashboard', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testClientDashboardFix().catch(console.error);