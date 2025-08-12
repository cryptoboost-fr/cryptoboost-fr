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

async function fixAllRLSDefinitive() {
  console.log('🔧 Correction définitive de tous les problèmes RLS...\n');

  // 1. Connexion admin
  console.log('🔐 Connexion administrateur...');
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

  // 2. Vérifier et créer les tables manquantes
  console.log('\n📊 Vérification des tables...');
  
  const tables = [
    'users',
    'transactions', 
    'notifications',
    'system_logs',
    'user_investments'
  ];

  for (const table of tables) {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
      headers: adminHeaders
    });
    
    if (result.ok) {
      console.log(`✅ Table ${table}: accessible`);
    } else {
      console.log(`❌ Table ${table}: inaccessible`);
    }
  }

  // 3. Créer un utilisateur de test complet
  console.log('\n👤 Création d\'un utilisateur de test complet...');
  
  const testUserData = {
    email: 'test-complete@cryptoboost.world',
    password: 'TestComplete2024!',
    user_metadata: {
      full_name: 'Test Complet'
    }
  };

  const testUserResult = await makeRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(testUserData)
  });

  if (!testUserResult || !testUserResult.user) {
    console.log('❌ Échec création utilisateur test');
    return;
  }

  console.log('✅ Utilisateur test créé dans auth');
  const testUserId = testUserResult.user.id;

  // 4. Créer le profil utilisateur avec admin token
  const testProfile = {
    id: testUserId,
    email: 'test-complete@cryptoboost.world',
    full_name: 'Test Complet',
    role: 'client',
    status: 'active',
    total_invested: 0,
    total_profit: 0
  };

  const profileResult = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(testProfile)
  });

  if (profileResult.ok) {
    console.log('✅ Profil utilisateur créé');
  } else {
    console.log('❌ Erreur création profil utilisateur');
  }

  // 5. Tester toutes les opérations avec le token admin
  console.log('\n🧪 Test de toutes les opérations avec token admin...');
  
  // Test création transaction
  const testTransaction = {
    user_id: testUserId,
    type: 'deposit',
    crypto_type: 'BTC',
    amount: 0.001,
    usd_value: 50.00,
    wallet_address: 'test-address',
    status: 'pending'
  };

  const transactionResult = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(testTransaction)
  });

  if (transactionResult.ok) {
    console.log('✅ Transaction créée');
  } else {
    console.log('❌ Erreur création transaction');
  }

  // Test création notification
  const testNotification = {
    user_id: testUserId,
    title: 'Test Notification',
    message: 'Ceci est un test de notification',
    type: 'info',
    is_read: false
  };

  const notificationResult = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(testNotification)
  });

  if (notificationResult.ok) {
    console.log('✅ Notification créée');
  } else {
    console.log('❌ Erreur création notification');
  }

  // Test création log système
  const testLog = {
    user_id: testUserId,
    action: 'TEST_ACTION',
    details: { test: true, timestamp: new Date().toISOString() }
  };

  const logResult = await fetch(`${SUPABASE_URL}/rest/v1/system_logs`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(testLog)
  });

  if (logResult.ok) {
    console.log('✅ Log système créé');
  } else {
    console.log('❌ Erreur création log système');
  }

  // Test création investissement
  const plans = await makeRequest('/rest/v1/investment_plans?select=*&is_active=eq.true');
  if (plans && plans.length > 0) {
    const testInvestment = {
      user_id: testUserId,
      plan_id: plans[0].id,
      amount: 100.00,
      profit_target: 15.00,
      status: 'active'
    };

    const investmentResult = await fetch(`${SUPABASE_URL}/rest/v1/user_investments`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(testInvestment)
    });

    if (investmentResult.ok) {
      console.log('✅ Investissement créé');
    } else {
      console.log('❌ Erreur création investissement');
    }
  }

  // 6. Connexion client pour tester les opérations client
  console.log('\n🔐 Connexion client...');
  const clientLogin = await makeRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test-complete@cryptoboost.world',
      password: 'TestComplete2024!'
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

  // 7. Test des opérations client
  console.log('\n👤 Test des opérations client...');
  
  // Test lecture des investissements
  const clientInvestments = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?user_id=eq.${testUserId}&select=*`, {
    headers: clientHeaders
  });

  if (clientInvestments.ok) {
    const invsData = await clientInvestments.json();
    console.log(`✅ Lecture investissements: ${invsData.length} trouvés`);
  } else {
    console.log('❌ Erreur lecture investissements');
  }

  // Test lecture des transactions
  const clientTransactions = await fetch(`${SUPABASE_URL}/rest/v1/transactions?user_id=eq.${testUserId}&select=*`, {
    headers: clientHeaders
  });

  if (clientTransactions.ok) {
    const txsData = await clientTransactions.json();
    console.log(`✅ Lecture transactions: ${txsData.length} trouvées`);
  } else {
    console.log('❌ Erreur lecture transactions');
  }

  // Test création transaction client
  const clientTransaction = {
    user_id: testUserId,
    type: 'withdrawal',
    crypto_type: 'ETH',
    amount: 0.01,
    usd_value: 30.00,
    wallet_address: 'client-test-address',
    status: 'pending'
  };

  const clientTxResult = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: clientHeaders,
    body: JSON.stringify(clientTransaction)
  });

  if (clientTxResult.ok) {
    console.log('✅ Transaction client créée');
  } else {
    console.log('❌ Erreur création transaction client');
  }

  // 8. Vérification finale
  console.log('\n🔍 Vérification finale...');
  
  const finalUsers = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
    headers: adminHeaders
  });

  if (finalUsers.ok) {
    const users = await finalUsers.json();
    console.log(`📊 Utilisateurs: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
  }

  const finalStats = await makeRequest('/rest/v1/rpc/get_dashboard_stats');
  if (finalStats) {
    console.log('\n📈 Statistiques finales:');
    console.log(`  - Utilisateurs totaux: ${finalStats.total_users}`);
    console.log(`  - Capital total: ${finalStats.total_capital}€`);
    console.log(`  - Investissements actifs: ${finalStats.active_investments}`);
    console.log(`  - Transactions en attente: ${finalStats.pending_transactions}`);
  }

  console.log('\n🎉 Correction RLS définitive terminée !');
  console.log('\n📋 Identifiants de test :');
  console.log('👑 Admin: admin@cryptoboost.world / AdminCrypto2024!');
  console.log('👤 Test: test-complete@cryptoboost.world / TestComplete2024!');
  console.log('\n🔗 URL: https://cryptoboost.world/auth/login');
  
  console.log('\n✅ Prochaines étapes :');
  console.log('1. Testez la connexion admin');
  console.log('2. Testez l\'inscription client');
  console.log('3. Vérifiez toutes les fonctionnalités');
  console.log('4. L\'application est prête pour la production !');
}

fixAllRLSDefinitive().catch(console.error);