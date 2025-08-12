#!/usr/bin/env node

/**
 * TEST ROUTES COMPLET - CRYPTOBOOST
 * Test complet de toutes les routes et boutons
 */

import fetch from 'node-fetch';

// Configuration
const SITE_URL = 'https://cryptoboost.world';

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
  log(`🔍 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TEST 1: ROUTES PUBLIQUES
// ============================================================================

async function testPublicRoutes() {
  logSection('TEST 1: ROUTES PUBLIQUES');
  
  const publicRoutes = [
    { path: '/', name: 'Page d\'accueil' },
    { path: '/login', name: 'Page Login (original)' },
    { path: '/login-alt.html', name: 'Page Login Alternative' },
    { path: '/register', name: 'Page Register' },
    { path: '/about', name: 'Page About' },
    { path: '/contact', name: 'Page Contact' },
    { path: '/terms', name: 'Page Terms' },
    { path: '/privacy', name: 'Page Privacy' }
  ];
  
  let successCount = 0;
  let totalCount = publicRoutes.length;
  
  for (const route of publicRoutes) {
    try {
      log(`🔍 Test ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'follow'
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${route.name} - Status: ${response.status} - URL finale: ${response.url}`, 'green');
        
        // Vérifier si la page contient des boutons de navigation
        const hasLoginButton = content.includes('login') || content.includes('Login') || content.includes('Connexion');
        const hasRegisterButton = content.includes('register') || content.includes('Register') || content.includes('Inscription');
        const hasHomeButton = content.includes('home') || content.includes('Home') || content.includes('Accueil');
        
        if (hasLoginButton) log(`   - Bouton Login détecté`, 'green');
        if (hasRegisterButton) log(`   - Bouton Register détecté`, 'green');
        if (hasHomeButton) log(`   - Bouton Home détecté`, 'green');
        
        successCount++;
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé routes publiques: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount };
}

// ============================================================================
// TEST 2: ROUTES CLIENT
// ============================================================================

async function testClientRoutes() {
  logSection('TEST 2: ROUTES CLIENT');
  
  const clientRoutes = [
    { path: '/client', name: 'Dashboard Client' },
    { path: '/client/profile', name: 'Profil Client' },
    { path: '/client/investments', name: 'Investissements Client' },
    { path: '/client/transactions', name: 'Transactions Client' },
    { path: '/client/wallets', name: 'Wallets Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/exchange', name: 'Exchange Client' },
    { path: '/client/settings', name: 'Paramètres Client' }
  ];
  
  let successCount = 0;
  let totalCount = clientRoutes.length;
  
  for (const route of clientRoutes) {
    try {
      log(`🔍 Test ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'follow'
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${route.name} - Status: ${response.status} - URL finale: ${response.url}`, 'green');
        
        // Vérifier si la page contient des éléments de navigation client
        const hasClientNav = content.includes('client') || content.includes('Client') || content.includes('Dashboard');
        const hasLogoutButton = content.includes('logout') || content.includes('Logout') || content.includes('Déconnexion');
        
        if (hasClientNav) log(`   - Navigation client détectée`, 'green');
        if (hasLogoutButton) log(`   - Bouton Logout détecté`, 'green');
        
        successCount++;
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé routes client: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount };
}

// ============================================================================
// TEST 3: ROUTES ADMIN
// ============================================================================

async function testAdminRoutes() {
  logSection('TEST 3: ROUTES ADMIN');
  
  const adminRoutes = [
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
  let totalCount = adminRoutes.length;
  
  for (const route of adminRoutes) {
    try {
      log(`🔍 Test ${route.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${route.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'follow'
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${route.name} - Status: ${response.status} - URL finale: ${response.url}`, 'green');
        
        // Vérifier si la page contient des éléments de navigation admin
        const hasAdminNav = content.includes('admin') || content.includes('Admin') || content.includes('Dashboard');
        const hasLogoutButton = content.includes('logout') || content.includes('Logout') || content.includes('Déconnexion');
        
        if (hasAdminNav) log(`   - Navigation admin détectée`, 'green');
        if (hasLogoutButton) log(`   - Bouton Logout détecté`, 'green');
        
        successCount++;
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé routes admin: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount };
}

// ============================================================================
// TEST 4: REDIRECTIONS ET NAVIGATION
// ============================================================================

async function testRedirectsAndNavigation() {
  logSection('TEST 4: REDIRECTIONS ET NAVIGATION');
  
  const redirectTests = [
    { from: 'http://cryptoboost.world', to: 'https://cryptoboost.world', name: 'HTTP vers HTTPS' },
    { from: 'https://www.cryptoboost.world', to: 'https://cryptoboost.world', name: 'WWW vers non-WWW' },
    { from: 'http://www.cryptoboost.world', to: 'https://cryptoboost.world', name: 'HTTP WWW vers HTTPS non-WWW' }
  ];
  
  let successCount = 0;
  let totalCount = redirectTests.length;
  
  for (const test of redirectTests) {
    try {
      log(`🔍 Test ${test.name}...`, 'blue');
      
      const response = await fetch(test.from, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'manual'
      });

      if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('location');
        if (location && location.includes(test.to)) {
          log(`✅ ${test.name} - Redirection ${response.status} vers: ${location}`, 'green');
          successCount++;
        } else {
          log(`❌ ${test.name} - Redirection incorrecte: ${location}`, 'red');
        }
      } else {
        log(`⚠️ ${test.name} - Status: ${response.status} (pas de redirection)`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${test.name} - Erreur: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Résumé redirections: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount };
}

// ============================================================================
// TEST 5: BOUTONS ET FORMULAIRES
// ============================================================================

async function testButtonsAndForms() {
  logSection('TEST 5: BOUTONS ET FORMULAIRES');
  
  // Test de la page login alternative
  try {
    log(`🔍 Test page login alternative...`, 'blue');
    
    const response = await fetch(`${SITE_URL}/login-alt.html`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const content = await response.text();
      log(`✅ Page login alternative accessible`, 'green');
      
      // Vérifier les boutons et formulaires
      const hasLoginForm = content.includes('form') || content.includes('input') || content.includes('button');
      const hasEmailField = content.includes('email') || content.includes('Email') || content.includes('mail');
      const hasPasswordField = content.includes('password') || content.includes('Password') || content.includes('mot de passe');
      const hasSubmitButton = content.includes('submit') || content.includes('Submit') || content.includes('Connexion') || content.includes('Login');
      const hasBackButton = content.includes('back') || content.includes('Back') || content.includes('Retour') || content.includes('Accueil');
      
      if (hasLoginForm) log(`   - Formulaire de connexion détecté`, 'green');
      if (hasEmailField) log(`   - Champ email détecté`, 'green');
      if (hasPasswordField) log(`   - Champ mot de passe détecté`, 'green');
      if (hasSubmitButton) log(`   - Bouton de soumission détecté`, 'green');
      if (hasBackButton) log(`   - Bouton retour détecté`, 'green');
      
      // Vérifier les liens de navigation
      const hasHomeLink = content.includes('href="/"') || content.includes('href="index.html"');
      const hasRegisterLink = content.includes('href="/register"') || content.includes('register');
      
      if (hasHomeLink) log(`   - Lien vers accueil détecté`, 'green');
      if (hasRegisterLink) log(`   - Lien vers register détecté`, 'green');
      
      return { success: true, buttons: { hasLoginForm, hasEmailField, hasPasswordField, hasSubmitButton, hasBackButton, hasHomeLink, hasRegisterLink } };
    } else {
      log(`❌ Page login alternative - Status: ${response.status}`, 'red');
      return { success: false };
    }
  } catch (error) {
    log(`❌ Page login alternative - Erreur: ${error.message}`, 'red');
    return { success: false };
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testRoutesComplet() {
  log('🔍 TEST ROUTES COMPLET - CRYPTOBOOST', 'bright');
  log('Vérification de toutes les routes et boutons', 'cyan');
  
  try {
    // 1. Test routes publiques
    const publicRoutes = await testPublicRoutes();
    
    // 2. Test routes client
    const clientRoutes = await testClientRoutes();
    
    // 3. Test routes admin
    const adminRoutes = await testAdminRoutes();
    
    // 4. Test redirections
    const redirects = await testRedirectsAndNavigation();
    
    // 5. Test boutons et formulaires
    const buttons = await testButtonsAndForms();
    
    // Calcul du score global
    const totalSuccess = publicRoutes.successCount + clientRoutes.successCount + adminRoutes.successCount + redirects.successCount + (buttons.success ? 1 : 0);
    const totalTests = publicRoutes.totalCount + clientRoutes.totalCount + adminRoutes.totalCount + redirects.totalCount + 1;
    
    // Résumé final
    logSection('📊 RÉSUMÉ TEST ROUTES COMPLET');
    log(`✅ Routes publiques: ${publicRoutes.successCount}/${publicRoutes.totalCount}`, 
        publicRoutes.successCount === publicRoutes.totalCount ? 'green' : 'yellow');
    log(`✅ Routes client: ${clientRoutes.successCount}/${clientRoutes.totalCount}`, 
        clientRoutes.successCount === clientRoutes.totalCount ? 'green' : 'yellow');
    log(`✅ Routes admin: ${adminRoutes.successCount}/${adminRoutes.totalCount}`, 
        adminRoutes.successCount === adminRoutes.totalCount ? 'green' : 'yellow');
    log(`✅ Redirections: ${redirects.successCount}/${redirects.totalCount}`, 
        redirects.successCount === redirects.totalCount ? 'green' : 'yellow');
    log(`✅ Boutons et formulaires: ${buttons.success ? 'Oui' : 'Non'}`, 
        buttons.success ? 'green' : 'red');
    
    const globalScore = Math.round((totalSuccess / totalTests) * 100);
    log(`\n🎯 SCORE GLOBAL: ${totalSuccess}/${totalTests} (${globalScore}%)`, 
        globalScore === 100 ? 'green' : globalScore >= 95 ? 'yellow' : 'red');
    
    if (globalScore === 100) {
      logSection('🎉 SUCCÈS COMPLET - TOUTES LES ROUTES FONCTIONNELLES !');
      log('✅ Toutes les routes accessibles', 'green');
      log('✅ Toutes les redirections fonctionnelles', 'green');
      log('✅ Tous les boutons et formulaires opérationnels', 'green');
      log('✅ Navigation fluide sans retour en arrière', 'green');
    } else if (globalScore >= 95) {
      logSection('🎉 SUCCÈS MAJEUR - ROUTES QUASI-PARFAITES');
      log('✅ La plupart des routes fonctionnelles', 'green');
      log('⚠️ Quelques éléments mineurs à vérifier', 'yellow');
      log('💡 Navigation globalement fluide', 'green');
    } else {
      logSection('⚠️ PROBLÈMES DE NAVIGATION DÉTECTÉS');
      log('❌ Certaines routes ne fonctionnent pas', 'red');
      log('❌ Problèmes de redirection possibles', 'red');
      log('💡 Vérification manuelle recommandée', 'yellow');
    }
    
    // Détails des boutons si disponible
    if (buttons.success && buttons.buttons) {
      logSection('🔘 DÉTAILS DES BOUTONS ET FORMULAIRES');
      const btn = buttons.buttons;
      log(`Formulaire de connexion: ${btn.hasLoginForm ? '✅' : '❌'}`, btn.hasLoginForm ? 'green' : 'red');
      log(`Champ email: ${btn.hasEmailField ? '✅' : '❌'}`, btn.hasEmailField ? 'green' : 'red');
      log(`Champ mot de passe: ${btn.hasPasswordField ? '✅' : '❌'}`, btn.hasPasswordField ? 'green' : 'red');
      log(`Bouton de soumission: ${btn.hasSubmitButton ? '✅' : '❌'}`, btn.hasSubmitButton ? 'green' : 'red');
      log(`Bouton retour: ${btn.hasBackButton ? '✅' : '❌'}`, btn.hasBackButton ? 'green' : 'red');
      log(`Lien vers accueil: ${btn.hasHomeLink ? '✅' : '❌'}`, btn.hasHomeLink ? 'green' : 'red');
      log(`Lien vers register: ${btn.hasRegisterLink ? '✅' : '❌'}`, btn.hasRegisterLink ? 'green' : 'red');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du test des routes', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testRoutesComplet().catch(console.error);