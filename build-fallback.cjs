#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Creating fallback build for Netlify...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Enhanced index.html with navigation
const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoBoost - Plateforme d'investissement crypto</title>
    <meta name="description" content="Plateforme sécurisée d'investissement en cryptomonnaies avec des rendements optimisés">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            color: white;
            min-height: 100vh;
        }
        .header {
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav-buttons {
            display: flex;
            gap: 1rem;
        }
        .container {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 4rem 2rem;
        }
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.3rem;
            margin-bottom: 3rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s;
            margin: 0.5rem;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .btn-outline {
            background: transparent;
            border: 2px solid #667eea;
        }
        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .header { flex-direction: column; gap: 1rem; }
            .nav-buttons { flex-wrap: wrap; justify-content: center; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">CryptoBoost</div>
        <div class="nav-buttons">
            <a href="/login-alt.html" class="btn btn-outline">Connexion</a>
            <a href="/register-alt.html" class="btn">Inscription</a>
        </div>
    </header>

    <div class="container">
        <h1>CryptoBoost</h1>
        <p class="subtitle">
            Plateforme sécurisée d'investissement en cryptomonnaies<br>
            Maximisez vos rendements avec nos plans d'investissement automatisés
        </p>

        <div class="features">
            <div class="feature">
                <h3>🔒 Sécurité Maximale</h3>
                <p>Vos fonds sont protégés par les dernières technologies de sécurité blockchain</p>
            </div>
            <div class="feature">
                <h3>📈 Rendements Optimisés</h3>
                <p>Plans d'investissement avec des rendements allant jusqu'à 12.5% par trimestre</p>
            </div>
            <div class="feature">
                <h3>⚡ Trading Automatisé</h3>
                <p>Algorithmes de trading avancés pour maximiser vos profits 24h/24</p>
            </div>
        </div>

        <div style="margin-top: 3rem;">
            <a href="/register-alt.html" class="btn" style="font-size: 1.1rem; padding: 1.2rem 2.5rem;">
                Commencer à Investir
            </a>
            <a href="/login-alt.html" class="btn btn-outline">
                Accéder au Dashboard
            </a>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

// Copy public files if they exist
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

// Create _redirects for SPA
const redirects = `/*    /index.html   200`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirects);

console.log('✅ Fallback build completed successfully!');
console.log('📁 Files created in dist/ directory');
console.log('🌐 Ready for Netlify deployment');
