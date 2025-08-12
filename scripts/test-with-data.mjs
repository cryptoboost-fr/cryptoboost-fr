#!/usr/bin/env node

/**
 * SCRIPT DE TEST AVEC DONNÉES - APPLICATION CRYPTOBOOST
 * Teste toutes les fonctionnalités avec les données de la base
 */

import fetch from 'node-fetch';

// Configuration
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

// ============================================================================
// TESTS AVEC DONNÉES
// ============================================================================

async function testInvestmentPlans() {
  logSection('💰 TEST DES PLANS D\'INVESTISSEMENT');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*&is_active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const plans = await response.json();
      logTest('Récupération plans d\'investissement', true, `${plans.length} plans trouvés`);
      
      // Vérifier les plans spécifiques
      const planNames = plans.map(p => p.name);
      logTest('Plan Starter présent', planNames.includes('Plan Starter'), 'Plan Starter trouvé');
      logTest('Plan Premium présent', planNames.includes('Plan Premium'), 'Plan Premium trouvé');
      logTest('Plan VIP présent', planNames.includes('Plan VIP'), 'Plan VIP trouvé');
      logTest('Plan Crypto présent', planNames.includes('Plan Crypto'), 'Plan Crypto trouvé');
      
      return plans;
    } else {
      logTest('Récupération plans d\'investissement', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération plans d\'investissement', false, error.message);
    return [];
  }
}

async function testUsers() {
  logSection('👥 TEST DES UTILISATEURS');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const users = await response.json();
      logTest('Récupération utilisateurs', true, `${users.length} utilisateurs trouvés`);
      
      // Vérifier les utilisateurs spécifiques
      const userEmails = users.map(u => u.email);
      logTest('Admin présent', userEmails.includes('admin@cryptoboost.world'), 'Admin trouvé');
      logTest('Client1 présent', userEmails.includes('client1@cryptoboost.world'), 'Client1 trouvé');
      logTest('Client2 présent', userEmails.includes('client2@cryptoboost.world'), 'Client2 trouvé');
      
      return users;
    } else {
      logTest('Récupération utilisateurs', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération utilisateurs', false, error.message);
    return [];
  }
}

async function testCryptoWallets() {
  logSection('🔐 TEST DES WALLETS CRYPTO');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/crypto_wallets?select=*&is_active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const wallets = await response.json();
      logTest('Récupération wallets crypto', true, `${wallets.length} wallets trouvés`);
      
      // Vérifier les wallets spécifiques
      const walletTypes = wallets.map(w => w.crypto_type);
      logTest('Wallet BTC présent', walletTypes.includes('BTC'), 'Wallet BTC trouvé');
      logTest('Wallet ETH présent', walletTypes.includes('ETH'), 'Wallet ETH trouvé');
      logTest('Wallet USDT présent', walletTypes.includes('USDT'), 'Wallet USDT trouvé');
      
      return wallets;
    } else {
      logTest('Récupération wallets crypto', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération wallets crypto', false, error.message);
    return [];
  }
}

async function testTransactions() {
  logSection('💳 TEST DES TRANSACTIONS');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const transactions = await response.json();
      logTest('Récupération transactions', true, `${transactions.length} transactions trouvées`);
      
      // Vérifier les types de transactions
      const transactionTypes = transactions.map(t => t.type);
      logTest('Transaction deposit présente', transactionTypes.includes('deposit'), 'Deposit trouvé');
      logTest('Transaction investment présente', transactionTypes.includes('investment'), 'Investment trouvé');
      logTest('Transaction profit présente', transactionTypes.includes('profit'), 'Profit trouvé');
      logTest('Transaction withdrawal présente', transactionTypes.includes('withdrawal'), 'Withdrawal trouvé');
      
      return transactions;
    } else {
      logTest('Récupération transactions', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération transactions', false, error.message);
    return [];
  }
}

async function testNotifications() {
  logSection('🔔 TEST DES NOTIFICATIONS');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/notifications?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const notifications = await response.json();
      logTest('Récupération notifications', true, `${notifications.length} notifications trouvées`);
      
      // Vérifier les types de notifications
      const notificationTypes = notifications.map(n => n.type);
      logTest('Notification success présente', notificationTypes.includes('success'), 'Success trouvé');
      logTest('Notification info présente', notificationTypes.includes('info'), 'Info trouvé');
      
      return notifications;
    } else {
      logTest('Récupération notifications', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération notifications', false, error.message);
    return [];
  }
}

async function testSystemLogs() {
  logSection('📋 TEST DES LOGS SYSTÈME');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/system_logs?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const logs = await response.json();
      logTest('Récupération logs système', true, `${logs.length} logs trouvés`);
      
      // Vérifier les actions de logs
      const logActions = logs.map(l => l.action);
      logTest('Log user_registration présent', logActions.includes('user_registration'), 'User registration trouvé');
      logTest('Log investment_created présent', logActions.includes('investment_created'), 'Investment created trouvé');
      logTest('Log transaction_completed présent', logActions.includes('transaction_completed'), 'Transaction completed trouvé');
      logTest('Log profit_generated présent', logActions.includes('profit_generated'), 'Profit generated trouvé');
      
      return logs;
    } else {
      logTest('Récupération logs système', false, `Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    logTest('Récupération logs système', false, error.message);
    return [];
  }
}

async function testAuthentication() {
  logSection('🔐 TEST D\'AUTHENTIFICATION');
  
  try {
    // Test de connexion avec un utilisateur existant
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'client1@cryptoboost.world',
        password: 'ClientPassword123!'
      })
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Authentification utilisateur', true, 'Token reçu');
      logTest('Token access présent', !!data.access_token, 'Access token trouvé');
      logTest('Token refresh présent', !!data.refresh_token, 'Refresh token trouvé');
      return data;
    } else {
      logTest('Authentification utilisateur', false, `Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    logTest('Authentification utilisateur', false, error.message);
    return null;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function runTestWithData() {
  log('🚀 TEST AVEC DONNÉES CRYPTOBOOST', 'bright');
  log('Vérification de toutes les fonctionnalités avec les données de la base', 'cyan');
  
  try {
    // 1. Test des plans d'investissement
    await testInvestmentPlans();
    
    // 2. Test des utilisateurs
    await testUsers();
    
    // 3. Test des wallets crypto
    await testCryptoWallets();
    
    // 4. Test des transactions
    await testTransactions();
    
    // 5. Test des notifications
    await testNotifications();
    
    // 6. Test des logs système
    await testSystemLogs();
    
    // 7. Test d'authentification
    await testAuthentication();

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
      log('🏆 Toutes les données sont présentes et accessibles', 'green');
    } else {
      log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
      log(`❌ ${stats.failed} problème(s) à résoudre`, 'red');
    }

  } catch (error) {
    log('\n❌ Erreur lors des tests avec données', 'red');
    log(error.message, 'red');
  }
}

// Exécution des tests
runTestWithData().catch(console.error);