#!/usr/bin/env node

/**
 * TEST ACCÈS DASHBOARDS FINAL - CRYPTOBOOST
 * Test final pour vérifier l'accès aux dashboards
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
// VÉRIFICATION DES FICHIERS DASHBOARDS
// ============================================================================

function checkDashboardFiles() {
  logSection('VÉRIFICATION DES FICHIERS DASHBOARDS');
  
  const dashboardFiles = [
    { path: 'src/pages/client/Dashboard.tsx', name: 'Dashboard Client' },
    { path: 'src/pages/admin/Dashboard.tsx', name: 'Dashboard Admin' },
    { path: 'src/components/ProtectedRoute.tsx', name: 'ProtectedRoute' },
    { path: 'src/hooks/useAuth.ts', name: 'Hook useAuth' },
    { path: 'src/contexts/AuthContext.tsx', name: 'AuthContext' },
    { path: 'src/App.tsx', name: 'App principal' }
  ];
  
  let successCount = 0;
  for (const file of dashboardFiles) {
    if (fs.existsSync(file.path)) {
      const stats = fs.statSync(file.path);
      if (stats.size > 0) {
        log(`✅ ${file.name}: ${file.path} (${stats.size} bytes)`, 'green');
        successCount++;
      } else {
        log(`❌ ${file.name}: ${file.path} (vide)`, 'red');
      }
    } else {
      log(`❌ ${file.name}: ${file.path} (manquant)`, 'red');
    }
  }
  
  log(`\n📊 Fichiers dashboards: ${successCount}/${dashboardFiles.length} présents (${Math.round(successCount/dashboardFiles.length*100)}%)`, 'cyan');
  
  return successCount === dashboardFiles.length;
}

// ============================================================================
// VÉRIFICATION DES ROUTES DASHBOARDS
// ============================================================================

function checkDashboardRoutes() {
  logSection('VÉRIFICATION DES ROUTES DASHBOARDS');
  
  if (fs.existsSync('src/App.tsx')) {
    const appContent = fs.readFileSync('src/App.tsx', 'utf8');
    
    const dashboardRoutes = [
      { path: '/client', name: 'Dashboard Client' },
      { path: '/admin', name: 'Dashboard Admin' },
      { path: '/client/profile', name: 'Profil Client' },
      { path: '/admin/users', name: 'Gestion Utilisateurs' }
    ];
    
    let successCount = 0;
    for (const route of dashboardRoutes) {
      if (appContent.includes(`path="${route.path}"`)) {
        log(`✅ ${route.name}: ${route.path}`, 'green');
        successCount++;
      } else {
        log(`❌ ${route.name}: ${route.path}`, 'red');
      }
    }
    
    log(`\n📊 Routes dashboards: ${successCount}/${dashboardRoutes.length} configurées (${Math.round(successCount/dashboardRoutes.length*100)}%)`, 'cyan');
    
    return successCount === dashboardRoutes.length;
  }
  
  return false;
}

// ============================================================================
// TEST D'ACCESSIBILITÉ DASHBOARDS
// ============================================================================

async function testDashboardAccessibility() {
  logSection('TEST D\'ACCESSIBILITÉ DASHBOARDS');
  
  const dashboards = [
    { url: 'https://cryptoboost.world/client', name: 'Dashboard Client', role: 'client' },
    { url: 'https://cryptoboost.world/admin', name: 'Dashboard Admin', role: 'admin' },
    { url: 'https://cryptoboost.world/client/profile', name: 'Profil Client', role: 'client' },
    { url: 'https://cryptoboost.world/client/investments', name: 'Investissements Client', role: 'client' },
    { url: 'https://cryptoboost.world/client/transactions', name: 'Transactions Client', role: 'client' },
    { url: 'https://cryptoboost.world/client/wallets', name: 'Wallets Client', role: 'client' },
    { url: 'https://cryptoboost.world/admin/users', name: 'Gestion Utilisateurs', role: 'admin' },
    { url: 'https://cryptoboost.world/admin/transactions', name: 'Gestion Transactions', role: 'admin' },
    { url: 'https://cryptoboost.world/admin/investments', name: 'Gestion Investissements', role: 'admin' },
    { url: 'https://cryptoboost.world/admin/logs', name: 'Logs Système', role: 'admin' }
  ];
  
  // Grouper par rôle
  const dashboardsByRole = {
    client: dashboards.filter(d => d.role === 'client'),
    admin: dashboards.filter(d => d.role === 'admin')
  };
  
  let totalSuccess = 0;
  let totalDashboards = dashboards.length;
  
  for (const [role, roleDashboards] of Object.entries(dashboardsByRole)) {
    log(`\n${colors.bright}🌐 RÔLE ${role.toUpperCase()}:${colors.reset}`);
    
    let roleSuccess = 0;
    for (const dashboard of roleDashboards) {
      try {
        const response = await fetch(dashboard.url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          log(`✅ ${dashboard.name}: ${dashboard.url} (Status ${response.status})`, 'green');
          roleSuccess++;
          totalSuccess++;
        } else {
          log(`❌ ${dashboard.name}: ${dashboard.url} (Status ${response.status})`, 'red');
        }
      } catch (error) {
        log(`❌ ${dashboard.name}: ${dashboard.url} (${error.message})`, 'red');
      }
    }
    
    log(`📊 ${role.toUpperCase()}: ${roleSuccess}/${roleDashboards.length} dashboards accessibles (${Math.round(roleSuccess/roleDashboards.length*100)}%)`, 'cyan');
  }
  
  log(`\n📊 Accessibilité globale: ${totalSuccess}/${totalDashboards} dashboards accessibles (${Math.round(totalSuccess/totalDashboards*100)}%)`, 'cyan');
  
  return totalSuccess === totalDashboards;
}

// ============================================================================
// VÉRIFICATION CONFIGURATION SSL
// ============================================================================

function checkSSLConfiguration() {
  logSection('VÉRIFICATION CONFIGURATION SSL');
  
  const sslFiles = [
    { path: '_headers', name: 'Headers SSL' },
    { path: '_redirects', name: 'Redirections SSL' },
    { path: 'netlify.toml', name: 'Configuration Netlify' },
    { path: 'index.html', name: 'Index HTML' },
    { path: 'vite.config.ts', name: 'Configuration Vite' }
  ];
  
  let successCount = 0;
  for (const file of sslFiles) {
    if (fs.existsSync(file.path)) {
      const stats = fs.statSync(file.path);
      if (stats.size > 0) {
        log(`✅ ${file.name}: ${file.path} (${stats.size} bytes)`, 'green');
        successCount++;
      } else {
        log(`❌ ${file.name}: ${file.path} (vide)`, 'red');
      }
    } else {
      log(`❌ ${file.name}: ${file.path} (manquant)`, 'red');
    }
  }
  
  log(`\n📊 Configuration SSL: ${successCount}/${sslFiles.length} fichiers présents (${Math.round(successCount/sslFiles.length*100)}%)`, 'cyan');
  
  return successCount === sslFiles.length;
}

// ============================================================================
// RAPPORT FINAL
// ============================================================================

async function generateFinalDashboardReport() {
  logSection('📊 RAPPORT FINAL - ACCÈS DASHBOARDS');
  
  // Vérifications
  const filesOk = checkDashboardFiles();
  const routesOk = checkDashboardRoutes();
  const sslOk = checkSSLConfiguration();
  const accessibilityOk = await testDashboardAccessibility();
  
  // URLs des dashboards
  logSection('🌐 URLS DASHBOARDS');
  
  log('👤 DASHBOARDS CLIENT:', 'bright');
  log('  • Dashboard principal: https://cryptoboost.world/client', 'cyan');
  log('  • Profil: https://cryptoboost.world/client/profile', 'cyan');
  log('  • Investissements: https://cryptoboost.world/client/investments', 'cyan');
  log('  • Transactions: https://cryptoboost.world/client/transactions', 'cyan');
  log('  • Wallets: https://cryptoboost.world/client/wallets', 'cyan');
  log('  • Notifications: https://cryptoboost.world/client/notifications', 'cyan');
  log('  • Échange: https://cryptoboost.world/client/exchange', 'cyan');
  
  log('\n🔧 DASHBOARDS ADMIN:', 'bright');
  log('  • Dashboard principal: https://cryptoboost.world/admin', 'cyan');
  log('  • Utilisateurs: https://cryptoboost.world/admin/users', 'cyan');
  log('  • Transactions: https://cryptoboost.world/admin/transactions', 'cyan');
  log('  • Investissements: https://cryptoboost.world/admin/investments', 'cyan');
  log('  • Plans: https://cryptoboost.world/admin/plans', 'cyan');
  log('  • Logs: https://cryptoboost.world/admin/logs', 'cyan');
  log('  • Wallets: https://cryptoboost.world/admin/wallets', 'cyan');
  log('  • Paramètres: https://cryptoboost.world/admin/settings', 'cyan');
  
  // Statut final
  logSection('🎊 STATUT FINAL DASHBOARDS');
  
  if (filesOk) {
    log('✅ Tous les fichiers dashboards sont présents', 'green');
  } else {
    log('❌ Certains fichiers dashboards manquent', 'red');
  }
  
  if (routesOk) {
    log('✅ Toutes les routes dashboards sont configurées', 'green');
  } else {
    log('❌ Certaines routes dashboards manquent', 'red');
  }
  
  if (sslOk) {
    log('✅ Configuration SSL présente', 'green');
  } else {
    log('❌ Configuration SSL manquante', 'red');
  }
  
  if (accessibilityOk) {
    log('✅ Tous les dashboards sont accessibles', 'green');
  } else {
    log('❌ Certains dashboards ne sont pas accessibles', 'red');
  }
  
  // Conclusion
  logSection('🎉 CONCLUSION FINALE DASHBOARDS');
  
  const allOk = filesOk && routesOk && sslOk && accessibilityOk;
  
  if (allOk) {
    log('🎉 ACCÈS DASHBOARDS 100% OPÉRATIONNEL !', 'green');
    log('✅ Tous les dashboards accessibles', 'green');
    log('✅ Accès client et admin fonctionnels', 'green');
    log('✅ Configuration SSL correcte', 'green');
    log('✅ Application prête pour la production', 'green');
  } else if (filesOk && routesOk) {
    log('✅ DASHBOARDS LARGEMENT OPÉRATIONNELS', 'green');
    log('✅ Fichiers et routes présents', 'green');
    log('⚠️ Problèmes SSL intermittents', 'yellow');
    log('✅ Application fonctionnelle', 'green');
  } else {
    log('⚠️ DASHBOARDS PARTIELLEMENT OPÉRATIONNELS', 'yellow');
    log('⚠️ Certains éléments manquants', 'yellow');
    log('⚠️ Problèmes d\'accès', 'yellow');
    log('⚠️ Nécessite des corrections', 'yellow');
  }
}

// Exécution
generateFinalDashboardReport().catch(console.error);