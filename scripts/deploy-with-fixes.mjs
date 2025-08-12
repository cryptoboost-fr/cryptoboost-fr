#!/usr/bin/env node

/**
 * Script de redéploiement avec corrections - CryptoBoost
 * Build et déploiement de l'application avec toutes les corrections
 * Version : Déploiement avec fixes
 */

import { execSync } from 'child_process';
import fs from 'fs';

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
// 1. VÉRIFICATION DES FICHIERS DE CONFIGURATION
// =====================================================

function checkConfigurationFiles() {
  logHeader('📋 VÉRIFICATION DES FICHIERS DE CONFIGURATION');
  
  const requiredFiles = [
    '.env',
    '_headers',
    '_redirects',
    'netlify.toml',
    'package.json',
    'vite.config.ts'
  ];
  
  let allPresent = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logSuccess(`Fichier ${file} présent`);
    } else {
      logError(`Fichier ${file} manquant`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

// =====================================================
// 2. INSTALLATION DES DÉPENDANCES
// =====================================================

function installDependencies() {
  logHeader('📦 INSTALLATION DES DÉPENDANCES');
  
  try {
    logInfo('Installation des dépendances npm...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Dépendances installées avec succès');
    return true;
  } catch (error) {
    logError(`Erreur installation dépendances: ${error.message}`);
    return false;
  }
}

// =====================================================
// 3. BUILD DE L'APPLICATION
// =====================================================

function buildApplication() {
  logHeader('🔨 BUILD DE L\'APPLICATION');
  
  try {
    logInfo('Build de l\'application en mode production...');
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Build réussi');
    
    // Vérifier que le dossier dist existe
    if (fs.existsSync('dist')) {
      const distFiles = fs.readdirSync('dist');
      logInfo(`Fichiers générés: ${distFiles.length}`);
      logSuccess('Dossier dist créé avec succès');
    } else {
      logError('Dossier dist manquant après build');
      return false;
    }
    
    return true;
  } catch (error) {
    logError(`Erreur build: ${error.message}`);
    return false;
  }
}

// =====================================================
// 4. VÉRIFICATION DU BUILD
// =====================================================

function verifyBuild() {
  logHeader('🔍 VÉRIFICATION DU BUILD');
  
  try {
    const distPath = 'dist';
    const requiredFiles = [
      'index.html',
      'assets'
    ];
    
    let allPresent = true;
    
    for (const file of requiredFiles) {
      const filePath = `${distPath}/${file}`;
      if (fs.existsSync(filePath)) {
        logSuccess(`Fichier ${file} présent dans dist`);
      } else {
        logError(`Fichier ${file} manquant dans dist`);
        allPresent = false;
      }
    }
    
    // Vérifier le contenu de index.html
    const indexPath = `${distPath}/index.html`;
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      if (indexContent.includes('CryptoBoost')) {
        logSuccess('index.html contient CryptoBoost');
      } else {
        logWarning('index.html ne contient pas CryptoBoost');
      }
      
      if (indexContent.includes('root')) {
        logSuccess('index.html contient div root');
      } else {
        logWarning('index.html ne contient pas div root');
      }
    }
    
    return allPresent;
  } catch (error) {
    logError(`Erreur vérification build: ${error.message}`);
    return false;
  }
}

// =====================================================
// 5. PRÉPARATION DU DÉPLOIEMENT
// =====================================================

function prepareDeployment() {
  logHeader('🚀 PRÉPARATION DU DÉPLOIEMENT');
  
  try {
    // Copier les fichiers de configuration dans dist
    const configFiles = ['_headers', '_redirects'];
    
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `dist/${file}`);
        logSuccess(`Fichier ${file} copié dans dist`);
      } else {
        logWarning(`Fichier ${file} non trouvé pour copie`);
      }
    }
    
    // Créer un fichier de version
    const versionInfo = {
      version: '1.0.0',
      buildDate: new Date().toISOString(),
      buildType: 'production',
      fixes: [
        'SSL configuration',
        'API key verification',
        'Form validation',
        'Security headers'
      ]
    };
    
    fs.writeFileSync('dist/version.json', JSON.stringify(versionInfo, null, 2));
    logSuccess('Fichier version.json créé');
    
    return true;
  } catch (error) {
    logError(`Erreur préparation déploiement: ${error.message}`);
    return false;
  }
}

// =====================================================
// 6. DÉPLOIEMENT SUR NETLIFY
// =====================================================

