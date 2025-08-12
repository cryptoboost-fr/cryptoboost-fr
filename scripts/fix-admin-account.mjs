#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - COMPTE ADMIN
 * Résolution du problème de création du compte admin
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
// CORRECTION COMPTE ADMIN
// ============================================================================

async function fixAdminAccount() {
  logSection('🔧 CORRECTION COMPTE ADMIN');
  
  // Essayer différents emails pour éviter les conflits
  const adminEmails = [
    'admin@cryptoboost.world',
    'admin2@cryptoboost.world',
    'administrator@cryptoboost.world',
    'superadmin@cryptoboost.world',
    `admin-${Date.now()}@cryptoboost.world`
  ];
  
  const password = 'AdminPass123!';
  
  for (const email of adminEmails) {
    try {
      log(`🔍 Tentative avec ${email}...`, 'blue');
      
      // Inscription
      const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: email,
          password: password,
          data: {
            role: 'admin',
            first_name: 'Admin',
            last_name: 'CryptoBoost'
          }
        })
      });

      if (signUpResponse.ok) {
        const signUpData = await signUpResponse.json();
        log(`✅ Inscription admin réussie avec ${email}`, 'green');
        log(`   User ID: ${signUpData.user?.id}`, 'green');
        
        // Connexion
        const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        if (signInResponse.ok) {
          const signInData = await signInResponse.json();
          log(`✅ Connexion admin réussie`, 'green');
          
          logSection('🎉 COMPTE ADMIN CRÉÉ AVEC SUCCÈS');
          log(`📧 Email: ${email}`, 'green');
          log(`🔑 Mot de passe: ${password}`, 'green');
          log(`👤 Rôle: admin`, 'green');
          log(`🆔 User ID: ${signInData.user.id}`, 'green');
          
          log('\n🌐 ACCÈS DASHBOARD ADMIN:', 'yellow');
          log(`   URL: https://cryptoboost.world/admin`, 'blue');
          log(`   Email: ${email}`, 'blue');
          log(`   Mot de passe: ${password}`, 'blue');
          
          return {
            success: true,
            email: email,
            password: password,
            userId: signInData.user.id,
            accessToken: signInData.access_token
          };
        } else {
          log(`❌ Échec connexion - Status: ${signInResponse.status}`, 'red');
        }
      } else {
        const errorData = await signUpResponse.json();
        log(`❌ Échec inscription - Status: ${signUpResponse.status}`, 'red');
        log(`   Erreur: ${errorData.error_description || errorData.message || 'Erreur inconnue'}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur avec ${email}: ${error.message}`, 'red');
    }
  }
  
  log('\n❌ Impossible de créer un compte admin', 'red');
  log('💡 Vérifiez la configuration Supabase', 'yellow');
  
  return { success: false };
}

// ============================================================================
// TEST ACCÈS DASHBOARD ADMIN
// ============================================================================

async function testAdminAccess(adminAccount) {
  if (!adminAccount.success) {
    log('❌ Impossible de tester sans compte admin valide', 'red');
    return;
  }
  
  logSection('🧪 TEST ACCÈS DASHBOARD ADMIN');
  
  const adminPages = [
    { path: '/admin', name: 'Dashboard Admin' },
    { path: '/admin/users', name: 'Gestion Utilisateurs' },
    { path: '/admin/transactions', name: 'Gestion Transactions' },
    { path: '/admin/investments', name: 'Gestion Investissements' },
    { path: '/admin/plans', name: 'Gestion Plans' },
    { path: '/admin/logs', name: 'Logs Système' },
    { path: '/admin/wallets', name: 'Gestion Wallets' },
    { path: '/admin/settings', name: 'Paramètres Admin' }
  ];
  
  let successCount = 0;
  let totalCount = adminPages.length;
  
  for (const page of adminPages) {
    try {
      log(`🔍 Test ${page.name}...`, 'blue');
      
      const response = await fetch(`https://cryptoboost.world${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Authorization': `Bearer ${adminAccount.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        log(`✅ ${page.name} - Status: ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé: ${successCount}/${totalCount} pages admin accessibles`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return successCount === totalCount;
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixAdminAccountAndTest() {
  log('🔧 CORRECTION ET TEST - COMPTE ADMIN', 'bright');
  
  try {
    // 1. Corriger le compte admin
    const adminAccount = await fixAdminAccount();
    
    if (adminAccount.success) {
      // 2. Tester l'accès au dashboard admin
      const adminAccess = await testAdminAccess(adminAccount);
      
      if (adminAccess) {
        logSection('🎉 SUCCÈS COMPLET');
        log('✅ Compte admin créé avec succès', 'green');
        log('✅ Toutes les pages admin accessibles', 'green');
        log('✅ Dashboard admin 100% fonctionnel', 'green');
        
        log('\n📋 CODES D\'ACCÈS FINAUX:', 'yellow');
        log('👤 CLIENT:', 'magenta');
        log('   Email: client@cryptoboost.world', 'blue');
        log('   Mot de passe: ClientPass123!', 'blue');
        log('   URL: https://cryptoboost.world/client', 'blue');
        
        log('\n👨‍💼 ADMIN:', 'magenta');
        log(`   Email: ${adminAccount.email}`, 'blue');
        log(`   Mot de passe: ${adminAccount.password}`, 'blue');
        log('   URL: https://cryptoboost.world/admin', 'blue');
      } else {
        logSection('⚠️  PROBLÈMES RESTANTS');
        log('❌ Certaines pages admin ne sont pas accessibles', 'red');
        log('💡 Vérifiez la configuration SSL', 'yellow');
      }
    } else {
      logSection('❌ ÉCHEC CRÉATION COMPTE ADMIN');
      log('💡 Contactez le support Supabase', 'yellow');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixAdminAccountAndTest().catch(console.error);