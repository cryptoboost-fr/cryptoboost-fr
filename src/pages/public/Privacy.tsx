import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const Privacy = () => {
  const sections = [
    {
      title: 'Collecte des Données',
      content: `Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse email, et informations de paiement. Nous collectons également automatiquement certaines informations techniques lors de votre utilisation de nos services.`
    },
    {
      title: 'Utilisation des Données',
      content: `Nous utilisons vos données pour fournir nos services, traiter vos transactions, améliorer nos services, et communiquer avec vous. Nous ne vendons jamais vos données personnelles à des tiers.`
    },
    {
      title: 'Protection des Données',
      content: `Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.`
    },
    {
      title: 'Partage des Données',
      content: `Nous ne partageons vos données personnelles qu'avec votre consentement ou lorsque la loi l'exige. Nous pouvons partager des données avec nos prestataires de services qui nous aident à fournir nos services.`
    },
    {
      title: 'Vos Droits',
      content: `Vous avez le droit d'accéder, de corriger, de supprimer vos données personnelles, et de vous opposer à leur traitement. Vous pouvez exercer ces droits en nous contactant.`
    },
    {
      title: 'Cookies',
      content: `Nous utilisons des cookies pour améliorer votre expérience utilisateur, analyser l'utilisation de notre site, et personnaliser le contenu. Vous pouvez contrôler l'utilisation des cookies dans les paramètres de votre navigateur.`
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dernière mise à jour : 10 Août 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {sections.map((section, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;