#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION SSL ET CONFIGURATION
 * Résout les problèmes SSL et améliore la configuration de l'application
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
// CORRECTION DES EN-TÊTES DE SÉCURITÉ
// ============================================================================

function updateHeadersFile() {
  logSection('🔒 MISE À JOUR DES EN-TÊTES DE SÉCURITÉ');
  
  const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ropzeweidvjkfeyyuiim.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://ropzeweidvjkfeyyuiim.supabase.co https://api.coinapi.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=();
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

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
`;

  try {
    fs.writeFileSync('_headers', headersContent);
    log('✅ Fichier _headers mis à jour avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour _headers: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// AMÉLIORATION DES REDIRECTIONS
// ============================================================================

function updateRedirectsFile() {
  logSection('🔄 MISE À JOUR DES REDIRECTIONS');
  
  const redirectsContent = `# Redirections HTTPS
http://cryptoboost.world/* https://cryptoboost.world/:splat 301!
http://www.cryptoboost.world/* https://cryptoboost.world/:splat 301!

# Redirections SPA
/* /index.html 200

# Redirections de sécurité
/.env /404.html 404
/package.json /404.html 404
/README.md /404.html 404

# Redirections API (si nécessaire)
/api/* https://ropzeweidvjkfeyyuiim.supabase.co/:splat 200

# Redirections de maintenance (décommenter si nécessaire)
# /maintenance /maintenance.html 200
# /* /maintenance.html 503
`;

  try {
    fs.writeFileSync('_redirects', redirectsContent);
    log('✅ Fichier _redirects mis à jour avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour _redirects: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION D'UN FICHIER ROBOTS.TXT
// ============================================================================

function createRobotsTxt() {
  logSection('🤖 CRÉATION DU FICHIER ROBOTS.TXT');
  
  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://cryptoboost.world/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /client/
Disallow: /api/
Disallow: /_headers
Disallow: /_redirects

# Crawl-delay
Crawl-delay: 1
`;

  try {
    fs.writeFileSync('public/robots.txt', robotsContent);
    log('✅ Fichier robots.txt créé avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création robots.txt: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION D'UN FICHIER SITEMAP.XML
// ============================================================================

function createSitemapXml() {
  logSection('🗺️ CRÉATION DU FICHIER SITEMAP.XML');
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cryptoboost.world/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cryptoboost.world/login</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cryptoboost.world/register</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  try {
    fs.writeFileSync('public/sitemap.xml', sitemapContent);
    log('✅ Fichier sitemap.xml créé avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création sitemap.xml: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// AMÉLIORATION DU FICHIER VITE.CONFIG.TS
// ============================================================================

function updateViteConfig() {
  logSection('⚙️ MISE À JOUR DE LA CONFIGURATION VITE');
  
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
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})`;

  try {
    fs.writeFileSync('vite.config.ts', viteConfigContent);
    log('✅ Fichier vite.config.ts mis à jour avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour vite.config.ts: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION D'UN FICHIER MANIFEST.JSON POUR PWA
// ============================================================================

function createManifestJson() {
  logSection('📱 CRÉATION DU MANIFEST.JSON PWA');
  
  const manifestContent = `{
  "name": "CryptoBoost - Plateforme d'Investissement Crypto",
  "short_name": "CryptoBoost",
  "description": "Plateforme d'investissement crypto moderne et sécurisée",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["finance", "business", "productivity"],
  "lang": "fr",
  "dir": "ltr"
}`;

  try {
    fs.writeFileSync('public/manifest.json', manifestContent);
    log('✅ Fichier manifest.json créé avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création manifest.json: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION D'UN SERVICE WORKER BASIQUE
// ============================================================================

function createServiceWorker() {
  logSection('🔧 CRÉATION DU SERVICE WORKER');
  
  const swContent = `// Service Worker pour CryptoBoost
const CACHE_NAME = 'cryptoboost-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request);
      }
    )
  );
});`;

  try {
    fs.writeFileSync('public/sw.js', swContent);
    log('✅ Service Worker créé avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création Service Worker: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION D'UN FICHIER .GITIGNORE AMÉLIORÉ
// ============================================================================

function updateGitignore() {
  logSection('🚫 MISE À JOUR DU .GITIGNORE');
  
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# Supabase
.supabase/

# Testing
coverage/
.nyc_output/

# Misc
*.tgz
*.tar.gz
`;

  try {
    fs.writeFileSync('.gitignore', gitignoreContent);
    log('✅ Fichier .gitignore mis à jour avec succès', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour .gitignore: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixSSLAndConfig() {
  log('🔧 CORRECTION SSL ET CONFIGURATION CRYPTOBOOST', 'bright');
  log('Amélioration de la sécurité et de la configuration', 'cyan');
  
  try {
    // Créer le dossier public s'il n'existe pas
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
      log('✅ Dossier public créé', 'green');
    }

    // 1. Mettre à jour les en-têtes de sécurité
    const headersOk = updateHeadersFile();

    // 2. Mettre à jour les redirections
    const redirectsOk = updateRedirectsFile();

    // 3. Créer robots.txt
    const robotsOk = createRobotsTxt();

    // 4. Créer sitemap.xml
    const sitemapOk = createSitemapXml();

    // 5. Mettre à jour vite.config.ts
    const viteOk = updateViteConfig();

    // 6. Créer manifest.json
    const manifestOk = createManifestJson();

    // 7. Créer Service Worker
    const swOk = createServiceWorker();

    // 8. Mettre à jour .gitignore
    const gitignoreOk = updateGitignore();

    // Résumé final
    logSection('📊 RÉSUMÉ DES CORRECTIONS');
    log(`✅ En-têtes de sécurité: ${headersOk ? 'OK' : 'ERREUR'}`, headersOk ? 'green' : 'red');
    log(`✅ Redirections: ${redirectsOk ? 'OK' : 'ERREUR'}`, redirectsOk ? 'green' : 'red');
    log(`✅ Robots.txt: ${robotsOk ? 'OK' : 'ERREUR'}`, robotsOk ? 'green' : 'red');
    log(`✅ Sitemap.xml: ${sitemapOk ? 'OK' : 'ERREUR'}`, sitemapOk ? 'green' : 'red');
    log(`✅ Vite config: ${viteOk ? 'OK' : 'ERREUR'}`, viteOk ? 'green' : 'red');
    log(`✅ Manifest.json: ${manifestOk ? 'OK' : 'ERREUR'}`, manifestOk ? 'green' : 'red');
    log(`✅ Service Worker: ${swOk ? 'OK' : 'ERREUR'}`, swOk ? 'green' : 'red');
    log(`✅ .gitignore: ${gitignoreOk ? 'OK' : 'ERREUR'}`, gitignoreOk ? 'green' : 'red');

    const successCount = [headersOk, redirectsOk, robotsOk, sitemapOk, viteOk, manifestOk, swOk, gitignoreOk].filter(Boolean).length;
    
    if (successCount === 8) {
      log('\n🎉 TOUTES LES CORRECTIONS ONT ÉTÉ APPLIQUÉES AVEC SUCCÈS !', 'bright');
      log('✅ SSL et configuration optimisés', 'green');
      log('✅ Sécurité renforcée', 'green');
      log('✅ PWA configurée', 'green');
      log('✅ SEO optimisé', 'green');
    } else {
      log(`\n⚠️  ${8 - successCount} correction(s) ont échoué`, 'yellow');
    }

  } catch (error) {
    log('\n❌ Erreur lors des corrections', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixSSLAndConfig().catch(console.error);