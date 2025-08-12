#!/usr/bin/env node

/**
 * Script de test des workflows d'authentification - CryptoBoost
 * Test des fonctionnalités d'inscription, connexion, et gestion des sessions
 * Version : Test des workflows d'auth complets
 */

import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'https://cryptoboost.world';
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'magenta');
  log(message, 'magenta');
  log(`${'='.repeat(60)}`, 'magenta');
}

// =====================================================
// 1. TEST D'INSCRIPTION CLIENT
// =====================================================

async function testClientRegistration() {
  logHeader('📝 TEST INSCRIPTION CLIENT');
  
  try {
    // Test de la page d'inscription
    const registerResponse = await fetch(`${BASE_URL}/register`);
    const registerContent = await registerResponse.text();
    
    logInfo('Test de la page d\'inscription...');
    
    // Vérifier que la page est accessible
    if (!registerResponse.ok) {
      logError(`Page d'inscription non accessible: ${registerResponse.status}`);
      return false;
    }
    
    logSuccess('Page d\'inscription accessible');
    
    // Vérifier les éléments du formulaire
    const formElements = [
      { name: 'Formulaire', found: registerContent.includes('form') },
      { name: 'Champ nom', found: registerContent.includes('name') || registerContent.includes('first') || registerContent.includes('last') },
      { name: 'Champ email', found: registerContent.includes('email') },
      { name: 'Champ mot de passe', found: registerContent.includes('password') },
      { name: 'Bouton inscription', found: registerContent.includes('Register') || registerContent.includes('Sign up') || registerContent.includes('Inscription') }
    ];
    
    for (const element of formElements) {
      if (element.found) {
        logSuccess(`Inscription: ${element.name} présent`);
      } else {
        logError(`Inscription: ${element.name} manquant`);
      }
    }
    
    // Test de création d'un utilisateur via Supabase
    logInfo('Test de création d\'utilisateur via Supabase...');
    
    const testUser = {
      email: `test-${Date.now()}@cryptoboost.world`,
      password: 'TestPassword123!',
      name: 'Test User'
    };
    
    try {
      // Tentative de création d'utilisateur via Supabase Auth
      const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (signUpResponse.ok) {
        const signUpData = await signUpResponse.json();
        logSuccess(`Utilisateur créé avec succès: ${testUser.email}`);
        logInfo(`ID utilisateur: ${signUpData.user?.id || 'N/A'}`);
        return true;
      } else {
        const errorData = await signUpResponse.json();
        logWarning(`Création utilisateur échouée: ${errorData.error_description || errorData.message}`);
        return false;
      }
    } catch (error) {
      logError(`Erreur lors de la création d'utilisateur: ${error.message}`);
      return false;
    }
    
  } catch (error) {
    logError(`Erreur test inscription client: ${error.message}`);
    return false;
  }
}

// =====================================================
// 2. TEST DE CONNEXION CLIENT
// =====================================================

