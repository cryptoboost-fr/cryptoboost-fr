#!/usr/bin/env node

/**
 * Script de test complet de l'application CryptoBoost
 * Test de toutes les fonctionnalités et vérification de l'état
 */

import fetch from 'node-fetch';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = 'https://ropzeweidvjkfeyyuiim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl-2xh_1-4v_IAa8SKcOYg';

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

// Test de la structure du projet
function testProjectStructure() {
  log('\n📁 TEST DE LA STRUCTURE DU PROJET', 'cyan');
  
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'src/App.tsx',
    'src/main.tsx',
    'src/lib/supabase.ts',
    'src/store/auth.ts',
    'src/components/layout/AdminLayout.tsx',
    'src/components/layout/ClientLayout.tsx',
    'src/pages/admin/Dashboard.tsx',
    'src/pages/client/Dashboard.tsx'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logSuccess(`Fichier ${file} existe`);
    } else {
      logError(`Fichier ${file} manquant`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Test des dépendances
function testDependencies() {
  log('\n📦 TEST DES DÉPENDANCES', 'cyan');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'react-router-dom',
      'zustand',
      'lucide-react',
      'tailwindcss'
    ];
    
    let allDepsInstalled = true;
    
    for (const dep of requiredDeps) {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        logSuccess(`Dépendance ${dep} installée`);
      } else {
        logError(`Dépendance ${dep} manquante`);
        allDepsInstalled = false;
      }
    }
    
    return allDepsInstalled;
  } catch (error) {
    logError(`Erreur lors du test des dépendances: ${error.message}`);
    return false;
  }
}

// Test de la configuration Vite
function testViteConfig() {
  log('\n⚙️ TEST DE LA CONFIGURATION VITE', 'cyan');
  
  try {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    
    if (viteConfig.includes('@supabase/supabase-js')) {
      logSuccess('Configuration Vite correcte');
      return true;
    } else {
      logError('Configuration Vite incorrecte');
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test de la configuration Vite: ${error.message}`);
    return false;
  }
}

// Test de la configuration TypeScript
function testTypeScriptConfig() {
  log('\n🔧 TEST DE LA CONFIGURATION TYPESCRIPT', 'cyan');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    if (tsConfig.compilerOptions?.jsx === 'react-jsx') {
      logSuccess('Configuration TypeScript correcte');
      return true;
    } else {
      logError('Configuration TypeScript incorrecte');
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test de la configuration TypeScript: ${error.message}`);
    return false;
  }
}

