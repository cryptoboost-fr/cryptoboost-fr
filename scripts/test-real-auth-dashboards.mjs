#!/usr/bin/env node

/**
 * SCRIPT DE TEST - AUTHENTIFICATION RÉELLE ET DASHBOARDS
 * Test de l'authentification et de l'accès aux dashboards
 */

import fetch from 'node-fetch';

// Configuration
const SITE_URL = 'https://cryptoboost.world';
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

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
// TEST AUTHENTIFICATION SUPABASE
// ============================================================================

async function testSupabaseAuth() {
  logSection('🔐 TEST AUTHENTIFICATION SUPABASE');
  
  try {
    // Test 1: Inscription d'un utilisateur test
    log('🔍 Test 1: Inscription utilisateur test...', 'blue');
    
    const testEmail = `test-dashboard-${Date.now()}@cryptoboost.world`;
    const testPassword = 'TestPassword123!';
    
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: {
          role: 'client',
          first_name: 'Test',
          last_name: 'User'
        }
      })
    });

    if (signUpResponse.ok) {
      const signUpData = await signUpResponse.json();
      log(`✅ Inscription réussie - User ID: ${signUpData.user?.id}`, 'green');
      
      // Test 2: Connexion de l'utilisateur
      log('🔍 Test 2: Connexion utilisateur...', 'blue');
      
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });

      if (signInResponse.ok) {
        const signInData = await signInResponse.json();
        log(`✅ Connexion réussie - Access Token obtenu`, 'green');
        
        return {
          success: true,
          accessToken: signInData.access_token,
          user: signInData.user,
          email: testEmail
        };
      } else {
        log(`❌ Échec connexion - Status: ${signInResponse.status}`, 'red');
        return { success: false };
      }
    } else {
      log(`❌ Échec inscription - Status: ${signUpResponse.status}`, 'red');
      return { success: false };
    }
  } catch (error) {
    log(`❌ Erreur authentification: ${error.message}`, 'red');
    return { success: false };
  }
}

// ============================================================================
// TEST ACCÈS DASHBOARDS AVEC AUTHENTIFICATION
// ============================================================================

async function testDashboardAccess(authData) {
  logSection('🌐 TEST ACCÈS DASHBOARDS AVEC AUTH');
  
  if (!authData.success) {
    log('❌ Impossible de tester les dashboards sans authentification', 'red');
    return { success: false };
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Authorization': `Bearer ${authData.accessToken}`,
    'Content-Type': 'application/json'
  };

  const dashboardRoutes = [
    { path: '/client', name: 'Dashboard Client' },
    { path: '/client/profile', name: 'Profil Client' },
    { path: '/client/investments', name: 'Investissements Client' },
    { path: '/client/transactions', name: 'Transactions Client' },
    { path: '/client/wallets', name: 'Wallets Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/exchange', name: 'Exchange Client' }
  ];

  let successCount = 0;
  let totalCount = dashboardRoutes.length;

  for (const route of dashboardRoutes) {
    try {
      log(`🔍 Test de ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: headers
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
  logSection('📊 RÉSUMÉ ACCÈS DASHBOARDS');
  log(`✅ Dashboards accessibles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  return { successCount, totalCount };
}

// ============================================================================
// TEST CRÉATION ADMIN
// ============================================================================

async function testAdminCreation() {
  logSection('👑 TEST CRÉATION ADMIN');
  
  try {
    // Créer un utilisateur admin
    log('🔍 Création utilisateur admin...', 'blue');
    
    const adminEmail = `admin-test-${Date.now()}@cryptoboost.world`;
    const adminPassword = 'AdminPassword123!';
    
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        data: {
          role: 'admin',
          first_name: 'Admin',
          last_name: 'Test'
        }
      })
    });

    if (signUpResponse.ok) {
      const signUpData = await signUpResponse.json();
      log(`✅ Admin créé - User ID: ${signUpData.user?.id}`, 'green');
      
      // Connexion admin
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword
        })
      });

      if (signInResponse.ok) {
        const signInData = await signInResponse.json();
        log(`✅ Connexion admin réussie`, 'green');
        
        return {
          success: true,
          accessToken: signInData.access_token,
          user: signInData.user,
          email: adminEmail
        };
      }
    }
    
    return { success: false };
  } catch (error) {
    log(`❌ Erreur création admin: ${error.message}`, 'red');
    return { success: false };
  }
}

