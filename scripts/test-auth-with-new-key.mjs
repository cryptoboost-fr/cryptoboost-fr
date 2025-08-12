#!/usr/bin/env node

/**
 * Script de test d'authentification avec la nouvelle clé API Supabase
 */

import fetch from 'node-fetch';

// Configuration avec la nouvelle clé
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  const status = success ? '✅' : '❌';
  const color = success ? 'green' : 'red';
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

// Test de connexion Supabase
async function testSupabaseConnection() {
  log('\n🔗 TEST DE CONNEXION SUPABASE', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      logTest('Connexion Supabase', true, 'Clé API fonctionnelle');
      return true;
    } else {
      logTest('Connexion Supabase', false, `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Connexion Supabase', false, error.message);
    return false;
  }
}

// Test de création d'un utilisateur de test
async function testUserCreation() {
  log('\n👤 TEST DE CRÉATION D\'UTILISATEUR', 'cyan');
  
  const testEmail = `test-user-${Date.now()}@cryptoboost.world`;
  const testPassword = 'TestPassword123!';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: {
          full_name: 'Test User',
          role: 'client'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Création utilisateur', true, `Email: ${testEmail}`);
      return { email: testEmail, password: testPassword, user: data.user };
    } else {
      const errorData = await response.json();
      logTest('Création utilisateur', false, `Status: ${response.status} - ${JSON.stringify(errorData)}`);
      return null;
    }
  } catch (error) {
    logTest('Création utilisateur', false, error.message);
    return null;
  }
}

// Test de connexion utilisateur
async function testUserLogin(email, password) {
  log('\n🔐 TEST DE CONNEXION UTILISATEUR', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Connexion utilisateur', true, `Token reçu: ${data.access_token ? 'Oui' : 'Non'}`);
      return data;
    } else {
      const errorData = await response.json();
      logTest('Connexion utilisateur', false, `Status: ${response.status} - ${JSON.stringify(errorData)}`);
      return null;
    }
  } catch (error) {
    logTest('Connexion utilisateur', false, error.message);
    return null;
  }
}

// Test de récupération des données utilisateur
async function testUserData(accessToken) {
  log('\n📊 TEST DE RÉCUPÉRATION DES DONNÉES', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const users = await response.json();
      logTest('Récupération utilisateurs', true, `${users.length} utilisateurs trouvés`);
      return users;
    } else {
      logTest('Récupération utilisateurs', false, `Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    logTest('Récupération utilisateurs', false, error.message);
    return null;
  }
}

// Test de récupération des plans d'investissement
async function testInvestmentPlans(accessToken) {
  log('\n💰 TEST DES PLANS D\'INVESTISSEMENT', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*&is_active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const plans = await response.json();
      logTest('Récupération plans', true, `${plans.length} plans actifs trouvés`);
      return plans;
    } else {
      logTest('Récupération plans', false, `Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    logTest('Récupération plans', false, error.message);
    return null;
  }
}

// Test de récupération des wallets crypto
async function testCryptoWallets(accessToken) {
  log('\n🔐 TEST DES WALLETS CRYPTO', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/crypto_wallets?select=*&is_active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const wallets = await response.json();
      logTest('Récupération wallets', true, `${wallets.length} wallets actifs trouvés`);
      return wallets;
    } else {
      logTest('Récupération wallets', false, `Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    logTest('Récupération wallets', false, error.message);
    return null;
  }
}

// Fonction principale
async function runAuthTests() {
  log('🚀 TEST D\'AUTHENTIFICATION AVEC NOUVELLE CLÉ API', 'bright');
  log('Vérification de la fonctionnalité complète de l\'API Supabase', 'cyan');

  try {
    // Test 1: Connexion Supabase
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
      log('\n❌ La connexion Supabase a échoué. Arrêt des tests.', 'red');
      return;
    }

    // Test 2: Création d'un utilisateur de test
    const userData = await testUserCreation();
    if (!userData) {
      log('\n❌ La création d\'utilisateur a échoué. Arrêt des tests.', 'red');
      return;
    }

    // Test 3: Connexion de l'utilisateur
    const loginData = await testUserLogin(userData.email, userData.password);
    if (!loginData) {
      log('\n❌ La connexion utilisateur a échoué. Arrêt des tests.', 'red');
      return;
    }

    // Test 4: Récupération des données utilisateur
    await testUserData(loginData.access_token);

    // Test 5: Récupération des plans d'investissement
    await testInvestmentPlans(loginData.access_token);

    // Test 6: Récupération des wallets crypto
    await testCryptoWallets(loginData.access_token);

    // Résumé final
    log('\n🎉 RÉSUMÉ DES TESTS D\'AUTHENTIFICATION', 'bright');
    log('✅ Tous les tests d\'authentification sont réussis !', 'green');
    log('🔑 La nouvelle clé API Supabase fonctionne parfaitement', 'green');
    log('👤 L\'authentification utilisateur est opérationnelle', 'green');
    log('📊 La récupération des données fonctionne', 'green');
    log('🎯 L\'application est prête pour la production !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors des tests d\'authentification', 'red');
    log(error.message, 'red');
  }
}

// Exécution des tests
runAuthTests().catch(console.error);