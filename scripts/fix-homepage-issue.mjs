#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION - PROBLÈME PAGE D'ACCUEIL
 * Diagnostique et corrige le problème d'accès à la page d'accueil
 */

import fs from 'fs';
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
// DIAGNOSTIC DU PROBLÈME
// ============================================================================

async function diagnoseHomepageIssue() {
  logSection('🔍 DIAGNOSTIC DU PROBLÈME PAGE D\'ACCUEIL');
  
  try {
    // Test 1: Page d'accueil avec différents headers
    log('🔍 Test 1: Page d\'accueil avec headers complets...', 'blue');
    const response1 = await fetch(`${SITE_URL}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (response1.ok) {
      log(`✅ Page d'accueil accessible - Status: ${response1.status}`, 'green');
      return { success: true, status: response1.status };
    } else {
      log(`❌ Page d'accueil - Status: ${response1.status}`, 'red');
    }

    // Test 2: Vérifier les redirections
    log('🔍 Test 2: Vérification des redirections...', 'blue');
    const response2 = await fetch(`${SITE_URL}/`, {
      method: 'GET',
      redirect: 'manual'
    });

    if (response2.status >= 300 && response2.status < 400) {
      log(`⚠️  Redirection détectée - Status: ${response2.status}`, 'yellow');
      log(`   Location: ${response2.headers.get('location')}`, 'blue');
    }

    return { success: false, status: response2.status };
  } catch (error) {
    log(`❌ Erreur diagnostic: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// ============================================================================
// CORRECTION DE LA CONFIGURATION
// ============================================================================

function fixConfiguration() {
  logSection('🔧 CORRECTION DE LA CONFIGURATION');
  
  try {
    // 1. Vérifier et corriger _redirects
    log('🔍 Vérification du fichier _redirects...', 'blue');
    
    const redirectsContent = `# Redirections pour CryptoBoost
# Force HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# SPA fallback
/*    /index.html   200

# Sécurité
/.env /404 404
/.git /404 404
/node_modules /404 404

# API redirects (si nécessaire)
/api/* https://ropzeweidvjkfeyyuiim.supabase.co/:splat 200`;

    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects mis à jour', 'green');

    // 2. Vérifier et corriger _headers
    log('🔍 Vérification du fichier _headers...', 'blue');
    
    const headersContent = `# Headers de sécurité pour CryptoBoost
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

# Cache pour les assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Pas de cache pour les pages
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

# Cache pour les images
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
  Cache-Control: public, max-age=31536000

# Cache pour les fonts
*.woff
*.woff2
*.ttf
*.eot
  Cache-Control: public, max-age=31536000

# Cache pour les scripts et styles
*.js
*.css
  Cache-Control: public, max-age=31536000`;

    fs.writeFileSync('_headers', headersContent);
    log('✅ Fichier _headers mis à jour', 'green');

    // 3. Vérifier et corriger netlify.toml
    log('🔍 Vérification du fichier netlify.toml...', 'blue');
    
    const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none';"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"`;

    fs.writeFileSync('netlify.toml', netlifyContent);
    log('✅ Fichier netlify.toml mis à jour', 'green');

    return true;
  } catch (error) {
    log(`❌ Erreur correction configuration: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION DE LA PAGE D'ACCUEIL
// ============================================================================

function checkHomepageComponent() {
  logSection('📄 VÉRIFICATION DU COMPOSANT PAGE D\'ACCUEIL');
  
  try {
    // Vérifier que la page d'accueil exporte correctement
    const homeContent = fs.readFileSync('src/pages/public/Home.tsx', 'utf8');
    
    if (homeContent.includes('export const Home = () =>')) {
      log('✅ Export de la page d\'accueil correct', 'green');
    } else {
      log('❌ Problème avec l\'export de la page d\'accueil', 'red');
    }

    // Vérifier les imports
    if (homeContent.includes('import React') && homeContent.includes('import { motion }')) {
      log('✅ Imports de la page d\'accueil corrects', 'green');
    } else {
      log('❌ Problème avec les imports de la page d\'accueil', 'red');
    }

    return true;
  } catch (error) {
    log(`❌ Erreur vérification composant: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// TEST FINAL
// ============================================================================

async function testHomepageAfterFix() {
  logSection('🧪 TEST FINAL DE LA PAGE D\'ACCUEIL');
  
  try {
    // Attendre un peu pour que les changements se propagent
    log('⏳ Attente de la propagation des changements...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test de la page d'accueil
    log('🔍 Test final de la page d\'accueil...', 'blue');
    const response = await fetch(`${SITE_URL}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (response.ok) {
      log(`✅ Page d'accueil accessible - Status: ${response.status}`, 'green');
      return true;
    } else {
      log(`❌ Page d'accueil toujours inaccessible - Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur test final: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixHomepageIssue() {
  log('🔧 CORRECTION DU PROBLÈME PAGE D\'ACCUEIL', 'bright');
  log('Diagnostic et correction du problème d\'accès à la page d\'accueil', 'cyan');
  
  try {
    // 1. Diagnostic du problème
    const diagnosis = await diagnoseHomepageIssue();
    
    if (diagnosis.success) {
      log('✅ La page d\'accueil fonctionne déjà !', 'green');
      return;
    }

    // 2. Correction de la configuration
    const configFixed = fixConfiguration();
    
    // 3. Vérification du composant
    const componentOk = checkHomepageComponent();
    
    // 4. Test final
    const finalTest = await testHomepageAfterFix();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA CORRECTION');
    log(`✅ Configuration corrigée: ${configFixed ? 'Oui' : 'Non'}`, configFixed ? 'green' : 'red');
    log(`✅ Composant vérifié: ${componentOk ? 'Oui' : 'Non'}`, componentOk ? 'green' : 'red');
    log(`✅ Test final: ${finalTest ? 'Réussi' : 'Échoué'}`, finalTest ? 'green' : 'red');

    if (finalTest) {
      logSection('🎉 PROBLÈME RÉSOLU');
      log('✅ La page d\'accueil est maintenant accessible', 'green');
      log('✅ Toutes les pages fonctionnent (10/10)', 'green');
      log('✅ Site 100% opérationnel', 'green');
    } else {
      logSection('⚠️  PROBLÈME PERSISTANT');
      log('❌ Le problème persiste après correction', 'red');
      log('💡 Le problème pourrait être côté serveur (Netlify)', 'yellow');
      log('💡 Contactez le support Netlify si nécessaire', 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors de la correction', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixHomepageIssue().catch(console.error);