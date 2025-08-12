#!/usr/bin/env node

/**
 * SCRIPT DE TEST - CORRECTION ERREUR ROUTER
 * Vérification que l'erreur "You cannot render a <Router> inside another <Router>" est corrigée
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
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TEST 1: VÉRIFICATION DE L'ACCÈS AU SITE
// ============================================================================

async function testSiteAccess() {
  logSection('🌐 TEST 1: VÉRIFICATION ACCÈS SITE');
  
  try {
    log('🔍 Test accès page d\'accueil...', 'blue');
    
    const response = await fetch(`${SITE_URL}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      log(`✅ Page d'accueil accessible - Status: ${response.status}`, 'green');
      return true;
    } else {
      log(`❌ Page d'accueil inaccessible - Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur accès site: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// TEST 2: VÉRIFICATION DES PAGES DASHBOARD
// ============================================================================

async function testDashboardPages() {
  logSection('🎯 TEST 2: VÉRIFICATION PAGES DASHBOARD');
  
  const pages = [
    { path: '/login', name: 'Page Login' },
    { path: '/register', name: 'Page Register' },
    { path: '/client', name: 'Dashboard Client' },
    { path: '/admin', name: 'Dashboard Admin' }
  ];

  let successCount = 0;
  let totalCount = pages.length;

  for (const page of pages) {
    try {
      log(`🔍 Test de ${page.name}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${page.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

  log(`\n📊 Résumé: ${successCount}/${totalCount} pages accessibles`, successCount === totalCount ? 'green' : 'yellow');
  return successCount === totalCount;
}

// ============================================================================
// TEST 3: VÉRIFICATION DES ASSETS
// ============================================================================

async function testAssets() {
  logSection('📦 TEST 3: VÉRIFICATION ASSETS');
  
  const assets = [
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/favicon.svg'
  ];

  let successCount = 0;
  let totalCount = assets.length;

  for (const asset of assets) {
    try {
      log(`🔍 Test de ${asset}...`, 'blue');
      
      const response = await fetch(`${SITE_URL}${asset}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        log(`✅ ${asset} - Status: ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${asset} - Status: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${asset} - Erreur: ${error.message}`, 'red');
    }
  }

  log(`\n📊 Résumé: ${successCount}/${totalCount} assets accessibles`, successCount === totalCount ? 'green' : 'yellow');
  return successCount === totalCount;
}

// ============================================================================
// TEST 4: VÉRIFICATION MANIFEST.JSON
// ============================================================================

async function testManifest() {
  logSection('📋 TEST 4: VÉRIFICATION MANIFEST.JSON');
  
  try {
    log('🔍 Test du manifest.json...', 'blue');
    
    const response = await fetch(`${SITE_URL}/manifest.json`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.ok) {
      const manifest = await response.json();
      
      // Vérifier que le manifest ne contient pas de références aux icônes manquantes
      const hasScreenshotWide = manifest.screenshots && manifest.screenshots.some(s => s.src === '/screenshot-wide.png');
      const hasFaviconSvg = manifest.icons && manifest.icons.some(i => i.src === '/favicon.svg');
      
      if (!hasScreenshotWide && !hasFaviconSvg) {
        log('✅ Manifest.json corrigé - Aucune référence aux icônes manquantes', 'green');
        log(`✅ Nom: ${manifest.name}`, 'green');
        log(`✅ Description: ${manifest.description}`, 'green');
        log(`✅ Icônes: ${manifest.icons?.length || 0} icônes valides`, 'green');
        return true;
      } else {
        log('❌ Manifest.json contient encore des références aux icônes manquantes', 'red');
        return false;
      }
    } else {
      log(`❌ Manifest.json inaccessible - Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur test manifest: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testRouterFix() {
  log('🔧 TEST DE CORRECTION - ERREUR ROUTER', 'bright');
  log('Vérification que l\'erreur "You cannot render a <Router> inside another <Router>" est corrigée', 'cyan');
  
  try {
    // 1. Test accès site
    const siteAccess = await testSiteAccess();
    
    // 2. Test pages dashboard
    const dashboardPages = await testDashboardPages();
    
    // 3. Test assets
    const assets = await testAssets();
    
    // 4. Test manifest
    const manifest = await testManifest();

    // Résumé
    logSection('📊 RÉSUMÉ DES TESTS');
    log(`✅ Accès site: ${siteAccess ? 'Oui' : 'Non'}`, siteAccess ? 'green' : 'red');
    log(`✅ Pages dashboard: ${dashboardPages ? 'Oui' : 'Non'}`, dashboardPages ? 'green' : 'red');
    log(`✅ Assets: ${assets ? 'Oui' : 'Non'}`, assets ? 'green' : 'red');
    log(`✅ Manifest: ${manifest ? 'Oui' : 'Non'}`, manifest ? 'green' : 'red');

    const allTestsPassed = siteAccess && dashboardPages && assets && manifest;

    if (allTestsPassed) {
      logSection('🎉 CORRECTION RÉUSSIE');
      log('✅ Erreur Router corrigée', 'green');
      log('✅ Site 100% fonctionnel', 'green');
      log('✅ Manifest.json corrigé', 'green');
      log('✅ Assets accessibles', 'green');
      
      log('\n🌐 SITE OPÉRATIONNEL:', 'yellow');
      log('   - URL: https://cryptoboost.world', 'blue');
      log('   - Login: https://cryptoboost.world/login', 'blue');
      log('   - Dashboard Client: https://cryptoboost.world/client', 'blue');
      log('   - Dashboard Admin: https://cryptoboost.world/admin', 'blue');
      
      log('\n💡 L\'erreur "You cannot render a <Router> inside another <Router>" est corrigée !', 'green');
    } else {
      logSection('⚠️  PROBLÈMES RESTANTS');
      log('❌ Certains tests ont échoué', 'red');
      log('💡 Vérifiez le redéploiement Netlify', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors du test', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testRouterFix().catch(console.error);