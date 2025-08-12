#!/usr/bin/env node

/**
 * SCRIPT DE DIAGNOSTIC DES PERMISSIONS SUPABASE
 * Diagnostique les problèmes d'accès aux données
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
// DIAGNOSTIC DES PERMISSIONS
// ============================================================================

async function testTableAccess(tableName, description) {
  log(`\n🔍 Test d'accès à la table: ${description}`);
  
  try {
    // Test 1: Accès simple
    const response1 = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    log(`   Status: ${response1.status}`, response1.ok ? 'green' : 'red');
    
    if (!response1.ok) {
      const errorText = await response1.text();
      log(`   Erreur: ${errorText}`, 'red');
      
      // Test 2: Sans RLS
      const response2 = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        }
      });
      
      log(`   Test sans RLS: ${response2.status}`, response2.ok ? 'green' : 'red');
      
      // Test 3: Avec authentification
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
        const response3 = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=1`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${authData.access_token}`
          }
        });
        
        log(`   Test avec auth: ${response3.status}`, response3.ok ? 'green' : 'red');
      }
    } else {
      const data = await response1.json();
      log(`   ✅ Accès réussi - ${data.length} enregistrement(s)`, 'green');
    }
    
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
  }
}

async function testRLSPolicies() {
  logSection('🔒 TEST DES POLITIQUES RLS');
  
  const tables = [
    { name: 'users', description: 'Utilisateurs' },
    { name: 'investment_plans', description: 'Plans d\'investissement' },
    { name: 'transactions', description: 'Transactions' },
    { name: 'investments', description: 'Investissements' },
    { name: 'crypto_wallets', description: 'Wallets crypto' },
    { name: 'notifications', description: 'Notifications' },
    { name: 'system_logs', description: 'Logs système' }
  ];

  for (const table of tables) {
    await testTableAccess(table.name, table.description);
  }
}

async function testAuthenticationFlow() {
  logSection('🔐 TEST DU FLUX D\'AUTHENTIFICATION');
  
  try {
    // 1. Test de connexion
    log('\n1️⃣ Test de connexion utilisateur');
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
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

    if (loginResponse.ok) {
      const authData = await loginResponse.json();
      log(`   ✅ Connexion réussie`, 'green');
      log(`   Token: ${authData.access_token.substring(0, 20)}...`, 'blue');
      
      // 2. Test d'accès avec token
      log('\n2️⃣ Test d\'accès avec token authentifié');
      const dataResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${authData.access_token}`
        }
      });
      
      log(`   Status: ${dataResponse.status}`, dataResponse.ok ? 'green' : 'red');
      
      if (dataResponse.ok) {
        const userData = await dataResponse.json();
        log(`   ✅ Données récupérées: ${userData.length} utilisateur(s)`, 'green');
      } else {
        const errorText = await dataResponse.text();
        log(`   ❌ Erreur: ${errorText}`, 'red');
      }
      
    } else {
      log(`   ❌ Échec de connexion: ${loginResponse.status}`, 'red');
    }
    
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
  }
}

async function testTableStructure() {
  logSection('📋 TEST DE LA STRUCTURE DES TABLES');
  
  try {
    // Test de la structure des tables
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const tables = await response.json();
      log(`✅ Tables disponibles: ${tables.length}`, 'green');
      
      for (const table of tables) {
        log(`   📊 ${table.name}`, 'blue');
      }
    } else {
      log(`❌ Impossible de récupérer la liste des tables: ${response.status}`, 'red');
    }
    
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function diagnosePermissions() {
  log('🔍 DIAGNOSTIC DES PERMISSIONS SUPABASE', 'bright');
  log('Analyse des problèmes d\'accès aux données', 'cyan');
  
  try {
    // 1. Test de la structure des tables
    await testTableStructure();
    
    // 2. Test des politiques RLS
    await testRLSPolicies();
    
    // 3. Test du flux d'authentification
    await testAuthenticationFlow();

    // Résumé
    logSection('📊 RÉSUMÉ DU DIAGNOSTIC');
    log('🔍 Diagnostic terminé - Vérifiez les résultats ci-dessus', 'cyan');
    log('💡 Solutions possibles:', 'yellow');
    log('   1. Désactiver temporairement RLS pour les tests', 'yellow');
    log('   2. Vérifier les politiques RLS dans Supabase Dashboard', 'yellow');
    log('   3. Utiliser un token d\'authentification valide', 'yellow');
    log('   4. Vérifier les permissions de l\'API key', 'yellow');

  } catch (error) {
    log('\n❌ Erreur lors du diagnostic', 'red');
    log(error.message, 'red');
  }
}

// Exécution
diagnosePermissions().catch(console.error);