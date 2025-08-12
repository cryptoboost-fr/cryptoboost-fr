#!/usr/bin/env node

/**
 * DIAGNOSTIC COMPLET BUGS - CRYPTOBOOST
 * Diagnostic complet pour identifier tous les bugs potentiels
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
// TEST 1: ROUTES ET NAVIGATION
// ============================================================================

async function testRoutesAndNavigation() {
  logSection('TEST 1: ROUTES ET NAVIGATION');
  
  const routes = [
    { path: '/', name: 'Accueil' },
    { path: '/login-alt.html', name: 'Login Alternative' },
    { path: '/register', name: 'Register' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/terms', name: 'Terms' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/client', name: 'Dashboard Client' },
    { path: '/client/profile', name: 'Profil Client' },
    { path: '/client/investments', name: 'Investissements Client' },
    { path: '/client/transactions', name: 'Transactions Client' },
    { path: '/client/wallets', name: 'Wallets Client' },
    { path: '/client/notifications', name: 'Notifications Client' },
    { path: '/client/exchange', name: 'Exchange Client' },
    { path: '/client/settings', name: 'Paramètres Client' },
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
  let totalCount = routes.length;
  let bugs = [];
  
  for (const route of routes) {
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
        log(`✅ ${route.name} - Status: ${response.status}`, 'green');
        
        // Vérifier les bugs potentiels dans le contenu
        if (content.includes('error') || content.includes('Error')) {
          bugs.push(`⚠️ ${route.name}: Contient des erreurs dans le contenu`);
        }
        if (content.includes('undefined') || content.includes('null')) {
          bugs.push(`⚠️ ${route.name}: Contient des valeurs undefined/null`);
        }
        if (content.includes('console.error')) {
          bugs.push(`⚠️ ${route.name}: Contient des console.error`);
        }
        
        successCount++;
      } else {
        log(`❌ ${route.name} - Status: ${response.status}`, 'red');
        bugs.push(`❌ ${route.name}: Status ${response.status} - Route cassée`);
      }
    } catch (error) {
      log(`❌ ${route.name} - Erreur: ${error.message}`, 'red');
      bugs.push(`❌ ${route.name}: Erreur de connexion - ${error.message}`);
    }
  }
  
  log(`\n📊 Résumé routes: ${successCount}/${totalCount}`, 
      successCount === totalCount ? 'green' : 'yellow');
  
  return { successCount, totalCount, bugs };
}

// ============================================================================
// TEST 2: BOUTONS ET FORMULAIRES
// ============================================================================

async function testButtonsAndForms() {
  logSection('TEST 2: BOUTONS ET FORMULAIRES');
  
  const testPages = [
    { path: '/login-alt.html', name: 'Login Alternative' },
    { path: '/register', name: 'Register' }
  ];
  
  let bugs = [];
  
  for (const page of testPages) {
    try {
      log(`🔍 Test boutons ${page.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${page.name} accessible`, 'green');
        
        // Vérifier les boutons et formulaires
        const hasForm = content.includes('<form') || content.includes('form');
        const hasInput = content.includes('<input') || content.includes('input');
        const hasButton = content.includes('<button') || content.includes('button');
        const hasSubmit = content.includes('submit') || content.includes('Submit');
        
        if (!hasForm) bugs.push(`⚠️ ${page.name}: Formulaire manquant`);
        if (!hasInput) bugs.push(`⚠️ ${page.name}: Champs input manquants`);
        if (!hasButton) bugs.push(`⚠️ ${page.name}: Boutons manquants`);
        if (!hasSubmit) bugs.push(`⚠️ ${page.name}: Bouton submit manquant`);
        
        // Vérifier les bugs JavaScript
        if (content.includes('onclick=') && content.includes('javascript:')) {
          bugs.push(`⚠️ ${page.name}: Utilisation de javascript: dans onclick`);
        }
        if (content.includes('eval(')) {
          bugs.push(`❌ ${page.name}: Utilisation d'eval() - Sécurité compromise`);
        }
        
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
        bugs.push(`❌ ${page.name}: Page inaccessible - Status ${response.status}`);
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
      bugs.push(`❌ ${page.name}: Erreur de connexion - ${error.message}`);
    }
  }
  
  return { bugs };
}

// ============================================================================
// TEST 3: RÔLES ET PERMISSIONS
// ============================================================================

async function testRolesAndPermissions() {
  logSection('TEST 3: RÔLES ET PERMISSIONS');
  
  const roleTests = [
    { path: '/client', name: 'Dashboard Client', expectedRole: 'client' },
    { path: '/admin', name: 'Dashboard Admin', expectedRole: 'admin' }
  ];
  
  let bugs = [];
  
  for (const test of roleTests) {
    try {
      log(`🔍 Test rôle ${test.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${test.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${test.name} accessible`, 'green');
        
        // Vérifier la présence de contenu spécifique au rôle
        const hasRoleContent = content.includes(test.expectedRole) || 
                              content.includes(test.expectedRole.charAt(0).toUpperCase() + test.expectedRole.slice(1));
        
        if (!hasRoleContent) {
          bugs.push(`⚠️ ${test.name}: Contenu spécifique au rôle manquant`);
        }
        
        // Vérifier les liens de navigation appropriés
        if (test.expectedRole === 'client') {
          if (!content.includes('/client/')) {
            bugs.push(`⚠️ ${test.name}: Liens de navigation client manquants`);
          }
        } else if (test.expectedRole === 'admin') {
          if (!content.includes('/admin/')) {
            bugs.push(`⚠️ ${test.name}: Liens de navigation admin manquants`);
          }
        }
        
      } else {
        log(`❌ ${test.name} - Status: ${response.status}`, 'red');
        bugs.push(`❌ ${test.name}: Page inaccessible - Status ${response.status}`);
      }
    } catch (error) {
      log(`❌ ${test.name} - Erreur: ${error.message}`, 'red');
      bugs.push(`❌ ${test.name}: Erreur de connexion - ${error.message}`);
    }
  }
  
  return { bugs };
}

// ============================================================================
// TEST 4: FONCTIONNALITÉS MÉTIER
// ============================================================================

async function testBusinessFeatures() {
  logSection('TEST 4: FONCTIONNALITÉS MÉTIER');
  
  const businessPages = [
    { path: '/client/investments', name: 'Investissements', feature: 'gestion investissements' },
    { path: '/client/transactions', name: 'Transactions', feature: 'historique transactions' },
    { path: '/client/wallets', name: 'Wallets', feature: 'gestion wallets' },
    { path: '/client/exchange', name: 'Exchange', feature: 'échange crypto' },
    { path: '/admin/users', name: 'Gestion Utilisateurs', feature: 'administration utilisateurs' },
    { path: '/admin/transactions', name: 'Gestion Transactions', feature: 'administration transactions' }
  ];
  
  let bugs = [];
  
  for (const page of businessPages) {
    try {
      log(`🔍 Test ${page.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const content = await response.text();
        log(`✅ ${page.name} accessible`, 'green');
        
        // Vérifier la présence de fonctionnalités métier
        const hasBusinessContent = content.includes('investissement') || 
                                  content.includes('transaction') || 
                                  content.includes('wallet') || 
                                  content.includes('exchange') ||
                                  content.includes('utilisateur') ||
                                  content.includes('admin');
        
        if (!hasBusinessContent) {
          bugs.push(`⚠️ ${page.name}: Contenu métier manquant pour ${page.feature}`);
        }
        
        // Vérifier les tableaux de données
        const hasTable = content.includes('<table') || content.includes('table');
        if (!hasTable) {
          bugs.push(`⚠️ ${page.name}: Tableau de données manquant`);
        }
        
        // Vérifier les boutons d'action
        const hasActionButtons = content.includes('button') || content.includes('Button');
        if (!hasActionButtons) {
          bugs.push(`⚠️ ${page.name}: Boutons d'action manquants`);
        }
        
      } else {
        log(`❌ ${page.name} - Status: ${response.status}`, 'red');
        bugs.push(`❌ ${page.name}: Page inaccessible - Status ${response.status}`);
      }
    } catch (error) {
      log(`❌ ${page.name} - Erreur: ${error.message}`, 'red');
      bugs.push(`❌ ${page.name}: Erreur de connexion - ${error.message}`);
    }
  }
  
  return { bugs };
}

// ============================================================================
// TEST 5: COORDINATION MÉTIER
// ============================================================================

async function testBusinessCoordination() {
  logSection('TEST 5: COORDINATION MÉTIER');
  
  let bugs = [];
  
  // Test de la cohérence entre les pages
  try {
    log(`🔍 Test cohérence métier...`, 'blue');
    
    // Vérifier la cohérence des liens entre pages
    const response = await fetch(`${SITE_URL}/client`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const content = await response.text();
      log(`✅ Dashboard client accessible`, 'green');
      
      // Vérifier les liens vers les fonctionnalités métier
      const hasInvestmentLink = content.includes('/client/investments') || content.includes('investissement');
      const hasTransactionLink = content.includes('/client/transactions') || content.includes('transaction');
      const hasWalletLink = content.includes('/client/wallets') || content.includes('wallet');
      
      if (!hasInvestmentLink) bugs.push(`⚠️ Dashboard client: Lien vers investissements manquant`);
      if (!hasTransactionLink) bugs.push(`⚠️ Dashboard client: Lien vers transactions manquant`);
      if (!hasWalletLink) bugs.push(`⚠️ Dashboard client: Lien vers wallets manquant`);
      
    } else {
      bugs.push(`❌ Dashboard client: Page inaccessible - Status ${response.status}`);
    }
    
  } catch (error) {
    bugs.push(`❌ Test cohérence métier: Erreur - ${error.message}`);
  }
  
  return { bugs };
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function diagnosticCompletBugs() {
  log('🔍 DIAGNOSTIC COMPLET BUGS - CRYPTOBOOST', 'bright');
  log('Identification de tous les bugs potentiels', 'cyan');
  
  try {
    // 1. Test routes et navigation
    const routesResult = await testRoutesAndNavigation();
    
    // 2. Test boutons et formulaires
    const buttonsResult = await testButtonsAndForms();
    
    // 3. Test rôles et permissions
    const rolesResult = await testRolesAndPermissions();
    
    // 4. Test fonctionnalités métier
    const businessResult = await testBusinessFeatures();
    
    // 5. Test coordination métier
    const coordinationResult = await testBusinessCoordination();
    
    // Compilation de tous les bugs
    const allBugs = [
      ...routesResult.bugs,
      ...buttonsResult.bugs,
      ...rolesResult.bugs,
      ...businessResult.bugs,
      ...coordinationResult.bugs
    ];
    
    // Résumé final
    logSection('📊 RÉSUMÉ DIAGNOSTIC COMPLET');
    log(`✅ Routes fonctionnelles: ${routesResult.successCount}/${routesResult.totalCount}`, 
        routesResult.successCount === routesResult.totalCount ? 'green' : 'yellow');
    
    log(`\n🔍 BUGS IDENTIFIÉS (${allBugs.length}):`, 'yellow');
    
    if (allBugs.length === 0) {
      log('✅ Aucun bug identifié !', 'green');
    } else {
      allBugs.forEach((bug, index) => {
        const color = bug.includes('❌') ? 'red' : 'yellow';
        log(`${index + 1}. ${bug}`, color);
      });
    }
    
    // Catégorisation des bugs
    const criticalBugs = allBugs.filter(bug => bug.includes('❌'));
    const warningBugs = allBugs.filter(bug => bug.includes('⚠️'));
    
    log(`\n📊 CATÉGORISATION:`, 'cyan');
    log(`❌ Bugs critiques: ${criticalBugs.length}`, criticalBugs.length > 0 ? 'red' : 'green');
    log(`⚠️ Avertissements: ${warningBugs.length}`, warningBugs.length > 0 ? 'yellow' : 'green');
    
    if (criticalBugs.length > 0) {
      logSection('🚨 BUGS CRITIQUES À CORRIGER');
      criticalBugs.forEach((bug, index) => {
        log(`${index + 1}. ${bug}`, 'red');
      });
    }
    
    if (warningBugs.length > 0) {
      logSection('⚠️ AVERTISSEMENTS À VÉRIFIER');
      warningBugs.forEach((bug, index) => {
        log(`${index + 1}. ${bug}`, 'yellow');
      });
    }
    
    // Recommandations
    logSection('💡 RECOMMANDATIONS');
    if (allBugs.length === 0) {
      log('✅ Application en bon état - Aucune correction nécessaire', 'green');
    } else {
      log('🔧 Corrections recommandées:', 'yellow');
      if (criticalBugs.length > 0) {
        log('1. Corriger les bugs critiques en priorité', 'red');
      }
      if (warningBugs.length > 0) {
        log('2. Vérifier et améliorer les avertissements', 'yellow');
      }
      log('3. Tester manuellement les fonctionnalités', 'blue');
      log('4. Vérifier la cohérence métier', 'blue');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du diagnostic complet', 'red');
    log(error.message, 'red');
  }
}

// Exécution
diagnosticCompletBugs().catch(console.error);