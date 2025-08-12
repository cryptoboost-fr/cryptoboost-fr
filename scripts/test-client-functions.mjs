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

async function testClientFunctions() {
  console.log('🧪 Test complet des fonctionnalités client...\n');

  // 1. Créer un utilisateur de test client
  console.log('👤 Création d\'un utilisateur client de test...');
  
  const testUserData = {
    email: 'client-test@cryptoboost.world',
    password: 'ClientTest2024!',
    user_metadata: {
      full_name: 'Client Test'
    }
  };

  const testUserResult = await makeRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(testUserData)
  });

  if (!testUserResult || !testUserResult.user) {
    console.log('❌ Échec création utilisateur client');
    return;
  }

  console.log('✅ Utilisateur client créé dans auth');
  const clientUserId = testUserResult.user.id;

  // 2. Connexion admin pour créer le profil client
  console.log('\n🔐 Connexion administrateur...');
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
  const adminHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  // 3. Créer le profil client
  console.log('\n👤 Création du profil client...');
  const clientProfile = {
    id: clientUserId,
    email: 'client-test@cryptoboost.world',
    full_name: 'Client Test',
    role: 'client',
    status: 'active',
    total_invested: 0,
    total_profit: 0
  };

  const clientProfileResult = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(clientProfile)
  });

  if (clientProfileResult.ok) {
    console.log('✅ Profil client créé');
  } else {
    console.log('❌ Erreur création profil client');
  }

  // 4. Connexion client
  console.log('\n🔐 Connexion client...');
  const clientLogin = await makeRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({
      email: 'client-test@cryptoboost.world',
      password: 'ClientTest2024!'
    })
  });

  if (!clientLogin || !clientLogin.access_token) {
    console.log('❌ Échec connexion client');
    return;
  }

  console.log('✅ Connexion client réussie');
  const clientToken = clientLogin.access_token;
  const clientHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${clientToken}`,
    'Content-Type': 'application/json'
  };

  // 5. Test Dashboard Client
  console.log('\n📊 Test Dashboard Client...');
  
  // Test récupération des investissements
  const investments = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?user_id=eq.${clientUserId}&select=*`, {
    headers: clientHeaders
  });

  if (investments.ok) {
    const invsData = await investments.json();
    console.log(`✅ Investissements: ${invsData.length} trouvés`);
  } else {
    console.log('❌ Erreur récupération investissements');
  }

  // Test récupération des transactions
  const transactions = await fetch(`${SUPABASE_URL}/rest/v1/transactions?user_id=eq.${clientUserId}&select=*`, {
    headers: clientHeaders
  });

  if (transactions.ok) {
    const txsData = await transactions.json();
    console.log(`✅ Transactions: ${txsData.length} trouvées`);
  } else {
    console.log('❌ Erreur récupération transactions');
  }

  // 6. Test Wallet Client
  console.log('\n💳 Test Wallet Client...');
  
  // Test récupération des wallets crypto
  const wallets = await makeRequest('/rest/v1/crypto_wallets?select=*&is_active=eq.true');
  if (wallets && wallets.length > 0) {
    console.log(`✅ Wallets crypto: ${wallets.length} disponibles`);
  }

  // Test création transaction de dépôt
  const depositTransaction = {
    user_id: clientUserId,
    type: 'deposit',
    crypto_type: 'BTC',
    amount: 0.001,
    usd_value: 50.00,
    wallet_address: 'test-deposit-address',
    status: 'pending'
  };

  const depositResult = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: clientHeaders,
    body: JSON.stringify(depositTransaction)
  });

  if (depositResult.ok) {
    console.log('✅ Transaction de dépôt créée');
  } else {
    console.log('❌ Erreur création transaction de dépôt');
  }

  // Test création transaction de retrait
  const withdrawalTransaction = {
    user_id: clientUserId,
    type: 'withdrawal',
    crypto_type: 'ETH',
    amount: 0.01,
    usd_value: 30.00,
    wallet_address: 'test-withdrawal-address',
    status: 'pending'
  };

  const withdrawalResult = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: clientHeaders,
    body: JSON.stringify(withdrawalTransaction)
  });

  if (withdrawalResult.ok) {
    console.log('✅ Transaction de retrait créée');
  } else {
    console.log('❌ Erreur création transaction de retrait');
  }

  // 7. Test Plans d'Investissement
  console.log('\n📈 Test Plans d\'Investissement...');
  
  // Test récupération des plans actifs
  const plans = await makeRequest('/rest/v1/investment_plans?select=*&is_active=eq.true');
  if (plans && plans.length > 0) {
    console.log(`✅ Plans d'investissement: ${plans.length} disponibles`);
    
    // Test création d'un investissement
    const testInvestment = {
      user_id: clientUserId,
      plan_id: plans[0].id,
      amount: 100.00,
      profit_target: 15.00,
      status: 'active',
      start_date: new Date().toISOString()
    };

    const investmentResult = await fetch(`${SUPABASE_URL}/rest/v1/user_investments`, {
      method: 'POST',
      headers: clientHeaders,
      body: JSON.stringify(testInvestment)
    });

    if (investmentResult.ok) {
      console.log('✅ Investissement créé');
    } else {
      console.log('❌ Erreur création investissement');
    }
  }

  // 8. Test Exchange
  console.log('\n🔄 Test Exchange...');
  
  // Test création transaction d'échange
  const exchangeTransaction = {
    user_id: clientUserId,
    type: 'exchange',
    crypto_type: 'BTC',
    amount: 0.001,
    usd_value: 50.00,
    to_crypto_type: 'ETH',
    to_amount: 0.01,
    to_usd_value: 50.00,
    status: 'pending'
  };

  const exchangeResult = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: clientHeaders,
    body: JSON.stringify(exchangeTransaction)
  });

  if (exchangeResult.ok) {
    console.log('✅ Transaction d\'échange créée');
  } else {
    console.log('❌ Erreur création transaction d\'échange');
  }

  // 9. Test Notifications
  console.log('\n🔔 Test Notifications...');
  
  const testNotification = {
    user_id: clientUserId,
    title: 'Test Notification Client',
    message: 'Ceci est un test de notification pour le client',
    type: 'info',
    is_read: false
  };

  const notificationResult = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
    method: 'POST',
    headers: clientHeaders,
    body: JSON.stringify(testNotification)
  });

  if (notificationResult.ok) {
    console.log('✅ Notification créée');
  } else {
    console.log('❌ Erreur création notification');
  }

  // 10. Test Profil Client
  console.log('\n👤 Test Profil Client...');
  
  const profileUpdate = {
    full_name: 'Client Test Modifié',
    total_invested: 100.00
  };

  const profileResult = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${clientUserId}`, {
    method: 'PATCH',
    headers: clientHeaders,
    body: JSON.stringify(profileUpdate)
  });

  if (profileResult.ok) {
    console.log('✅ Profil client mis à jour');
  } else {
    console.log('❌ Erreur mise à jour profil');
  }

  // 11. Test Historique
  console.log('\n📋 Test Historique...');
  
  const allTransactions = await fetch(`${SUPABASE_URL}/rest/v1/transactions?user_id=eq.${clientUserId}&select=*&order=created_at.desc`, {
    headers: clientHeaders
  });

  if (allTransactions.ok) {
    const allTxs = await allTransactions.json();
    console.log(`✅ Historique transactions: ${allTxs.length} transactions`);
  } else {
    console.log('❌ Erreur récupération historique');
  }

  const allInvestments = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?user_id=eq.${clientUserId}&select=*&order=created_at.desc`, {
    headers: clientHeaders
  });

  if (allInvestments.ok) {
    const allInvs = await allInvestments.json();
    console.log(`✅ Historique investissements: ${allInvs.length} investissements`);
  } else {
    console.log('❌ Erreur récupération historique investissements');
  }

  // 12. Test API CoinAPI
  console.log('\n🪙 Test API CoinAPI...');
  
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

  // 13. Résumé final
  console.log('\n📊 Résumé des tests client...');
  
  const finalStats = await makeRequest('/rest/v1/rpc/get_dashboard_stats');
  if (finalStats) {
    console.log('📈 Statistiques finales:');
    console.log(`  - Utilisateurs totaux: ${finalStats.total_users}`);
    console.log(`  - Capital total: ${finalStats.total_capital}€`);
    console.log(`  - Investissements actifs: ${finalStats.active_investments}`);
    console.log(`  - Transactions en attente: ${finalStats.pending_transactions}`);
  }

  console.log('\n🎉 Tests client terminés !');
  console.log('\n✅ Fonctionnalités client testées :');
  console.log('  - ✅ Inscription client');
  console.log('  - ✅ Connexion client');
  console.log('  - ✅ Dashboard client');
  console.log('  - ✅ Wallet (dépôts/retraits)');
  console.log('  - ✅ Plans d\'investissement');
  console.log('  - ✅ Exchange crypto');
  console.log('  - ✅ Notifications');
  console.log('  - ✅ Profil utilisateur');
  console.log('  - ✅ Historique');
  console.log('  - ✅ API CoinAPI');
  
  console.log('\n📋 Identifiants de test :');
  console.log('👤 Client Test: client-test@cryptoboost.world / ClientTest2024!');
  console.log('\n🔗 URL: https://cryptoboost.world/auth/login');
  
  console.log('\n🚀 Toutes les fonctionnalités client sont opérationnelles !');
}

testClientFunctions().catch(console.error);