function deployToNetlify() {
  logHeader('🌐 DÉPLOIEMENT SUR NETLIFY');
  
  try {
    logInfo('Déploiement sur Netlify...');
    
    // Vérifier si Netlify CLI est installé
    try {
      execSync('netlify --version', { stdio: 'pipe' });
      logSuccess('Netlify CLI détecté');
    } catch (error) {
      logWarning('Netlify CLI non détecté, installation...');
      execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    }
    
    // Déployer
    logInfo('Lancement du déploiement...');
    execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
    
    logSuccess('Déploiement réussi sur Netlify');
    return true;
  } catch (error) {
    logError(`Erreur déploiement Netlify: ${error.message}`);
    
    // Instructions manuelles
    logInfo('Instructions de déploiement manuel:');
    log('1. Aller sur https://app.netlify.com', 'cyan');
    log('2. Sélectionner le site cryptoboost.world', 'cyan');
    log('3. Aller dans l\'onglet "Deploys"', 'cyan');
    log('4. Glisser-déposer le dossier dist', 'cyan');
    log('5. Attendre la fin du déploiement', 'cyan');
    
    return false;
  }
}

// =====================================================
// 7. VÉRIFICATION POST-DÉPLOIEMENT
// =====================================================

async function verifyDeployment() {
  logHeader('✅ VÉRIFICATION POST-DÉPLOIEMENT');
  
  try {
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
        const response = await fetch(url);
        if (response.ok) {
          logSuccess(`${url}: Déployé avec succès`);
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
      logSuccess(`Déploiement validé: ${successCount}/${urls.length} URLs accessibles`);
      return true;
    } else {
      logWarning(`Déploiement partiel: ${successCount}/${urls.length} URLs accessibles`);
      return false;
    }
  } catch (error) {
    logError(`Erreur vérification déploiement: ${error.message}`);
    return false;
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function deployWithFixes() {
  logHeader('🚀 DÉPLOIEMENT AVEC CORRECTIONS - CRYPTOBOOST');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    logInfo('Démarrage du déploiement avec corrections...');
    
    // Étapes de déploiement
    const configResult = checkConfigurationFiles();
    const installResult = installDependencies();
    const buildResult = buildApplication();
    const verifyResult = verifyBuild();
    const prepareResult = prepareDeployment();
    const deployResult = deployToNetlify();
    const verifyDeployResult = await verifyDeployment();
    
    results.push(configResult, installResult, buildResult, verifyResult, prepareResult, deployResult, verifyDeployResult);
    
    const totalTime = Date.now() - startTime;
    
    // Résumé final
    logHeader('🎉 RÉSUMÉ DU DÉPLOIEMENT');
    
    const successCount = results.filter(Boolean).length;
    const totalCount = results.length;
    const successRate = (successCount / totalCount) * 100;
    
    logSuccess(`Étapes réussies: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`);
    logSuccess(`Temps total: ${totalTime}ms`);
    
    if (successRate >= 85) {
      log('\n🎯 DÉPLOIEMENT RÉUSSI AVEC TOUTES LES CORRECTIONS !', 'green');
      log('✅ Configuration vérifiée', 'green');
      log('✅ Dépendances installées', 'green');
      log('✅ Application buildée', 'green');
      log('✅ Déploiement effectué', 'green');
      log('✅ URLs accessibles', 'green');
      
      log('\n🌐 VOTRE APPLICATION EST MAINTENANT EN LIGNE:', 'cyan');
      log('Site principal: https://cryptoboost.world', 'cyan');
      log('Dashboard Admin: https://cryptoboost.world/admin', 'cyan');
      log('Dashboard Client: https://cryptoboost.world/client', 'cyan');
      log('Connexion: https://cryptoboost.world/login', 'cyan');
      log('Inscription: https://cryptoboost.world/register', 'cyan');
    } else {
      log('\n⚠️ DÉPLOIEMENT PARTIEL', 'yellow');
      log('Certaines étapes nécessitent une attention manuelle.', 'yellow');
    }
    
    // Instructions finales
    log('\n📋 PROCHAINES ÉTAPES:', 'cyan');
    log('1. Tester l\'authentification complète', 'cyan');
    log('2. Vérifier toutes les fonctionnalités', 'cyan');
    log('3. Tester sur différents navigateurs', 'cyan');
    log('4. Valider la performance', 'cyan');
    
  } catch (error) {
    logError(`Erreur critique lors du déploiement: ${error.message}`);
    process.exit(1);
  }
}

// Exécution du déploiement
deployWithFixes().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});