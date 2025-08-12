#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration d'authentification
 * Usage: node scripts/test-auth.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Test de configuration d\'authentification CryptoBoost\n');

async function testConnection() {
  console.log('1️⃣ Test de connexion à Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur de connexion:', error.message);
      return false;
    }
    
    console.log('✅ Connexion à Supabase réussie');
    return true;
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    return false;
  }
}

async function testAdminExists() {
  console.log('\n2️⃣ Vérification de l\'admin...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email, role, status')
      .eq('email', 'admin@cryptoboost.world')
      .single();
    
    if (error) {
      console.log('❌ Admin non trouvé:', error.message);
      return false;
    }
    
    console.log('✅ Admin trouvé:', {
      email: data.email,
      role: data.role,
      status: data.status
    });
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la vérification admin:', error.message);
    return false;
  }
}

async function testAuthUsers() {
  console.log('\n3️⃣ Vérification de auth.users...');
  
  try {
    // On ne peut pas accéder directement à auth.users via l'API publique
    // On vérifie plutôt que l'admin peut se connecter
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@cryptoboost.world',
      password: 'CryptoAdmin2024!'
    });
    
    if (error) {
      console.log('❌ Admin ne peut pas se connecter:', error.message);
      return false;
    }
    
    console.log('✅ Admin peut se connecter:', {
      email: data.user?.email,
      id: data.user?.id
    });
    
    // Se déconnecter après le test
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la vérification auth.users:', error.message);
    return false;
  }
}

async function testDatabaseStructure() {
  console.log('\n4️⃣ Vérification de la structure de la base...');
  
  try {
    // Vérifier les tables principales
    const tables = ['users', 'investment_plans', 'crypto_wallets', 'transactions'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} non accessible:`, error.message);
        return false;
      }
      
      console.log(`✅ Table ${table} accessible`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la vérification des tables:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n5️⃣ Vérification des variables d\'environnement...');
  
  console.log('📋 Configuration actuelle:');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Clé: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('❌ Variables d\'environnement manquantes');
    return false;
  }
  
  if (!SUPABASE_URL.includes('supabase.co')) {
    console.log('❌ URL Supabase invalide');
    return false;
  }
  
  console.log('✅ Variables d\'environnement correctes');
  return true;
}

async function runTests() {
  const tests = [
    { name: 'Connexion', fn: testConnection },
    { name: 'Variables d\'environnement', fn: testEnvironmentVariables },
    { name: 'Structure de base', fn: testDatabaseStructure },
    { name: 'Admin dans users', fn: testAdminExists },
    { name: 'Admin dans auth.users', fn: testAuthUsers },
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
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('='.repeat(50));
  console.log(`✅ Tests réussis: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 Tous les tests sont passés !');
    console.log('🔗 Vous pouvez maintenant tester l\'authentification sur votre site');
  } else {
    console.log('⚠️  Certains tests ont échoué');
    console.log('🔧 Exécutez le script HOTFIX_CONFIRMED_AT.sql dans Supabase');
  }
  
  console.log('\n📋 Actions recommandées:');
  console.log('1. Si des tests échouent, exécutez HOTFIX_CONFIRMED_AT.sql');
  console.log('2. Testez la connexion admin: admin@cryptoboost.world / CryptoAdmin2024!');
  console.log('3. Testez l\'inscription d\'un nouveau client');
}

// Exécuter les tests
runTests().catch(console.error);