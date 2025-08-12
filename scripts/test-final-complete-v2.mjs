#!/usr/bin/env node

/**
 * Script de test final V2 pour CryptoBoost
 * Test complet de toutes les fonctionnalités après réparations
 */

const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg';

console.log('🚀 DÉBUT DU TEST FINAL V2 - CRYPTOBOOST');
console.log('=====================================\n');

// Headers pour les requêtes
const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

// Variables globales
let adminUserId = null;
let adminToken = null;
let clientUserId = null;
let clientToken = null;

// =====================================================
// 1. TEST DE CONNEXION ADMIN
// =====================================================

async function testAdminLogin() {
  console.log('🔐 1. Test de connexion admin...');
  
  try {
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'admin@cryptoboost.world',
        password: 'Admin123!'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      adminToken = loginData.access_token;
      adminUserId = loginData.user.id;
      
      console.log('✅ Connexion admin réussie');
      console.log(`   - User ID: ${adminUserId}`);
      console.log(`   - Token: ${adminToken.substring(0, 20)}...`);
    } else {
      console.log('❌ Échec de la connexion admin');
      const errorData = await loginResponse.json();
      console.log(`   - Erreur: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.log('❌ Erreur lors de la connexion admin:', error.message);
  }
}

// =====================================================
// 2. TEST DES FONCTIONNALITÉS ADMIN
// =====================================================

async function testAdminFeatures() {
  console.log('\n👨‍💼 2. Test des fonctionnalités admin...');
  
  if (!adminToken) {
    console.log('❌ Token admin manquant, impossible de tester');
    return;
  }

  const adminHeaders = {
    ...headers,
    'Authorization': `Bearer ${adminToken}`
  };

  // 2.1 Test Dashboard Stats
  console.log('\n📊 2.1 Test Dashboard Stats...');
  try {
    const statsResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_stats`, {
      method: 'POST',
      headers: adminHeaders
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Dashboard stats récupérées:', stats);
    } else {
      console.log('❌ Erreur récupération dashboard stats');
    }
  } catch (error) {
    console.log('❌ Erreur dashboard stats:', error.message);
  }

  // 2.2 Test Gestion Utilisateurs
  console.log('\n👥 2.2 Test Gestion Utilisateurs...');
  try {
    const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&limit=10`, {
      headers: adminHeaders
    });
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log(`✅ Gestion utilisateurs - ${users.length} utilisateurs récupérés`);
    } else {
      console.log('❌ Erreur récupération utilisateurs');
    }
  } catch (error) {
    console.log('❌ Erreur gestion utilisateurs:', error.message);
  }

  // 2.3 Test Gestion Transactions
  console.log('\n💳 2.3 Test Gestion Transactions...');
  try {
    const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*&limit=10`, {
      headers: adminHeaders
    });
    
    if (transactionsResponse.ok) {
      const transactions = await transactionsResponse.json();
      console.log(`✅ Gestion transactions - ${transactions.length} transactions récupérées`);
      
      // Test création transaction
      const testTransaction = {
        user_id: adminUserId,
        type: 'admin_test',
        amount: 1000,
        currency: 'EUR',
        status: 'pending',
        description: 'Transaction de test admin'
      };

      const createTransactionResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(testTransaction)
      });

      if (createTransactionResponse.ok) {
        console.log('✅ Transaction de test créée avec succès');
      } else {
        console.log('❌ Erreur création transaction de test');
      }
    } else {
      console.log('❌ Erreur récupération transactions');
    }
  } catch (error) {
    console.log('❌ Erreur gestion transactions:', error.message);
  }

  // 2.4 Test Gestion Investissements
  console.log('\n💰 2.4 Test Gestion Investissements...');
  try {
    const investmentsResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?select=*&limit=10`, {
      headers: adminHeaders
    });
    
    if (investmentsResponse.ok) {
      const investments = await investmentsResponse.json();
      console.log(`✅ Gestion investissements - ${investments.length} investissements récupérés`);
    } else {
      console.log('❌ Erreur récupération investissements');
    }
  } catch (error) {
    console.log('❌ Erreur gestion investissements:', error.message);
  }

  // 2.5 Test System Logs
  console.log('\n📝 2.5 Test System Logs...');
  try {
    const logsResponse = await fetch(`${SUPABASE_URL}/rest/v1/system_logs?select=*&limit=10`, {
      headers: adminHeaders
    });
    
    if (logsResponse.ok) {
      const logs = await logsResponse.json();
      console.log(`✅ System logs - ${logs.length} logs récupérés`);
    } else {
      console.log('❌ Erreur récupération system logs');
    }
  } catch (error) {
    console.log('❌ Erreur system logs:', error.message);
  }

  // 2.6 Test System Settings
  console.log('\n⚙️ 2.6 Test System Settings...');
  try {
    const settingsResponse = await fetch(`${SUPABASE_URL}/rest/v1/system_settings?select=*`, {
      headers: adminHeaders
    });
    
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      console.log(`✅ System settings - ${settings.length} paramètres récupérés`);
    } else {
      console.log('❌ Erreur récupération system settings');
    }
  } catch (error) {
    console.log('❌ Erreur system settings:', error.message);
  }
}

// =====================================================
// 3. TEST DE CRÉATION ET CONNEXION CLIENT
// =====================================================

async function testClientCreation() {
  console.log('\n👤 3. Test de création et connexion client...');
  
  const testEmail = `test-client-${Date.now()}@cryptoboost.world`;
  const testPassword = 'Client123!';

  try {
    // Création du compte client
    const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      clientUserId = signupData.user.id;
      console.log('✅ Compte client créé:', clientUserId);
      
      // Connexion du client
      const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        clientToken = loginData.access_token;
        console.log('✅ Connexion client réussie');
        console.log(`   - Token: ${clientToken.substring(0, 20)}...`);
      } else {
        console.log('❌ Échec de la connexion client');
      }
    } else {
      console.log('❌ Échec de la création du compte client');
    }
  } catch (error) {
    console.log('❌ Erreur création/connexion client:', error.message);
  }
}

// =====================================================
// 4. TEST DES FONCTIONNALITÉS CLIENT
// =====================================================

async function testClientFeatures() {
  console.log('\n👤 4. Test des fonctionnalités client...');
  
  if (!clientToken) {
    console.log('❌ Token client manquant, impossible de tester');
    return;
  }

  const clientHeaders = {
    ...headers,
    'Authorization': `Bearer ${clientToken}`
  };

  // 4.1 Test Profil Client
  console.log('\n👤 4.1 Test Profil Client...');
  try {
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&id=eq.${clientUserId}`, {
      headers: clientHeaders
    });
    
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log('✅ Profil client récupéré:', profile[0] ? 'OK' : 'Non trouvé');
    } else {
      console.log('❌ Erreur récupération profil client');
    }
  } catch (error) {
    console.log('❌ Erreur profil client:', error.message);
  }

  // 4.2 Test Transactions Client
  console.log('\n💳 4.2 Test Transactions Client...');
  try {
    const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*&user_id=eq.${clientUserId}`, {
      headers: clientHeaders
    });
    
    if (transactionsResponse.ok) {
      const transactions = await transactionsResponse.json();
      console.log(`✅ Transactions client - ${transactions.length} transactions récupérées`);
      
      // Test création transaction client
      const testTransaction = {
        user_id: clientUserId,
        type: 'client_test',
        amount: 500,
        currency: 'EUR',
        status: 'pending',
        description: 'Transaction de test client'
      };

      const createTransactionResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
        method: 'POST',
        headers: clientHeaders,
        body: JSON.stringify(testTransaction)
      });

      if (createTransactionResponse.ok) {
        console.log('✅ Transaction client créée avec succès');
      } else {
        console.log('❌ Erreur création transaction client');
      }
    } else {
      console.log('❌ Erreur récupération transactions client');
    }
  } catch (error) {
    console.log('❌ Erreur transactions client:', error.message);
  }

  // 4.3 Test Investissements Client
  console.log('\n💰 4.3 Test Investissements Client...');
  try {
    const investmentsResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?select=*&user_id=eq.${clientUserId}`, {
      headers: clientHeaders
    });
    
    if (investmentsResponse.ok) {
      const investments = await investmentsResponse.json();
      console.log(`✅ Investissements client - ${investments.length} investissements récupérés`);
    } else {
      console.log('❌ Erreur récupération investissements client');
    }
  } catch (error) {
    console.log('❌ Erreur investissements client:', error.message);
  }

  // 4.4 Test Notifications Client
  console.log('\n🔔 4.4 Test Notifications Client...');
  try {
    const notificationsResponse = await fetch(`${SUPABASE_URL}/rest/v1/notifications?select=*&user_id=eq.${clientUserId}`, {
      headers: clientHeaders
    });
    
    if (notificationsResponse.ok) {
      const notifications = await notificationsResponse.json();
      console.log(`✅ Notifications client - ${notifications.length} notifications récupérées`);
    } else {
      console.log('❌ Erreur récupération notifications client');
    }
  } catch (error) {
    console.log('❌ Erreur notifications client:', error.message);
  }
}

