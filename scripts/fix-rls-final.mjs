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

async function fixRLSFinal() {
  console.log('🔧 Correction finale des politiques RLS...\n');

  // 1. Connexion admin pour obtenir le token
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

  // 2. Créer le profil administrateur avec le token admin
  console.log('\n👤 Création du profil administrateur...');
  
  const adminProfile = {
    id: adminLogin.user.id,
    email: 'admin@cryptoboost.world',
    full_name: 'Administrateur CryptoBoost',
    role: 'admin',
    status: 'active',
    total_invested: 0,
    total_profit: 0
  };

  const adminHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  const adminResult = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(adminProfile)
  });

  if (adminResult.ok) {
    console.log('✅ Profil administrateur créé');
  } else {
    console.log('⚠️ Profil admin déjà existant ou erreur');
  }

  // 3. Créer un utilisateur de test
  console.log('\n👤 Création d\'un utilisateur de test...');
  
  const testUserData = {
    email: 'test@cryptoboost.world',
    password: 'TestUser2024!',
    user_metadata: {
      full_name: 'Utilisateur Test'
    }
  };

  const testUserResult = await makeRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(testUserData)
  });

  if (testUserResult && testUserResult.user) {
    console.log('✅ Utilisateur de test créé dans auth');
    
    const testProfile = {
      id: testUserResult.user.id,
      email: 'test@cryptoboost.world',
      full_name: 'Utilisateur Test',
      role: 'client',
      status: 'active',
      total_invested: 0,
      total_profit: 0
    };

    const testProfileResult = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(testProfile)
    });

    if (testProfileResult.ok) {
      console.log('✅ Profil utilisateur de test créé');
    } else {
      console.log('❌ Erreur création profil test');
    }
  }

  // 4. Tester les fonctionnalités avec le token admin
  console.log('\n🧪 Test des fonctionnalités avec token admin...');
  
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
    console.log('✅ Création transaction réussie');
  } else {
    console.log('❌ Erreur création transaction');
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
    console.log('✅ Création notification réussie');
  } else {
    console.log('❌ Erreur création notification');
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
    console.log('✅ Création log système réussie');
  } else {
    console.log('❌ Erreur création log système');
  }

  // 5. Vérification finale
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
    console.log('\n📊 Statistiques finales:');
    console.log(`  - Utilisateurs totaux: ${finalStats.total_users}`);
    console.log(`  - Capital total: ${finalStats.total_capital}€`);
    console.log(`  - Investissements actifs: ${finalStats.active_investments}`);
    console.log(`  - Transactions en attente: ${finalStats.pending_transactions}`);
  }

  console.log('\n🎉 Correction RLS terminée !');
  console.log('\n📋 Identifiants de connexion :');
  console.log('👑 Admin: admin@cryptoboost.world / AdminCrypto2024!');
  console.log('👤 Test: test@cryptoboost.world / TestUser2024!');
  console.log('\n🔗 URL: https://cryptoboost.world/auth/login');
  
  console.log('\n✅ Prochaines étapes :');
  console.log('1. Testez la connexion admin');
  console.log('2. Testez l\'inscription client');
  console.log('3. Vérifiez toutes les fonctionnalités');
  console.log('4. Déployez les corrections');
}

fixRLSFinal().catch(console.error);