#!/usr/bin/env node

/**
 * SCRIPT D'INSERTION DE DONNÉES DE TEST
 * Insère des données de test dans toutes les tables
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// INSERTION DE DONNÉES DE TEST
// ============================================================================

async function insertInvestmentPlans() {
  logSection('💰 INSERTION DES PLANS D\'INVESTISSEMENT');
  
  const plans = [
    {
      name: 'Plan Starter',
      description: 'Plan d\'investissement pour débutants avec un rendement stable',
      min_amount: 100,
      max_amount: 1000,
      interest_rate: 5.5,
      duration_days: 30
    },
    {
      name: 'Plan Premium',
      description: 'Plan d\'investissement premium avec des rendements élevés',
      min_amount: 1000,
      max_amount: 10000,
      interest_rate: 8.5,
      duration_days: 60
    },
    {
      name: 'Plan VIP',
      description: 'Plan d\'investissement VIP pour les gros investisseurs',
      min_amount: 10000,
      max_amount: 100000,
      interest_rate: 12.5,
      duration_days: 90
    },
    {
      name: 'Plan Crypto',
      description: 'Plan spécialisé dans les cryptomonnaies',
      min_amount: 500,
      max_amount: 5000,
      interest_rate: 15.0,
      duration_days: 45
    }
  ];

  for (const plan of plans) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(plan)
      });

      if (response.ok) {
        log(`✅ Plan "${plan.name}" créé`, 'green');
      } else {
        const errorData = await response.json();
        log(`⚠️  Plan "${plan.name}" déjà existant ou erreur`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création plan "${plan.name}": ${error.message}`, 'yellow');
    }
  }
}

async function createTestUsers() {
  logSection('👥 CRÉATION D\'UTILISATEURS DE TEST');
  
  const users = [
    {
      email: 'admin@cryptoboost.world',
      password: 'AdminPassword123!',
      full_name: 'Administrateur CryptoBoost',
      role: 'admin',
      phone: '+33123456789'
    },
    {
      email: 'client1@cryptoboost.world',
      password: 'ClientPassword123!',
      full_name: 'Jean Dupont',
      role: 'client',
      phone: '+33987654321'
    },
    {
      email: 'client2@cryptoboost.world',
      password: 'ClientPassword123!',
      full_name: 'Marie Martin',
      role: 'client',
      phone: '+33987654322'
    }
  ];

  for (const user of users) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          data: {
            full_name: user.full_name,
            role: user.role,
            phone: user.phone
          }
        })
      });

      if (response.ok) {
        log(`✅ Utilisateur "${user.full_name}" créé`, 'green');
      } else {
        const errorData = await response.json();
        log(`⚠️  Utilisateur "${user.full_name}" déjà existant`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création utilisateur "${user.full_name}": ${error.message}`, 'yellow');
    }
  }
}

async function insertCryptoWallets() {
  logSection('🔐 INSERTION DES WALLETS CRYPTO');
  
  const wallets = [
    {
      crypto_type: 'BTC',
      wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      balance: 0.5
    },
    {
      crypto_type: 'ETH',
      wallet_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      balance: 2.5
    },
    {
      crypto_type: 'USDT',
      wallet_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      balance: 1000
    }
  ];

  for (const wallet of wallets) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/crypto_wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(wallet)
      });

      if (response.ok) {
        log(`✅ Wallet ${wallet.crypto_type} créé`, 'green');
      } else {
        log(`⚠️  Wallet ${wallet.crypto_type} déjà existant ou erreur`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création wallet ${wallet.crypto_type}: ${error.message}`, 'yellow');
    }
  }
}

async function insertTransactions() {
  logSection('💳 INSERTION DES TRANSACTIONS');
  
  const transactions = [
    {
      type: 'deposit',
      amount: 1000,
      currency: 'USD',
      status: 'completed',
      description: 'Dépôt initial'
    },
    {
      type: 'investment',
      amount: 500,
      currency: 'USD',
      status: 'completed',
      description: 'Investissement Plan Starter'
    },
    {
      type: 'profit',
      amount: 27.5,
      currency: 'USD',
      status: 'completed',
      description: 'Bénéfice Plan Starter'
    },
    {
      type: 'withdrawal',
      amount: 200,
      currency: 'USD',
      status: 'pending',
      description: 'Retrait demandé'
    }
  ];

  for (const transaction of transactions) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(transaction)
      });

      if (response.ok) {
        log(`✅ Transaction ${transaction.type} créée`, 'green');
      } else {
        log(`⚠️  Transaction ${transaction.type} déjà existante ou erreur`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création transaction ${transaction.type}: ${error.message}`, 'yellow');
    }
  }
}

async function insertNotifications() {
  logSection('🔔 INSERTION DES NOTIFICATIONS');
  
  const notifications = [
    {
      title: 'Bienvenue sur CryptoBoost !',
      message: 'Votre compte a été créé avec succès. Commencez à investir dès maintenant !',
      type: 'success'
    },
    {
      title: 'Nouveau plan disponible',
      message: 'Le Plan Crypto avec 15% de rendement est maintenant disponible !',
      type: 'info'
    },
    {
      title: 'Investissement confirmé',
      message: 'Votre investissement de 500 USD dans le Plan Starter a été confirmé.',
      type: 'success'
    },
    {
      title: 'Bénéfice disponible',
      message: 'Vous avez gagné 27.5 USD sur votre investissement !',
      type: 'success'
    }
  ];

  for (const notification of notifications) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(notification)
      });

      if (response.ok) {
        log(`✅ Notification "${notification.title}" créée`, 'green');
      } else {
        log(`⚠️  Notification "${notification.title}" déjà existante ou erreur`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création notification "${notification.title}": ${error.message}`, 'yellow');
    }
  }
}

async function insertSystemLogs() {
  logSection('📋 INSERTION DES LOGS SYSTÈME');
  
  const logs = [
    {
      action: 'user_registration',
      details: { email: 'client1@cryptoboost.world', role: 'client' }
    },
    {
      action: 'investment_created',
      details: { plan: 'Plan Starter', amount: 500 }
    },
    {
      action: 'transaction_completed',
      details: { type: 'deposit', amount: 1000 }
    },
    {
      action: 'profit_generated',
      details: { amount: 27.5, plan: 'Plan Starter' }
    }
  ];

  for (const logEntry of logs) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/system_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(logEntry)
      });

      if (response.ok) {
        log(`✅ Log "${logEntry.action}" créé`, 'green');
      } else {
        log(`⚠️  Log "${logEntry.action}" déjà existant ou erreur`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur création log "${logEntry.action}": ${error.message}`, 'yellow');
    }
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function insertTestData() {
  log('🚀 INSERTION DE DONNÉES DE TEST CRYPTOBOOST', 'bright');
  log('Création de données de test pour toutes les tables', 'cyan');
  
  try {
    // 1. Insérer les plans d'investissement
    await insertInvestmentPlans();
    
    // 2. Créer des utilisateurs de test
    await createTestUsers();
    
    // 3. Insérer des wallets crypto
    await insertCryptoWallets();
    
    // 4. Insérer des transactions
    await insertTransactions();
    
    // 5. Insérer des notifications
    await insertNotifications();
    
    // 6. Insérer des logs système
    await insertSystemLogs();

    // Résumé final
    logSection('📊 RÉSUMÉ DE L\'INSERTION');
    log('✅ Plans d\'investissement insérés', 'green');
    log('✅ Utilisateurs de test créés', 'green');
    log('✅ Wallets crypto créés', 'green');
    log('✅ Transactions créées', 'green');
    log('✅ Notifications créées', 'green');
    log('✅ Logs système créés', 'green');
    log('🎉 Données de test CryptoBoost prêtes !', 'bright');

  } catch (error) {
    log('\n❌ Erreur lors de l\'insertion des données', 'red');
    log(error.message, 'red');
  }
}

// Exécution
insertTestData().catch(console.error);