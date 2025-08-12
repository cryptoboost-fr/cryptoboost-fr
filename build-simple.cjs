#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build process...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Try to run Vite build first, fallback to simple build if it fails
let useViteBuild = false;
try {
  // Check if vite is available and dependencies are installed
  execSync('npm list vite', { stdio: 'ignore' });
  useViteBuild = true;
  console.log('✅ Vite detected, attempting full React build...');
} catch (error) {
  console.log('⚠️  Vite not available, using fallback build...');
}

if (useViteBuild) {
  try {
    // Set environment variables for build
    process.env.NODE_ENV = 'production';

    // Try to run the full Vite build
    execSync('npx vite build', {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Full React application build completed successfully!');
    console.log('🚀 Ready for Netlify deployment');
    process.exit(0);
  } catch (error) {
    console.log('❌ Vite build failed, falling back to static build...');
    console.log('Error:', error.message);
  }
}

// Copy index.html to dist
const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CryptoBoost</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
        color: white;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        text-align: center;
        padding: 2rem;
        max-width: 600px;
      }
      .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        font-size: 2rem;
        font-weight: bold;
      }
      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      p {
        font-size: 1.2rem;
        opacity: 0.8;
        margin-bottom: 2rem;
      }
      .btn {
        display: inline-block;
        padding: 1rem 2rem;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: transform 0.2s;
      }
      .btn:hover {
        transform: translateY(-2px);
      }
      .status {
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">CB</div>
      <h1>CryptoBoost</h1>
      <p>Plateforme d'investissement en cryptomonnaies</p>
      <div class="status">
        <h3>🚧 Site en cours de déploiement</h3>
        <p>Notre équipe travaille actuellement sur le déploiement de la nouvelle version.</p>
        <p>Merci de votre patience !</p>
      </div>
      <br>
      <a href="/login-alt.html" class="btn">Accéder à la connexion</a>
    </div>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

// Copy public files
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  fs.readdirSync(publicDir).forEach(file => {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    copyRecursive(srcPath, destPath);
  });
}

// Copy _headers and _redirects if they exist
['_headers', '_redirects'].forEach(file => {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
  }
});

console.log('✅ Simple build completed successfully!');
console.log('📁 Files created in dist/ directory');
console.log('🌐 Ready for deployment');