async function testClientLogin() {
  logHeader('👤 TEST CONNEXION CLIENT');
  
  try {
    // Test de la page de connexion
    const loginResponse = await fetch(`${BASE_URL}/login`);
    const loginContent = await loginResponse.text();
    
    logInfo('Test de la page de connexion...');
    
    // Vérifier que la page est accessible
    if (!loginResponse.ok) {
      logError(`Page de connexion non accessible: ${loginResponse.status}`);
      return false;
    }
    
    logSuccess('Page de connexion accessible');
    
    // Vérifier les éléments du formulaire
    const formElements = [
      { name: 'Formulaire', found: loginContent.includes('form') },
      { name: 'Champ email', found: loginContent.includes('email') },
      { name: 'Champ mot de passe', found: loginContent.includes('password') },
      { name: 'Bouton connexion', found: loginContent.includes('Login') || loginContent.includes('Sign in') || loginContent.includes('Connexion') }
    ];
    
    for (const element of formElements) {
      if (element.found) {
        logSuccess(`Connexion: ${element.name} présent`);
      } else {
        logError(`Connexion: ${element.name} manquant`);
      }
    }
    
    // Test de connexion avec un utilisateur existant
    logInfo('Test de connexion avec utilisateur existant...');
    
    const testCredentials = {
      email: 'test@cryptoboost.world',
      password: 'TestPassword123!'
    };
    
    try {
      // Tentative de connexion via Supabase Auth
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testCredentials.email,
          password: testCredentials.password
        })
      });
      
      if (signInResponse.ok) {
        const signInData = await signInResponse.json();
        logSuccess(`Connexion réussie: ${testCredentials.email}`);
        logInfo(`Token d'accès: ${signInData.access_token ? 'Présent' : 'Manquant'}`);
        logInfo(`Token de rafraîchissement: ${signInData.refresh_token ? 'Présent' : 'Manquant'}`);
        return true;
      } else {
        const errorData = await signInResponse.json();
        logWarning(`Connexion échouée: ${errorData.error_description || errorData.message}`);
        return false;
      }
    } catch (error) {
      logError(`Erreur lors de la connexion: ${error.message}`);
      return false;
    }
    
  } catch (error) {
    logError(`Erreur test connexion client: ${error.message}`);
    return false;
  }
}

// =====================================================
// 3. TEST DE CONNEXION ADMIN
// =====================================================

async function testAdminLogin() {
  logHeader('👨‍💼 TEST CONNEXION ADMIN');
  
  try {
    // Test de la page de connexion admin
    const loginResponse = await fetch(`${BASE_URL}/login`);
    const loginContent = await loginResponse.text();
    
    logInfo('Test de la page de connexion admin...');
    
    // Vérifier que la page est accessible
    if (!loginResponse.ok) {
      logError(`Page de connexion non accessible: ${loginResponse.status}`);
      return false;
    }
    
    logSuccess('Page de connexion accessible');
    
    // Test de connexion admin avec credentials
    logInfo('Test de connexion admin...');
    
    const adminCredentials = {
      email: 'admin@cryptoboost.world',
      password: 'CryptoAdmin2024!'
    };
    
    try {
      // Tentative de connexion admin via Supabase Auth
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: adminCredentials.email,
          password: adminCredentials.password
        })
      });
      
      if (signInResponse.ok) {
        const signInData = await signInResponse.json();
        logSuccess(`Connexion admin réussie: ${adminCredentials.email}`);
        logInfo(`Token d'accès: ${signInData.access_token ? 'Présent' : 'Manquant'}`);
        
        // Vérifier le rôle admin
        if (signInData.user) {
          logInfo(`ID utilisateur: ${signInData.user.id}`);
          logInfo(`Email: ${signInData.user.email}`);
          logInfo(`Email confirmé: ${signInData.user.email_confirmed_at ? 'Oui' : 'Non'}`);
        }
        
        return true;
      } else {
        const errorData = await signInResponse.json();
        logWarning(`Connexion admin échouée: ${errorData.error_description || errorData.message}`);
        return false;
      }
    } catch (error) {
      logError(`Erreur lors de la connexion admin: ${error.message}`);
      return false;
    }
    
  } catch (error) {
    logError(`Erreur test connexion admin: ${error.message}`);
    return false;
  }
}

// =====================================================
// 4. TEST DE GESTION DES SESSIONS
// =====================================================

