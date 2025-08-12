import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Server,
  Database,
  Globe,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export const Status = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      name: 'Application Web',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      icon: Globe,
      description: 'Interface utilisateur principale'
    },
    {
      name: 'API REST',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '23ms',
      icon: Server,
      description: 'API de trading et investissements'
    },
    {
      name: 'Base de Données',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '12ms',
      icon: Database,
      description: 'Stockage des données utilisateurs'
    },
    {
      name: 'Authentification',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '67ms',
      icon: Zap,
      description: 'Système de connexion sécurisé'
    },
    {
      name: 'Trading Engine',
      status: 'operational',
      uptime: '99.94%',
      responseTime: '89ms',
      icon: TrendingUp,
      description: 'Moteur de trading automatisé'
    },
    {
      name: 'Notifications',
      status: 'operational',
      uptime: '99.96%',
      responseTime: '34ms',
      icon: Users,
      description: 'Système de notifications'
    }
  ];

  const incidents = [
    {
      date: '2024-01-15',
      title: 'Maintenance planifiée - API Trading',
      status: 'resolved',
      description: 'Maintenance de routine pour optimiser les performances du moteur de trading.',
      duration: '30 minutes'
    },
    {
      date: '2024-01-10',
      title: 'Mise à jour de sécurité',
      status: 'resolved',
      description: 'Déploiement de mises à jour de sécurité importantes.',
      duration: '15 minutes'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />;
      case 'outage':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'operational' 
    : 'degraded';

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
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Statut des Services
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Surveillez en temps réel l&apos;état de tous nos services et infrastructures
          </p>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Statut Global</h2>
                  <p className="text-muted-foreground">
                    Dernière mise à jour : {currentTime.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(overallStatus)}`}>
                    {getStatusIcon(overallStatus)}
                    <span className="font-semibold">
                      {overallStatus === 'operational' ? 'Tous les services opérationnels' : 'Service dégradé'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 rounded-lg group-hover:from-crypto-primary/20 group-hover:to-crypto-secondary/20 transition-all duration-300">
                        <service.icon className="w-5 h-5 text-crypto-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span>
                        {service.status === 'operational' ? 'Opérationnel' : 
                         service.status === 'degraded' ? 'Dégradé' : 'Panne'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-semibold text-green-600">{service.uptime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temps de réponse</p>
                      <p className="font-semibold">{service.responseTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Métriques de Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Uptime Global', value: '99.97%', icon: Activity, color: 'text-green-600' },
              { label: 'Utilisateurs Actifs', value: '12,847', icon: Users, color: 'text-blue-600' },
              { label: 'Transactions/jour', value: '45,231', icon: TrendingUp, color: 'text-purple-600' },
              { label: 'Temps de réponse moyen', value: '45ms', icon: Clock, color: 'text-orange-600' }
            ].map((metric, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`inline-block p-3 rounded-full mb-4 bg-muted group-hover:bg-muted/80 transition-all duration-300`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{metric.label}</h3>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Incidents Récents</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {incidents.map((incident, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident.status)}`}>
                          {getStatusIcon(incident.status)}
                          <span>
                            {incident.status === 'resolved' ? 'Résolu' : 'En cours'}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{incident.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{incident.title}</h3>
                      <p className="text-muted-foreground mb-3">{incident.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-semibold">{incident.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Subscribe to Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Restez Informé</h3>
              <p className="text-muted-foreground mb-6">
                Recevez des notifications en temps réel sur l&apos;état de nos services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-crypto-primary to-crypto-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  S&apos;abonner
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};