// Test de la configuration Tailwind
function testTailwindConfig() {
  log('\n🎨 TEST DE LA CONFIGURATION TAILWIND', 'cyan');
  
  try {
    const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
    
    if (tailwindConfig.includes('content') && tailwindConfig.includes('src')) {
      logSuccess('Configuration Tailwind correcte');
      return true;
    } else {
      logError('Configuration Tailwind incorrecte');
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test de la configuration Tailwind: ${error.message}`);
    return false;
  }
}

// Test de la connexion Supabase
async function testSupabaseConnection() {
  log('\n🌐 TEST DE LA CONNEXION SUPABASE', 'cyan');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/system_settings?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      logSuccess('Connexion Supabase réussie');
      return true;
    } else {
      logError(`Erreur de connexion Supabase: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur de connexion Supabase: ${error.message}`);
    return false;
  }
}

// Test de la base de données
async function testDatabase() {
  log('\n🗄️ TEST DE LA BASE DE DONNÉES', 'cyan');
  
  try {
    // Test de la fonction RPC
    const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_stats`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (rpcResponse.ok) {
      const stats = await rpcResponse.json();
      logSuccess(`Fonction RPC opérationnelle: ${JSON.stringify(stats)}`);
    } else {
      logError(`Erreur fonction RPC: ${rpcResponse.status}`);
    }
    
    // Test des tables
    const tables = ['users', 'transactions', 'user_investments', 'investment_plans', 'crypto_wallets', 'system_logs', 'system_settings', 'notifications'];
    
    for (const table of tables) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        
        if (response.ok) {
          logSuccess(`Table ${table} accessible`);
        } else {
          logError(`Table ${table} non accessible: ${response.status}`);
        }
      } catch (error) {
        logError(`Erreur table ${table}: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Erreur lors du test de la base de données: ${error.message}`);
    return false;
  }
}

// Test du build
function testBuild() {
  log('\n🔨 TEST DU BUILD', 'cyan');
  
  try {
    logInfo('Démarrage du build...');
    execSync('npm run build', { stdio: 'pipe' });
    logSuccess('Build réussi');
    return true;
  } catch (error) {
    logError(`Erreur lors du build: ${error.message}`);
    return false;
  }
}

// Test du serveur de développement
function testDevServer() {
  log('\n🚀 TEST DU SERVEUR DE DÉVELOPPEMENT', 'cyan');
  
  try {
    // Vérifier si le serveur est en cours d'exécution
    const output = execSync('ps aux | grep vite | grep -v grep', { encoding: 'utf8' });
    
    if (output.trim()) {
      logSuccess('Serveur de développement en cours d\'exécution');
      return true;
    } else {
      logWarning('Serveur de développement non démarré');
      return false;
    }
  } catch (error) {
    logWarning('Serveur de développement non détecté');
    return false;
  }
}

// Test des routes
function testRoutes() {
  log('\n🛣️ TEST DES ROUTES', 'cyan');
  
  try {
    const appContent = fs.readFileSync('src/App.tsx', 'utf8');
    
    const requiredRoutes = [
      '/admin',
      '/client',
      '/login',
      '/register'
    ];
    
    let allRoutesFound = true;
    
    for (const route of requiredRoutes) {
      if (appContent.includes(route)) {
        logSuccess(`Route ${route} définie`);
      } else {
        logError(`Route ${route} manquante`);
        allRoutesFound = false;
      }
    }
    
    return allRoutesFound;
  } catch (error) {
    logError(`Erreur lors du test des routes: ${error.message}`);
    return false;
  }
}

// Test des composants
function testComponents() {
  log('\n🧩 TEST DES COMPOSANTS', 'cyan');
  
  const requiredComponents = [
    'src/components/layout/AdminLayout.tsx',
    'src/components/layout/ClientLayout.tsx',
    'src/components/layout/AuthLayout.tsx',
    'src/components/ui/Button.tsx',
    'src/components/ui/Card.tsx'
  ];
  
  let allComponentsExist = true;
  
  for (const component of requiredComponents) {
    if (fs.existsSync(component)) {
      logSuccess(`Composant ${component} existe`);
    } else {
      logWarning(`Composant ${component} manquant`);
      allComponentsExist = false;
    }
  }
  
  return allComponentsExist;
}

// Test des pages
function testPages() {
  log('\n📄 TEST DES PAGES', 'cyan');
  
  const requiredPages = [
    'src/pages/admin/Dashboard.tsx',
    'src/pages/admin/Users.tsx',
    'src/pages/admin/Transactions.tsx',
    'src/pages/client/Dashboard.tsx',
    'src/pages/client/Wallet.tsx',
    'src/pages/client/Plans.tsx',
    'src/pages/auth/Login.tsx',
    'src/pages/auth/Register.tsx'
  ];
  
  let allPagesExist = true;
  
  for (const page of requiredPages) {
    if (fs.existsSync(page)) {
      logSuccess(`Page ${page} existe`);
    } else {
      logWarning(`Page ${page} manquante`);
      allPagesExist = false;
    }
  }
  
  return allPagesExist;
}

// Test du store Zustand
function testStore() {
  log('\n🏪 TEST DU STORE ZUSTAND', 'cyan');
  
  try {
    const storeContent = fs.readFileSync('src/store/auth.ts', 'utf8');
    
    if (storeContent.includes('create') && storeContent.includes('zustand')) {
      logSuccess('Store Zustand configuré');
      return true;
    } else {
      logError('Store Zustand non configuré');
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test du store: ${error.message}`);
    return false;
  }
}

// Test de l'environnement
function testEnvironment() {
  log('\n🌍 TEST DE L\'ENVIRONNEMENT', 'cyan');
  
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    
    if (envContent.includes('VITE_SUPABASE_URL') && envContent.includes('VITE_SUPABASE_ANON_KEY')) {
      logSuccess('Variables d\'environnement configurées');
      return true;
    } else {
      logError('Variables d\'environnement manquantes');
      return false;
    }
  } catch (error) {
    logError(`Erreur lors du test de l'environnement: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runAllTests() {
  log('\n🚀 TEST COMPLET DE L\'APPLICATION CRYPTOBOOST', 'magenta');
  log('=' * 60, 'magenta');
  
  const startTime = Date.now();
  const results = [];
  
  // Tests synchrones
  results.push(['Structure du projet', testProjectStructure()]);
  results.push(['Dépendances', testDependencies()]);
  results.push(['Configuration Vite', testViteConfig()]);
  results.push(['Configuration TypeScript', testTypeScriptConfig()]);
  results.push(['Configuration Tailwind', testTailwindConfig()]);
  results.push(['Routes', testRoutes()]);
  results.push(['Composants', testComponents()]);
  results.push(['Pages', testPages()]);
  results.push(['Store Zustand', testStore()]);
  results.push(['Environnement', testEnvironment()]);
  results.push(['Serveur de développement', testDevServer()]);
  results.push(['Build', testBuild()]);
  
  // Tests asynchrones
  results.push(['Connexion Supabase', await testSupabaseConnection()]);
  results.push(['Base de données', await testDatabase()]);
  
  const totalTime = Date.now() - startTime;
  
  // Résumé
  log('\n🎉 RÉSUMÉ DES TESTS', 'green');
  log('=' * 40, 'green');
  
  let successCount = 0;
  let totalCount = results.length;
  
  for (const [testName, result] of results) {
    if (result) {
      logSuccess(`${testName}: OK`);
      successCount++;
    } else {
      logError(`${testName}: ÉCHEC`);
    }
  }
  
  const successRate = (successCount / totalCount) * 100;
  
  log('\n📊 STATISTIQUES', 'cyan');
  log(`Tests réussis: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
  log(`Temps total: ${totalTime}ms`);
  
  if (successRate >= 90) {
    log('\n🎯 VOTRE APPLICATION CRYPTOBOOST EST PRÊTE !', 'green');
    log('🌐 URL: https://cryptoboost.world/', 'cyan');
    log('📊 Dashboard Admin: https://cryptoboost.world/admin', 'cyan');
    log('👤 Dashboard Client: https://cryptoboost.world/client', 'cyan');
  } else {
    log('\n⚠️ DES PROBLÈMES ONT ÉTÉ DÉTECTÉS', 'yellow');
    log('Veuillez corriger les erreurs avant de déployer.', 'yellow');
  }
}

// Exécution des tests
runAllTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});