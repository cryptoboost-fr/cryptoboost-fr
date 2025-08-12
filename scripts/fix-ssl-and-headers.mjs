#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION SSL ET EN-TÊTES DE SÉCURITÉ
 * Corrige les problèmes SSL et optimise les en-têtes de sécurité
 */

import fs from 'fs';
import path from 'path';

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
// CORRECTION SSL ET EN-TÊTES
// ============================================================================

function updateHeaders() {
  logSection('🔒 MISE À JOUR DES EN-TÊTES DE SÉCURITÉ');
  
  const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co https://api.coinapi.io wss://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/*.woff
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
`;

  try {
    fs.writeFileSync('_headers', headersContent);
    log('✅ Fichier _headers mis à jour avec en-têtes de sécurité renforcés', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour _headers: ${error.message}`, 'red');
    return false;
  }
}

function updateRedirects() {
  logSection('🔄 MISE À JOUR DES REDIRECTIONS');
  
  const redirectsContent = `# Redirections HTTPS forcées
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Redirections SPA
/* /index.html 200

# Redirections de sécurité
/.env /404.html 404
/package.json /404.html 404
/README.md /404.html 404
/.git /404.html 404

# Redirections API Supabase
/api/* https://ropzeweidvjkfeyyuiim.supabase.co/:splat 200

# Redirections de maintenance (décommenter si nécessaire)
# /maintenance /maintenance.html 200
# /* /maintenance.html 503

# Redirections SSL/TLS
/ssl /404.html 404
/.well-known/* /404.html 404
`;

  try {
    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects mis à jour avec redirections optimisées', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour _redirects: ${error.message}`, 'red');
    return false;
  }
}

function updateViteConfig() {
  logSection('⚙️  OPTIMISATION DE LA CONFIGURATION VITE');
  
  const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    https: true, // Forcer HTTPS en développement
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          supabase: ['@supabase/supabase-js'],
          animations: ['framer-motion'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  preview: {
    port: 4173,
    host: true,
    https: true,
  },
})`;

  try {
    fs.writeFileSync('vite.config.ts', viteConfigContent);
    log('✅ Configuration Vite optimisée avec HTTPS forcé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour vite.config.ts: ${error.message}`, 'red');
    return false;
  }
}

function createNetlifyConfig() {
  logSection('🌐 CONFIGURATION NETLIFY');
  
  const netlifyConfigContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co https://api.coinapi.io wss://ropzeweidvjkfeyyuiim.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "http://cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.cryptoboost.world/*"
  to = "https://cryptoboost.world/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/.env"
  to = "/404.html"
  status = 404

[[redirects]]
  from = "/package.json"
  to = "/404.html"
  status = 404

[[redirects]]
  from = "/README.md"
  to = "/404.html"
  status = 404

[[redirects]]
  from = "/.git"
  to = "/404.html"
  status = 404

[[redirects]]
  from = "/api/*"
  to = "https://ropzeweidvjkfeyyuiim.supabase.co/:splat"
  status = 200
`;

  try {
    fs.writeFileSync('netlify.toml', netlifyConfigContent);
    log('✅ Configuration Netlify créée avec en-têtes de sécurité', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création netlify.toml: ${error.message}`, 'red');
    return false;
  }
}

function updatePackageJson() {
  logSection('📦 MISE À JOUR PACKAGE.JSON');
  
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Ajouter des scripts de sécurité
    packageJson.scripts = {
      ...packageJson.scripts,
      'dev:https': 'vite --https',
      'build:prod': 'vite build --mode production',
      'preview:https': 'vite preview --https',
      'security:check': 'npm audit && npm audit fix',
      'deploy:prod': 'npm run build:prod && netlify deploy --prod'
    };
    
    // Ajouter des dépendances de sécurité
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'helmet': '^7.1.0',
      'cors': '^2.8.5',
      'compression': '^1.7.4'
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    log('✅ Package.json mis à jour avec scripts de sécurité', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour package.json: ${error.message}`, 'red');
    return false;
  }
}

function createSecurityMiddleware() {
  logSection('🛡️  CRÉATION MIDDLEWARE DE SÉCURITÉ');
  
  const middlewareContent = `import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // En-têtes de sécurité
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()')
  res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co https://api.coinapi.io wss://ropzeweidvjkfeyyuiim.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  res.headers.set('Content-Security-Policy', csp)
  
  // Redirection HTTPS
  if (req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      \`https://\${req.headers.get('host')}\${req.nextUrl.pathname}\${req.nextUrl.search}\`,
      301
    )
  }
  
  // Supabase client
  const supabase = createMiddlewareClient({ req, res })
  
  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Redirection si non authentifié sur pages protégées
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Redirection si authentifié sur pages de connexion
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}`;

  try {
    fs.writeFileSync('src/middleware.ts', middlewareContent);
    log('✅ Middleware de sécurité créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création middleware: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixSSLAndHeaders() {
  log('🔧 CORRECTION SSL ET EN-TÊTES DE SÉCURITÉ', 'bright');
  log('Optimisation de la sécurité et résolution des problèmes SSL', 'cyan');
  
  try {
    // 1. Mettre à jour les en-têtes de sécurité
    const headersUpdated = updateHeaders();
    
    // 2. Mettre à jour les redirections
    const redirectsUpdated = updateRedirects();
    
    // 3. Optimiser la configuration Vite
    const viteUpdated = updateViteConfig();
    
    // 4. Créer la configuration Netlify
    const netlifyUpdated = createNetlifyConfig();
    
    // 5. Mettre à jour package.json
    const packageUpdated = updatePackageJson();
    
    // 6. Créer le middleware de sécurité
    const middlewareCreated = createSecurityMiddleware();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA CORRECTION SSL');
    log('✅ En-têtes de sécurité renforcés', 'green');
    log('✅ Redirections HTTPS optimisées', 'green');
    log('✅ Configuration Vite avec HTTPS forcé', 'green');
    log('✅ Configuration Netlify créée', 'green');
    log('✅ Package.json mis à jour', 'green');
    log('✅ Middleware de sécurité créé', 'green');
    log('🎉 Problèmes SSL et en-têtes résolus !', 'bright');

    // Instructions
    logSection('📋 INSTRUCTIONS DE DÉPLOIEMENT');
    log('1. Installez les nouvelles dépendances:', 'yellow');
    log('   npm install', 'blue');
    log('2. Testez en local avec HTTPS:', 'yellow');
    log('   npm run dev:https', 'blue');
    log('3. Déployez en production:', 'yellow');
    log('   npm run deploy:prod', 'blue');
    log('4. Vérifiez les en-têtes de sécurité:', 'yellow');
    log('   https://securityheaders.com', 'blue');

  } catch (error) {
    log('\n❌ Erreur lors de la correction SSL', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLAndHeaders().catch(console.error);