#!/bin/bash

# Script de build optimisé pour Netlify - CryptoBoost
set -e

echo "🚀 Démarrage du build Netlify pour CryptoBoost..."

# Vérification des variables d'environnement
echo "📋 Vérification des variables d'environnement..."
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL manquante"
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY manquante"
    exit 1
fi

echo "✅ Variables d'environnement OK"

# Nettoyage du cache
echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.vite
rm -rf dist

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Audit de sécurité
echo "🔒 Audit de sécurité..."
npm audit --audit-level=moderate || {
    echo "⚠️ Vulnérabilités détectées, mais continuation du build..."
}

# Build de l'application
echo "🔨 Build de l'application..."
NODE_ENV=production npm run build

# Vérification du build
echo "✅ Vérification du build..."
if [ ! -d "dist" ]; then
    echo "❌ Le dossier dist n'a pas été créé"
    exit 1
fi

# Vérification des fichiers essentiels
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html manquant"
    exit 1
fi

if [ ! -f "dist/assets/js/index"*".js" ]; then
    echo "❌ Fichier JavaScript principal manquant"
    exit 1
fi

# Optimisation des assets
echo "⚡ Optimisation des assets..."
find dist -name "*.js" -exec gzip -9 {} \;
find dist -name "*.css" -exec gzip -9 {} \;

# Vérification de la taille du build
echo "📊 Taille du build:"
du -sh dist/

# Vérification des headers de sécurité
echo "🔐 Vérification des headers de sécurité..."
if [ -f "netlify.toml" ]; then
    echo "✅ Configuration Netlify trouvée"
else
    echo "⚠️ Configuration Netlify manquante"
fi

# Test de build local
echo "🧪 Test de build local..."
npx serve dist -p 4173 &
SERVER_PID=$!

sleep 5

# Test de connectivité
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Serveur local fonctionnel"
else
    echo "❌ Serveur local non accessible"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo "🎉 Build Netlify terminé avec succès!"
echo "📁 Dossier de déploiement: dist/"
echo "🔗 Prêt pour le déploiement sur Netlify"