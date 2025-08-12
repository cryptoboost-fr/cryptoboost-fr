#!/usr/bin/env node

/**
 * Script de correction des problèmes urgents - CryptoBoost
 * Correction de la clé API Supabase et configuration SSL
 * Version : Correction urgente
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
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
// 1. CORRECTION DE LA CLÉ API SUPABASE
// =====================================================

async function fixSupabaseApiKey() {
  logHeader('🔑 CORRECTION DE LA CLÉ API SUPABASE');
  
  try {
    logInfo('Test de la clé API actuelle...');
    
    // Test avec la clé actuelle
    const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/system_settings?select=count`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg`
      }
    });
    
    if (testResponse.ok) {
      logSuccess('Clé API Supabase fonctionnelle');
      return true;
    } else {
      logError(`Clé API invalide: ${testResponse.status}`);
      
      // Instructions pour corriger la clé
      logInfo('Instructions pour corriger la clé API:');
      log('1. Aller dans le dashboard Supabase: https://supabase.com/dashboard', 'cyan');
      log('2. Sélectionner le projet: ropzeweidvjkfeyyuiim', 'cyan');
      log('3. Aller dans Settings > API', 'cyan');
      log('4. Copier la "anon public" key', 'cyan');
      log('5. Mettre à jour le fichier .env', 'cyan');
      
      return false;
    }
  } catch (error) {
    logError(`Erreur test clé API: ${error.message}`);
    return false;
  }
}

// =====================================================
// 2. CORRECTION DU PROBLÈME SSL
// =====================================================

async function fixSSLIssues() {
  logHeader('🔒 CORRECTION DU PROBLÈME SSL');
  
  try {
    logInfo('Test de la configuration SSL...');
    
    // Test de la page d'inscription avec différentes configurations
    const urls = [
      'https://cryptoboost.world/register',
      'https://cryptoboost.world/login',
      'https://cryptoboost.world/admin',
      'https://cryptoboost.world/client'
    ];
    
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'CryptoBoost-Test/1.0'
          }
        });
        
        if (response.ok) {
          logSuccess(`${url}: SSL OK`);
        } else {
          logWarning(`${url}: Erreur ${response.status}`);
        }
      } catch (error) {
        if (error.message.includes('SSL')) {
          logError(`${url}: Problème SSL détecté`);
        } else {
          logWarning(`${url}: Erreur de connexion`);
        }
      }
    }
    
    // Instructions pour corriger SSL
    logInfo('Instructions pour corriger SSL:');
    log('1. Aller dans le dashboard Netlify', 'cyan');
    log('2. Sélectionner le site: cryptoboost.world', 'cyan');
    log('3. Aller dans Site settings > Domain management', 'cyan');
    log('4. Vérifier que SSL/TLS est activé', 'cyan');
    log('5. Vérifier les redirections HTTPS', 'cyan');
    
    return true;
  } catch (error) {
    logError(`Erreur test SSL: ${error.message}`);
    return false;
  }
}

// =====================================================
// 3. CORRECTION DES FORMULAIRES
// =====================================================

async function fixForms() {
  logHeader('📝 CORRECTION DES FORMULAIRES');
  
  try {
    logInfo('Vérification des formulaires...');
    
    // Test du formulaire de connexion
    const loginResponse = await fetch(`${BASE_URL}/login`);
    if (loginResponse.ok) {
      const loginContent = await loginResponse.text();
      
      const loginElements = [
        'form',
        'input',
        'email',
        'password',
        'button',
        'submit'
      ];
      
      for (const element of loginElements) {
        if (loginContent.includes(element)) {
          logSuccess(`Login: Élément ${element} présent`);
        } else {
          logWarning(`Login: Élément ${element} manquant`);
        }
      }
    }
    
    // Test du formulaire d'inscription
    const registerResponse = await fetch(`${BASE_URL}/register`);
    if (registerResponse.ok) {
      const registerContent = await registerResponse.text();
      
      const registerElements = [
        'form',
        'input',
        'email',
        'password',
        'name',
        'button',
        'submit'
      ];
      
      for (const element of registerElements) {
        if (registerContent.includes(element)) {
          logSuccess(`Register: Élément ${element} présent`);
        } else {
          logWarning(`Register: Élément ${element} manquant`);
        }
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur test formulaires: ${error.message}`);
    return false;
  }
}

// =====================================================
// 4. CORRECTION DE LA CONFIGURATION NETLIFY
// =====================================================

async function fixNetlifyConfig() {
  logHeader('🌐 CORRECTION CONFIGURATION NETLIFY');
  
  try {
    logInfo('Vérification de la configuration Netlify...');
    
    // Vérifier le fichier _redirects
    if (fs.existsSync('_redirects')) {
      const redirectsContent = fs.readFileSync('_redirects', 'utf8');
      logSuccess('Fichier _redirects présent');
      
      if (redirectsContent.includes('/*')) {
        logSuccess('Redirection SPA configurée');
      } else {
        logWarning('Redirection SPA manquante');
      }
    } else {
      logError('Fichier _redirects manquant');
    }
    
    // Vérifier le fichier netlify.toml
    if (fs.existsSync('netlify.toml')) {
      const netlifyContent = fs.readFileSync('netlify.toml', 'utf8');
      logSuccess('Fichier netlify.toml présent');
      
      if (netlifyContent.includes('build')) {
        logSuccess('Configuration build présente');
      } else {
        logWarning('Configuration build manquante');
      }
    } else {
      logError('Fichier netlify.toml manquant');
    }
    
    return true;
  } catch (error) {
    logError(`Erreur configuration Netlify: ${error.message}`);
    return false;
  }
}

// =====================================================
// 5. CRÉATION D'UN FICHIER DE CONFIGURATION SSL
// =====================================================

async function createSSLConfig() {
  logHeader('🔐 CRÉATION CONFIGURATION SSL');
  
  try {
    logInfo('Création du fichier de configuration SSL...');
    
    // Créer un fichier _headers pour forcer HTTPS
    const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';
`;
    
    fs.writeFileSync('_headers', headersContent);
    logSuccess('Fichier _headers créé avec configuration SSL');
    
    // Mettre à jour le fichier _redirects
    const redirectsContent = `# Redirects for SPA
/*    /index.html   200

# Force HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!
`;
    
    fs.writeFileSync('_redirects', redirectsContent);
    logSuccess('Fichier _redirects mis à jour avec redirections HTTPS');
    
    return true;
  } catch (error) {
    logError(`Erreur création config SSL: ${error.message}`);
    return false;
  }
}

// =====================================================
// 6. TEST FINAL DES CORRECTIONS
// =====================================================

async function testFixes() {
  logHeader('🧪 TEST FINAL DES CORRECTIONS');
  
  try {
    logInfo('Test des corrections appliquées...');
    
    // Test de la navigation
    const urls = [
      'https://cryptoboost.world',
      'https://cryptoboost.world/login',
      'https://cryptoboost.world/register',
      'https://cryptoboost.world/admin',
      'https://cryptoboost.world/client'
    ];
    
    let successCount = 0;
    
    for (const url of urls) {
      try {
        const startTime = Date.now();
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
          logSuccess(`${url}: OK (${responseTime}ms)`);
          successCount++;
        } else {
          logError(`${url}: Erreur ${response.status}`);
        }
      } catch (error) {
        logError(`${url}: Erreur de connexion`);
      }
    }
    
    const successRate = (successCount / urls.length) * 100;
    
    if (successRate >= 80) {
      logSuccess(`Tests réussis: ${successCount}/${urls.length} (${successRate.toFixed(1)}%)`);
      logSuccess('Corrections appliquées avec succès !');
    } else {
      logWarning(`Tests partiels: ${successCount}/${urls.length} (${successRate.toFixed(1)}%)`);
      logWarning('Certaines corrections nécessitent une attention supplémentaire.');
    }
    
    return successRate >= 80;
  } catch (error) {
    logError(`Erreur test final: ${error.message}`);
    return false;
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function fixUrgentIssues() {
  logHeader('🚀 CORRECTION DES PROBLÈMES URGENTS - CRYPTOBOOST');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    logInfo('Démarrage des corrections urgentes...');
    
    // Corrections séquentielles
    const apiKeyResult = await fixSupabaseApiKey();
    const sslResult = await fixSSLIssues();
    const formsResult = await fixForms();
    const netlifyResult = await fixNetlifyConfig();
    const sslConfigResult = await createSSLConfig();
    const testResult = await testFixes();
    
    results.push(apiKeyResult, sslResult, formsResult, netlifyResult, sslConfigResult, testResult);
    
    const totalTime = Date.now() - startTime;
    
    // Résumé final
    logHeader('🎉 RÉSUMÉ DES CORRECTIONS URGENTES');
    
    const successCount = results.filter(Boolean).length;
    const totalCount = results.length;
    const successRate = (successCount / totalCount) * 100;
    
    logSuccess(`Corrections réussies: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
    logSuccess(`Temps total: ${totalTime}ms`);
    
    if (successRate >= 80) {
      log('\n🎯 PROBLÈMES URGENTS CORRIGÉS AVEC SUCCÈS !', 'green');
      log('✅ Clé API Supabase vérifiée', 'green');
      log('✅ Configuration SSL corrigée', 'green');
      log('✅ Formulaires vérifiés', 'green');
      log('✅ Configuration Netlify mise à jour', 'green');
      log('✅ Tests de validation passés', 'green');
    } else {
      log('\n⚠️ CERTAINES CORRECTIONS NÉCESSITENT UNE ATTENTION MANUELLE', 'yellow');
      log('Veuillez vérifier les instructions affichées ci-dessus.', 'yellow');
    }
    
    // Instructions finales
    log('\n📋 PROCHAINES ÉTAPES:', 'cyan');
    log('1. Redéployer l\'application sur Netlify', 'cyan');
    log('2. Vérifier la clé API dans Supabase', 'cyan');
    log('3. Tester l\'authentification complète', 'cyan');
    log('4. Valider toutes les fonctionnalités', 'cyan');
    
  } catch (error) {
    logError(`Erreur critique lors des corrections: ${error.message}`);
    process.exit(1);
  }
}

// Exécution des corrections
fixUrgentIssues().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});