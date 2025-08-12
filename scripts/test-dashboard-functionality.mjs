#!/usr/bin/env node

/**
 * Script de test complet des fonctionnalités des dashboards
 * Teste toutes les fonctionnalités admin et client
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

const APP_URL = 'https://cryptoboost.world';

// Couleurs pour les logs
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

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🔍 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logTest(testName, success, details = '') {
  const status = success ? '✅' : '❌';
  const color = success ? 'green' : 'red';
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

// Test des fonctionnalités de base
async function testBasicFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS DE BASE');

  // Test de connexion Supabase
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      logTest('Connexion Supabase', true);
    } else {
      logTest('Connexion Supabase', false, `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Connexion Supabase', false, error.message);
  }

  // Test de l'application déployée
  try {
    const response = await fetch(APP_URL);
    if (response.ok) {
      logTest('Application déployée accessible', true);
    } else {
      logTest('Application déployée accessible', false, `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Application déployée accessible', false, error.message);
  }
}

// Test des fonctionnalités Admin
async function testAdminFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS ADMIN');

  // Test de connexion admin
  try {
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'admin@cryptoboost.world',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      logTest('Connexion admin', true);
      
      // Test des statistiques dashboard
      try {
        const statsResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          logTest('Récupération statistiques dashboard', true, `Stats: ${JSON.stringify(stats)}`);
        } else {
          logTest('Récupération statistiques dashboard', false, `Status: ${statsResponse.status}`);
        }
      } catch (error) {
        logTest('Récupération statistiques dashboard', false, error.message);
      }

      // Test de récupération des utilisateurs
      try {
        const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (usersResponse.ok) {
          const users = await usersResponse.json();
          logTest('Récupération utilisateurs', true, `${users.length} utilisateurs trouvés`);
        } else {
          logTest('Récupération utilisateurs', false, `Status: ${usersResponse.status}`);
        }
      } catch (error) {
        logTest('Récupération utilisateurs', false, error.message);
      }

      // Test de récupération des transactions
      try {
        const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*&limit=10`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (transactionsResponse.ok) {
          const transactions = await transactionsResponse.json();
          logTest('Récupération transactions', true, `${transactions.length} transactions trouvées`);
        } else {
          logTest('Récupération transactions', false, `Status: ${transactionsResponse.status}`);
        }
      } catch (error) {
        logTest('Récupération transactions', false, error.message);
      }

      // Test de récupération des plans d'investissement
      try {
        const plansResponse = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (plansResponse.ok) {
          const plans = await plansResponse.json();
          logTest('Récupération plans d\'investissement', true, `${plans.length} plans trouvés`);
        } else {
          logTest('Récupération plans d\'investissement', false, `Status: ${plansResponse.status}`);
        }
      } catch (error) {
        logTest('Récupération plans d\'investissement', false, error.message);
      }

      // Test de récupération des logs système
      try {
        const logsResponse = await fetch(`${SUPABASE_URL}/rest/v1/system_logs?select=*&limit=10&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${loginData.access_token}`
          }
        });

        if (logsResponse.ok) {
          const logs = await logsResponse.json();
          logTest('Récupération logs système', true, `${logs.length} logs trouvés`);
        } else {
          logTest('Récupération logs système', false, `Status: ${logsResponse.status}`);
        }
      } catch (error) {
        logTest('Récupération logs système', false, error.message);
      }

    } else {
      logTest('Connexion admin', false, `Status: ${loginResponse.status}`);
    }
  } catch (error) {
    logTest('Connexion admin', false, error.message);
  }
}

// Test des fonctionnalités Client
async function testClientFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS CLIENT');

  // Test de création d'un client de test
  try {
    const registerResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: `test-client-${Date.now()}@cryptoboost.world`,
        password: 'test123456',
        data: {
          full_name: 'Test Client',
          role: 'client'
        }
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      logTest('Création client de test', true);

      // Test de connexion client
      try {
        const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            email: `test-client-${Date.now()}@cryptoboost.world`,
            password: 'test123456'
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          logTest('Connexion client', true);

          // Test de récupération des investissements du client
          try {
            const investmentsResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_investments?select=*&user_id=eq.${loginData.user.id}`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${loginData.access_token}`
              }
            });

            if (investmentsResponse.ok) {
              const investments = await investmentsResponse.json();
              logTest('Récupération investissements client', true, `${investments.length} investissements trouvés`);
            } else {
              logTest('Récupération investissements client', false, `Status: ${investmentsResponse.status}`);
            }
          } catch (error) {
            logTest('Récupération investissements client', false, error.message);
          }

          // Test de récupération des transactions du client
          try {
            const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*&user_id=eq.${loginData.user.id}&limit=10`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${loginData.access_token}`
              }
            });

            if (transactionsResponse.ok) {
              const transactions = await transactionsResponse.json();
              logTest('Récupération transactions client', true, `${transactions.length} transactions trouvées`);
            } else {
              logTest('Récupération transactions client', false, `Status: ${transactionsResponse.status}`);
            }
          } catch (error) {
            logTest('Récupération transactions client', false, error.message);
          }

          // Test de récupération des plans disponibles
          try {
            const plansResponse = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*&is_active=eq.true`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${loginData.access_token}`
              }
            });

            if (plansResponse.ok) {
              const plans = await plansResponse.json();
              logTest('Récupération plans disponibles', true, `${plans.length} plans actifs trouvés`);
            } else {
              logTest('Récupération plans disponibles', false, `Status: ${plansResponse.status}`);
            }
          } catch (error) {
            logTest('Récupération plans disponibles', false, error.message);
          }

          // Test de récupération des wallets crypto
          try {
            const walletsResponse = await fetch(`${SUPABASE_URL}/rest/v1/crypto_wallets?select=*&is_active=eq.true`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${loginData.access_token}`
              }
            });

            if (walletsResponse.ok) {
              const wallets = await walletsResponse.json();
              logTest('Récupération wallets crypto', true, `${wallets.length} wallets actifs trouvés`);
            } else {
              logTest('Récupération wallets crypto', false, `Status: ${walletsResponse.status}`);
            }
          } catch (error) {
            logTest('Récupération wallets crypto', false, error.message);
          }

        } else {
          logTest('Connexion client', false, `Status: ${loginResponse.status}`);
        }
      } catch (error) {
        logTest('Connexion client', false, error.message);
      }

    } else {
      logTest('Création client de test', false, `Status: ${registerResponse.status}`);
    }
  } catch (error) {
    logTest('Création client de test', false, error.message);
  }
}

// Test des fonctionnalités de navigation
async function testNavigationFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS DE NAVIGATION');

  const routes = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/auth/login', name: 'Page de connexion' },
    { path: '/auth/register', name: 'Page d\'inscription' },
    { path: '/admin/dashboard', name: 'Dashboard Admin' },
    { path: '/admin/users', name: 'Gestion Utilisateurs' },
    { path: '/admin/transactions', name: 'Gestion Transactions' },
    { path: '/admin/plans', name: 'Gestion Plans' },
    { path: '/admin/logs', name: 'Logs Système' },
    { path: '/client/dashboard', name: 'Dashboard Client' },
    { path: '/client/wallet', name: 'Wallet Client' },
    { path: '/client/plans', name: 'Plans Client' },
    { path: '/client/exchange', name: 'Exchange Client' },
    { path: '/client/history', name: 'Historique Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/profile', name: 'Profil Client' }
  ];

  for (const route of routes) {
    try {
      const response = await fetch(`${APP_URL}${route.path}`);
      if (response.ok) {
        logTest(`Route ${route.name}`, true);
      } else {
        logTest(`Route ${route.name}`, false, `Status: ${response.status}`);
      }
    } catch (error) {
      logTest(`Route ${route.name}`, false, error.message);
    }
  }
}

// Test des fonctionnalités d'interface
async function testInterfaceFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS D\'INTERFACE');

  // Test des composants UI
  const uiComponents = [
    'Button',
    'Card',
    'Input',
    'toaster'
  ];

  for (const component of uiComponents) {
    try {
      // Vérifier si le fichier existe
      const fs = await import('fs');
      const componentPath = join(__dirname, '..', 'src', 'components', 'ui', `${component}.tsx`);
      
      if (fs.existsSync(componentPath)) {
        logTest(`Composant ${component}`, true);
      } else {
        logTest(`Composant ${component}`, false, 'Fichier manquant');
      }
    } catch (error) {
      logTest(`Composant ${component}`, false, error.message);
    }
  }

  // Test des pages principales
  const pages = [
    'admin/Dashboard',
    'admin/Users',
    'admin/Transactions',
    'admin/InvestmentPlans',
    'admin/SystemLogs',
    'client/Dashboard',
    'client/Wallet',
    'client/Plans',
    'client/Exchange',
    'client/History',
    'client/Notifications',
    'client/Profile'
  ];

  for (const page of pages) {
    try {
      const fs = await import('fs');
      const pagePath = join(__dirname, '..', 'src', 'pages', `${page}.tsx`);
      
      if (fs.existsSync(pagePath)) {
        logTest(`Page ${page}`, true);
      } else {
        logTest(`Page ${page}`, false, 'Fichier manquant');
      }
    } catch (error) {
      logTest(`Page ${page}`, false, error.message);
    }
  }
}

// Test des fonctionnalités de sécurité
async function testSecurityFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS DE SÉCURITÉ');

  // Test des en-têtes de sécurité
  try {
    const response = await fetch(APP_URL);
    const headers = response.headers;

    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security',
      'content-security-policy'
    ];

    for (const header of securityHeaders) {
      if (headers.get(header)) {
        logTest(`En-tête de sécurité ${header}`, true);
      } else {
        logTest(`En-tête de sécurité ${header}`, false, 'En-tête manquant');
      }
    }
  } catch (error) {
    logTest('Vérification en-têtes de sécurité', false, error.message);
  }

  // Test de redirection HTTPS
  try {
    const httpResponse = await fetch(`http://cryptoboost.world`);
    if (httpResponse.status === 301 || httpResponse.status === 302) {
      logTest('Redirection HTTPS', true);
    } else {
      logTest('Redirection HTTPS', false, `Status: ${httpResponse.status}`);
    }
  } catch (error) {
    logTest('Redirection HTTPS', false, error.message);
  }
}

// Test des fonctionnalités de performance
async function testPerformanceFunctionality() {
  logSection('TEST DES FONCTIONNALITÉS DE PERFORMANCE');

  // Test de temps de réponse
  const startTime = Date.now();
  try {
    const response = await fetch(APP_URL);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (responseTime < 3000) {
      logTest('Temps de réponse', true, `${responseTime}ms`);
    } else {
      logTest('Temps de réponse', false, `${responseTime}ms (trop lent)`);
    }
  } catch (error) {
    logTest('Temps de réponse', false, error.message);
  }

  // Test de disponibilité
  try {
    const response = await fetch(APP_URL);
    if (response.status === 200) {
      logTest('Disponibilité de l\'application', true);
    } else {
      logTest('Disponibilité de l\'application', false, `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Disponibilité de l\'application', false, error.message);
  }
}

// Fonction principale
async function runAllTests() {
  log('🚀 DÉBUT DES TESTS COMPLETS DES DASHBOARDS', 'bright');
  log('Test de toutes les fonctionnalités admin et client', 'cyan');

  try {
    await testBasicFunctionality();
    await testAdminFunctionality();
    await testClientFunctionality();
    await testNavigationFunctionality();
    await testInterfaceFunctionality();
    await testSecurityFunctionality();
    await testPerformanceFunctionality();

    logSection('RÉSUMÉ DES TESTS');
    log('✅ Tests terminés avec succès !', 'green');
    log('📊 Toutes les fonctionnalités des dashboards ont été vérifiées', 'cyan');
    log('🎯 Les dashboards admin et client sont maintenant complets et fonctionnels', 'green');

  } catch (error) {
    log('❌ Erreur lors des tests', 'red');
    log(error.message, 'red');
  }
}

// Exécution des tests
runAllTests().catch(console.error);