#!/usr/bin/env node

/**
 * TEST ROUTES, BOUTONS ET FRONT-END - CRYPTOBOOST
 * Test complet des routes, accès client et boutons de connexion
 */

import fs from 'fs';

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
  log(`\n${colors.cyan}${'='.repeat(70)}`, 'cyan');
  log(`🔍 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(70)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TEST ROUTES PRINCIPALES
// ============================================================================

async function testMainRoutes() {
  logSection('TEST ROUTES PRINCIPALES');
  
  const mainRoutes = [
    { url: 'https://cryptoboost.world/', name: 'Page d\'accueil' },
    { url: 'https://cryptoboost.world/login', name: 'Page de connexion' },
    { url: 'https://cryptoboost.world/register', name: 'Page d\'inscription' },
    { url: 'https://cryptoboost.world/about', name: 'Page À propos' },
    { url: 'https://cryptoboost.world/contact', name: 'Page Contact' },
    { url: 'https://cryptoboost.world/terms', name: 'Page Conditions' },
    { url: 'https://cryptoboost.world/privacy', name: 'Page Confidentialité' }
  ];
  
  let successCount = 0;
  for (const route of mainRoutes) {
    try {
      const response = await fetch(route.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${route.name}: ${route.url} (Status ${response.status})`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name}: ${route.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name}: ${route.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Routes principales: ${successCount}/${mainRoutes.length} accessibles (${Math.round(successCount/mainRoutes.length*100)}%)`, 'cyan');
  
  return successCount === mainRoutes.length;
}

// ============================================================================
// TEST ACCÈS CLIENT
// ============================================================================

async function testClientAccess() {
  logSection('TEST ACCÈS CLIENT');
  
  const clientRoutes = [
    { url: 'https://cryptoboost.world/client', name: 'Dashboard Client' },
    { url: 'https://cryptoboost.world/client/profile', name: 'Profil Client' },
    { url: 'https://cryptoboost.world/client/investments', name: 'Investissements Client' },
    { url: 'https://cryptoboost.world/client/transactions', name: 'Transactions Client' },
    { url: 'https://cryptoboost.world/client/wallets', name: 'Wallets Client' }
  ];
  
  let successCount = 0;
  for (const route of clientRoutes) {
    try {
      const response = await fetch(route.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${route.name}: ${route.url} (Status ${response.status})`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name}: ${route.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${route.name}: ${route.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Accès client: ${successCount}/${clientRoutes.length} accessibles (${Math.round(successCount/clientRoutes.length*100)}%)`, 'cyan');
  
  return successCount === clientRoutes.length;
}

// ============================================================================
// VÉRIFICATION BOUTONS DE CONNEXION
// ============================================================================

function checkLoginButtons() {
  logSection('VÉRIFICATION BOUTONS DE CONNEXION');
  
  // Vérifier les composants avec boutons de connexion
  const loginComponents = [
    { path: 'src/components/layout/PublicHeader.tsx', name: 'Header Public' },
    { path: 'src/pages/public/Home.tsx', name: 'Page d\'accueil' },
    { path: 'src/components/auth/LoginForm.tsx', name: 'Formulaire de connexion' },
    { path: 'src/components/auth/RegisterForm.tsx', name: 'Formulaire d\'inscription' }
  ];
  
  let successCount = 0;
  for (const component of loginComponents) {
    if (fs.existsSync(component.path)) {
      const content = fs.readFileSync(component.path, 'utf8');
      const stats = fs.statSync(component.path);
      
      // Vérifier la présence de boutons de connexion
      const hasLoginButton = content.includes('Connexion') || content.includes('Se connecter') || content.includes('Login');
      const hasConnectButton = content.includes('Connecter') || content.includes('Connect') || content.includes('Connexion');
      const hasRegisterButton = content.includes('Inscription') || content.includes('S\'inscrire') || content.includes('Register');
      
      if (hasLoginButton || hasConnectButton || hasRegisterButton) {
        log(`✅ ${component.name}: ${component.path} (${stats.size} bytes) - Boutons trouvés`, 'green');
        successCount++;
      } else {
        log(`⚠️ ${component.name}: ${component.path} (${stats.size} bytes) - Aucun bouton trouvé`, 'yellow');
      }
    } else {
      log(`❌ ${component.name}: ${component.path} (manquant)`, 'red');
    }
  }
  
  log(`\n📊 Composants avec boutons: ${successCount}/${loginComponents.length} (${Math.round(successCount/loginComponents.length*100)}%)`, 'cyan');
  
  return successCount === loginComponents.length;
}

// ============================================================================
// VÉRIFICATION ROUTES DANS APP.TSX
// ============================================================================

function checkRoutesInApp() {
  logSection('VÉRIFICATION ROUTES DANS APP.TSX');
  
  if (fs.existsSync('src/App.tsx')) {
    const appContent = fs.readFileSync('src/App.tsx', 'utf8');
    
    const expectedRoutes = [
      '/',
      '/login',
      '/register',
      '/about',
      '/contact',
      '/terms',
      '/privacy',
      '/client',
      '/client/profile',
      '/client/investments',
      '/client/transactions',
      '/client/wallets',
      '/admin',
      '/admin/users',
      '/admin/transactions',
      '/admin/investments',
      '/admin/logs'
    ];
    
    let routesFound = 0;
    for (const route of expectedRoutes) {
      if (appContent.includes(route)) {
        log(`✅ Route trouvée: ${route}`, 'green');
        routesFound++;
      } else {
        log(`❌ Route manquante: ${route}`, 'red');
      }
    }
    
    log(`\n📊 Routes dans App.tsx: ${routesFound}/${expectedRoutes.length} trouvées (${Math.round(routesFound/expectedRoutes.length*100)}%)`, 'cyan');
    
    return routesFound === expectedRoutes.length;
  } else {
    log('❌ Fichier App.tsx manquant', 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION NAVIGATION
// ============================================================================

function checkNavigation() {
  logSection('VÉRIFICATION NAVIGATION');
  
  // Vérifier les composants de navigation
  const navigationComponents = [
    { path: 'src/components/layout/PublicHeader.tsx', name: 'Header Public' },
    { path: 'src/components/layout/PublicFooter.tsx', name: 'Footer Public' },
    { path: 'src/components/layout/ClientHeader.tsx', name: 'Header Client' },
    { path: 'src/components/layout/AdminHeader.tsx', name: 'Header Admin' }
  ];
  
  let successCount = 0;
  for (const component of navigationComponents) {
    if (fs.existsSync(component.path)) {
      const content = fs.readFileSync(component.path, 'utf8');
      const stats = fs.statSync(component.path);
      
      // Vérifier la présence de navigation
      const hasNavigation = content.includes('Link') || content.includes('useNavigate') || content.includes('href');
      const hasMenu = content.includes('Menu') || content.includes('Nav') || content.includes('navigation');
      
      if (hasNavigation || hasMenu) {
        log(`✅ ${component.name}: ${component.path} (${stats.size} bytes) - Navigation trouvée`, 'green');
        successCount++;
      } else {
        log(`⚠️ ${component.name}: ${component.path} (${stats.size} bytes) - Navigation limitée`, 'yellow');
      }
    } else {
      log(`❌ ${component.name}: ${component.path} (manquant)`, 'red');
    }
  }
  
  log(`\n📊 Composants de navigation: ${successCount}/${navigationComponents.length} (${Math.round(successCount/navigationComponents.length*100)}%)`, 'cyan');
  
  return successCount === navigationComponents.length;
}

// ============================================================================
// TEST BOUTONS DE CONNEXION SUR LE SITE
// ============================================================================

async function testLoginButtonsOnSite() {
  logSection('TEST BOUTONS DE CONNEXION SUR LE SITE');
  
  const testUrls = [
    { url: 'https://cryptoboost.world/', name: 'Page d\'accueil - Boutons connexion' },
    { url: 'https://cryptoboost.world/login', name: 'Page de connexion - Formulaire' },
    { url: 'https://cryptoboost.world/register', name: 'Page d\'inscription - Formulaire' }
  ];
  
  let successCount = 0;
  for (const testUrl of testUrls) {
    try {
      const response = await fetch(testUrl.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // Vérifier la présence de boutons de connexion dans le HTML
        const hasLoginButton = html.includes('Connexion') || html.includes('Se connecter') || html.includes('Login');
        const hasConnectButton = html.includes('Connecter') || html.includes('Connect');
        const hasRegisterButton = html.includes('Inscription') || html.includes('S\'inscrire') || html.includes('Register');
        
        if (hasLoginButton || hasConnectButton || hasRegisterButton) {
          log(`✅ ${testUrl.name}: ${testUrl.url} - Boutons trouvés`, 'green');
          successCount++;
        } else {
          log(`⚠️ ${testUrl.name}: ${testUrl.url} - Aucun bouton trouvé`, 'yellow');
        }
      } else {
        log(`❌ ${testUrl.name}: ${testUrl.url} (Status ${response.status})`, 'red');
      }
    } catch (error) {
      log(`❌ ${testUrl.name}: ${testUrl.url} (${error.message})`, 'red');
    }
  }
  
  log(`\n📊 Pages avec boutons: ${successCount}/${testUrls.length} (${Math.round(successCount/testUrls.length*100)}%)`, 'cyan');
  
  return successCount === testUrls.length;
}

// ============================================================================
// RAPPORT FINAL
// ============================================================================

async function generateFinalReport() {
  logSection('📊 RAPPORT FINAL - ROUTES, BOUTONS ET FRONT-END');
  
  // Tests
  const mainRoutesOk = await testMainRoutes();
  const clientAccessOk = await testClientAccess();
  const loginButtonsOk = checkLoginButtons();
  const routesInAppOk = checkRoutesInApp();
  const navigationOk = checkNavigation();
  const loginButtonsOnSiteOk = await testLoginButtonsOnSite();
  
  // Analyse des résultats
  logSection('📊 ANALYSE DES RÉSULTATS');
  
  const tests = [
    { name: 'Routes principales', result: mainRoutesOk },
    { name: 'Accès client', result: clientAccessOk },
    { name: 'Boutons de connexion (code)', result: loginButtonsOk },
    { name: 'Routes dans App.tsx', result: routesInAppOk },
    { name: 'Navigation', result: navigationOk },
    { name: 'Boutons de connexion (site)', result: loginButtonsOnSiteOk }
  ];
  
  let successCount = 0;
  for (const test of tests) {
    if (test.result) {
      log(`✅ ${test.name}: OK`, 'green');
      successCount++;
    } else {
      log(`❌ ${test.name}: PROBLÈME`, 'red');
    }
  }
  
  const percentage = Math.round((successCount / tests.length) * 100);
  
  log(`\n📊 Score global: ${successCount}/${tests.length} (${percentage}%)`, 'cyan');
  
  // Conclusion
  logSection('🎯 CONCLUSION');
  
  if (percentage >= 90) {
    log('🎉 FRONT-END PARFAIT !', 'green');
    log('✅ Toutes les routes fonctionnelles', 'green');
    log('✅ Accès client opérationnel', 'green');
    log('✅ Boutons de connexion présents', 'green');
    log('✅ Navigation complète', 'green');
  } else if (percentage >= 70) {
    log('✅ FRONT-END FONCTIONNEL', 'green');
    log('✅ La plupart des fonctionnalités opérationnelles', 'green');
    log('⚠️ Quelques améliorations possibles', 'yellow');
  } else {
    log('⚠️ FRONT-END AVEC PROBLÈMES', 'yellow');
    log('❌ Corrections nécessaires', 'red');
    log('⚠️ Fonctionnalités limitées', 'yellow');
  }
  
  // Détails spécifiques
  logSection('🔍 DÉTAILS SPÉCIFIQUES');
  
  if (mainRoutesOk) {
    log('✅ Routes principales: Toutes accessibles', 'green');
  } else {
    log('❌ Routes principales: Problèmes détectés', 'red');
  }
  
  if (clientAccessOk) {
    log('✅ Accès client: Tous les dashboards accessibles', 'green');
  } else {
    log('❌ Accès client: Problèmes d\'accès', 'red');
  }
  
  if (loginButtonsOk) {
    log('✅ Boutons de connexion: Présents dans le code', 'green');
  } else {
    log('❌ Boutons de connexion: Manquants dans le code', 'red');
  }
  
  if (loginButtonsOnSiteOk) {
    log('✅ Boutons de connexion: Fonctionnels sur le site', 'green');
  } else {
    log('❌ Boutons de connexion: Problèmes sur le site', 'red');
  }
}

// Exécution
generateFinalReport().catch(console.error);