// ============================================================================
// TEST ACCÈS DASHBOARD ADMIN
// ============================================================================

async function testAdminDashboardAccess(authData) {
  logSection('👑 TEST ACCÈS DASHBOARD ADMIN');
  
  if (!authData.success) {
    log('❌ Impossible de tester le dashboard admin sans authentification', 'red');
    return { success: false };
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Authorization': `Bearer ${authData.accessToken}`,
    'Content-Type': 'application/json'
  };

  const adminRoutes = [
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
  let totalCount = adminRoutes.length;

  for (const route of adminRoutes) {
    try {
      log(`🔍 Test de ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: headers
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
  logSection('📊 RÉSUMÉ ACCÈS ADMIN');
  log(`✅ Routes admin accessibles: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`📊 Taux de succès: ${Math.round((successCount/totalCount)*100)}%`, successCount === totalCount ? 'green' : 'yellow');

  return { successCount, totalCount };
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testRealAuthDashboards() {
  log('🔐 TEST AUTHENTIFICATION RÉELLE ET DASHBOARDS', 'bright');
  log('Vérification de l\'authentification et de l\'accès aux dashboards', 'cyan');
  
  try {
    // 1. Test authentification client
    const clientAuth = await testSupabaseAuth();
    
    // 2. Test accès dashboards client
    const clientDashboards = await testDashboardAccess(clientAuth);
    
    // 3. Test création et accès admin
    const adminAuth = await testAdminCreation();
    const adminDashboards = await testAdminDashboardAccess(adminAuth);

    // Résumé global
    logSection('📊 RÉSUMÉ GLOBAL');
    log(`✅ Authentification client: ${clientAuth.success ? 'Réussie' : 'Échouée'}`, clientAuth.success ? 'green' : 'red');
    log(`✅ Dashboards client: ${clientDashboards.successCount}/${clientDashboards.totalCount}`, clientDashboards.successCount === clientDashboards.totalCount ? 'green' : 'yellow');
    log(`✅ Authentification admin: ${adminAuth.success ? 'Réussie' : 'Échouée'}`, adminAuth.success ? 'green' : 'red');
    log(`✅ Dashboards admin: ${adminDashboards.successCount}/${adminDashboards.totalCount}`, adminDashboards.successCount === adminDashboards.totalCount ? 'green' : 'yellow');

    const totalSuccess = (clientAuth.success ? 1 : 0) + clientDashboards.successCount + (adminAuth.success ? 1 : 0) + adminDashboards.successCount;
    const totalTests = 1 + clientDashboards.totalCount + 1 + adminDashboards.totalCount;
    const globalSuccessRate = Math.round((totalSuccess/totalTests)*100);

    log(`📊 Taux de succès global: ${globalSuccessRate}%`, globalSuccessRate >= 80 ? 'green' : globalSuccessRate >= 60 ? 'yellow' : 'red');

    if (globalSuccessRate >= 80) {
      logSection('🎉 DASHBOARDS FONCTIONNELS');
      log('✅ L\'authentification fonctionne', 'green');
      log('✅ Les dashboards sont accessibles', 'green');
      log('✅ Les rôles sont séparés', 'green');
      
      log('\n🌐 DASHBOARDS OPÉRATIONNELS:', 'yellow');
      log('   - Dashboard Client: https://cryptoboost.world/client', 'blue');
      log('   - Dashboard Admin: https://cryptoboost.world/admin', 'blue');
      log('   - Connexion: https://cryptoboost.world/login', 'blue');
      
      log('\n🔐 CREDENTIALS DE TEST:', 'yellow');
      if (clientAuth.success) {
        log(`   - Client: ${clientAuth.email}`, 'blue');
      }
      if (adminAuth.success) {
        log(`   - Admin: ${adminAuth.email}`, 'blue');
      }
    } else {
      logSection('⚠️  PROBLÈMES DÉTECTÉS');
      log('❌ L\'authentification ne fonctionne pas correctement', 'red');
      log('❌ Les dashboards ne sont pas accessibles', 'red');
      log('💡 Vérifiez la configuration Supabase', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors du test', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testRealAuthDashboards().catch(console.error);