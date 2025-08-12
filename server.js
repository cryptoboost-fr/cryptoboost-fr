const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers middleware
const securityMiddleware = (_req, res, next) => {
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }

  next();
};

// Error handling middleware
const errorHandlingMiddleware = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong'
    });
  }

  res.status(500).json({
    error: err.message,
    stack: err.stack
  });
};
const PORT = process.env.PORT || 3000;

// Configuration de base
app.set('trust proxy', 1);
app.set('x-powered-by', false);

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.supabase.co"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://api.coinapi.io"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Security middleware
app.use(securityMiddleware);

// Compression
app.use(compression());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Routes API (si nécessaire)
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route pour toutes les autres requêtes (SPA)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware de gestion d'erreurs
app.use(errorHandlingMiddleware);

// Gestion des erreurs 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur CryptoBoost démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Sécurité: Activée`);
  console.log(`⚡ Compression: Activée`);
  console.log(`🛡️ Rate limiting: Activé`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, _promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  process.exit(1);
});

module.exports = app;