import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Zap, 
  Shield, 
  Database, 
  Key, 
  Globe,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Api = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/prices',
      description: 'Récupérer les prix en temps réel',
      example: 'curl -X GET "https://api.cryptoboost.world/v1/prices?symbol=BTC"'
    },
    {
      method: 'POST',
      path: '/api/v1/investments',
      description: 'Créer un nouvel investissement',
      example: 'curl -X POST "https://api.cryptoboost.world/v1/investments" -H "Authorization: Bearer YOUR_TOKEN"'
    },
    {
      method: 'GET',
      path: '/api/v1/portfolio',
      description: 'Récupérer le portfolio utilisateur',
      example: 'curl -X GET "https://api.cryptoboost.world/v1/portfolio" -H "Authorization: Bearer YOUR_TOKEN"'
    },
    {
      method: 'POST',
      path: '/api/v1/transactions',
      description: 'Créer une transaction',
      example: 'curl -X POST "https://api.cryptoboost.world/v1/transactions" -H "Authorization: Bearer YOUR_TOKEN"'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Performance Optimale',
      description: 'API ultra-rapide avec latence < 50ms'
    },
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Authentification JWT et rate limiting'
    },
    {
      icon: Database,
      title: 'Données Temps Réel',
      description: 'Mise à jour en temps réel des prix crypto'
    },
    {
      icon: Globe,
      title: 'Disponibilité 99.9%',
      description: 'Infrastructure haute disponibilité'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center mr-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              API Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Intégrez CryptoBoost dans vos applications avec notre API RESTful complète. 
            Accédez aux données de trading, gérez les investissements et plus encore.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 rounded-lg group-hover:from-crypto-primary/20 group-hover:to-crypto-secondary/20 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-crypto-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-crypto-primary" />
                <CardTitle>Authentification</CardTitle>
              </div>
              <CardDescription>
                Toutes les requêtes API nécessitent une authentification via token JWT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Header d'authentification :</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_JWT_TOKEN', 'auth')}
                  >
                    {copied === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <code className="text-foreground">Authorization: Bearer YOUR_JWT_TOKEN</code>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Endpoints Principaux</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                    >
                      {copied === `endpoint-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                  <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                    <code>{endpoint.example}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <CardTitle>Limites de Taux</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-crypto-primary">1000</div>
                  <div className="text-sm text-muted-foreground">Requêtes par heure</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-crypto-primary">10</div>
                  <div className="text-sm text-muted-foreground">Requêtes par seconde</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-crypto-primary">50ms</div>
                  <div className="text-sm text-muted-foreground">Latence moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SDKs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">SDKs Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'JavaScript', version: 'v2.1.0', color: 'bg-yellow-100 text-yellow-700' },
              { name: 'Python', version: 'v1.8.0', color: 'bg-blue-100 text-blue-700' },
              { name: 'PHP', version: 'v1.5.0', color: 'bg-purple-100 text-purple-700' },
              { name: 'Go', version: 'v1.2.0', color: 'bg-cyan-100 text-cyan-700' }
            ].map((sdk, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${sdk.color}`}>
                    {sdk.name}
                  </div>
                  <p className="text-sm text-muted-foreground">{sdk.version}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
              <p className="text-muted-foreground mb-6">
                Obtenez votre clé API et commencez à intégrer CryptoBoost dans vos applications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                  Obtenir une Clé API
                </Button>
                <Button variant="outline" size="lg">
                  Documentation Complète
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};