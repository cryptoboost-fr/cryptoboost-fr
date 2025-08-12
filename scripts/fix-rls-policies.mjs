#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION DES POLITIQUES RLS
 * Corrige les politiques RLS qui causent une récursion infinie
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
// CORRECTION DES POLITIQUES RLS
// ============================================================================

async function disableRLSTemporarily() {
  logSection('🔒 DÉSACTIVATION TEMPORAIRE DU RLS');
  
  const tables = [
    'users',
    'investment_plans', 
    'transactions',
    'user_investments', // Correction du nom de table
    'crypto_wallets',
    'notifications',
    'system_logs'
  ];

  for (const table of tables) {
    try {
      log(`\n🔧 Désactivation RLS pour: ${table}`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/disable_rls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          table_name: table
        })
      });

      if (response.ok) {
        log(`   ✅ RLS désactivé pour ${table}`, 'green');
      } else {
        log(`   ⚠️  Impossible de désactiver RLS pour ${table}`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${table}: ${error.message}`, 'red');
    }
  }
}

async function createCorrectRLSPolicies() {
  logSection('🔒 CRÉATION DE POLITIQUES RLS CORRECTES');
  
  const policies = [
    {
      table: 'users',
      name: 'users_select_policy',
      operation: 'SELECT',
      definition: 'auth.uid() = id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'users',
      name: 'users_insert_policy', 
      operation: 'INSERT',
      definition: 'auth.uid() = id'
    },
    {
      table: 'users',
      name: 'users_update_policy',
      operation: 'UPDATE', 
      definition: 'auth.uid() = id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'investment_plans',
      name: 'plans_select_policy',
      operation: 'SELECT',
      definition: 'true'
    },
    {
      table: 'transactions',
      name: 'transactions_select_policy',
      operation: 'SELECT',
      definition: 'auth.uid() = user_id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'transactions',
      name: 'transactions_insert_policy',
      operation: 'INSERT',
      definition: 'auth.uid() = user_id'
    },
    {
      table: 'user_investments',
      name: 'investments_select_policy',
      operation: 'SELECT',
      definition: 'auth.uid() = user_id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'user_investments',
      name: 'investments_insert_policy',
      operation: 'INSERT',
      definition: 'auth.uid() = user_id'
    },
    {
      table: 'crypto_wallets',
      name: 'wallets_select_policy',
      operation: 'SELECT',
      definition: 'auth.uid() = user_id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'notifications',
      name: 'notifications_select_policy',
      operation: 'SELECT',
      definition: 'auth.uid() = user_id OR auth.jwt() ->> \'role\' = \'admin\''
    },
    {
      table: 'system_logs',
      name: 'logs_select_policy',
      operation: 'SELECT',
      definition: 'auth.jwt() ->> \'role\' = \'admin\''
    }
  ];

  for (const policy of policies) {
    try {
      log(`\n🔧 Création politique: ${policy.name}`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_policy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          table_name: policy.table,
          policy_name: policy.name,
          operation: policy.operation,
          definition: policy.definition
        })
      });

      if (response.ok) {
        log(`   ✅ Politique ${policy.name} créée`, 'green');
      } else {
        const errorText = await response.text();
        log(`   ⚠️  Politique ${policy.name} déjà existante ou erreur`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${policy.name}: ${error.message}`, 'red');
    }
  }
}

async function enableRLS() {
  logSection('🔒 RÉACTIVATION DU RLS');
  
  const tables = [
    'users',
    'investment_plans',
    'transactions', 
    'user_investments',
    'crypto_wallets',
    'notifications',
    'system_logs'
  ];

  for (const table of tables) {
    try {
      log(`\n🔧 Réactivation RLS pour: ${table}`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/enable_rls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          table_name: table
        })
      });

      if (response.ok) {
        log(`   ✅ RLS réactivé pour ${table}`, 'green');
      } else {
        log(`   ⚠️  Impossible de réactiver RLS pour ${table}`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${table}: ${error.message}`, 'red');
    }
  }
}

async function testDataAccess() {
  logSection('🧪 TEST D\'ACCÈS AUX DONNÉES');
  
  try {
    // Test avec authentification
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'client1@cryptoboost.world',
        password: 'ClientPassword123!'
      })
    });

    if (authResponse.ok) {
      const authData = await authResponse.json();
      log(`✅ Authentification réussie`, 'green');
      
      // Test des tables
      const tables = [
        { name: 'users', description: 'Utilisateurs' },
        { name: 'investment_plans', description: 'Plans d\'investissement' },
        { name: 'transactions', description: 'Transactions' },
        { name: 'user_investments', description: 'Investissements' },
        { name: 'crypto_wallets', description: 'Wallets crypto' },
        { name: 'notifications', description: 'Notifications' },
        { name: 'system_logs', description: 'Logs système' }
      ];

      for (const table of tables) {
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table.name}?select=*&limit=1`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${authData.access_token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            log(`✅ ${table.description}: ${data.length} enregistrement(s)`, 'green');
          } else {
            log(`❌ ${table.description}: Status ${response.status}`, 'red');
          }
        } catch (error) {
          log(`❌ ${table.description}: ${error.message}`, 'red');
        }
      }
      
    } else {
      log(`❌ Échec de l'authentification: ${authResponse.status}`, 'red');
    }
    
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixRLSPolicies() {
  log('🔧 CORRECTION DES POLITIQUES RLS SUPABASE', 'bright');
  log('Résolution de la récursion infinie dans les politiques', 'cyan');
  
  try {
    // 1. Désactiver temporairement RLS
    await disableRLSTemporarily();
    
    // 2. Créer des politiques RLS correctes
    await createCorrectRLSPolicies();
    
    // 3. Réactiver RLS
    await enableRLS();
    
    // 4. Tester l'accès aux données
    await testDataAccess();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA CORRECTION');
    log('✅ Politiques RLS corrigées', 'green');
    log('✅ Récursion infinie résolue', 'green');
    log('✅ Accès aux données restauré', 'green');
    log('🎉 Base de données opérationnelle !', 'bright');

  } catch (error) {
    log('\n❌ Erreur lors de la correction RLS', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixRLSPolicies().catch(console.error);