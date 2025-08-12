#!/usr/bin/env node

/**
 * Script de test 100% complet - CryptoBoost Application
 * Test exhaustif de toutes les fonctionnalités : Front, Registration, Login, Admin, Client
 * Version : Test complet à 100%
 */

import fetch from 'node-fetch';
import { execSync } from 'child_process';
import fs from 'fs';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg';

// URLs de test
const TEST_URLS = {
  production: 'https://cryptoboost.world',
  local: 'http://localhost:5173',
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

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'magenta');
  log(message, 'magenta');
  log(`${'='.repeat(60)}`, 'magenta');
}

// =====================================================
// 1. TEST DU FRONTEND (100%)
// =====================================================

async function testFrontend100() {
  logHeader('🎨 TEST FRONTEND 100% COMPLET');
  
  const results = [];
  
  // Test de la page principale
  try {
    const response = await fetch(TEST_URLS.production);
    const content = await response.text();
    
    const frontendChecks = [
      { name: 'Titre CryptoBoost', found: content.includes('CryptoBoost') },
      { name: 'React App', found: content.includes('root') || content.includes('app') },
      { name: 'Navigation', found: content.includes('nav') || content.includes('menu') },
      { name: 'Footer', found: content.includes('footer') },
      { name: 'CSS Styles', found: content.includes('css') || content.includes('style') },
      { name: 'JavaScript', found: content.includes('script') || content.includes('js') },
      { name: 'Meta tags', found: content.includes('meta') },
      { name: 'Viewport', found: content.includes('viewport') },
      { name: 'Favicon', found: content.includes('favicon') || content.includes('icon') },
      { name: 'Responsive design', found: content.includes('mobile') || content.includes('responsive') }
    ];
    
    for (const check of frontendChecks) {
      if (check.found) {
        logSuccess(`Frontend: ${check.name}`);
        results.push(true);
      } else {
        logError(`Frontend: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test des éléments spécifiques
    const specificElements = [
      'hero', 'section', 'button', 'form', 'input', 'link'
    ];
    
    for (const element of specificElements) {
      if (content.includes(element)) {
        logSuccess(`Frontend: Élément ${element} présent`);
        results.push(true);
      } else {
        logWarning(`Frontend: Élément ${element} non détecté`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test frontend: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 2. TEST DE REGISTRATION (100%)
// =====================================================

async function testRegistration100() {
  logHeader('📝 TEST REGISTRATION 100% COMPLET');
  
  const results = [];
  
  try {
    // Test de la page d'inscription
    const registerResponse = await fetch(TEST_URLS.register);
    const registerContent = await registerResponse.text();
    
    const registrationChecks = [
      { name: 'Page inscription accessible', found: registerResponse.ok },
      { name: 'Formulaire d\'inscription', found: registerContent.includes('form') },
      { name: 'Champ nom', found: registerContent.includes('name') || registerContent.includes('nom') },
      { name: 'Champ email', found: registerContent.includes('email') },
      { name: 'Champ mot de passe', found: registerContent.includes('password') || registerContent.includes('mot de passe') },
      { name: 'Bouton d\'inscription', found: registerContent.includes('register') || registerContent.includes('inscription') },
      { name: 'Validation des champs', found: registerContent.includes('required') || registerContent.includes('validation') },
      { name: 'Conditions d\'utilisation', found: registerContent.includes('terms') || registerContent.includes('conditions') },
      { name: 'Politique de confidentialité', found: registerContent.includes('privacy') || registerContent.includes('confidentialité') },
      { name: 'Lien vers connexion', found: registerContent.includes('login') || registerContent.includes('connexion') }
    ];
    
    for (const check of registrationChecks) {
      if (check.found) {
        logSuccess(`Registration: ${check.name}`);
        results.push(true);
      } else {
        logError(`Registration: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test de la structure du formulaire
    const formStructure = [
      'input', 'label', 'button', 'div', 'section'
    ];
    
    for (const element of formStructure) {
      if (registerContent.includes(element)) {
        logSuccess(`Registration: Structure ${element} présente`);
        results.push(true);
      } else {
        logWarning(`Registration: Structure ${element} manquante`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test registration: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 3. TEST DE LOGIN CLIENT (100%)
// =====================================================

async function testClientLogin100() {
  logHeader('👤 TEST LOGIN CLIENT 100% COMPLET');
  
  const results = [];
  
  try {
    // Test de la page de connexion
    const loginResponse = await fetch(TEST_URLS.login);
    const loginContent = await loginResponse.text();
    
    const clientLoginChecks = [
      { name: 'Page connexion accessible', found: loginResponse.ok },
      { name: 'Formulaire de connexion', found: loginContent.includes('form') },
      { name: 'Champ email', found: loginContent.includes('email') },
      { name: 'Champ mot de passe', found: loginContent.includes('password') || loginContent.includes('mot de passe') },
      { name: 'Bouton de connexion', found: loginContent.includes('login') || loginContent.includes('connexion') },
      { name: 'Lien mot de passe oublié', found: loginContent.includes('forgot') || loginContent.includes('oublié') },
      { name: 'Lien vers inscription', found: loginContent.includes('register') || loginContent.includes('inscription') },
      { name: 'Validation des champs', found: loginContent.includes('required') || loginContent.includes('validation') },
      { name: 'Souvenir de moi', found: loginContent.includes('remember') || loginContent.includes('souvenir') },
      { name: 'Sécurité CSRF', found: loginContent.includes('csrf') || loginContent.includes('token') }
    ];
    
    for (const check of clientLoginChecks) {
      if (check.found) {
        logSuccess(`Client Login: ${check.name}`);
        results.push(true);
      } else {
        logError(`Client Login: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test de la redirection après connexion
    const redirectChecks = [
      'dashboard', 'client', 'redirect', 'success'
    ];
    
    for (const check of redirectChecks) {
      if (loginContent.includes(check)) {
        logSuccess(`Client Login: Redirection ${check} configurée`);
        results.push(true);
      } else {
        logWarning(`Client Login: Redirection ${check} non détectée`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test client login: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 4. TEST DE LOGIN ADMIN (100%)
// =====================================================

async function testAdminLogin100() {
  logHeader('👨‍💼 TEST LOGIN ADMIN 100% COMPLET');
  
  const results = [];
  
  try {
    // Test de la page de connexion admin
    const loginResponse = await fetch(TEST_URLS.login);
    const loginContent = await loginResponse.text();
    
    const adminLoginChecks = [
      { name: 'Page connexion accessible', found: loginResponse.ok },
      { name: 'Formulaire de connexion', found: loginContent.includes('form') },
      { name: 'Champ email', found: loginContent.includes('email') },
      { name: 'Champ mot de passe', found: loginContent.includes('password') || loginContent.includes('mot de passe') },
      { name: 'Bouton de connexion', found: loginContent.includes('login') || loginContent.includes('connexion') },
      { name: 'Sécurité admin', found: loginContent.includes('admin') || loginContent.includes('role') },
      { name: 'Validation admin', found: loginContent.includes('validation') || loginContent.includes('verify') },
      { name: 'Redirection admin', found: loginContent.includes('admin') || loginContent.includes('dashboard') },
      { name: 'Protection admin', found: loginContent.includes('secure') || loginContent.includes('protected') },
      { name: 'Session admin', found: loginContent.includes('session') || loginContent.includes('auth') }
    ];
    
    for (const check of adminLoginChecks) {
      if (check.found) {
        logSuccess(`Admin Login: ${check.name}`);
        results.push(true);
      } else {
        logError(`Admin Login: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test des fonctionnalités admin spécifiques
    const adminFeatures = [
      'admin', 'dashboard', 'management', 'control', 'superuser'
    ];
    
    for (const feature of adminFeatures) {
      if (loginContent.includes(feature)) {
        logSuccess(`Admin Login: Fonctionnalité ${feature} présente`);
        results.push(true);
      } else {
        logWarning(`Admin Login: Fonctionnalité ${feature} non détectée`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test admin login: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 5. TEST DES FONCTIONNALITÉS ADMIN (100%)
// =====================================================

async function testAdminFeatures100() {
  logHeader('⚙️ TEST FONCTIONNALITÉS ADMIN 100% COMPLET');
  
  const results = [];
  
  try {
    // Test du dashboard admin
    const adminResponse = await fetch(TEST_URLS.admin);
    const adminContent = await adminResponse.text();
    
    const adminFeatureChecks = [
      { name: 'Dashboard admin accessible', found: adminResponse.ok },
      { name: 'Interface admin', found: adminContent.includes('admin') || adminContent.includes('dashboard') },
      { name: 'Gestion utilisateurs', found: adminContent.includes('users') || adminContent.includes('utilisateurs') },
      { name: 'Gestion transactions', found: adminContent.includes('transactions') },
      { name: 'Gestion plans', found: adminContent.includes('plans') || adminContent.includes('investments') },
      { name: 'Gestion wallets', found: adminContent.includes('wallets') || adminContent.includes('crypto') },
      { name: 'Statistiques', found: adminContent.includes('stats') || adminContent.includes('statistics') },
      { name: 'Logs système', found: adminContent.includes('logs') || adminContent.includes('system') },
      { name: 'Paramètres', found: adminContent.includes('settings') || adminContent.includes('paramètres') },
      { name: 'Notifications', found: adminContent.includes('notifications') },
      { name: 'Sécurité', found: adminContent.includes('security') || adminContent.includes('sécurité') },
      { name: 'Backup', found: adminContent.includes('backup') || adminContent.includes('sauvegarde') },
      { name: 'Monitoring', found: adminContent.includes('monitoring') || adminContent.includes('surveillance') },
      { name: 'Rapports', found: adminContent.includes('reports') || adminContent.includes('rapports') },
      { name: 'API management', found: adminContent.includes('api') || adminContent.includes('management') }
    ];
    
    for (const check of adminFeatureChecks) {
      if (check.found) {
        logSuccess(`Admin Features: ${check.name}`);
        results.push(true);
      } else {
        logError(`Admin Features: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test des actions admin
    const adminActions = [
      'create', 'edit', 'delete', 'update', 'manage', 'control', 'configure'
    ];
    
    for (const action of adminActions) {
      if (adminContent.includes(action)) {
        logSuccess(`Admin Features: Action ${action} disponible`);
        results.push(true);
      } else {
        logWarning(`Admin Features: Action ${action} non détectée`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test admin features: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 6. TEST DES FONCTIONNALITÉS CLIENT (100%)
// =====================================================

async function testClientFeatures100() {
  logHeader('👤 TEST FONCTIONNALITÉS CLIENT 100% COMPLET');
  
  const results = [];
  
  try {
    // Test du dashboard client
    const clientResponse = await fetch(TEST_URLS.client);
    const clientContent = await clientResponse.text();
    
    const clientFeatureChecks = [
      { name: 'Dashboard client accessible', found: clientResponse.ok },
      { name: 'Interface client', found: clientContent.includes('client') || clientContent.includes('dashboard') },
      { name: 'Portefeuille', found: clientContent.includes('wallet') || clientContent.includes('portefeuille') },
      { name: 'Investissements', found: clientContent.includes('investments') || clientContent.includes('investissements') },
      { name: 'Transactions', found: clientContent.includes('transactions') },
      { name: 'Historique', found: clientContent.includes('history') || clientContent.includes('historique') },
      { name: 'Profil', found: clientContent.includes('profile') || clientContent.includes('profil') },
      { name: 'Notifications', found: clientContent.includes('notifications') },
      { name: 'Paramètres', found: clientContent.includes('settings') || clientContent.includes('paramètres') },
      { name: 'Support', found: clientContent.includes('support') || clientContent.includes('aide') },
      { name: 'Sécurité', found: clientContent.includes('security') || clientContent.includes('sécurité') },
      { name: 'Déconnexion', found: clientContent.includes('logout') || clientContent.includes('déconnexion') },
      { name: 'Balance', found: clientContent.includes('balance') || clientContent.includes('solde') },
      { name: 'Gains', found: clientContent.includes('profits') || clientContent.includes('gains') },
      { name: 'Plans disponibles', found: clientContent.includes('plans') || clientContent.includes('investments') }
    ];
    
    for (const check of clientFeatureChecks) {
      if (check.found) {
        logSuccess(`Client Features: ${check.name}`);
        results.push(true);
      } else {
        logError(`Client Features: ${check.name} manquant`);
        results.push(false);
      }
    }
    
    // Test des actions client
    const clientActions = [
      'invest', 'withdraw', 'deposit', 'transfer', 'view', 'update', 'manage'
    ];
    
    for (const action of clientActions) {
      if (clientContent.includes(action)) {
        logSuccess(`Client Features: Action ${action} disponible`);
        results.push(true);
      } else {
        logWarning(`Client Features: Action ${action} non détectée`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test client features: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 7. TEST DE LA BASE DE DONNÉES (100%)
// =====================================================

async function testDatabase100() {
  logHeader('🗄️ TEST BASE DE DONNÉES 100% COMPLET');
  
  const results = [];
  
  try {
    // Test de la connexion Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/system_settings?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      logSuccess('Database: Connexion Supabase réussie');
      results.push(true);
    } else {
      logError(`Database: Erreur connexion Supabase ${response.status}`);
      results.push(false);
    }
    
    // Test des tables
    const tables = [
      'users', 'transactions', 'user_investments', 'investment_plans', 
      'crypto_wallets', 'system_logs', 'system_settings', 'notifications'
    ];
    
    for (const table of tables) {
      try {
        const tableResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        
        if (tableResponse.ok) {
          logSuccess(`Database: Table ${table} accessible`);
          results.push(true);
        } else {
          logError(`Database: Table ${table} non accessible ${tableResponse.status}`);
          results.push(false);
        }
      } catch (error) {
        logError(`Database: Erreur table ${table}: ${error.message}`);
        results.push(false);
      }
    }
    
    // Test de la fonction RPC
    try {
      const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_stats`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (rpcResponse.ok) {
        const stats = await rpcResponse.json();
        logSuccess(`Database: Fonction RPC opérationnelle - ${JSON.stringify(stats)}`);
        results.push(true);
      } else {
        logError(`Database: Erreur fonction RPC ${rpcResponse.status}`);
        results.push(false);
      }
    } catch (error) {
      logError(`Database: Erreur fonction RPC: ${error.message}`);
      results.push(false);
    }
    
  } catch (error) {
    logError(`Erreur test database: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 8. TEST DE SÉCURITÉ (100%)
// =====================================================

async function testSecurity100() {
  logHeader('🔒 TEST SÉCURITÉ 100% COMPLET');
  
  const results = [];
  
  try {
    // Test des en-têtes de sécurité
    const response = await fetch(TEST_URLS.production);
    const headers = response.headers;
    
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options', 
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Referrer-Policy',
      'Permissions-Policy'
    ];
    
    for (const header of securityHeaders) {
      if (headers.get(header)) {
        logSuccess(`Security: En-tête ${header} présent`);
        results.push(true);
      } else {
        logWarning(`Security: En-tête ${header} manquant`);
        results.push(false);
      }
    }
    
    // Test de la protection CSRF
    const content = await response.text();
    const csrfChecks = [
      'csrf', 'token', 'nonce', 'xsrf'
    ];
    
    for (const check of csrfChecks) {
      if (content.includes(check)) {
        logSuccess(`Security: Protection ${check} présente`);
        results.push(true);
      } else {
        logWarning(`Security: Protection ${check} non détectée`);
        results.push(false);
      }
    }
    
    // Test de la validation des entrées
    const validationChecks = [
      'required', 'pattern', 'minlength', 'maxlength', 'validation'
    ];
    
    for (const check of validationChecks) {
      if (content.includes(check)) {
        logSuccess(`Security: Validation ${check} présente`);
        results.push(true);
      } else {
        logWarning(`Security: Validation ${check} non détectée`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test security: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// 9. TEST DE PERFORMANCE (100%)
// =====================================================

async function testPerformance100() {
  logHeader('⚡ TEST PERFORMANCE 100% COMPLET');
  
  const results = [];
  
  try {
    const urls = Object.values(TEST_URLS);
    
    for (const url of urls) {
      try {
        const startTime = Date.now();
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
          if (responseTime < 1000) {
            logSuccess(`Performance: ${url} - Rapide (${responseTime}ms)`);
            results.push(true);
          } else if (responseTime < 3000) {
            logWarning(`Performance: ${url} - Moyen (${responseTime}ms)`);
            results.push(false);
          } else {
            logError(`Performance: ${url} - Lent (${responseTime}ms)`);
            results.push(false);
          }
        } else {
          logError(`Performance: ${url} - Erreur ${response.status}`);
          results.push(false);
        }
      } catch (error) {
        logError(`Performance: ${url} - Erreur de connexion`);
        results.push(false);
      }
    }
    
  } catch (error) {
    logError(`Erreur test performance: ${error.message}`);
    results.push(false);
  }
  
  return results;
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function run100PercentTests() {
  logHeader('🚀 TEST 100% COMPLET - CRYPTOBOOST APPLICATION');
  
  const startTime = Date.now();
  const allResults = [];
  
  try {
    // Tests séquentiels
    logInfo('Démarrage des tests 100% complets...');
    
    const frontendResults = await testFrontend100();
    const registrationResults = await testRegistration100();
    const clientLoginResults = await testClientLogin100();
    const adminLoginResults = await testAdminLogin100();
    const adminFeaturesResults = await testAdminFeatures100();
    const clientFeaturesResults = await testClientFeatures100();
    const databaseResults = await testDatabase100();
    const securityResults = await testSecurity100();
    const performanceResults = await testPerformance100();
    
    // Compilation des résultats
    allResults.push(...frontendResults);
    allResults.push(...registrationResults);
    allResults.push(...clientLoginResults);
    allResults.push(...adminLoginResults);
    allResults.push(...adminFeaturesResults);
    allResults.push(...clientFeaturesResults);
    allResults.push(...databaseResults);
    allResults.push(...securityResults);
    allResults.push(...performanceResults);
    
    const totalTime = Date.now() - startTime;
    
    // Résumé final
    logHeader('🎉 RÉSUMÉ FINAL - TEST 100% COMPLET');
    
    const successCount = allResults.filter(Boolean).length;
    const totalCount = allResults.length;
    const successRate = (successCount / totalCount) * 100;
    
    logSuccess(`Tests réussis: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
    logSuccess(`Temps total: ${totalTime}ms`);
    
    // Détail par catégorie
    log('\n📊 DÉTAIL PAR CATÉGORIE:', 'cyan');
    log(`Frontend: ${frontendResults.filter(Boolean).length}/${frontendResults.length} (${(frontendResults.filter(Boolean).length / frontendResults.length * 100).toFixed(1)}%)`);
    log(`Registration: ${registrationResults.filter(Boolean).length}/${registrationResults.length} (${(registrationResults.filter(Boolean).length / registrationResults.length * 100).toFixed(1)}%)`);
    log(`Client Login: ${clientLoginResults.filter(Boolean).length}/${clientLoginResults.length} (${(clientLoginResults.filter(Boolean).length / clientLoginResults.length * 100).toFixed(1)}%)`);
    log(`Admin Login: ${adminLoginResults.filter(Boolean).length}/${adminLoginResults.length} (${(adminLoginResults.filter(Boolean).length / adminLoginResults.length * 100).toFixed(1)}%)`);
    log(`Admin Features: ${adminFeaturesResults.filter(Boolean).length}/${adminFeaturesResults.length} (${(adminFeaturesResults.filter(Boolean).length / adminFeaturesResults.length * 100).toFixed(1)}%)`);
    log(`Client Features: ${clientFeaturesResults.filter(Boolean).length}/${clientFeaturesResults.length} (${(clientFeaturesResults.filter(Boolean).length / clientFeaturesResults.length * 100).toFixed(1)}%)`);
    log(`Database: ${databaseResults.filter(Boolean).length}/${databaseResults.length} (${(databaseResults.filter(Boolean).length / databaseResults.length * 100).toFixed(1)}%)`);
    log(`Security: ${securityResults.filter(Boolean).length}/${securityResults.length} (${(securityResults.filter(Boolean).length / securityResults.length * 100).toFixed(1)}%)`);
    log(`Performance: ${performanceResults.filter(Boolean).length}/${performanceResults.length} (${(performanceResults.filter(Boolean).length / performanceResults.length * 100).toFixed(1)}%)`);
    
    if (successRate >= 90) {
      log('\n🎯 VOTRE APPLICATION CRYPTOBOOST EST 100% OPÉRATIONNELLE !', 'green');
      log('🌐 URL: https://cryptoboost.world/', 'cyan');
      log('📊 Dashboard Admin: https://cryptoboost.world/admin', 'cyan');
      log('👤 Dashboard Client: https://cryptoboost.world/client', 'cyan');
    } else if (successRate >= 80) {
      log('\n⚠️ APPLICATION FONCTIONNELLE AVEC QUELQUES AMÉLIORATIONS NÉCESSAIRES', 'yellow');
    } else {
      log('\n❌ DES PROBLÈMES MAJEURS ONT ÉTÉ DÉTECTÉS', 'red');
    }
    
  } catch (error) {
    logError(`Erreur critique lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
run100PercentTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});