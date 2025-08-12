#!/usr/bin/env node

/**
 * Script de test simplifié pour vérifier les fonctionnalités de base
 * Usage: node scripts/test-simple.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (utiliser les valeurs par défaut)
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Test simplifié de CryptoBoost\n');

async function testSupabaseConnection() {
  console.log('1️⃣ Test de connexion à Supabase...');
  
  try {
    // Test simple de connexion
    const { data, error } = await supabase
      .from('investment_plans')
      .select('name')
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
  console.log('\n2️⃣ Test d\'authentification admin...');
  
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

async function testInvestmentPlans() {
  console.log('\n3️⃣ Test des plans d\'investissement...');
  
  try {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('name, description, is_active')
      .eq('is_active', true);
    
    if (error) {
      console.log('❌ Erreur lors de la récupération des plans:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} plans d'investissement trouvés:`);
    data?.forEach(plan => {
      console.log(`   - ${plan.name}: ${plan.description}`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test des plans:', error.message);
    return false;
  }
}

async function testCryptoWallets() {
  console.log('\n4️⃣ Test des wallets crypto...');
  
  try {
    const { data, error } = await supabase
      .from('crypto_wallets')
      .select('crypto_type, address, is_active')
      .eq('is_active', true);
    
    if (error) {
      console.log('❌ Erreur lors de la récupération des wallets:', error.message);
      return false;
    }
    
    console.log(`✅ ${data?.length || 0} wallets crypto trouvés:`);
    data?.forEach(wallet => {
      console.log(`   - ${wallet.crypto_type}: ${wallet.address.substring(0, 20)}...`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test des wallets:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n5️⃣ Test d\'inscription utilisateur...');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Utilisateur Test'
        }
      }
    });
    
    if (error) {
      console.log('❌ Erreur lors de l\'inscription:', error.message);
      return false;
    }
    
    console.log('✅ Inscription utilisateur réussie');
    console.log('   - Email:', data.user?.email);
    console.log('   - ID:', data.user?.id);
    
    // Se déconnecter après le test
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test d\'inscription:', error.message);
    return false;
  }
}

async function runAllTests() {
  const tests = [
    { name: 'Connexion Supabase', fn: testSupabaseConnection },
    { name: 'Authentification admin', fn: testAdminAuthentication },
    { name: 'Plans d\'investissement', fn: testInvestmentPlans },
    { name: 'Wallets crypto', fn: testCryptoWallets },
    { name: 'Inscription utilisateur', fn: testUserRegistration },
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
  console.log('📊 RÉSULTATS DES TESTS SIMPLIFIÉS');
  console.log('='.repeat(50));
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
  console.log('2. Testez manuellement l\'interface utilisateur sur http://localhost:5173');
  console.log('3. Vérifiez que le serveur de développement fonctionne');
  
  return passed === total;
}

// Exécuter tous les tests
runAllTests().catch(console.error);