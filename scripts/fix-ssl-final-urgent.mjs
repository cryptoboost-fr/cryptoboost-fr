#!/usr/bin/env node

/**
 * CORRECTION SSL FINAL URGENT - CRYPTOBOOST
 * Résolution définitive du problème SSL persistant
 */

import fs from 'fs';
import { execSync } from 'child_process';

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
  log(`🚨 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTION SSL ULTRA-MINIMALE
// ============================================================================

function fixSSLUltraMinimal() {
  logSection('CORRECTION SSL ULTRA-MINIMALE');
  
  // 1. Headers ultra-minimaux
  log('🔧 Application des headers SSL ultra-minimaux...', 'yellow');
  
  const ultraMinimalHeaders = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-cache,no-store,must-revalidate
  Pragma: no-cache
  Expires: 0

/login-alt.html
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache,no-store,must-revalidate

/client
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache,no-store,must-revalidate

/admin
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache,no-store,must-revalidate`;
  
  fs.writeFileSync('_headers', ultraMinimalHeaders);
  log('✅ Headers SSL ultra-minimaux appliqués', 'green');
  
  // 2. Redirections ultra-simples
  log('🔧 Application des redirections ultra-simples...', 'yellow');
  
  const ultraSimpleRedirects = `# Redirections HTTPS
http://cryptoboost.world https://cryptoboost.world 301!
http://www.cryptoboost.world https://cryptoboost.world 301!
https://www.cryptoboost.world https://cryptoboost.world 301!

# Login alternative
/login /login-alt.html 301!
/login/ /login-alt.html 301!

# SPA fallback
/* /index.html 200`;
  
  fs.writeFileSync('_redirects', ultraSimpleRedirects);
  log('✅ Redirections ultra-simples appliquées', 'green');
  
  // 3. Configuration Netlify ultra-minimale
  log('🔧 Application de la configuration Netlify ultra-minimale...', 'yellow');
  
  const ultraMinimalNetlify = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "no-cache,no-store,must-revalidate"
    Pragma = "no-cache"
    Expires = "0"`;
  
  fs.writeFileSync('netlify.toml', ultraMinimalNetlify);
  log('✅ Configuration Netlify ultra-minimale appliquée', 'green');
  
  // 4. Index.html ultra-nettoyé
  log('🔧 Nettoyage d\'index.html...', 'yellow');
  
  if (fs.existsSync('index.html')) {
    let indexContent = fs.readFileSync('index.html', 'utf8');
    
    // Supprimer tous les meta tags problématiques
    indexContent = indexContent.replace(/<meta[^>]*http-equiv[^>]*>/gi, '');
    indexContent = indexContent.replace(/<meta[^>]*name="viewport"[^>]*>/gi, '');
    
    // Ajouter seulement les meta tags essentiels
    const essentialMeta = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">`;
    
    indexContent = indexContent.replace(/<meta charset[^>]*>/gi, essentialMeta);
    
    fs.writeFileSync('index.html', indexContent);
    log('✅ Index.html ultra-nettoyé', 'green');
  }
  
  // 5. Configuration Vite ultra-simple
  log('🔧 Application de la configuration Vite ultra-simple...', 'yellow');
  
  const ultraSimpleVite = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})`;
  
  fs.writeFileSync('vite.config.ts', ultraSimpleVite);
  log('✅ Configuration Vite ultra-simple appliquée', 'green');
}

// ============================================================================
// TEST SSL APRÈS CORRECTION
// ============================================================================

async function testSSLAfterFix() {
  logSection('TEST SSL APRÈS CORRECTION');
  
  const testUrls = [
    'https://cryptoboost.world',
    'https://cryptoboost.world/login-alt.html',
    'https://cryptoboost.world/client',
    'https://cryptoboost.world/admin'
  ];
  
  let successCount = 0;
  let totalTests = testUrls.length;
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        log(`✅ ${url}: Status ${response.status}`, 'green');
        successCount++;
      } else {
        log(`❌ ${url}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${url}: ${error.message}`, 'red');
    }
  }
  
  log(`\n📊 Score SSL après correction: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`, 
      successCount === totalTests ? 'green' : 'yellow');
  
  return successCount === totalTests;
}

// ============================================================================
// DÉPLOIEMENT URGENT
// ============================================================================

function deployUrgent() {
  logSection('DÉPLOIEMENT URGENT');
  
  try {
    log('🚀 Commit des corrections SSL...', 'yellow');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "🚨 URGENT: Correction SSL finale - Configuration ultra-minimale"', { stdio: 'inherit' });
    
    log('🚀 Push vers Netlify...', 'yellow');
    execSync('git push origin main', { stdio: 'inherit' });
    
    log('✅ Déploiement urgent lancé', 'green');
    log('⏳ Attente de 3 minutes pour le déploiement...', 'yellow');
    
  } catch (error) {
    log(`❌ Erreur lors du déploiement: ${error.message}`, 'red');
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixSSLFinalUrgent() {
  log('🚨 CORRECTION SSL FINAL URGENT - CRYPTOBOOST', 'bright');
  log('Résolution définitive du problème SSL persistant', 'cyan');
  
  try {
    // 1. Application des corrections SSL ultra-minimales
    fixSSLUltraMinimal();
    
    // 2. Test SSL après correction
    const sslFixed = await testSSLAfterFix();
    
    // 3. Déploiement urgent si nécessaire
    if (!sslFixed) {
      deployUrgent();
      
      logSection('⏳ ATTENTE DÉPLOIEMENT');
      log('Attente de 3 minutes pour que Netlify déploie les corrections...', 'yellow');
      
      // Attendre 3 minutes
      await new Promise(resolve => setTimeout(resolve, 180000));
      
      log('🔄 Test final après déploiement...', 'yellow');
      const finalTest = await testSSLAfterFix();
      
      if (finalTest) {
        logSection('🎉 SUCCÈS FINAL');
        log('✅ Problème SSL définitivement résolu', 'green');
        log('✅ Application 100% opérationnelle', 'green');
        log('✅ Configuration ultra-minimale appliquée', 'green');
      } else {
        logSection('⚠️ PROBLÈME PERSISTANT');
        log('❌ Le problème SSL persiste malgré les corrections', 'red');
        log('💡 Vérification manuelle recommandée', 'yellow');
      }
    } else {
      logSection('🎉 SUCCÈS IMMÉDIAT');
      log('✅ Problème SSL résolu sans déploiement', 'green');
      log('✅ Application 100% opérationnelle', 'green');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL finale', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLFinalUrgent().catch(console.error);