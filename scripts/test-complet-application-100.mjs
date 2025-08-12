#!/usr/bin/env node

/**
 * SCRIPT DE TEST COMPLET 100% DE L'APPLICATION CRYPTOBOOST
 * Teste toutes les fonctionnalités : inscription, connexion, métier, admin, dashboard
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';
const APP_URL = 'https://cryptoboost.world';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Statistiques globales
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  startTime: Date.now()
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  stats.total++;
  if (success) {
    stats.passed++;
    log(`✅ ${testName}`, 'green');
  } else {
    stats.failed++;
    log(`❌ ${testName}`, 'red');
  }
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

function logProgress() {
  const progress = ((stats.passed + stats.failed) / stats.total * 100).toFixed(1);
  log(`📊 Progression: ${stats.passed + stats.failed}/${stats.total} (${progress}%)`, 'blue');
}

// ============================================================================
// 1. TESTS D'AUTHENTIFICATION ET UTILISATEURS
// ============================================================================

async function testSupabaseConnection() {
  logSection('🔗 TEST DE CONNEXION SUPABASE');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    logTest('Connexion API Supabase', response.ok, `Status: ${response.status}`);
    return response.ok;
  } catch (error) {
    logTest('Connexion API Supabase', false, error.message);
    return false;
  }
}

async function createTestUsers() {
  logSection('👥 CRÉATION D\'UTILISATEURS DE TEST');
  
  const users = [];
  
  // Créer un utilisateur admin
  const adminEmail = `admin-test-${Date.now()}@cryptoboost.world`;
  const adminPassword = 'AdminPassword123!';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        data: {
          full_name: 'Admin Test',
          role: 'admin',
          phone: '+33123456789'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      users.push({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        user: data.user
      });
      logTest('Création utilisateur admin', true, `Email: ${adminEmail}`);
    } else {
      const errorData = await response.json();
      logTest('Création utilisateur admin', false, `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Création utilisateur admin', false, error.message);
  }

  // Créer un utilisateur client
  const clientEmail = `client-test-${Date.now()}@cryptoboost.world`;
  const clientPassword = 'ClientPassword123!';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: clientEmail,
        password: clientPassword,
        data: {
          full_name: 'Client Test',
          role: 'client',
          phone: '+33987654321'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      users.push({
        email: clientEmail,
        password: clientPassword,
        role: 'client',
        user: data.user
      });
      logTest('Création utilisateur client', true, `Email: ${clientEmail}`);
    } else {
      const errorData = await response.json();
      logTest('Création utilisateur client', false, `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Création utilisateur client', false, error.message);
  }

  return users;
}

async function testUserAuthentication(users) {
  logSection('🔐 TEST D\'AUTHENTIFICATION UTILISATEURS');
  
  const authenticatedUsers = [];
  
  for (const user of users) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        user.accessToken = data.access_token;
        user.refreshToken = data.refresh_token;
        authenticatedUsers.push(user);
        logTest(`Connexion ${user.role}`, true, `Token reçu: ${data.access_token ? 'Oui' : 'Non'}`);
      } else {
        const errorData = await response.json();
        logTest(`Connexion ${user.role}`, false, `Status: ${response.status}`);
      }
    } catch (error) {
      logTest(`Connexion ${user.role}`, false, error.message);
    }
  }

  return authenticatedUsers;
}

// ============================================================================
// 2. TESTS DES PAGES ET ROUTES
// ============================================================================

async function testAllRoutes() {
  logSection('🌐 TEST DE TOUTES LES ROUTES DE L\'APPLICATION');
  
  const routes = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login', name: 'Page de connexion' },
    { path: '/register', name: 'Page d\'inscription' },
    { path: '/admin', name: 'Dashboard Admin' },
    { path: '/admin/users', name: 'Gestion Utilisateurs' },
    { path: '/admin/transactions', name: 'Gestion Transactions' },
    { path: '/admin/plans', name: 'Gestion Plans' },
    { path: '/admin/logs', name: 'Logs Système' },
    { path: '/client', name: 'Dashboard Client' },
    { path: '/client/wallet', name: 'Wallet Client' },
    { path: '/client/plans', name: 'Plans Client' },
    { path: '/client/exchange', name: 'Exchange Client' },
    { path: '/client/history', name: 'Historique Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/profile', name: 'Profil Client' }
  ];

  for (const route of routes) {
    try {
      const response = await fetch(`${APP_URL}${route.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'CryptoBoost-Test-Suite/1.0'
        }
      });

      const success = response.status === 200 || response.status === 302;
      logTest(route.name, success, `Status: ${response.status} - ${response.statusText}`);
    } catch (error) {
      logTest(route.name, false, error.message);
    }
  }
}

// ============================================================================
// 3. TESTS DES FONCTIONNALITÉS MÉTIER
// ============================================================================

async function testBusinessFeatures(authenticatedUsers) {
  logSection('💼 TEST DES FONCTIONNALITÉS MÉTIER');
  
  const adminUser = authenticatedUsers.find(u => u.role === 'admin');
  const clientUser = authenticatedUsers.find(u => u.role === 'client');

  if (adminUser) {
    await testAdminFeatures(adminUser);
  }

  if (clientUser) {
    await testClientFeatures(clientUser);
  }
}

async function testAdminFeatures(adminUser) {
  logSection('👨‍💼 TESTS ADMINISTRATEUR');
  
  // Test de récupération des utilisateurs
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${adminUser.accessToken}`
      }
    });
    
    logTest('Récupération liste utilisateurs', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération liste utilisateurs', false, error.message);
  }

  // Test de récupération des transactions
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${adminUser.accessToken}`
      }
    });
    
    logTest('Récupération transactions', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération transactions', false, error.message);
  }

  // Test de récupération des plans d'investissement
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${adminUser.accessToken}`
      }
    });
    
    logTest('Récupération plans d\'investissement', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération plans d\'investissement', false, error.message);
  }

  // Test de récupération des logs système
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/system_logs?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${adminUser.accessToken}`
      }
    });
    
    logTest('Récupération logs système', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération logs système', false, error.message);
  }
}

async function testClientFeatures(clientUser) {
  logSection('👤 TESTS CLIENT');
  
  // Test de récupération du profil client
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&id=eq.${clientUser.user.id}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${clientUser.accessToken}`
      }
    });
    
    logTest('Récupération profil client', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération profil client', false, error.message);
  }

  // Test de récupération du wallet
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/crypto_wallets?select=*&user_id=eq.${clientUser.user.id}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${clientUser.accessToken}`
      }
    });
    
    logTest('Récupération wallet crypto', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération wallet crypto', false, error.message);
  }

  // Test de récupération des investissements
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investments?select=*&user_id=eq.${clientUser.user.id}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${clientUser.accessToken}`
      }
    });
    
    logTest('Récupération investissements', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération investissements', false, error.message);
  }

  // Test de récupération des notifications
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/notifications?select=*&user_id=eq.${clientUser.user.id}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${clientUser.accessToken}`
      }
    });
    
    logTest('Récupération notifications', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Récupération notifications', false, error.message);
  }
}

// ============================================================================
// 4. TESTS DES COMPOSANTS UI
// ============================================================================

async function testUIComponents() {
  logSection('🎨 TEST DES COMPOSANTS UI');
  
  const components = [
    'src/components/ui/Button.tsx',
    'src/components/ui/Card.tsx',
    'src/components/ui/Input.tsx',
    'src/components/ui/toaster.tsx'
  ];

  for (const component of components) {
    try {
      const exists = fs.existsSync(component);
      logTest(`Composant ${path.basename(component)}`, exists, exists ? 'Fichier présent' : 'Fichier manquant');
    } catch (error) {
      logTest(`Composant ${path.basename(component)}`, false, error.message);
    }
  }
}

// ============================================================================
// 5. TESTS DES PAGES
// ============================================================================

async function testAllPages() {
  logSection('📄 TEST DE TOUTES LES PAGES');
  
  const pages = [
    'src/pages/auth/Login.tsx',
    'src/pages/auth/Register.tsx',
    'src/pages/admin/Dashboard.tsx',
    'src/pages/admin/Users.tsx',
    'src/pages/admin/Transactions.tsx',
    'src/pages/admin/InvestmentPlans.tsx',
    'src/pages/admin/SystemLogs.tsx',
    'src/pages/client/Dashboard.tsx',
    'src/pages/client/Wallet.tsx',
    'src/pages/client/Plans.tsx',
    'src/pages/client/Exchange.tsx',
    'src/pages/client/History.tsx',
    'src/pages/client/Notifications.tsx',
    'src/pages/client/Profile.tsx'
  ];

  for (const page of pages) {
    try {
      const exists = fs.existsSync(page);
      logTest(`Page ${path.basename(page, '.tsx')}`, exists, exists ? 'Fichier présent' : 'Fichier manquant');
    } catch (error) {
      logTest(`Page ${path.basename(page, '.tsx')}`, false, error.message);
    }
  }
}

// ============================================================================
// 6. TESTS DE SÉCURITÉ
// ============================================================================

async function testSecurityHeaders() {
  logSection('🔒 TEST DES EN-TÊTES DE SÉCURITÉ');
  
  try {
    const response = await fetch(APP_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'CryptoBoost-Security-Test/1.0'
      }
    });

    const headers = response.headers;
    
    const securityHeaders = [
      { name: 'x-frame-options', description: 'Protection clickjacking' },
      { name: 'x-content-type-options', description: 'Protection MIME sniffing' },
      { name: 'x-xss-protection', description: 'Protection XSS' },
      { name: 'strict-transport-security', description: 'Force HTTPS' },
      { name: 'content-security-policy', description: 'CSP' }
    ];

    for (const header of securityHeaders) {
      const value = headers.get(header.name);
      const present = value !== null;
      logTest(header.description, present, present ? `Valeur: ${value}` : 'En-tête manquant');
    }
  } catch (error) {
    logTest('Vérification en-têtes de sécurité', false, error.message);
  }
}

// ============================================================================
// 7. TESTS DE PERFORMANCE
// ============================================================================

async function testPerformance() {
  logSection('⚡ TEST DE PERFORMANCE');
  
  const urls = [
    `${APP_URL}/`,
    `${APP_URL}/login`,
    `${APP_URL}/admin`,
    `${APP_URL}/client`
  ];

  for (const url of urls) {
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'CryptoBoost-Performance-Test/1.0'
        }
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const success = response.status === 200 || response.status === 302;
      const performance = responseTime < 2000 ? 'Excellent' : responseTime < 5000 ? 'Bon' : 'Lent';
      
      logTest(`Performance ${new URL(url).pathname}`, success, `${responseTime}ms - ${performance}`);
    } catch (error) {
      logTest(`Performance ${new URL(url).pathname}`, false, error.message);
    }
  }
}

// ============================================================================
// 8. TESTS DE CONFIGURATION
// ============================================================================

async function testConfiguration() {
  logSection('⚙️ TEST DE CONFIGURATION');
  
  const configFiles = [
    '.env',
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json',
    '_headers',
    '_redirects'
  ];

  for (const file of configFiles) {
    try {
      const exists = fs.existsSync(file);
      logTest(`Fichier ${file}`, exists, exists ? 'Présent' : 'Manquant');
    } catch (error) {
      logTest(`Fichier ${file}`, false, error.message);
    }
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function runCompleteTest() {
  log('🚀 DÉBUT DU TEST COMPLET 100% DE L\'APPLICATION CRYPTOBOOST', 'bright');
  log('Test de toutes les fonctionnalités : inscription, connexion, métier, admin, dashboard', 'cyan');
  
  try {
    // 1. Test de connexion Supabase
    const supabaseOk = await testSupabaseConnection();
    if (!supabaseOk) {
      log('\n❌ La connexion Supabase a échoué. Arrêt des tests.', 'red');
      return;
    }

    // 2. Création d'utilisateurs de test
    const users = await createTestUsers();
    
    // 3. Authentification des utilisateurs
    const authenticatedUsers = await testUserAuthentication(users);
    
    // 4. Test de toutes les routes
    await testAllRoutes();
    
    // 5. Test des fonctionnalités métier
    await testBusinessFeatures(authenticatedUsers);
    
    // 6. Test des composants UI
    await testUIComponents();
    
    // 7. Test de toutes les pages
    await testAllPages();
    
    // 8. Test de sécurité
    await testSecurityHeaders();
    
    // 9. Test de performance
    await testPerformance();
    
    // 10. Test de configuration
    await testConfiguration();

    // Résumé final
    const endTime = Date.now();
    const duration = ((endTime - stats.startTime) / 1000).toFixed(2);
    
    logSection('📊 RÉSUMÉ FINAL DES TESTS');
    log(`⏱️  Durée totale : ${duration} secondes`, 'blue');
    log(`📈 Tests réussis : ${stats.passed}/${stats.total}`, 'green');
    log(`❌ Tests échoués : ${stats.failed}/${stats.total}`, 'red');
    log(`📊 Taux de réussite : ${((stats.passed / stats.total) * 100).toFixed(1)}%`, 'cyan');
    
    if (stats.failed === 0) {
      log('\n🎉 FÉLICITATIONS ! TOUS LES TESTS SONT RÉUSSIS !', 'bright');
      log('✅ L\'application CryptoBoost est 100% fonctionnelle', 'green');
      log('🚀 Prête pour la production', 'green');
    } else {
      log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
      log(`❌ ${stats.failed} problème(s) à résoudre`, 'red');
    }

  } catch (error) {
    log('\n❌ Erreur lors des tests complets', 'red');
    log(error.message, 'red');
  }
}

// Exécution des tests
runCompleteTest().catch(console.error);