// =====================================================
// 5. TEST DES PAGES PUBLIQUES
// =====================================================

async function testPublicPages() {
  console.log('\n🌐 5. Test des pages publiques...');
  
  const publicPages = [
    'https://cryptoboost.world/',
    'https://cryptoboost.world/api',
    'https://cryptoboost.world/help',
    'https://cryptoboost.world/faq',
    'https://cryptoboost.world/status',
    'https://cryptoboost.world/blog',
    'https://cryptoboost.world/careers',
    'https://cryptoboost.world/press',
    'https://cryptoboost.world/terms',
    'https://cryptoboost.world/privacy',
    'https://cryptoboost.world/cookies',
    'https://cryptoboost.world/licenses'
  ];

  for (const page of publicPages) {
    try {
      const response = await fetch(page);
      if (response.ok) {
        console.log(`✅ ${page} - Accessible (${response.status})`);
      } else {
        console.log(`❌ ${page} - Erreur ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - Erreur: ${error.message}`);
    }
  }
}

// =====================================================
// 6. TEST DE L'API COINAPI
// =====================================================

async function testCoinAPI() {
  console.log('\n🪙 6. Test de l\'API CoinAPI...');
  
  try {
    const response = await fetch('https://rest.coinapi.io/v1/exchangerate/BTC/EUR', {
      headers: {
        'X-CoinAPI-Key': 'YOUR_API_KEY' // Remplacez par votre clé API
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CoinAPI - Prix BTC/EUR récupéré:', data.rate);
    } else {
      console.log('❌ CoinAPI - Erreur de récupération des prix');
    }
  } catch (error) {
    console.log('❌ CoinAPI - Erreur:', error.message);
  }
}

// =====================================================
// 7. FONCTION PRINCIPALE
// =====================================================

async function runAllTests() {
  try {
    // Tests séquentiels
    await testAdminLogin();
    await testAdminFeatures();
    await testClientCreation();
    await testClientFeatures();
    await testPublicPages();
    await testCoinAPI();
    
    console.log('\n🎉 TESTS TERMINÉS !');
    console.log('==================');
    console.log('✅ Tous les tests ont été exécutés');
    console.log('📊 Résumé des fonctionnalités testées:');
    console.log('   - Connexion admin');
    console.log('   - Fonctionnalités admin');
    console.log('   - Création/connexion client');
    console.log('   - Fonctionnalités client');
    console.log('   - Pages publiques');
    console.log('   - API CoinAPI');
    
  } catch (error) {
    console.log('❌ Erreur lors des tests:', error.message);
  }
}

// Exécution des tests
runAllTests();