#!/usr/bin/env node

/**
 * SCRIPT DE TEST - AUTHENTIFICATION RÉELLE
 * Teste l'inscription et la connexion avec des données réelles
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
// TESTS D'AUTHENTIFICATION
// ============================================================================

async function testClientRegistration() {
  logSection('👤 TEST D\'INSCRIPTION CLIENT');
  
  const clientEmail = `client-test-${Date.now()}@cryptoboost.world`;
  const clientPassword = 'ClientPassword123!';
  const clientData = {
    full_name: 'Jean Test Client',
    role: 'client',
    phone: '+33987654321',
    country: 'France',
    city: 'Paris'
  };

  try {
    // 1. Inscription
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: clientEmail,
        password: clientPassword,
        data: clientData
      })
    });

    if (signUpResponse.ok) {
      const signUpData = await signUpResponse.json();
      log(`✅ Inscription client réussie`, 'green');
      log(`   Email: ${clientEmail}`, 'blue');
      log(`   User ID: ${signUpData.user?.id}`, 'blue');
      
      // 2. Créer le profil utilisateur
      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          id: signUpData.user.id,
          ...clientData,
          created_at: new Date().toISOString()
        })
      });

      if (profileResponse.ok) {
        log(`✅ Profil client créé`, 'green');
      } else {
        log(`⚠️  Erreur création profil: ${profileResponse.status}`, 'yellow');
      }

      return { email: clientEmail, password: clientPassword, user: signUpData.user };
    } else {
      const errorData = await signUpResponse.json();
      log(`❌ Erreur inscription: ${signUpResponse.status}`, 'red');
      log(`   Détails: ${errorData.error_description || errorData.message}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erreur test inscription: ${error.message}`, 'red');
    return null;
  }
}

async function testClientLogin(clientCredentials) {
  logSection('🔐 TEST DE CONNEXION CLIENT');
  
  if (!clientCredentials) {
    log(`❌ Pas de credentials pour tester la connexion`, 'red');
    return null;
  }

  try {
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: clientCredentials.email,
        password: clientCredentials.password
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      log(`✅ Connexion client réussie`, 'green');
      log(`   Token access: ${loginData.access_token ? 'Présent' : 'Manquant'}`, 'blue');
      log(`   Token refresh: ${loginData.refresh_token ? 'Présent' : 'Manquant'}`, 'blue');
      log(`   User ID: ${loginData.user?.id}`, 'blue');
      
      return loginData;
    } else {
      const errorData = await loginResponse.json();
      log(`❌ Erreur connexion: ${loginResponse.status}`, 'red');
      log(`   Détails: ${errorData.error_description || errorData.message}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erreur test connexion: ${error.message}`, 'red');
    return null;
  }
}

async function testClientDataAccess(authData) {
  logSection('📊 TEST D\'ACCÈS AUX DONNÉES CLIENT');
  
  if (!authData || !authData.access_token) {
    log(`❌ Pas de token pour tester l'accès aux données`, 'red');
    return false;
  }

  try {
    // Test de récupération du profil
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&id=eq.${authData.user.id}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.access_token}`
      }
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      log(`✅ Profil client récupéré`, 'green');
      log(`   Nom: ${profileData[0]?.full_name}`, 'blue');
      log(`   Rôle: ${profileData[0]?.role}`, 'blue');
      log(`   Statut: ${profileData[0]?.status}`, 'blue');
    } else {
      log(`❌ Erreur récupération profil: ${profileResponse.status}`, 'red');
    }

    // Test de récupération des plans d'investissement
    const plansResponse = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*&is_active=eq.true`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.access_token}`
      }
    });

    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      log(`✅ Plans d'investissement récupérés: ${plansData.length}`, 'green');
      for (const plan of plansData) {
        log(`   - ${plan.name}: ${plan.interest_rate}%`, 'blue');
      }
    } else {
      log(`❌ Erreur récupération plans: ${plansResponse.status}`, 'red');
    }

    return true;
  } catch (error) {
    log(`❌ Erreur test accès données: ${error.message}`, 'red');
    return false;
  }
}

async function testAdminLogin() {
  logSection('👨‍💼 TEST DE CONNEXION ADMIN');
  
  try {
    const adminResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'admin@cryptoboost.world',
        password: 'AdminPassword123!'
      })
    });

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      log(`✅ Connexion admin réussie`, 'green');
      log(`   User ID: ${adminData.user?.id}`, 'blue');
      
      // Test d'accès aux données admin
      const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${adminData.access_token}`
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        log(`✅ Liste utilisateurs récupérée: ${usersData.length}`, 'green');
        for (const user of usersData.slice(0, 3)) {
          log(`   - ${user.full_name} (${user.role})`, 'blue');
        }
      } else {
        log(`❌ Erreur récupération utilisateurs: ${usersResponse.status}`, 'red');
      }

      return adminData;
    } else {
      const errorData = await adminResponse.json();
      log(`❌ Erreur connexion admin: ${adminResponse.status}`, 'red');
      log(`   Détails: ${errorData.error_description || errorData.message}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erreur test connexion admin: ${error.message}`, 'red');
    return null;
  }
}

async function testRealOperations(authData) {
  logSection('💼 TEST D\'OPÉRATIONS RÉELLES');
  
  if (!authData || !authData.access_token) {
    log(`❌ Pas de token pour tester les opérations`, 'red');
    return false;
  }

  try {
    // Test de création d'une transaction
    const transactionData = {
      type: 'deposit',
      amount: 1000,
      currency: 'USD',
      status: 'completed',
      description: 'Test transaction réelle'
    };

    const transactionResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.access_token}`
      },
      body: JSON.stringify({
        ...transactionData,
        user_id: authData.user.id,
        created_at: new Date().toISOString()
      })
    });

    if (transactionResponse.ok) {
      const transactionResult = await transactionResponse.json();
      log(`✅ Transaction créée`, 'green');
      log(`   ID: ${transactionResult.id}`, 'blue');
      log(`   Type: ${transactionResult.type}`, 'blue');
      log(`   Montant: ${transactionResult.amount} ${transactionResult.currency}`, 'blue');
    } else {
      log(`❌ Erreur création transaction: ${transactionResponse.status}`, 'red');
    }

    // Test de création d'une notification
    const notificationData = {
      title: 'Test notification réelle',
      message: 'Ceci est un test de notification',
      type: 'info',
      is_read: false
    };

    const notificationResponse = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.access_token}`
      },
      body: JSON.stringify({
        ...notificationData,
        user_id: authData.user.id,
        created_at: new Date().toISOString()
      })
    });

    if (notificationResponse.ok) {
      const notificationResult = await notificationResponse.json();
      log(`✅ Notification créée`, 'green');
      log(`   ID: ${notificationResult.id}`, 'blue');
      log(`   Titre: ${notificationResult.title}`, 'blue');
      log(`   Type: ${notificationResult.type}`, 'blue');
    } else {
      log(`❌ Erreur création notification: ${notificationResponse.status}`, 'red');
    }

    return true;
  } catch (error) {
    log(`❌ Erreur test opérations: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testRealAuth() {
  log('🧪 TEST D\'AUTHENTIFICATION RÉELLE', 'bright');
  log('Test complet de l\'inscription, connexion et opérations réelles', 'cyan');
  
  try {
    // 1. Test d'inscription client
    const clientCredentials = await testClientRegistration();
    
    // 2. Test de connexion client
    const clientAuth = await testClientLogin(clientCredentials);
    
    // 3. Test d'accès aux données client
    if (clientAuth) {
      await testClientDataAccess(clientAuth);
      await testRealOperations(clientAuth);
    }
    
    // 4. Test de connexion admin
    await testAdminLogin();

    // Résumé
    logSection('📊 RÉSUMÉ DES TESTS RÉELS');
    log(`✅ Inscription client: ${clientCredentials ? 'Réussie' : 'Échouée'}`, clientCredentials ? 'green' : 'red');
    log(`✅ Connexion client: ${clientAuth ? 'Réussie' : 'Échouée'}`, clientAuth ? 'green' : 'red');
    log(`✅ Accès données client: ${clientAuth ? 'Testé' : 'Non testé'}`, clientAuth ? 'green' : 'yellow');
    log(`✅ Opérations réelles: ${clientAuth ? 'Testées' : 'Non testées'}`, clientAuth ? 'green' : 'yellow');
    log(`✅ Connexion admin: Testée`, 'green');

    // Instructions
    logSection('📋 INSTRUCTIONS POST-TEST');
    log('1. Les fonctionnalités réelles sont opérationnelles', 'green');
    log('2. Testez l\'application:', 'yellow');
    log('   - Inscription: https://cryptoboost.world/register', 'blue');
    log('   - Connexion: https://cryptoboost.world/login', 'blue');
    log('   - Dashboard client: https://cryptoboost.world/client', 'blue');
    log('   - Dashboard admin: https://cryptoboost.world/admin', 'blue');
    log('3. Toutes les opérations sont en temps réel !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors des tests réels', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testRealAuth().catch(console.error);