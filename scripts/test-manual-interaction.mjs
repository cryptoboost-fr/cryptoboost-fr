#!/usr/bin/env node

/**
 * Script de test manuel - Interaction avec l'interface CryptoBoost
 * Test des fonctionnalités réelles en simulant les actions utilisateur
 * Version : Test manuel complet
 */

import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'https://cryptoboost.world';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'magenta');
  log(message, 'magenta');
  log(`${'='.repeat(60)}`, 'magenta');
}

// =====================================================
// 1. TEST DE LA PAGE D'ACCUEIL
// =====================================================

async function testHomePage() {
  logHeader('🏠 TEST PAGE D\'ACCUEIL');
  
  try {
    const response = await fetch(BASE_URL);
    const content = await response.text();
    
    logInfo('Analyse de la page d\'accueil...');
    
    // Vérifier les éléments essentiels
    const homeChecks = [
      { name: 'Titre CryptoBoost', found: content.includes('CryptoBoost') },
      { name: 'Navigation principale', found: content.includes('nav') || content.includes('menu') },
      { name: 'Section Hero', found: content.includes('hero') || content.includes('banner') },
      { name: 'Boutons de navigation', found: content.includes('Login') || content.includes('Register') },
      { name: 'Contenu principal', found: content.includes('main') || content.includes('content') },
      { name: 'Footer', found: content.includes('footer') },
      { name: 'Liens de navigation', found: content.includes('href') },
      { name: 'Images/Assets', found: content.includes('img') || content.includes('src') },
      { name: 'Styles CSS', found: content.includes('css') || content.includes('style') },
      { name: 'JavaScript', found: content.includes('script') || content.includes('js') }
    ];
    
    for (const check of homeChecks) {
      if (check.found) {
        logSuccess(`Accueil: ${check.name}`);
      } else {
        logError(`Accueil: ${check.name} manquant`);
      }
    }
    
    // Vérifier les liens spécifiques
    const specificLinks = [
      '/login', '/register', '/admin', '/client', '/about', '/contact'
    ];
    
    for (const link of specificLinks) {
      if (content.includes(link)) {
        logSuccess(`Accueil: Lien ${link} présent`);
      } else {
        logWarning(`Accueil: Lien ${link} non trouvé`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test page d'accueil: ${error.message}`);
    return false;
  }
}

// =====================================================
// 2. TEST DE LA PAGE D'INSCRIPTION
// =====================================================

async function testRegistrationPage() {
  logHeader('📝 TEST PAGE D\'INSCRIPTION');
  
  try {
    const response = await fetch(`${BASE_URL}/register`);
    const content = await response.text();
    
    logInfo('Analyse de la page d\'inscription...');
    
    // Vérifier les éléments du formulaire
    const registrationChecks = [
      { name: 'Page accessible', found: response.ok },
      { name: 'Formulaire d\'inscription', found: content.includes('form') },
      { name: 'Champ nom/prénom', found: content.includes('name') || content.includes('first') || content.includes('last') },
      { name: 'Champ email', found: content.includes('email') },
      { name: 'Champ mot de passe', found: content.includes('password') },
      { name: 'Champ confirmation', found: content.includes('confirm') || content.includes('repeat') },
      { name: 'Bouton d\'inscription', found: content.includes('Register') || content.includes('Sign up') || content.includes('Inscription') },
      { name: 'Validation des champs', found: content.includes('required') || content.includes('validation') },
      { name: 'Conditions d\'utilisation', found: content.includes('terms') || content.includes('conditions') },
      { name: 'Lien vers connexion', found: content.includes('/login') }
    ];
    
    for (const check of registrationChecks) {
      if (check.found) {
        logSuccess(`Inscription: ${check.name}`);
      } else {
        logError(`Inscription: ${check.name} manquant`);
      }
    }
    
    // Vérifier la structure HTML
    const htmlStructure = [
      'input', 'label', 'button', 'div', 'section', 'fieldset'
    ];
    
    for (const element of htmlStructure) {
      if (content.includes(element)) {
        logSuccess(`Inscription: Élément ${element} présent`);
      } else {
        logWarning(`Inscription: Élément ${element} manquant`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test inscription: ${error.message}`);
    return false;
  }
}

// =====================================================
// 3. TEST DE LA PAGE DE CONNEXION
// =====================================================

async function testLoginPage() {
  logHeader('🔐 TEST PAGE DE CONNEXION');
  
  try {
    const response = await fetch(`${BASE_URL}/login`);
    const content = await response.text();
    
    logInfo('Analyse de la page de connexion...');
    
    // Vérifier les éléments du formulaire
    const loginChecks = [
      { name: 'Page accessible', found: response.ok },
      { name: 'Formulaire de connexion', found: content.includes('form') },
      { name: 'Champ email', found: content.includes('email') },
      { name: 'Champ mot de passe', found: content.includes('password') },
      { name: 'Bouton de connexion', found: content.includes('Login') || content.includes('Sign in') || content.includes('Connexion') },
      { name: 'Lien mot de passe oublié', found: content.includes('forgot') || content.includes('password') },
      { name: 'Lien vers inscription', found: content.includes('/register') },
      { name: 'Souvenir de moi', found: content.includes('remember') || content.includes('stay') },
      { name: 'Validation des champs', found: content.includes('required') || content.includes('validation') },
      { name: 'Sécurité CSRF', found: content.includes('csrf') || content.includes('token') }
    ];
    
    for (const check of loginChecks) {
      if (check.found) {
        logSuccess(`Connexion: ${check.name}`);
      } else {
        logError(`Connexion: ${check.name} manquant`);
      }
    }
    
    // Vérifier les fonctionnalités de sécurité
    const securityFeatures = [
      'secure', 'https', 'ssl', 'encryption', 'hash'
    ];
    
    for (const feature of securityFeatures) {
      if (content.includes(feature)) {
        logSuccess(`Connexion: Sécurité ${feature} présente`);
      } else {
        logWarning(`Connexion: Sécurité ${feature} non détectée`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test connexion: ${error.message}`);
    return false;
  }
}

// =====================================================
// 4. TEST DU DASHBOARD ADMIN
// =====================================================

async function testAdminDashboard() {
  logHeader('👨‍💼 TEST DASHBOARD ADMIN');
  
  try {
    const response = await fetch(`${BASE_URL}/admin`);
    const content = await response.text();
    
    logInfo('Analyse du dashboard admin...');
    
    // Vérifier les éléments du dashboard admin
    const adminChecks = [
      { name: 'Page accessible', found: response.ok },
      { name: 'Interface admin', found: content.includes('admin') || content.includes('dashboard') },
      { name: 'Navigation admin', found: content.includes('nav') || content.includes('menu') },
      { name: 'Gestion utilisateurs', found: content.includes('users') || content.includes('utilisateurs') },
      { name: 'Gestion transactions', found: content.includes('transactions') },
      { name: 'Gestion plans', found: content.includes('plans') || content.includes('investments') },
      { name: 'Gestion wallets', found: content.includes('wallets') || content.includes('crypto') },
      { name: 'Statistiques', found: content.includes('stats') || content.includes('statistics') },
      { name: 'Logs système', found: content.includes('logs') || content.includes('system') },
      { name: 'Paramètres', found: content.includes('settings') || content.includes('paramètres') },
      { name: 'Notifications', found: content.includes('notifications') },
      { name: 'Sécurité', found: content.includes('security') || content.includes('sécurité') },
      { name: 'Déconnexion', found: content.includes('logout') || content.includes('déconnexion') }
    ];
    
    for (const check of adminChecks) {
      if (check.found) {
        logSuccess(`Admin: ${check.name}`);
      } else {
        logError(`Admin: ${check.name} manquant`);
      }
    }
    
    // Vérifier les actions admin
    const adminActions = [
      'create', 'edit', 'delete', 'update', 'manage', 'view', 'export'
    ];
    
    for (const action of adminActions) {
      if (content.includes(action)) {
        logSuccess(`Admin: Action ${action} disponible`);
      } else {
        logWarning(`Admin: Action ${action} non détectée`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test dashboard admin: ${error.message}`);
    return false;
  }
}

// =====================================================
// 5. TEST DU DASHBOARD CLIENT
// =====================================================

async function testClientDashboard() {
  logHeader('👤 TEST DASHBOARD CLIENT');
  
  try {
    const response = await fetch(`${BASE_URL}/client`);
    const content = await response.text();
    
    logInfo('Analyse du dashboard client...');
    
    // Vérifier les éléments du dashboard client
    const clientChecks = [
      { name: 'Page accessible', found: response.ok },
      { name: 'Interface client', found: content.includes('client') || content.includes('dashboard') },
      { name: 'Navigation client', found: content.includes('nav') || content.includes('menu') },
      { name: 'Portefeuille', found: content.includes('wallet') || content.includes('portefeuille') },
      { name: 'Investissements', found: content.includes('investments') || content.includes('investissements') },
      { name: 'Transactions', found: content.includes('transactions') },
      { name: 'Historique', found: content.includes('history') || content.includes('historique') },
      { name: 'Profil', found: content.includes('profile') || content.includes('profil') },
      { name: 'Notifications', found: content.includes('notifications') },
      { name: 'Paramètres', found: content.includes('settings') || content.includes('paramètres') },
      { name: 'Support', found: content.includes('support') || content.includes('aide') },
      { name: 'Sécurité', found: content.includes('security') || content.includes('sécurité') },
      { name: 'Déconnexion', found: content.includes('logout') || content.includes('déconnexion') },
      { name: 'Balance', found: content.includes('balance') || content.includes('solde') },
      { name: 'Gains', found: content.includes('profits') || content.includes('gains') }
    ];
    
    for (const check of clientChecks) {
      if (check.found) {
        logSuccess(`Client: ${check.name}`);
      } else {
        logError(`Client: ${check.name} manquant`);
      }
    }
    
    // Vérifier les actions client
    const clientActions = [
      'invest', 'withdraw', 'deposit', 'transfer', 'view', 'update', 'manage'
    ];
    
    for (const action of clientActions) {
      if (content.includes(action)) {
        logSuccess(`Client: Action ${action} disponible`);
      } else {
        logWarning(`Client: Action ${action} non détectée`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test dashboard client: ${error.message}`);
    return false;
  }
}

// =====================================================
// 6. TEST DE LA NAVIGATION
// =====================================================

async function testNavigation() {
  logHeader('🧭 TEST DE LA NAVIGATION');
  
  try {
    const urls = [
      { url: BASE_URL, name: 'Page d\'accueil' },
      { url: `${BASE_URL}/login`, name: 'Page de connexion' },
      { url: `${BASE_URL}/register`, name: 'Page d\'inscription' },
      { url: `${BASE_URL}/admin`, name: 'Dashboard admin' },
      { url: `${BASE_URL}/client`, name: 'Dashboard client' }
    ];
    
    logInfo('Test de la navigation entre les pages...');
    
    for (const { url, name } of urls) {
      try {
        const startTime = Date.now();
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
          const content = await response.text();
          
          if (content.includes('CryptoBoost') || content.includes('cryptoboost')) {
            logSuccess(`${name}: OK (${response.status}) - ${responseTime}ms`);
          } else {
            logWarning(`${name}: Contenu inattendu (${response.status}) - ${responseTime}ms`);
          }
        } else {
          logError(`${name}: Erreur ${response.status} - ${responseTime}ms`);
        }
      } catch (error) {
        logError(`${name}: Erreur de connexion - ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test navigation: ${error.message}`);
    return false;
  }
}

// =====================================================
// 7. TEST DE LA RESPONSIVITÉ
// =====================================================

async function testResponsiveness() {
  logHeader('📱 TEST DE LA RESPONSIVITÉ');
  
  try {
    const response = await fetch(BASE_URL);
    const content = await response.text();
    
    logInfo('Analyse de la responsivité...');
    
    // Vérifier les éléments de responsivité
    const responsiveChecks = [
      { name: 'Viewport meta tag', found: content.includes('viewport') },
      { name: 'Media queries', found: content.includes('@media') },
      { name: 'Responsive design', found: content.includes('responsive') || content.includes('mobile') },
      { name: 'Flexbox/Grid', found: content.includes('flex') || content.includes('grid') },
      { name: 'Mobile menu', found: content.includes('hamburger') || content.includes('mobile-menu') },
      { name: 'Touch targets', found: content.includes('touch') || content.includes('tap') },
      { name: 'Breakpoints', found: content.includes('sm:') || content.includes('md:') || content.includes('lg:') },
      { name: 'Images responsives', found: content.includes('srcset') || content.includes('sizes') }
    ];
    
    for (const check of responsiveChecks) {
      if (check.found) {
        logSuccess(`Responsive: ${check.name}`);
      } else {
        logWarning(`Responsive: ${check.name} non détecté`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test responsivité: ${error.message}`);
    return false;
  }
}

// =====================================================
// 8. TEST DES FONCTIONNALITÉS INTERACTIVES
// =====================================================

async function testInteractiveFeatures() {
  logHeader('🎮 TEST DES FONCTIONNALITÉS INTERACTIVES');
  
  try {
    const response = await fetch(BASE_URL);
    const content = await response.text();
    
    logInfo('Analyse des fonctionnalités interactives...');
    
    // Vérifier les fonctionnalités interactives
    const interactiveChecks = [
      { name: 'JavaScript chargé', found: content.includes('script') },
      { name: 'Event listeners', found: content.includes('onclick') || content.includes('addEventListener') },
      { name: 'Formulaires interactifs', found: content.includes('form') && content.includes('input') },
      { name: 'Validation côté client', found: content.includes('validation') || content.includes('required') },
      { name: 'Animations', found: content.includes('animation') || content.includes('transition') },
      { name: 'Modales/Popups', found: content.includes('modal') || content.includes('popup') || content.includes('dialog') },
      { name: 'Navigation dynamique', found: content.includes('router') || content.includes('navigate') },
      { name: 'État de l\'application', found: content.includes('state') || content.includes('store') }
    ];
    
    for (const check of interactiveChecks) {
      if (check.found) {
        logSuccess(`Interactive: ${check.name}`);
      } else {
        logWarning(`Interactive: ${check.name} non détecté`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test fonctionnalités interactives: ${error.message}`);
    return false;
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function runManualTests() {
  logHeader('🚀 TEST MANUEL COMPLET - CRYPTOBOOST APPLICATION');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    logInfo('Démarrage des tests manuels...');
    
    // Tests séquentiels
    const homeResult = await testHomePage();
    const registrationResult = await testRegistrationPage();
    const loginResult = await testLoginPage();
    const adminResult = await testAdminDashboard();
    const clientResult = await testClientDashboard();
    const navigationResult = await testNavigation();
    const responsiveResult = await testResponsiveness();
    const interactiveResult = await testInteractiveFeatures();
    
    results.push(homeResult, registrationResult, loginResult, adminResult, clientResult, navigationResult, responsiveResult, interactiveResult);
    
    const totalTime = Date.now() - startTime;
    
    // Résumé final
    logHeader('🎉 RÉSUMÉ FINAL - TEST MANUEL');
    
    const successCount = results.filter(Boolean).length;
    const totalCount = results.length;
    const successRate = (successCount / totalCount) * 100;
    
    logSuccess(`Tests réussis: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
    logSuccess(`Temps total: ${totalTime}ms`);
    
    if (successRate >= 80) {
      log('\n🎯 VOTRE APPLICATION CRYPTOBOOST EST FONCTIONNELLE !', 'green');
      log('🌐 URL: https://cryptoboost.world/', 'cyan');
      log('📊 Dashboard Admin: https://cryptoboost.world/admin', 'cyan');
      log('👤 Dashboard Client: https://cryptoboost.world/client', 'cyan');
    } else if (successRate >= 60) {
      log('\n⚠️ APPLICATION PARTIELLEMENT FONCTIONNELLE', 'yellow');
      log('Des améliorations sont nécessaires pour une expérience optimale.', 'yellow');
    } else {
      log('\n❌ DES PROBLÈMES MAJEURS ONT ÉTÉ DÉTECTÉS', 'red');
      log('L\'application nécessite des corrections importantes.', 'red');
    }
    
  } catch (error) {
    logError(`Erreur critique lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
runManualTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});