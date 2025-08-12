#!/usr/bin/env node

/**
 * AUDIT COMPLET - CRYPTOBOOST APPLICATION
 * Liste complète des fonctionnalités, menus et codes d'accès pour chaque rôle
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Configuration
const SITE_URL = 'https://cryptoboost.world';
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(80)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`, 'cyan');
}

function logSubSection(title) {
  log(`\n${colors.yellow}${'-'.repeat(60)}`, 'yellow');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.yellow}${'-'.repeat(60)}${colors.reset}`, 'yellow');
}

// ============================================================================
// 1. DÉFINITION DES FONCTIONNALITÉS ET MENUS
// ============================================================================

const FUNCTIONALITIES = {
  // Pages publiques
  public: {
    home: {
      name: 'Page d\'accueil',
      url: '/',
      description: 'Landing page principale',
      features: ['Présentation CryptoBoost', 'Call-to-action', 'Navigation']
    },
    login: {
      name: 'Connexion',
      url: '/login',
      description: 'Page de connexion utilisateur',
      features: ['Formulaire email/mot de passe', 'Validation', 'Redirection']
    },
    register: {
      name: 'Inscription',
      url: '/register',
      description: 'Page d\'inscription utilisateur',
      features: ['Formulaire inscription', 'Validation', 'Création compte']
    }
  },

  // Dashboard Client
  client: {
    dashboard: {
      name: 'Dashboard Client',
      url: '/client',
      description: 'Vue d\'ensemble client',
      features: ['Statistiques', 'Résumé investissements', 'Actions rapides']
    },
    profile: {
      name: 'Profil Client',
      url: '/client/profile',
      description: 'Gestion du profil utilisateur',
      features: ['Informations personnelles', 'Modification données', 'Sécurité']
    },
    investments: {
      name: 'Investissements',
      url: '/client/investments',
      description: 'Gestion des investissements',
      features: ['Liste investissements', 'Performance', 'Nouveaux investissements']
    },
    transactions: {
      name: 'Transactions',
      url: '/client/transactions',
      description: 'Historique des transactions',
      features: ['Historique complet', 'Filtres', 'Export']
    },
    wallets: {
      name: 'Wallets',
      url: '/client/wallets',
      description: 'Gestion des wallets crypto',
      features: ['Liste wallets', 'Solde', 'Transactions']
    },
    notifications: {
      name: 'Notifications',
      url: '/client/notifications',
      description: 'Centre de notifications',
      features: ['Notifications système', 'Alertes', 'Préférences']
    },
    exchange: {
      name: 'Exchange',
      url: '/client/exchange',
      description: 'Plateforme d\'échange',
      features: ['Trading', 'Graphiques', 'Ordres']
    }
  },

  // Dashboard Admin
  admin: {
    dashboard: {
      name: 'Dashboard Admin',
      url: '/admin',
      description: 'Vue d\'ensemble administrateur',
      features: ['Statistiques globales', 'Alertes système', 'Actions rapides']
    },
    users: {
      name: 'Gestion Utilisateurs',
      url: '/admin/users',
      description: 'Administration des utilisateurs',
      features: ['Liste utilisateurs', 'Modification rôles', 'Statuts']
    },
    transactions: {
      name: 'Gestion Transactions',
      url: '/admin/transactions',
      description: 'Administration des transactions',
      features: ['Toutes transactions', 'Validation', 'Rapports']
    },
    investments: {
      name: 'Gestion Investissements',
      url: '/admin/investments',
      description: 'Administration des investissements',
      features: ['Plans d\'investissement', 'Performance', 'Configuration']
    },
    plans: {
      name: 'Gestion Plans',
      url: '/admin/plans',
      description: 'Gestion des plans d\'investissement',
      features: ['Création plans', 'Modification', 'Activation/Désactivation']
    },
    logs: {
      name: 'Logs Système',
      url: '/admin/logs',
      description: 'Monitoring système',
      features: ['Logs d\'activité', 'Erreurs', 'Performance']
    },
    wallets: {
      name: 'Gestion Wallets',
      url: '/admin/wallets',
      description: 'Administration des wallets',
      features: ['Wallets système', 'Sécurité', 'Monitoring']
    },
    settings: {
      name: 'Paramètres Admin',
      url: '/admin/settings',
      description: 'Configuration système',
      features: ['Paramètres généraux', 'Sécurité', 'Notifications']
    }
  }
};

// ============================================================================
// 2. CODES D'ACCÈS POUR CHAQUE RÔLE
// ============================================================================

const ACCESS_CODES = {
  client: {
    email: 'client@cryptoboost.world',
    password: 'ClientPass123!',
    role: 'client',
    permissions: [
      'Accès dashboard client',
      'Gestion profil personnel',
      'Voir investissements',
      'Voir transactions',
      'Gérer wallets',
      'Recevoir notifications',
      'Utiliser exchange'
    ]
  },
  admin: {
    email: 'admin@cryptoboost.world',
    password: 'AdminPass123!',
    role: 'admin',
    permissions: [
      'Accès dashboard admin',
      'Gestion tous utilisateurs',
      'Gestion toutes transactions',
      'Gestion investissements',
      'Gestion plans',
      'Voir logs système',
      'Gestion wallets système',
      'Configuration système'
    ]
  }
};

// ============================================================================
// 3. CRÉATION DES COMPTES DE TEST
// ============================================================================

async function createTestAccounts() {
  logSection('🔐 CRÉATION DES COMPTES DE TEST');
  
  const accounts = {};
  
  for (const [role, credentials] of Object.entries(ACCESS_CODES)) {
    try {
      log(`🔍 Création compte ${role}...`, 'blue');
      
      // Inscription
      const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          data: {
            role: credentials.role,
            first_name: role === 'admin' ? 'Admin' : 'Client',
            last_name: 'Test'
          }
        })
      });

      if (signUpResponse.ok) {
        const signUpData = await signUpResponse.json();
        log(`✅ Inscription ${role} réussie - ID: ${signUpData.user?.id}`, 'green');
        
        // Connexion
        const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (signInResponse.ok) {
          const signInData = await signInResponse.json();
          log(`✅ Connexion ${role} réussie`, 'green');
          
          accounts[role] = {
            ...credentials,
            accessToken: signInData.access_token,
            userId: signInData.user.id
          };
        } else {
          log(`❌ Échec connexion ${role} - Status: ${signInResponse.status}`, 'red');
        }
      } else {
        log(`❌ Échec inscription ${role} - Status: ${signUpResponse.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur création compte ${role}: ${error.message}`, 'red');
    }
  }
  
  return accounts;
}

// ============================================================================
// 4. TEST DES FONCTIONNALITÉS PAR RÔLE
// ============================================================================

async function testRoleFunctionalities(accounts) {
  logSection('🧪 TEST DES FONCTIONNALITÉS PAR RÔLE');
  
  const results = {};
  
  for (const [role, account] of Object.entries(accounts)) {
    logSubSection(`TEST RÔLE: ${role.toUpperCase()}`);
    
    const roleFunctionalities = FUNCTIONALITIES[role];
    const testResults = {};
    
    for (const [key, functionality] of Object.entries(roleFunctionalities)) {
      try {
        log(`🔍 Test ${functionality.name}...`, 'blue');
        
        const response = await fetch(`${SITE_URL}${functionality.url}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Authorization': `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          log(`✅ ${functionality.name} - Status: ${response.status}`, 'green');
          testResults[key] = {
            status: 'success',
            statusCode: response.status,
            url: functionality.url
          };
        } else {
          log(`❌ ${functionality.name} - Status: ${response.status}`, 'red');
          testResults[key] = {
            status: 'error',
            statusCode: response.status,
            url: functionality.url
          };
        }
      } catch (error) {
        log(`❌ ${functionality.name} - Erreur: ${error.message}`, 'red');
        testResults[key] = {
          status: 'error',
          error: error.message,
          url: functionality.url
        };
      }
    }
    
    results[role] = testResults;
  }
  
  return results;
}

// ============================================================================
// 5. TEST DES PAGES PUBLIQUES
// ============================================================================

async function testPublicPages() {
  logSection('🌐 TEST DES PAGES PUBLIQUES');
  
  const publicFunctionalities = FUNCTIONALITIES.public;
  const results = {};
  
  for (const [key, functionality] of Object.entries(publicFunctionalities)) {
    try {
      log(`🔍 Test ${functionality.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${functionality.url}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        log(`✅ ${functionality.name} - Status: ${response.status}`, 'green');
        results[key] = {
          status: 'success',
          statusCode: response.status,
          url: functionality.url
        };
      } else {
        log(`❌ ${functionality.name} - Status: ${response.status}`, 'red');
        results[key] = {
          status: 'error',
          statusCode: response.status,
          url: functionality.url
        };
      }
    } catch (error) {
      log(`❌ ${functionality.name} - Erreur: ${error.message}`, 'red');
      results[key] = {
        status: 'error',
        error: error.message,
        url: functionality.url
      };
    }
  }
  
  return results;
}

// ============================================================================
// 6. GÉNÉRATION DU RAPPORT COMPLET
// ============================================================================

function generateCompleteReport(accounts, roleResults, publicResults) {
  logSection('📋 RAPPORT COMPLET - CRYPTOBOOST APPLICATION');
  
  // 1. Codes d'accès
  logSubSection('🔑 CODES D\'ACCÈS PAR RÔLE');
  
  for (const [role, account] of Object.entries(accounts)) {
    log(`\n${colors.magenta}${role.toUpperCase()}:${colors.reset}`, 'magenta');
    log(`   Email: ${account.email}`, 'blue');
    log(`   Mot de passe: ${account.password}`, 'blue');
    log(`   Rôle: ${account.role}`, 'blue');
    log(`   Permissions:`, 'blue');
    ACCESS_CODES[role].permissions.forEach(permission => {
      log(`     • ${permission}`, 'cyan');
    });
  }
  
  // 2. Fonctionnalités par rôle
  logSubSection('🎯 FONCTIONNALITÉS PAR RÔLE');
  
  for (const [role, functionalities] of Object.entries(FUNCTIONALITIES)) {
    if (role === 'public') continue;
    
    log(`\n${colors.magenta}${role.toUpperCase()}:${colors.reset}`, 'magenta');
    
    for (const [key, functionality] of Object.entries(functionalities)) {
      const result = roleResults[role]?.[key];
      const status = result?.status === 'success' ? '✅' : '❌';
      log(`   ${status} ${functionality.name}`, result?.status === 'success' ? 'green' : 'red');
      log(`     URL: ${functionality.url}`, 'blue');
      log(`     Description: ${functionality.description}`, 'cyan');
      log(`     Fonctionnalités:`, 'cyan');
      functionality.features.forEach(feature => {
        log(`       • ${feature}`, 'cyan');
      });
    }
  }
  
  // 3. Pages publiques
  logSubSection('🌐 PAGES PUBLIQUES');
  
  for (const [key, functionality] of Object.entries(FUNCTIONALITIES.public)) {
    const result = publicResults[key];
    const status = result?.status === 'success' ? '✅' : '❌';
    log(`   ${status} ${functionality.name}`, result?.status === 'success' ? 'green' : 'red');
    log(`     URL: ${functionality.url}`, 'blue');
    log(`     Description: ${functionality.description}`, 'cyan');
  }
  
  // 4. Statistiques
  logSubSection('📊 STATISTIQUES');
  
  let totalFunctionalities = 0;
  let successFunctionalities = 0;
  
  // Compter les fonctionnalités publiques
  for (const result of Object.values(publicResults)) {
    totalFunctionalities++;
    if (result.status === 'success') successFunctionalities++;
  }
  
  // Compter les fonctionnalités par rôle
  for (const roleResults of Object.values(roleResults)) {
    for (const result of Object.values(roleResults)) {
      totalFunctionalities++;
      if (result.status === 'success') successFunctionalities++;
    }
  }
  
  log(`   Total fonctionnalités: ${totalFunctionalities}`, 'blue');
  log(`   Fonctionnalités opérationnelles: ${successFunctionalities}`, 'green');
  log(`   Taux de succès: ${Math.round((successFunctionalities/totalFunctionalities)*100)}%`, 
      successFunctionalities === totalFunctionalities ? 'green' : 'yellow');
  
  // 5. URLs d'accès
  logSubSection('🌐 URLS D\'ACCÈS');
  log(`   Site principal: ${SITE_URL}`, 'blue');
  log(`   Login: ${SITE_URL}/login`, 'blue');
  log(`   Register: ${SITE_URL}/register`, 'blue');
  log(`   Dashboard Client: ${SITE_URL}/client`, 'blue');
  log(`   Dashboard Admin: ${SITE_URL}/admin`, 'blue');
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function auditCompletApplication() {
  log('🔍 AUDIT COMPLET - CRYPTOBOOST APPLICATION', 'bright');
  log('Liste complète des fonctionnalités, menus et codes d\'accès', 'cyan');
  
  try {
    // 1. Création des comptes de test
    const accounts = await createTestAccounts();
    
    if (Object.keys(accounts).length === 0) {
      log('❌ Impossible de créer les comptes de test', 'red');
      return;
    }
    
    // 2. Test des pages publiques
    const publicResults = await testPublicPages();
    
    // 3. Test des fonctionnalités par rôle
    const roleResults = await testRoleFunctionalities(accounts);
    
    // 4. Génération du rapport complet
    generateCompleteReport(accounts, roleResults, publicResults);
    
    // 5. Sauvegarde du rapport
    const reportData = {
      timestamp: new Date().toISOString(),
      accounts: Object.fromEntries(
        Object.entries(accounts).map(([role, account]) => [
          role, 
          { email: account.email, password: account.password, role: account.role }
        ])
      ),
      functionalities: FUNCTIONALITIES,
      testResults: {
        public: publicResults,
        roles: roleResults
      }
    };
    
    fs.writeFileSync('RAPPORT_AUDIT_COMPLET.json', JSON.stringify(reportData, null, 2));
    log('\n✅ Rapport sauvegardé dans RAPPORT_AUDIT_COMPLET.json', 'green');
    
  } catch (error) {
    log('\n❌ Erreur lors de l\'audit', 'red');
    log(error.message, 'red');
  }
}

// Exécution
auditCompletApplication().catch(console.error);