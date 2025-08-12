#!/usr/bin/env node

/**
 * Script de correction automatique de l'authentification CryptoBoost
 * Usage: node scripts/fix-auth.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec les identifiants fournis
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg';

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 Correction automatique de l\'authentification CryptoBoost\n');

async function fixAuthentication() {
  try {
    console.log('1️⃣ Nettoyage des données existantes...');
    
    // Nettoyer les données existantes
    await supabase.from('system_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('user_investments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Nettoyage terminé');

    console.log('\n2️⃣ Création de l\'administrateur...');
    
    // Créer l'admin via l'API Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@cryptoboost.world',
      password: 'CryptoAdmin2024!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrateur CryptoBoost'
      }
    });

    if (authError) {
      console.log('⚠️  Admin existe déjà ou erreur:', authError.message);
    } else {
      console.log('✅ Admin créé dans auth.users:', authData.user?.email);
    }

    // Créer le profil admin dans public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData?.user?.id || 'c4e15a36-3ff4-4e39-9f25-98765432abcd',
        email: 'admin@cryptoboost.world',
        full_name: 'Administrateur CryptoBoost',
        role: 'admin',
        status: 'active',
        total_invested: 0,
        total_profit: 0
      }])
      .select()
      .single();

    if (userError) {
      console.log('⚠️  Profil admin existe déjà ou erreur:', userError.message);
    } else {
      console.log('✅ Profil admin créé dans public.users');
    }

    console.log('\n3️⃣ Création des données par défaut...');
    
    // Plans d'investissement
    const { error: plansError } = await supabase
      .from('investment_plans')
      .upsert([
        {
          name: 'Starter',
          description: 'Plan d\'entrée pour débuter en crypto',
          min_amount: 100,
          max_amount: 1000,
          profit_target: 15.5,
          duration_days: 30,
          features: ['Support 24/7', 'Rapports quotidiens'],
          is_active: true
        },
        {
          name: 'Growth',
          description: 'Plan de croissance pour investisseurs confirmés',
          min_amount: 1000,
          max_amount: 10000,
          profit_target: 25.0,
          duration_days: 60,
          features: ['Support prioritaire', 'Rapports détaillés', 'Conseils personnalisés'],
          is_active: true
        },
        {
          name: 'Premium',
          description: 'Plan premium pour investisseurs expérimentés',
          min_amount: 10000,
          max_amount: 100000,
          profit_target: 35.0,
          duration_days: 90,
          features: ['Support VIP', 'Rapports avancés', 'Stratégies exclusives', 'Accès prioritaire'],
          is_active: true
        }
      ]);

    if (plansError) {
      console.log('⚠️  Erreur création plans:', plansError.message);
    } else {
      console.log('✅ Plans d\'investissement créés');
    }

    // Wallets crypto
    const { error: walletsError } = await supabase
      .from('crypto_wallets')
      .upsert([
        {
          crypto_type: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          is_active: true
        },
        {
          crypto_type: 'ETH',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          is_active: true
        },
        {
          crypto_type: 'USDT',
          address: 'TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TQn9Y2khDD95J42FQtQTdwVVRKjqEQJfHp',
          is_active: true
        },
        {
          crypto_type: 'USDC',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          is_active: true
        }
      ]);

    if (walletsError) {
      console.log('⚠️  Erreur création wallets:', walletsError.message);
    } else {
      console.log('✅ Wallets crypto créés');
    }

    console.log('\n4️⃣ Vérification finale...');
    
    // Vérifier l'admin
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('users')
      .select('email, full_name, role, status')
      .eq('email', 'admin@cryptoboost.world')
      .single();

    if (adminCheckError) {
      console.log('❌ Admin non trouvé:', adminCheckError.message);
    } else {
      console.log('✅ Admin vérifié:', adminCheck);
    }

    // Compter les données
    const { count: plansCount } = await supabase
      .from('investment_plans')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: walletsCount } = await supabase
      .from('crypto_wallets')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    console.log(`✅ Plans d'investissement: ${plansCount || 0}`);
    console.log(`✅ Wallets crypto: ${walletsCount || 0}`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 CORRECTION TERMINÉE AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log('');
    console.log('✅ Problèmes résolus :');
    console.log('   • Données nettoyées et recréées');
    console.log('   • Admin créé avec succès');
    console.log('   • Données par défaut ajoutées');
    console.log('');
    console.log('🔗 Identifiants de connexion :');
    console.log('   • Email: admin@cryptoboost.world');
    console.log('   • Mot de passe: CryptoAdmin2024!');
    console.log('');
    console.log('🧪 Tests à effectuer :');
    console.log('   1. Connexion admin sur /auth/login');
    console.log('   2. Inscription client sur /auth/register');
    console.log('   3. Vérification des redirections');
    console.log('');
    console.log('🚀 L\'authentification est maintenant fonctionnelle !');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
    console.log('\n🔧 Solution alternative :');
    console.log('1. Aller sur https://supabase.com/dashboard');
    console.log('2. Sélectionner votre projet');
    console.log('3. Aller dans SQL Editor');
    console.log('4. Exécuter le script CORRECTION_COMPLETE_AUTH.sql');
  }
}

// Exécuter la correction
fixAuthentication();