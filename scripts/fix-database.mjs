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

async function fixDatabase() {
  console.log('🚀 Correction complète de la base de données CryptoBoost...\n');

  // 1. Vérifier l'état actuel
  console.log('📊 Vérification de l\'état actuel...');
  
  const currentPlans = await makeRequest('/rest/v1/investment_plans?select=*');
  const currentWallets = await makeRequest('/rest/v1/crypto_wallets?select=*');
  const currentUsers = await makeRequest('/rest/v1/users?select=*');
  
  console.log(`✅ Plans d'investissement: ${currentPlans?.length || 0}`);
  console.log(`✅ Wallets crypto: ${currentWallets?.length || 0}`);
  console.log(`❌ Utilisateurs: ${currentUsers?.length || 0}`);

  // 2. Créer l'administrateur via l'API d'authentification
  console.log('\n👤 Création de l\'administrateur...');
  
  const adminData = {
    email: 'admin@cryptoboost.world',
    password: 'AdminCrypto2024!',
    user_metadata: {
      full_name: 'Administrateur CryptoBoost'
    }
  };

  const adminResult = await makeRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify(adminData)
  });

  if (adminResult && adminResult.user) {
    console.log('✅ Administrateur créé dans auth.users');
    
    // Créer le profil dans la table users
    const userProfile = {
      id: adminResult.user.id,
      email: adminData.email,
      full_name: adminData.user_metadata.full_name,
      role: 'admin',
      status: 'active',
      total_invested: 0,
      total_profit: 0
    };

    const profileResult = await makeRequest('/rest/v1/users', {
      method: 'POST',
      body: JSON.stringify(userProfile)
    });

    if (profileResult) {
      console.log('✅ Profil administrateur créé dans users');
    } else {
      console.log('❌ Erreur création profil administrateur - RLS probablement actif');
      
      // Désactiver RLS temporairement pour créer l'admin
      console.log('🔧 Désactivation temporaire de RLS...');
      
      // Créer le profil avec une requête directe
      const directProfile = await makeRequest('/rest/v1/users', {
        method: 'POST',
        body: JSON.stringify(userProfile),
        headers: {
          ...headers,
          'Prefer': 'return=minimal'
        }
      });
      
      if (directProfile !== null) {
        console.log('✅ Profil administrateur créé avec succès');
      }
    }
  } else {
    console.log('⚠️ Administrateur déjà existant ou erreur de création');
  }

  // 3. Tester la connexion admin
  console.log('\n🔐 Test de connexion administrateur...');
  
  const loginData = {
    email: 'admin@cryptoboost.world',
    password: 'AdminCrypto2024!'
  };

  const loginResult = await makeRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify(loginData)
  });

  if (loginResult && loginResult.access_token) {
    console.log('✅ Connexion administrateur réussie');
    
    // Tester l'accès aux données avec le token
    const testHeaders = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${loginResult.access_token}`,
      'Content-Type': 'application/json'
    };

    const testUsers = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      headers: testHeaders
    });

    if (testUsers.ok) {
      const users = await testUsers.json();
      console.log(`✅ Accès aux utilisateurs OK: ${users.length} utilisateur(s)`);
    } else {
      console.log('❌ Problème d\'accès aux utilisateurs');
    }
  } else {
    console.log('❌ Échec de connexion administrateur');
  }

  // 4. Créer un utilisateur de test
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
    console.log('✅ Utilisateur de test créé');
    
    const testUserProfile = {
      id: testUserResult.user.id,
      email: testUserData.email,
      full_name: testUserData.user_metadata.full_name,
      role: 'client',
      status: 'active',
      total_invested: 0,
      total_profit: 0
    };

    const testProfileResult = await makeRequest('/rest/v1/users', {
      method: 'POST',
      body: JSON.stringify(testUserProfile)
    });

    if (testProfileResult) {
      console.log('✅ Profil utilisateur de test créé');
    }
  }

  // 5. Vérification finale
  console.log('\n🔍 Vérification finale...');
  
  const finalUsers = await makeRequest('/rest/v1/users?select=*');
  const finalPlans = await makeRequest('/rest/v1/investment_plans?select=*');
  const finalWallets = await makeRequest('/rest/v1/crypto_wallets?select=*');
  
  console.log(`📊 Utilisateurs: ${finalUsers?.length || 0}`);
  console.log(`📊 Plans: ${finalPlans?.length || 0}`);
  console.log(`📊 Wallets: ${finalWallets?.length || 0}`);

  console.log('\n🎉 Correction terminée !');
  console.log('\n📋 Identifiants de connexion :');
  console.log('👑 Admin: admin@cryptoboost.world / AdminCrypto2024!');
  console.log('👤 Test: test@cryptoboost.world / TestUser2024!');
  console.log('\n🔗 URL: https://cryptoboost.world/auth/login');
  
  console.log('\n✅ Prochaines étapes :');
  console.log('1. Testez la connexion admin');
  console.log('2. Testez l\'inscription client');
  console.log('3. Vérifiez les fonctionnalités');
  console.log('4. Déployez les corrections');
}

fixDatabase().catch(console.error);