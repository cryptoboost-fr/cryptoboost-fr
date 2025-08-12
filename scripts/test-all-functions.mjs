const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      headers,
      ...options
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Error ${response.status}:`, error);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function testAllFunctions() {
  console.log('🧪 Test complet de toutes les fonctionnalités CryptoBoost...\n');

  // 1. Test de connexion admin
  console.log('🔐 Test de connexion administrateur...');
  const adminLogin = await makeRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@cryptoboost.world',
      password: 'AdminCrypto2024!'
    })
  });

  if (!adminLogin || !adminLogin.access_token) {
    console.log('❌ Échec connexion admin');
    return;
  }

  console.log('✅ Connexion admin réussie');
  const adminToken = adminLogin.access_token;

  // 2. Test des tables principales
  console.log('\n📊 Test des tables principales...');
  
  const tables = [
    { name: 'users', endpoint: '/rest/v1/users?select=*' },
    { name: 'investment_plans', endpoint: '/rest/v1/investment_plans?select=*' },
    { name: 'crypto_wallets', endpoint: '/rest/v1/crypto_wallets?select=*' },
    { name: 'transactions', endpoint: '/rest/v1/transactions?select=*' },
    { name: 'notifications', endpoint: '/rest/v1/notifications?select=*' },
    { name: 'system_logs', endpoint: '/rest/v1/system_logs?select=*' },
    { name: 'user_investments', endpoint: '/rest/v1/user_investments?select=*' }
  ];

  for (const table of tables) {
    const result = await makeRequest(table.endpoint);
    if (result !== null) {
      console.log(`✅ Table ${table.name}: ${result.length} enregistrements`);
    } else {
      console.log(`❌ Table ${table.name}: Erreur d'accès`);
    }
  }

  // 3. Test des fonctions admin
  console.log('\n👑 Test des fonctions administrateur...');
  
  // Test getDashboardStats
  const dashboardStats = await makeRequest('/rest/v1/rpc/get_dashboard_stats');
  if (dashboardStats) {
    console.log('✅ getDashboardStats:', dashboardStats);
  } else {
    console.log('❌ getDashboardStats: Fonction non disponible');
  }

  // Test getAllUsers
  const allUsers = await makeRequest('/rest/v1/users?select=*');
  if (allUsers) {
    console.log(`✅ getAllUsers: ${allUsers.length} utilisateurs`);
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
  }

  // 4. Test des fonctions transaction
  console.log('\n💰 Test des fonctions transaction...');
  
  // Test createTransaction
  const testTransaction = {
    user_id: adminLogin.user.id,
    type: 'deposit',
    crypto_type: 'BTC',
    amount: 0.001,
    usd_value: 50.00,
    wallet_address: 'test-address',
    status: 'pending'
  };

  const newTransaction = await makeRequest('/rest/v1/transactions', {
    method: 'POST',
    body: JSON.stringify(testTransaction)
  });

  if (newTransaction) {
    console.log('✅ createTransaction: Transaction créée');
    
    // Test updateTransaction
    const updatedTransaction = await makeRequest(`/rest/v1/transactions?id=eq.${newTransaction.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' })
    });

    if (updatedTransaction !== null) {
      console.log('✅ updateTransaction: Transaction mise à jour');
    } else {
      console.log('❌ updateTransaction: Erreur de mise à jour');
    }
  } else {
    console.log('❌ createTransaction: Erreur de création');
  }

  // 5. Test des fonctions investment
  console.log('\n📈 Test des fonctions investment...');
  
  const plans = await makeRequest('/rest/v1/investment_plans?select=*&is_active=eq.true');
  if (plans && plans.length > 0) {
    console.log(`✅ getActivePlans: ${plans.length} plans actifs`);
    
    // Test createInvestment
    const testInvestment = {
      user_id: adminLogin.user.id,
      plan_id: plans[0].id,
      amount: 100.00,
      profit_target: 15.00,
      status: 'active'
    };

    const newInvestment = await makeRequest('/rest/v1/user_investments', {
      method: 'POST',
      body: JSON.stringify(testInvestment)
    });

    if (newInvestment) {
      console.log('✅ createInvestment: Investissement créé');
    } else {
      console.log('❌ createInvestment: Erreur de création');
    }
  }

  // 6. Test des fonctions user
  console.log('\n👤 Test des fonctions utilisateur...');
  
  // Test getUserByEmail
  const userByEmail = await makeRequest(`/rest/v1/users?email=eq.admin@cryptoboost.world&select=*`);
  if (userByEmail && userByEmail.length > 0) {
    console.log('✅ getUserByEmail: Utilisateur trouvé');
  } else {
    console.log('❌ getUserByEmail: Utilisateur non trouvé');
  }

  // Test updateUser
  const updateResult = await makeRequest(`/rest/v1/users?id=eq.${adminLogin.user.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ total_invested: 1000 })
  });

  if (updateResult !== null) {
    console.log('✅ updateUser: Utilisateur mis à jour');
  } else {
    console.log('❌ updateUser: Erreur de mise à jour');
  }

  // 7. Test des notifications
  console.log('\n🔔 Test des notifications...');
  
  const testNotification = {
    user_id: adminLogin.user.id,
    title: 'Test Notification',
    message: 'Ceci est un test de notification',
    type: 'info',
    is_read: false
  };

  const newNotification = await makeRequest('/rest/v1/notifications', {
    method: 'POST',
    body: JSON.stringify(testNotification)
  });

  if (newNotification) {
    console.log('✅ createNotification: Notification créée');
  } else {
    console.log('❌ createNotification: Erreur de création');
  }

  // 8. Test des logs système
  console.log('\n📝 Test des logs système...');
  
  const testLog = {
    user_id: adminLogin.user.id,
    action: 'TEST_ACTION',
    details: { test: true, timestamp: new Date().toISOString() }
  };

  const newLog = await makeRequest('/rest/v1/system_logs', {
    method: 'POST',
    body: JSON.stringify(testLog)
  });

  if (newLog) {
    console.log('✅ createSystemLog: Log créé');
  } else {
    console.log('❌ createSystemLog: Erreur de création');
  }

  // 9. Test des wallets crypto
  console.log('\n💳 Test des wallets crypto...');
  
  const wallets = await makeRequest('/rest/v1/crypto_wallets?select=*&is_active=eq.true');
  if (wallets) {
    console.log(`✅ getCryptoWallets: ${wallets.length} wallets actifs`);
    wallets.forEach(wallet => {
      console.log(`  - ${wallet.crypto_type}: ${wallet.address}`);
    });
  }

  // 10. Test de l'API CoinAPI
  console.log('\n🪙 Test de l\'API CoinAPI...');
  
  try {
    const coinApiResponse = await fetch('https://rest.coinapi.io/v1/exchangerate/BTC/EUR', {
      headers: {
        'X-CoinAPI-Key': '0ff4f88a-0673-403e-8773-8eeac3e46d66'
      }
    });
    
    if (coinApiResponse.ok) {
      const coinData = await coinApiResponse.json();
      console.log('✅ CoinAPI: Prix BTC/EUR récupéré');
    } else {
      console.log('❌ CoinAPI: Erreur de récupération des prix');
    }
  } catch (error) {
    console.log('❌ CoinAPI: Erreur de connexion');
  }

  // 11. Résumé final
  console.log('\n📋 Résumé des tests...');
  
  const finalStats = await makeRequest('/rest/v1/rpc/get_dashboard_stats');
  if (finalStats) {
    console.log('📊 Statistiques finales:');
    console.log(`  - Utilisateurs totaux: ${finalStats.total_users}`);
    console.log(`  - Capital total: ${finalStats.total_capital}€`);
    console.log(`  - Investissements actifs: ${finalStats.active_investments}`);
    console.log(`  - Transactions en attente: ${finalStats.pending_transactions}`);
  }

  console.log('\n🎉 Tests terminés !');
  console.log('\n✅ Fonctionnalités testées :');
  console.log('  - Authentification admin');
  console.log('  - Gestion des utilisateurs');
  console.log('  - Gestion des transactions');
  console.log('  - Gestion des investissements');
  console.log('  - Gestion des notifications');
  console.log('  - Logs système');
  console.log('  - Wallets crypto');
  console.log('  - API CoinAPI');
  console.log('\n🔗 URL de l\'application: https://cryptoboost.world');
}

testAllFunctions().catch(console.error);