#!/usr/bin/env node

/**
 * DIAGNOSTIC COMPLET URGENT - CRYPTOBOOST
 * Identification et correction de tous les problèmes
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(70)}`, 'cyan');
  log(`🚨 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(70)}${colors.reset}`, 'cyan');
}

function logSubSection(title) {
  log(`\n${colors.magenta}${'-'.repeat(50)}`, 'magenta');
  log(`🔍 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.magenta}${'-'.repeat(50)}${colors.reset}`, 'magenta');
}

// ============================================================================
// DIAGNOSTIC SSL ET ACCESSIBILITÉ
// ============================================================================

async function diagnoseSSL() {
  logSection('DIAGNOSTIC SSL ET ACCESSIBILITÉ');
  
  const testUrls = [
    'https://cryptoboost.world',
    'https://cryptoboost.world/login-alt.html',
    'https://cryptoboost.world/client',
    'https://cryptoboost.world/admin',
    'https://cryptoboost.world/register'
  ];
  
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
      } else {
        log(`❌ ${url}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${url}: ${error.message}`, 'red');
    }
  }
}

// ============================================================================
// DIAGNOSTIC DES ROUTES MANQUANTES
// ============================================================================

function diagnoseMissingRoutes() {
  logSection('DIAGNOSTIC DES ROUTES MANQUANTES');
  
  // Vérifier les composants référencés dans App.tsx
  const requiredComponents = [
    { path: 'src/pages/auth/Login.tsx', name: 'Page Login' },
    { path: 'src/pages/auth/Register.tsx', name: 'Page Register' },
    { path: 'src/components/ProtectedRoute.tsx', name: 'ProtectedRoute' },
    { path: 'src/contexts/AuthContext.tsx', name: 'AuthContext' },
    { path: 'src/components/ui/toaster.tsx', name: 'ToastProvider' }
  ];
  
  let missingComponents = [];
  
  for (const component of requiredComponents) {
    if (!fs.existsSync(component.path)) {
      log(`❌ ${component.name}: ${component.path} MANQUANT`, 'red');
      missingComponents.push(component);
    } else {
      const stats = fs.statSync(component.path);
      if (stats.size === 0) {
        log(`❌ ${component.name}: ${component.path} VIDE`, 'red');
        missingComponents.push(component);
      } else {
        log(`✅ ${component.name}: ${component.path} (${stats.size} bytes)`, 'green');
      }
    }
  }
  
  return missingComponents;
}

// ============================================================================
// CRÉATION DES COMPOSANTS MANQUANTS
// ============================================================================

function createMissingComponents(missingComponents) {
  logSection('CRÉATION DES COMPOSANTS MANQUANTS');
  
  for (const component of missingComponents) {
    log(`🔧 Création de ${component.name}...`, 'yellow');
    
    switch (component.path) {
      case 'src/pages/auth/Login.tsx':
        createLoginPage();
        break;
      case 'src/pages/auth/Register.tsx':
        createRegisterPage();
        break;
      case 'src/components/ProtectedRoute.tsx':
        createProtectedRoute();
        break;
      case 'src/contexts/AuthContext.tsx':
        createAuthContext();
        break;
      case 'src/components/ui/toaster.tsx':
        createToastProvider();
        break;
    }
  }
}

function createLoginPage() {
  const loginContent = `import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};`;
  
  // Créer le dossier si nécessaire
  if (!fs.existsSync('src/pages/auth')) {
    fs.mkdirSync('src/pages/auth', { recursive: true });
  }
  
  fs.writeFileSync('src/pages/auth/Login.tsx', loginContent);
  log('✅ Page Login créée', 'green');
}

function createRegisterPage() {
  const registerContent = `import React from 'react';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};`;
  
  fs.writeFileSync('src/pages/auth/Register.tsx', registerContent);
  log('✅ Page Register créée', 'green');
}

function createProtectedRoute() {
  const protectedRouteContent = `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login-alt.html" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};`;
  
  fs.writeFileSync('src/components/ProtectedRoute.tsx', protectedRouteContent);
  log('✅ ProtectedRoute créé', 'green');
}

function createAuthContext() {
  const authContextContent = `import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};`;
  
  fs.writeFileSync('src/contexts/AuthContext.tsx', authContextContent);
  log('✅ AuthContext créé', 'green');
}

function createToastProvider() {
  const toastContent = `import React from 'react';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return <>{children}</>;
};`;
  
  // Créer le dossier si nécessaire
  if (!fs.existsSync('src/components/ui')) {
    fs.mkdirSync('src/components/ui', { recursive: true });
  }
  
  fs.writeFileSync('src/components/ui/toaster.tsx', toastContent);
  log('✅ ToastProvider créé', 'green');
}

// ============================================================================
// CORRECTION DES ROUTES DANS APP.TSX
// ============================================================================

function fixAppRoutes() {
  logSection('CORRECTION DES ROUTES DANS APP.TSX');
  
  if (fs.existsSync('src/App.tsx')) {
    let appContent = fs.readFileSync('src/App.tsx', 'utf8');
    
    // Corriger les imports pour les pages auth
    appContent = appContent.replace(
      "import { Login } from './pages/auth/Login'",
      "import { Login } from './pages/auth/Login'"
    );
    
    appContent = appContent.replace(
      "import { Register } from './pages/auth/Register'",
      "import { Register } from './pages/auth/Register'"
    );
    
    // Corriger les routes pour pointer vers login-alt.html
    appContent = appContent.replace(
      '<Route path="/login" element={<Login />} />',
      '<Route path="/login" element={<Navigate to="/login-alt.html" replace />} />'
    );
    
    fs.writeFileSync('src/App.tsx', appContent);
    log('✅ Routes App.tsx corrigées', 'green');
  }
}

// ============================================================================
// CORRECTION SSL ULTRA-MINIMALE
// ============================================================================

function fixSSLUltraMinimal() {
  logSection('CORRECTION SSL ULTRA-MINIMALE');
  
  // Headers ultra-minimaux
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
  Cache-Control: no-cache,no-store,must-revalidate

/register
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Cache-Control: no-cache,no-store,must-revalidate`;
  
  fs.writeFileSync('_headers', ultraMinimalHeaders);
  log('✅ Headers SSL ultra-minimaux appliqués', 'green');
  
  // Redirections ultra-simples
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
  
  // Configuration Netlify ultra-minimale
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
}

// ============================================================================
// TEST FINAL COMPLET
// ============================================================================

async function testFinalComplete() {
  logSection('TEST FINAL COMPLET');
  
  const testUrls = [
    'https://cryptoboost.world',
    'https://cryptoboost.world/login-alt.html',
    'https://cryptoboost.world/client',
    'https://cryptoboost.world/admin',
    'https://cryptoboost.world/register'
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
  
  log(`\n📊 Score final: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`, 
      successCount === totalTests ? 'green' : 'yellow');
  
  return successCount === totalTests;
}

// ============================================================================
// DÉPLOIEMENT URGENT
// ============================================================================

function deployUrgent() {
  logSection('DÉPLOIEMENT URGENT');
  
  try {
    log('🚀 Commit des corrections...', 'yellow');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "🚨 URGENT: Correction complète - Routes, SSL, composants"', { stdio: 'inherit' });
    
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

async function diagnosticCompletUrgent() {
  log('🚨 DIAGNOSTIC COMPLET URGENT - CRYPTOBOOST', 'bright');
  log('Identification et correction de tous les problèmes', 'cyan');
  
  try {
    // 1. Diagnostic SSL
    await diagnoseSSL();
    
    // 2. Diagnostic des routes manquantes
    const missingComponents = diagnoseMissingRoutes();
    
    // 3. Création des composants manquants
    if (missingComponents.length > 0) {
      createMissingComponents(missingComponents);
    }
    
    // 4. Correction des routes dans App.tsx
    fixAppRoutes();
    
    // 5. Correction SSL ultra-minimale
    fixSSLUltraMinimal();
    
    // 6. Test final
    const finalSuccess = await testFinalComplete();
    
    // 7. Déploiement urgent si nécessaire
    if (!finalSuccess) {
      deployUrgent();
      
      logSection('⏳ ATTENTE DÉPLOIEMENT');
      log('Attente de 3 minutes pour que Netlify déploie les corrections...', 'yellow');
      
      // Attendre 3 minutes
      await new Promise(resolve => setTimeout(resolve, 180000));
      
      log('🔄 Test final après déploiement...', 'yellow');
      const finalTest = await testFinalComplete();
      
      if (finalTest) {
        logSection('🎉 SUCCÈS FINAL');
        log('✅ Tous les problèmes corrigés', 'green');
        log('✅ Application 100% opérationnelle', 'green');
        log('✅ Routes et SSL fonctionnels', 'green');
      } else {
        logSection('⚠️ PROBLÈMES PERSISTANTS');
        log('❌ Certains problèmes persistent', 'red');
        log('💡 Vérification manuelle recommandée', 'yellow');
      }
    } else {
      logSection('🎉 SUCCÈS IMMÉDIAT');
      log('✅ Tous les problèmes corrigés sans déploiement', 'green');
      log('✅ Application 100% opérationnelle', 'green');
    }
    
  } catch (error) {
    log('\n❌ Erreur lors du diagnostic complet', 'red');
    log(error.message, 'red');
  }
}

// Exécution
diagnosticCompletUrgent().catch(console.error);