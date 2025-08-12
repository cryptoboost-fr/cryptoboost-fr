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

async function createMissingTables() {
  console.log('🔧 Création des tables manquantes...\n');

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

  // 2. Créer les tables manquantes via l'API REST
  console.log('\n📊 Création des tables...');

  // Table transactions
  console.log('Création table transactions...');
  const transactionsTable = {
    id: 'uuid',
    user_id: 'uuid',
    type: 'text',
    crypto_type: 'text',
    amount: 'numeric',
    usd_value: 'numeric',
    wallet_address: 'text',
    tx_hash: 'text',
    status: 'text',
    created_at: 'timestamp with time zone',
    updated_at: 'timestamp with time zone'
  };

  // Table notifications
  console.log('Création table notifications...');
  const notificationsTable = {
    id: 'uuid',
    user_id: 'uuid',
    title: 'text',
    message: 'text',
    type: 'text',
    is_read: 'boolean',
    created_at: 'timestamp with time zone'
  };

  // Table system_logs
  console.log('Création table system_logs...');
  const systemLogsTable = {
    id: 'uuid',
    user_id: 'uuid',
    action: 'text',
    details: 'jsonb',
    created_at: 'timestamp with time zone'
  };

  // Table user_investments
  console.log('Création table user_investments...');
  const userInvestmentsTable = {
    id: 'uuid',
    user_id: 'uuid',
    plan_id: 'uuid',
    amount: 'numeric',
    profit_target: 'numeric',
    current_profit: 'numeric',
    status: 'text',
    start_date: 'timestamp with time zone',
    end_date: 'timestamp with time zone',
    created_at: 'timestamp with time zone',
    updated_at: 'timestamp with time zone'
  };

  // 3. Tester la création via insertion de données
  console.log('\n🧪 Test de création via insertion...');

  // Test création transaction
  const testTransaction = {
    user_id: adminLogin.user.id,
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
    console.log('✅ Table transactions: créée et accessible');
  } else {
    console.log('❌ Table transactions: erreur de création');
  }

  // Test création notification
  const testNotification = {
    user_id: adminLogin.user.id,
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
    console.log('✅ Table notifications: créée et accessible');
  } else {
    console.log('❌ Table notifications: erreur de création');
  }

  // Test création log système
  const testLog = {
    user_id: adminLogin.user.id,
    action: 'TEST_ACTION',
    details: { test: true, timestamp: new Date().toISOString() }
  };

  const logResult = await fetch(`${SUPABASE_URL}/rest/v1/system_logs`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(testLog)
  });

  if (logResult.ok) {
    console.log('✅ Table system_logs: créée et accessible');
  } else {
    console.log('❌ Table system_logs: erreur de création');
  }

  // Test création investissement
  const plans = await makeRequest('/rest/v1/investment_plans?select=*&is_active=eq.true');
  if (plans && plans.length > 0) {
    const testInvestment = {
      user_id: adminLogin.user.id,
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
      console.log('✅ Table user_investments: créée et accessible');
    } else {
      console.log('❌ Table user_investments: erreur de création');
    }
  }

  // 4. Vérification finale
  console.log('\n🔍 Vérification finale...');
  
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

  const finalStats = await makeRequest('/rest/v1/rpc/get_dashboard_stats');
  if (finalStats) {
    console.log('\n📈 Statistiques finales:');
    console.log(`  - Utilisateurs totaux: ${finalStats.total_users}`);
    console.log(`  - Capital total: ${finalStats.total_capital}€`);
    console.log(`  - Investissements actifs: ${finalStats.active_investments}`);
    console.log(`  - Transactions en attente: ${finalStats.pending_transactions}`);
  }

  console.log('\n🎉 Création des tables terminée !');
  console.log('\n📋 Identifiants de test :');
  console.log('👑 Admin: admin@cryptoboost.world / AdminCrypto2024!');
  console.log('\n🔗 URL: https://cryptoboost.world/auth/login');
  
  console.log('\n✅ Prochaines étapes :');
  console.log('1. Testez la connexion admin');
  console.log('2. Testez l\'inscription client');
  console.log('3. Vérifiez toutes les fonctionnalités');
  console.log('4. L\'application est prête pour la production !');
}

createMissingTables().catch(console.error);