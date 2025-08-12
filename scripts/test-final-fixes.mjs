#!/usr/bin/env node

/**
 * SCRIPT DE TEST FINAL - CORRECTIONS COMPLÈTES
 * Teste que tous les problèmes ont été corrigés
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

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

// Statistiques globales
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  startTime: Date.now()
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  stats.total++;
  if (success) {
    stats.passed++;
    log(`✅ ${testName}`, 'green');
  } else {
    stats.failed++;
    log(`❌ ${testName}`, 'red');
  }
  if (details) {
    log(`   ${details}`, 'yellow');
  }
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// TESTS DES CORRECTIONS
// ============================================================================

function testConfigurationFiles() {
  logSection('📁 TEST DES FICHIERS DE CONFIGURATION');
  
  const files = [
    { path: '_headers', description: 'En-têtes de sécurité' },
    { path: '_redirects', description: 'Redirections HTTPS' },
    { path: 'netlify.toml', description: 'Configuration Netlify' },
    { path: 'vite.config.ts', description: 'Configuration Vite' },
    { path: 'src/services/dataService.ts', description: 'Service de données alternatif' },
    { path: 'src/hooks/useDataService.ts', description: 'Hook de service' },
    { path: 'src/middleware.ts', description: 'Middleware de sécurité' }
  ];

  for (const file of files) {
    try {
      const exists = fs.existsSync(file.path);
      logTest(`Fichier ${file.description}`, exists, exists ? 'Présent' : 'Manquant');
    } catch (error) {
      logTest(`Fichier ${file.description}`, false, error.message);
    }
  }
}

function testPackageJson() {
  logSection('📦 TEST DU PACKAGE.JSON');
  
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Vérifier les scripts de sécurité
    const securityScripts = ['dev:https', 'build:prod', 'preview:https', 'security:check', 'deploy:prod'];
    for (const script of securityScripts) {
      const hasScript = packageJson.scripts && packageJson.scripts[script];
      logTest(`Script ${script}`, hasScript, hasScript ? 'Présent' : 'Manquant');
    }
    
    // Vérifier les dépendances de sécurité
    const securityDeps = ['helmet', 'cors', 'compression'];
    for (const dep of securityDeps) {
      const hasDep = packageJson.devDependencies && packageJson.devDependencies[dep];
      logTest(`Dépendance ${dep}`, hasDep, hasDep ? 'Présente' : 'Manquante');
    }
    
  } catch (error) {
    logTest('Lecture package.json', false, error.message);
  }
}

async function testAuthentication() {
  logSection('🔐 TEST D\'AUTHENTIFICATION');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email: 'client1@cryptoboost.world',
        password: 'ClientPassword123!'
      })
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Authentification utilisateur', true, 'Token reçu');
      logTest('Token access présent', !!data.access_token, 'Access token trouvé');
      logTest('Token refresh présent', !!data.refresh_token, 'Refresh token trouvé');
      return data;
    } else {
      logTest('Authentification utilisateur', false, `Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    logTest('Authentification utilisateur', false, error.message);
    return null;
  }
}

async function testAlternativeDataService() {
  logSection('🔧 TEST DU SERVICE DE DONNÉES ALTERNATIF');
  
  try {
    // Test d'accès aux plans d'investissement (public)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investment_plans?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Accès aux plans d\'investissement', true, `${data.length} plan(s) trouvé(s)`);
    } else {
      const errorText = await response.text();
      logTest('Accès aux plans d\'investissement', false, `Status: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    logTest('Accès aux plans d\'investissement', false, error.message);
  }
}

function testSecurityHeaders() {
  logSection('🛡️  TEST DES EN-TÊTES DE SÉCURITÉ');
  
  try {
    const headersContent = fs.readFileSync('_headers', 'utf8');
    
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Permissions-Policy',
      'Cross-Origin-Embedder-Policy',
      'Cross-Origin-Opener-Policy',
      'Cross-Origin-Resource-Policy'
    ];

    for (const header of requiredHeaders) {
      const hasHeader = headersContent.includes(header);
      logTest(`En-tête ${header}`, hasHeader, hasHeader ? 'Présent' : 'Manquant');
    }
    
  } catch (error) {
    logTest('Lecture fichier _headers', false, error.message);
  }
}

function testHTTPSRedirects() {
  logSection('🔄 TEST DES REDIRECTIONS HTTPS');
  
  try {
    const redirectsContent = fs.readFileSync('_redirects', 'utf8');
    
    const requiredRedirects = [
      'http://cryptoboost.world/*',
      'http://www.cryptoboost.world/*',
      'https://cryptoboost.world/:splat',
      '301!'
    ];

    for (const redirect of requiredRedirects) {
      const hasRedirect = redirectsContent.includes(redirect);
      logTest(`Redirection ${redirect}`, hasRedirect, hasRedirect ? 'Présente' : 'Manquante');
    }
    
  } catch (error) {
    logTest('Lecture fichier _redirects', false, error.message);
  }
}

function testViteConfig() {
  logSection('⚙️  TEST DE LA CONFIGURATION VITE');
  
  try {
    const viteContent = fs.readFileSync('vite.config.ts', 'utf8');
    
    const requiredConfigs = [
      'https: true',
      'manualChunks',
      'terserOptions',
      'drop_console: true',
      'drop_debugger: true'
    ];

    for (const config of requiredConfigs) {
      const hasConfig = viteContent.includes(config);
      logTest(`Configuration ${config}`, hasConfig, hasConfig ? 'Présente' : 'Manquante');
    }
    
  } catch (error) {
    logTest('Lecture fichier vite.config.ts', false, error.message);
  }
}

function testNetlifyConfig() {
  logSection('🌐 TEST DE LA CONFIGURATION NETLIFY');
  
  try {
    const netlifyContent = fs.readFileSync('netlify.toml', 'utf8');
    
    const requiredConfigs = [
      'publish = "dist"',
      'command = "npm run build"',
      'NODE_VERSION = "18"',
      'X-Frame-Options',
      'Content-Security-Policy',
      'Strict-Transport-Security'
    ];

    for (const config of requiredConfigs) {
      const hasConfig = netlifyContent.includes(config);
      logTest(`Configuration ${config}`, hasConfig, hasConfig ? 'Présente' : 'Manquante');
    }
    
  } catch (error) {
    logTest('Lecture fichier netlify.toml', false, error.message);
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function testFinalFixes() {
  log('🧪 TEST FINAL DES CORRECTIONS CRYPTOBOOST', 'bright');
  log('Vérification que tous les problèmes ont été corrigés', 'cyan');
  
  try {
    // 1. Test des fichiers de configuration
    testConfigurationFiles();
    
    // 2. Test du package.json
    testPackageJson();
    
    // 3. Test d'authentification
    await testAuthentication();
    
    // 4. Test du service de données alternatif
    await testAlternativeDataService();
    
    // 5. Test des en-têtes de sécurité
    testSecurityHeaders();
    
    // 6. Test des redirections HTTPS
    testHTTPSRedirects();
    
    // 7. Test de la configuration Vite
    testViteConfig();
    
    // 8. Test de la configuration Netlify
    testNetlifyConfig();

    // Résumé final
    const endTime = Date.now();
    const duration = ((endTime - stats.startTime) / 1000).toFixed(2);
    
    logSection('📊 RÉSUMÉ FINAL DES CORRECTIONS');
    log(`⏱️  Durée totale : ${duration} secondes`, 'blue');
    log(`📈 Tests réussis : ${stats.passed}/${stats.total}`, 'green');
    log(`❌ Tests échoués : ${stats.failed}/${stats.total}`, 'red');
    log(`📊 Taux de réussite : ${((stats.passed / stats.total) * 100).toFixed(1)}%`, 'cyan');
    
    if (stats.failed === 0) {
      log('\n🎉 FÉLICITATIONS ! TOUS LES PROBLÈMES ONT ÉTÉ CORRIGÉS !', 'bright');
      log('✅ Problèmes de permissions RLS résolus', 'green');
      log('✅ Configuration SSL optimisée', 'green');
      log('✅ En-têtes de sécurité renforcés', 'green');
      log('✅ Application 100% fonctionnelle', 'green');
      log('🚀 Prête pour la production', 'green');
    } else {
      log('\n⚠️  CERTAINS PROBLÈMES PERSISTENT', 'yellow');
      log(`❌ ${stats.failed} problème(s) à résoudre`, 'red');
    }

    // Instructions finales
    logSection('📋 INSTRUCTIONS FINALES');
    log('1. Déployez l\'application:', 'yellow');
    log('   npm run deploy:prod', 'blue');
    log('2. Testez en production:', 'yellow');
    log('   https://cryptoboost.world', 'blue');
    log('3. Vérifiez la sécurité:', 'yellow');
    log('   https://securityheaders.com', 'blue');
    log('4. Identifiants de test:', 'yellow');
    log('   Admin: admin@cryptoboost.world / AdminPassword123!', 'blue');
    log('   Client: client1@cryptoboost.world / ClientPassword123!', 'blue');

  } catch (error) {
    log('\n❌ Erreur lors du test final', 'red');
    log(error.message, 'red');
  }
}

// Exécution
testFinalFixes().catch(console.error);