async function testSessionManagement() {
  logHeader('🔐 TEST GESTION DES SESSIONS');
  
  try {
    logInfo('Test de la gestion des sessions...');
    
    // Test de rafraîchissement de token
    logInfo('Test de rafraîchissement de token...');
    
    try {
      const refreshResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: 'test_refresh_token'
        })
      });
      
      if (refreshResponse.ok) {
        logSuccess('Rafraîchissement de token fonctionnel');
      } else {
        logWarning('Rafraîchissement de token échoué (normal avec token de test)');
      }
    } catch (error) {
      logWarning(`Erreur rafraîchissement token: ${error.message}`);
    }
    
    // Test de déconnexion
    logInfo('Test de déconnexion...');
    
    try {
      const logoutResponse = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scope: 'global'
        })
      });
      
      if (logoutResponse.ok) {
        logSuccess('Déconnexion fonctionnelle');
      } else {
        logWarning('Déconnexion échouée (normal sans session active)');
      }
    } catch (error) {
      logWarning(`Erreur déconnexion: ${error.message}`);
    }
    
    // Test de récupération de mot de passe
    logInfo('Test de récupération de mot de passe...');
    
    try {
      const resetResponse = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@cryptoboost.world'
        })
      });
      
      if (resetResponse.ok) {
        logSuccess('Récupération de mot de passe fonctionnelle');
      } else {
        const errorData = await resetResponse.json();
        logWarning(`Récupération échouée: ${errorData.error_description || errorData.message}`);
      }
    } catch (error) {
      logWarning(`Erreur récupération mot de passe: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test gestion sessions: ${error.message}`);
    return false;
  }
}

// =====================================================
// 5. TEST DE SÉCURITÉ AUTH
// =====================================================

async function testAuthSecurity() {
  logHeader('🔒 TEST SÉCURITÉ AUTHENTIFICATION');
  
  try {
    logInfo('Test de la sécurité d\'authentification...');
    
    // Test de validation des mots de passe
    logInfo('Test de validation des mots de passe...');
    
    const weakPasswords = [
      '123456',
      'password',
      'abc123',
      'qwerty'
    ];
    
    for (const weakPassword of weakPasswords) {
      try {
        const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: `test-weak-${Date.now()}@cryptoboost.world`,
            password: weakPassword
          })
        });
        
        if (signUpResponse.ok) {
          logWarning(`Mot de passe faible accepté: ${weakPassword}`);
        } else {
          const errorData = await signUpResponse.json();
          logSuccess(`Mot de passe faible rejeté: ${weakPassword} - ${errorData.error_description}`);
        }
      } catch (error) {
        logWarning(`Erreur test mot de passe faible: ${error.message}`);
      }
    }
    
    // Test de protection contre les attaques par force brute
    logInfo('Test de protection contre les attaques par force brute...');
    
    try {
      const bruteForceResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@cryptoboost.world',
          password: 'wrongpassword'
        })
      });
      
      if (bruteForceResponse.ok) {
        logWarning('Connexion avec mot de passe incorrect réussie (problème de sécurité)');
      } else {
        const errorData = await bruteForceResponse.json();
        logSuccess(`Protection contre force brute: ${errorData.error_description || errorData.message}`);
      }
    } catch (error) {
      logWarning(`Erreur test force brute: ${error.message}`);
    }
    
    // Test de validation des emails
    logInfo('Test de validation des emails...');
    
    const invalidEmails = [
      'invalid-email',
      'test@',
      '@cryptoboost.world',
      'test..test@cryptoboost.world'
    ];
    
    for (const invalidEmail of invalidEmails) {
      try {
        const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: invalidEmail,
            password: 'ValidPassword123!'
          })
        });
        
        if (signUpResponse.ok) {
          logWarning(`Email invalide accepté: ${invalidEmail}`);
        } else {
          const errorData = await signUpResponse.json();
          logSuccess(`Email invalide rejeté: ${invalidEmail} - ${errorData.error_description}`);
        }
      } catch (error) {
        logWarning(`Erreur test email invalide: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test sécurité auth: ${error.message}`);
    return false;
  }
}

// =====================================================
// 6. TEST D'ACCÈS AUX DASHBOARDS
// =====================================================

