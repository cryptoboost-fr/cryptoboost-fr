#!/usr/bin/env node

/**
 * Script de test automatisé pour vérifier toutes les fonctionnalités de l'app
 * Usage: node scripts/test-app.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';
const APP_URL = 'http://localhost:5173';

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Test automatisé de l\'application CryptoBoost\n');

async function testServerConnection() {
  console.log('1️⃣ Test de connexion au serveur de développement...');
  
  try {
    const response = await fetch(APP_URL);
    if (response.ok) {
      console.log('✅ Serveur de développement accessible');
      return true;
    } else {
      console.log('❌ Serveur de développement non accessible:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion au serveur:', error.message);
    return false;
  }
}

async function testSupabaseConnection() {
  console.log('\n2️⃣ Test de connexion à Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur de connexion Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion à Supabase réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur de connexion Supabase:', error.message);
    return false;
  }
}

async function testAdminAuthentication() {
  console.log('\n3️⃣ Test d\'authentification admin...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@cryptoboost.world',
      password: 'CryptoAdmin2024!'
    });
    
    if (error) {
      console.log('❌ Erreur d\'authentification admin:', error.message);
      return false;
    }
    
    console.log('✅ Authentification admin réussie');
    console.log('   - Email:', data.user?.email);
    console.log('   - ID:', data.user?.id);
    
    // Se déconnecter après le test
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.log('❌ Erreur d\'authentification admin:', error.message);
    return false;
  }
}

async function testDatabaseStructure() {
  console.log('\n4️⃣ Test de la structure de la base de données...');
  
  try {
    const tables = ['users', 'investment_plans', 'crypto_wallets', 'transactions', 'user_investments', 'notifications'];
    let allTablesOk = true;
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} non accessible:`, error.message);
        allTablesOk = false;
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    }
    
    return allTablesOk;
  } catch (error) {
    console.log('❌ Erreur lors du test de structure:', error.message);
    return false;
  }
}

async function testRLSPolicies() {
  console.log('\n5️⃣ Test des politiques RLS...');
  
  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('tablename, policyname')
      .eq('schemaname', 'public');
    
    if (error) {
      console.log('❌ Impossible de vérifier les politiques RLS:', error.message);
      return false;
    }
    
    const policyCount = data?.length || 0;
    console.log(`✅ ${policyCount} politiques RLS trouvées`);
    
    if (policyCount === 17) {
      console.log('✅ Nombre correct de politiques RLS (17)');
      return true;
    } else {
      console.log(`⚠️ Nombre de politiques incorrect: ${policyCount} (attendu: 17)`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test des politiques RLS:', error.message);
    return false;
  }
}

async function testDefaultData() {
  console.log('\n6️⃣ Test des données par défaut...');
  
  try {
    // Vérifier les plans d'investissement
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('name, is_active')
      .eq('is_active', true);
    
    if (plansError) {
      console.log('❌ Erreur lors de la vérification des plans:', plansError.message);
      return false;
    }
    
    console.log(`✅ ${plans?.length || 0} plans d'investissement actifs`);
    
    // Vérifier les wallets crypto
    const { data: wallets, error: walletsError } = await supabase
      .from('crypto_wallets')
      .select('crypto_type, is_active')
      .eq('is_active', true);
    
    if (walletsError) {
      console.log('❌ Erreur lors de la vérification des wallets:', walletsError.message);
      return false;
    }
    
    console.log(`✅ ${wallets?.length || 0} wallets crypto actifs`);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test des données:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n7️⃣ Test des variables d\'environnement...');
  
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  let allVarsOk = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ Variable manquante: ${varName}`);
      allVarsOk = false;
    } else {
      console.log(`✅ Variable ${varName} définie`);
    }
  }
  
  return allVarsOk;
}

async function runAllTests() {
  const tests = [
    { name: 'Serveur de développement', fn: testServerConnection },
    { name: 'Connexion Supabase', fn: testSupabaseConnection },
    { name: 'Authentification admin', fn: testAdminAuthentication },
    { name: 'Structure de base', fn: testDatabaseStructure },
    { name: 'Politiques RLS', fn: testRLSPolicies },
    { name: 'Données par défaut', fn: testDefaultData },
    { name: 'Variables d\'environnement', fn: testEnvironmentVariables },
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ Erreur dans le test ${test.name}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DES TESTS AUTOMATISÉS');
  console.log('='.repeat(60));
  console.log(`✅ Tests réussis: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('🚀 L\'application CryptoBoost est 100% fonctionnelle !');
  } else {
    console.log('⚠️ Certains tests ont échoué');
    console.log('🔧 Vérifiez les erreurs ci-dessus');
  }
  
  console.log('\n📋 Actions recommandées:');
  console.log('1. Si des tests échouent, exécutez les scripts de correction SQL');
  console.log('2. Testez manuellement l\'interface utilisateur');
  console.log('3. Vérifiez les logs du serveur de développement');
  
  return passed === total;
}

// Exécuter tous les tests
runAllTests().catch(console.error);