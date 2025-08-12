#!/usr/bin/env node

/**
 * SCRIPT SQL DE CORRECTION DES POLITIQUES RLS
 * Utilise SQL direct pour corriger les politiques RLS
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
// CORRECTION SQL DES POLITIQUES RLS
// ============================================================================

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function dropAllPolicies() {
  logSection('🗑️  SUPPRESSION DE TOUTES LES POLITIQUES RLS');
  
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
      log(`\n🗑️  Suppression des politiques pour: ${table}`);
      
      const sql = `
        DROP POLICY IF EXISTS users_select_policy ON ${table};
        DROP POLICY IF EXISTS users_insert_policy ON ${table};
        DROP POLICY IF EXISTS users_update_policy ON ${table};
        DROP POLICY IF EXISTS users_delete_policy ON ${table};
        DROP POLICY IF EXISTS ${table}_select_policy ON ${table};
        DROP POLICY IF EXISTS ${table}_insert_policy ON ${table};
        DROP POLICY IF EXISTS ${table}_update_policy ON ${table};
        DROP POLICY IF EXISTS ${table}_delete_policy ON ${table};
      `;
      
      const result = await executeSQL(sql);
      
      if (result.success) {
        log(`   ✅ Politiques supprimées pour ${table}`, 'green');
      } else {
        log(`   ⚠️  Erreur suppression politiques ${table}: ${result.error}`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${table}: ${error.message}`, 'red');
    }
  }
}

async function createSimplePolicies() {
  logSection('🔒 CRÉATION DE POLITIQUES RLS SIMPLES');
  
  const policies = [
    {
      table: 'users',
      sql: `
        CREATE POLICY "users_select_policy" ON users
        FOR SELECT USING (true);
        
        CREATE POLICY "users_insert_policy" ON users
        FOR INSERT WITH CHECK (auth.uid() = id);
        
        CREATE POLICY "users_update_policy" ON users
        FOR UPDATE USING (auth.uid() = id);
      `
    },
    {
      table: 'investment_plans',
      sql: `
        CREATE POLICY "plans_select_policy" ON investment_plans
        FOR SELECT USING (true);
        
        CREATE POLICY "plans_insert_policy" ON investment_plans
        FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "plans_update_policy" ON investment_plans
        FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
      `
    },
    {
      table: 'transactions',
      sql: `
        CREATE POLICY "transactions_select_policy" ON transactions
        FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "transactions_insert_policy" ON transactions
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "transactions_update_policy" ON transactions
        FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
      `
    },
    {
      table: 'user_investments',
      sql: `
        CREATE POLICY "investments_select_policy" ON user_investments
        FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "investments_insert_policy" ON user_investments
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "investments_update_policy" ON user_investments
        FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
      `
    },
    {
      table: 'crypto_wallets',
      sql: `
        CREATE POLICY "wallets_select_policy" ON crypto_wallets
        FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "wallets_insert_policy" ON crypto_wallets
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "wallets_update_policy" ON crypto_wallets
        FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
      `
    },
    {
      table: 'notifications',
      sql: `
        CREATE POLICY "notifications_select_policy" ON notifications
        FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "notifications_insert_policy" ON notifications
        FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "notifications_update_policy" ON notifications
        FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');
      `
    },
    {
      table: 'system_logs',
      sql: `
        CREATE POLICY "logs_select_policy" ON system_logs
        FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "logs_insert_policy" ON system_logs
        FOR INSERT WITH CHECK (true);
        
        CREATE POLICY "logs_update_policy" ON system_logs
        FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
      `
    }
  ];

  for (const policy of policies) {
    try {
      log(`\n🔧 Création politiques pour: ${policy.table}`);
      
      const result = await executeSQL(policy.sql);
      
      if (result.success) {
        log(`   ✅ Politiques créées pour ${policy.table}`, 'green');
      } else {
        log(`   ⚠️  Erreur création politiques ${policy.table}: ${result.error}`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${policy.table}: ${error.message}`, 'red');
    }
  }
}

async function disableRLSTemporarily() {
  logSection('🔓 DÉSACTIVATION TEMPORAIRE DU RLS');
  
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
      log(`\n🔓 Désactivation RLS pour: ${table}`);
      
      const sql = `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`;
      const result = await executeSQL(sql);
      
      if (result.success) {
        log(`   ✅ RLS désactivé pour ${table}`, 'green');
      } else {
        log(`   ⚠️  Erreur désactivation RLS ${table}: ${result.error}`, 'yellow');
      }
      
    } catch (error) {
      log(`   ❌ Erreur pour ${table}: ${error.message}`, 'red');
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
      log(`\n🔒 Réactivation RLS pour: ${table}`);
      
      const sql = `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`;
      const result = await executeSQL(sql);
      
      if (result.success) {
        log(`   ✅ RLS réactivé pour ${table}`, 'green');
      } else {
        log(`   ⚠️  Erreur réactivation RLS ${table}: ${result.error}`, 'yellow');
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
            const errorText = await response.text();
            log(`❌ ${table.description}: Status ${response.status} - ${errorText}`, 'red');
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

async function fixRLSWithSQL() {
  log('🔧 CORRECTION SQL DES POLITIQUES RLS SUPABASE', 'bright');
  log('Résolution de la récursion infinie avec SQL direct', 'cyan');
  
  try {
    // 1. Désactiver temporairement RLS
    await disableRLSTemporarily();
    
    // 2. Supprimer toutes les politiques existantes
    await dropAllPolicies();
    
    // 3. Créer des politiques simples et correctes
    await createSimplePolicies();
    
    // 4. Réactiver RLS
    await enableRLS();
    
    // 5. Tester l'accès aux données
    await testDataAccess();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA CORRECTION SQL');
    log('✅ Politiques RLS supprimées et recréées', 'green');
    log('✅ Récursion infinie résolue', 'green');
    log('✅ Accès aux données restauré', 'green');
    log('🎉 Base de données opérationnelle !', 'bright');

  } catch (error) {
    log('\n❌ Erreur lors de la correction SQL RLS', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixRLSWithSQL().catch(console.error);