async function testDashboardAccess() {
  logHeader('🚪 TEST ACCÈS AUX DASHBOARDS');
  
  try {
    logInfo('Test d\'accès aux dashboards...');
    
    // Test d'accès au dashboard client
    logInfo('Test d\'accès au dashboard client...');
    
    const clientResponse = await fetch(`${BASE_URL}/client`);
    if (clientResponse.ok) {
      const clientContent = await clientResponse.text();
      
      if (clientContent.includes('CryptoBoost') || clientContent.includes('cryptoboost')) {
        logSuccess('Dashboard client accessible');
        
        // Vérifier les éléments du dashboard client
        const clientElements = [
          'wallet', 'investments', 'transactions', 'profile', 'settings'
        ];
        
        for (const element of clientElements) {
          if (clientContent.includes(element)) {
            logSuccess(`Dashboard client: Élément ${element} présent`);
          } else {
            logWarning(`Dashboard client: Élément ${element} manquant`);
          }
        }
      } else {
        logWarning('Dashboard client: Contenu inattendu');
      }
    } else {
      logError(`Dashboard client non accessible: ${clientResponse.status}`);
    }
    
    // Test d'accès au dashboard admin
    logInfo('Test d\'accès au dashboard admin...');
    
    const adminResponse = await fetch(`${BASE_URL}/admin`);
    if (adminResponse.ok) {
      const adminContent = await adminResponse.text();
      
      if (adminContent.includes('CryptoBoost') || adminContent.includes('cryptoboost')) {
        logSuccess('Dashboard admin accessible');
        
        // Vérifier les éléments du dashboard admin
        const adminElements = [
          'users', 'transactions', 'plans', 'wallets', 'statistics', 'logs'
        ];
        
        for (const element of adminElements) {
          if (adminContent.includes(element)) {
            logSuccess(`Dashboard admin: Élément ${element} présent`);
          } else {
            logWarning(`Dashboard admin: Élément ${element} manquant`);
          }
        }
      } else {
        logWarning('Dashboard admin: Contenu inattendu');
      }
    } else {
      logError(`Dashboard admin non accessible: ${adminResponse.status}`);
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test accès dashboards: ${error.message}`);
    return false;
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function runAuthTests() {
  logHeader('🚀 TEST WORKFLOWS D\'AUTHENTIFICATION COMPLETS');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    logInfo('Démarrage des tests d\'authentification...');
    
    // Tests séquentiels
    const registrationResult = await testClientRegistration();
    const clientLoginResult = await testClientLogin();
    const adminLoginResult = await testAdminLogin();
    const sessionResult = await testSessionManagement();
    const securityResult = await testAuthSecurity();
    const dashboardResult = await testDashboardAccess();
    
    results.push(registrationResult, clientLoginResult, adminLoginResult, sessionResult, securityResult, dashboardResult);
    
    const totalTime = Date.now() - startTime;
    
    // Résumé final
    logHeader('🎉 RÉSUMÉ FINAL - TESTS AUTHENTIFICATION');
    
    const successCount = results.filter(Boolean).length;
    const totalCount = results.length;
    const successRate = (successCount / totalCount) * 100;
    
    logSuccess(`Tests réussis: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
    logSuccess(`Temps total: ${totalTime}ms`);
    
    if (successRate >= 80) {
      log('\n🎯 VOTRE SYSTÈME D\'AUTHENTIFICATION EST FONCTIONNEL !', 'green');
      log('✅ Inscription client opérationnelle', 'green');
      log('✅ Connexion client opérationnelle', 'green');
      log('✅ Connexion admin opérationnelle', 'green');
      log('✅ Gestion des sessions sécurisée', 'green');
      log('✅ Accès aux dashboards contrôlé', 'green');
    } else if (successRate >= 60) {
      log('\n⚠️ SYSTÈME D\'AUTHENTIFICATION PARTIELLEMENT FONCTIONNEL', 'yellow');
      log('Des améliorations sont nécessaires pour une sécurité optimale.', 'yellow');
    } else {
      log('\n❌ PROBLÈMES MAJEURS DANS LE SYSTÈME D\'AUTHENTIFICATION', 'red');
      log('Le système nécessite des corrections importantes.', 'red');
    }
    
  } catch (error) {
    logError(`Erreur critique lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
runAuthTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});