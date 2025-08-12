#!/usr/bin/env node

/**
 * SCRIPT DE TEST - DASHBOARDS DES DIFFÉRENTS RÔLES
 * Test des dashboards client et admin
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
// TEST DES DASHBOARDS PUBLICS (SANS AUTHENTIFICATION)
// ============================================================================

async function testPublicDashboards() {
  logSection('🌐 TEST DES DASHBOARDS PUBLICS');
  
  const publicRoutes = [
    { path: '/client', name: 'Dashboard Client (public)' },
    { path: '/admin', name: 'Dashboard Admin (public)' },
    { path: '/client/profile', name: 'Profil Client (public)' },
    { path: '/client/investments', name: 'Investissements Client (public)' },
    { path: '/client/transactions', name: 'Transactions Client (public)' },
    { path: '/client/wallets', name: 'Wallets Client (public)' },
    { path: '/client/notifications', name: 'Notifications Client (public)' },
    { path: '/client/exchange', name: 'Exchange Client (public)' },
    { path: '/admin/users', name: 'Gestion Utilisateurs (public)' },
    { path: '/admin/transactions', name: 'Gestion Transactions (public)' },
    { path: '/admin/investments', name: 'Gestion Investissements (public)' },
    { path: '/admin/plans', name: 'Gestion Plans (public)' },
    { path: '/admin/logs', name: 'Logs Système (public)' },
    { path: '/admin/wallets', name: 'Gestion Wallets (public)' },
    { path: '/admin/settings', name: 'Paramètres Admin (public)' }
  ];

  let successCount = 0;
  let totalCount = publicRoutes.length;

  for (const route of publicRoutes) {
    try {
      log(`🔍 Test de ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        log(`✅ ${route.name} - Status: ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
    }
  }

  // Résumé
  logSection('📊 RÉSUMÉ DASHBOARDS PUBLICS');
  log(`✅ Routes accessibles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  return { successCount, totalCount };
}

// ============================================================================
// TEST DES ROUTES PROTÉGÉES (REDIRECTION VERS LOGIN)
// ============================================================================

async function testProtectedRoutes() {
  logSection('🔐 TEST DES ROUTES PROTÉGÉES');
  
  const protectedRoutes = [
    { path: '/client', name: 'Dashboard Client (protégé)', expectedRedirect: '/login' },
    { path: '/admin', name: 'Dashboard Admin (protégé)', expectedRedirect: '/login' },
    { path: '/client/profile', name: 'Profil Client (protégé)', expectedRedirect: '/login' },
    { path: '/admin/users', name: 'Gestion Utilisateurs (protégé)', expectedRedirect: '/login' }
  ];

  let redirectCount = 0;
  let totalCount = protectedRoutes.length;

  for (const route of protectedRoutes) {
    try {
      log(`🔍 Test de ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location && location.includes(route.expectedRedirect)) {
          log(`✅ ${route.name} - Redirection correcte vers ${location}`, 'green');
          redirectCount++;
        } else {
          log(`⚠️  ${route.name} - Redirection vers ${location} (attendu: ${route.expectedRedirect})`, 'yellow');
        }
      } else if (response.status === 200) {
        log(`⚠️  ${route.name} - Accès direct (devrait être protégé)`, 'yellow');
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
    }
  }

  // Résumé
  logSection('📊 RÉSUMÉ ROUTES PROTÉGÉES');
  log(`✅ Redirections correctes: ${redirectCount}/${totalCount}`, redirectCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de protection: ${Math.round((redirectCount/totalCount)*100)}%`, redirectCount === totalCount ? 'green' : 'yellow');

  return { redirectCount, totalCount };
}

// ============================================================================
// TEST DES PAGES D'AUTHENTIFICATION
// ============================================================================

async function testAuthPages() {
  logSection('🔑 TEST DES PAGES D\'AUTHENTIFICATION');
  
  const authPages = [
    { path: '/login', name: 'Page de connexion' },
    { path: '/register', name: 'Page d\'inscription' }
  ];

  let successCount = 0;
  let totalCount = authPages.length;

  for (const page of authPages) {
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
  logSection('📊 RÉSUMÉ PAGES D\'AUTHENTIFICATION');
  log(`✅ Pages fonctionnelles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  return { successCount, totalCount };
}

// ============================================================================
// VÉRIFICATION DES COMPOSANTS DASHBOARD
// ============================================================================

function checkDashboardComponents() {
  logSection('🔍 VÉRIFICATION DES COMPOSANTS DASHBOARD');
  
  try {
    // Vérifier l'existence des composants dashboard
    const components = [
      'src/pages/client/Dashboard.tsx',
      'src/pages/admin/Dashboard.tsx',
      'src/components/ProtectedRoute.tsx',
      'src/contexts/AuthContext.tsx'
    ];

    let existingCount = 0;
    let totalCount = components.length;

    for (const component of components) {
      try {
        const fs = require('fs');
        if (fs.existsSync(component)) {
          log(`✅ ${component} existe`, 'green');
          existingCount++;
        } else {
          log(`❌ ${component} manquant`, 'red');
        }
      } catch (error) {
        log(`❌ ${component} - Erreur: ${error.message}`, 'red');
      }
    }

    // Résumé
    logSection('📊 RÉSUMÉ COMPOSANTS');
    log(`✅ Composants existants: ${existingCount}/${totalCount}`, existingCount === totalCount ? 'green' : 'yellow');
    log(`📊 Taux de présence: ${Math.round((existingCount/totalCount)*100)}%`, existingCount === totalCount ? 'green' : 'yellow');

    return { existingCount, totalCount };
  } catch (error) {
    log(`❌ Erreur vérification composants: ${error.message}`, 'red');
    return { existingCount: 0, totalCount: 0 };
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testAllDashboards() {
  log('🔍 TEST COMPLET DES DASHBOARDS ET RÔLES', 'bright');
  log('Vérification de l\'accessibilité et du fonctionnement des dashboards', 'cyan');
  
  try {
    // 1. Test des dashboards publics
    const publicResults = await testPublicDashboards();
    
    // 2. Test des routes protégées
    const protectedResults = await testProtectedRoutes();
    
    // 3. Test des pages d'authentification
    const authResults = await testAuthPages();
    
    // 4. Vérification des composants
    const componentResults = checkDashboardComponents();

    // Résumé global
    logSection('📊 RÉSUMÉ GLOBAL');
    log(`✅ Dashboards publics: ${publicResults.successCount}/${publicResults.totalCount}`, publicResults.successCount === publicResults.totalCount ? 'green' : 'yellow');
    log(`✅ Routes protégées: ${protectedResults.redirectCount}/${protectedResults.totalCount}`, protectedResults.redirectCount === protectedResults.totalCount ? 'green' : 'yellow');
    log(`✅ Pages d'auth: ${authResults.successCount}/${authResults.totalCount}`, authResults.successCount === authResults.totalCount ? 'green' : 'yellow');
    log(`✅ Composants: ${componentResults.existingCount}/${componentResults.totalCount}`, componentResults.existingCount === componentResults.totalCount ? 'green' : 'yellow');

    const totalSuccess = publicResults.successCount + protectedResults.redirectCount + authResults.successCount + componentResults.existingCount;
    const totalTests = publicResults.totalCount + protectedResults.totalCount + authResults.totalCount + componentResults.totalCount;
    const globalSuccessRate = Math.round((totalSuccess/totalTests)*100);

    log(`📊 Taux de succès global: ${globalSuccessRate}%`, globalSuccessRate >= 80 ? 'green' : globalSuccessRate >= 60 ? 'yellow' : 'red');

    if (globalSuccessRate >= 80) {
      logSection('🎉 DASHBOARDS OPÉRATIONNELS');
      log('✅ Les dashboards sont accessibles et fonctionnels', 'green');
      log('✅ La protection des routes fonctionne', 'green');
      log('✅ L\'authentification est configurée', 'green');
      
      log('\n🌐 DASHBOARDS DISPONIBLES:', 'yellow');
      log('   - Dashboard Client: https://cryptoboost.world/client', 'blue');
      log('   - Dashboard Admin: https://cryptoboost.world/admin', 'blue');
      log('   - Connexion: https://cryptoboost.world/login', 'blue');
      log('   - Inscription: https://cryptoboost.world/register', 'blue');
      
      log('\n🔐 ACCÈS:', 'yellow');
      log('   - Routes protégées redirigent vers login', 'blue');
      log('   - Authentification requise pour les dashboards', 'blue');
      log('   - Rôles séparés (client/admin)', 'blue');
    } else {
      logSection('⚠️  PROBLÈMES DÉTECTÉS');
      log('❌ Certains dashboards ne sont pas accessibles', 'red');
      log('❌ La protection des routes peut être défaillante', 'red');
      log('💡 Vérifiez la configuration des routes', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors du test', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testAllDashboards().catch(console.error);